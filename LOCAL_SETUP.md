# CVGenie - Local Setup & Development Guide

This guide provides instructions to set up, configure, and run the CVGenie application locally on your machine.

---

## 1. Prerequisites

- **Node.js**: `v20.x` or `v22.x` (Tested and verified with Node `v22.13.1` and npm `10.9.2`)
- **Git**: Installed and available in your terminal
- **PostgreSQL Database** (optional for landing page browsing; required for saving resumes & user sessions)

---

## 2. Installation

Clone or open the repository folder, then install project dependencies:

```bash
npm install
```
*(or `npm ci` if running a clean automated install)*

---

## 3. Environment Variables Configuration

Copy `.env.example` to create your local `.env` file:

```bash
cp .env.example .env
```

### Environment Variables Reference

| Variable | Description | Example / Format |
|---|---|---|
| `PORT` | Local web server port (default `5000`) | `5000` |
| `NODE_ENV` | Environment mode (`development` or `production`) | `development` |
| `SESSION_SECRET` | Secret key for session cookie signing | `your-random-secret-string` |
| `DATABASE_URL` | PostgreSQL connection string (Neon or local Postgres) | `postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk Frontend Publishable Key | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk Backend Secret Key | `sk_test_...` |
| `DEEPSEEK_API_KEY` | DeepSeek API Key for AI resume optimization | `sk-...` |
| `DODO_PAYMENTS_MODE` | Dodo Payments environment mode (`test_mode` or `live_mode`) | `test_mode` |
| `DODO_PAYMENTS_API_KEY` | Dodo Payments API key | `...` |
| `DODO_PAYMENTS_PRODUCT_ID` | Dodo Payments Product ID | `pdt_...` or `prod_...` |
| `DODO_PAYMENTS_WEBHOOK_SECRET` | Dodo Payments Webhook signing secret | `whsec_...` |

---

## 4. Database Setup & Schema Push

CVGenie uses **Drizzle ORM** with PostgreSQL (configured for Neon serverless PostgreSQL or any standard PostgreSQL instance).

### Option A: Hosted Neon PostgreSQL (Recommended)
1. Create a free database at [Neon Console](https://console.neon.tech).
2. Copy the connection string provided by Neon.
3. Paste it as `DATABASE_URL` in your `.env` file:
   ```env
   DATABASE_URL=postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require
   ```

### Option B: Local PostgreSQL
1. Start your local PostgreSQL server.
2. Create a database (e.g., `cvgenie`).
3. Set `DATABASE_URL` in your `.env` file:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cvgenie
   ```

### Push Schema to Database
> [!WARNING]
> Only run this after ensuring your `DATABASE_URL` is pointing to your intended development database. Never run against an unknown production database.

```bash
npm run db:push
```

---

## 5. Authentication Setup (Clerk)

1. Create a free account at [Clerk Dashboard](https://dashboard.clerk.com).
2. Create a new development application.
3. In Clerk Settings, ensure `http://localhost:5000` is in the allowed origin URLs.
4. Copy the **Publishable Key** (`pk_test_...`) and **Secret Key** (`sk_test_...`) to `.env`:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

> [!NOTE]
> If Clerk keys are not configured, all public pages (Landing page, Blog, Terms, Privacy, Pricing) will render normally. Protected routes (`/generator`, `/dashboard`, `/resume-history`, `/ats-score`, `/interview-prep`) will display the sign-in modal.

---

## 6. Running the Development Server

Start the fullstack development server (Express backend + Vite HMR frontend on a single port):

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5000
```

---

## 7. Production Build & Start

To build and test the production bundle:

```bash
# Type check the codebase
npm run check

# Create production build
npm run build

# Start the production server
npm start
```

---

## 8. Webhook Testing for Localhost

To test Dodo Payments webhooks locally:
1. Use a tunneling tool like `ngrok`:
   ```bash
   ngrok http 5000
   ```
2. In your Dodo Payments dashboard, add the webhook endpoint:
   `https://<your-ngrok-subdomain>.ngrok-free.app/api/webhooks/dodo-payments`
3. Copy the webhook secret into `.env`:
   ```env
   DODO_PAYMENTS_WEBHOOK_SECRET=whsec_...
   ```

---

## 9. Troubleshooting

- **Port 5000 in use**: If port 5000 is occupied by another process, change `PORT=5001` in your `.env` and restart.
- **AI Generation Fails**: Check that `DEEPSEEK_API_KEY` is configured in `.env` and has active credits.
- **Blank Screen / Clerk Key Error**: Ensure `VITE_CLERK_PUBLISHABLE_KEY` is a development key (`pk_test_...`) for `localhost`.
- **Database Connection Timeout**: Check your internet connection if using Neon or verify that your local PostgreSQL service is running.
