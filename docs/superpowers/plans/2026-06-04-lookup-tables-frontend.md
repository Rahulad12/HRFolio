# Lookup Tables — Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consume the four lookup table APIs to replace every hardcoded enum label map and raw string display across the app, then build an admin UI for managing lookup values.

**Architecture:** A new `client/src/modules/lookup/` module provides four React Query hooks (`useInterviewRounds`, `useCandidateStatuses`, `useInterviewTypes`, `useInterviewStatuses`) with `staleTime: Infinity`. Two shared utilities (`getLookupLabel`, `getLookupColor`) in `shared/utils/lookup.ts` handle fallback-safe display. Seven components are migrated to use hook data. A new `settings` module at `/dashboard/settings/lookup-values` provides the admin CRUD UI.

**Prerequisite:** The backend plan (`2026-06-04-lookup-tables-backend.md`) must be deployed and seeded before this plan is implemented.

**Tech Stack:** React, TypeScript, Ant Design, React Query (`@tanstack/react-query`), React Router

---

## File Map

| Action | File |
|--------|------|
| Modify | `client/src/constant.ts` |
| Create | `client/src/modules/lookup/types/lookup.types.ts` |
| Create | `client/src/modules/lookup/lib/api/lookup.api.ts` |
| Create | `client/src/modules/lookup/lib/queries/lookup.queries.ts` |
| Create | `client/src/modules/lookup/index.ts` |
| Create | `client/src/shared/utils/lookup.ts` |
| Modify | `client/src/modules/candidates/components/CandidateProgress.tsx` |
| Modify | `client/src/modules/candidates/components/CandidateTable.tsx` |
| Modify | `client/src/modules/candidates/components/CandidateHistory.tsx` |
| Modify | `client/src/modules/interviews/components/InterviewList.tsx` |
| Modify | `client/src/modules/interviews/components/InterviewCalendar.tsx` |
| Modify | `client/src/modules/interviews/components/InterviewSchedule.tsx` |
| Modify | `client/src/modules/dashboard/components/ListOfCandidatesWithStatus.tsx` |
| Create | `client/src/modules/settings/types/settings.types.ts` |
| Create | `client/src/modules/settings/lib/api/settings.api.ts` |
| Create | `client/src/modules/settings/lib/queries/settings.queries.ts` |
| Create | `client/src/modules/settings/components/LookupValuesManager.tsx` |
| Create | `client/src/modules/settings/page.tsx` |
| Create | `client/src/modules/settings/routes/settings.routes.tsx` |
| Create | `client/src/modules/settings/index.ts` |
| Modify | `client/src/shared/routes/index.tsx` |
| Modify | `client/src/shared/components/DashboardSidebar.tsx` |

---

## Task 1: Add URL constants and create lookup types + API + queries

**Files:**
- Modify: `client/src/constant.ts`
- Create: `client/src/modules/lookup/types/lookup.types.ts`
- Create: `client/src/modules/lookup/lib/api/lookup.api.ts`
- Create: `client/src/modules/lookup/lib/queries/lookup.queries.ts`
- Create: `client/src/modules/lookup/index.ts`

- [ ] **Step 1: Add lookup URL constant to `client/src/constant.ts`**

Add at the end of the existing exports:
```ts
export const LOOKUP_URL = 'lookup';
```

- [ ] **Step 2: Create `lookup/types/lookup.types.ts`**

```ts
export interface LookupValue {
  _id: string
  systemName: string
  displayName: string
  order: number
  color?: string
  isActive: boolean
}

export interface LookupListResponse {
  success: boolean
  data: LookupValue[]
}

export interface LookupMutationResponse {
  success: boolean
  message: string
  data?: LookupValue
}
```

- [ ] **Step 3: Create `lookup/lib/api/lookup.api.ts`**

