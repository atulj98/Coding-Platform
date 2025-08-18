'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import {
  Menu,
  X,
  Home,
  FileText,
  BookOpen,
  BarChart3,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Assessments', href: '/dashboard/assessments', icon: FileText },
  { name: 'Courses', href: '/dashboard/courses', icon: BookOpen },
  // { name: 'Grades', href: '/dashboard/grades', icon: BarChart3 },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    return name ? name.split(' ').map(word => word[0]).join('').toUpperCase() : 'U';
  };

  return (
    <>
      {/* Overlay on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-slate-900 text-white z-50 transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'w-64' : 'w-16'}
        `}
      >
        {/* Header with toggle button */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {isSidebarOpen && user && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-semibold">
                {getInitials(user.displayName)}
              </div>
            </div>
          )}
        </div>

        {/* Profile Section */}
        {isSidebarOpen && user && (
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-lg font-semibold">
                {getInitials(user.displayName)}
              </div>
              <div>
                <h3 className="font-semibold text-white">{user.displayName}</h3>
                <p className="text-sm text-slate-400">@{user.username}</p>
              </div>
            </div>
            <div className="text-xs text-slate-400">
              <p>B. Tech, Computer Science</p>
              <p>6th Semester, Sharda University</p>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="mt-4 px-2">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            const IconComponent = item.icon;

            return (
              <div key={item.name} className="mb-1">
                <Link href={item.href}>
                  <div
                    className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    {isSidebarOpen && (
                      <span className="ml-3 font-medium">{item.name}</span>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Bottom Section - Settings and Logout */}
        <div className="absolute bottom-4 left-2 right-2 space-y-2">
          {/* Settings Button */}
          <button 
            className={`w-full flex items-center px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors ${
              !isSidebarOpen && 'justify-center'
            }`}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="ml-3 font-medium">Settings</span>}
          </button>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center px-3 py-3 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition-colors ${
              !isSidebarOpen && 'justify-center'
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}