import { Header } from 'antd/es/layout/layout';
import { Avatar } from 'antd';
import { useAppSelector } from '../../Hooks/hook';
import ThemeToggle from '../common/ThemeToggle';

interface NavbarProps {
    collapsed: boolean;
    isDarkMode: boolean;

}
const Navbar = ({ collapsed, isDarkMode }: NavbarProps) => {

    const { user } = useAppSelector(state => state.auth);

    return (
        <Header
            className={`px-8 flex items-center justify-end fixed right-0 left-0 z-10 transition-all duration-300`}
            style={{
                left: collapsed ? 80 : 260,
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e5e7eb'}`,
            }}
        >
            <div className="flex items-center gap-6 justify-end">
                <ThemeToggle />
                <div className="flex items-center gap-3 cursor-pointer">
                    <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces" />
                    <div className="hidden md:block">
                        <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.username}</p>
                    </div>
                </div>

            </div>
        </Header>
    );
};

export default Navbar;
