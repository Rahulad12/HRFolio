import { useState } from 'react';
import { Layout as AntLayout } from 'antd';
import Sidebar from './Sidebar';
import Navbar from './Nabbar';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const { Content } = AntLayout;

const Layout = () => {
    const { darkMode } = useTheme();
    const [collapsed, setCollapsed] = useState(false);
    const LayoutBg = darkMode ? '#020817' : '#FFFFFF';
    return (
        <AntLayout className='h-dvh transition-colors duration-300'>
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                isDarkMode={darkMode}
            />

            <AntLayout
                className={`transition-all duration-300 ${collapsed ? 'ml-[80px]' : 'ml-[260px]'
                    }`}
            >
                <Navbar collapsed={collapsed} isDarkMode={darkMode} />
                <Content
                    className="px-2 mt-16 min-h-screen overflow-y-auto transition-all duration-300" style={{
                        backgroundColor: LayoutBg
                    }}>

                    <Outlet />
                </Content>
            </AntLayout>
        </AntLayout>
    );
};

export default Layout;
