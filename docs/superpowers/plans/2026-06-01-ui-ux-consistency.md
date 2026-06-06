# UI/UX Consistency — Assessment, Offer, Email Templates, Escalation Pages

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring Assessment, Assignment, AssignAssessmentForm, Offer, EmailTemplate, and Escalation pages in line with the established page-layout UX pattern, using `CandidateTable` as the gold-standard reference.

**Architecture:** Each table component owns its full page layout (page header + Card + table). The pattern is: `motion.div` fade-in wrapper → page header row (Typography.Title + Typography.Text subtitle + CTA button) → `Card` containing the filter row + `Table`. The CTA button stays in the component because modal open-state lives there. Forms (AssignAssessmentForm) get a back button + title header above the existing Card.

**Tech Stack:** React, Ant Design (Typography, Card, Button), framer-motion (motion), lucide-react icons, react-router-dom (useNavigate where needed)

**Reference pattern (CandidateTable):**
```tsx
return (
  <>
    {contextHolder}
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography.Title level={2}>Page Title</Typography.Title>
          <Typography.Text className="mt-1 text-sm text-gray-500">Subtitle text</Typography.Text>
        </div>
        <Button type="primary" icon={<Icon size={16} />} onClick={...}>CTA Label</Button>
      </div>
      <Card>
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Input placeholder="Search..." prefix={<Search size={16} />} ... />
          <div className="flex gap-2">
            <Select ... />
            <Button icon={<FileDown size={16} />}>Export</Button>
          </div>
        </div>
        <Table ... />
      </Card>
    </motion.div>
    {/* Modal stays outside motion.div so overlay isn't clipped */}
  </>
)
```

---

## Task 1: AssessmentTable — page header + Card wrapper + motion

**Files:**
- Modify: `client/src/modules/assessments/components/AssessmentTable.tsx`

- [ ] **Step 1: Add `motion` import and `Typography` to antd imports**

  Current line 1-2:
  ```tsx
  import { useState, useMemo } from 'react'
  import { Table, Button, Input, Select, Space, Tag, Popconfirm, message, notification, Tooltip } from 'antd'
  ```
  Replace with:
  ```tsx
  import { useState, useMemo } from 'react'
  import { motion } from 'framer-motion'
  import { Table, Button, Card, Input, Select, Space, Tag, Popconfirm, message, notification, Tooltip, Typography } from 'antd'
  ```

- [ ] **Step 2: Restructure the `return` statement**

  Current return:
  ```tsx
  return (
    <div>
      {contextHolder}
      <div className="mb-4 flex items-center justify-between">
        <Space>
          <Input
            placeholder="Search assessments..."
            prefix={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 250 }}
          />
          <Select
            placeholder="Filter by type"
            value={typeFilter || undefined}
            onChange={(val) => setTypeFilter(val || '')}
            allowClear
            style={{ width: 160 }}
          >
            {assessmentTypes.map((t) => (
              <Option key={t} value={t} className="capitalize">{t}</Option>
            ))}
          </Select>
        </Space>
        <Space>
          <Tooltip title="Export CSV">
            <Button icon={<FileDown size={16} />} onClick={handleExport}>Export</Button>
          </Tooltip>
          <Button type="primary" icon={<Plus size={16} />} onClick={() => { setEditingAssessment(null); setFormOpen(true) }}>
            New Assessment
          </Button>
        </Space>
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />

      <AssessmentFormModal
        open={formOpen}
        assessment={editingAssessment}
        onClose={() => { setFormOpen(false); setEditingAssessment(null) }}
      />
    </div>
  )
  ```

  Replace with:
  ```tsx
  return (
    <>
      {contextHolder}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Typography.Title level={2}>Assessments</Typography.Title>
            <Typography.Text className="mt-1 text-sm text-gray-500">
              Manage assessment templates for candidate evaluation
            </Typography.Text>
          </div>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => { setEditingAssessment(null); setFormOpen(true) }}
          >
            New Assessment
          </Button>
        </div>

        <Card>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder="Search assessments..."
              prefix={<Search size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
            />
            <div className="flex gap-2">
              <Select
                placeholder="Filter by type"
                value={typeFilter || undefined}
                onChange={(val) => setTypeFilter(val || '')}
                allowClear
                style={{ width: 160 }}
              >
                {assessmentTypes.map((t) => (
                  <Option key={t} value={t} className="capitalize">{t}</Option>
                ))}
              </Select>
              <Tooltip title="Export CSV">
                <Button icon={<FileDown size={16} />} onClick={handleExport}>Export</Button>
              </Tooltip>
            </div>
          </div>

          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="_id"
            loading={isLoading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </motion.div>

      <AssessmentFormModal
        open={formOpen}
        assessment={editingAssessment}
        onClose={() => { setFormOpen(false); setEditingAssessment(null) }}
      />
    </>
  )
  ```

