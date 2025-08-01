# CVGenie - AI Resume & Cover Letter Generator

## Overview

CVGenie is a microSaaS application that uses AI to generate ATS-optimized resumes and personalized cover letters. Built with a modern tech stack, it features a clean, ProjectOS-inspired UI/UX and provides both free and pro tiers for users. The application allows users to upload their existing resume in PDF format, paste a job description, and receive optimized documents tailored for specific job applications.

## User Preferences

Preferred communication style: Simple, everyday language.

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
Currently implements a sessionless approach suitable for the free tier:

- **Session Tracking**: Random session IDs generated client-side
- **Usage Limits**: Tracked per session (3 generations for free users)
- **Future Authentication**: Schema prepared for user accounts and Pro subscriptions

### File Processing Architecture
The application handles PDF resume uploads with a flexible processing pipeline:

- **File Upload**: Multer middleware for handling multipart/form-data
- **PDF Processing**: pdfplumber library for text extraction from PDF files
- **Fallback System**: Graceful degradation when PDF libraries are unavailable
- **File Validation**: MIME type checking and size limits (10MB max)

### AI Integration Architecture
Designed to integrate with external AI services for content generation:

- **API Integration**: Prepared for Deepseek API integration
- **Content Generation**: Optimized resume and cover letter creation
- **Error Handling**: Graceful fallbacks for AI service failures

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