# TipTap Email Template Editor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the raw textarea in `EmailTemplateFormModal` with a TipTap WYSIWYG editor where variables appear as non-editable blue chip nodes and are inserted by clicking a sidebar panel — no HTML or `{{syntax}}` knowledge required.

**Architecture:** Four focused components (`VariableChipExtension`, `EditorToolbar`, `VariableSidebar`, `TemplateEditor`) compose the editor. `TemplateEditor` is a drop-in replacement for the `<TextArea>` inside the existing Ant Design `Form.Item` — it accepts `value: string` and `onChange: (v: string) => void`. The stored format remains `{{variableName}}` mustache tokens via a serialisation round-trip: tokens → chip nodes on load, chip nodes → tokens on save. Backend and preview modal are unchanged.

**Tech Stack:** TipTap (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-underline`, `@tiptap/pm`), React, Ant Design, Tailwind CSS, TypeScript

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `client/src/modules/emails/components/editor/VariableChipExtension.ts` | TipTap Node extension — renders chip nodes, serialises to/from `{{name}}` |
| Create | `client/src/modules/emails/components/editor/EditorToolbar.tsx` | Bold / Italic / Underline toolbar |
| Create | `client/src/modules/emails/components/editor/VariableSidebar.tsx` | Clickable variable chips + search + formatting guide |
| Create | `client/src/modules/emails/components/editor/TemplateEditor.tsx` | Composes above three; Form-compatible `value`/`onChange` props |
| Modify | `client/src/modules/emails/components/EmailTemplateFormModal.tsx` | Swap `<TextArea>` for `<TemplateEditor>`, remove old sidebar |
| Modify | `client/src/modules/emails/schemas/email.schema.ts` | Add `'hired'` to type enum (bug fix) |

---

## Task 1: Install TipTap packages

**Files:** `client/package.json` (side-effect only)

- [ ] **Step 1: Install packages**

```bash
cd client && npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-underline
```

Expected: packages added to `node_modules`, `package.json` updated.

- [ ] **Step 2: Verify TypeScript resolves the types**

```bash
cd client && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors about missing `@tiptap` modules.

- [ ] **Step 3: Commit**

```bash
git add client/package.json client/package-lock.json
git commit -m "chore: install tiptap packages for email template editor"
```

---

## Task 2: Fix email schema — add `hired` to type enum

**Files:**
- Modify: `client/src/modules/emails/schemas/email.schema.ts`

- [ ] **Step 1: Open the file and update the enum**

Current content of `client/src/modules/emails/schemas/email.schema.ts`:
```ts
import { z } from 'zod'

export const emailTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
  type: z.enum(['offer', 'interview', 'assessment', 'rejection', 'other'], {
    error: 'Type is required',
  }),
  variables: z.array(z.string()).default([]),
})

export type EmailTemplateFormValues = z.infer<typeof emailTemplateSchema>
```

Replace with:
```ts
import { z } from 'zod'

export const emailTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
  type: z.enum(['offer', 'interview', 'assessment', 'rejection', 'hired', 'other'], {
    error: 'Type is required',
  }),
  variables: z.array(z.string()).default([]),
})

export type EmailTemplateFormValues = z.infer<typeof emailTemplateSchema>
```

- [ ] **Step 2: Verify type check**

```bash
cd client && npx tsc --noEmit 2>&1 | grep schema
```

Expected: no output (no errors).

- [ ] **Step 3: Commit**

```bash
git add client/src/modules/emails/schemas/email.schema.ts
git commit -m "fix: add 'hired' to emailTemplateSchema type enum"
```

---

## Task 3: Create `VariableChipExtension.ts`

**Files:**
- Create: `client/src/modules/emails/components/editor/VariableChipExtension.ts`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p client/src/modules/emails/components/editor
```

- [ ] **Step 2: Write the extension**

Create `client/src/modules/emails/components/editor/VariableChipExtension.ts` with:

```ts
import { Node, mergeAttributes } from '@tiptap/core'

// Injected via renderHTML — must be inline style so it works in email previews too
const CHIP_STYLE =
  'background:#dbeafe;color:#1d4ed8;border-radius:4px;' +
  'padding:2px 8px;font-size:0.8em;font-weight:600;' +
  'display:inline-block;user-select:none;white-space:nowrap;'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    variableChip: {
      /** Insert a variable chip at the current cursor position */
      insertVariableChip: (name: string) => ReturnType
    }
  }
}

