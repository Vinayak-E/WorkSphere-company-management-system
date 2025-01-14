import React from 'react';
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Home",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Companies",
    url: "/admin/companiesList",
    icon: Inbox,
  },
  {
    title: "Subscription Plans",
    url: "/admin/subscriptions",
    icon: Calendar,
  },
  {
    title: "Messages",
    url: "/admin/messages",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

const AdminSidebar = ({ expanded }) => {
  const location = useLocation();

  return (
    <Sidebar
    className={`border-r border-gray-200 bg-white transition-all duration-300 h-screen ${
      expanded ? 'w-64' : 'w-20'
    }`}
  >
    <SidebarContent className="h-full">
      <div className={`p-4 h-16 flex ${expanded ? '' : 'justify-center'} items-center`}>
        {expanded ? (
          <h2 className="text-xl font-bold text-indigo-600">Admin Panel</h2>
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
            A
          </div>
        )}
      </div>
      <SidebarGroup className="flex-1">
        {expanded && (
          <SidebarGroupLabel className="px-4 text-sm font-medium text-gray-500">
            Navigation
          </SidebarGroupLabel>
        )}
        <SidebarGroupContent>
          <SidebarMenu>
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={`
                        flex items-center gap-3 px-4 py-2
                        transition-colors duration-200
                        ${expanded ? '' : 'justify-center'}
                        ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                      title={!expanded ? item.title : undefined}
                    >
                      <item.icon className="w-5 h-5" />
                      {expanded && <span className="font-medium">{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
);
};
export default AdminSidebar