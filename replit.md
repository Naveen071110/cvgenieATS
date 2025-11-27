# CVGenie - AI Resume & Cover Letter Generator

## Overview

CVGenie is a microSaaS application that uses AI to generate ATS-optimized resumes and personalized cover letters. Built with a modern tech stack, it features a clean, ProjectOS-inspired UI/UX and provides both free and pro tiers for users. The application allows users to upload their existing resume in PDF format, paste a job description, and receive optimized documents tailored for specific job applications.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

### Dodo Payments Direct Checkout Implementation (November 1, 2025)
- **MAJOR CHANGE**: Switched from API-based checkout to direct Dodo Payments checkout links
- **Simplified Integration**: Now generates direct checkout URLs instead of calling Dodo Payments API
- **Checkout URL Format**: `https://checkout.dodopayments.com/buy/{productId}?prefilled_email=...&customer_reference={userId}`
- **Eliminated API Issues**: No more API key/environment mismatch problems - uses proven working checkout page
- **User Tracking**: Passes userId as `customer_reference` parameter for webhook identification
- **Enhanced Webhook**: Updated webhook to extract userId from multiple possible locations (customer_reference, metadata)
- **Fallback User Lookup**: Webhook can identify users by customer_reference, Dodo customer ID, or Clerk email lookup
- **Comprehensive Logging**: Added detailed logging for checkout link generation with user info
- **Diagnostic Tools**: Created DODO_PAYMENTS_DIAGNOSTIC.md and IMPLEMENTATION_SUMMARY.md for troubleshooting

### Pro Subscription Checkout Fix (January 27, 2025)
- **Enhanced Email Extraction**: Improved checkout flow to reliably extract user email from Clerk
- **Multi-Source Email Retrieval**: System tries Clerk backend API first, then falls back to session claims with multiple field name variations
- **Production-Ready**: Fixed "please add email to profile" error on production by using clerkClient.users.getUser()
- **Robust Fallback**: Added comprehensive fallback logic to try multiple email field names (email, primary_email, email_address, emailAddress)
- **Better Error Handling**: Added detailed logging to track email extraction success/failure
- **Name Extraction**: Enhanced name extraction from Clerk user profile with multiple fallback options

### Clerk Authentication Integration (January 27, 2025)
- **Complete Auth Migration**: Migrated from Supabase to Clerk for user authentication
- **Removed Dependencies**: Uninstalled @supabase/supabase-js package completely
- **Clerk Packages Installed**: Added @clerk/clerk-react and @clerk/express for full-stack authentication
- **ClerkProvider Integration**: Wrapped application with ClerkProvider in App.tsx for seamless auth state management
- **Compatibility Layer**: Created useAuth hook wrapper around Clerk functionality for backward compatibility
- **Modernized Login Dialog**: Updated to use Clerk's SignIn component with custom styling
- **Environment Variables**: Added VITE_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY for secure authentication
- **No More Custom Auth**: Removed all custom authentication logic, forms, and password handling
- **Simplified Architecture**: Clerk handles all authentication flows including OAuth, sessions, and user management

### Latest UI/UX Improvements (January 6, 2025)
- **FAQ Section Optimization**: Removed redundant help section with contact support and live chat options to reduce clutter
- **Improved Spacing**: Reduced whitespace throughout FAQ component for better visual density and user experience
- **Hero Section Update**: Changed main heading from "Transform Your Career with" to "Transform Your Resume for" for clearer value proposition
- **Component Cleanup**: Streamlined FAQ component structure by removing unnecessary help section and reducing margins/padding

### Multi-Format Document Export (November 27, 2025)
- **PDF Export**: Professional PDF generation with proper formatting, section headers, and bullet points using pdf-lib
- **DOCX Export**: Microsoft Word document export with styled headers, proper structure, and professional formatting
- **TXT Export**: Plain text export for maximum compatibility
- **ExportDropdown Component**: Clean dropdown menu for format selection with loading states
- **Watermark for Free Users**: Free tier exports include CVGenie watermark, removed for Pro subscribers
- **Dark Mode Support**: Export dropdown fully styled for both light and dark themes

