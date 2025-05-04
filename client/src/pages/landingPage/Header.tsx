import { useState, useEffect } from 'react';
import { Layout, Button, Drawer, Menu, Grid } from 'antd';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;
const { useBreakpoint } = Grid;

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const screens = useBreakpoint();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { label: 'Features', href: '#features' },
        { label: 'Screenshots', href: '#screenshots' },
        { label: 'Benefits', href: '#benefits' },
    ];
    const Logo = () => {
        return (
            <div className="cursor-pointer flex items-center justify-center" onClick={() => navigate('/')}>
                <span className={`${scrolled ? 'text-white' : 'text-blue-950sw'} text-3xl font-bold`}>H</span>
                <span className="text-orange-600 text-4xl font-extrabold">R</span>
                <span className={`${scrolled ? 'text-white' : 'text-blue-950sw'} font-semibold text-2xl`}>Folio</span>

            </div>
        )
    }

    return (
        <AntHeader
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}
            style={{
                background: scrolled ? '#001529' : 'transparent',
                padding: screens.md ? '0 50px' : '0 20px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <div className="flex justify-between items-center w-full">
                {/* Logo */}
                <Logo />

                {/* Desktop Nav */}
                {screens.md ? (
                    <div className="flex items-center gap-8">
                        {navItems.map(item => (
                            <a
                                key={item.label}
                                href={item.href}
                            >
                                <span className={`${scrolled ? 'text-white' : 'text-blue-950sw'} cursor-pointer font-medium text-[16px]`}>
                                    {item.label}

                                </span>
                            </a>
                        ))}
                        <Button type="primary" size="middle" onClick={() => navigate('/dashboard')}>Continue To Dashboard</Button>
                    </div>
                ) : (
                    <Button
                        type="text"
                        icon={<MenuOutlined className="text-white text-xl" />}
                        onClick={() => setDrawerVisible(true)}
                        style={{
                            color: scrolled ? '#fff' : '#001529',
                        }}
                    />
                )}
            </div>

            {/* Mobile Drawer */}
            <Drawer
                title={<Logo />}
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                closeIcon={<CloseOutlined />}
                width={300}
            >
                <Menu mode="vertical" selectable={false} className="pt-4">
                    {navItems.map(item => (
                        <Menu.Item key={item.label}>
                            <a href={item.href}>{item.label}</a>
                        </Menu.Item>
                    ))}
                </Menu>
                <div className="p-4">
                    <Button type="primary" block>
                        Continue To Dashboard
                    </Button>
                </div>
            </Drawer>
        </AntHeader>
    );
};

export default Header;
