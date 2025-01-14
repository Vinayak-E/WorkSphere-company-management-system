import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <SidebarProvider>
    <div className="flex h-screen w-full overflow-hidden">
      <AdminSidebar expanded={isExpanded} />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <AdminHeader onToggleSidebar={toggleSidebar} isExpanded={isExpanded} />
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="h-full p-6">
            <div className="bg-white rounded-lg shadow-sm h-full">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  </SidebarProvider>
);
};

export default AdminLayout;