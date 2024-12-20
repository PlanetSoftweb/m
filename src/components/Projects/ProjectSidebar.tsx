import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { projectService } from '../../services/projectService';
import type { Project } from '../../types';

interface ProjectSidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggle: () => void;
}

export function ProjectSidebar({ isCollapsed, isMobileOpen, onToggle }: ProjectSidebarProps) {
  const location = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'completed': return '#3B82F6';
      case 'on_hold': return '#F59E0B';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <motion.div
      id="project-sidebar"
      role="navigation"
      aria-label="Project navigation"
      className={`bg-white border-r border-gray-200 fixed h-screen z-30
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        transition-all duration-300 ease-in-out`}
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-2 overflow-hidden"
          animate={{ opacity: isCollapsed ? 0 : 1 }}
        >
          <Building2 className="w-8 h-8 text-blue-600" />
          {!isCollapsed && (
            <motion.h1
              className="text-xl font-bold text-gray-900"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              Projects
            </motion.h1>
          )}
        </motion.div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hidden lg:block"
          aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} sidebar`}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      <div className="p-4">
        <Link
          to="/projects"
          className={`w-full flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors
            ${isCollapsed ? 'justify-center' : ''}`}
        >
          <Plus className="w-5 h-5" />
          {!isCollapsed && <span>New Project</span>}
        </Link>
      </div>

      <nav className="p-4 space-y-2">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          projects.map((project) => {
            const isActive = location.pathname.includes(project.id);
            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}/crm`}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative
                  ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: getStatusColor(project.status) }}
                >
                  {project.name.charAt(0)}
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {project.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {project.status.replace('_', ' ').charAt(0).toUpperCase() + project.status.slice(1)}
                    </p>
                  </div>
                )}
                {isActive && (
                  <motion.div
                    className="absolute inset-y-0 left-0 w-1 bg-blue-600 rounded-r"
                    layoutId="activeIndicator"
                  />
                )}
              </Link>
            );
          })
        )}
      </nav>
    </motion.div>
  );
}
