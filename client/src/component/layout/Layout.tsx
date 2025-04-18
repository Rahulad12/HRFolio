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



    return (
        <AntLayout className='h-dvh'>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} isDarkMode={darkMode} />
            <AntLayout className={`transition-all duration-300 ${collapsed ? 'ml-[80px]' : 'ml-[260px]'}`}>
                <Navbar collapsed={collapsed} isDarkMode={darkMode} />
                <Content
                    className={`px-2 mt-16 min-h-screen overflow-y-auto transition-all duration-300 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}
                >
                    <Outlet />
                </Content>
            </AntLayout>
        </AntLayout>
    );
};

export default Layout;
