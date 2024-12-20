import React, { useState } from 'react';
import { Bell, AlertTriangle, Clock, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';

export function CRMNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, counts } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const categories = [
    {
      title: 'Overdue',
      count: counts.overdue,
      icon: AlertTriangle,
      path: 'leads/overdue',
      variant: 'danger',
      description: 'Leads requiring immediate attention'
    },
    {
      title: 'Due Today',
      count: counts.dueToday,
      icon: Clock,
      path: 'leads/today',
      variant: 'warning',
      description: 'Follow-ups scheduled for today'
    },
    {
      title: 'Due Tomorrow',
      count: counts.dueTomorrow,
      icon: Calendar,
      path: 'leads/tomorrow',
      variant: 'info',
      description: 'Prepare for tomorrow\'s follow-ups'
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-full transition-colors"
        aria-label={`${isOpen ? 'Close' : 'Open'} notifications`}
      >
        <Bell className="w-5 h-5" />
        {counts.unreadTotal > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">CRM Notifications</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {categories.map(cat => cat.count > 0 && (
                    <span
                      key={cat.title}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                        ${cat.variant === 'danger' ? 'bg-red-100 text-red-700' :
                          cat.variant === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'}`}
                    >
                      <cat.icon className="w-3 h-3" />
                      {cat.count} {cat.title}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 space-y-4">
                {categories.map((category) => (
                  category.count > 0 && (
                    <button
                      key={category.title}
                      onClick={() => handleNotificationClick(category.path)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50
                        ${category.variant === 'danger' ? 'bg-red-50 text-red-700' :
                          category.variant === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-blue-50 text-blue-700'}`}
                    >
                      <category.icon className="w-5 h-5" />
                      <div className="text-left">
                        <p className="font-medium">
                          {category.count} {category.title}
                        </p>
                        <p className="text-sm opacity-80">{category.description}</p>
                      </div>
                    </button>
                  )
                ))}

                {categories.every(cat => cat.count === 0) && (
                  <div className="text-center text-gray-500 py-4">
                    <Bell className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No pending notifications</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