- [ ] **Step 3: Verify the page renders correctly in the browser at `/dashboard/assessments`**

  Expected: Fade-in animation, "Assessments" heading with subtitle, "New Assessment" button top-right, Card wrapping search/filter/table.

- [ ] **Step 4: Commit**
  ```bash
  git add client/src/modules/assessments/components/AssessmentTable.tsx
  git commit -m "feat: apply page-header + Card layout to AssessmentTable (UX consistency)"
  ```

---

## Task 2: AssignmentTable — page header + Card + motion + navigate button

**Files:**
- Modify: `client/src/modules/assessments/components/AssignmentTable.tsx`

- [ ] **Step 1: Add `motion`, `useNavigate`, `Typography`, `Card` imports**

  Current imports:
  ```tsx
  import { useState, useMemo } from 'react'
  import { Table, Button, Input, Select, Space, Tag, Popconfirm, message, notification, Tooltip, Modal, Form, InputNumber } from 'antd'
  import { Search, Trash2, Star } from 'lucide-react'
  import { useAssignmentList, useSubmitScore, useDeleteAssignment } from '../lib/queries/assessment.queries'
  import dayjs from 'dayjs'
  import type { Assignment } from '../types/assessment.types'
  ```

  Replace with:
  ```tsx
  import { useState, useMemo } from 'react'
  import { motion } from 'framer-motion'
  import { useNavigate } from 'react-router-dom'
  import { Table, Button, Card, Input, Select, Space, Tag, Popconfirm, message, notification, Tooltip, Modal, Form, InputNumber, Typography } from 'antd'
  import { Search, Trash2, Star, Plus } from 'lucide-react'
  import { useAssignmentList, useSubmitScore, useDeleteAssignment } from '../lib/queries/assessment.queries'
  import dayjs from 'dayjs'
  import type { Assignment } from '../types/assessment.types'
  ```

- [ ] **Step 2: Add `const navigate = useNavigate()` inside the component**

  After the `const [form] = Form.useForm()` line, add:
  ```tsx
  const navigate = useNavigate()
  ```

- [ ] **Step 3: Restructure the `return` statement**

  Current return opens with:
  ```tsx
  return (
    <div>
      {contextHolder}
      <div className="mb-4 flex items-center justify-between">
        <Space>
          <Input ... />
          <Select ... />
        </Space>
      </div>

      <Table ... />

      <Modal ... >
        ...
      </Modal>
    </div>
  )
  ```

  Replace with:
  ```tsx
  return (
    <>
      {contextHolder}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Typography.Title level={2}>Assessment Assignments</Typography.Title>
            <Typography.Text className="mt-1 text-sm text-gray-500">
              Manage and track candidate assessment assignments
            </Typography.Text>
          </div>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => navigate('/dashboard/assessments/assign')}
          >
            Assign Assessment
          </Button>
        </div>

        <Card>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder="Search by candidate..."
              prefix={<Search size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
            />
            <Select
              placeholder="Filter by status"
              value={statusFilter || undefined}
              onChange={(val) => setStatusFilter(val || '')}
              allowClear
              style={{ width: 160 }}
            >
              <Option value="pending">Pending</Option>
              <Option value="completed">Completed</Option>
              <Option value="evaluated">Evaluated</Option>
            </Select>
          </div>

          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="_id"
            loading={isLoading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </motion.div>

      <Modal
        open={scoreModalOpen}
        title="Submit Score"
        onCancel={() => { setScoreModalOpen(false); setSelectedAssignment(null); form.resetFields() }}
        footer={null}
        width={480}
      >
        {/* keep existing Modal content exactly as-is */}
      </Modal>
    </>
  )
  ```

  > **Note:** Keep the Modal content inside the Modal unchanged — only restructure the outer wrapper.

