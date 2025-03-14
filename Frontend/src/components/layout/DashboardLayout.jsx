import React, { useState } from "react";
import TopNavbar from "../navbar/TopNavbar";
import Sidebar from "../sidebar/Sidebar";

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar onToggle={setIsCollapsed} />

      {/* Main Content - Expands when Sidebar Collapses */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? "ml-16" : "ml-60"
        }`}
      >
        <TopNavbar />
        <div className="pt-20">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
