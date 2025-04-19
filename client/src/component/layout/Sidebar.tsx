import { Menu, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  Users, FileText, Calendar,
  ClipboardCheck, Mail, Settings,
  ChevronLeft, ChevronRight, LogOut,
} from "lucide-react";
import { logout } from "../../slices/authSlices";
import { useAppDispatch } from "../../Hooks/hook";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  isDarkMode: boolean;
}

const Sidebar = ({ collapsed, setCollapsed, isDarkMode }: SidebarProps) => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const menuItems = [
    { label: <Link to="/dashboard">Dashboard</Link>, key: "/dashboard", icon: <Users size={18} /> },
    { label: <Link to="/dashboard/cv-collection">CV Collection</Link>, key: "/dashboard/cv-collection", icon: <FileText size={18} /> },
    { label: <Link to="/dashboard/interviews">Interviews</Link>, key: "/dashboard/interviews", icon: <Calendar size={18} /> },
    {
      label: "Assessments",
      key: "assessments",
      icon: <ClipboardCheck size={18} />,
      children: [
        {
          label: <Link to="/dashboard/assessments">Assessment List</Link>,
          key: "/dashboard/assessments",
        },
        {
          label: <Link to="/dashboard/assigned">Assigned Assessments</Link>,
          key: "/dashboard/assigned",
        },
      ],
    },
    { label: <Link to="/dashboard/offers">Offers</Link>, key: "/dashboard/offers", icon: <Mail size={18} /> },
    { label: <Link to="/dashboard/settings">Settings</Link>, key: "/dashboard/settings", icon: <Settings size={18} /> },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  const sidebarBg = isDarkMode ? "#1e293b" : "#FBFBFF";
  const borderColor = isDarkMode ? "#2A2E45" : "#e5e7eb";
  const logoTextColor = isDarkMode ? "#FBFBFF" : "#191D32";
  const toggleIconColor = isDarkMode ? "#FBFBFF" : "#4B5563";

  return (
    <div
      className="fixed top-0 left-0 bottom-0 flex flex-col justify-between transition-all duration-300"
      style={{
        width: collapsed ? 78 : 260,
        backgroundColor: sidebarBg,
        borderRight: `1px solid ${borderColor}`,
      }}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b" style={{ borderColor }}>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-fuchsia-950">
            <span className="text-lg font-semibold text-white">HF</span>
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold ml-3" style={{ color: logoTextColor }}>
              HRFolio
            </span>
          )}
        </div>
        <Button
          type="text"
          icon={
            collapsed
              ? <ChevronRight className="w-5 h-5" style={{ color: toggleIconColor }} />
              : <ChevronLeft className="w-5 h-5" style={{ color: toggleIconColor }} />
          }
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Menu */}
      <div className="flex-1">
        <Menu
          mode="inline"
          theme={isDarkMode ? "dark" : "light"}
          selectedKeys={[location.pathname]}
          inlineCollapsed={collapsed}
          items={menuItems}
          style={{
            backgroundColor: "transparent",
            borderRight: "none",
            paddingTop: 10,
          }}
        />
      </div>

      {/* Logout */}
      <div className="p-4 border-t" style={{ borderColor }}>
        <Button
          type="primary"
          danger
          icon={<LogOut className="w-5 h-5" />}
          onClick={handleLogout}
          block
        >
          {!collapsed && "Logout"}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
