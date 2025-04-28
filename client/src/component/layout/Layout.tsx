import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import HeaderComponent from './Header';
import { Layout as AntLayout, theme as antTheme } from 'antd';
import MobileSidebar from './MobileSidebar';
import { useAppSelector } from '../../Hooks/hook';
const { Content } = AntLayout
export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDarkMode = useAppSelector(state => state.theme.mode === 'dark');
  const { token } = antTheme.useToken();
  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <AntLayout className={`${isDarkMode ? 'dark' : ''} flex h-screen overflow-hidden`}>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderComponent openMobileMenu={openMobileMenu} />
        <Content style={{
          padding: 24,
          minHeight: 280,
          background: isDarkMode ? token.colorBgContainer : '#fff',
          borderRadius: token.borderRadius,
          overflowY: 'auto',
        }}>
          <Outlet />
        </Content>
      </div>
    </AntLayout>
  );
};

export default Layout;
