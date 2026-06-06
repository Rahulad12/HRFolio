# PageHeader Back Arrow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the duplicated back-arrow + title header pattern into a single shared `PageHeader` component and migrate all 9 detail/form pages to use it.

**Architecture:** Create `client/src/shared/components/PageHeader.tsx` with `title`, `backPath`, and optional `rightContent` props. Each of the 9 non-list pages replaces its inline header `<div>` with `<PageHeader>`. No list pages are touched.

**Tech Stack:** React, TypeScript, Ant Design (`Button`, `Typography`), Lucide React (`ArrowLeft`), React Router (`useNavigate`)

---

## File Map

| Action | File |
|--------|------|
| **Create** | `client/src/shared/components/PageHeader.tsx` |
| **Modify** | `client/src/modules/candidates/page.tsx` |
| **Modify** | `client/src/modules/candidates/components/CandidateForm.tsx` |
| **Modify** | `client/src/modules/candidates/components/CandidateSendEmail.tsx` |
| **Modify** | `client/src/modules/assessments/components/AssessmentForm.tsx` |
| **Modify** | `client/src/modules/assessments/components/AssignAssessmentForm.tsx` |
| **Modify** | `client/src/modules/offers/components/OfferForm.tsx` |
| **Modify** | `client/src/modules/interviewers/components/InterviewerForm.tsx` |
| **Modify** | `client/src/modules/emails/components/EmailTemplateForm.tsx` |
| **Modify** | `client/src/modules/interviews/components/InterviewSchedule.tsx` |

---

## Task 1: Create the PageHeader component

**Files:**
- Create: `client/src/shared/components/PageHeader.tsx`

- [ ] **Step 1: Create the file**

```tsx
import type { ReactNode } from 'react'
import { Button, Typography } from 'antd'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  backPath: string
  rightContent?: ReactNode
}

export function PageHeader({ title, backPath, rightContent }: PageHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Button
          type="text"
          icon={<ArrowLeft size={18} />}
          onClick={() => navigate(backPath)}
        />
        <Typography.Title level={3} className="!mb-0">
          {title}
        </Typography.Title>
      </div>
      {rightContent}
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd client && yarn build 2>&1 | head -30`

Expected: no errors referencing `PageHeader.tsx`

- [ ] **Step 3: Commit**

```bash
git add client/src/shared/components/PageHeader.tsx
git commit -m "feat: add shared PageHeader component with back arrow"
```

---

## Task 2: Migrate candidates module (3 files)

**Files:**
- Modify: `client/src/modules/candidates/page.tsx`
- Modify: `client/src/modules/candidates/components/CandidateForm.tsx`
- Modify: `client/src/modules/candidates/components/CandidateSendEmail.tsx`

### 2a — `candidates/page.tsx` (CandidateDetailPage)

- [ ] **Step 1: Update imports**

Old:
```tsx
import { Button, Row, Col, Skeleton, notification, Typography } from 'antd'
import { ArrowLeft, Edit } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
```

New:
```tsx
import { Button, Row, Col, Skeleton, notification } from 'antd'
import { Edit } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/shared/components/PageHeader'
```

- [ ] **Step 2: Remove `const { Title } = Typography`**

Delete this line:
```tsx
const { Title } = Typography
```

- [ ] **Step 3: Replace the header `<div>` block**

Old (lines 45–58):
```tsx
<div className="flex flex-wrap items-center justify-between">
  <div className="flex items-center gap-2">
    <Button type="text" icon={<ArrowLeft size={18} />} onClick={() => navigate('/dashboard/candidates')} />
    <Title level={3} className="!mb-0">Candidate Details</Title>
  </div>
  <Button
    type="primary"
    icon={<Edit size={16} />}
    onClick={() => navigate(`/dashboard/candidates/edit/${id}`)}
    disabled={statusUpdating}
  >
    Edit
  </Button>
</div>
```

