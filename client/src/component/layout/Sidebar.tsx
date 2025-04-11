import { NavLink } from 'react-router-dom';
import {
    Users,
    FileText,
    Calendar,
    ClipboardCheck,
    Mail,
    Settings,
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: Users },
    { name: 'CV Collection', to: 'dashboard/cv-collection', icon: FileText },
    { name: 'Interviews', to: 'dashboard/interviews', icon: Calendar },
    { name: 'Assessments', to: 'dashboard/assessments', icon: ClipboardCheck },
    { name: 'Offers', to: 'dashboard/offers', icon: Mail },
    { name: 'Settings', to: 'dashboard/settings', icon: Settings },
];

const Sidebar = () => {
    return (
        <div className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)]">
            <nav className="mt-5 px-2">
                <div className="space-y-1">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.to}
                            className={({ isActive }: { isActive: boolean }) =>
                                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                }`
                            }
                        >
                            <item.icon
                                className="mr-3 h-5 w-5 flex-shrink-0"
                                aria-hidden="true"
                            />
                            {item.name}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </div>
    );
}
export default Sidebar;