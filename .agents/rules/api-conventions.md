---
paths:
  - "client/src/services/**"
  - "client/src/slices/**"
  - "server/src/controllers/**"
  - "server/src/routes/**"
  - "server/src/middleware/**"
---
# API Conventions

## Service layer (frontend — client/src/services/)
- Raw async functions only — no UI logic, no Redux dispatch
- Use fetch or axios for HTTP calls (follow existing pattern)
- All functions return typed responses

## Service layer (backend — server/src/)
- Controllers call services / models — never put business logic in the route handler
- Route files define paths and attach middleware only

## Layer responsibility (backend — strictly enforced)

| Layer | Allowed | Forbidden |
|---|---|---|
| `routes` | Register paths, attach middleware | Any logic, DB access |
| `controllers` | Parse req, call model/service, send res | Business logic |
| `model` | Mongoose schema + model definitions | HTTP concerns |

## Data fetching (frontend)
- Use Redux Toolkit Query or createAsyncThunk for API calls (existing pattern)
- Loading and error states managed via Redux slice state
- Import services from the service file

## Mutations (frontend)
- Use Redux slices with createAsyncThunk
- On success: update local state + show notification
- On error: handle via rejected action + toast/notification

## API response shape
- Success: `{ success: true, data: T }` (existing pattern)
- Error: `{ success: false, message: string }`
- Never return raw database models — always map to a response shape

## Error handling
- Global error handler middleware on server (already exists in server/src/legacy/index.js)
- 401 / 403 handled on frontend via auth state checks — redirect to login
- Never access `error.response` directly in components — use Redux state
