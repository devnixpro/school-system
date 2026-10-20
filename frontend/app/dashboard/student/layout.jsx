"use client";
import React, { useState } from 'react';
import Header from '@/components/Header'; // Apne sahi path ke mutabiq adjust karein
import StudentSidebar from '@/components/student/StudentSidebar';
import Footer from '@/components/Footer';

export default function StudentLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
   <div className="flex flex-col h-screen overflow-hidden">
      <Header isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className="flex flex-1 min-h-0">
        <StudentSidebar isCollapsed={isCollapsed} />
        
        {/* Main scrollable area - Content + Footer */}
        <main className="flex-1 overflow-y-auto bg-[#0f111a] flex flex-col justify-between">
          <div className="p-4 md:p-6">
            {children}
          </div>
          
          {/* Footer content ke neoche render hoga */}
          <Footer />
        </main>
      </div>
    </div>
  );
}