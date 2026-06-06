import { Tabs } from 'antd'
import { PageHeader } from '@/shared/components/PageHeader'
import { LookupValuesManager } from './components/LookupValuesManager'
import { LOOKUP_KEYS } from '@/modules/lookup'

export function LookupValuesPage() {
  const categories = [
    { key: 'rounds',   label: 'Interview Rounds',   endpoint: 'interview-rounds',   queryKey: LOOKUP_KEYS.interviewRounds },
    { key: 'statuses', label: 'Candidate Statuses', endpoint: 'candidate-statuses', queryKey: LOOKUP_KEYS.candidateStatuses },
    { key: 'types',    label: 'Interview Types',    endpoint: 'interview-types',    queryKey: LOOKUP_KEYS.interviewTypes },
    { key: 'istatus',  label: 'Interview Statuses', endpoint: 'interview-statuses', queryKey: LOOKUP_KEYS.interviewStatuses },
  ] as const

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
