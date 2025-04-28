import React, { useState } from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../Hooks/hook';
import { theme as antTheme, Avatar, Dropdown, Button, Layout, Space, Badge } from 'antd';
import type { MenuProps } from 'antd';
import { logout } from '../../slices/authSlices';
import ThemeToggle from '../common/ThemeToggle';
import { toggleSideBarCollapsed } from '../../slices/sideBarCollapsed';
import GlobalSearch from '../common/GlobalSearch';

const { Header } = Layout;

interface HeaderProps {
  openMobileMenu: () => void;
}

export const HeaderComponent: React.FC<HeaderProps> = ({ openMobileMenu }) => {
  const [showSearch, setShowSearch] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { collapse: isSidebarCollapsed } = useAppSelector((state) => state.sideBar);
  const isDarkMode = useAppSelector(state => state.theme.mode === 'dark');
  const { token } = antTheme.useToken();

  const items: MenuProps['items'] = [
    { label: 'Sign out', key: 'logout' },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      dispatch(logout());
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
      {/* Left Section */}
      <Space align="center">
        {/* Sidebar Toggle (Desktop) */}
        <div className="hidden md:block">
          <Button
            type="text"
            icon={isSidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={handleSideBarCollapse}
            style={{ fontSize: '18px', width: 48, height: 48 }}
          />
        </div>

        {/* Mobile Menu Button */}
        <div className="block md:hidden">
          <Button
            type="text"
            icon={<Menu size={22} />}
            onClick={openMobileMenu}
            style={{ width: 48, height: 48 }}
          />
        </div>
      </Space>

      {/* Right Section */}
      <Space align="center" size="middle">
        {/* Search Button */}
        <Button
          type="text"
          icon={<Search size={20} />}
          onClick={() => setShowSearch(true)}
          style={{ width: 40, height: 40 }}
        />

        {/* Notification Bell */}
        <Badge dot>
          <Button
            type="text"
            icon={<Bell size={20} />}
            style={{ width: 40, height: 40 }}
          />
        </Badge>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Profile */}
        <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={['click']} placement="bottomRight">
          <Space align="center" className="cursor-pointer">
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
