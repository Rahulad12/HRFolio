# Dialog to Page Conversion — Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax.

**Goal:** Convert three modal-based forms (Email Templates, Offers, Assessments) to page-based forms — no logic changes, only UX.

**Architecture:** Each module gets a new `components/<Name>Form.tsx` extracted from its `*FormModal.tsx`. `<Modal>` replaced with `<Card>` + back-arrow header. Tables swap `useState`/modal for `useNavigate`. Routes get `/new` and `/edit/:id`.

---

## File Overview

### Email Templates
| File | Action |
|---|---|
| `components/EmailTemplateForm.tsx` | CREATE — page-form from modal |
| `components/EmailTemplateFormModal.tsx` | DELETE |
| `components/EmailTemplateTable.tsx` | MODIFY — replace modal with navigation |
| `routes/email.routes.tsx` | MODIFY — add `/new`, `/edit/:id` |
| `page.tsx` | MODIFY — export `EmailTemplateFormPage` |
| `index.ts` | MODIFY — export form page |

### Offers
| File | Action |
|---|---|
| `components/OfferForm.tsx` | CREATE — page-form from modal |
| `components/OfferFormModal.tsx` | DELETE |
| `components/OfferTable.tsx` | MODIFY — replace modal with navigation |
| `routes/offer.routes.tsx` | MODIFY — add `/new`, `/edit/:id` |
| `page.tsx` | MODIFY — export `OfferFormPage` |
| `index.ts` | MODIFY — export form page |

### Assessments
| File | Action |
|---|---|
| `components/AssessmentForm.tsx` | CREATE — page-form from modal |
| `components/AssessmentFormModal.tsx` | DELETE |
| `components/AssessmentTable.tsx` | MODIFY — replace modal with navigation |
| `routes/assessment.routes.tsx` | MODIFY — add `/new`, `/edit/:id` |
| `page.tsx` | MODIFY — export `AssessmentFormPage` |
| `index.ts` | MODIFY — export form page |

---

## Task 1: Email Templates — Page Form

### Step 1.1: Create `components/EmailTemplateForm.tsx`

```tsx
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button, Card, Form, Input, Select, message, Typography } from 'antd'
import { useCreateEmailTemplate, useUpdateEmailTemplate, useEmailTemplateById } from '../lib/queries/email.queries'
import { emailTemplateSchema } from '../schemas/email.schema'
import { zodResolver } from '@/shared/lib/zod-resolver'
import { TemplateEditor } from './editor/TemplateEditor'
import type { EmailTemplateFormData, EmailTemplateType } from '../types/email.types'

const { Title } = Typography
const { Option } = Select

const templateTypes: EmailTemplateType[] = [
  'offer', 'interview', 'assessment', 'rejection', 'hired', 'other',
]

export function EmailTemplateForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm<EmailTemplateFormData>()

  const isEditing = !!id
  const { data: templateData } = useEmailTemplateById(id || '')
  const { mutateAsync: createTemplate, isPending: isCreating } = useCreateEmailTemplate()
  const { mutateAsync: updateTemplate, isPending: isUpdating } = useUpdateEmailTemplate()

  useEffect(() => {
    if (isEditing && templateData?.data) {
      form.setFieldsValue({
        name: templateData.data.name,
        subject: templateData.data.subject,
        body: templateData.data.body,
        type: templateData.data.type,
        variables: templateData.data.variables,
      })
    } else if (!isEditing) {
      form.resetFields()
    }
  }, [id, isEditing, form, templateData])

  const handleSubmit = async () => {
    try {
      const values = await zodResolver(emailTemplateSchema, form.getFieldsValue())
      let res: { success: boolean; message: string }
      if (isEditing) {
        res = await updateTemplate({ id: id!, data: values })
      } else {
        res = await createTemplate(values)
      }
      if (res.success) {
        message.success(res.message)
        navigate('/dashboard/email-templates')
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        message.error(err.message)
      }
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Button
          type="text"
          icon={<ArrowLeft size={18} />}
          className="mr-3"
          onClick={() => navigate('/dashboard/email-templates')}
        />
        <Title level={2}>{isEditing ? 'Edit Email Template' : 'New Email Template'}</Title>
      </div>

      <Card>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
            <TemplateEditor
              value={form.getFieldValue('body') || ''}
              onChange={(v) => form.setFieldValue('body', v)}
            />
          </Form.Item>

          <div className="mt-6 flex justify-end space-x-3">
            <Button onClick={() => navigate('/dashboard/email-templates')}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating || isUpdating}
              disabled={isCreating || isUpdating}
            >
              {isEditing ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}
```

### Step 1.2: Modify `EmailTemplateTable.tsx`

