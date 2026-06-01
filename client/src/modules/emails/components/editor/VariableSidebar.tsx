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
    v.name.toLowerCase().includes(search.toLowerCase()),
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