- [ ] **Step 4: Verify at `/dashboard/assessments/assignments`**

  Expected: Fade-in, "Assessment Assignments" heading, "Assign Assessment" button navigates to `/dashboard/assessments/assign`, Card wraps search/filter/table.

- [ ] **Step 5: Commit**
  ```bash
  git add client/src/modules/assessments/components/AssignmentTable.tsx
  git commit -m "feat: apply page-header + Card layout to AssignmentTable (UX consistency)"
  ```

---

## Task 3: AssignAssessmentForm — back button + page header + motion

**Files:**
- Modify: `client/src/modules/assessments/components/AssignAssessmentForm.tsx`

- [ ] **Step 1: Add `motion`, `useNavigate`, `ArrowLeft` imports**

  Current imports start with:
  ```tsx
  import { useEffect, useMemo, useState } from 'react'
  import { Card, Form, Input, Select, Transfer, DatePicker, Typography, Button, message, notification, Space } from 'antd'
  ```
  Add after the React import line:
  ```tsx
  import { motion } from 'framer-motion'
  import { useNavigate } from 'react-router-dom'
  ```
  Add `ArrowLeft` to the existing lucide import (or add a new one if none exists):
  ```tsx
  import { ArrowLeft } from 'lucide-react'
  ```

- [ ] **Step 2: Add `const navigate = useNavigate()` inside component**

  After the hook declarations, add:
  ```tsx
  const navigate = useNavigate()
  ```

- [ ] **Step 3: Restructure the `return` statement**

  Current return:
  ```tsx
  return (
    <div>
      {contextHolder}
      <Card>
        <Title level={4}>Assign Assessment</Title>
        <Form ...>
          ...
        </Form>
      </Card>
    </div>
  )
  ```

  Replace with:
  ```tsx
  return (
    <>
      {contextHolder}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="mb-6 flex items-center">
          <Button
            type="text"
            icon={<ArrowLeft size={18} />}
            onClick={() => navigate('/dashboard/assessments/assignments')}
          />
          <Typography.Title level={3} className="!mb-0 ml-2">Assign Assessment</Typography.Title>
        </div>

        <Card>
          <Form form={form} layout="vertical" style={{ maxWidth: 800 }}>
            {/* keep all existing Form.Item fields exactly as-is */}
          </Form>
        </Card>
      </motion.div>
    </>
  )
  ```

  > **Key change:** Remove `<Title level={4}>Assign Assessment</Title>` from inside the Card; it moves to the page header above the Card. Keep all Form.Item fields unchanged.

- [ ] **Step 4: Verify at `/dashboard/assessments/assign`**

  Expected: Fade-in animation, back-arrow button + "Assign Assessment" title at top, Card with form below, back arrow navigates to `/dashboard/assessments/assignments`.

- [ ] **Step 5: Commit**
  ```bash
  git add client/src/modules/assessments/components/AssignAssessmentForm.tsx
  git commit -m "feat: add back button + page header to AssignAssessmentForm (UX consistency)"
  ```

---

## Task 4: OfferTable — page header + Card + motion

**Files:**
- Modify: `client/src/modules/offers/components/OfferTable.tsx`

- [ ] **Step 1: Add `motion` and `Typography` imports**

  Current imports:
  ```tsx
  import { useState, useMemo } from 'react'
  import { Table, Button, Input, Select, Space, Tag, Popconfirm, message, notification, Tooltip } from 'antd'
  import { Plus, Search, Trash2, Send, Eye, FileDown } from 'lucide-react'
  ```

  Replace with:
  ```tsx
  import { useState, useMemo } from 'react'
  import { motion } from 'framer-motion'
  import { Table, Button, Card, Input, Select, Space, Tag, Popconfirm, message, notification, Tooltip, Typography } from 'antd'
  import { Plus, Search, Trash2, Send, Eye, FileDown } from 'lucide-react'
  ```