New:
```tsx
<PageHeader
  title="Candidate Details"
  backPath="/dashboard/candidates"
  rightContent={
    <Button
      type="primary"
      icon={<Edit size={16} />}
      onClick={() => navigate(`/dashboard/candidates/edit/${id}`)}
      disabled={statusUpdating}
    >
      Edit
    </Button>
  }
/>
```

### 2b — `CandidateForm.tsx`

- [ ] **Step 4: Update imports**

Old:
```tsx
import { ArrowLeft, MinusCircle, PlusCircle, X } from 'lucide-react'
import { Button, Col, DatePicker, Form, Input, InputNumber, message, Row, Select, Typography, Upload, Card } from 'antd'
```

New:
```tsx
import { MinusCircle, PlusCircle, X } from 'lucide-react'
import { Button, Col, DatePicker, Form, Input, InputNumber, message, Row, Select, Upload, Card } from 'antd'
import { PageHeader } from '@/shared/components/PageHeader'
```

- [ ] **Step 5: Remove `const { Title } = Typography`**

Delete this line:
```tsx
const { Title } = Typography
```

- [ ] **Step 6: Replace the header `<div>` block**

Old:
```tsx
<div className="flex items-center">
  <Button
    icon={<ArrowLeft size={18} />}
    className="mr-3"
    onClick={() => navigate('/dashboard/candidates')}
  />
  <Title level={3}>{isEditing ? 'Edit Candidate' : 'Add New Candidate'}</Title>
</div>
```

New:
```tsx
<PageHeader
  title={isEditing ? 'Edit Candidate' : 'Add New Candidate'}
  backPath="/dashboard/candidates"
/>
```

### 2c — `CandidateSendEmail.tsx`

- [ ] **Step 7: Update imports**

Old:
```tsx
import { ArrowLeft } from 'lucide-react'
import { Button, Card, Col, Form, Input, Row, Typography, message } from 'antd'
```

New (keep Typography for `Text`):
```tsx
import { Button, Card, Col, Form, Input, Row, Typography, message } from 'antd'
import { PageHeader } from '@/shared/components/PageHeader'
```

- [ ] **Step 8: Update Typography destructure** — remove `Title`, keep `Text`

Old:
```tsx
const { Title, Text } = Typography
```

New:
```tsx
const { Text } = Typography
```

- [ ] **Step 9: Replace the header `<div>` block**

Old:
```tsx
<div className="mb-6 flex items-center">
  <Button type="text" icon={<ArrowLeft size={18} />} className="mr-3" onClick={() => navigate('/dashboard/candidates')} />
  <Title level={3}>Send Email{candidate ? ` to ${candidate.name}` : ''}</Title>
</div>
```

New:
```tsx
<PageHeader
  title={`Send Email${candidate ? ` to ${candidate.name}` : ''}`}
  backPath="/dashboard/candidates"
/>
```

- [ ] **Step 10: Commit candidates module**

```bash
git add client/src/modules/candidates/page.tsx \
        client/src/modules/candidates/components/CandidateForm.tsx \
        client/src/modules/candidates/components/CandidateSendEmail.tsx
git commit -m "refactor: migrate candidates module to shared PageHeader"
```

---

## Task 3: Migrate assessments module (2 files)

**Files:**
- Modify: `client/src/modules/assessments/components/AssessmentForm.tsx`
- Modify: `client/src/modules/assessments/components/AssignAssessmentForm.tsx`

### 3a — `AssessmentForm.tsx`

- [ ] **Step 1: Update imports**

Old:
```tsx
import { ArrowLeft } from 'lucide-react'
import { Button, Card, Form, Input, InputNumber, Select, message, Typography } from 'antd'
```

New:
```tsx
import { Button, Card, Form, Input, InputNumber, Select, message } from 'antd'
import { PageHeader } from '@/shared/components/PageHeader'
```

- [ ] **Step 2: Remove `const { Title } = Typography`**

Delete:
```tsx
const { Title } = Typography
```

- [ ] **Step 3: Replace the header `<div>` block**

