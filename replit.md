# CVGenie - AI Resume & Cover Letter Generator

## Overview
CVGenie is a microSaaS application that leverages AI to generate ATS-optimized resumes and personalized cover letters. It supports PDF resume uploads, job description pasting, and outputs tailored documents. The project aims to provide a clean, ProjectOS-inspired UI/UX, offering both free and pro tiers.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React 18 and TypeScript, using Tailwind CSS with shadcn/ui for styling, Wouter for routing, TanStack React Query for server state management, and React Hook Form with Zod for form handling. Vite is used for fast development and optimized builds. Mobile performance is optimized through lazy loading, disabling animations on smaller screens, and reduced motion support. UI provides an inline editing interface with document preview before download, and supports multi-format document export (PDF, DOCX, TXT) with watermarking for free users.

### Backend Architecture
The backend employs a hybrid approach, utilizing Node.js with Express.js and TypeScript for the primary API, and FastAPI (Python) for PDF processing and AI integration. Currently, in-memory storage with an abstraction layer is used, though a Drizzle ORM schema for PostgreSQL is defined for future migration.

### Authentication and Authorization
Clerk is used for modern, secure authentication, handling user authentication, session management, and OAuth. It integrates with both frontend and backend, using `VITE_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`. Usage limits (3 generations for free users, unlimited for Pro) are tracked per session.

### File Processing Architecture
PDF resume uploads are handled via Multer middleware. PDF text extraction is performed using the `pdfplumber` library in Python. File validation includes MIME type checking and a 10MB size limit.

### AI Integration Architecture
Deepseek API is fully integrated for intelligent content generation. This includes automated keyword extraction from job descriptions, ATS-compliant resume and cover letter creation, and advanced post-processing to ensure ATS-friendly formatting and validation. The system prevents generation of fake content and provides specific error messages with actionable guidance when PDF parsing fails. It also features a two-step AI generation process to ensure both optimized content and proper ATS formatting, preserving critical user information during optimization.

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible, unstyled React components.
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide React**: Icon library.
- **shadcn/ui**: Component library built on Radix UI and Tailwind.

### Data and State Management
- **TanStack React Query**: Server state management.
- **React Hook Form**: Performant forms library.
- **Zod**: TypeScript-first schema validation.

### Authentication
- **Clerk**: Authentication and user management platform (`@clerk/clerk-react`, `@clerk/express`).

### Database and ORM
- **Drizzle ORM**: Lightweight, type-safe ORM for PostgreSQL.
- **Neon Database**: Serverless PostgreSQL database service (configured).

### File Processing
- **Multer**: Middleware for `multipart/form-data` file uploads.
- **pdfplumber**: Python library for PDF text extraction.

### Development Tools
- **TypeScript**: Static type checking.
- **Vite**: Fast build tool and development server.
- **tsx**: TypeScript execution for Node.js development.
- **esbuild**: Fast JavaScript bundler.

### Routing and Navigation
- **Wouter**: Lightweight routing library for React.

### Date and Time
- **date-fns**: JavaScript date utility library.

## Recent Changes

### Landing Page Performance Optimizations (November 30, 2025)
- **Removed Testimonials Section**: Removed placeholder testimonials section pending real user testimonials
- **Removed Company Logos Carousel**: Eliminated animated brand logos marquee for faster load times
- **Simplified Features Section**: Removed framer-motion animations, replaced with lightweight CSS-only transitions
- **Reduced Hero Particles**: Decreased particle count from 20 to 8 and conditionally disabled on mobile
- **Simplified Background Pattern**: Replaced SVG pattern with CSS gradient for better performance
- **Conditional Background Blobs**: SVG blobs only render on desktop with animations enabled

### SEO & Search Engine Submissions (January 2026)
- **Google Search Console**: Site verified and indexed, visible on Google search
- **Bing Webmaster Tools**: Site imported from Google Search Console (auto-verified), covers Bing, Yahoo, and DuckDuckGo
- **Sitemap**: Located at `/sitemap.xml`, submitted to both Google and Bing
- **Robots.txt**: Configured at `/robots.txt` to allow all crawlers
- **Meta Tags**: Open Graph, Twitter Cards, and structured data implemented in index.html

