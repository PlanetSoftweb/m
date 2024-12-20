import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import type { Project } from '../types';

interface ProjectContextType {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  loading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleSetCurrentProject = async (project: Project | null) => {
    try {
      if (project) {
        await projectService.setCurrentProject(project.id);
      }
      setCurrentProject(project);
    } catch (error) {
      console.error('Failed to set current project:', error);
      navigate('/projects');
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <ProjectContext.Provider 
      value={{ 
        currentProject, 
        setCurrentProject: handleSetCurrentProject,
        loading 
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
