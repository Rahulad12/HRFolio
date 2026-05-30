---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.test.js"
  - "**/__tests__/**"
---
# Testing

> Run `/test-gen <source-file>` to generate test stubs — do not write test files from scratch.

## Structure
- Co-locate tests with source files inside the module folder
- One describe block per component, function, or class
- Test names: "should [behaviour] when [condition]"

## Frontend — what to test
- Service functions: mock HTTP client, assert correct endpoint and payload
- Hooks: test state transitions
- Components: user interaction and visible output only — not implementation details
- Redux slices: test reducer logic and async thunk states

## Backend — what to test
- Controllers: test request/response handling
- Models: test Mongoose schema validation
- Middleware: test auth guards and validation

## Mocking
- Mock HTTP calls at the service layer for frontend tests
- Mock Mongoose models for backend controller tests
- Never mock implementation details — mock at boundaries (HTTP, DB)

## Coverage expectations
- All service functions: happy-path + one error-path test minimum
- All API endpoints: 200, 400, 401/403 tested
- Frontend components: user-facing behaviour only
- Redux slices: initial state, all reducer cases, async thunk pending/fulfilled/rejected