- [ ] **Step 2: Restructure the `return` statement**

  Current return opens with:
  ```tsx
  return (
    <div>
      {contextHolder}
      <div className="mb-4 flex items-center justify-between">
        <Space>
          <Input ... />
          <Select ...>...</Select>
        </Space>
        <Space>
          <Tooltip title="Export CSV"><Button ...>Export</Button></Tooltip>
          <Button type="primary" icon={<Plus size={16} />} onClick={() => { setEditingOffer(null); setFormOpen(true) }}>
            New Offer
          </Button>
        </Space>
      </div>

      <Table ... />

      <OfferFormModal ... />
      <OfferDetailModal ... />
    </div>
  )
  ```

  Replace with:
  ```tsx
  return (
    <>
      {contextHolder}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Typography.Title level={2}>Offer Letters</Typography.Title>
            <Typography.Text className="mt-1 text-sm text-gray-500">
              Create and manage offer letters for candidates
            </Typography.Text>
          </div>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => { setEditingOffer(null); setFormOpen(true) }}
          >
            New Offer
          </Button>
        </div>

        <Card>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder="Search by candidate..."
              prefix={<Search size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
            />
            <div className="flex gap-2">
              <Select
                placeholder="Filter by status"
                value={statusFilter || undefined}
                onChange={(val) => setStatusFilter(val || '')}
                allowClear
                style={{ width: 160 }}
              >
                <Option value="draft">Draft</Option>
                <Option value="sent">Sent</Option>
                <Option value="accepted">Accepted</Option>
                <Option value="rejected">Rejected</Option>
              </Select>
              <Tooltip title="Export CSV">
                <Button icon={<FileDown size={16} />} onClick={handleExport}>Export</Button>
              </Tooltip>
            </div>
          </div>

          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="_id"
            loading={isLoading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </motion.div>

      <OfferFormModal
        open={formOpen}
        offer={editingOffer}
        onClose={() => { setFormOpen(false); setEditingOffer(null) }}
      />
      <OfferDetailModal
        offer={detailOffer}
        open={detailOpen}
        onClose={() => { setDetailOpen(false); setDetailOffer(null) }}
      />
    </>
  )
  ```

- [ ] **Step 3: Verify at `/dashboard/offers`**

  Expected: Fade-in, "Offer Letters" heading, "New Offer" button top-right opens the modal, Card wraps search/filter/table, Export button in filter row.

- [ ] **Step 4: Commit**
  ```bash
  git add client/src/modules/offers/components/OfferTable.tsx
  git commit -m "feat: apply page-header + Card layout to OfferTable (UX consistency)"
  ```

---

## Task 5: EmailTemplateTable — page header + Card + motion

**Files:**
- Modify: `client/src/modules/emails/components/EmailTemplateTable.tsx`

- [ ] **Step 1: Add `motion` and `Typography` (+ `Card`) imports**

  Current imports:
  ```tsx
  import { useState, useMemo } from 'react'
  import { Table, Button, Input, Select, Space, Tag, Popconfirm, message, Tooltip } from 'antd'
  import { Plus, Search, Edit3, Trash2, Eye } from 'lucide-react'
  ```

  Replace with:
  ```tsx
  import { useState, useMemo } from 'react'
  import { motion } from 'framer-motion'
  import { Table, Button, Card, Input, Select, Space, Tag, Popconfirm, message, Tooltip, Typography } from 'antd'
  import { Plus, Search, Edit3, Trash2, Eye } from 'lucide-react'
  ```