export const VariableChipExtension = Node.create({
  name: 'variableChip',
  inline: true,
  group: 'inline',
  atom: true, // deleted as one unit — can't place cursor inside

  addAttributes() {
    return {
      name: {
        default: null,
        parseHTML: (el) => (el as HTMLElement).getAttribute('data-variable'),
        renderHTML: (attrs) => ({ 'data-variable': attrs.name }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-variable]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, { style: CHIP_STYLE }),
      node.attrs.name as string,
    ]
  },

  addCommands() {
    return {
      insertVariableChip:
        (name: string) =>
        ({ chain }) =>
          chain()
            .insertContent({ type: this.name, attrs: { name } })
            .run(),
    }
  },
})
```

- [ ] **Step 3: Type check**

```bash
cd client && npx tsc --noEmit 2>&1 | grep -i variable
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add client/src/modules/emails/components/editor/VariableChipExtension.ts
git commit -m "feat: add TipTap VariableChipExtension for email template editor"
```

---

## Task 4: Create `EditorToolbar.tsx`

**Files:**
- Create: `client/src/modules/emails/components/editor/EditorToolbar.tsx`

- [ ] **Step 1: Write the toolbar**

Create `client/src/modules/emails/components/editor/EditorToolbar.tsx` with:

```tsx
import type { Editor } from '@tiptap/react'
import { Button, Tooltip } from 'antd'
import { Bold, Italic, Underline } from 'lucide-react'

interface Props {
  editor: Editor | null
}

export function EditorToolbar({ editor }: Props) {
  if (!editor) return null

  return (
    <div className="flex items-center gap-1 border-b border-gray-200 bg-gray-50 px-3 py-1.5">
      <Tooltip title="Bold (Ctrl+B)">
        <Button
          type={editor.isActive('bold') ? 'primary' : 'text'}
          size="small"
          icon={<Bold size={13} />}
          onMouseDown={(e) => {
            e.preventDefault() // prevent editor losing focus
            editor.chain().focus().toggleBold().run()
          }}
        />
      </Tooltip>
      <Tooltip title="Italic (Ctrl+I)">
        <Button
          type={editor.isActive('italic') ? 'primary' : 'text'}
          size="small"
          icon={<Italic size={13} />}
          onMouseDown={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleItalic().run()
          }}
        />
      </Tooltip>
      <Tooltip title="Underline (Ctrl+U)">
        <Button
          type={editor.isActive('underline') ? 'primary' : 'text'}
          size="small"
          icon={<Underline size={13} />}
          onMouseDown={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleUnderline().run()
          }}
        />
      </Tooltip>
      <span className="ml-auto text-xs text-gray-400">
        ← click variables on the right to insert
      </span>
    </div>
  )
}
```

> **Why `onMouseDown` not `onClick`:** Clicking a toolbar button shifts browser focus away from the editor. `onMouseDown` + `e.preventDefault()` keeps focus in the editor, so formatting applies to the selected text.

- [ ] **Step 2: Type check**

```bash
cd client && npx tsc --noEmit 2>&1 | grep -i toolbar
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/modules/emails/components/editor/EditorToolbar.tsx
git commit -m "feat: add EditorToolbar for TipTap email editor"
```

---

## Task 5: Create `VariableSidebar.tsx`

**Files:**
- Create: `client/src/modules/emails/components/editor/VariableSidebar.tsx`

- [ ] **Step 1: Write the sidebar**

Create `client/src/modules/emails/components/editor/VariableSidebar.tsx` with:

```tsx
import { useState } from 'react'
import { Input, Divider, Tooltip, Typography } from 'antd'
import type { Editor } from '@tiptap/react'

