# Backend Integration Context

This document extracts the exact integration contract from the 7 backend specifications (`00` through `06`). It maps architectural gateway rules, token mechanics, response envelopes, endpoint usability for an Admin web app (`(institution)` and `(ops)` routes), and documented inconsistencies.

---

## 1. Gateway Rules (from Doc 00)

All client traffic routes through a single Go API Gateway (port `8080`). Direct microservice access is strictly prohibited.

* **Timeouts**:
  * Reverse Proxy Client Timeout: **120 seconds**. Standard CRUD requests complete in 15–80ms; heavy tasks (vector search, document summarization) take 3–25s.
  * If downstream services exceed 120s, the Gateway terminates the connection and returns **HTTP 504 Gateway Timeout**.
* **Circuit-Breaker Behavior (HTTP 503)**:
  * Each downstream service has an independent circuit breaker on the Gateway.
  * **Failure Threshold**: 3 consecutive server failures (`HTTP 500, 502, 503`, or connection drops) within a rolling window.
  * **Cooldown**: 60 seconds.
  * **Open State**: Gateway rejects requests immediately with **HTTP 503 Service Unavailable** without hitting the failing upstream service.
  * **Half-Open State**: After 60s, a single probe request is permitted. If successful, normal routing resumes.
  * *Client Rule*: Display a non-intrusive retry banner; never execute tight polling loops during 503 states.
* **Rate-Limit Headers**:
  * Every Gateway response provides rate-limiting headers:
    * `X-RateLimit-Limit` (written as `X RateLimit Limit` in spec): Maximum allowed requests in the 60-second window.
    * `X-RateLimit-Remaining` (written as `X RateLimit Remaining`): Requests remaining in current window.
    * `X-RateLimit-Reset` (written as `X RateLimit Reset`): Unix epoch timestamp in seconds when the window resets.
* **429 Behavior**:
  * Triggered when a rate limit is exceeded (or after 5 rapid failed login attempts).
  * Returns **HTTP 429 Too Many Requests** with a JSON body explaining the cooldown period. Clients must disable submit actions and observe the reset timer.
* **Per-User Limits**:
  * Sliding window enforced via Redis:
    * **Standard Endpoints**: 100 requests per minute per user.
    * **AI Endpoints**: 20 requests per minute per user.
* **Internal Context Injection**:
  * Gateway verifies RS256 JWT, strips hop-by-hop/auth secrets, and injects: `X-User-ID`, `X-User-Role` (`student`, `instructor`, `admin`, `super admin`), `X-Institution-ID`, `X-Token-ID`, and `X-Internal-Key`.

---

## 2. Token Lifecycle

* **Access Token**:
  * **TTL**: 15 minutes.
  * **Format**: RS256 asymmetric JWT. Claims: `user_id`, `email`, `role`, `institution_id`, `issued_at`, `expiration`, `jti`.
  * **Storage**: In-memory / private application state. Never in unencrypted `localStorage`.
* **Refresh Token**:
  * **TTL**: 30 days.
  * **Storage**: Secure storage or HTTP-only cookie.
* **Rotation**:
  * Every call to `POST /api/v1/auth/refresh` invalidates the submitted refresh token and issues a new access token paired with a new refresh token.
* **Reuse Detection**:
  * Submitting an already invalidated/reused refresh token triggers **instant token revocation across all active sessions** for that user.
* **Client Handling**:
  * Silently refresh if < 2 minutes remain on access token, or intercept HTTP 401, enqueue requests, refresh once, and replay.
  * HTTP 401/403 on refresh clears credentials and redirects to Sign In.
  * Unverified emails return **HTTP 403 Forbidden** with code `EMAIL_NOT_VERIFIED` and `user_id`.

---

## 3. Documented Envelope Shapes

### Success Envelopes
1. **Standard Data Object / Array**:
   ```json
   { "data": { ... } }
   ```
2. **Data with Status Message** (e.g., Register, Switch Institution):
   ```json
   { "data": { ... }, "message": "User registered successfully." }
   ```
3. **Message Only** (e.g., Forgot / Reset Password):
   ```json
   { "message": "Password reset successfully. You may now sign in." }
   ```
