Viewed auth_handler.go:1-100
Viewed auth_handler.go:101-170
Viewed user_service.go:120-200
Viewed user_service.go:480-560
Viewed user_service.go:561-600
Viewed user.go:1-60
Viewed user_service.go:590-670
Listed directory model
Viewed user.go:61-287
Viewed auth_handler.go:270-330
Viewed user_service.go:1030-1070
Searched for "GetPublicKey"
Searched for "GetPublicKey"
Viewed user_service.go:970-995
Searched for "BEGIN PUBLIC KEY"
Listed directory auth
Viewed auth.go:270-358
Viewed user_handler.go:1-100
Viewed user_handler.go:101-135
Viewed user_handler.go:180-225
Searched for "HTTPError"
Searched for "HTTPErrorHandler"
Viewed auth.go:35-105
Searched for "ALLOWED_ORIGINS"
Viewed main.go:70-110
Searched for "DefaultCORSConfig"
Viewed cors.go:1-60
Viewed cors.go:61-84
Searched for "Cookie"
Searched for "Cookie"
Viewed jwt.go:110-170

# API Gateway & Authentication Contract Audit

This document details the exact API contract for authenticating a Next.js client against the Zuri backend via the API Gateway. All details are derived directly from source code inspection.

---

### 1. `POST /api/v1/auth/login`

