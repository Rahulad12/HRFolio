import { Card, DatePicker, Input, Skeleton } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useState, useCallback } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { CandidateData, InterviewData, OfferData, AssignmentData } from '../types/dashboard.types'

dayjs.extend(isBetween)

interface Props {
  candidates: CandidateData[]
  interviews: InterviewData[]
  offers: OfferData[]
  assessments: AssignmentData[]
  loading?: boolean
}

interface KanbanColumn {
  title: string
  key: string
  statusKeys: string[]
  headerColor: string
  badgeBg: string
  badgeText: string
  tagBg: string
  tagText: string
  dimmed?: boolean
}

const COLUMNS: KanbanColumn[] = [
  { title: 'Shortlisted',   key: 'shortlisted', statusKeys: ['shortlisted'], headerColor: 'text-indigo-600 dark:text-indigo-400',  badgeBg: 'bg-indigo-100 dark:bg-indigo-900',    badgeText: 'text-indigo-700 dark:text-indigo-300',  tagBg: 'bg-indigo-100 dark:bg-indigo-900',    tagText: 'text-indigo-700 dark:text-indigo-300' },
  { title: 'Assessment',    key: 'assessment',  statusKeys: ['assessment'],  headerColor: 'text-amber-600 dark:text-amber-400',    badgeBg: 'bg-amber-100 dark:bg-amber-900/60',   badgeText: 'text-amber-700 dark:text-amber-300',    tagBg: 'bg-amber-100 dark:bg-amber-900/60',   tagText: 'text-amber-700 dark:text-amber-300' },
  { title: '1st Interview', key: 'first',       statusKeys: ['first'],       headerColor: 'text-blue-600 dark:text-blue-400',      badgeBg: 'bg-blue-100 dark:bg-blue-900/60',     badgeText: 'text-blue-700 dark:text-blue-300',      tagBg: 'bg-blue-100 dark:bg-blue-900/60',     tagText: 'text-blue-700 dark:text-blue-300' },
  { title: '2nd Interview', key: 'second',      statusKeys: ['second'],      headerColor: 'text-sky-600 dark:text-sky-400',        badgeBg: 'bg-sky-100 dark:bg-sky-900/60',       badgeText: 'text-sky-700 dark:text-sky-300',        tagBg: 'bg-sky-100 dark:bg-sky-900/60',       tagText: 'text-sky-700 dark:text-sky-300' },
  { title: '3rd Interview', key: 'third',       statusKeys: ['third'],       headerColor: 'text-cyan-600 dark:text-cyan-400',      badgeBg: 'bg-cyan-100 dark:bg-cyan-900/60',     badgeText: 'text-cyan-700 dark:text-cyan-300',      tagBg: 'bg-cyan-100 dark:bg-cyan-900/60',     tagText: 'text-cyan-700 dark:text-cyan-300' },
  { title: 'Offered',       key: 'offered',     statusKeys: ['offered'],     headerColor: 'text-orange-600 dark:text-orange-400',  badgeBg: 'bg-orange-100 dark:bg-orange-900/60', badgeText: 'text-orange-700 dark:text-orange-300',  tagBg: 'bg-orange-100 dark:bg-orange-900/60', tagText: 'text-orange-700 dark:text-orange-300' },
  { title: 'Hired',         key: 'hired',       statusKeys: ['hired'],       headerColor: 'text-emerald-600 dark:text-emerald-400',badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60',badgeText: 'text-emerald-700 dark:text-emerald-300',tagBg: 'bg-emerald-100 dark:bg-emerald-900/60',tagText: 'text-emerald-700 dark:text-emerald-300' },
  { title: 'Rejected',      key: 'rejected',    statusKeys: ['rejected'],    headerColor: 'text-red-600 dark:text-red-400',        badgeBg: 'bg-red-100 dark:bg-red-900/60',       badgeText: 'text-red-700 dark:text-red-300',        tagBg: 'bg-red-100 dark:bg-red-900/60',       tagText: 'text-red-700 dark:text-red-300', dimmed: true },
]

export function ListOfCandidatesWithStatus({ candidates, loading = true }: Props) {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null])

  const filterForColumn = useCallback(
    (col: KanbanColumn) =>
      candidates.filter((c) => {
        if (!col.statusKeys.includes(c.status)) return false
        if (dateRange[0] && dateRange[1]) {
          const created = dayjs(c.createdAt)
          if (!created.isBetween(dateRange[0].startOf('day'), dateRange[1].endOf('day'), null, '[]')) return false
        }
        if (
          searchText &&
          !(
            c.name.toLowerCase().includes(searchText.toLowerCase()) ||
            c.technology.toLowerCase().includes(searchText.toLowerCase())
          )
        )
          return false
        return true
      }),
    [candidates, dateRange, searchText],
  )

  return (
    <Card
      title="Hiring Pipeline"
      extra={
        <div className="flex gap-2">
          <Input
            placeholder="Search name or tech…"
            size="small"
            prefix={<Search size={14} />}
            style={{ width: 180 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <DatePicker.RangePicker
            size="small"
            onChange={(dates) =>
              setDateRange((dates as [Dayjs | null, Dayjs | null]) ?? [null, null])
            }
          />
        </div>
      }
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3" style={{ minWidth: `${COLUMNS.length * 180}px` }}>
            {COLUMNS.map((col) => {
              const items = filterForColumn(col)
              const visible = items.slice(0, 3)
              const overflow = items.length - visible.length
              return (
                <div
                  key={col.key}
                  className={`min-w-[160px] flex-1 rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-950 ${col.dimmed ? 'opacity-70' : ''}`}
                >
                  {/* Column header */}
                  <div className="mb-2 flex items-center justify-between">
                    <span className={`text-xs font-bold uppercase tracking-wide ${col.headerColor}`}>
                      {col.title}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${col.badgeBg} ${col.badgeText}`}>
                      {items.length}
                    </span>
                  </div>
                  {/* Candidate cards */}
                  <div className="flex flex-col gap-1.5">
                    {visible.map((c) => (
                      <div
                        key={c._id}
                        className="cursor-pointer rounded-md bg-white p-2 shadow-sm transition-colors hover:bg-slate-50 dark:bg-slate-800 dark:shadow-none dark:hover:bg-slate-700"
                        onClick={() => navigate(`/dashboard/candidates/${c._id}`)}
                      >
                        <p className="truncate text-xs font-semibold capitalize text-slate-800 dark:text-slate-100">
                          {c.name}
                        </p>
                        <div className="mt-1.5 flex gap-1">
                          <span className={`rounded px-1.5 py-0.5 text-xs font-medium capitalize ${col.tagBg} ${col.tagText}`}>
                            {c.technology}
                          </span>
                          <span className="rounded border border-slate-300 px-1.5 py-0.5 text-xs capitalize text-slate-500 dark:border-slate-600 dark:text-slate-400">
                            {c.level}
                          </span>
                        </div>
                      </div>
                    ))}
                    {overflow > 0 && (
                      <p className="text-center text-xs text-slate-500">+{overflow} more</p>
                    )}
                    {items.length === 0 && (
                      <p className="py-3 text-center text-xs text-slate-400 dark:text-slate-600">—</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </Card>
  )
}
