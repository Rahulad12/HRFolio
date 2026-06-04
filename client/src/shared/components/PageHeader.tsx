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