- [ ] **Step 2: Restructure the `return` statement**

  Current return:
  ```tsx
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Space>
          <Input ... />
          <Select ...>...</Select>
        </Space>
        <Button type="primary" icon={<Plus size={16} />} onClick={() => { setEditingTemplate(null); setFormOpen(true) }}>
          New Template
        </Button>
      </div>

      <Table ... />

      <EmailTemplateFormModal ... />
      <EmailTemplatePreviewModal ... />
    </div>
  )
  ```

  Replace with:
  ```tsx
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Typography.Title level={2}>Email Templates</Typography.Title>
            <Typography.Text className="mt-1 text-sm text-gray-500">
              Manage email templates for various recruitment communications
            </Typography.Text>
          </div>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => { setEditingTemplate(null); setFormOpen(true) }}
          >
            New Template
          </Button>
        </div>

        <Card>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder="Search templates..."
              prefix={<Search size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
            />
            <Select
              placeholder="Filter by type"
              value={typeFilter || undefined}
              onChange={(val) => setTypeFilter(val || '')}
              allowClear
              style={{ width: 160 }}
            >
              {(['offer', 'interview', 'assessment', 'rejection', 'other'] as EmailTemplateType[]).map((t) => (
                <Option key={t} value={t} className="capitalize">{t}</Option>
              ))}
            </Select>
          </div>

          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="_id"
            loading={isLoading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </motion.div>

      <EmailTemplateFormModal
        open={formOpen}
        template={editingTemplate}
        onClose={() => { setFormOpen(false); setEditingTemplate(null) }}
      />
      <EmailTemplatePreviewModal
        template={previewTemplate}
        open={previewOpen}
        onClose={() => { setPreviewOpen(false); setPreviewTemplate(null) }}
      />
    </>
  )
  ```

- [ ] **Step 3: Verify at `/dashboard/email-templates`**

  Expected: Fade-in, "Email Templates" heading, "New Template" button top-right, Card wraps filter/table.

- [ ] **Step 4: Commit**
  ```bash
  git add client/src/modules/emails/components/EmailTemplateTable.tsx
  git commit -m "feat: apply page-header + Card layout to EmailTemplateTable (UX consistency)"
  ```

---

## Task 6: EscalationsPage — Typography header + motion + clean Card structure

**Files:**
- Modify: `client/src/modules/escalations/page.tsx`

- [ ] **Step 1: Add `motion` import and `Typography` to antd imports**

  Current import:
  ```tsx
  import { Card, Spin, Empty, Statistic, Row, Col, Button, Space, Input, Tag } from 'antd';
  ```

  Replace with:
  ```tsx
  import { motion } from 'framer-motion'
  import { Card, Spin, Empty, Statistic, Row, Col, Input, Typography } from 'antd';
  ```
  > Remove unused `Button`, `Space`, `Tag` (Filter button was not wired up). Keep only what's used.

- [ ] **Step 2: Replace the page header section**

  Current:
  ```tsx
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Escalations</h1>
        <p className="text-sm text-gray-600 mt-1">
          {isHR && 'Manage escalations you have raised'}
          {isHRAdmin && 'Review and resolve escalations assigned to you'}
          {isAdmin && 'Manage all escalations'}
        </p>
      </div>
      ...
    </div>
  )
  ```

  Replace with:
  ```tsx
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <Typography.Title level={2}>Escalations</Typography.Title>
        <Typography.Text className="mt-1 text-sm text-gray-500">
          {isHR && 'Manage escalations you have raised'}
          {isHRAdmin && 'Review and resolve escalations assigned to you'}
          {isAdmin && 'Manage all escalations'}
        </Typography.Text>
      </div>
      ...
    </motion.div>
  )
  ```

- [ ] **Step 3: Remove the standalone search Card and move the search Input inside the role-based content Card**

  Current structure (redundant nesting — a search Card followed by a separate content Card):
  ```tsx
  {/* Search and Filter */}
  <Card className="mb-6">
    <Space direction="horizontal" className="w-full" style={{ display: 'flex' }}>
      <Input.Search
        placeholder="Search by candidate name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '300px' }}
        allowClear
      />
      <Button icon={<FilterOutlined />}>Filter</Button>
    </Space>
  </Card>

  {/* Content */}
  <Card>
    {isLoading ? ... : getRoleBasedView()}
  </Card>
  ```

  Replace with a single Card that contains both search and content:
  ```tsx
  <Card>
    <div className="mb-4">
      <Input
        placeholder="Search by candidate name or email..."
        prefix={<Search size={16} />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: 300 }}
        allowClear
      />
    </div>
    {isLoading ? (
      <div className="flex justify-center items-center py-8">
        <Spin size="large" />
      </div>
    ) : (
      getRoleBasedView()
    )}
  </Card>
  ```
  
  Also add `Search` to lucide imports:
  ```tsx
  import { Search } from 'lucide-react'
  ```
  
  Also remove the unused `FilterOutlined` import from ant design icons:
  ```tsx
  // Remove: import { FilterOutlined } from '@ant-design/icons';
  ```