```ts
import { GET, POST, PUT, DELETE } from '@/shared/lib/axios'
import { LOOKUP_URL } from '@/shared/constants/api'
import type { LookupListResponse, LookupMutationResponse } from '../../types/lookup.types'

export const fetchInterviewRounds = () =>
  GET<LookupListResponse>(`/${LOOKUP_URL}/interview-rounds`)

export const fetchCandidateStatuses = () =>
  GET<LookupListResponse>(`/${LOOKUP_URL}/candidate-statuses`)

export const fetchInterviewTypes = () =>
  GET<LookupListResponse>(`/${LOOKUP_URL}/interview-types`)

export const fetchInterviewStatuses = () =>
  GET<LookupListResponse>(`/${LOOKUP_URL}/interview-statuses`)

export const createLookupValue = (endpoint: string, data: Record<string, unknown>) =>
  POST<LookupMutationResponse>(`/${LOOKUP_URL}/${endpoint}`, data)

export const updateLookupValue = (endpoint: string, id: string, data: Record<string, unknown>) =>
  PUT<LookupMutationResponse>(`/${LOOKUP_URL}/${endpoint}/${id}`, data)

export const deactivateLookupValue = (endpoint: string, id: string) =>
  DELETE<LookupMutationResponse>(`/${LOOKUP_URL}/${endpoint}/${id}`)
```

- [ ] **Step 4: Create `lookup/lib/queries/lookup.queries.ts`**

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as lookupApi from '../api/lookup.api'
import type { LookupValue } from '../../types/lookup.types'

export const LOOKUP_KEYS = {
  interviewRounds: ['lookup', 'interview-rounds'] as const,
  candidateStatuses: ['lookup', 'candidate-statuses'] as const,
  interviewTypes: ['lookup', 'interview-types'] as const,
  interviewStatuses: ['lookup', 'interview-statuses'] as const,
}

export function useInterviewRounds() {
  return useQuery({
    queryKey: LOOKUP_KEYS.interviewRounds,
    queryFn: () => lookupApi.fetchInterviewRounds(),
    staleTime: Infinity,
    select: (res) => res.data,
  })
}

export function useCandidateStatuses() {
  return useQuery({
    queryKey: LOOKUP_KEYS.candidateStatuses,
    queryFn: () => lookupApi.fetchCandidateStatuses(),
    staleTime: Infinity,
    select: (res) => res.data,
  })
}

export function useInterviewTypes() {
  return useQuery({
    queryKey: LOOKUP_KEYS.interviewTypes,
    queryFn: () => lookupApi.fetchInterviewTypes(),
    staleTime: Infinity,
    select: (res) => res.data,
  })
}

export function useInterviewStatuses() {
  return useQuery({
    queryKey: LOOKUP_KEYS.interviewStatuses,
    queryFn: () => lookupApi.fetchInterviewStatuses(),
    staleTime: Infinity,
    select: (res) => res.data,
  })
}

export function useCreateLookupValue(endpoint: string, queryKey: readonly string[]) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => lookupApi.createLookupValue(endpoint, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })
}

export function useUpdateLookupValue(endpoint: string, queryKey: readonly string[]) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      lookupApi.updateLookupValue(endpoint, id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })
}

export function useDeactivateLookupValue(endpoint: string, queryKey: readonly string[]) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => lookupApi.deactivateLookupValue(endpoint, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })
}
```

- [ ] **Step 5: Create `lookup/index.ts`**

```ts
export { useInterviewRounds, useCandidateStatuses, useInterviewTypes, useInterviewStatuses } from './lib/queries/lookup.queries'
export type { LookupValue } from './types/lookup.types'
```

- [ ] **Step 6: Verify TypeScript**

```bash
cd client && yarn tsc --noEmit 2>&1 | grep -v AssignmentTable
```

Expected: `Done` with no errors.

- [ ] **Step 7: Commit**

```bash
git add client/src/constant.ts \
        client/src/modules/lookup/
git commit -m "feat: add lookup module — types, API client, and React Query hooks"
```

---

## Task 2: Create shared lookup utilities

**Files:**
- Create: `client/src/shared/utils/lookup.ts`

- [ ] **Step 1: Create `shared/utils/lookup.ts`**

```ts
import type { LookupValue } from '@/modules/lookup'

