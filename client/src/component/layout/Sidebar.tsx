import React from 'react';
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
    { to: '/dashboard', icon: <BarChart2 size={20} />, label: 'Dashboard' },
    { to: '/dashboard/candidates', icon: <Users size={20} />, label: 'Candidates' },
    { to: '/dashboard/interviews', icon: <Calendar size={20} />, label: 'Interviews' },
    { to: '/dashboard/assessments', icon: <ClipboardCheck size={20} />, label: 'Assessments' },
    { to: '/dashboard/interviewers', icon: <UserPlus size={20} />, label: 'Interviewers' },
    { to: '/dashboard/jobs', icon: <Briefcase size={20} />, label: 'Jobs' },
    { to: '/dashboard/offers', icon: <FileText size={20} />, label: 'Offers' },
    { to: '/dashboard/reports', icon: <Award size={20} />, label: 'Reports' },
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
          items={links.map(link => ({
            key: link.to,
            icon: link.icon,
            label: <Link to={link.to}>{link.label}</Link>,
          }))}
        />

      </div>
    </div>
  );
};

export default Sidebar;