const VARIABLE_EXAMPLES = [
  { name: 'candidateName', description: 'Full name of the candidate' },
  { name: 'position', description: 'Job position title' },
  { name: 'salary', description: 'Offered salary' },
  { name: 'startDate', description: 'Expected joining date' },
  { name: 'interviewDate', description: 'Interview date' },
  { name: 'interviewTime', description: 'Interview time' },
  { name: 'interviewerName', description: 'Interviewer name' },
  { name: 'interviewerEmail', description: 'Interviewer email' },
  { name: 'interviewLink', description: 'Virtual interview link' },
  { name: 'assessmentDate', description: 'Assessment date' },
  { name: 'assessmentTime', description: 'Assessment time' },
  { name: 'rejectionReason', description: 'Rejection reason' },
  { name: 'offerDate', description: 'Offer date' },
  { name: 'offerTime', description: 'Offer time' },
  { name: 'duration', description: 'Duration (minutes)' },
  { name: 'technology', description: 'Technology stack' },
  { name: 'responseDeadline', description: 'Response deadline' },
  { name: 'assessmentLink', description: 'Assessment access link' },
]

const FORMATTING_GUIDE = [
  { tag: '<br>', effect: 'Line break' },
  { tag: '<b>…</b>', effect: 'Bold' },
  { tag: '<i>…</i>', effect: 'Italic' },
  { tag: '<u>…</u>', effect: 'Underline' },
]

interface Props {
  editor: Editor | null
}