export function getLookupLabel(values: LookupValue[] | undefined, systemName: string): string {
  if (!values) return systemName
  return values.find(v => v.systemName === systemName)?.displayName ?? systemName
}

export function getLookupColor(values: LookupValue[] | undefined, systemName: string): string {
  if (!values) return 'default'
  return values.find(v => v.systemName === systemName)?.color ?? 'default'
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/shared/utils/lookup.ts
git commit -m "feat: add getLookupLabel and getLookupColor shared utilities"
```

---

## Task 3: Migrate CandidateProgress and CandidateTable

**Files:**
- Modify: `client/src/modules/candidates/components/CandidateProgress.tsx`
- Modify: `client/src/modules/candidates/components/CandidateTable.tsx`

### 3a — `CandidateProgress.tsx`

The component currently has a hardcoded `StatusFlow` array and `labelMap`. Replace with `useCandidateStatuses()` so the pipeline steps render dynamically from the DB.

- [ ] **Step 1: Add import**

Add at the top of the file:
```tsx
import { useCandidateStatuses } from '@/modules/lookup'
```

- [ ] **Step 2: Replace the hardcoded `StatusFlow` and `labelMap` constants**

Remove these lines:
```tsx
const StatusFlow: CandidateStatus[] = [
  'shortlisted', 'assessment', 'first', 'second', 'third', 'offered', 'hired',
]

const labelMap: Record<CandidateStatus, string> = {
  shortlisted: 'Shortlisted', first: 'First Interview', second: 'Second Interview',
  third: 'Third Interview', assessment: 'Assessment', offered: 'Offered',
  hired: 'Hired', rejected: 'Rejected',
}
```

- [ ] **Step 3: Add hook call inside `CandidateProgress` function**

Add after the existing hook calls:
```tsx
const { data: statusList = [] } = useCandidateStatuses()
const StatusFlow = statusList
  .filter(s => s.systemName !== 'rejected')
  .map(s => s.systemName as CandidateStatus)
```

- [ ] **Step 4: Replace `makeCapitilized(labelMap[step])` with `statusList` lookup**

Old:
```tsx
title={makeCapitilized(labelMap[step])}
```
And:
```tsx
label: makeCapitilized(labelMap[step]),
```

New (both occurrences):
```tsx
title={statusList.find(s => s.systemName === step)?.displayName ?? step}
```
And:
```tsx
label: statusList.find(s => s.systemName === step)?.displayName ?? step,
```

### 3b — `CandidateTable.tsx`

- [ ] **Step 5: Add import**

```tsx
import { useCandidateStatuses } from '@/modules/lookup'
import { getLookupLabel, getLookupColor } from '@/shared/utils/lookup'
```

- [ ] **Step 6: Remove hardcoded `statusColors` and `labelMap` objects**

Delete:
```tsx
const statusColors: Record<CandidateStatus, string> = {
  shortlisted: 'blue', assessment: 'geekblue', first: 'orange',
  second: 'purple', third: 'cyan', offered: 'volcano', hired: 'green', rejected: 'red',
}

const labelMap: Record<CandidateStatus, string> = {
  shortlisted: 'Shortlisted', first: 'First Interview', second: 'Second Interview',
  third: 'Third Interview', assessment: 'Assessment', offered: 'Offered',
  hired: 'Hired', rejected: 'Rejected',
}

const statusOptions = Object.entries(labelMap).map(([value, label]) => ({ value, label }))
```

- [ ] **Step 7: Add hook inside `CandidateTable` function, build options dynamically**

```tsx
const { data: statusList = [] } = useCandidateStatuses()
const statusOptions = statusList.map(s => ({ value: s.systemName, label: s.displayName }))
```

- [ ] **Step 8: Replace inline `statusColors[...]` and `labelMap[...]` references**

Find the tag rendering in the table columns. Old pattern:
```tsx
<Tag color={statusColors[record.status]}>{labelMap[record.status]}</Tag>
```

New:
```tsx
<Tag color={getLookupColor(statusList, record.status)}>
  {getLookupLabel(statusList, record.status)}
</Tag>
```

- [ ] **Step 9: Verify TypeScript**

```bash
cd client && yarn tsc --noEmit 2>&1 | grep -v AssignmentTable
```

Expected: `Done` with no errors.

- [ ] **Step 10: Commit**

```bash
git add client/src/modules/candidates/components/CandidateProgress.tsx \
        client/src/modules/candidates/components/CandidateTable.tsx
git commit -m "refactor: migrate CandidateProgress and CandidateTable to use lookup hooks"
```

---

## Task 4: Migrate CandidateHistory, InterviewList, InterviewCalendar

**Files:**
- Modify: `client/src/modules/candidates/components/CandidateHistory.tsx`
- Modify: `client/src/modules/interviews/components/InterviewList.tsx`
- Modify: `client/src/modules/interviews/components/InterviewCalendar.tsx`

### 4a — `CandidateHistory.tsx`

- [ ] **Step 1: Add imports**

```tsx
import { useInterviewRounds } from '@/modules/lookup'
import { getLookupLabel, getLookupColor } from '@/shared/utils/lookup'
```

- [ ] **Step 2: Add hook inside `CandidateHistory` function**

After existing hook calls:
```tsx
const { data: interviewRounds } = useInterviewRounds()
```

- [ ] **Step 3: Remove `getInterviewRoundTagColor` function**

Delete:
```tsx
const getInterviewRoundTagColor = (round: string) => {
  switch (round) {
    case 'first': return 'blue'
    case 'second': return 'purple'
    case 'third': return 'warning'
    default: return 'volcano'
  }
}
```

- [ ] **Step 4: Replace raw round display (line ~211)**

Old:
```tsx
<Tag color={getInterviewRoundTagColor(log?.details?.interviewRound)}>
  {log?.details?.interviewRound}
</Tag>
```

New:
```tsx
<Tag color={getLookupColor(interviewRounds, log?.details?.interviewRound)}>
  {getLookupLabel(interviewRounds, log?.details?.interviewRound)}
</Tag>
```

### 4b — `InterviewList.tsx`

- [ ] **Step 5: Add imports**

```tsx
import { useInterviewRounds, useInterviewStatuses } from '@/modules/lookup'
import { getLookupLabel, getLookupColor } from '@/shared/utils/lookup'
```

- [ ] **Step 6: Add hooks inside `InterviewList` function**

```tsx
const { data: interviewRounds } = useInterviewRounds()
const { data: interviewStatuses } = useInterviewStatuses()
```

- [ ] **Step 7: Remove `getRoundColor` and `getStatusColor` switch functions**

Delete:
```tsx
const getRoundColor = (round: string) => {
  switch (round) { case 'first': return 'blue' ... }
}

const getStatusColor = (status: string) => {
  switch (status) { case 'scheduled': return 'blue' ... }
}
```

- [ ] **Step 8: Replace raw round tag (line ~205)**

Old:
```tsx
<Tag color={getRoundColor(interview.InterviewRound)} className="capitalize">
  {interview.InterviewRound} Interview
</Tag>
```

New:
```tsx
<Tag color={getLookupColor(interviewRounds, interview.InterviewRound)}>
  {getLookupLabel(interviewRounds, interview.InterviewRound)}
</Tag>
```

- [ ] **Step 9: Replace status color where `getStatusColor` was used**

Old:
```tsx
color={getStatusColor(interview.status)}
```

New:
```tsx
color={getLookupColor(interviewStatuses, interview.status)}
```

### 4c — `InterviewCalendar.tsx`

- [ ] **Step 10: Add imports**

```tsx
import { useInterviewRounds } from '@/modules/lookup'
import { getLookupLabel } from '@/shared/utils/lookup'
```

- [ ] **Step 11: Add hook at top of component**

```tsx
const { data: interviewRounds } = useInterviewRounds()
```

- [ ] **Step 12: Replace raw string (line ~95)**

Old:
```tsx
Interview Round: {interview.InterviewRound} interview
```

New:
```tsx
{getLookupLabel(interviewRounds, interview.InterviewRound)}
```

- [ ] **Step 13: Verify TypeScript**

```bash
cd client && yarn tsc --noEmit 2>&1 | grep -v AssignmentTable
```

- [ ] **Step 14: Commit**

```bash
git add client/src/modules/candidates/components/CandidateHistory.tsx \
        client/src/modules/interviews/components/InterviewList.tsx \
        client/src/modules/interviews/components/InterviewCalendar.tsx
git commit -m "refactor: replace raw enum strings with lookup data in History, InterviewList, Calendar"
```

---

## Task 5: Migrate InterviewSchedule and dashboard

**Files:**
- Modify: `client/src/modules/interviews/components/InterviewSchedule.tsx`
- Modify: `client/src/modules/dashboard/components/ListOfCandidatesWithStatus.tsx`

### 5a — `InterviewSchedule.tsx`

- [ ] **Step 1: Add imports**

```tsx
import { useInterviewRounds } from '@/modules/lookup'
```

- [ ] **Step 2: Add hook inside `InterviewSchedule` function**

```tsx
const { data: interviewRounds = [] } = useInterviewRounds()
```

- [ ] **Step 3: Replace hardcoded `<Select.Option>` children**

Old:
```tsx
<Select placeholder="Select Interview Round" allowClear showSearch>
  <Select.Option value="first">First Interview</Select.Option>
  <Select.Option value="second">Second Interview</Select.Option>
  <Select.Option value="third">Third Interview</Select.Option>
</Select>
```

New:
```tsx
<Select
  placeholder="Select Interview Round"
  allowClear
  showSearch
  options={interviewRounds.map(r => ({ value: r.systemName, label: r.displayName }))}
/>
```

### 5b — `ListOfCandidatesWithStatus.tsx`

- [ ] **Step 4: Add imports**

```tsx
import { useInterviewRounds } from '@/modules/lookup'
import { getLookupLabel } from '@/shared/utils/lookup'
```

- [ ] **Step 5: Add hook at top of component**

```tsx
const { data: interviewRounds } = useInterviewRounds()
```

- [ ] **Step 6: Replace raw round display (line ~163)**

Old:
```tsx
<p className="capitalize">Round: {iv.InterviewRound} Interview</p>
```

New:
```tsx
<p>{getLookupLabel(interviewRounds, iv.InterviewRound)}</p>
```

- [ ] **Step 7: Verify TypeScript**

```bash
cd client && yarn tsc --noEmit 2>&1 | grep -v AssignmentTable
```

- [ ] **Step 8: Commit**

```bash
git add client/src/modules/interviews/components/InterviewSchedule.tsx \
        client/src/modules/dashboard/components/ListOfCandidatesWithStatus.tsx
git commit -m "refactor: migrate InterviewSchedule and dashboard to use lookup data"
```

---

## Task 6: Build the Settings admin UI

**Files:**
- Create: `client/src/modules/settings/types/settings.types.ts`
- Create: `client/src/modules/settings/components/LookupValuesManager.tsx`
- Create: `client/src/modules/settings/page.tsx`
- Create: `client/src/modules/settings/routes/settings.routes.tsx`
- Create: `client/src/modules/settings/index.ts`

- [ ] **Step 1: Create `settings/types/settings.types.ts`**

```ts
export interface LookupCategory {
  label: string
  endpoint: string
  queryKey: readonly string[]
}
```

- [ ] **Step 2: Create `settings/components/LookupValuesManager.tsx`**

```tsx
import { useState } from 'react'
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Table, Tag, message } from 'antd'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { LOOKUP_KEYS, useCreateLookupValue, useDeactivateLookupValue, useUpdateLookupValue } from '@/modules/lookup/lib/queries/lookup.queries'
import type { LookupValue } from '@/modules/lookup'
import { useQuery } from '@tanstack/react-query'
import { GET } from '@/shared/lib/axios'
import { LOOKUP_URL } from '@/shared/constants/api'

