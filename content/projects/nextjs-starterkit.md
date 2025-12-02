---
name: Next.js StarterKit
year: 2025
studyCase: Personal Project
description: A production-ready Next.js 16 starter template featuring comprehensive authentication system with email/password, social login, two-factor authentication, session management, and modern full-stack development tooling built for enterprise applications.
techStack: ["Next.js", "React", "TypeScript", "PostgreSQL", "Prisma ORM", "Better Auth", "tRPC", "TanStack Query", "TanStack Form", "Tailwind CSS 4", "Shadcn UI", "Zod"]
thumbnail: /images/projects/nextjs-starterkit.png
linkLive: https://nextjs-starterkit.ppabimanyu.com
linkGithub: https://github.com/ppabimanyu/nextjs-starterkit
---

# Next.js Enterprise Starter Kit: A Modern Full-Stack Application

## Project Overview

The Next.js Enterprise Starter Kit is a production-ready, full-stack web application template designed to accelerate the development of modern web applications. Built on Next.js 16 with React 19, this starter kit provides a comprehensive authentication system, user management features, and a robust technical foundation that enables developers to focus on building business logic rather than infrastructure.

This project addresses a common pain point in modern web development: the repetitive work of setting up authentication, database connections, type-safe APIs, and UI components for every new project. By providing a battle-tested foundation with best practices baked in, developers can launch production-ready applications in hours instead of weeks.

The starter kit is ideal for SaaS applications, internal tools, customer portals, and any web application requiring secure user authentication and management. It demonstrates enterprise-grade patterns including authentication flows, session management, two-factor authentication, email verification, password recovery, and social login integration.

## Key Features

### Comprehensive Authentication System

The authentication system is powered by Better Auth, a modern authentication library that provides enterprise-grade security out of the box. The implementation includes:

- **Multi-provider Authentication**: Support for traditional email/password authentication alongside social login providers (Google and GitHub), allowing users to choose their preferred authentication method.

- **Two-Factor Authentication (2FA)**: TOTP-based two-factor authentication with QR code setup for popular authenticator apps. The system generates backup codes for account recovery, ensuring users never lose access to their accounts.

- **Email Verification**: Configurable email verification for new user registrations and email changes, preventing unauthorized access and ensuring valid contact information.

- **Password Management**: Complete password lifecycle management including secure password reset via email, password change functionality for authenticated users, and automatic password hashing using industry-standard algorithms.

- **Session Management**: Advanced session tracking with device and location information, support for multiple concurrent sessions, and the ability to remotely terminate individual sessions for enhanced security.

### Type-Safe Full-Stack Architecture

The application leverages tRPC to provide end-to-end type safety from the database to the UI:

- **Type-Safe APIs**: Automatically generated TypeScript types for all API endpoints eliminate runtime errors and provide exceptional developer experience with autocomplete and compile-time validation.

- **Input Validation**: Zod schemas validate all inputs at the API boundary, ensuring data integrity and providing clear error messages when validation fails.

- **Automatic Serialization**: SuperJSON handles automatic serialization of complex types like dates and BigInts, eliminating manual conversion logic.

### Modern User Interface

Built with Radix UI primitives and styled with Tailwind CSS 4, the UI provides:

- **Accessible Components**: All UI components follow WAI-ARIA guidelines, ensuring the application is usable by everyone.

- **Dark/Light Theme**: Seamless theme switching with system preference detection using next-themes.

- **Responsive Design**: Mobile-first responsive layouts that work across all device sizes.

- **Form Handling**: TanStack React Form provides performant form state management with built-in validation and error handling.

### Developer Experience

The starter kit prioritizes developer experience with:

- **Type Safety**: End-to-end TypeScript coverage with strict type checking.

- **Environment Variable Validation**: Type-safe environment variables using @t3-oss/env-nextjs with Zod validation, catching configuration errors at build time.

- **Database Management**: Prisma ORM provides type-safe database queries with an intuitive schema definition language.

- **Hot Module Replacement**: Fast refresh during development for instant feedback.

## Tech Stack

### Frontend Technologies

**Next.js 16** serves as the React framework, providing server-side rendering, static site generation, and the App Router for file-based routing. The framework's built-in optimization features including automatic code splitting, image optimization, and font optimization ensure excellent performance.

**React 19** powers the UI layer with its component-based architecture. The latest version provides enhanced performance through automatic batching and improved server components support.

**TypeScript 5** provides static type checking throughout the application, catching errors at compile time and providing excellent IDE support with autocomplete and inline documentation.

**Tailwind CSS 4** handles all styling with utility-first CSS classes. The latest version introduces improved performance and a streamlined configuration system.

**Radix UI** provides unstyled, accessible component primitives that form the foundation of the UI library. These components are highly customizable and follow accessibility best practices.

**TanStack React Query** manages server state with intelligent caching, background updates, and automatic garbage collection. It eliminates the need for boilerplate data fetching code.

**TanStack React Form** handles form state management with performant validation and seamless integration with Zod schemas.

### Backend Technologies

**tRPC** creates type-safe APIs without code generation. Client and server share TypeScript types, eliminating API documentation needs and runtime type errors.

**Better Auth** provides the authentication infrastructure with support for multiple authentication strategies, session management, and security features like CSRF protection and secure cookie handling.

