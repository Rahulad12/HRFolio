import React from 'react';
import { Drawer, Menu, Button } from 'antd';
import { CalendarClock, FileText, LayoutDashboard, UserPlus, UserRound, Users, X } from 'lucide-react';

import { Link } from 'react-router-dom';
import Logo from '../common/Logo';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
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
    <Drawer
      open={isOpen}
      placement="left"
      onClose={onClose}
      closable={false}
      width={280}
      maskClosable={true}
      style={{
        position: 'absolute',
        height: '100vh',
        backgroundColor: '#001529',

      }}
    >
      {/* Close Button */}
      <div className="flex justify-end mb-4">
        <Logo />
        <Button onClick={onClose} type="text">
          <X size={20} />
        </Button>
      </div>

      {/* Sidebar Links */}
      <div className="flex flex-col gap-2">
        <Menu mode="inline" items={links} theme="dark" />
      </div>
    </Drawer>
  );
};

export default MobileSidebar;