- Remove `formOpen`, `editingTemplate`, `setFormOpen`, `setEditingTemplate` state
- Remove `EmailTemplateFormModal` import
- Remove `<EmailTemplateFormModal>` JSX
- Add `import { useNavigate } from 'react-router-dom'`
- Add `const navigate = useNavigate()` after component function opening
- "New Template" onClick → `navigate('/dashboard/email-templates/new')`
- "Edit" onClick → `navigate('/dashboard/email-templates/edit/' + record._id)`

### Step 1.3: Modify `routes/email.routes.tsx`

```tsx
import { lazy } from 'react'
import type { RouteObject } from 'react-router'

const LazyEmailList = lazy(() => import('../page').then((m) => ({ default: m.EmailTemplateListPage })))
const LazyEmailForm = lazy(() => import('../page').then((m) => ({ default: m.EmailTemplateFormPage })))

export const emailRoutes: RouteObject[] = [
  { path: 'email-templates', element: <LazyEmailList /> },
  { path: 'email-templates/new', element: <LazyEmailForm /> },
  { path: 'email-templates/edit/:id', element: <LazyEmailForm /> },
]
```

### Step 1.4: Modify `page.tsx`

```tsx
import { EmailTemplateTable } from './components/EmailTemplateTable'
import { EmailTemplateForm } from './components/EmailTemplateForm'

export function EmailTemplateListPage() {
  return <EmailTemplateTable />
}

export function EmailTemplateFormPage() {
  return <EmailTemplateForm />
}
```

### Step 1.5: Delete `EmailTemplateFormModal.tsx`

Remove the file.

### Step 1.6: Modify `index.ts`

```tsx
export type { EmailTemplate, EmailTemplateFormData, EmailTemplateListResponse, EmailTemplateType } from './types/email.types'
export { useEmailTemplateList, useEmailTemplateById, useCreateEmailTemplate, useUpdateEmailTemplate, useDeleteEmailTemplate } from './lib/queries/email.queries'
export { EmailTemplateListPage, EmailTemplateFormPage } from './page'
export { emailRoutes } from './routes/email.routes'
```

---

## Task 2: Offers — Page Form

### Step 2.1: Create `components/OfferForm.tsx`

```tsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button, Card, Form, Input, Select, DatePicker, Typography, message } from 'antd'
import { useCreateOffer, useUpdateOffer, useOfferById, useOfferCandidates, useOfferEmailTemplates } from '../lib/queries/offer.queries'
import { offerSchema } from '../schemas/offer.schema'
import { zodResolver } from '@/shared/lib/zod-resolver'
import dayjs from 'dayjs'
import type { OfferFormData } from '../types/offer.types'

const { Title, Text } = Typography
const { Option } = Select

export function OfferForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm<OfferFormData>()
  const [preview, setPreview] = useState('')
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isSendingOffer, setIsSendingOffer] = useState(false)

  const isEditing = !!id
  const { data: offerData } = useOfferById(id || '')
  const { mutateAsync: createOffer } = useCreateOffer()
  const { mutateAsync: updateOffer } = useUpdateOffer()
  const { data: candidateData } = useOfferCandidates()
  const { data: templateData } = useOfferEmailTemplates({ type: 'offer' })

  const candidates = candidateData?.data || []
  const templates = templateData?.data || []

  useEffect(() => {
    if (isEditing && offerData?.data) {
      form.setFieldsValue({
        candidate: offerData.data.candidate?._id || '',
        email: offerData.data.email,
        position: offerData.data.position,
        salary: offerData.data.salary,
        startDate: offerData.data.startDate,
        responseDeadline: offerData.data.responseDeadline,
        status: offerData.data.status,
      })
      buildPreview(form.getFieldsValue())
    } else if (!isEditing) {
      form.resetFields()
      setPreview('')
    }
  }, [id, isEditing, form, offerData])

  const buildPreview = (values: Partial<OfferFormData>) => {
    const tmpl = templates.find((t) => t._id === values.email)
    const candidate = candidates.find((c) => c._id === values.candidate)
    if (!tmpl || !candidate) { setPreview(''); return }
    const result = tmpl.body
      .replace(/{{candidateName}}/g, candidate.name)
      .replace(/{{position}}/g, values.position || '')
      .replace(/{{salary}}/g, values.salary || '')
      .replace(/{{startDate}}/g, values.startDate ? dayjs(values.startDate).format('MMMM D, YYYY') : '')
      .replace(/{{responseDeadline}}/g, values.responseDeadline ? dayjs(values.responseDeadline).format('MMMM D, YYYY') : '')
      .replace(/{{offerDate}}/g, dayjs().format('MMMM D, YYYY'))
    setPreview(result)
  }

  const submitWithStatus = async (status: 'draft' | 'sent') => {
    const setLoading = status === 'draft' ? setIsSavingDraft : setIsSendingOffer
    setLoading(true)
    try {
      const raw = form.getFieldsValue()
      const payload = {
        ...raw,
        status,
        startDate: raw.startDate ? dayjs(raw.startDate).format('YYYY-MM-DD') : '',
        responseDeadline: raw.responseDeadline ? dayjs(raw.responseDeadline).format('YYYY-MM-DD') : '',
      }
      const values = await zodResolver(offerSchema, payload)
      let res: { success: boolean; message: string }
      if (isEditing) {
        res = await updateOffer({ id: id!, data: values })
      } else {
        res = await createOffer(values)
      }
      if (res.success) {
        message.success(res.message)
        navigate('/dashboard/offers')
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        message.error(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const isBusy = isSavingDraft || isSendingOffer

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Button
          type="text"
          icon={<ArrowLeft size={18} />}
          className="mr-3"
          onClick={() => navigate('/dashboard/offers')}
        />
        <Title level={2}>{isEditing ? 'Edit Offer' : 'New Offer'}</Title>
      </div>

      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Left — form */}
          <Form
            form={form}
            layout="vertical"
            onValuesChange={(_, all) => buildPreview(all)}
          >
            <Form.Item name="candidate" label="Candidate" rules={[{ required: true, message: 'Candidate is required' }]}>
              <Select placeholder="Select candidate" showSearch filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }>
                {candidates.map((c) => (
                  <Option key={c._id} value={c._id}>{c.name} ({c.email})</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="email" label="Email Template" rules={[{ required: true, message: 'Email template is required' }]}>
              <Select placeholder="Select email template">
                {templates.map((t) => (
                  <Option key={t._id} value={t._id}>{t.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="position" label="Position" rules={[{ required: true, message: 'Position is required' }]}>
              <Input placeholder="e.g. Senior React Developer" />
            </Form.Item>

            <Form.Item name="salary" label="Salary" rules={[{ required: true, message: 'Salary is required' }]}>
              <Input placeholder="e.g. $120,000" />
            </Form.Item>

            <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Start date is required' }]}>
              <DatePicker
                style={{ width: '100%' }}
                disabledDate={(d) => d && d < dayjs().startOf('day')}
              />
            </Form.Item>

            <Form.Item name="responseDeadline" label="Response Deadline" rules={[{ required: true, message: 'Response deadline is required' }]}>
              <DatePicker
                style={{ width: '100%' }}
                disabledDate={(d) => d && d < dayjs().startOf('day')}
              />
            </Form.Item>
          </Form>

          {/* Right — live email preview */}
          <div>
            <Text strong className="block mb-2">Email Preview</Text>
            {preview ? (
              <div
                className="overflow-auto rounded border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 whitespace-pre-wrap"
                style={{ minHeight: 320, maxHeight: 480 }}
              >
                {preview}
              </div>
            ) : (
              <div
                className="flex items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-400"
                style={{ minHeight: 320 }}
              >
                Select a candidate and email template to see the preview
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button onClick={() => navigate('/dashboard/offers')} disabled={isBusy}>
            Cancel
          </Button>
          <Button onClick={() => submitWithStatus('draft')} loading={isSavingDraft} disabled={isSendingOffer}>
            Save as Draft
          </Button>
          <Button type="primary" onClick={() => submitWithStatus('sent')} loading={isSendingOffer} disabled={isSavingDraft}>
            Send Offer
          </Button>
        </div>
      </Card>
    </div>
  )
}
```

### Step 2.2: Modify `OfferTable.tsx`

- Remove `formOpen`, `editingOffer` state
- Remove `OfferFormModal` import + render
- Add `import { useNavigate } from 'react-router-dom'`
- Add `const navigate = useNavigate()`
- "New Offer" onClick → `navigate('/dashboard/offers/new')`
- "Edit" onClick → `navigate('/dashboard/offers/edit/' + record._id)`

### Step 2.3: Modify `routes/offer.routes.tsx`

```tsx
const LazyOfferForm = lazy(() => import('../page').then((m) => ({ default: m.OfferFormPage })))
// Add:
{ path: 'offers/new', element: <LazyOfferForm /> },
{ path: 'offers/edit/:id', element: <LazyOfferForm /> },
```

### Step 2.4: Modify `page.tsx` — import OfferForm, export OfferFormPage

### Step 2.5: Delete `OfferFormModal.tsx`

### Step 2.6: Modify `index.ts`

---

## Task 3: Assessments — Page Form

### Step 3.1: Create `components/AssessmentForm.tsx`

