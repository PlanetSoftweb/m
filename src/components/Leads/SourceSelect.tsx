import React from 'react';
import * as Icons from 'lucide-react';
import { useLeadSources } from '../../hooks/useLeadSources';

interface SourceSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

// Built-in sources that are always available
const BUILT_IN_SOURCES = [
  { name: 'Website Form', icon: 'FormInput', color: '#0EA5E9' },
  { name: 'Landing Page', icon: 'Layout', color: '#8B5CF6' },
  { name: 'Phone Inquiry', icon: 'Phone', color: '#EF4444' },
  { name: 'Walk-in', icon: 'Footprints', color: '#10B981' },
  { name: 'Property Portal', icon: 'Building', color: '#F59E0B' },
  { name: 'Agent Referral', icon: 'UserPlus', color: '#6366F1' },
  { name: 'Online Chat', icon: 'MessageSquare', color: '#EC4899' },
  { name: 'Newsletter', icon: 'Newspaper', color: '#14B8A6' }
];

export function SourceSelect({ value, onChange, disabled, required, className }: SourceSelectProps) {
  const { sources, loading } = useLeadSources();

  // Combine built-in sources with custom sources
  const allSources = [
    { label: 'Built-in Sources', options: BUILT_IN_SOURCES },
    { 
      label: 'Custom Sources', 
      options: sources.map(s => ({
        name: s.name,
        icon: s.icon,
        color: s.color
      }))
    }
  ];

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        required={required}
        className={`mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      >
        <option value="">Select source</option>
        
        {allSources.map(group => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map(source => {
              const Icon = Icons[source.icon as keyof typeof Icons] || Icons.Globe;
              return (
                <option 
                  key={source.name} 
                  value={source.name.toLowerCase()}
                  style={{ color: source.color }}
                >
                  {source.name}
                </option>
              );
            })}
          </optgroup>
        ))}
      </select>
      
      {loading && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}
