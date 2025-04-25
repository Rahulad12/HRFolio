import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar, ClipboardCheck, UserPlus, FileText, BarChart2 } from 'lucide-react';
import Logo from '../ui/Logo';
import { Menu } from 'antd';


export const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { key: 'dashboard', icon: <BarChart2 size={20} />, label: <Link to="/dashboard">Dashboard</Link> },
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
    // { key: '/dashboard/jobs', icon: <Briefcase size={20} />, label: <Link to="/dashboard/jobs">Jobs</Link> },
    {
      key: 'offers',
      icon: <FileText size={20} />,
      label: 'Offers',
      children: [
        {
          key: '/dashboard/email-templates',
          label: <Link to="dashboard/email-templates">Manage Templates</Link>,
        },
        {
          key: '/dashboard/offers',
          label: <Link to="/dashboard/offers">New Offer</Link>,
        },
      ],
    },
    // { key: '/dashboard/reports', icon: <Award size={20} />, label: <Link to="/dashboard/reports">Reports</Link> },
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
          defaultOpenKeys={['dashboard']}
          items={links}
        />

      </div>


    </div>
  );
};

export default Sidebar;