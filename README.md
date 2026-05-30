# HRFolio — CV Manager

A fullstack recruitment management platform for managing candidate CVs through the complete hiring pipeline — from application to offer.

**Tech:** React 18 / TypeScript / Vite / Ant Design / Tailwind / Redux Toolkit · Node.js / Express 5 / MongoDB / Mongoose / JWT / Google OAuth

---

## Features

- **Candidate Management** — Add, view, update, delete profiles with resume uploads
- **Interview Pipeline** — Schedule interviews, track rounds (first → second → third), record feedback & ratings
- **Assessments** — Create technical/behavioural assessments, assign to candidates, score with auto-pass threshold (40/100)
- **Offers** — Generate offer letters, track status (draft → sent → accepted/rejected)
- **Email Templates** — Manage templates with `{{variable}}` placeholders, trigger-based sending
- **Email Integration** — Auto-send notifications for interviews, assessments, offers, rejections (Gmail SMTP)
- **Google OAuth** — Login via Google
- **Search & Filters** — Full-text search across candidates, filter by status/skills/level
- **Pipeline State Machine** — Strict stage progression: Shortlisted → Assessment → First → Second → Third → Offered → Hired
- **Activity Logging** — Full audit trail across candidates, interviews, assessments, offers

## Project Structure

```
HRFolio/
├── client/              React + Vite frontend
│   └── src/
│       ├── pages/       Page components
│       ├── routes/      Route definitions (public/protected)
│       ├── services/    RTK Query API layer
│       ├── slices/      Redux state
│       ├── types/       TypeScript type definitions
│       ├── component/   Shared UI components
│       └── ...
├── server/              Express API backend
│   ├── src/
│   │   ├── index.ts     Entry point
│   │   ├── app.ts       Express app (mounts legacy + new modules)
│   │   ├── legacy/      Existing JS code (controllers, models, routes, middleware)
│   │   └── modules/     New TypeScript modules
│   ├── uploads/         Resume files (runtime)
│   └── ...
└── .agents/             Agent workspace (rules, skills, wiki)
```

## Quick Start

```bash
# Prerequisites: Node.js 18+, MongoDB, Google OAuth credentials

# Server
cd server
cp ../cv_manager.env .env     # configure your own env vars
npm install
npm run data:seed             # seed sample data
npm run dev                   # tsx watch (http://localhost:5000)

# Client (separate terminal)
cd client
npm install
npm run dev                   # vite (http://localhost:5173)
```

### Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing key |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `FRONTEND_URL` | Frontend origin for OAuth redirect |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail SMTP credentials |
| `VITE_API_URL` | Backend API URL (client-side) |

## Dev Commands

```bash
cd client && npm run dev      # dev server
cd client && npm run build    # tsc -b && vite build
cd client && npm run lint     # ESLint
cd server && npm run dev      # tsx watch
cd server && npm run build    # tsc
cd server && npm start        # production
cd server && npm run data:seed
cd server && npm run data:destroy
```

## API Overview

All endpoints prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

| Module | Key Endpoints |
|---|---|
| Auth | `GET /api/auth/google` — OAuth login |
| Candidates | `POST/GET /api/candidate` — CRUD + stage/reject |
| Interviews | `POST/GET /api/interview` — schedule, update, delete |
| Assessments | `POST/GET /api/assessment` — CRUD + assign + score |
| Offers | `POST/GET /api/offer` — create, update, delete |
| Email Templates | `POST/GET /api/email` — CRUD + send |
| Search | `GET /api/search?searchText=...` |
| Uploads | `POST /api/uploads/resume` — file upload |

Detailed API reference: [Wiki → API Reference](https://github.com/Rahulad12/HRFolio/wiki)

## Documentation

- **[Project Wiki](https://github.com/Rahulad12/HRFolio/wiki)** — Architecture, database, deployment, business rules, technical debt

## License

MIT — © 2026 Rahul Adhikari

---

<div align="center">
  <a href="https://www.adhikarirahul.com.np/">Portfolio</a>
</div>