Old:
```tsx
<div className="mb-6 flex items-center">
  <Button
    type="text"
    icon={<ArrowLeft size={18} />}
    className="mr-3"
    onClick={() => navigate('/dashboard/assessments')}
  />
  <Title level={2}>{isEditing ? 'Edit Assessment' : 'New Assessment'}</Title>
</div>
```

New:
```tsx
<PageHeader
  title={isEditing ? 'Edit Assessment' : 'New Assessment'}
  backPath="/dashboard/assessments"
/>
```

### 3b — `AssignAssessmentForm.tsx`

- [ ] **Step 4: Update imports**

Old:
```tsx
import { ArrowLeft, X } from 'lucide-react'
import { Button, Card, Col, DatePicker, Form, Row, Select, Transfer, Typography, message, notification, Space } from 'antd'
```

New:
```tsx
import { X } from 'lucide-react'
import { Button, Card, Col, DatePicker, Form, Row, Select, Transfer, message, notification, Space } from 'antd'
import { PageHeader } from '@/shared/components/PageHeader'
```

- [ ] **Step 5: Replace the header `<div>` block**

Old:
```tsx
<div className="mb-6 flex items-center">
  <Button
    type="text"
    icon={<ArrowLeft size={18} />}
    onClick={() => navigate('/dashboard/assessments/assignments')}
  />
  <Typography.Title level={2} className="ml-2 text-lg font-semibold">
    Assign Assessment
  </Typography.Title>
</div>
```

New:
```tsx
<PageHeader
  title="Assign Assessment"
  backPath="/dashboard/assessments/assignments"
/>
```

- [ ] **Step 6: Commit assessments module**

```bash
git add client/src/modules/assessments/components/AssessmentForm.tsx \
        client/src/modules/assessments/components/AssignAssessmentForm.tsx
git commit -m "refactor: migrate assessments module to shared PageHeader"
```

---

## Task 4: Migrate offers module

**Files:**
- Modify: `client/src/modules/offers/components/OfferForm.tsx`

- [ ] **Step 1: Update imports** — remove `ArrowLeft` only (Typography stays — `Text` is used in the file)

Old:
```tsx
import { ArrowLeft } from 'lucide-react'
```

Delete that import line entirely (no other lucide icons used in this file).

Add after the antd import line:
```tsx
import { PageHeader } from '@/shared/components/PageHeader'
```

- [ ] **Step 2: Update Typography destructure** — remove `Title`, keep `Text`

Old:
```tsx
const { Title, Text } = Typography
```

New:
```tsx
const { Text } = Typography
```

- [ ] **Step 3: Replace the header `<div>` block**

Old:
```tsx
<div className="mb-6 flex items-center">
  <Button
    type="text"
    icon={<ArrowLeft size={18} />}
    className="mr-3"
    onClick={() => navigate('/dashboard/offers')}
  />
  <Title level={2}>{isEditing ? 'Edit Offer' : 'New Offer'}</Title>
</div>
```

New:
```tsx
<PageHeader
  title={isEditing ? 'Edit Offer' : 'New Offer'}
  backPath="/dashboard/offers"
/>
```

- [ ] **Step 4: Commit**

```bash
git add client/src/modules/offers/components/OfferForm.tsx
git commit -m "refactor: migrate offers module to shared PageHeader"
```

---

## Task 5: Migrate interviewers module

**Files:**
- Modify: `client/src/modules/interviewers/components/InterviewerForm.tsx`

- [ ] **Step 1: Update imports**

Old:
```tsx
import { ArrowLeft, Save, X } from 'lucide-react'
import { Button, Card, Form, Input, message, Typography } from 'antd'
```

New:
```tsx
import { Save, X } from 'lucide-react'
import { Button, Card, Form, Input, message } from 'antd'
import { PageHeader } from '@/shared/components/PageHeader'
```

- [ ] **Step 2: Remove `const { Title } = Typography`**

Delete:
```tsx
const { Title } = Typography
```

- [ ] **Step 3: Replace the header `<div>` block**

