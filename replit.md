# MedConnect - Digital Healthcare Platform

## Overview

MedConnect is a comprehensive digital healthcare platform designed to modernize medical practice management. It provides doctors with tools for patient management, appointment scheduling, medical records, lab test coordination, and AI-powered diagnostic assistance. The application streamlines healthcare workflows while maintaining compliance with medical data standards and improving patient care delivery.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with custom styling
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for end-to-end type safety
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **API Design**: RESTful API endpoints with consistent error handling

### Monorepo Structure
- **client/**: React frontend application
- **server/**: Express.js backend API
- **shared/**: Common schemas and types shared between frontend and backend
- **migrations/**: Database migration files

## Key Components

### User Management System
- **Multi-role Authentication**: Supports doctors, patients, and admin roles
- **Secure Registration/Login**: JWT tokens with bcrypt password hashing
- **Profile Management**: Comprehensive user profiles with role-specific fields

### Patient Management
- **Aadhaar Integration**: Support for Indian national ID verification
- **Comprehensive Profiles**: Medical history, allergies, insurance information
- **Search and Filter**: Advanced patient search capabilities
- **Emergency Contacts**: Critical contact information management

### Appointment System
- **Flexible Scheduling**: Support for in-person and telemedicine appointments
- **Doctor Availability**: Configurable time slots and availability management
- **Status Tracking**: Real-time appointment status updates
- **Calendar Integration**: Today's schedule and upcoming appointments view

### Medical Records Management
- **Digital Records**: Comprehensive medical record storage
- **Document Types**: Consultations, diagnoses, prescriptions, lab results
- **Access Control**: Confidential record handling and permissions
- **Search and Organization**: Easy retrieval and categorization

### Lab Test Coordination
- **Test Ordering**: Integration with multiple lab providers
- **Result Management**: Digital result storage and analysis
- **Insurance Integration**: Insurance coverage tracking
- **Status Monitoring**: Real-time test status updates

### AI-Powered Diagnostics
- **Symptom Checker**: AI-assisted preliminary diagnosis
- **Risk Assessment**: Automated severity and urgency analysis
- **Decision Support**: Evidence-based recommendations for doctors
- **Confidence Scoring**: AI prediction confidence metrics

## Data Flow

### Authentication Flow
1. User registration/login through secure endpoints
2. JWT token generation and validation
3. Role-based access control throughout the application
4. Session management with secure token storage

### Patient Care Workflow
1. Patient registration and profile creation
2. Appointment scheduling and management
3. Medical consultation and record creation
4. Lab test ordering and result processing
5. AI-assisted diagnosis and treatment recommendations
6. Follow-up scheduling and care continuity

### Data Synchronization
- Real-time updates using TanStack Query
- Optimistic updates for improved user experience
- Background data refresh and cache invalidation
- Error handling and retry mechanisms

## External Dependencies

### Database and Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **WebSocket Support**: Real-time features via ws library
- **Connection Pooling**: Efficient database connection management

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Consistent icon library
- **Custom Theming**: Healthcare-specific color scheme and branding

### Development Tools
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundling
- **PostCSS**: CSS processing and optimization
- **Replit Integration**: Development environment optimization

### Security and Validation
- **Zod**: Runtime type validation and schema definition
- **bcrypt**: Secure password hashing
- **jsonwebtoken**: JWT token management
- **Form Validation**: React Hook Form with Zod resolvers

## Deployment Strategy

### Development Environment
- **Replit Integration**: Seamless development environment setup
- **Hot Module Replacement**: Fast development iteration
- **Error Overlay**: Development-time error reporting
- **Environment Configuration**: Separate development and production configs

### Production Build
- **Vite Build**: Optimized frontend bundle
- **ESBuild Backend**: Compiled Node.js server
- **Static Asset Serving**: Efficient static file delivery
- **Database Migrations**: Automated schema updates

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: JSON Web Token signing secret
- `NODE_ENV`: Environment specification (development/production)

## Changelog
- July 04, 2025. Initial setup

## User Preferences
Preferred communication style: Simple, everyday language.