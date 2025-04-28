import React, { useState } from 'react';
import { Menu, Bell, Search, X } from 'lucide-react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../Hooks/hook';
import { theme as antTheme, Avatar, Dropdown, Button, Layout, Input } from 'antd';
import type { MenuProps } from 'antd';
import { logout } from '../../slices/authSlices';
import ThemeToggle from '../common/ThemeToggle';
import { toggleSideBarCollapsed } from '../../slices/sideBarCollapsed';

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
    <Header style={{
      padding: '0 16px',
      background: isDarkMode ? token.colorBgContainer : '#fff',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      {/* Left Section */}
      <div className="flex items-center gap-2">
        {/* Desktop Sidebar Toggle */}
        <div className="hidden md:flex">
          <Button
            type="text"
            icon={isSidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={handleSideBarCollapse}
            style={{
              fontSize: '18px',
              width: 48,
              height: 48,
            }}
          />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <Button
            type="text"
            onClick={openMobileMenu}
            icon={<Menu size={22} />}
            style={{
              width: 48,
              height: 48,
            }}
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        {showSearch ? (
          <div className="relative w-56">
            <Input
              prefix={<Search size={18} className="text-gray-400" />}
              placeholder="Search candidates, interviews..."
              autoFocus
              suffix={
                <Button
                  type="text"
                  size="small"
                  onClick={() => setShowSearch(false)}
                  icon={<X size={18} className="text-gray-400" />}
                />
              }
            />
          </div>
        ) : (
          <Button
            type="text"
            onClick={() => setShowSearch(true)}
            icon={<Search size={20} />}
            style={{ width: 40, height: 40 }}
          />
        )}

        {/* Notification Bell */}
        <Button
          type="text"
          className="relative"
          icon={<Bell size={20} />}
          style={{ width: 40, height: 40 }}
        >
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={['click']} placement="bottomRight">
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar src={user?.picture || ''} alt="User Avatar" size="large" />
            <span className="hidden md:block font-medium text-sm">{user?.username || 'User'}</span>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderComponent;
