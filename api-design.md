# API Design Specification - Interview AI

---

## 1. API Conventions & Overview

- **Base URL**: `http://localhost:3000` (or production domain)
- **Transport**: HTTP / HTTPS
- **Data Formats**:
  - Request Bodies: `application/json` or `multipart/form-data` (for file uploads)
  - Response Bodies: `application/json` or `application/pdf` (for binary document downloads)
- **Authentication**: JWT token transported via HTTP cookies (`token`).
- **CORS Configuration**: Allowed origin `http://localhost:5173` with `credentials: true`.

---

## 2. Authentication Endpoints (`/api/auth`)

### 2.1. Register User
Creates a new user account and sets a JWT authentication cookie.

- **Method**: `POST`
- **Route**: `/api/auth/register`
- **Access**: Public
- **Content-Type**: `application/json`

#### Request Body
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecretPassword123"
}
```

#### Success Response (`201 Created`)
*Sets HTTP Cookie: `token=<jwt_token>; Path=/; Max-Age=86400`*
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "67a39d891b8a531e0f63a123",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### Error Responses
- `400 Bad Request`: Missing fields or account already exists.
  ```json
  { "message": "Account already exists with this email address or username" }
  ```

---

### 2.2. Login User
Authenticates an existing user and issues a JWT cookie.

- **Method**: `POST`
- **Route**: `/api/auth/login`
- **Access**: Public
- **Content-Type**: `application/json`

#### Request Body
```json
{
  "email": "john@example.com",
  "password": "SecretPassword123"
}
```

#### Success Response (`200 OK`)
*Sets HTTP Cookie: `token=<jwt_token>; Path=/; Max-Age=86400`*
```json
{
  "message": "User loggedIn successfully.",
  "user": {
    "id": "67a39d891b8a531e0f63a123",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### Error Responses
- `400 Bad Request`: Invalid email or password.
  ```json
  { "message": "Invalid email or password" }
  ```

---

### 2.3. Logout User
Clears the session cookie and blacklists the active JWT token.

- **Method**: `POST`
- **Route**: `/api/auth/logout`
- **Access**: Public (Token in cookie optional)

#### Success Response (`200 OK`)
*Clears HTTP Cookie `token`*
```json
{
  "message": "User logged out successfully"
}
```

---

### 2.4. Get Current User Profile (`Me`)
Retrieves profile data of the currently logged-in user.

- **Method**: `GET`
- **Route**: `/api/auth/me`
- **Access**: Private (Requires valid JWT cookie)

#### Success Response (`200 OK`)
```json
{
  "message": "User details fetched successfully",
  "user": {
    "id": "67a39d891b8a531e0f63a123",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### Error Responses
- `401 Unauthorized`: Missing or blacklisted/expired token.
  ```json
  { "message": "Token not provided." }
  ```

---

## 3. Interview & Resume Endpoints (`/api/interview`)

### 3.1. Generate Interview Report
Analyzes a candidate's resume (or self-description) and target job description using Gemini AI.

- **Method**: `POST`
- **Route**: `/api/interview/`
- **Access**: Private (Requires valid JWT cookie)
- **Content-Type**: `multipart/form-data`

#### Request Payload
| Field | Type | Required? | Description |
| :--- | :--- | :--- | :--- |
| `resume` | File (PDF) | Optional* | PDF resume file (Max 5MB). |
| `selfDescription` | String | Optional* | Fallback text profile summary. |
| `jobDescription` | String | Required | Target job description text. |

*\*Note: Either `resume` or `selfDescription` must be provided.*

#### Success Response (`201 Created`)
```json
{
  "message": "Interview report generated successfully.",
  "interviewReport": {
    "_id": "67a3a0e19c0b112f451b6789",
    "user": "67a39d891b8a531e0f63a123",
    "title": "Senior Frontend Engineer",
    "matchScore": 82,
    "technicalQuestions": [
      {
        "question": "How do you optimize render performance in large-scale React applications?",
        "intention": "To test candidate's practical grasp of the Virtual DOM, memoization, and profiler tools.",
        "answer": "Discuss useMemo, useCallback, React.memo, virtualization for long lists, and avoiding inline object references."
      }
    ],
    "behavioralQuestions": [
      {
        "question": "Describe a scenario where you disagreed with a product manager on technical scope.",
        "intention": "To evaluate conflict resolution and balancing engineering quality with business timelines.",
        "answer": "Use the STAR framework (Situation, Task, Action, Result) explaining collaborative trade-offs."
      }
    ],
    "skillGaps": [
      {
        "skill": "GraphQL Federation",
        "severity": "medium"
      }
    ],
    "preparationPlan": [
      {
        "day": 1,
        "focus": "Core React Internals & Fiber",
        "tasks": [
          "Review React 19 hooks and concurrent features",
          "Solve 3 state management interview problems"
        ]
      }
    ],
    "createdAt": "2026-10-06T14:00:00.000Z"
  }
}
```

#### Error Responses
- `400 Bad Request`: Missing inputs.
  ```json
  { "message": "Please provide either a resume PDF or a self description." }
  ```
- `503 Service Unavailable`: Temporary Gemini traffic surge after all retries exhausted.
  ```json
  { "message": "Google Gemini AI is currently experiencing temporary high traffic. Please retry in a few moments." }
  ```

---

### 3.2. Get All User Reports
Returns a summary list of all interview plans created by the logged-in user.

- **Method**: `GET`
- **Route**: `/api/interview/`
- **Access**: Private (Requires valid JWT cookie)

#### Success Response (`200 OK`)
```json
{
  "message": "Interview reports fetched successfully.",
  "interviewReports": [
    {
      "_id": "67a3a0e19c0b112f451b6789",
      "user": "67a39d891b8a531e0f63a123",
      "title": "Senior Frontend Engineer",
      "matchScore": 82,
      "createdAt": "2026-10-06T14:00:00.000Z"
    }
  ]
}
```

---

### 3.3. Get Interview Report by ID
Fetches the full details of a specific interview report.

- **Method**: `GET`
- **Route**: `/api/interview/report/:interviewId`
- **Access**: Private (Requires valid JWT cookie)

#### Success Response (`200 OK`)
```json
{
  "message": "Interview report fetched successfully.",
  "interviewReport": {
    "_id": "67a3a0e19c0b112f451b6789",
    "title": "Senior Frontend Engineer",
    "matchScore": 82,
    "technicalQuestions": [ ... ],
    "behavioralQuestions": [ ... ],
    "skillGaps": [ ... ],
    "preparationPlan": [ ... ],
    "createdAt": "2026-10-06T14:00:00.000Z"
  }
}
```

#### Error Responses
- `404 Not Found`:
  ```json
  { "message": "Interview report not found." }
  ```

---

### 3.4. Generate & Download Tailored Resume PDF
Prompts Gemini AI to draft a tailored HTML resume, renders it with Puppeteer, and returns an A4 PDF binary stream.

- **Method**: `POST`
- **Route**: `/api/interview/resume/pdf/:interviewReportId`
- **Access**: Private (Requires valid JWT cookie)

#### Success Response (`200 OK`)
- **Headers**:
  - `Content-Type`: `application/pdf`
  - `Content-Disposition`: `attachment; filename=resume_67a3a0e19c0b112f451b6789.pdf`
- **Body**: Binary PDF Stream

#### Error Responses
- `404 Not Found`: Report doesn't exist.
  ```json
  { "message": "Interview report not found." }
  ```
- `503 Service Unavailable`: Temporary Gemini traffic surge after retries.
  ```json
  { "message": "Google Gemini AI is currently experiencing temporary high traffic. Please try clicking 'Download Resume' again in a few moments." }
  ```

---

## 4. Standard HTTP Status Code Reference

| Status Code | Meaning | Used For |
| :--- | :--- | :--- |
| `200 OK` | Request succeeded | Successful GET or PDF download. |
| `201 Created` | Resource created | Registration, Report generation. |
| `400 Bad Request` | Client validation failure | Missing fields, invalid file type. |
| `401 Unauthorized` | Authentication failure | Missing, blacklisted, or expired JWT. |
| `404 Not Found` | Resource does not exist | Invalid report ID. |
| `500 Internal Server Error` | Unexpected server crash | Database or runtime exception. |
| `503 Service Unavailable` | Downstream service busy | Google Gemini transient high-demand spike. |