* **Route Registration**: [`services/gateway/internal/handler/gateway_handler.go:48`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/handler/gateway_handler.go#L48) & [`services/user/cmd/main.go:200`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/cmd/main.go#L200)
* **Handler**: [`services/user/internal/handler/auth_handler.go:99-139`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/auth_handler.go#L99-L139)
* **Service Method**: [`services/user/internal/service/user_service.go:505-529`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L505-L529)

#### Request Body
Defined in [`services/user/internal/handler/auth_handler.go:39-42`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/auth_handler.go#L39-L42):
```json
{
  "email": "user@example.com",
  "password": "UserPassword123!"
}
```

#### Response Body (200 OK)
Envelope constructed in [`services/user/internal/handler/auth_handler.go:136-138`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/auth_handler.go#L136-L138), DTO in [`services/user/internal/service/user_service.go:129-151`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L129-L151):
```json
{
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIs...",
    "refresh_token": "a4f8c...",
    "token_type": "Bearer",
    "expires_at": "2026-10-10T17:20:00.000Z",
    "user": {
      "id": "c1f7b...",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "full_name": "John Doe",
      "school": "MIT",
      "department": "Computer Science",
      "academic_level": "undergraduate",
      "timezone": "UTC",
      "email_verified": true,
      "role": "student",
      "created_at": "2026-10-10T16:00:00.000Z"
    }
  }
}
```

#### Unverified Email Error (403 Forbidden)
Defined in [`services/user/internal/handler/auth_handler.go:126-131`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/auth_handler.go#L126-L131):
```json
{
  "error": "Email verification required",
  "code": "EMAIL_NOT_VERIFIED",
  "message": "Please verify your email before logging in.",
  "user_id": "c1f7b..."
}
```

* **Must-Change-Password or First-Login Flag**: **NOT FOUND**. The `User` struct ([`services/user/internal/model/user.go:15-38`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/model/user.go#L15-L38)) and DTOs do not contain any `must_change_password` or `first_login` flags.

---

### 2. `POST /api/v1/auth/refresh`

* **Route Registration**: [`services/gateway/internal/handler/gateway_handler.go:49`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/handler/gateway_handler.go#L49) & [`services/user/cmd/main.go:201`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/cmd/main.go#L201)
* **Handler**: [`services/user/internal/handler/auth_handler.go:142-167`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/auth_handler.go#L142-L167)
* **Service Implementation**: [`services/user/internal/service/user_service.go:591-640`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L591-L640)

#### Request Body
Defined in [`services/user/internal/handler/auth_handler.go:45-47`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/auth_handler.go#L45-L47):
```json
{
  "refresh_token": "a4f8c..."
}
```

#### Response Body (200 OK)
Identical DTO shape to `Login` ([`services/user/internal/handler/auth_handler.go:164-166`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/auth_handler.go#L164-L166)):
```json
{
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIs...",
    "refresh_token": "b9d1e...",
    "token_type": "Bearer",
    "expires_at": "2026-10-10T17:20:00.000Z",
    "user": {
      "id": "c1f7b...",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "full_name": "John Doe",
      "email_verified": true,
      "role": "student",
      "created_at": "2026-10-10T16:00:00.000Z"
    }
  }
}
```

#### How Rotation Works
1. Incoming token is hashed using SHA-256 (`auth.HashRefreshToken(refreshToken)`) at [`services/user/internal/service/user_service.go:593`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L593).
2. The system checks stored token status via `storedToken.CanBeUsed()` at [`services/user/internal/service/user_service.go:606`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L606).
3. A brand-new token pair and DB record are created via `s.createTokenPair()` ([`user_service.go:621`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L621)).
4. The old refresh token record in Postgres is revoked (`Revoked = true`, `RevokedAt = NOW()`) and updated with `ReplacedByTokenID` pointing to the new token ID ([`user_service.go:634`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L634)).

#### Reuse Behavior
If a revoked or expired token is reused, `storedToken.CanBeUsed()` ([`services/user/internal/model/user.go:111-114`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/model/user.go#L111-L114)) evaluates to `false`. The endpoint rejects the request with HTTP `401 Unauthorized`:
```json
{
  "message": "refresh token expired or revoked"
}
```
([`services/user/internal/service/user_service.go:607`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L607))

---

### 3. `GET /api/v1/auth/public-key`

* **Route Registration**: [`services/gateway/internal/handler/gateway_handler.go:54`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/handler/gateway_handler.go#L54) & [`services/user/cmd/main.go:206`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/cmd/main.go#L206)
* **Handler**: [`services/user/internal/handler/auth_handler.go:318-333`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/auth_handler.go#L318-L333)
* **Key Encoding**: PEM string generated by [`shared/pkg/auth/auth.go:323-334`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/shared/pkg/auth/auth.go#L323-L334)

#### Response Format (200 OK)
The endpoint returns an **RSA PKIX Public Key encoded in PEM format**, wrapped in a JSON object envelope:
```json
{
  "data": {
    "public_key": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...\n-----END PUBLIC KEY-----\n"
  }
}
```
([`services/user/internal/handler/auth_handler.go:328-332`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/auth_handler.go#L328-L332))

---

### 4. Password Management Endpoints

#### A. `POST /api/v1/users/me/change-password` (Protected)
* **Route**: [`services/gateway/internal/handler/gateway_handler.go:79`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/handler/gateway_handler.go#L79) & [`services/user/cmd/main.go:220`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/cmd/main.go#L220)
* **Handler**: [`services/user/internal/handler/user_handler.go:94-124`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/user_handler.go#L94-L124)
* **Request Body** ([`user_handler.go:31-35`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/user_handler.go#L31-L35)):
  ```json
  {
    "current_password": "OldPassword123!",
    "new_password": "NewSecurePassword456!"
  }
  ```
* **Response Body (200 OK)** ([`user_handler.go:121-123`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/user_handler.go#L121-L123)):
  ```json
  {
    "message": "Password changed successfully. Please log in again with your new password."
  }
  ```

#### B. `POST /api/v1/auth/forgot-password` (Public)
* **Route**: [`services/gateway/internal/handler/gateway_handler.go:52`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/handler/gateway_handler.go#L52) & [`services/user/cmd/main.go:204`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/cmd/main.go#L204)
* **Handler**: [`services/user/internal/handler/auth_handler.go:273-294`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/auth_handler.go#L273-L294)
* **Request Body** ([`auth_handler.go:54-57`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/auth_handler.go#L54-L57)):
  ```json
  {
    "email": "user@example.com"
  }
  ```
* **Response Body (200 OK)** ([`auth_handler.go:291-293`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/auth_handler.go#L291-L293)):
  ```json
  {
    "message": "If the email exists, a password reset link has been sent"
  }
  ```

#### C. `POST /api/v1/auth/reset-password` (Public)
* **Route**: [`services/gateway/internal/handler/gateway_handler.go:53`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/handler/gateway_handler.go#L53) & [`services/user/cmd/main.go:205`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/cmd/main.go#L205)
* **Handler**: [`services/user/internal/handler/auth_handler.go:296-316`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/auth_handler.go#L296-L316)
* **Request Body** ([`auth_handler.go:59-63`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/auth_handler.go#L59-L63)):
  ```json
  {
    "token": "reset-token-uuid-or-hash",
    "new_password": "NewSecurePassword456!"
  }
  ```
* **Response Body (200 OK)** ([`auth_handler.go:313-315`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/auth_handler.go#L313-L315)):
  ```json
  {
    "message": "Password reset successfully"
  }
  ```

*Note: `forgot-password` and `reset-password` are under `/api/v1/auth/`, not `/api/v1/users/me/`.*

---

### 5. `POST /api/v1/users/me/switch-institution`

* **Route Registration**: [`services/gateway/internal/handler/gateway_handler.go:84`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/handler/gateway_handler.go#L84) & [`services/user/cmd/main.go:225`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/cmd/main.go#L225)
* **Handler**: [`services/user/internal/handler/user_handler.go:193-223`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/user_handler.go#L193-L223)
* **Service Method**: [`services/user/internal/service/user_service.go:1161-1207`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L1161-L1207)

#### Request Body
Defined in [`services/user/internal/handler/user_handler.go:135-137`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/user_handler.go#L135-L137) and [`services/user/internal/service/user_service.go:189-192`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L189-L192):
```json
{
  "institution_id": "veritas_uni"
}
```

#### Response Body (200 OK)
Constructed in [`services/user/internal/handler/user_handler.go:219-222`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/user_handler.go#L219-L222). Returns fresh access/refresh tokens encoding the new institution tenant and updated role:
```json
{
  "message": "Switched active institution successfully",
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIs...",
    "refresh_token": "c8e2f...",
    "token_type": "Bearer",
    "expires_at": "2026-10-10T17:20:00.000Z",
    "user": {
      "id": "c1f7b...",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "full_name": "John Doe",
      "school": "MIT",
      "department": "Computer Science",
      "academic_level": "undergraduate",
      "timezone": "UTC",
      "email_verified": true,
      "role": "lecturer",
      "created_at": "2026-10-10T16:00:00.000Z"
    }
  }
}
```

#### Error Behavior (403 Forbidden)
If the user is not an active member of the specified institution ([`services/user/internal/service/user_service.go:1190-1193`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L1190-L1193)):
```json
{
  "message": "user is not an active member of this institution"
}
```

---

### 6. Standard Error Response Envelope Across Gateway

#### Body Shapes
1. **Echo Framework Standard (`echo.HTTPError`)**:
   Used across Gateway middleware and generic handlers ([`services/gateway/internal/middleware/jwt.go:128,135,164`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/middleware/jwt.go#L128), [`services/gateway/internal/proxy/reverse_proxy.go:62`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/proxy/reverse_proxy.go#L62)):
   ```json
   {
     "message": "error description string"
   }
   ```
2. **Domain Error Payload (e.g., Unverified Email)**:
   Returned by specific auth handler branches ([`services/user/internal/handler/auth_handler.go:126-131`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/auth_handler.go#L126-L131)):
   ```json
   {
     "error": "Email verification required",
     "code": "EMAIL_NOT_VERIFIED",
     "message": "Please verify your email before logging in.",
     "user_id": "uuid-string"
   }
   ```

#### Status Codes Used Across the Gateway
* `400 Bad Request`: Body binding failures, validation errors, invalid UUIDs ([`services/user/internal/handler/auth_handler.go:71`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/handler/auth_handler.go#L71)).
* `401 Unauthorized`: Invalid credentials, expired/revoked refresh tokens, missing or invalid `Authorization: Bearer` header ([`services/gateway/internal/middleware/jwt.go:135`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/middleware/jwt.go#L135), [`services/user/internal/service/user_service.go:512`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L512)).
* `403 Forbidden`: Unverified email address, inactive account, non-member institution switch ([`services/user/internal/service/user_service.go:1190`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L1190)).
* `404 Not Found`: Session or target resource non-existent ([`services/gateway/internal/handlers/ai_handler.go:161`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/handlers/ai_handler.go#L161)).
* `409 Conflict`: Duplicate membership or resource collision ([`services/user/internal/service/user_service.go:1126`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L1126)).
* `429 Too Many Requests`: Redis sliding-window rate limit or daily AI quota breached ([`services/gateway/internal/middleware/rate_limit.go:93`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/middleware/rate_limit.go#L93)).
* `500 Internal Server Error`: Unhandled database failures or encryption key errors ([`services/user/internal/service/user_service.go:509`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L509)).
* `503 Service Unavailable`: Downstream microservice circuit breaker tripped ([`services/gateway/internal/proxy/reverse_proxy.go:62`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/proxy/reverse_proxy.go#L62)).

---

### 7. JWT Claims Specification

Defined in [`shared/pkg/auth/auth.go:36-43`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/shared/pkg/auth/auth.go#L36-L43) and populated in `GenerateTenantTokenPair` at [`shared/pkg/auth/auth.go:87-100`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/shared/pkg/auth/auth.go#L87-L100):

| Claim Name | JSON Key | Type | Description | Source Code Evidence Line |
|---|---|---|---|---|
| User ID | `user_id` | `string` | User's UUID string | [`shared/pkg/auth/auth.go:88`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/shared/pkg/auth/auth.go#L88) |
| Email | `email` | `string` | User's registered email address | [`shared/pkg/auth/auth.go:89`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/shared/pkg/auth/auth.go#L89) |
| Role | `role` | `string` | Active user role (`student`, `instructor`, `admin`, `super_admin`, `lecturer`, etc.) | [`shared/pkg/auth/auth.go:90`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/shared/pkg/auth/auth.go#L90) |
| Token Type | `token_type` | `string` | Fixed string `"access"` | [`shared/pkg/auth/auth.go:91`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/shared/pkg/auth/auth.go#L91) |
| Institution ID | `institution_id` | `string` (optional) | Tenant institution identifier | [`shared/pkg/auth/auth.go:92`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/shared/pkg/auth/auth.go#L92) |
| Expiration | `exp` | `int64` | NumericDate timestamp (default 15m lifetime) | [`shared/pkg/auth/auth.go:94`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/shared/pkg/auth/auth.go#L94) |
| Issued At | `iat` | `int64` | NumericDate timestamp when token was created | [`shared/pkg/auth/auth.go:95`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/shared/pkg/auth/auth.go#L95) |
| Not Before | `nbf` | `int64` | NumericDate timestamp when token becomes valid | [`shared/pkg/auth/auth.go:96`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/shared/pkg/auth/auth.go#L96) |
| Subject | `sub` | `string` | User's UUID string | [`shared/pkg/auth/auth.go:97`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/shared/pkg/auth/auth.go#L97) |
| JWT ID | `jti` | `string` | Unique random UUID string for revocation tracking | [`shared/pkg/auth/auth.go:98`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/shared/pkg/auth/auth.go#L98) |

*Token generation invocation sites in User Service*:
* **Login**: [`services/user/internal/service/user_service.go:534-541`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L534-L541)
* **Refresh**: [`services/user/internal/service/user_service.go:621`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L621)
* **Switch Institution**: [`services/user/internal/service/user_service.go:1204-1211`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/user/internal/service/user_service.go#L1204-L1211)

---

### 8. CORS Configuration in Gateway

* **Configuration Loader**: [`services/gateway/internal/config/config.go:61`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/config/config.go#L61)
* **Middleware Implementation**: [`services/gateway/internal/middleware/cors.go:20-83`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/middleware/cors.go#L20-L83)
* **Gateway Attachment**: [`services/gateway/cmd/main.go:86`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/cmd/main.go#L86)

#### Configured Origins
1. **Code Default**: `["http://localhost:3000"]` ([`services/gateway/internal/config/config.go:61`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/config/config.go#L61)).
2. **Environment Template (`.env.example`)**: `http://localhost:3000,https://app.zuri.app` ([`infra/.env.example:12`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/infra/.env.example#L12)).
3. **Staging Environment Compose**: `https://staging.zuri.app,https://study.staging.zuri.app` ([`infra/docker-compose.staging.yml:4`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/infra/docker-compose.staging.yml#L4)).

#### Localhost 3000 Permission
**YES.** `http://localhost:3000` is explicitly permitted by default in both `config.go` and `.env.example`.

#### Allowed Headers & Credentials
* `Access-Control-Allow-Credentials: true` ([`cors.go:72`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/middleware/cors.go#L72))
* `Access-Control-Allow-Headers`: `Origin, Content-Type, Accept, Authorization, X-Request-ID, X-Correlation-ID, X-User-ID` ([`cors.go:31-39`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/middleware/cors.go#L31-L39))
* `Access-Control-Allow-Methods`: `GET, POST, PUT, DELETE, PATCH, OPTIONS` ([`cors.go:23-30`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/middleware/cors.go#L23-L30))

---

### 9. Cookie vs Header Authentication

* **Authorization Header Only.** The backend does **NOT** issue, inspect, or set any HTTP cookies (`Set-Cookie` header is NOT USED anywhere in services/gateway or services/user).
* **Token Passing Mechanisms**:
  1. **HTTP REST Endpoints**: Standard `Authorization: Bearer <access_token>` header parsed at [`services/gateway/internal/middleware/jwt.go:123-130`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/middleware/jwt.go#L123-L130).
  2. **WebSocket Upgrades (`/api/v1/ws`)**: URL Query parameter `?token=<access_token>` fallback supported at [`services/gateway/internal/middleware/jwt.go:133-134`](file:///c:/Users/USER/Desktop/VScodes/Backend_zuri.ed-main/services/gateway/internal/middleware/jwt.go#L133-L134).