---
paths:
  - "server/middleware/**"
  - "server/config/**"
  - "client/src/services/**"
  - "client/src/types/**"
---
# Security Rules

## Authentication
- Server: JWT-based auth via jsonwebtoken — validation happens in middleware
- Google OAuth via Passport — configured in `server/config/passport.js`
- Client: Auth state managed via Redux slice — token stored in localStorage
- Protected routes on client must check auth state before rendering

## Secrets
- No secrets in source code — all URLs and keys come from environment variables
- Never log auth tokens, passwords, or user PII
- `.env` files are gitignored — never commit them
- Server env vars loaded via `dotenv` from `.env` file

## Input validation
- All form data validated before API calls (frontend)
- Server uses `express-validator` for request validation
- Never pass raw query strings to MongoDB queries without sanitization

## API security
- Auth middleware protects authenticated routes (server)
- Never expose admin endpoints without auth check
- All user-supplied IDs scoped to the authenticated user's resources to prevent IDOR
- CORS configured on server to allow only the frontend origin

## File uploads
- Uploads handled via Multer — validate file types and sizes
- Uploaded files stored in `server/uploads/`
- Only allow expected file types (PDF, DOC, DOCX, images)