export function VariableSidebar({ editor }: Props) {
  const [search, setSearch] = useState('')

  const filtered = VARIABLE_EXAMPLES.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  )

  const insert = (name: string) => {
    if (!editor) return
    editor.chain().focus().insertVariableChip(name).run()
  }

  return (
    <div className="flex flex-col border-l border-gray-200 bg-gray-50 p-3">
      <Typography.Text
        strong
        className="mb-1 block text-xs uppercase tracking-wide text-gray-500"
      >
        Variables
      </Typography.Text>
      <Typography.Text type="secondary" className="mb-2 block text-xs">
        Click to insert at cursor
      </Typography.Text>

      <Input
        placeholder="Search…"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-2"
        allowClear
      />

      <div className="flex flex-col gap-1.5 overflow-y-auto" style={{ maxHeight: 280 }}>
        {filtered.map((v) => (
          <Tooltip key={v.name} title={v.description} placement="left">
            <button
              type="button"
              onClick={() => insert(v.name)}
              className="rounded border border-blue-200 bg-blue-50 px-2 py-1 text-center text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 active:bg-blue-200"
            >
              {v.name}
            </button>
          </Tooltip>
        ))}
        {filtered.length === 0 && (
          <span className="py-4 text-center text-xs text-gray-400">No variables found</span>
        )}
      </div>

      <Divider className="my-3" />

      <Typography.Text
        strong
        className="mb-2 block text-xs uppercase tracking-wide text-gray-500"
      >
        Formatting
      </Typography.Text>
      <div className="flex flex-col gap-1.5">
        {FORMATTING_GUIDE.map((f) => (
          <div key={f.tag} className="flex items-center gap-2">
            <code className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-purple-700">
              {f.tag}
            </code>
            <span className="text-xs text-gray-500">{f.effect}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type check**

```bash
cd client && npx tsc --noEmit 2>&1 | grep -i sidebar
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/modules/emails/components/editor/VariableSidebar.tsx
git commit -m "feat: add VariableSidebar with click-to-insert variable chips"
```

---

## Task 6: Create `TemplateEditor.tsx`

**Files:**
- Create: `client/src/modules/emails/components/editor/TemplateEditor.tsx`

This is the core component. Key decisions:
- `mustacheToHtml` converts `{{name}}` → `<span data-variable="name">name</span>` before loading into TipTap (TipTap then parses it as a chip node via `parseHTML`)
- `htmlToMustache` converts chip HTML → `{{name}}` before calling `onChange` (keeps stored format identical to before)
- `prevValueRef` prevents the infinite loop: `onUpdate → onChange → value prop changes → useEffect → setContent → onUpdate → …`
- `editor.isEmpty` detects truly empty content (TipTap returns `<p></p>` for empty, not `""`)

- [ ] **Step 1: Write the component**

Create `client/src/modules/emails/components/editor/TemplateEditor.tsx` with:

```tsx
import { useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { VariableChipExtension } from './VariableChipExtension'
import { EditorToolbar } from './EditorToolbar'
import { VariableSidebar } from './VariableSidebar'

/** Convert {{varName}} mustache tokens to chip-parseable HTML for TipTap */
function mustacheToHtml(text: string): string {
  return text.replace(
    /\{\{(\w+)\}\}/g,
    (_, name) => `<span data-variable="${name}">${name}</span>`,
  )
}

/** Convert TipTap chip HTML back to {{varName}} mustache tokens for storage */
function htmlToMustache(html: string): string {
  return html.replace(/<span\s[^>]*data-variable="(\w+)"[^>]*>.*?<\/span>/g, '{{$1}}')
}

interface Props {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function TemplateEditor({ value, onChange, disabled = false }: Props) {
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  // Track last value we pushed to onChange so the sync useEffect can skip it
  const lastEmittedRef = useRef(value)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable block-level features not needed in email templates
        heading: false,
        codeBlock: false,
        code: false,
        blockquote: false,
        horizontalRule: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Underline,
      VariableChipExtension,
    ],
    content: mustacheToHtml(value || ''),
    editable: !disabled,
    onUpdate({ editor: e }) {
      const mustache = e.isEmpty ? '' : htmlToMustache(e.getHTML())
      lastEmittedRef.current = mustache
      onChangeRef.current(mustache)
    },
  })

  // Sync when value changes from outside (e.g. editing a different template)
  useEffect(() => {
    if (!editor) return
    if (value === lastEmittedRef.current) return // we emitted this value — skip
    lastEmittedRef.current = value
    editor.commands.setContent(mustacheToHtml(value || ''))
  }, [editor, value])

  // Toggle editable when disabled prop changes
  useEffect(() => {
    if (!editor) return
    editor.setEditable(!disabled)
  }, [editor, disabled])

  return (
    <>
      {/* Scoped ProseMirror reset styles */}
      <style>{`
        .ProseMirror { outline: none; }
        .ProseMirror p { margin: 0 0 6px 0; }
        .ProseMirror p:last-child { margin-bottom: 0; }
      `}</style>

      <div
        className="overflow-hidden rounded-lg border border-gray-300"
        style={{ display: 'grid', gridTemplateColumns: '1fr 200px' }}
      >
        {/* Left: toolbar + editor */}
        <div className="flex flex-col">
          <EditorToolbar editor={editor} />
          <EditorContent
            editor={editor}
            className="flex-1 overflow-y-auto bg-white px-4 py-3"
            style={{ minHeight: 220 }}
          />
        </div>

        {/* Right: variable sidebar */}
        <VariableSidebar editor={editor} />
      </div>
    </>
  )
}
```

- [ ] **Step 2: Type check**

```bash
cd client && npx tsc --noEmit 2>&1 | head -30
```

Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/modules/emails/components/editor/TemplateEditor.tsx
git commit -m "feat: add TemplateEditor composing TipTap + toolbar + variable sidebar"
```

---

## Task 7: Update `EmailTemplateFormModal.tsx`

**Files:**
- Modify: `client/src/modules/emails/components/EmailTemplateFormModal.tsx`

Replace the whole file. Changes:
- Import `TemplateEditor` instead of `TextArea`
- Remove old sidebar (variables + formatting guide) — now inside `TemplateEditor`
- Remove `variableExamples`, `formattingGuide` constants
- Remove now-unused imports: `TextArea`, `Divider`, `Tooltip`, `Typography`
- The modal grid changes from `2fr 1fr` to a single column (TemplateEditor has its own internal sidebar)
- Widen modal slightly to `1100px` to give the editor + sidebar more room

- [ ] **Step 1: Replace the file**

Write `client/src/modules/emails/components/EmailTemplateFormModal.tsx`:

```tsx
import { useEffect } from 'react'
import { Modal, Form, Input, Select, notification } from 'antd'
import { useCreateEmailTemplate, useUpdateEmailTemplate } from '../lib/queries/email.queries'
import { emailTemplateSchema } from '../schemas/email.schema'
import { zodResolver } from '@/shared/lib/zod-resolver'
import { TemplateEditor } from './editor/TemplateEditor'
import type { EmailTemplate, EmailTemplateFormData, EmailTemplateType } from '../types/email.types'

const { Option } = Select

const templateTypes: EmailTemplateType[] = [
  'offer', 'interview', 'assessment', 'rejection', 'hired', 'other',
]

interface Props {
  open: boolean
  template: EmailTemplate | null
  onClose: () => void
}

export function EmailTemplateFormModal({ open, template, onClose }: Props) {
  const [form] = Form.useForm<EmailTemplateFormData>()
  const [api, contextHolder] = notification.useNotification()
  const { mutateAsync: createTemplate, isPending: isCreating } = useCreateEmailTemplate()
  const { mutateAsync: updateTemplate, isPending: isUpdating } = useUpdateEmailTemplate()

  const isEditing = !!template

  useEffect(() => {
    if (template) {
      form.setFieldsValue({
        name: template.name,
        subject: template.subject,
        body: template.body,
        type: template.type,
        variables: template.variables,
      })
    } else {
      form.resetFields()
    }
  }, [template, form])

  const handleSubmit = async () => {
    try {
      const values = await zodResolver(emailTemplateSchema, form.getFieldsValue())
      let res: { success: boolean; message: string }
      if (isEditing) {
        res = await updateTemplate({ id: template!._id, data: values })
      } else {
        res = await createTemplate(values)
      }
      if (res.success) {
        api.success({ message: res.message, placement: 'topRight', duration: 3 })
        onClose()
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        api.error({ message: err.message, placement: 'topRight', duration: 3 })
      }
    }
  }

  return (
    <Modal
      title={isEditing ? 'Edit Email Template' : 'New Email Template'}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isCreating || isUpdating}
      destroyOnClose
      width={1100}
    >
      {contextHolder}
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Template Name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input placeholder="e.g. Offer Letter Template" />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Type is required' }]}
          >
            <Select placeholder="Select type">
              {templateTypes.map((t) => (
                <Option key={t} value={t} className="capitalize">{t}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: 'Subject is required' }]}
          >
            <Input placeholder="e.g. Your offer from Acme Co." />
          </Form.Item>
        </div>

        <Form.Item
          name="body"
          label="Body"
          rules={[{ required: true, message: 'Body is required' }]}
        >
          <TemplateEditor value={form.getFieldValue('body') || ''} onChange={(v) => form.setFieldValue('body', v)} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
```

> **Note on Form.Item + TemplateEditor:** Ant Design's `Form.Item` passes `value` and `onChange` to direct children automatically — but only for standard input elements. For `TemplateEditor`, we wire it manually via `form.getFieldValue` and `form.setFieldValue` to avoid edge cases with Ant Design's event normalisation.

- [ ] **Step 2: Full type check and build**

```bash
cd client && npx tsc --noEmit 2>&1
```

Expected: zero errors.

```bash
cd client && npm run build 2>&1 | tail -10
```

Expected: `✓ built in …s` with no errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/modules/emails/components/EmailTemplateFormModal.tsx
git commit -m "feat: replace textarea with TipTap WYSIWYG editor in EmailTemplateFormModal"
```

---

## Self-Review

**Spec coverage:**
- [x] TipTap replaces raw textarea — Task 7
- [x] Variable chip nodes (non-editable, blue) — Task 3
- [x] Sidebar with clickable chip buttons + search — Task 5
- [x] Bold / Italic / Underline toolbar — Task 4
- [x] Mustache ↔ chip serialisation round-trip — Task 6
- [x] `hired` schema enum fix — Task 2
- [x] Backend unchanged (stored format identical) — confirmed by htmlToMustache
- [x] Preview modal unchanged — confirmed; it renders the mustache/HTML body, chips output `{{name}}`

**Placeholder scan:** No TBDs. All code blocks are complete.

**Type consistency:**
- `VariableChipExtension` declares `insertVariableChip(name: string)` on TipTap's `Commands` interface
- `EditorToolbar` accepts `editor: Editor | null` — matches what `useEditor` returns
- `VariableSidebar` accepts `editor: Editor | null` — same
- `TemplateEditor` props: `{ value: string, onChange: (value: string) => void, disabled?: boolean }` — compatible with Ant Design Form pattern used in Task 7
- `EmailTemplateFormModal` calls `form.setFieldValue('body', v)` and `form.getFieldValue('body')` — correct Ant Design 5.x API
