import { Header } from 'antd/es/layout/layout';
import { Avatar } from 'antd';
import { useAppSelector } from '../../Hooks/hook';
import ThemeToggle from '../common/ThemeToggle';

interface NavbarProps {
    collapsed: boolean;
    isDarkMode: boolean;
}

const Navbar = ({ collapsed, isDarkMode }: NavbarProps) => {
    const { user } = useAppSelector((state) => state.auth);

    return (
        <Header
            className="fixed top-0 right-0 z-10 flex items-center justify-between px-6 transition-all duration-300"
            style={{
                left: collapsed ? 80 : 260,
                height: 64,
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e5e7eb'}`,
                paddingLeft: 24,
                paddingRight: 24,
            }}
        >
            {/* Optional logo or title here */}
            <div className="flex-1" />

            <div className="flex items-center gap-6">
                <ThemeToggle />
                <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar size="large" src={user?.picture} />
                    <div className="hidden md:block">
                        <p
                            className={`font-medium text-sm ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}
                        >
                            {user?.username}
                        </p>
                    </div>
                </div>
            </div>
        </Header>
    );
};

export default Navbar;
