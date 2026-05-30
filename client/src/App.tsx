import { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ConfigProvider, App as AntApp, theme } from 'antd'
import { queryClient } from '@/shared/lib/query-client'
import { AuthProvider } from '@/modules/auth'
import { useThemeStore } from '@/shared/store/theme.store'
import { router } from './routes'

function AppContent() {
  const mode = useThemeStore((s) => s.mode)

  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [mode])

  const antTheme = {
    token: {
      colorPrimary: '#1A365D',
      colorSuccess: '#52C41A',
      colorWarning: '#FAAD14',
      colorError: '#FF4D4F',
      colorInfo: '#1A365D',
      borderRadius: 6,
      colorText: mode === 'dark' ? '#fff' : '#1A365D',
      colorIcon: '#1A365D',
      colorBgContainer: mode === 'dark' ? '#0D1117' : '#fff',
    },
    components: {
      Button: {
        colorPrimaryHover: '#FF7A22',
      },
    },
    algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
  }

  return (
    <ConfigProvider theme={antTheme}>
      <AntApp>
        <RouterProvider router={router} />
      </AntApp>
    </ConfigProvider>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
