# CVGenie ATS — AI Resume Builder & Career Copilot

Transform your resume for any job posting with automated ATS keyword optimization, strict ATS-compliant formatting, and tailored cover letter generation.

---

## 🚀 Key Features

- **Two-Pass AI Resume Engine**:
  1. **Pass 1 — Optimization**: Analyzes the job posting and seamlessly integrates critical role keywords, measurable achievements, and skills without buzzword stuffing.
  2. **Pass 2 — ATS Compliance**: Enforces clean single-column structure, standard section headers, and high-readability formatting compatible with all major ATS scanners (Workday, Greenhouse, Lever, Taleo, iCIMS).
- **Matched Cover Letters**: Generates tailored, persuasive cover letters matching each optimized resume.
- **Multi-Format Document Parsing & Export**:
  - **Uploads**: PDF (`pdf2json`), Microsoft Word (`.docx`/`.doc`), and Plain Text (`.txt`).
  - **Downloads**: PDF (`pdf-lib`), DOCX (`docx`), and Plain Text (`.txt`).
- **Interactive Interview Prep**: Generates personalized behavioral, skills-based, and role-specific interview questions.
- **Enterprise Cookie & Consent Architecture**: OWASP-hardened double-submit CSRF protection, secure session management, and GDPR/ePrivacy compliant consent controls.
- **Monetization & Billing**: Integrated with Dodo Payments for Pro subscription checkouts and real-time webhook status updates.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 18, Vite 5, TypeScript, Tailwind CSS, Framer Motion, Radix UI primitives, TanStack Query.
- **Backend**: Node.js & Express 4.21, TypeScript, `@clerk/express`, `express-rate-limit`, `cookie-parser`.
- **Database & Storage**: Neon Serverless PostgreSQL with Drizzle ORM and in-memory query caching.
- **AI Engine**: DeepSeek API (`deepseek-chat`) with exponential backoff retry and rate limiting.
- **Authentication**: Clerk Authentication (`@clerk/clerk-react` + `@clerk/express`).
- **Payments**: Dodo Payments SDK and HMAC-verified webhooks (`standardwebhooks`).

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory (never commit secrets to version control):

```bash
# Server & App
PORT=5000
NODE_ENV=development

# Database (Neon Serverless PostgreSQL)
DATABASE_URL=postgresql://user:password@ep-sample-pooler.aws.neon.tech/neondb?sslmode=require

# DeepSeek AI API
DEEPSEEK_API_KEY=sk-...

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
VITE_CLERK_PUBLISHABLE_KEY=pk_...

# Dodo Payments
DODO_PAYMENTS_API_KEY=...
DODO_PAYMENTS_PRODUCT_ID=pdt_...
DODO_PAYMENTS_WEBHOOK_SECRET=whsec_...
DODO_ENVIRONMENT=live_mode
```

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode
```bash
npm run dev
```
The application will be accessible at `http://localhost:5000`.

### 3. Type Checking & Production Build
```bash
npm run check  # TypeScript verification
npm run build  # Vite production build + esbuild server bundle
npm start      # Launch production server
```

---

## 📄 License
MIT License.