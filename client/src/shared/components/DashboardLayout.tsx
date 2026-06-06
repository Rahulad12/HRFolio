import { Suspense } from 'react'
import { Outlet } from 'react-router'
import { Layout as AntLayout, theme as antTheme, Spin } from 'antd'
import { useThemeStore } from '@/shared/store/theme.store'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardHeader } from './DashboardHeader'

const { Content } = AntLayout

export function DashboardLayout() {
  const mode = useThemeStore((s) => s.mode)
  const { token } = antTheme.useToken()

  return (
    <AntLayout className={`${mode === 'dark' ? 'dark' : ''} flex h-screen overflow-hidden`}>
      <div className="hidden md:flex md:flex-shrink-0">
        <DashboardSidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <Content
          className="scrollable-content"
          style={{
            padding: 24,
            minHeight: 280,
            background: mode === 'dark' ? token.colorBgContainer : '#fff',
            borderRadius: token.borderRadius,
            overflowY: 'auto',
            scrollbarColor: mode === 'dark' ? '#D3D3D3 #0D1117' : '#0D1117 #D3D3D3',
            scrollbarWidth: 'thin',
          }}
        >
          <Suspense fallback={<Spin className="flex justify-center items-center h-full" size="large" />}>
            <Outlet />
          </Suspense>
        </Content>
      </div>
    </AntLayout>
  )
}
