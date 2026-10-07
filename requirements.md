# Requirements Document - Interview AI

---

## 1. Project Overview & Objective

**Interview AI** is an intelligent full-stack web application designed to help job seekers prepare thoroughly for job interviews and create job-tailored resumes.

### The Problem
- Job seekers struggle to know what technical and behavioral questions recruiters and hiring managers will ask.
- Preparing without a structured plan leads to wasted time and anxiety.
- Standard generic resumes often get rejected by automated Applicant Tracking Systems (ATS) because they lack relevant keywords and role alignment.

### The Solution
- The candidate provides their resume (or personal summary) and the target job description.
- Using Google Gemini AI, the platform analyzes the match between the candidate and the role.
- The system generates:
  1. A profile match score ($0-100\%$).
  2. Targeted technical and behavioral interview questions with interviewer intentions and model answers.
  3. Identified skill gaps with severity ratings.
  4. A day-by-day customized preparation roadmap.
  5. An ATS-optimized, professionally formatted PDF resume tailored specifically to that job opening.

---

## 2. User Personas

| Persona | Description | Needs |
| :--- | :--- | :--- |
| **College Graduate / Fresher** | Seeking their first tech job. | Needs guidance on questions asked and a step-by-step preparation plan. |
| **Experienced Professional** | Transitioning into a new role or senior position. | Needs targeted interview questions and a tailored resume emphasizing relevant experience. |
| **Career Switcher** | Moving from a non-tech or different tech domain. | Needs to know exact skill gaps and how to address them in an interview. |

---

## 3. Functional Requirements (FR)

### 3.1. User Authentication & Authorization
- **FR-1.1: User Registration**: Users must be able to create an account with a unique username, email address, and password. Passwords must be securely hashed.
- **FR-1.2: User Login**: Users must be able to log in using their email and password. Upon successful login, an authenticated session token (JWT) is issued in an HTTP-only cookie.
- **FR-1.3: User Logout**: Users must be able to log out. The session token is cleared and blacklisted to prevent replay attacks.
- **FR-1.4: Protected Routes**: Unauthenticated users must be redirected to the login page if they try to access the dashboard or interview plans.

### 3.2. Resume & Job Input Processing
- **FR-2.1: Target Job Description Input**: Users must be able to enter or paste a target job description (up to 5,000 characters).
- **FR-2.2: Resume PDF Upload**: Users must be able to attach a resume in PDF format (up to 5MB) via file picker or drag-and-drop.
- **FR-2.3: Visual Attachment Indicator**: The interface must visually display the uploaded file name, formatted size, and a remove button.
- **FR-2.4: Self-Description Fallback**: If a candidate does not have a PDF resume handy, they must be allowed to provide a brief text self-description instead.

### 3.3. AI-Powered Interview Plan Generation
- **FR-3.1: Profile Match Score**: The AI must calculate a match score between $0$ and $100$ based on candidate skills vs. job requirements.
- **FR-3.2: Technical Questions**: The system must provide role-specific technical questions, explaining the interviewer's intent and delivering a high-scoring model answer.
- **FR-3.3: Behavioral Questions**: The system must provide behavioral questions targeting soft skills and workplace scenarios.
- **FR-3.4: Skill Gap Analysis**: The system must identify missing or weak skills and classify them by severity (`low`, `medium`, `high`).
- **FR-3.5: Day-by-Day Preparation Plan**: The system must generate a step-by-step schedule (e.g., 5–7 days) with specific study tasks and exercises.

### 3.4. Tailored Resume Generation & PDF Export
- **FR-4.1: Job-Tailored Resume HTML Generation**: The AI must generate professional, ATS-friendly HTML content highlighting strengths matching the job description.
- **FR-4.2: Puppeteer PDF Compilation**: The backend must convert the generated HTML into an A4 PDF document with standard margins.
- **FR-4.3: One-Click Download**: The user must be able to download the tailored PDF directly to their computer.

### 3.5. History & Saved Reports
- **FR-5.1: Saved Plans List**: Authenticated users must be able to view their past interview plans on the home screen.
- **FR-5.2: Revisit Plan**: Users can click any past interview plan to view the full report immediately.

---

## 4. Non-Functional Requirements (NFR)

### 4.1. Performance & Latency
- **NFR-1.1**: Resume text parsing must complete in less than 1 second.
- **NFR-1.2**: AI report generation should complete in approximately 20–35 seconds.
- **NFR-1.3**: Automated retry with exponential backoff must handle temporary Google Gemini API demand spikes ($503$ / $429$) without user-facing failure.

### 4.2. Security
- **NFR-2.1**: Passwords must never be stored in plain text (hashed using `bcryptjs` with salt factor 10).
- **NFR-2.2**: Authentication tokens (JWT) must be delivered via secure HTTP cookies to mitigate XSS attacks.
- **NFR-2.3**: Logged-out tokens must be immediately added to a blacklist collection in MongoDB.
- **NFR-2.4**: File uploads must be restricted to PDF format and capped at 5MB in memory.

### 4.3. Usability & User Experience (UX)
- **NFR-3.1**: The application must provide real-time visual feedback (animated spinner, status messages) during AI processing.
- **NFR-3.2**: Clean, dark-mode modern aesthetic with responsive layouts and accessible typography.
- **NFR-3.3**: Clear error messages when input is invalid or network issues occur.

### 4.4. Maintainability & Code Quality
- **NFR-4.1**: Clear separation of concerns: Frontend (React components, hooks, services) and Backend (Controllers, Services, Models, Middlewares).
- **NFR-4.2**: Use of strict Zod schemas to enforce structured JSON output from the AI model.