### Enhanced Generator Experience
- **Inline Editing Interface**: Results now display on-screen with edit/save functionality instead of immediate downloads
- **Document Preview**: Users can review generated content in formatted preview before editing or downloading
- **Enhanced User Flow**: Upload → Generate → Review/Edit → Download workflow implemented

### Improved AI Generation
- **Advanced Deepseek Integration**: Implemented comprehensive keyword extraction and ATS compliance
- **Keyword-Based Optimization**: Automatic extraction of top 10 keywords from job descriptions
- **ATS Compliance Validation**: Post-processing ensures proper formatting, section validation, and ATS-friendly output
- **Enhanced Prompts**: Detailed prompts following ATS best practices for better generation quality

### Latest Bug Fixes and Validation Improvements (Latest Update - January 5, 2025)
- **Eliminated Hardcoded Fallbacks**: Completely removed all fallback resume generation that created fake content like "John Doe" when PDF parsing failed
- **Robust Content Validation**: Added comprehensive validation that checks for English words, resume keywords, sentence structure, and content quality
- **Sample Resume Template**: When PDF parsing fails, users now see a properly formatted sample resume template they can copy and use as a reference
- **Enhanced Error Display**: Error messages include helpful guidance and a "Copy Sample" button for user convenience
- **Clear Error Messaging**: Users receive specific error messages with actionable guidance: "We couldn't extract content from this file. Please upload a text-based resume PDF with readable content"
- **Enhanced Logging**: Added detailed logging showing first 300 characters of failed extractions for debugging
- **Strict Anti-Fake Content**: System returns proper errors with helpful examples instead of generating placeholder resumes when parsing fails

### Previous ATS Compliance Improvements (January 5, 2025)
- **Two-Step AI Generation**: Implemented dual-phase process - first generates optimized content, then ensures proper ATS formatting
- **Guaranteed ATS Formatting**: Second Deepseek call specifically formats resume with proper section headers, bullet points, and spacing
- **Structured Data Parsing**: Added resume parsing to extract and preserve original contact information, work experience, and education
- **Data Preservation**: Critical information (emails, phone numbers, company names, dates) is now strictly preserved during optimization
- **Enhanced Formatting**: Post-processing ensures proper ATS section headers and bullet point formatting
- **Keyword Integration**: Intelligent extraction and natural incorporation of job description keywords
- **Clean Output Display**: Fixed critical issue where original PDF content was showing alongside generated resume - now displays only the formatted ATS resume
- **Professional Layout**: Improved resume structure with proper section headers in ALL CAPS, clean bullet points, and ATS-compliant formatting
- **Fallback Protection**: Robust error handling with ATS-compliant fallback generation ensures consistent output quality

## System Architecture

### Frontend Architecture
The frontend is built with React 18 and TypeScript, utilizing a modern component-based architecture:

- **UI Framework**: React with TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

The application follows a single-page application (SPA) pattern with modular components organized by feature areas (header, hero, generator, features, pricing, etc.).

### Backend Architecture
The backend uses a hybrid approach with both Node.js/Express and FastAPI:

- **Primary API**: Node.js with Express.js and TypeScript
- **Secondary API**: FastAPI (Python) for PDF processing and AI integration
- **Runtime**: Node.js with ESM modules
- **Development**: tsx for TypeScript execution in development
- **Storage**: In-memory storage with interface abstraction for future database integration

### Data Storage Solutions
The application currently uses in-memory storage with a clean abstraction layer:

- **Storage Interface**: IStorage interface defining operations for users, usage sessions, and generations
- **Current Implementation**: MemStorage class using JavaScript Maps
- **Database Schema**: Drizzle ORM schema defined for PostgreSQL (ready for future migration)
- **Session Management**: Browser-based session tracking using randomly generated session IDs

