---
name: test-gen
description: Generate a test file for a given source file, following testing.md conventions
---

# Test Generation Skill

Input: **$ARGUMENTS**

## Step 1 — Read the source file
Read the full source file. Identify:
- All exported functions and their explicit TypeScript signatures
- All side effects (HTTP calls, DB calls, external services)
- Error paths (what can throw or return an error)

## Step 2 — Read testing rules
Read `.agents/rules/testing.md` and identify the correct mocking strategy for this file type.

## Step 3 — Determine test file path
- Source: `client/src/services/candidate.service.ts`
- Test:   `client/src/services/candidate.service.test.ts`
- Source: `server/controllers/candidate.controller.js`
- Test:   `server/controllers/candidate.controller.test.js`

## Step 4 — Generate test file
Generate with:
- One `describe` block matching the source file name
- One `it` block per exported function: happy-path
- One `it` block per function that can fail: error-path
- Correct mocks for HTTP client or DB calls per `testing.md`
- Test names in format: "should [behaviour] when [condition]"

## Step 5 — Write file and report
Write the generated test file. Report the path and list all generated test cases.
Remind the agent to complete the test bodies — stubs are marked with `// TODO`.
