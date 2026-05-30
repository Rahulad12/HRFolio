import { useState } from 'react'
import { Avatar, Button, Dropdown, Layout, Space, Modal, notification } from 'antd'
import type { MenuProps } from 'antd'
import { Menu, Search, MenuFoldOutlined, MenuUnfoldOutlined } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/shared/hooks/useAuth'
import { useThemeStore } from '@/shared/store/theme.store'
import { useSidebarStore } from '@/shared/store/sidebar.store'

const { Header } = Layout

export function DashboardHeader() {
  const navigate = useNavigate()
  const [api, contextHolder] = notification.useNotification()
  const { user, logout } = useAuth()
  const mode = useThemeStore((s) => s.mode)
  const setThemeMode = useThemeStore((s) => s.setThemeMode)
  const collapsed = useSidebarStore((s) => s.collapsed)
  const toggle = useSidebarStore((s) => s.toggle)
  const [showSearch, setShowSearch] = useState(false)

  const items: MenuProps['items'] = [
    { label: 'Sign out', key: 'logout', danger: true },
  ]

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      logout()
      setThemeMode('light')
      navigate('/login')
    }
  }

  return (
    <Header
      style={{
        padding: '0 16px',
        background: mode === 'dark' ? '#141414' : '#fff',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}
    >
      {contextHolder}
      <Space align="center">
        <div className="hidden md:block">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined size={18} /> : <MenuFoldOutlined size={18} />}
            onClick={toggle}
            style={{ fontSize: '18px', width: 48, height: 48 }}
          />
        </div>
      </Space>

      <Space align="center" size="middle">
        <Button
          type="text"
          icon={<Search size={20} />}
          onClick={() => setShowSearch(true)}
          style={{ width: 40, height: 40 }}
        />

        <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={['click']} placement="bottomRight">
          <Space className="cursor-pointer">
            <Avatar src={user?.picture || ''} size="large" />
            <span className="hidden md:inline-block text-sm font-medium">
              {user?.username || 'User'}
            </span>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  )
}
