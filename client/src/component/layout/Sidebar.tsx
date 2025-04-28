import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, UserPlus, FileText, UserRound, LayoutDashboard, CalendarClock } from 'lucide-react';
import Logo from '../common/Logo';
import { Menu, Layout } from 'antd';
import { useAppDispatch, useAppSelector } from '../../Hooks/hook';
import { toggleSideBarCollapsed } from '../../slices/sideBarCollapsed';

const { Sider } = Layout;

interface SidebarProps {
  isMobile: boolean;

}

export const Sidebar: React.FC<SidebarProps> = ({ isMobile = false }) => {
  const location = useLocation();
  const diapatch = useAppDispatch();
  const { collapse } = useAppSelector(state => state.sideBar);
  const currentPath = location.pathname;

  const links = [
    {
      key: '/dashboard',
      icon: <LayoutDashboard size={18} />,
      label: <Link to="/dashboard">Dashboard</Link>
    },
    {
      key: '/dashboard/candidates',
      icon: <Users size={18} />,
      label: <Link to="/dashboard/candidates">Candidates</Link>
    },
    {
      key: '/dashboard/interviews',
      icon: <CalendarClock size={18} />,
      label: <Link to="/dashboard/interviews">Interviews</Link>
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
      key: '/dashboard/interviewers',
      icon: <UserPlus size={20} />,
      label: <Link to="/dashboard/interviewers">Interviewers</Link>
    },
    {
      key: 'offers',
      icon: <FileText size={20} />,
      label: 'Offers',
      children: [
        {
          key: '/dashboard/email-templates',
          label: <Link to="/dashboard/email-templates">Manage Templates</Link>,
        },
        {
          key: '/dashboard/offers',
          label: <Link to="/dashboard/offers">Offer</Link>,
        },
      ],
    },
  ];

  return (
    <Sider
      breakpoint='lg'
      width={250}
      collapsible
      collapsed={collapse}
      onCollapse={() => diapatch(toggleSideBarCollapsed())}
      className={`${isMobile ? 'w-full' : 'w-55 hidden md:block'} bg-white h-screen shadow-sm overflow-y-auto site-layout-background`}
    >
      <div className="flex items-center justify-center h-16 p-4" >
        {!collapse && (
          <Logo />

        )}
        {collapse && <UserRound size={24} color="white" />}
      </div>
      <Menu
        theme='dark'
        mode="inline"
        selectedKeys={[currentPath]}
        items={links}
      />
    </Sider>
  );
};

export default Sidebar;
