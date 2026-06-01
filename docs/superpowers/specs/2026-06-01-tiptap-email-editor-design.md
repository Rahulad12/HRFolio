# TipTap Email Template Editor — Design Spec

**Goal:** Replace the raw textarea in `EmailTemplateFormModal` with a TipTap WYSIWYG editor so non-technical HR users can compose email templates without knowing HTML syntax or variable placeholder format.

**Date:** 2026-06-01

---

## Context

The current `EmailTemplateFormModal` uses a plain `<TextArea>` for the email body. Users must manually type `{{variableName}}` syntax and raw HTML tags (`<b>`, `<br>`, etc.). This is error-prone for non-technical HR staff — a mistyped `{{` breaks the entire variable substitution.

The backend stores the body as an HTML string and replaces `{{variableName}}` tokens at send time. The preview modal renders body with `dangerouslySetInnerHTML` + DOMPurify.

---

## Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Variable appearance | Blue chip pills (non-editable nodes) | Can't mistype; visually distinct from text |
| Variable insertion | Always-visible sidebar with clickable chips | All variables visible at a glance; one click inserts |
| Formatting | Toolbar: Bold, Italic, Underline, Paragraph | Covers all email formatting needs |
| Output format | HTML string (same as current) | Backend unchanged; preview modal unchanged |

---

## Architecture

### New files
- `client/src/modules/emails/components/editor/VariableChipExtension.ts` — TipTap custom Node extension that renders variable chips as non-editable inline nodes. Serialises to `{{variableName}}` in HTML output.
- `client/src/modules/emails/components/editor/EditorToolbar.tsx` — B / I / U toolbar component that calls TipTap `editor.chain()` commands.
- `client/src/modules/emails/components/editor/VariableSidebar.tsx` — Scrollable panel of clickable variable chips with a search/filter input. On click, calls `editor.commands.insertVariableChip(name)`.
- `client/src/modules/emails/components/editor/TemplateEditor.tsx` — Composes the TipTap `useEditor` hook, `EditorToolbar`, `EditorContent`, and `VariableSidebar` into the full editor UI. Accepts `value: string` and `onChange: (html: string) => void` props so it integrates with the existing Ant Design Form.

### Modified files
- `client/src/modules/emails/components/EmailTemplateFormModal.tsx` — Replace `<TextArea>` with `<TemplateEditor>` inside the existing `Form.Item name="body"`. Layout stays 2-column (form left, variables sidebar right); the sidebar is now part of `TemplateEditor`.
- `client/src/modules/emails/schemas/email.schema.ts` — Add `'hired'` to the type enum (currently missing, causes validation failure for hired templates).

### Unchanged
- Backend — stores and substitutes `{{variableName}}` tokens, no changes needed.
- `EmailTemplatePreviewModal` — already renders HTML with DOMPurify, no changes needed.
- All other email module files.

---

## Component Details

### `VariableChipExtension.ts`
A TipTap `Node` extension:
- `name: 'variableChip'`
- `inline: true`, `group: 'inline'`, `atom: true` (non-editable, deleted as one unit)
- Attributes: `{ name: string }`
- `renderHTML`: outputs `<span data-variable="{{name}}" ...>name</span>` styled as a blue chip
- `parseHTML`: reads `span[data-variable]` so chips survive round-trips through HTML
- `addCommands`: adds `insertVariableChip(name)` command that inserts the node at the current cursor position

### `EditorToolbar.tsx`
Thin toolbar above the editor:
- Bold (`editor.chain().toggleBold()`), Italic, Underline buttons
- Paragraph button for inserting line breaks
- Hint text: "← click variables on the right to insert"

### `VariableSidebar.tsx`
Props: `editor: Editor | null`
- Renders all 18 variables from the existing `variableExamples` list as clickable blue chips
- Search input filters chips by name in real time
- On click: calls `editor.commands.insertVariableChip(name)` then re-focuses editor
- Formatting reference section (br, b, i, u) below the variable list

### `TemplateEditor.tsx`
Props: `value: string`, `onChange: (html: string) => void`, `disabled?: boolean`

```
┌─────────────────────────────────────────┬──────────────────┐
│  [B] [I] [U] [¶]        ← insert right │  VARIABLES       │
│─────────────────────────────────────────│  [search box]    │
│  Dear [candidateName chip], we offer   │  [candidateName] │
│  you [position chip] at [salary chip]. │  [position]      │
│  Please respond by [responseDeadline]. │  [salary]        │
│                                         │  ...scrollable   │
│                                         │──────────────────│
│                                         │  FORMATTING      │
│                                         │  <br> <b> <i>   │
└─────────────────────────────────────────┴──────────────────┘
```

- Uses `useEditor` with `StarterKit` (provides bold/italic/underline/paragraph) + `VariableChipExtension`
- `onUpdate`: calls `onChange(editor.getHTML())` on every change
- On mount: calls `editor.commands.setContent(value)` to load existing HTML
- `getHTML()` output: chip nodes serialise to `<span data-variable="candidateName" ...>candidateName</span>` which the backend does NOT currently understand — see migration note below

### HTML Output & Migration

**Current format:** body stored as `Dear {{candidateName}}, ...` (mustache tokens as raw text)

**New format:** body stored as `Dear <span data-variable="candidateName" class="...">candidateName</span>, ...`

**Backend compatibility:** The backend `replace(/{{variableName}}/g, value)` will stop working with the new HTML format.

**Solution:** Two-step serialisation in `TemplateEditor`:
1. `getHTML()` → replace `<span data-variable="X"...>...</span>` → `{{X}}` before calling `onChange` (stored as mustache tokens, same as before)
2. `setContent(value)` → replace `{{X}}` → chip node before loading into editor

This keeps the stored format identical to today. Backend unchanged. Preview modal unchanged.

---

## TipTap Packages Required

```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-underline
```

- `@tiptap/react` — React bindings (`useEditor`, `EditorContent`)
- `@tiptap/pm` — ProseMirror peer dependency
- `@tiptap/starter-kit` — Bold, Italic, Paragraph, History (undo/redo)
- `@tiptap/extension-underline` — Underline (not in StarterKit)

---

## Schema Fix

`emailTemplateSchema` in `email.schema.ts` currently enumerates `['offer', 'interview', 'assessment', 'rejection', 'other']` — missing `'hired'`. Fix: add `'hired'` to the enum.

---

## Out of Scope

- Drag-and-drop email blocks / newsletter builder
- Image insertion
- Link insertion
- Subject line variable chips (stays as plain text input)
- Mobile/responsive editor layout

---

## Self-Review

- No TBDs or placeholders — all component interfaces are defined
- Serialisation strategy (mustache ↔ chip round-trip) is explicit — no backend changes needed
- Schema enum fix included — `hired` templates will validate correctly
- `VariableSidebar` is a subcomponent of `TemplateEditor`, not a separate modal section — consistent with the approved layout
- Scope is tight: 4 new files, 2 modified files
