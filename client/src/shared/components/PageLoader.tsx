import { Spin } from 'antd'

export function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spin size="large" />
    </div>
  )
}
