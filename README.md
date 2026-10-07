# InterviewAI - AI-Powered Technical Interview & Resume Platform

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google%20GenAI-SDK%201.42%2B-4285F4?logo=google&logoColor=white)
![Puppeteer](https://img.shields.io/badge/Puppeteer-PDF%20Engine-40B5A4?logo=puppeteer&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue.svg)

**An intelligent full-stack career platform that analyzes candidate profiles against job descriptions to generate role-tailored technical & behavioral interview plans, skill gap roadmaps, and ATS-optimized PDF resumes.**

[Key Features](#-key-features) • [System Architecture](#-system-architecture) • [Tech Stack](#-tech-stack) • [Database Design](#-database-design) • [API Specification](#-api-specification) • [Local Setup](#-local-setup) • [Engineering Highlights](#-engineering-highlights)

</div>

---

## 📌 Executive Summary & Problem Statement

Job seekers face two critical bottlenecks in technical recruitment:
1. **Unpredictable Interview Preparation**: Candidates often waste weeks memorizing generic problems without knowing the exact technical concepts, behavioral scenarios, and interviewer intentions expected for their target role.
2. **ATS Rejections**: Generic resumes lack the specific role taxonomy and quantifiable keywords required by modern Applicant Tracking Systems (ATS).

**InterviewAI** solves this by providing an end-to-end preparation engine:
- Ingests the candidate's existing PDF resume (with automatic text extraction via `pdf-parse`) or fallback self-description.
- Compares profile skills against the target job description using Google Gemini models with strict structured JSON schema validation (`zod`).
- Generates a quantified role match score ($0-100\%$), categorized technical questions with model answers and interviewer rationale, behavioral questions with STAR framework guides, severity-tagged skill gaps, and a day-by-day roadmap.
- Synthesizes a tailored, ATS-compliant HTML resume rendered into an A4 PDF document using headless Puppeteer.

---

## 🚀 Key Features

### 1. Multi-Input Candidate Profiling
- **PDF Resume Upload**: Parses `.pdf` files up to 5MB directly in-memory via `multer` and `pdf-parse`.
- **Text Fallback**: Allows candidates without a PDF file to submit a structured self-description.
- **Job Description Parsing**: Accepts full-length role specifications (up to 5,000 characters).

### 2. Structured AI Interview Intelligence
- **Profile Match Score**: Computes an objective alignment score ($0-100\%$).
- **Curated Technical Questions**: Explains the interviewer's intent and delivers high-scoring architectural and problem-solving answers.
- **Behavioral Questions**: Prepares candidates for behavioral evaluations (conflict resolution, trade-offs, scope negotiations).
- **Skill Gap Classification**: Categorizes missing skills with explicit severity ratings (`low`, `medium`, `high`).
- **Day-by-Day Preparation Roadmap**: Generates a daily schedule with concrete study topics and exercises.

### 3. ATS-Tailored Resume PDF Compilation
- Prompts Gemini AI to synthesize clean, semantic HTML tailored specifically to the target job description.
- Automatically compiles the HTML into a downloadable A4 PDF using headless Puppeteer with print margins.

### 4. Production-Grade Auth & Session Security
- User registration and login with salted `bcryptjs` password hashing.
- Stateless JSON Web Tokens (JWT) transported via HTTP-only, secure cookies.
- Server-side JWT blacklisting (`blacklistTokens` collection) to prevent token reuse after logout.
- Client-side `<Protected>` routing wrapper guarding dashboard routes.

---

## 🏗 System Architecture

```
                    ┌────────────────────────────────────────────────────────┐
                    │                      Client Browser                    │
                    │               React 19 + Vite 7 SPA (Port 5173)         │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                                    HTTP / REST (JSON + Cookies)
                                    Multipart Form-Data
                                                │
                                                ▼
                    ┌────────────────────────────────────────────────────────┐
                    │                 Node.js + Express 5 API                │
                    │                   Backend (Port 3000)                  │
                    │                                                        │
                    │   ┌────────────────────┐      ┌────────────────────┐   │
                    │   │  Auth Middleware   │      │  Multer Upload     │   │
                    │   │  (JWT + Blacklist) │      │  (Memory Storage)  │   │
                    │   └────────────────────┘      └────────────────────┘   │
                    └───────────┬──────────────────────────┬─────────────────┘
                                │                          │
                     Mongoose ODM (MongoDB)     Google GenAI SDK & Puppeteer
                                │                          │
               ┌────────────────┴──────────────┐           ▼
               │                               │   ┌────────────────────────┐
               ▼                               ▼   │   Google Gemini API    │
    ┌────────────────────┐   ┌─────────────────┐   │  (Structured JSON Zod) │
    │   MongoDB Atlas    │   │ blacklistTokens │   └────────────────────────┘
    │  users / reports   │   │   (Revoked JWT) │               │
    └────────────────────┘   └─────────────────┘               ▼
                                                   ┌────────────────────────┐
                                                   │    Puppeteer Engine    │
                                                   │   (HTML -> A4 PDF)     │
                                                   └────────────────────────┘
```

---

## 💻 Tech Stack

### Frontend
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `^19.2.0` | Declarative component UI library |
| **Vite** | `^7.3.1` | Next-generation frontend build tooling and HMR dev server |
| **React Router** | `^7.13.0` | Client-side routing with `createBrowserRouter` and protected routes |
| **Sass (SCSS)** | `^1.97.3` | Custom styling system utilizing modern `@use 'sass:color'` tokens |
| **Axios** | `^1.13.5` | Promise-based HTTP client with `withCredentials: true` |

### Backend
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `>=20.x` | Server runtime environment |
| **Express** | `^5.2.1` | REST API routing and middleware framework |
| **MongoDB / Mongoose**| `^9.2.1` | NoSQL document database and ODM modeling |
| **@google/genai** | `^1.42.0` | Official Google GenAI SDK for Gemini model inference |
| **Zod / Zod-to-JSON** | `^3.25.x` | Schema validation and strict JSON output formatting |
| **Puppeteer** | `^24.37.5`| Headless browser engine for A4 PDF resume compilation |
| **pdf-parse** | `^2.4.5` | In-memory text extraction from uploaded candidate resumes |
| **jsonwebtoken** | `^9.0.3` | Stateless token signing and verification |
| **bcryptjs** | `^3.0.3` | Cryptographic password hashing |
| **multer** | `^2.0.2` | Multipart form-data handling with memory buffers |
| **cookie-parser** | `^1.4.7` | HTTP-only cookie parsing |
| **cors** | `^2.8.6` | Cross-Origin Resource Sharing control |

---

## 🗄 Database Design

The database uses MongoDB via Mongoose. Schemas are structured to store deeply nested interview insights in a single document, eliminating multi-table joins.

### 1. `users` Collection
Defined in [`user.model.js`](Backend/src/models/user.model.js):
```javascript
{
  _id: ObjectId,
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true } // bcrypt hash
}
```

### 2. `blacklistTokens` Collection
Defined in [`blacklist.model.js`](Backend/src/models/blacklist.model.js):
```javascript
{
  _id: ObjectId,
  token:     { type: String, required: true },
  createdAt: Date,
  updatedAt: Date
}
```

### 3. `InterviewReport` (`interviewreports` Collection)
Defined in [`interviewReport.model.js`](Backend/src/models/interviewReport.model.js):
```javascript
{
  _id: ObjectId,
  user: { type: ObjectId, ref: "users" },
  title: { type: String, required: true },
  jobDescription: { type: String, required: true },
  resume: String,                // Raw text parsed from candidate's PDF
  selfDescription: String,       // Candidate summary text
  matchScore: { type: Number, min: 0, max: 100 },
  technicalQuestions: [
    { question: String, intention: String, answer: String }
  ],
  behavioralQuestions: [
    { question: String, intention: String, answer: String }
  ],
  skillGaps: [
    { skill: String, severity: "low" | "medium" | "high" }
  ],
  preparationPlan: [
    { day: Number, focus: String, tasks: [String] }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Specification

Base URL: `http://localhost:3000` (or configured via environment)

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Content-Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | `application/json` | Registers user; sets HTTP-only `token` cookie (24h). |
| `POST` | `/api/auth/login` | Public | `application/json` | Authenticates credentials; sets HTTP-only `token` cookie. |
| `GET` | `/api/auth/logout` | Public | N/A | Clears `token` cookie and blacklists token in database. |
| `GET` | `/api/auth/get-me` | Private | N/A | Returns current authenticated user record (`id`, `username`, `email`). |

#### Sample Request (`POST /api/auth/register`)
```json
{
  "username": "alexdev",
  "email": "alex@example.com",
  "password": "SecurePassword123"
}
```

---

### Interview & Resume Management (`/api/interview`)

| Method | Endpoint | Access | Content-Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/interview/` | Private | `multipart/form-data` | Generates a full interview preparation report. |
| `GET` | `/api/interview/` | Private | N/A | Fetches all interview reports belonging to the authenticated user. |
| `GET` | `/api/interview/report/:interviewId` | Private | N/A | Fetches a single complete interview report by document ID. |
| `POST` | `/api/interview/resume/pdf/:interviewReportId` | Private | N/A | Synthesizes and streams tailored resume PDF via Puppeteer. |

#### Multipart Payload for `POST /api/interview/`
- `jobDescription` (text, required): Target job description text.
- `resume` (file, optional*): Candidate resume in PDF format (max 5MB).
- `selfDescription` (text, optional*): Text description of candidate skills.
*\*At least one of `resume` or `selfDescription` must be provided.*

#### Sample Response (`POST /api/interview/` - `201 Created`)
```json
{
  "message": "Interview report generated successfully.",
  "interviewReport": {
    "_id": "67a3a0e19c0b112f451b6789",
    "user": "67a39d891b8a531e0f63a123",
    "title": "Senior Backend Engineer",
    "matchScore": 85,
    "technicalQuestions": [
      {
        "question": "How do you handle distributed transactions across microservices?",
        "intention": "Evaluates architectural depth with Saga pattern vs. Two-Phase Commit.",
        "answer": "Describe choreograph-based vs orchestrator-based Sagas, compensating transactions, and idempotency keys."
      }
    ],
    "behavioralQuestions": [
      {
        "question": "Tell me about a high-severity production outage you managed.",
        "intention": "Assesses incident triage, stakeholder communication, and root-cause analysis.",
        "answer": "Structure using STAR: incident timeline, mitigation, post-mortem, and permanent corrective action."
      }
    ],
    "skillGaps": [
      {
        "skill": "Kafka Event Streaming",
        "severity": "medium"
      }
    ],
    "preparationPlan": [
      {
        "day": 1,
        "focus": "Distributed Systems & Event Brokers",
        "tasks": [
          "Review partition strategies and consumer groups",
          "Design an idempotent webhook delivery system"
        ]
      }
    ],
    "createdAt": "2026-10-07T12:00:00.000Z"
  }
}
```

---

## ⚙️ Environment Variables

### Backend Configuration (`Backend/.env`)
Create a `.env` file inside the `Backend/` directory:

```env
# Server Port
PORT=3000

# MongoDB Connection String (MongoDB Atlas or Local instance)
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT Signing Secret Key
JWT_SECRET=your_jwt_super_secret_key_change_in_production

# Google Gemini API Key (From Google AI Studio)
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here

# Primary Gemini Model (Defaults to gemini-flash-lite-latest)
GEMINI_MODEL=gemini-flash-lite-latest
```

### Frontend Configuration (`Frontend/.env`)
Create a `.env` file inside the `Frontend/` directory:

```env
# Backend API Base URL
VITE_API_URL=http://localhost:3000
```

---

## 🛠 Local Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) `>= 20.x`
- [npm](https://www.npmjs.com/) `>= 9.x`
- [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or local MongoDB instance
- [Google AI Studio API Key](https://aistudio.google.com/)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/ALTAF-ANSARI/Resume-Generation.git
cd Resume-Generation
```

---

### Step 2: Configure Environment Files
1. Copy the backend template and insert your credentials:
   ```bash
   cd Backend
   cp .env.example .env
   # Edit .env and supply your MONGO_URI, JWT_SECRET, and GOOGLE_GENAI_API_KEY
   cd ..
   ```
2. Create `Frontend/.env`:
   ```bash
   echo "VITE_API_URL=http://localhost:3000" > Frontend/.env
   ```

---

### Step 3: Install Dependencies

#### Backend
```bash
cd Backend
npm install
cd ..
```

#### Frontend
```bash
cd Frontend
npm install
cd ..
```

---

### Step 4: Run the Application

#### Option A: Quick-Launch via Windows Batch Script (Recommended for Windows)
Double-click `run.bat` or run:
```cmd
run.bat
```
This launches both backend and frontend development servers in separate terminal windows.

#### Option B: Manual Execution

**Terminal 1 (Backend):**
```bash
cd Backend
npm run dev
# Starts on http://localhost:3000 (with nodemon)
```

**Terminal 2 (Frontend):**
```bash
cd Frontend
npm run dev
# Starts on http://localhost:5173 (with Vite HMR)
```

Visit **`http://localhost:5173`** in your browser.

---

## 🧠 Engineering Highlights & Resilience

### 1. Multi-Model AI Fallback & Demand Spike Shield
* **Challenge**: Preview and high-tier Gemini models can occasionally experience transient `503 UNAVAILABLE` or `429 Too Many Requests` demand surges during peak cloud usage.
* **Solution**: In [`ai.service.js`](Backend/src/services/ai.service.js), requests are wrapped in an autonomous retry and fallback system:
  1. Performs exponential backoff retries for transient errors.
  2. If the active model remains saturated, it automatically cascades through candidate models (`gemini-flash-lite-latest` $\rightarrow$ `gemini-3-flash-preview`), ensuring generation requests succeed without throwing uncaught server errors.

### 2. Strict Structured Schema Enforcement
* Generates JSON directly using `zod` and `zod-to-json-schema` integrated into `@google/genai`'s `responseSchema` configuration. This prevents hallucinated keys, markdown formatting wrappers, and schema mismatches.

### 3. Serverless-Grade In-Memory Document Handling
* Candidate resumes are processed strictly in-memory via `multer.memoryStorage()`. No temporary disk files are written, keeping disk I/O at zero and preventing dangling file leaks.

### 4. Headless PDF Compilation via Chromium
* Rather than using brittle canvas-based PDF client libraries, the platform leverages server-side **Puppeteer** to compile semantic HTML into standard A4 documents with exact print margins.

---

## 📂 Repository File Structure

```
Resume-Generation/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js              # Mongoose DB connection & IPv4 DNS resolution
│   │   ├── controllers/
│   │   │   ├── auth.controller.js       # Register, login, logout, get-me controllers
│   │   │   └── interview.controller.js  # Report generation, retrieval, PDF controllers
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js       # JWT cookie verification & blacklist validation
│   │   │   └── file.middleware.js       # Multer memory storage & PDF filter
│   │   ├── models/
│   │   │   ├── user.model.js            # User credentials schema
│   │   │   ├── blacklist.model.js       # Revoked JWT schema
│   │   │   └── interviewReport.model.js # Structured interview report schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js           # Express auth router mappings
│   │   │   └── interview.routes.js      # Express interview & PDF router mappings
│   │   ├── services/
│   │   │   └── ai.service.js            # Gemini AI integration, fallback & Puppeteer
│   │   ├── app.js                       # Express app configuration & middlewares
│   │   └── server.js                    # HTTP listener bootstrap
│   ├── .env.example                     # Backend environment configuration template
│   └── package.json                     # Backend dependencies & npm scripts
├── Frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/                    # Auth pages, context, and API client
│   │   │   └── interview/               # Interview dashboard, hooks, and SCSS styles
│   │   ├── app.routes.jsx               # React Router configuration
│   │   ├── main.jsx                     # Provider tree root
│   │   └── index.css                    # Base styling reset
│   ├── index.html                       # HTML document root
│   ├── package.json                     # Frontend dependencies & npm scripts
│   └── vite.config.js                   # Vite bundler configuration
├── run.bat                              # Dual-server Windows launcher script
├── api-design.md                        # Formal REST API documentation
├── architecture.md                      # System architecture and design diagrams
├── database-design.md                   # Mongoose data models and collection design
├── requirements.md                      # Functional & non-functional requirements
├── project-explanation-and-interview-guide.md # Comprehensive interview & engineering guide
└── README.md                            # Primary repository documentation
```

---

## 📄 License

This project is licensed under the **ISC License**.