4. **Asynchronous Job Acceptance** (HTTP 202):
   ```json
   { "data": { "job_id": "job_reading_5510", "status": "queued", "estimated_seconds": 15 } }
   ```

### Error Envelopes
1. **Unverified Email (HTTP 403)**:
   ```json
   {
     "error": "Email verification required",
     "code": "EMAIL_NOT_VERIFIED",
     "message": "Please verify your email before logging in.",
     "user_id": "usr_963d3130"
   }
   ```
2. **Invalid Credentials (HTTP 401)**:
   Returns inline string/message `error: invalid email or password`.
3. **Conflict / Validation (HTTP 400 / 409)**:
   Returns `{ "message": "email already registered" }` or field-level validation errors.
4. **Rate Limited (HTTP 429)**:
   JSON body detailing cooldown duration alongside `X-RateLimit-*` headers.

### Real-Time & Streaming Envelopes
* **WebSocket Inbound Event**:
  `{ "event_id": "evt_99120", "type": "timetable_update", "timestamp": "2026/10/12 14:30:00 UTC", "payload": { ... } }`
* **SSE Stream Chunks (`POST /api/v1/ai/execute/stream`)**:
  * Token: `data: {"token": "..."}`
  * Citation: `data: {"source": "...", "page": 4}`
  * Complete: `data: {"status": "complete", "total_tokens": 340}`

---

## 4. Endpoints Inventory & Admin App Usability

Target route groups: `(institution)` (campus management) and `(ops)` (platform operations).

