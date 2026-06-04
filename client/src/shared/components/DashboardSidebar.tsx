import { Link, useLocation, useNavigate } from 'react-router'
import { Layout, Menu } from 'antd'
import { Users, UserPlus, UserRound, LayoutDashboard, CalendarClock, InboxIcon, FileSignature, ShieldCheck, ClipboardList, AlertCircle, Settings } from 'lucide-react'
import { useSidebarStore } from '@/shared/store/sidebar.store'
import { useAuth } from '@/shared/hooks/useAuth'

const { Sider } = Layout

export function DashboardSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const collapsed = useSidebarStore((s) => s.collapsed)
  const toggle = useSidebarStore((s) => s.toggle)
  const currentPath = location.pathname

  const links = [
    {
      key: '/dashboard',
      icon: <LayoutDashboard size={18} />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: '/dashboard/candidates',
      icon: <Users size={18} />,
      label: <Link to="/dashboard/candidates">Candidates</Link>,
    },
    {
      key: 'assessments',
      icon: <UserRound size={18} />,
      label: 'Assessments',
      children: [
        {
          key: '/dashboard/assessments',
          label: <Link to="/dashboard/assessments">Assessments</Link>,
        },
        {
          key: '/dashboard/assessments/assignments',
          label: <Link to="/dashboard/assessments/assignments">Manage Assessment</Link>,
        },
      ],
    },
    {
      key: '/dashboard/interviews',
      icon: <CalendarClock size={18} />,
      label: <Link to="/dashboard/interviews">Interviews</Link>,
    },
    {
      key: '/dashboard/interviewers',
      icon: <UserPlus size={20} />,
      label: <Link to="/dashboard/interviewers">Interviewers</Link>,
    },
    {
      key: '/dashboard/offers',
      icon: <FileSignature size={20} />,
      label: <Link to="/dashboard/offers">Offer</Link>,
    },
    {
      key: '/dashboard/email-templates',
      icon: <InboxIcon size={20} />,
      label: <Link to="/dashboard/email-templates">Email Templates</Link>,
    },
    {
      key: '/dashboard/escalations',
      icon: <AlertCircle size={20} />,
      label: <Link to="/dashboard/escalations">Escalations</Link>,
    },
    // Admin only
    ...(user?.role === 'Admin' ? [
      {
        key: '/dashboard/user-management',
        icon: <ShieldCheck size={20} />,
        label: <Link to="/dashboard/user-management">User Management</Link>,
      },
      {
        key: '/dashboard/settings/lookup-values',
        icon: <Settings size={20} />,
        label: <Link to="/dashboard/settings/lookup-values">Settings</Link>,
      },
    ] : []),
    // Admin + HR Admin
    ...(user?.role === 'Admin' || user?.role === 'HR Admin' ? [
      {
        key: '/dashboard/audit-logs',
        icon: <ClipboardList size={20} />,
        label: <Link to="/dashboard/audit-logs">Audit Logs</Link>,
      },
    ] : []),
  ]

  return (
    <Sider
      breakpoint="lg"
      width={220}
      collapsible
      collapsed={collapsed}
      onCollapse={toggle}
      theme="dark"
    >
      <div className="flex items-center justify-center h-16 p-4">
        {!collapsed ? (
          <Link to="/dashboard" className="flex items-center gap-1">
            <span className="text-white text-3xl font-bold">H</span>
            <span className="text-orange-600 text-5xl font-bold">R</span>
            <span className="text-white text-xl font-semibold">Folio</span>
          </Link>
        ) : (
          <div onClick={() => navigate('/dashboard')} className="cursor-pointer">
            <span className="text-white font-medium text-3xl">H</span>
            <span className="text-orange-600 text-5xl font-bold">R</span>
          </div>
        )}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[currentPath]}
        items={links}
        className="h-full"
        style={{ marginTop: '1rem', borderRight: 'none' }}
      />
    </Sider>
  )
}
