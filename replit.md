# PrepWise - AI-Powered Interview Practice App

## Overview
PrepWise is a Next.js application that helps users practice for job interviews using AI-powered feedback and voice interactions. The app uses Firebase for authentication and database, Google AI (Gemini) for generating interview questions, and Vapi AI for voice-based interview simulation.

## Architecture
- **Frontend**: Next.js 15 with React 19, Tailwind CSS v4
- **Backend**: Next.js API routes
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **AI Services**: Google Gemini for question generation, Vapi AI for voice interactions
- **Deployment**: Configured for Replit autoscale deployment

## Current Status
- ✅ Dependencies installed and configured
- ✅ Development server running on port 5000
- ✅ Tailwind CSS v4 configured with custom styling
- ✅ Next.js configured for Replit proxy support
- ✅ Firebase integrations added (blueprint)
- ✅ Google AI integration added (blueprint)
- ✅ Error handling for missing environment variables
- ✅ Deployment configuration set up

## Required Environment Variables
The following environment variables need to be configured for full functionality:

### Firebase Client (NEXT_PUBLIC_*)
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

### Firebase Admin
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY

### AI Services
- GEMINI_API_KEY (Google AI)
- NEXT_PUBLIC_VAPI_WEB_TOKEN (Vapi AI)
- NEXT_PUBLIC_VAPI_WORKFLOW_ID (Vapi AI)

## Setup Instructions
1. The app is ready to run with demo configuration
2. For production use, configure the Firebase and AI service environment variables
3. The app gracefully handles missing configurations with appropriate error messages
4. Deployment is configured for autoscale on Replit

## Recent Changes (Import Setup)
- Updated Next.js config for Replit compatibility
- Added error handling for database operations
- Fixed authentication flow
- Configured deployment settings
- Added comprehensive environment variable documentation

## Development
- Run `npm run dev` to start development server
- Server runs on 0.0.0.0:5000 for Replit compatibility
- Hot reload enabled with Turbopack