**Prisma 7** serves as the ORM layer, providing type-safe database access with an intuitive schema definition language and powerful migration system. The Prisma Client generates TypeScript types directly from the database schema.

**PostgreSQL** acts as the primary database, chosen for its reliability, performance, and rich feature set including ACID compliance and advanced query capabilities.

**Zod** validates data at runtime with TypeScript-first schema validation. It integrates seamlessly with both tRPC and TanStack Form.

### Development Tools

**@t3-oss/env-nextjs** validates environment variables at build time, preventing deployment of misconfigured applications.

**ESLint** enforces code quality and consistency with configurable linting rules.

**Docker Compose** provides local PostgreSQL development environment for consistent development across team members.

## System Architecture

### Application Structure

The application follows Next.js App Router conventions with grouped routes for clear separation of concerns:

```
├── app/
│   ├── (dashboard)/           # Protected dashboard routes
│   │   ├── _components/       # Dashboard-specific components
│   │   ├── dashboard/         # Main dashboard page
│   │   └── settings/          # User settings
│   │       ├── appearance/    # Theme settings
│   │       ├── password/      # Password change
│   │       ├── profile/       # Profile management
│   │       ├── sessions/      # Active sessions
│   │       └── two-factor-auth/ # 2FA configuration
│   ├── (legal)/               # Legal pages (terms, privacy)
│   ├── api/                   # API routes
│   ├── auth/                  # Authentication pages
│   │   ├── (public-only)/     # Public auth routes
│   │   │   ├── 2fa/           # 2FA verification
│   │   │   ├── forgot-password/
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   └── reset-password/    # Password reset
│   └── support/               # Support page
├── components/
│   ├── ui/                    # Reusable UI components
│   └── ...                    # Shared components
├── generated/                 # Generated Prisma client
├── hooks/                     # Custom React hooks
├── lib/
│   ├── auth.ts               # Better Auth configuration
│   ├── auth-client.ts        # Auth client utilities
│   ├── mail-sender.ts        # Email sending utilities
│   ├── mail-template.ts      # Email templates
│   ├── prisma.ts             # Prisma client instance
│   ├── trpc/                 # tRPC configuration
│   └── utils.ts              # Utility functions
├── prisma/
│   ├── migrations/           # Database migrations
│   └── schema.prisma         # Database schema
└── public/                   # Static assets
```

This structure uses route groups (denoted by parentheses) to organize related routes without affecting the URL structure. The `(dashboard)` group shares a common layout with authentication requirements, while `(public-only)` routes redirect authenticated users to the dashboard.

### Data Flow Architecture

The application implements a unidirectional data flow:

1. **Client Layer**: React components render UI and handle user interactions
2. **Query Layer**: TanStack Query manages server state, caching, and synchronization
3. **API Layer**: tRPC procedures receive requests, validate inputs, and execute business logic
4. **Service Layer**: Authentication and database operations are handled by specialized services
5. **Database Layer**: Prisma translates operations into SQL queries for PostgreSQL

This layered architecture ensures separation of concerns, making the codebase maintainable and testable.

### Authentication Flow

The authentication system implements several critical flows:

**Sign-Up Flow**: Users provide email and password → Better Auth hashes password → User record created → Verification email sent (if enabled) → User redirects to dashboard or verification pending page.

**Sign-In Flow**: User provides credentials → Better Auth validates password → Session created with secure token → Cookie set with httpOnly and secure flags → User redirects to dashboard.

**2FA Flow**: User enables 2FA in settings → QR code generated with TOTP secret → User scans with authenticator app → Backup codes generated → 2FA required on subsequent logins.

**Password Reset Flow**: User requests reset → Token generated and emailed → User clicks link with token → New password set → All sessions invalidated except current.

### Database Schema Design

The database implements a relational model optimized for authentication:

**User Table**: Stores core user information including email, name, and verification status. The `twoFactorEnabled` flag controls 2FA requirement.

**Session Table**: Tracks active sessions with token, expiration, IP address, and user agent. Foreign key relationship with User enables cascading deletes.

**Account Table**: Stores OAuth provider connections with access tokens and refresh tokens. Supports multiple providers per user.

**Verification Table**: Temporary storage for email verification and password reset tokens with expiration timestamps.

**TwoFactor Table**: Stores TOTP secrets and encrypted backup codes for 2FA-enabled users.

All tables use UUIDs for primary keys, providing better security than sequential integers. Indexes on frequently queried columns (userId, email, token) optimize query performance.

## Conclusion

The Next.js Enterprise Starter Kit represents a modern approach to full-stack web development, combining powerful technologies into a cohesive, production-ready template. By handling the complex infrastructure of authentication, user management, type-safe APIs, and UI components, it enables developers to focus on building unique features for their applications.

The technical decisions prioritize developer experience without sacrificing security or performance. End-to-end type safety catches errors early, while the modular architecture allows easy customization and extension. Whether building a SaaS product, internal tool, or customer portal, this starter kit provides the solid foundation needed to succeed.

With comprehensive documentation, clear code organization, and modern development practices, teams can onboard quickly and maintain the codebase confidently. The starter kit continues to evolve with new features and improvements, ensuring it remains a valuable foundation for Next.js applications.
