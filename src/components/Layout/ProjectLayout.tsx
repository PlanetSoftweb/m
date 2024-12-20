import React from 'react';
import { Navbar } from './Navbar';
import { ProjectSidebar } from '../Projects/ProjectSidebar';
import { useNavigationState } from '../../hooks/useNavigationState';

interface ProjectLayoutProps {
  children: React.ReactNode;
}

export function ProjectLayout({ children }: ProjectLayoutProps) {
  const {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    toggleSidebar
  } = useNavigationState();

  return (
    <div className="flex h-screen bg-app-bg">
      <ProjectSidebar 
        isCollapsed={isSidebarCollapsed} 
        isMobileOpen={isMobileMenuOpen}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div 
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300
          ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
          ${isMobileMenuOpen ? 'ml-64' : 'ml-0'}`}
      >
        <Navbar 
          isMobileMenuOpen={isMobileMenuOpen}
          onMenuToggle={toggleSidebar}
        />
        <main 
          className="flex-1 overflow-auto px-4 py-8"
          role="main"
          aria-label="Project content"
        >
          <div className="max-w-[2000px] w-full mx-auto space-y-8 animate-fade-up">
            {children}
          </div>
        </main>
      </div>
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-20"
          aria-hidden="true"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
