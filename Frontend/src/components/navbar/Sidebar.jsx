import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Dumbbell,
  Users,
  Settings,
  LogOut,
  Bell,
  Menu
} from "lucide-react";

const Sidebar = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation(); // Get current path for active link

   // Sidebar links data
   const links = [
    { to: "/admin", label: "Dashboard", icon: Home },
    { to: "/admin/Excercise", label: "Excercise", icon: Dumbbell },
    { to: "/admin/Workout", label: "Workout", icon: Dumbbell },
    { to: "/admin/users", label: "Users", icon: Users },
    // { to: "", label: "Analytics", icon: BarChart2 },
    { to: "", label: "Notification", icon: Bell },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ];

  // Toggle Sidebar
  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    onToggle(!isCollapsed); // Notify parent component
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full transition-all duration-300 border-r border-gray-700 ${
        isCollapsed ? "w-16" : "w-60"
      } bg-[#0b1129] p-3 flex flex-col`}
    >
      {/* Toggle Button */}
      <button
        className="text-white mt-3 pl-4 rounded-md hover:bg-[#1a2c50] transition-all duration-200"
        onClick={handleToggle}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-5 mt-12">
        {links.map(({ to, label, icon: Icon }) => (
          <SidebarLink
            key={to || label}
            to={to}
            label={label}
            Icon={Icon}
            isCollapsed={isCollapsed}
            isActive={location.pathname === to}
          />
        ))}
      </nav>

      {/* Bottom Links */}
      <div className="space-y-2 pt-4 border-t border-[#1a2c50]">
        <SidebarLink
          to="/Logout"
          label="Logout"
          Icon={LogOut}
          isCollapsed={isCollapsed}
          isActive={location.pathname === "/settings"}
        />
      </div>
    </aside>
  );
};

// Reusable Sidebar Link Component
const SidebarLink = ({ to, label, Icon, isCollapsed, isActive }) => (
  <Link
    to={to}
    className={`flex items-center px-3 py-2 text-white rounded-md transition-all duration-300 ${
      isActive ? "bg-[#4a90e2] text-lime-300" : "hover:bg-[#1a2c50]"
    }`}
  >
    <Icon className="h-5 w-5" />
    {!isCollapsed && <span className="ml-3">{label}</span>}
  </Link>
);

export default Sidebar;