```tsx
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button, Card, Form, Input, InputNumber, Select, message, Typography } from 'antd'
import { useCreateAssessment, useUpdateAssessment, useAssessmentById } from '../lib/queries/assessment.queries'
import { assessmentSchema } from '../schemas/assessment.schema'
import { zodResolver } from '@/shared/lib/zod-resolver'
import type { AssessmentFormData, AssessmentType } from '../types/assessment.types'

const { Title } = Typography

const assessmentTypes: AssessmentType[] = ['mcq', 'coding', 'assignment', 'quiz']
const technologies = ['React', 'Node.js', 'Angular', 'Vue.js', 'Python', 'Java', '.NET', 'DevOps', 'Database', 'Other']
const levels = ['Beginner', 'Intermediate', 'Advanced']

export function AssessmentForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm<AssessmentFormData>()

  const isEditing = !!id
  const { data: assessmentData } = useAssessmentById(id || '')
  const { mutateAsync: createAssessment, isPending: isCreating } = useCreateAssessment()
  const { mutateAsync: updateAssessment, isPending: isUpdating } = useUpdateAssessment()

  useEffect(() => {
    if (isEditing && assessmentData?.data) {
      form.setFieldsValue({
        title: assessmentData.data.title,
        type: assessmentData.data.type,
        technology: assessmentData.data.technology,
        level: assessmentData.data.level,
        assessmentLink: assessmentData.data.assessmentLink,
        duration: assessmentData.data.duration,
      })
    } else if (!isEditing) {
      form.resetFields()
    }
  }, [id, isEditing, form, assessmentData])

  const handleSubmit = async () => {
    try {
      const values = await zodResolver(assessmentSchema, form.getFieldsValue())
      let res: { success: boolean; message: string }
      if (isEditing) {
        res = await updateAssessment({ id: id!, data: values })
      } else {
        res = await createAssessment(values)
      }
      if (res.success) {
        message.success(res.message)
        navigate('/dashboard/assessments')
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        message.error(err.message)
      }
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Button
          type="text"
          icon={<ArrowLeft size={18} />}
          className="mr-3"
          onClick={() => navigate('/dashboard/assessments')}
        />
        <Title level={2}>{isEditing ? 'Edit Assessment' : 'New Assessment'}</Title>
      </div>

      <Card>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Assessment name is required' }]}>
            <Input placeholder="Enter assessment title" />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Type is required' }]}>
            <Select placeholder="Select type">
              {assessmentTypes.map((t) => (
                <Select.Option key={t} value={t} className="capitalize">{t}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="technology" label="Technology" rules={[{ required: true, message: 'Technology is required' }]}>
            <Select placeholder="Select technology" showSearch>
              {technologies.map((t) => (
                <Select.Option key={t} value={t}>{t}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="level" label="Level" rules={[{ required: true, message: 'Level is required' }]}>
            <Select placeholder="Select level">
              {levels.map((l) => (
                <Select.Option key={l} value={l}>{l}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="assessmentLink" label="Assessment Link" rules={[{ required: true, message: 'Link is required' }, { type: 'url', message: 'Enter a valid URL' }]}>
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="duration" label="Duration (minutes)" rules={[{ required: true, message: 'Duration is required' }]}>
            <InputNumber min={1} style={{ width: '100%' }} placeholder="Enter duration in minutes" />
          </Form.Item>

          <div className="mt-6 flex justify-end space-x-3">
            <Button onClick={() => navigate('/dashboard/assessments')}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating || isUpdating}
              disabled={isCreating || isUpdating}
            >
              {isEditing ? 'Update Assessment' : 'Create Assessment'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}
```

### Step 3.2: Modify `AssessmentTable.tsx`

- Remove `formOpen`, `editingAssessment` state
- Remove `AssessmentFormModal` import + render
- Add `import { useNavigate } from 'react-router-dom'`
- Add `const navigate = useNavigate()`
- "New Assessment" onClick → `navigate('/dashboard/assessments/new')`
- "Edit" onClick → `navigate('/dashboard/assessments/edit/' + record._id)`

### Step 3.3: Modify `routes/assessment.routes.tsx`

```tsx
const LazyAssessmentForm = lazy(() => import('../page').then((m) => ({ default: m.AssessmentFormPage })))
// Add:
{ path: 'assessments/new', element: <LazyAssessmentForm /> },
{ path: 'assessments/edit/:id', element: <LazyAssessmentForm /> },
```

### Step 3.4: Modify `page.tsx` — import AssessmentForm, export AssessmentFormPage

### Step 3.5: Delete `AssessmentFormModal.tsx`

### Step 3.6: Modify `index.ts`

---

## Task 4: Verify

```bash
cd /home/rahul-adhikari/code/own-projects/HRFolio/client && npx tsc --noEmit
cd /home/rahul-adhikari/code/own-projects/HRFolio/client && npm run build
cd /home/rahul-adhikari/code/own-projects/HRFolio/client && npm run lint
```
