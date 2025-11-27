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