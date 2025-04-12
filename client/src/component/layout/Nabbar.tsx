import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { logout } from '../../slices/authSlices';
import type { RootState } from '../../store.ts';
import { useAppDispatch, useAppSelector } from '../../Hooks/hook.ts';
const Navbar: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex items-center">
                            <User className="h-8 w-8 text-indigo-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">CV Manager</span>
                        </Link>
                    </div>

                    <div className="flex items-center">
                        <div className="flex items-center">
                            <span className="text-gray-700 mr-4">{user?.name}</span>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-600 hover:to-blue-300 focus:outline-none transition cursor-pointer"
                            >
                                <LogOut className="h-5 w-5 mr-1 text-red-600" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
export default Navbar;