# Zuri API Gateway & Backend Verified Contract Audit

This document contains verified findings from direct source code inspection of the Zuri backend repository located at `c:\Users\USER\Desktop\VScodes\Backend_zuri.ed-main`. Every item includes exact `file:line` citations. No details are guessed.

---

## 1. Exact Registered Gateway Paths (Hyphens vs. Underscores)

All endpoints at the API Gateway (`services/gateway/internal/handler/gateway_handler.go`) and downstream services use **hyphens** (`-`), not underscores (`_`).

| Feature | Registered Gateway Path | HTTP Method | Gateway Registration Evidence | Downstream Microservice Registration Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **verify-email** | `/api/v1/auth/verify-email` | `POST` | [`services/gateway/internal/handler/gateway_handler.go:50`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/handler/gateway_handler.go#L50) | [`services/user/cmd/main.go:202`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/cmd/main.go#L202) |
| **resend-verification** | `/api/v1/auth/resend-verification` | `POST` | [`services/gateway/internal/handler/gateway_handler.go:51`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/handler/gateway_handler.go#L51) | [`services/user/cmd/main.go:203`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/cmd/main.go#L203) |
| **logout** | `/api/v1/auth/logout` | `POST` | [`services/gateway/internal/handler/gateway_handler.go:75`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/handler/gateway_handler.go#L75) | [`services/user/cmd/main.go:214`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/cmd/main.go#L214) |
| **logout-all** | `/api/v1/auth/logout-all` | `POST` | [`services/gateway/internal/handler/gateway_handler.go:76`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/handler/gateway_handler.go#L76) | [`services/user/cmd/main.go:215`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/cmd/main.go#L215) |
| **change-password** | `/api/v1/users/me/change-password` | `POST` | [`services/gateway/internal/handler/gateway_handler.go:79`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/handler/gateway_handler.go#L79) | [`services/user/cmd/main.go:220`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/cmd/main.go#L220) |
| **switch-institution** | `/api/v1/users/me/switch-institution` | `POST` | [`services/gateway/internal/handler/gateway_handler.go:84`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/handler/gateway_handler.go#L84) | [`services/user/cmd/main.go:225`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/cmd/main.go#L225) |
| **quiz-attempts** | `/api/v1/quiz-attempts`<br>`/api/v1/quiz-attempts/:id`<br>`/api/v1/quiz-attempts/:id/answers`<br>`/api/v1/quiz-attempts/:id/complete` | `GET`<br>`GET`<br>`POST`<br>`POST` | [`services/gateway/internal/handler/gateway_handler.go:129-132`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/handler/gateway_handler.go#L129-L132) | [`services/analytics/cmd/main.go:98-102`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/analytics/cmd/main.go#L98-L102) |
| **flashcard-decks** | `/api/v1/flashcard-decks`<br>`/api/v1/flashcard-decks/:id` | `GET`, `POST`<br>`GET` | [`services/gateway/internal/handler/gateway_handler.go:108-110`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/handler/gateway_handler.go#L108-L110) | [`services/content/cmd/main.go:180-182`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/content/cmd/main.go#L180-L182) |
| **analytics ai-usage** | `/api/v1/analytics/ai-usage` | `GET` | [`services/gateway/internal/handler/gateway_handler.go:124`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/handler/gateway_handler.go#L124) | [`services/analytics/cmd/main.go:121`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/analytics/cmd/main.go#L121) |
| **analytics topic-mastery** | `/api/v1/analytics/topic-mastery` | `GET` | [`services/gateway/internal/handler/gateway_handler.go:116`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/handler/gateway_handler.go#L116) | [`services/analytics/cmd/main.go:110`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/analytics/cmd/main.go#L110) |
| **material-upload webhook** | `/api/v1/webhooks/material-uploaded` | `POST` | [`services/gateway/internal/handler/gateway_handler.go:99`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/handler/gateway_handler.go#L99) | [`services/content/cmd/main.go:174`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/content/cmd/main.go#L174) |

---

## 2. Refresh-Token Rotation & Revocation Behavior

### A. Reuse Grace Window
* **Grace Window**: **NONE (0 seconds)**.
* **Evidence**:
  - In [`services/user/internal/service/user_service.go:606-608`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L606-L608):
    ```go
    // Check if token is valid
    if !storedToken.CanBeUsed() {
        return nil, echo.NewHTTPError(http.StatusUnauthorized, "refresh token expired or revoked")
    }
    ```
  - In [`services/user/internal/model/user.go:107-114`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/model/user.go#L107-L114):
    ```go
    func (rt *RefreshToken) IsRevoked() bool {
        return rt.Revoked || rt.RevokedAt != nil
    }
    func (rt *RefreshToken) CanBeUsed() bool {
        return !rt.IsExpired() && !rt.IsRevoked()
    }
    ```
  - Once a refresh token is rotated (where `rt.Revoked = true` and `rt.RevokedAt` is set at [`services/user/internal/repository/refresh_token_repository.go:77-84`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/repository/refresh_token_repository.go#L77-L84)), `CanBeUsed()` immediately returns `false` with no grace period.

### B. What Triggers Revoke-All (`RevokeAllForUser`)
In the code, refresh token reuse does **NOT** trigger `RevokeAllForUser`; it simply rejects the request with HTTP `401 Unauthorized` ("refresh token expired or revoked") at [`services/user/internal/service/user_service.go:607`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L607).

The specific events in the backend that **actually trigger** `RevokeAllForUser` are:
1. **User Logout (`POST /api/v1/auth/logout` or `POST /api/v1/auth/logout-all`)**:
   [`services/user/internal/service/user_service.go:691-697`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L691-L697) calls `s.refreshTokenRepo.RevokeAllForUser(ctx, id)` and `s.sessionRepo.RevokeAllForUser(ctx, id, nil)`.
2. **Password Change (`POST /api/v1/users/me/change-password`)**:
   [`services/user/internal/service/user_service.go:802`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L802) calls `s.refreshTokenRepo.RevokeAllForUser(ctx, id)`.
3. **Password Reset (`POST /api/v1/auth/reset-password`)**:
   [`services/user/internal/service/user_service.go:896`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L896) calls `s.refreshTokenRepo.RevokeAllForUser(ctx, reset.UserID)`.

---

## 3. Gateway Mapping of JWT Roles to `X-User-Role`

* **Mapping Behavior**: **PASSED THROUGH AS-IS (NOT collapsed to "admin")**.
* **Evidence**:
  1. In JWT Middleware ([`services/gateway/internal/middleware/jwt.go:171`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/middleware/jwt.go#L171)):
     ```go
     c.Set("role", claims.Role)
     ```
  2. In Reverse Proxy header injection ([`services/gateway/internal/proxy/reverse_proxy.go:108-112`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/proxy/reverse_proxy.go#L108-L112)):
     ```go
     if role := c.Get("role"); role != nil {
         if roleStr, ok := role.(string); ok && roleStr != "" {
             req.Header.Set("X-User-Role", roleStr)
         }
     }
     ```
* Whatever role string exists in the JWT token claim `role` (`institution_admin`, `department_admin`, `lecturer`, `student`, `super_admin`) is directly written into the downstream HTTP header `X-User-Role`.

---

## 4. Academic Service Existence & Registered Routes

* **Does it exist?**: **YES**.
  - Implemented as a Python FastAPI service located at [`academic_service/`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/).
  - Entry point: [`academic_service/cmd/main.py:50-55`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L50-L55).
  - Port: Runs on port **`8086`** by default (`uvicorn.run(..., port=int(os.getenv("PORT", "8086")))` at [`academic_service/cmd/main.py:514`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L514)).
  - Upstream gateway mapping: [`services/gateway/internal/handler/gateway_handler.go:208, 250-254`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/handler/gateway_handler.go#L208).

### Routes Registered in `academic_service/cmd/main.py`

| Method | Registered Route | Handler Function | Source Evidence |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | `root` | [`academic_service/cmd/main.py:72`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L72) |
| `GET` | `/health` | `health` | [`academic_service/cmd/main.py:82`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L82) |
| `GET` | `/api/v1/academic/institutions/{institution_id}/hierarchy` | `get_institution_hierarchy` | [`academic_service/cmd/main.py:91`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L91) |
| `GET` | `/api/v1/academic/courses` | `get_enrolled_courses` | [`academic_service/cmd/main.py:107`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L107) |
| `GET` | `/api/v1/academic/courses/{course_id}` | `get_course_detail` | [`academic_service/cmd/main.py:116`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L116) |
| `POST` | `/api/v1/academic/courses/enroll` | `enroll_course` | [`academic_service/cmd/main.py:129`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L129) |
| `POST` | `/api/v1/academic/enrollments` | `create_enrollment` | [`academic_service/cmd/main.py:143`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L143) |
| `GET` | `/api/v1/academic/offerings` | `list_course_offerings` | [`academic_service/cmd/main.py:162`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L162) |
| `GET` | `/api/v1/academic/timetable` | `get_timetable` | [`academic_service/cmd/main.py:176`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L176) |
| `GET` | `/api/v1/academic/timetable/next` | `get_next_class` | [`academic_service/cmd/main.py:185`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L185) |
| `GET` | `/api/v1/academic/timetable/sessions` | `get_upcoming_sessions` | [`academic_service/cmd/main.py:194`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L194) |
| `POST` | `/api/v1/academic/timetable/slots` | `create_timetable_slot` | [`academic_service/cmd/main.py:212`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L212) |
| `GET` | `/api/v1/academic/context-gaps` | `get_context_gaps` | [`academic_service/cmd/main.py:225`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L225) |
| `POST` | `/api/v1/academic/context-gaps/{gap_id}/resolve` | `resolve_context_gap` | [`academic_service/cmd/main.py:234`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L234) |
| `POST` | `/api/v1/academic/seed` | `trigger_seed` | [`academic_service/cmd/main.py:247`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L247) |
| `POST` | `/api/v1/academic/learning-signals` | `record_learning_signal` | [`academic_service/cmd/main.py:270`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L270) |
| `GET` | `/api/v1/academic/courses/{course_id}/knowledge-state` | `get_course_knowledge_state` | [`academic_service/cmd/main.py:286`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L286) |
| `GET` | `/api/v1/academic/courses/{course_id}/weak-topics` | `get_weak_topics` | [`academic_service/cmd/main.py:299`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L299) |
| `GET` | `/api/v1/academic/courses/{course_id}/lecturer-signals` | `get_lecturer_class_signals` | [`academic_service/cmd/main.py:310`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L310) |
| `GET` | `/api/v1/academic/today` | `get_today_timeline` | [`academic_service/cmd/main.py:340`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L340) |
| `POST` | `/api/v1/academic/today/interventions/{intervention_id}/act` | `act_on_timeline_card` | [`academic_service/cmd/main.py:353`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L353) |
| `POST` | `/api/v1/academic/today/interventions/{intervention_id}/dismiss` | `dismiss_timeline_card` | [`academic_service/cmd/main.py:363`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L363) |
| `POST` | `/api/v1/academic/today/events/dispatch` | `dispatch_academic_event` | [`academic_service/cmd/main.py:373`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L373) |
| `POST` | `/api/v1/academic/courses/{course_id}/partner/chat` | `course_partner_chat` | [`academic_service/cmd/main.py:404`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L404) |
| `GET` | `/api/v1/academic/courses/{course_id}/partner/history` | `get_course_partner_history` | [`academic_service/cmd/main.py:425`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L425) |
| `POST` | `/api/v1/academic/courses/{course_id}/lectures/{lecture_id}/ingest` | `ingest_lecture_materials` | [`academic_service/cmd/main.py:448`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L448) |
| `POST` | `/api/v1/academic/today/events/notify` | `trigger_proactive_notifications` | [`academic_service/cmd/main.py:479`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L479) |

---

## 5. What `GET /api/v1/courses` Returns for `institution_admin`

* **Return scope**: **Only their own enrolled/created courses, NOT all courses in the institution**.
* **Evidence**:
  1. Routed to Content Service: [`services/gateway/internal/handler/gateway_handler.go:87`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/handler/gateway_handler.go#L87).
  2. Handled by `GetUserCourses`: [`services/content/internal/handler/course_handler.go:82-95`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/content/internal/handler/course_handler.go#L82-L95):
     ```go
     userID, err := getUserID(c)
     ...
     courses, err := h.service.GetUserCourses(c.Request().Context(), userID)
     ```
  3. Service & Repository implementation:
     - [`services/content/internal/service/content_service.go:286-288`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/content/internal/service/content_service.go#L286-L288):
       ```go
       func (s *contentService) GetUserCourses(ctx context.Context, userID uuid.UUID) ([]model.Course, error) {
           return s.courseRepo.GetByUserID(ctx, userID)
       }
       ```
     - [`services/content/internal/repository/course_repository.go:59-66`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/content/internal/repository/course_repository.go#L59-L66):
       ```go
       func (r *courseRepository) GetByUserID(ctx context.Context, userID uuid.UUID) ([]model.Course, error) {
           var courses []model.Course
           err := r.db.DB.WithContext(ctx).
               Where("user_id = ?", userID).
               Order("created_at DESC").
               Find(&courses).Error
           return courses, err
       }
       ```
  4. There is no check on `X-User-Role`, no bypass for `institution_admin`, and no query parameter for `institution_id`. The query is strictly scoped to `user_id = ?`.

---

## 6. Institution-Scoped List Endpoints (Students, Staff, Roles, Audit Logs)

Inspection across all Gateway, User, Content, Analytics, and Academic services reveals:

* **Institution-scoped Students list endpoint**: **NOT FOUND**.
* **Institution-scoped Staff / Lecturers list endpoint**: **NOT FOUND**.
* **Institution-scoped Roles / Permissions list endpoint**: **NOT FOUND**.
* **Institution-scoped Audit Logs list endpoint**: **NOT FOUND**.

### Findings & Context
- The only institution-scoped query endpoints present in the entire backend are:
  1. `GET /api/v1/academic/institutions/{institution_id}/hierarchy` ([`academic_service/cmd/main.py:91`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L91)) — returns faculties, departments, and degree programs.
  2. `GET /api/v1/academic/offerings?institution_id={id}` ([`academic_service/cmd/main.py:162`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/cmd/main.py#L162)) — returns course offering sections.
- An ORM model `AuditLog` exists in the database schema (`academic_service/models/orm.py:459-478`), but **no HTTP handler or route** is registered in any service to query or list it.
- In `services/user`, only caller-scoped endpoints exist: `/api/v1/users/me`, `/api/v1/users/me/memberships`, `/api/v1/users/me/sessions` ([`services/user/cmd/main.go:218-229`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/cmd/main.go#L218-L229)).

---

## 7. Tables and Columns Recording Intervention Events, Quiz Attempts, and AI Interactions

### A. Intervention Act / Dismiss Events
* **Table**: `academic.proactive_interventions`
  - **Source Definition**: [`academic_service/models/orm.py:367-387`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/models/orm.py#L367-L387)
  - **Columns**:
    - `id` (`VARCHAR`, PK)
    - `user_id` (`VARCHAR`, indexed)
    - `course_id` (`VARCHAR`, FK `academic.courses.id`, nullable)
    - `event_type` (`VARCHAR`, e.g. `'CLASS_APPROACHING'`, `'GAP_DETECTED'`)
    - `card_type` (`VARCHAR`, e.g. `'class_countdown'`, `'pre_class_prep'`, `'practice_gap'`)
    - `title` (`VARCHAR`)
    - `payload` (`JSON`)
    - `is_dismissed` (`BOOLEAN`, default `false`) — set to `true` when user calls `/dismiss`
    - `is_acted_upon` (`BOOLEAN`, default `false`) — set to `true` when user calls `/act`
    - `delivered_at` (`TIMESTAMP WITH TIME ZONE`)
* **Related Atomic Learning Signals Table**: `academic.learning_signals`
  - **Source Definition**: [`academic_service/models/orm.py:304-325`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/models/orm.py#L304-L325)
  - **Columns**: `id`, `user_id`, `course_id`, `topic`, `subtopic`, `signal_type`, `score`, `max_score`, `latency_ms`, `confidence_level`, `raw_details`, `created_at`.

### B. Quiz Attempts
* **Table**: `zuri_analytics.quiz_attempts`
  - **Source Definition**: [`services/analytics/internal/model/analytics.go:20-40`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/analytics/internal/model/analytics.go#L20-L40)
  - **Columns**:
    - `id` (`UUID`, PK)
    - `user_id` (`UUID`, not null, indexed)
    - `quiz_id` (`UUID`, not null, indexed)
    - `started_at` (`TIMESTAMP`, default `CURRENT_TIMESTAMP`)
    - `completed_at` (`TIMESTAMP`, nullable)
    - `score` (`INTEGER`, nullable)
    - `max_score` (`INTEGER`, nullable)
    - `percentage` (`DECIMAL(5,2)`, nullable)
    - `time_taken_seconds` (`INTEGER`, nullable)
    - `status` (`VARCHAR(20)`, `'in_progress'`, `'completed'`, `'abandoned'`)
    - `created_at` (`TIMESTAMP`)
* **Quiz Question Answers Table**: `zuri_analytics.quiz_answers`
  - **Source Definition**: [`services/analytics/internal/model/analytics.go:42-58`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/analytics/internal/model/analytics.go#L42-L58)
  - **Columns**: `id`, `attempt_id` (`UUID`), `question_id` (`UUID`), `user_answer` (`TEXT`), `is_correct` (`BOOLEAN`), `similarity_score` (`DECIMAL(5,4)`), `points_earned` (`INTEGER`), `time_taken_seconds` (`INTEGER`), `created_at` (`TIMESTAMP`).

### C. AI Interactions
* **Table**: `zuri_analytics.ai_interactions`
  - **Source Definition**: [`services/analytics/internal/model/analytics.go:108-127`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/analytics/internal/model/analytics.go#L108-L127)
  - **Columns**:
    - `id` (`UUID`, PK)
    - `user_id` (`UUID`, not null, indexed)
    - `interaction_type` (`VARCHAR(50)`, e.g. `'quiz_generation'`, `'summary'`, `'flashcard'`, `'chat'`)
    - `material_id` (`UUID`, nullable)
    - `prompt_tokens` (`INTEGER`, default `0`)
    - `completion_tokens` (`INTEGER`, default `0`)
    - `total_tokens` (`INTEGER`, default `0`)
    - `latency_ms` (`INTEGER`, nullable)
    - `success` (`BOOLEAN`, default `true`)
    - `error_message` (`TEXT`, nullable)
    - `model` (`VARCHAR(50)`, nullable)
    - `created_at` (`TIMESTAMP`)
* **Course Partner Conversational Turns Table**: `academic.partner_conversations`
  - **Source Definition**: [`academic_service/models/orm.py:389-410`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/academic_service/models/orm.py#L389-L410)
  - **Columns**: `id`, `user_id`, `course_id`, `session_id`, `role`, `content`, `widget_type`, `widget_data`, `provenance_citations`, `created_at`.
* **Real-Time Cost Telemetry**:
  - Tracked in Redis via `UsageRecord` ([`services/gateway/internal/ai/cost_tracker.go:29-40`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/ai/cost_tracker.go#L29-L40)) with keys `ai:cost:<institution_id>:<period>` and `ai:cost:user:<user_id>:<period>`.

---

## 8. Password-Reset Token Storage (Local Development Fallback)

### Table & Column Details
* **Table**: `zuri_auth.password_resets`
  - **Source Definition**: [`services/user/internal/model/user.go:195-212`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/model/user.go#L195-L212)
  - **Columns**:
    - `id` (`UUID`, PK, `uuid_generate_v4()`)
    - `user_id` (`UUID`, not null, indexed)
    - `token_hash` (`VARCHAR(255)`, not null, indexed)
    - `expires_at` (`TIMESTAMP`, not null)
    - `used_at` (`TIMESTAMP`, nullable)
    - `used` (`BOOLEAN`, default `false`)
    - `created_at` (`TIMESTAMP`)

### Important Note on Plaintext Token Availability
* **Plaintext Token in Table**: **NOT STORED**.
  - In [`services/user/internal/service/user_service.go:832-845`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L832-L845):
    ```go
    resetTokenBytes := make([]byte, 32)
    rand.Read(resetTokenBytes)
    resetToken := hex.EncodeToString(resetTokenBytes)
    
    passwordReset := &model.PasswordReset{
        UserID:    user.ID,
        TokenHash: auth.HashRefreshToken(resetToken), // SHA-256 hash
        ExpiresAt: time.Now().Add(1 * time.Hour),
        Used:      false,
    }
    ```
  - The database stores **only** the SHA-256 hash (`TokenHash`). The raw 64-character hex `resetToken` is only forwarded to the notification service payload:
    ```go
    // services/user/internal/client/notification_client.go:50-61
    "body": fmt.Sprintf("Your password reset code is: %s", code)
    ```
  - **How to retrieve it locally**:
    1. Check Docker logs of `notification-service` or `user-service`:
       `docker logs -f <notification_service_container>`
    2. Or, in local testing / seed DB, compute the SHA-256 of a known test token (e.g. `sha256("test-token-123")`) and insert a row into `zuri_auth.password_resets` with `user_id = <target_user_uuid>`, `token_hash = <hex_sha256>`, `expires_at = NOW() + INTERVAL '1 hour'`, `used = false`.
