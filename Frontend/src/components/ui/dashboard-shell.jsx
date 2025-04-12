import React from "react";

export function DashboardShell({ children }) {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex-1 space-y-4">{children}</div>
    </div>
  );
}
