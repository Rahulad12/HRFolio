import React, { useState } from 'react';
import { Menu, Search } from 'lucide-react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  Space,
  notification,
  theme as antTheme,
  Modal,
} from 'antd';
import type { MenuProps } from 'antd';
import { useAppDispatch, useAppSelector } from '../../Hooks/hook';
import { logout } from '../../slices/authSlices';
import { toggleSideBarCollapsed } from '../../slices/sideBarCollapsed';
import GlobalSearch from '../common/GlobalSearch';
import ThemeToggle from '../common/ThemeToggle';
import { useDeleteUserMutation } from '../../services/authServiceApi';
import { useNavigate } from 'react-router-dom';
import { setThemeMode } from '../../slices/themeSlices';

const { Header } = Layout;

interface HeaderProps {
  openMobileMenu: () => void;
}

const HeaderComponent: React.FC<HeaderProps> = ({ openMobileMenu }) => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { collapse: isSidebarCollapsed } = useAppSelector((state) => state.sideBar);
  const isDarkMode = useAppSelector((state) => state.theme.mode === 'dark');
  const { token } = antTheme.useToken();

  const Id = localStorage.getItem('Id') || '';
  const [api, contextHolder] = notification.useNotification();
  const [deleteUser] = useDeleteUserMutation();

  const items: MenuProps['items'] = [
    { label: 'Sign out', key: 'logout', danger: true },
    { label: 'Delete Account', key: 'delete', danger: true },
  ];

  const handleDelete = async () => {
    try {
      const response = await deleteUser(Id).unwrap();
      if (response?.success) {
        localStorage.clear();
        api.success({
          message: response?.message,
          description: 'Account Deactivated Successfully. Contact Admin to Reactivate.',
          duration: 5,
        });
        navigate('/');
      }
    } catch (error: any) {
      api.error({
        message: error?.data?.message || 'Failed to delete user',
        description: error?.data?.message,
        duration: 5,
      });
    }
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      dispatch(logout());
      dispatch(setThemeMode("light"));
    } else if (e.key === 'delete') {
      Modal.confirm({
        title: 'Delete Account',
        content: 'Are you sure you want to delete your account?,If you delete, you will be banned from the platform and if you want to reactivate your account contact admin.',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: () => {
          handleDelete();
        },
      })
    }
  };

  const handleSideBarCollapse = () => {
    dispatch(toggleSideBarCollapsed());
  };

  return (
    <Header
      style={{
        padding: '0 16px',
        background: isDarkMode ? token.colorBgContainer : '#fff',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}
    >
      {contextHolder}
      <Space align="center">
        {/* Desktop Sidebar Toggle */}
        <div className="hidden md:block">
          <Button
            type="text"
            icon={isSidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={handleSideBarCollapse}
            style={{ fontSize: '18px', width: 48, height: 48 }}
          />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="block md:hidden">
          <Button
            type="text"
            icon={<Menu size={22} />}
            onClick={openMobileMenu}
            style={{ width: 48, height: 48 }}
          />
        </div>
      </Space>

      <Space align="center" size="middle">
        {/* Search */}
        <Button
          type="text"
          icon={<Search size={20} />}
          onClick={() => setShowSearch(true)}
          style={{ width: 40, height: 40 }}
        />
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Dropdown */}
        <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={['click']} placement="bottomRight">
          <Space className="cursor-pointer">
            <Avatar src={user?.picture || ''} size="large" />
            <span className="hidden md:inline-block text-sm font-medium">
              {user?.username || 'User'}
            </span>
          </Space>
        </Dropdown>
      </Space>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </Header>
  );
};

export default HeaderComponent;
