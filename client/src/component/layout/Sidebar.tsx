import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, UserPlus, UserRound, LayoutDashboard, CalendarClock, InboxIcon, FileSignature } from 'lucide-react';
import Logo from '../common/Logo';
import { Menu, Layout } from 'antd';
import { useAppDispatch, useAppSelector } from '../../Hooks/hook';
import { toggleSideBarCollapsed } from '../../slices/sideBarCollapsed';

const { Sider } = Layout;

export const Sidebar = () => {
  const location = useLocation();
  const naviagte = useNavigate();
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
      label: <Link to="/dashboard/interviews">Interviews</Link>
    },

    {
      key: '/dashboard/interviewers',
      icon: <UserPlus size={20} />,
      label: <Link to="/dashboard/interviewers">Interviewers</Link>
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
  ];

  return (
    <Sider
      breakpoint='lg'
      width={220}
      collapsible
      collapsed={collapse}
      onCollapse={() => diapatch(toggleSideBarCollapsed())}
      theme='dark'
    >
      <div className="flex items-center justify-center h-16 p-4" >
        {!collapse && (
          <Logo />
        )}
        {collapse &&
          <div onClick={() => naviagte('/dashboard')} className='cursor-pointer'>
            <span className='text-white font-medium text-3xl'>H</span>
            <span className='text-orange-600 text-5xl font-bold'>R</span>
          </div>
        }
      </div>
      <Menu
        theme='dark'
        mode="inline"
        selectedKeys={[currentPath]}
        items={links}
        className='h-full'
        style={{
          marginTop: '1rem',
          borderRight: 'none'
        }}
      />
    </Sider>
  );
};

export default Sidebar;