interface Props {
  label: string
  endpoint: string
  queryKey: readonly string[]
}

export function LookupValuesManager({ label, endpoint, queryKey }: Props) {
  const [addOpen, setAddOpen] = useState(false)
  const [editItem, setEditItem] = useState<LookupValue | null>(null)
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()

  const { data: values = [], isLoading } = useQuery({
    queryKey: [...queryKey],
    queryFn: () => GET<{ success: boolean; data: LookupValue[] }>(`/${LOOKUP_URL}/${endpoint}`),
    staleTime: Infinity,
    select: (res) => res.data,
  })

  const { mutateAsync: createValue, isPending: creating } = useCreateLookupValue(endpoint, queryKey)
  const { mutateAsync: updateValue, isPending: updating } = useUpdateLookupValue(endpoint, queryKey)
  const { mutateAsync: deactivate, isPending: deactivating } = useDeactivateLookupValue(endpoint, queryKey)

  const handleAdd = async () => {
    try {
      const values = await form.validateFields()
      await createValue(values)
      message.success('Added successfully')
      form.resetFields()
      setAddOpen(false)
    } catch {
      message.error('Failed to add')
    }
  }

  const handleEdit = async () => {
    if (!editItem) return
    try {
      const vals = await editForm.validateFields()
      await updateValue({ id: editItem._id, data: vals })
      message.success('Updated successfully')
      setEditItem(null)
    } catch {
      message.error('Failed to update')
    }
  }

  const columns = [
    { title: 'System Name', dataIndex: 'systemName', key: 'systemName', render: (v: string) => <code>{v}</code> },
    { title: 'Display Name', dataIndex: 'displayName', key: 'displayName' },
    { title: 'Order', dataIndex: 'order', key: 'order', width: 80 },
    { title: 'Color', dataIndex: 'color', key: 'color', render: (v: string) => v ? <Tag color={v}>{v}</Tag> : '—' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: LookupValue) => (
        <div className="flex gap-2">
          <Button
            size="small"
            onClick={() => {
              setEditItem(record)
              editForm.setFieldsValue({ displayName: record.displayName, order: record.order, color: record.color })
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Deactivate this value?"
            description="It will be hidden from dropdowns but old records remain valid."
            onConfirm={() => deactivate(record._id)}
          >
            <Button size="small" danger loading={deactivating}>Deactivate</Button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button type="primary" icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
          Add {label}
        </Button>
      </div>

      <Table
        dataSource={values}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        size="small"
        pagination={false}
      />

      <Modal title={`Add ${label}`} open={addOpen} onOk={handleAdd} onCancel={() => setAddOpen(false)} confirmLoading={creating}>
        <Form form={form} layout="vertical">
          <Form.Item name="systemName" label="System Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. fourth" />
          </Form.Item>
          <Form.Item name="displayName" label="Display Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Fourth Interview" />
          </Form.Item>
          <Form.Item name="order" label="Order" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="color" label="Color (Ant Design token)">
            <Input placeholder="e.g. blue, purple, green, gold" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title={`Edit ${label}`} open={!!editItem} onOk={handleEdit} onCancel={() => setEditItem(null)} confirmLoading={updating}>
        <Form form={editForm} layout="vertical">
          <Form.Item name="displayName" label="Display Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="order" label="Order" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="color" label="Color (Ant Design token)">
            <Input placeholder="e.g. blue, purple, green, gold" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
```

- [ ] **Step 3: Create `settings/page.tsx`**

```tsx
import { Tabs } from 'antd'
import { PageHeader } from '@/shared/components/PageHeader'
import { LookupValuesManager } from './components/LookupValuesManager'
import { LOOKUP_KEYS } from '@/modules/lookup/lib/queries/lookup.queries'

export function LookupValuesPage() {
  const categories = [
    { key: 'rounds',   label: 'Interview Rounds',    endpoint: 'interview-rounds',    queryKey: LOOKUP_KEYS.interviewRounds },
    { key: 'statuses', label: 'Candidate Statuses',  endpoint: 'candidate-statuses',  queryKey: LOOKUP_KEYS.candidateStatuses },
    { key: 'types',    label: 'Interview Types',     endpoint: 'interview-types',     queryKey: LOOKUP_KEYS.interviewTypes },
    { key: 'istatus',  label: 'Interview Statuses',  endpoint: 'interview-statuses',  queryKey: LOOKUP_KEYS.interviewStatuses },
  ]

  return (
    <div>
      <PageHeader title="Lookup Values" backPath="/dashboard" />
      <Tabs
        items={categories.map(c => ({
          key: c.key,
          label: c.label,
          children: (
            <LookupValuesManager
              label={c.label}
              endpoint={c.endpoint}
              queryKey={c.queryKey}
            />
          ),
        }))}
      />
    </div>
  )
}
```

- [ ] **Step 4: Create `settings/routes/settings.routes.tsx`**

```tsx
import { lazy } from 'react'
import type { RouteObject } from 'react-router'

const LazyLookupValues = lazy(() =>
  import('../page').then(m => ({ default: m.LookupValuesPage }))
)

export const settingsRoutes: RouteObject[] = [
  { path: 'settings/lookup-values', element: <LazyLookupValues /> },
]
```

- [ ] **Step 5: Create `settings/index.ts`**

```ts
export { settingsRoutes } from './routes/settings.routes'
```

- [ ] **Step 6: Verify TypeScript**

```bash
cd client && yarn tsc --noEmit 2>&1 | grep -v AssignmentTable
```

- [ ] **Step 7: Commit**

```bash
git add client/src/modules/settings/
git commit -m "feat: add Lookup Values admin UI in settings module"
```

---

## Task 7: Wire settings into routing and sidebar

**Files:**
- Modify: `client/src/shared/routes/index.tsx`
- Modify: `client/src/shared/components/DashboardSidebar.tsx`

- [ ] **Step 1: Add settings routes to `index.tsx`**

Add import:
```tsx
import { settingsRoutes } from '@/modules/settings'
```

Add `...settingsRoutes` inside the Admin-only `ProtectedRoute` children (settings should be admin-only):

Old:
```tsx
{
  element: <ProtectedRoute allowedRoles={['Admin']} />,
  children: [...userManagementRoutes],
},
```

New:
```tsx
{
  element: <ProtectedRoute allowedRoles={['Admin']} />,
  children: [...userManagementRoutes, ...settingsRoutes],
},
```

- [ ] **Step 2: Add Settings link to sidebar in `DashboardSidebar.tsx`**

Add import at top:
```tsx
import { Settings } from 'lucide-react'
```

Inside the admin-only block (where `user?.role === 'Admin'` check is):
```tsx
{
  key: '/dashboard/settings/lookup-values',
  icon: <Settings size={20} />,
  label: <Link to="/dashboard/settings/lookup-values">Settings</Link>,
},
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd client && yarn tsc --noEmit 2>&1 | grep -v AssignmentTable
```

Expected: `Done` with no errors.

- [ ] **Step 4: Commit**

```bash
git add client/src/shared/routes/index.tsx \
        client/src/shared/components/DashboardSidebar.tsx
git commit -m "feat: wire settings routes and sidebar link for lookup values admin"
```

---

## Final Verification

- [ ] Start dev server: `cd client && yarn dev`
- [ ] Navigate to `/dashboard/interviews/schedule` — confirm Interview Round dropdown loads from API (not hardcoded)
- [ ] Navigate to `/dashboard/candidates` — confirm status tags show `"First Interview"` not `"first"`
- [ ] Open a candidate detail — confirm `CandidateProgress` pipeline steps show proper labels
- [ ] Open Candidate History tab — confirm round tags show `"First Interview"` not `"first"`
- [ ] Open Interviews list view — confirm round tags show proper labels
- [ ] As Admin, navigate to `/dashboard/settings/lookup-values` — confirm all 4 tabs load with seeded values
- [ ] Add a new interview round `{ systemName: "fourth", displayName: "Final Round", order: 4, color: "gold" }` — confirm it immediately appears in the InterviewSchedule dropdown
- [ ] Deactivate the new round — confirm it disappears from the dropdown but existing interviews with that round still display correctly
