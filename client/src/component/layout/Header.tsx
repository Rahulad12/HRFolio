import React, { useState } from 'react';
import { Bell, Search, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../Hooks/hook';
import { Avatar, Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import { logout } from '../../slices/authSlices';



export const Header: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const items: MenuProps['items'] = [
    {
      label: 'Sign out',
      key: 'logout',
    },

  ];
  const handleMenuClick = () => {
    dispatch(logout());
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end h-16">

          <div className="flex items-center">
            {showSearch ? (
              <div className="relative w-full max-w-xs md:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md 
                             leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none 
                             focus:placeholder-gray-300 focus:border-blue-500 
                             focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  placeholder="Search candidates, interviews..."
                  autoFocus
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Button
                    type="text"
                    onClick={() => setShowSearch(false)}
                    aria-label="Close search"
                  >
                    <X size={18} className="text-gray-400" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="text"
                onClick={() => setShowSearch(true)}
                aria-label="Search"
              >
                <Search size={20} />
              </Button>
            )}

            <Button
              type="text"
              className="ml-2 p-2 relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500"></span>
            </Button>

            <div className="ml-3 relative">
              <Dropdown
                menu={{ items, onClick: handleMenuClick }}
                trigger={['click']}
                placement="bottomRight"
              >
                <div className="flex items-center cursor-pointer">
                  <Button
                    type="text"
                    className="flex items-center p-1"
                    aria-label="User menu"
                  >
                    <div className="h-8 w-8 flex items-center justify-center">
                      <Avatar src={user?.picture || ''} alt="User Avatar" size={40} />
                    </div>
                    <span className="hidden md:flex ml-2 text-sm font-medium">
                      {user?.username || 'User'}
                    </span>
                  </Button>
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;