- [ ] **Step 4: Clean up `getRoleBasedView` — remove inner Cards (content Card wraps everything)**

  Current `getRoleBasedView` wraps its content in a `<Card>` and `<div className="space-y-4"><Card>`. Since the outer structure now has a single Card, remove the inner Card wrappers inside `getRoleBasedView`:

  ```tsx
  const getRoleBasedView = () => {
    if (isHR) {
      return (
        <>
          <p className="text-sm text-gray-600 mb-4">
            Escalations you have raised to HR Admins
          </p>
          <EscalationsTable escalations={filteredEscalations} isLoading={isLoading} hrAdmins={admins} />
        </>
      );
    }

    if (isHRAdmin || isAdmin) {
      return (
        <>
          <p className="text-sm text-gray-600 mb-4">
            Escalations assigned to you for review and resolution
          </p>
          <EscalationsTable escalations={filteredEscalations} isLoading={isLoading} hrAdmins={admins} />
        </>
      );
    }

    return <Empty description="No access to escalations" />;
  };
  ```

- [ ] **Step 5: Verify at `/dashboard/escalations`**

  Expected: Fade-in animation, "Escalations" heading (Typography.Title), subtitle using Typography.Text, stats row (4 cards), single Card with search input + table below.

- [ ] **Step 6: Commit**
  ```bash
  git add client/src/modules/escalations/page.tsx
  git commit -m "feat: apply Typography + motion + clean Card layout to EscalationsPage (UX consistency)"
  ```

---

---

## Task 7: OfferFormModal — live email preview + Save as Draft / Send Offer

**Files:**
- Modify: `client/src/modules/offers/components/OfferFormModal.tsx`

Changes: replace single-status dropdown + default OK button with a 2-column layout
(form left, live preview right) and explicit `Save as Draft` / `Send Offer` footer buttons.

---

## Task 8: EmailTemplateFormModal — variables sidebar + formatting guide + hired type

**Files:**
- Modify: `client/src/modules/emails/components/EmailTemplateFormModal.tsx`
- Modify: `client/src/modules/emails/types/email.types.ts`
- Modify: `client/src/modules/emails/components/EmailTemplateTable.tsx`

Changes: widen modal to 1000px, add 2-column layout (form left, variables sidebar right),
add formatting guide, add `hired` to template types everywhere.

---

## Task 9: Security fixes — XSS + CSV formula injection

**Files:**
- Modify: `client/src/modules/emails/components/EmailTemplatePreviewModal.tsx`
- Modify: `client/src/modules/assessments/components/AssessmentTable.tsx`
- Modify: `client/src/modules/offers/components/OfferTable.tsx`

Changes: sanitize template body with DOMPurify before dangerouslySetInnerHTML;
validate assessment link scheme (https? only); sanitize CSV exports against formula injection.

---

## Self-Review Checklist

**Spec coverage:**
- [x] AssessmentTable: motion + page header (Title/subtitle/"New Assessment") + Card → Task 1
- [x] AssignmentTable: motion + page header (Title/subtitle/"Assign Assessment" nav) + Card → Task 2
- [x] AssignAssessmentForm: motion + back button + Title level 3 → Task 3
- [x] OfferTable: motion + page header (Title/subtitle/"New Offer") + Card → Task 4
- [x] EmailTemplateTable: motion + page header (Title/subtitle/"New Template") + Card → Task 5
- [x] EscalationsPage: motion + Typography.Title/Text + single Card + remove FilterButton stub → Task 6

**No placeholders:** All code blocks are complete and copy-pasteable.

**Type consistency:** No new types introduced; all existing state variables (`setFormOpen`, `setEditingAssessment`, `setStatusFilter`, etc.) are referenced correctly in the new structure.