Old:
```tsx
<div className="mb-6 flex items-center">
  <Button
    type="text"
    icon={<ArrowLeft size={18} />}
    className="mr-3"
    onClick={() => navigate('/dashboard/interviewers')}
  />
  <Title level={2}>{isEditing ? 'Edit Interviewer' : 'Add Interviewer'}</Title>
</div>
```

New:
```tsx
<PageHeader
  title={isEditing ? 'Edit Interviewer' : 'Add Interviewer'}
  backPath="/dashboard/interviewers"
/>
```

- [ ] **Step 4: Commit**

```bash
git add client/src/modules/interviewers/components/InterviewerForm.tsx
git commit -m "refactor: migrate interviewers module to shared PageHeader"
```

---

## Task 6: Migrate emails module

**Files:**
- Modify: `client/src/modules/emails/components/EmailTemplateForm.tsx`

- [ ] **Step 1: Update imports**

Old:
```tsx
import { ArrowLeft } from 'lucide-react'
import { Button, Card, Form, Input, Select, message, Typography } from 'antd'
```

New:
```tsx
import { Button, Card, Form, Input, Select, message } from 'antd'
import { PageHeader } from '@/shared/components/PageHeader'
```

- [ ] **Step 2: Remove `const { Title } = Typography`**

Delete:
```tsx
const { Title } = Typography
```

- [ ] **Step 3: Replace the header `<div>` block**

Old:
```tsx
<div className="mb-6 flex items-center">
  <Button
    type="text"
    icon={<ArrowLeft size={18} />}
    className="mr-3"
    onClick={() => navigate('/dashboard/email-templates')}
  />
  <Title level={2}>{isEditing ? 'Edit Email Template' : 'New Email Template'}</Title>
</div>
```

New:
```tsx
<PageHeader
  title={isEditing ? 'Edit Email Template' : 'New Email Template'}
  backPath="/dashboard/email-templates"
/>
```

- [ ] **Step 4: Commit**

```bash
git add client/src/modules/emails/components/EmailTemplateForm.tsx
git commit -m "refactor: migrate emails module to shared PageHeader"
```

---

## Task 7: Migrate interviews module

**Files:**
- Modify: `client/src/modules/interviews/components/InterviewSchedule.tsx`

- [ ] **Step 1: Update imports**

Old:
```tsx
import { ArrowLeft, Save, X } from 'lucide-react'
import { Button, DatePicker, Form, Input, Select, TimePicker, Typography, message, Card } from 'antd'
```

New:
```tsx
import { Save, X } from 'lucide-react'
import { Button, DatePicker, Form, Input, Select, TimePicker, message, Card } from 'antd'
import { PageHeader } from '@/shared/components/PageHeader'
```

- [ ] **Step 2: Remove `const { Title } = Typography`**

Delete:
```tsx
const { Title } = Typography
```

- [ ] **Step 3: Replace the header `<div>` block**

Old:
```tsx
<div className="mb-6 flex items-center">
  <Button
    type="text"
    icon={<ArrowLeft size={18} />}
    className="mr-3"
    onClick={() => navigate('/dashboard/interviews')}
  />
  <Title level={3}>Schedule Interview</Title>
</div>
```

New:
```tsx
<PageHeader
  title="Schedule Interview"
  backPath="/dashboard/interviews"
/>
```

- [ ] **Step 4: Commit**

```bash
git add client/src/modules/interviews/components/InterviewSchedule.tsx
git commit -m "refactor: migrate interviews module to shared PageHeader"
```

---

## Final Verification

- [ ] Run the dev server: `cd client && yarn dev`
- [ ] Visit each of the 9 pages and verify:
  - Back arrow is visible with consistent styling (same size, same button style)
  - Clicking back arrow navigates to the correct list page
  - Page title renders correctly (including dynamic titles like "Edit Candidate")
  - `rightContent` renders for `CandidateDetailPage` (Edit button appears top-right)
  - No extra spacing or layout shifts compared to before
- [ ] Run a type check: `cd client && yarn build`
- [ ] Expected: zero TypeScript errors