### Mobile Performance Optimizations (November 27, 2025)
- **Viewport-Triggered Loading**: Created useIntersectionLoader hook for lazy loading below-the-fold sections
- **LazyLoadSection Component**: Wraps sections to defer loading until near viewport
- **Disabled Mobile Animations**: Particle effects, gradient shifts, and floating animations disabled on mobile (<768px)
- **Reduced Motion Support**: Full prefers-reduced-motion media query support for accessibility

### PostgreSQL/Neon Compute Cost Optimization (February 2026, extended April 2026)
- **In-Memory Cache Module**: Created `server/database/cache.ts` with TTL-based Map cache for subscription status, resume history, and individual resumes
- **Subscription Query Caching**: `getUserSubscription` cached with 120s TTL (up from 60s), invalidated on subscription updates and webhook events
- **Resume History Caching**: `getResumesByUserId` cached with 60s TTL (up from 30s), invalidated on insert/delete operations
- **Individual Resume Caching**: `getResumeById` now cached with 300s TTL, invalidated on delete
- **UPSERT for subscription writes**: `updateUserSubscription` now uses a single `INSERT...ON CONFLICT DO UPDATE` instead of SELECT+INSERT/UPDATE (halves DB queries per subscription event)
- **Removed Dynamic Imports**: Both `getUserSubscriptionStatus` helper and `updateUserSubscription` in routes.ts are now static imports — no `await import()` on hot paths
- **Removed Duplicate Storage Writes**: `/api/generate` no longer writes to both in-memory storage AND Neon DB (only Neon)
- **Optimized SELECT Queries**: Replaced `SELECT *` with explicit column lists in subscription and resume queries
- **Frontend Query Optimization**: All `useQuery` hooks for `/api/subscription/status` now use `staleTime: 30000` to prevent refetching on every component mount (header, AppShell, dashboard, generator, ResumeHistory)
- **Database Indexes**: Present on `user_id`, `created_at`, `session_id`, and `dodo_customer_id` columns

### Static Blog Page (April 24, 2026)
- **Zero DB Cost Blog**: Added a fully static blog with zero DB queries, zero new server endpoints — all content is bundled into the frontend JS by Vite
- **Content Data File**: `client/src/content/blog/posts.ts` — TypeScript array of 5 seed posts on ATS, resume writing, cover letters, formatting, tailoring; each post has `slug`, `title`, `date`, `excerpt`, `tags`, `readingTime`, and full HTML `content`
- **Blog Listing Page**: `/blog` — 2-column card grid with tags, dates, reading time, excerpts, "Read more" links, and a "Try CVGenie Free" CTA banner
- **Blog Post Page**: `/blog/:slug` — individual post with prose typography, tags, date/reading time meta, CTA, "More from the Blog" related posts, 404 fallback for unknown slugs
- **Header Navigation**: "Blog" link added to both desktop and mobile menus for non-authenticated visitors
- **Routes**: Registered `/blog` and `/blog/:slug` as lazy-loaded public routes in `App.tsx`
- **Sitemap**: All 5 post URLs + `/blog` listing added to `client/public/sitemap.xml`

### SaaS Dashboard App Shell (January 25, 2026)
- **AppShell Component**: Created new `client/src/components/app-shell/AppShell.tsx` with left sidebar navigation and top bar
- **Sidebar Navigation**: Dashboard, Generate Resume, ATS Score, Resume History (with Pro badge), Upgrade to Pro button, Help & Support
- **Top Bar**: Page title, theme toggle, user avatar with dropdown menu (email display, sign out)
- **Dashboard Redesign**: Updated to use AppShell layout with improved stat cards (larger values, smaller labels), quick action buttons, and cleaner activity section
- **Auth-Based Navigation**: Marketing nav (Features/Pricing) now hidden for logged-in users in both desktop and mobile header
- **Home Page Redirect**: Logged-in users automatically redirected from home (/) to dashboard (/dashboard)
- **Mobile Responsive**: Sidebar becomes collapsible drawer on mobile with smooth transitions