The schema includes three main entities:
- Users (for future authentication)
- Usage Sessions (tracking free tier limits)
- Generations (storing resume/cover letter pairs)

### Authentication and Authorization
The application uses Clerk for modern, secure authentication:

- **Authentication Provider**: Clerk handles all user authentication and session management
- **Frontend Integration**: ClerkProvider wraps the application, providing auth context throughout
- **Auth Hooks**: useAuth() compatibility hook wraps Clerk's useUser and useClerk hooks
- **Sign In/Sign Up**: Clerk's pre-built SignIn component handles all authentication flows
- **OAuth Support**: Clerk provides built-in OAuth integration (Google, GitHub, etc.)
- **Session Management**: Automatic session handling with secure token management
- **Usage Limits**: Tracked per session (3 generations for free users, unlimited for Pro)
- **Environment Variables**: 
  - `VITE_CLERK_PUBLISHABLE_KEY`: Frontend Clerk key
  - `CLERK_SECRET_KEY`: Backend Clerk key for protected routes
- **Domain Configuration**: Production keys configured for cvgenieats.com domain

### File Processing Architecture
The application handles PDF resume uploads with a flexible processing pipeline:

- **File Upload**: Multer middleware for handling multipart/form-data
- **PDF Processing**: pdfplumber library for text extraction from PDF files
- **Fallback System**: Graceful degradation when PDF libraries are unavailable
- **File Validation**: MIME type checking and size limits (10MB max)

### AI Integration Architecture
Full integration with Deepseek API for intelligent content generation:

- **API Integration**: Complete Deepseek API integration with keyword extraction
- **Content Generation**: ATS-compliant resume and cover letter creation with intelligent keyword matching
- **Keyword Extraction**: Automated extraction of top 10 keywords from job descriptions
- **ATS Compliance**: Advanced post-processing for ATS-friendly formatting and validation
- **Error Handling**: Graceful fallbacks for AI service failures with structured responses

### Development and Build System
Modern development toolchain optimized for TypeScript and React:

- **Monorepo Structure**: Shared types and schemas between client and server
- **Path Aliases**: Clean import paths using TypeScript path mapping
- **Hot Reloading**: Vite HMR for rapid development
- **Production Build**: Optimized builds with code splitting and tree shaking

## External Dependencies

### UI and Styling
- **Radix UI**: Comprehensive set of accessible, unstyled React components
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Lucide React**: Icon library providing consistent iconography
- **shadcn/ui**: Pre-built component library built on Radix UI and Tailwind

### Data and State Management
- **TanStack React Query**: Server state management with caching, synchronization, and background updates
- **React Hook Form**: Performant forms library with minimal re-renders
- **Zod**: TypeScript-first schema validation library

### Authentication
- **Clerk**: Modern authentication and user management platform
  - Frontend: @clerk/clerk-react for React components and hooks
  - Backend: @clerk/express for Express.js middleware and protected routes
  - Provides OAuth, email/password, magic links, and more

### Database and ORM
- **Drizzle ORM**: Lightweight, type-safe ORM for PostgreSQL
- **Neon Database**: Serverless PostgreSQL database service (configured but not yet active)

### File Processing
- **Multer**: Middleware for handling multipart/form-data file uploads
- **pdfplumber**: Python library for PDF text extraction and processing

### Development Tools
- **TypeScript**: Static type checking and enhanced developer experience
- **Vite**: Fast build tool and development server
- **tsx**: TypeScript execution for Node.js development
- **esbuild**: Fast JavaScript bundler for production builds

### Routing and Navigation
- **Wouter**: Lightweight routing library for React applications

### Date and Time
- **date-fns**: Modern JavaScript date utility library for date manipulation

The architecture is designed to be scalable and maintainable, with clear separation of concerns and preparation for future features like user authentication, payment processing, and advanced AI integrations.