import { Outlet, Navigate } from 'react-router-dom';

import Navbar from './Nabbar';
import Sidebar from './SideBar';
import { useAppSelector } from '../../Hooks/hook';

export default function Layout() {
    const { token: isAuthenticated } = useAppSelector((state => state.auth.user));

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}