import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { CRMSidebar } from '../CRM/CRMSidebar';
import { useNavigationState } from '../../hooks/useNavigationState';
import { useProject } from '../../contexts/ProjectContext';
import { projectService } from '../../services/projectService';
import { GlassLoader } from '../common/GlassLoader';

interface CRMLayoutProps {
  children: React.ReactNode;
}

export function CRMLayout({ children }: CRMLayoutProps) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentProject, setCurrentProject, loading } = useProject();
  const {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    toggleSidebar
  } = useNavigationState();

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        navigate('/projects');
        return;
      }

      try {
        const projects = await projectService.getProjects();
        const project = projects.find(p => p.id === projectId);
        
        if (!project) {
          navigate('/projects');
          return;
        }

        setCurrentProject(project);
      } catch (error) {
        console.error('Failed to load project:', error);
        navigate('/projects');
      }
    };

    if (!currentProject || currentProject.id !== projectId) {
      loadProject();
    }
  }, [projectId, navigate, setCurrentProject]);

  if (loading || !currentProject) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <GlassLoader size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-app-bg">
      <CRMSidebar 
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
          aria-label="CRM content"
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
