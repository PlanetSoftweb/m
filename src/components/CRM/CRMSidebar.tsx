import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Settings, ChevronLeft, ChevronRight, 
  Building2, BarChart2, Calendar, MessageSquare, Clock, AlertTriangle, 
  CalendarDays, ChevronDown, FileBarChart
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

interface CRMSidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggle: () => void;
}

export function CRMSidebar({ isCollapsed, isMobileOpen, onToggle }: CRMSidebarProps) {
  const location = useLocation();
  const projectId = location.pathname.split('/')[2];
  const [isLeadsOpen, setIsLeadsOpen] = useState(true);
  const { counts } = useNotifications();

  const menuItems = [
    { 
      to: `/projects/${projectId}/crm`, 
      icon: LayoutDashboard, 
      label: 'Dashboard' 
    },
    { 
      icon: Users, 
      label: 'Leads',
      isSubmenu: true,
      isOpen: isLeadsOpen,
      onToggle: () => setIsLeadsOpen(!isLeadsOpen),
      subItems: [
        { 
          to: `/projects/${projectId}/crm/leads`, 
          label: 'All Leads',
          icon: Users
        },
        { 
          to: `/projects/${projectId}/crm/leads/overdue`, 
          label: 'Overdue', 
          icon: AlertTriangle,
          variant: 'danger',
          count: counts?.overdue || 0
        },
        { 
          to: `/projects/${projectId}/crm/leads/today`, 
          label: 'Due Today',
          icon: Clock,
          variant: 'warning',
          count: counts?.dueToday || 0
        },
        { 
          to: `/projects/${projectId}/crm/leads/tomorrow`, 
          label: 'Due Tomorrow',
          icon: Calendar,
          variant: 'info',
          count: counts?.dueTomorrow || 0
        },
        { 
          to: `/projects/${projectId}/crm/leads/next-10-days`, 
          label: 'Next 10 Days',
          icon: CalendarDays
        },
        { 
          to: `/projects/${projectId}/crm/leads/source-report`, 
          label: 'Source Report',
          icon: FileBarChart
        }
      ]
    },
    { 
      to: `/projects/${projectId}/crm/analytics`, 
      icon: BarChart2, 
      label: 'Analytics' 
    },
    { 
      to: `/projects/${projectId}/crm/calendar`, 
      icon: Calendar, 
      label: 'Calendar' 
    },
    { 
      to: `/projects/${projectId}/crm/messages`, 
      icon: MessageSquare, 
      label: 'Messages' 
    },
    { 
      to: `/projects/${projectId}/crm/settings`, 
      icon: Settings, 
      label: 'Settings' 
    },
  ];

  return (
    <motion.div
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
              Project CRM
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

      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to || 
            (item.subItems && item.subItems.some(sub => location.pathname === sub.to));

          if (item.isSubmenu) {
            return (
              <div key={item.label}>
                <button
                  onClick={item.onToggle}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors relative
                    ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span>{item.label}</span>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform ${item.isOpen ? 'rotate-180' : ''}`} 
                      />
                    </div>
                  )}
                  {isActive && (
                    <motion.div
                      className="absolute inset-y-0 left-0 w-1 bg-blue-600 rounded-r"
                      layoutId="activeIndicator"
                    />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {item.isOpen && !isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-12 py-2 space-y-1">
                        {item.subItems?.map((subItem) => {
                          const isSubActive = location.pathname === subItem.to;
                          return (
                            <Link
                              key={subItem.to}
                              to={subItem.to}
                              className={`flex items-center justify-between px-4 py-2 text-sm rounded-lg transition-colors
                                ${isSubActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                              <div className="flex items-center gap-2">
                                <subItem.icon className={`w-4 h-4 ${
                                  isSubActive ? 'text-blue-600' : 'text-gray-400'
                                }`} />
                                <span>{subItem.label}</span>
                              </div>
                              {subItem.count > 0 && (
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full
                                  ${subItem.variant === 'danger' ? 'bg-red-100 text-red-700' :
                                    subItem.variant === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-blue-100 text-blue-700'}`}
                                >
                                  {subItem.count}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors relative
                ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
              {!isCollapsed && <span>{item.label}</span>}
              {isActive && (
                <motion.div
                  className="absolute inset-y-0 left-0 w-1 bg-blue-600 rounded-r"
                  layoutId="activeIndicator"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
}
