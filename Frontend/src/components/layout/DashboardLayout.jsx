import React, { useState } from "react";
import TopNavbar from "../navbar/TopNavbar";
import Sidebar from "../navbar/Sidebar";

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar onToggle={setIsCollapsed} />

      {/* Main Content - Expands when Sidebar Collapses */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 relative ${
          isCollapsed ? "ml-16" : "ml-60"
        }`}
      >
         {/* Navbar with highest z-index */}
         <div className="z-50 relative">
          <TopNavbar />
        </div>
        <div className="pt-20">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;

