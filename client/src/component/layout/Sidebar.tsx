import React, { Children } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar, ClipboardCheck, UserPlus, Briefcase, FileText, Award, BarChart2 } from 'lucide-react';
import Logo from '../ui/Logo';
import { Menu } from 'antd';
interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={`
        flex items-center px-4 py-3 text-sm font-medium rounded-md group transition-all
        text-gray-600
        ${isActive
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }
      `}
    >
      <span className="mr-3 h-5 w-5">{icon}</span>
      {label}
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;


  const links = [
    { key: '/dashboard', icon: <BarChart2 size={20} />, label: <Link to="/dashboard">Dashboard</Link> },
    { key: '/dashboard/candidates', icon: <Users size={20} />, label: <Link to="/dashboard/candidates">Candidates</Link> },
    { key: '/dashboard/interviews', icon: <Calendar size={20} />, label: <Link to="/dashboard/interviews">Interviews</Link> },
    {
      key: 'assessments',
      icon: <ClipboardCheck size={20} />,
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
    { key: '/dashboard/interviewers', icon: <UserPlus size={20} />, label: <Link to="/dashboard/interviewers">Interviewers</Link> },
    { key: '/dashboard/jobs', icon: <Briefcase size={20} />, label: <Link to="/dashboard/jobs">Jobs</Link> },
    { key: '/dashboard/offers', icon: <FileText size={20} />, label: <Link to="/dashboard/offers">Offers</Link> },
    { key: '/dashboard/reports', icon: <Award size={20} />, label: <Link to="/dashboard/reports">Reports</Link> },
  ];

  return (
    <div className="w-55 hidden md:block bg-white h-screen shadow-sm overflow-y-auto">
      <div className="px-6 py-6">
        <Logo />
        <p className="text-sm text-gray-500 mt-1">Recruitment Manager</p>
      </div>
      <div className="mt-2 space-y-1">
        <Menu
          mode="inline"
          selectedKeys={[currentPath]}
          defaultOpenKeys={['assessments']}
          items={links}
        />

      </div>
    </div>
  );
};

export default Sidebar;