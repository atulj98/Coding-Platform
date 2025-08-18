// 'use client';
// import React, { useState } from 'react';
// import Sidebar from '@/components/dashboard/Sidebar';

// export default function DashboardLayout({ children }) {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

//       {/* Main content wrapper */}
//       <div
//         className={`transition-all duration-300 ease-in-out pt-4 ${
//           isSidebarOpen
//             ? 'ml-64 pr-4'          // full left margin when sidebar is open
//             : 'px-16 lg:px-20'      // equal space left/right when collapsed
//         }`}
//       >
//         <main className="p-2">{children}</main>
//       </div>
//     </div>
//   );
// }
// app/dashboard/layout.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
// import Header from '@/components/dashboard/Header';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
      }`}>
        {/* <Header 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
        /> */}
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