| Method | Path (Exact from Specs) | Source Doc / Page | Usable by Admin App? | Why / Admin Context |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/refresh` | Doc 00, §3.2 | **Yes** | Required by all admin sessions to maintain authentication. |
| `GET` | `/api/v1/sync/state` | Doc 00, §4 | **Maybe** | Re-sync missed real-time events on reconnect; useful if admin subscribes to sync. |
| `WSS` | `/api/v1/ws` | Doc 00, §4 / Doc 06, §24 | **Maybe** | WebSocket connection for real-time alerts and background job completion. |
| `POST` | `/api/v1/auth/login` | Doc 01, Page 1 | **Yes** | Admin authentication entry point for staff and ops operators. |
| `POST` | `/api/v1/auth/register` | Doc 01, Page 2 | **No** | Self-serve student onboarding; admin accounts should be provisioned via ops/tenant invites. |
| `POST` | `/api/v1/auth/verify_email` | Doc 01, Page 3 | **Maybe** | Usable if admin invitations require email code confirmation. |
| `POST` | `/api/v1/auth/resend_verification` | Doc 01, Page 3 | **Maybe** | Resend verification code if admin onboarding uses code verification. |
| `POST` | `/api/v1/auth/forgot_password` | Doc 01, Page 4 | **Yes** | Standard credential recovery for admin staff. |
| `POST` | `/api/v1/auth/reset_password` | Doc 01, Page 4 | **Yes** | Completes password reset flow via deep link token. |
| `GET` | `/api/v1/users/me/memberships` | Doc 01, Page 5 | **Yes** | Lists institutional scopes available to an admin across campuses. |
| `POST` | `/api/v1/users/me/switch_institution` | Doc 01, Page 5 | **Yes** | Essential for multi-tenant admins and ops switching active campus context. |
| `GET` | `/api/v1/academic/today` | Doc 02, Page 6 | **No** | Student-specific personal schedule and AI prerequisite gap intervention feed. |
| `POST` | `/api/v1/academic/today/interventions/:id/act` | Doc 02, Page 6 | **No** | Resolves individual student study interventions. |
| `POST` | `/api/v1/academic/today/interventions/:id/dismiss` | Doc 02, Page 6 | **No** | Dismisses individual student study interventions. |
| `GET` | `/api/v1/analytics/study_streak` | Doc 02, Page 7 | **No** | Personal student gamification study streak. |
| `GET` | `/api/v1/analytics/study_stats` | Doc 02, Page 7 | **No** | Caller's personal study hours and quiz scores. |
| `GET` | `/api/v1/analytics/topic_mastery` | Doc 02, Page 7 | **No** | Caller's personal syllabus topic mastery breakdown. |
| `GET` | `/api/v1/analytics/ai_usage` | Doc 02, Page 7 | **Yes** | Monitor personal AI quota; potentially reused by ops to check tenant AI consumption. |
| `GET` | `/api/v1/academic/timetable` | Doc 02, Page 8 | **Maybe** | Returns weekly timetable; admin app could use it to view campus lecture schedules. |
| `GET` | `/api/v1/academic/timetable/next` | Doc 02, Page 8 | **No** | Personal countdown to caller's next lecture. |
| `POST` | `/api/v1/academic/timetable/slots` | Doc 02, Page 8 | **Maybe** | Defined for personal study slots; could back scheduling if shared across campus. |
| `GET` | `/api/v1/courses` | Doc 03, Page 9 | **Yes** | Lists courses; essential for institution admin course catalog view. |
| `POST` | `/api/v1/academic/courses/enroll` | Doc 03, Page 9 | **No** | Student self-enrollment into a course. |
| `GET` | `/api/v1/courses/:id` | Doc 03, Page 10 | **Yes** | View single course metadata and curriculum configuration. |
| `GET` | `/api/v1/academic/courses/:id/knowledge_state` | Doc 03, Page 10 | **Maybe** | In spec it returns caller's mastery; only usable if backend supports student query param. |
| `GET` | `/api/v1/academic/courses/:id/weak_topics` | Doc 03, Page 10 | **Maybe** | Scoped to caller's gaps; useful if aggregated at cohort level for admins. |
| `GET` | `/api/v1/academic/courses/:id/lecturer_signals` | Doc 03, Page 10 | **Yes** | Displays instructor emphasis weights and lecture focus notes. |
| `POST` | `/api/v1/materials` | Doc 03, Page 11 | **Yes** | Requests presigned URL to upload course materials and syllabus PDFs. |
| `PUT` | `[presigned_url]` | Doc 03, Page 11 | **Yes** | Direct binary upload of course slides/books to S3/MinIO. |
| `POST` | `/api/v1/webhooks/material_uploaded` | Doc 03, Page 11 | **Yes** | Confirms successful material upload to trigger parsing/embeddings. |
| `GET` | `/api/v1/materials/:id` | Doc 03, Page 12 | **Yes** | Monitor material ingestion, page counts, and vector readiness. |
| `GET` | `/api/v1/quizzes` | Doc 04, Page 13 | **Yes** | Lists quizzes for a course; needed for institution exam management. |
| `POST` | `/api/v1/ai/execute` | Doc 04, Page 13 | **Yes** | Generate quizzes from materials (`tool_name: "evaluation"`). |
| `POST` | `/api/v1/quizzes/:id/start` | Doc 04, Page 14 | **No** | Initiates active student exam attempt. |
| `POST` | `/api/v1/quiz_attempts/:attempt_id/answers` | Doc 04, Page 14 | **No** | Submits answer choices for an in-progress quiz. |
| `POST` | `/api/v1/quiz_attempts/:attempt_id/complete` | Doc 04, Page 14 | **No** | Completes and grades student quiz attempt. |
| `GET` | `/api/v1/quiz_attempts/:id` | Doc 04, Page 15 | **Maybe** | Scoped to attempt ID; useful if admin can review student attempt details. |
| `GET` | `/api/v1/flashcard_decks` | Doc 04, Page 16 | **Maybe** | Deck catalog; usable if admins curate course-wide study decks. |
| `GET` | `/api/v1/flashcard_decks/:id` | Doc 04, Page 16 | **Maybe** | View cards inside a deck. |
| `POST` | `/api/v1/academic/courses/:id/partner/chat` | Doc 05, Page 17 | **No** | Student course partner conversational chat session. |
| `GET` | `/api/v1/academic/courses/:id/partner/history` | Doc 05, Page 17 | **No** | Personal student chat history. |
| `POST` | `/api/v1/ai/execute/stream` | Doc 05, Page 18 | **Maybe** | Admin testing of LLM RAG pipelines and prompts. |
| `POST` | `/api/v1/ai/jobs` | Doc 05, Page 19 | **Maybe** | Triggers asynchronous document analysis and audio summary jobs. |
| `GET` | `/api/v1/ai/jobs/:id` | Doc 05, Page 19 | **Maybe** | Polls status of background AI jobs. |
| `POST` | `/api/v1/ai/execute` (TTS) | Doc 05, Page 19 | **No** | Student text-to-speech reading assistance. |
| `POST` | `/api/v1/ai/execute` (Audio) | Doc 05, Page 20 | **Maybe** | Audio transcription and summarization for lecture uploads. |
| `GET` | `/api/v1/users/me` | Doc 06, Page 21 | **Yes** | Fetches logged-in admin user profile. |
| `PUT` | `/api/v1/users/me` | Doc 06, Page 21 | **Yes** | Updates admin profile attributes. |
| `POST` | `/api/v1/users/me/change_password` | Doc 06, Page 21 | **Yes** | Changes admin account password. |
| `GET` | `/api/v1/users/me/sessions` | Doc 06, Page 22 | **Yes** | Audit active admin devices and login locations. |
| `DELETE` | `/api/v1/users/me/sessions/:id` | Doc 06, Page 22 | **Yes** | Revokes specific admin session. |
| `POST` | `/api/v1/auth/logout_all` | Doc 06, Page 22 | **Yes** | Global sign out and session invalidation. |
| `GET` | `/api/v1/notifications/preferences` | Doc 06, Page 23 | **Yes** | Admin notification settings. |
| `PUT` | `/api/v1/notifications/preferences` | Doc 06, Page 23 | **Yes** | Update admin notification preferences. |
| `POST` | `/api/v1/notifications/devices/register` | Doc 06, Page 23 | **Maybe** | Register browser push token for admin web app alerts. |

---

## 5. Inconsistencies Inside and Between Specs

### 1. Hyphen vs. Underscore in Endpoint Paths
* **Gateway Routing vs. Concrete Endpoints**:
  * In Doc 00 (§1.4), proxy prefixes are written with spaces/hyphens: `/api/v1/flashcard decks` and `/api/v1/quiz attempts`.
  * In Doc 04 (Pages 14–16), concrete paths use underscores: `/api/v1/quiz_attempts/:attempt_id/answers`, `/api/v1/quiz_attempts/:attempt_id/complete`, `/api/v1/quiz_attempts/:id`, `/api/v1/flashcard_decks`, and `/api/v1/flashcard_decks/:id`.
* **Auth & User Routes Use Underscores**:
  * Doc 01 & 06 use underscores throughout: `/verify_email`, `/resend_verification`, `/forgot_password`, `/reset_password`, `/switch_institution`, `/change_password`, `/logout_all`.
* **Analytics & Academic Routes Use Underscores**:
  * Doc 02 uses `/study_streak`, `/study_stats`, `/topic_mastery`, `/ai_usage`.
  * Doc 03 uses `/knowledge_state`, `/weak_topics`, `/lecturer_signals`, `/material_uploaded`.

### 2. Date and Timestamp Formats
* **Non-Standard Slash Format**:
  * Across all payload examples (Docs 01, 02, 04, 05, 06), timestamps are formatted as `YYYY/MM/DD HH:MM:SS UTC` (e.g., `"2026/10/12 12:15:00 UTC"`) and dates as `YYYY/MM/DD` (e.g., `"2026/10/12"`).
  * This violates standard ISO 8601 / RFC 3339 format (`YYYY-MM-DDTHH:MM:SSZ`).
* **Unix Epoch vs. Formatted String**:
  * Gateway headers in Doc 00 (§2.3) define `X RateLimit Reset` as a raw Unix epoch timestamp in seconds (integer), while response bodies use string timestamps with slashes.

### 3. Role Names and Access Scopes
* **Documented Roles**:
  * Doc 00 (§1.3) defines injected roles as `student`, `instructor`, `admin`, or `super admin` (contains space).
  * Doc 01 (Pages 1 & 5) only shows `"role": "student"`.
  * Doc 01 (Page 2) registration introduces `academic_level` (`undergraduate`, `postgraduate`, `faculty`), which is distinct from `role`.
  * Nowhere in Docs 00–06 are concrete payloads, permission claims, or endpoints defined for `admin`, `super admin`, or `institution_admin`.

### 4. Response Envelope Inconsistencies
* **Inconsistent Wrapping**:
  * `POST /login` (Doc 01, Page 1) wraps payload in `{ "data": { "access_token": "...", "user": { ... } } }`.
  * `POST /register` (Doc 01, Page 2) returns `{ "data": { ... }, "message": "..." }`.
  * `POST /verify_email` (Doc 01, Page 3) returns `{ "message": "...", "data": { ... } }`.
  * `POST /forgot_password` and `/reset_password` (Doc 01, Page 4) omit `"data"` entirely, returning only `{ "message": "..." }`.
  * `POST /switch_institution` (Doc 01, Page 5) returns `{ "data": { "access_token": "...", "refresh_token": "...", "active_institution_id": "..." }, "message": "..." }` — omitting `user`, `expires_at`, and `token_type` present in login.
  * `WS /api/v1/ws` (Doc 06, §24) uses `{ "event_id": "...", "type": "...", "timestamp": "...", "payload": { ... } }` instead of `"data"`.
* **Error Response Shape Variation**:
  * Doc 01 Page 1 provides a 4-field error: `{ "error": "...", "code": "EMAIL_NOT_VERIFIED", "message": "...", "user_id": "..." }`.
  * Invalid credentials error is described simply as `error: invalid email or password`.
  * Registration conflict is described as `{ "message": "email already registered" }`.
  * Field validation errors return unstructured field error maps without a unified envelope.

### 5. HTTP Header Formats (Spaces vs. Hyphens)
* Throughout all 7 docs, HTTP headers are formatted with spaces instead of standard RFC hyphens:
  * `Authorization Bearer ACCESS_TOKEN`
  * `Content Type application/json`
  * `X Correlation ID`, `X User ID`, `X User Role`, `X Institution ID`, `X Token ID`, `X Internal Key`
  * `X RateLimit Limit`, `X RateLimit Remaining`, `X RateLimit Reset`
  * Real HTTP implementations require hyphens (e.g., `Content-Type`, `X-RateLimit-Limit`).

### 6. Attribute and Key Naming Clashes
* **Verification Flag**:
  * User profile in login (Doc 01 Page 1) and `/users/me` (Doc 06 Page 21) uses `email_verified: true`.
  * Email verification response (Doc 01 Page 3) uses `is_verified: true`.
* **User Identifier**:
  * Doc 01 Page 1 & Doc 06 Page 21 use `id: "usr_963d3130"`.
  * Doc 01 Page 1 (error) & Doc 01 Page 3 use `user_id: "usr_963d3130"`.
  * Doc 02 Page 6 uses `student_id: "usr_963d3130"`.
* **Institution Identifiers**:
  * Login user object uses `institution_id: "inst_veritas"`.
  * Registration request uses `school: "Veritas University"`.
  * Membership list uses `institution_id` and `institution_name`.
  * Switch institution response uses `active_institution_id`.
  * Profile `/users/me` (Doc 06 Page 21) returns `school`, omitting `institution_id` completely.
* **Name Fields**:
  * Registration and Login return `first_name`, `last_name`, and `full_name`.
  * Profile `/users/me` returns `first_name` and `last_name`, omitting `full_name`.

### 7. Service Boundary and Route Mappings
* **Webhook Route**:
  * Doc 03 Page 11 specifies `POST /api/v1/webhooks/material_uploaded`. Doc 00 §1.4 does not register `/api/v1/webhooks` under any gateway routing prefix.
* **Course vs. Academic Fragmentation**:
  * Course catalogs and metadata route through Content Service via `/api/v1/courses` and `/api/v1/courses/:id`.
  * Course enrollment and learning state route through Academic Service via `/api/v1/academic/courses/enroll`, `/api/v1/academic/courses/:id/knowledge_state`, and `/api/v1/academic/courses/:id/partner/chat`.
* **WebSocket Protocols**:
  * Doc 00 §4 specifies `wss://localhost:8080/api/v1/ws`.
  * Doc 06 §24 specifies `ws://localhost:8080/api/v1/ws`.
