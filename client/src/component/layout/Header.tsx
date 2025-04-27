import React, { useState } from 'react';
import { Menu, Bell, Search, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../Hooks/hook';
import { theme as antTheme, Avatar, Dropdown, Button, Layout, Input } from 'antd';
import type { MenuProps } from 'antd';
import { logout } from '../../slices/authSlices';
import ThemeToggle from '../common/ThemeToggle';
const { Header } = Layout;
interface HeaderProps {
  openMobileMenu: () => void;
}

export const HeaderComponent: React.FC<HeaderProps> = ({ openMobileMenu }) => {
  const [showSearch, setShowSearch] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const isDarkMode = useAppSelector(state => state.theme.mode === 'dark');
  const { token } = antTheme.useToken();
  const items: MenuProps['items'] = [
    { label: 'Sign out', key: 'logout' }
  ];

  const handleMenuClick = () => {
    dispatch(logout());
  };


  return (
    <Header style={{
      padding: '0 16px',
      background: isDarkMode ? token.colorBgContainer : '#fff',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
    }}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Button type="text" onClick={openMobileMenu} aria-label="Open menu">
              <Menu size={24} />
            </Button>
          </div>

          {/* Search and User Info */}
          <div className="flex items-center flex-1 justify-end">
            {showSearch ? (
              <div className="relative w-full max-w-xs md:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search candidates, interviews..."
                  autoFocus
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Button type="text" onClick={() => setShowSearch(false)} aria-label="Close search">
                    <X size={18} className="text-gray-400" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button type="text" onClick={() => setShowSearch(true)} aria-label="Search">
                <Search size={20} />
              </Button>
            )}

            <Button type="text" className="ml-2 p-2 relative" aria-label="Notifications">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500"></span>
            </Button>

            <ThemeToggle />
            <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={['click']} placement="bottomRight">
              <div className="ml-3 flex items-center cursor-pointer">
                <Button type="text" className="flex items-center p-1" aria-label="User menu">
                  <Avatar src={user?.picture || ''} alt="User Avatar" size={40} />
                  <span className="hidden md:flex ml-2 text-sm font-medium">
                    {user?.username || 'User'}
                  </span>
                </Button>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default HeaderComponent;
