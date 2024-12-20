import React from 'react';
import * as Icons from 'lucide-react';
import { useLeadSources } from '../../hooks/useLeadSources';

interface SourceTagProps {
  source: string;
  className?: string;
}

// Built-in sources configuration
const BUILT_IN_SOURCES = {
  'website form': { name: 'Website Form', icon: 'FormInput', color: '#0EA5E9' },
  'landing page': { name: 'Landing Page', icon: 'Layout', color: '#8B5CF6' },
  'phone inquiry': { name: 'Phone Inquiry', icon: 'Phone', color: '#EF4444' },
  'walk-in': { name: 'Walk-in', icon: 'Footprints', color: '#10B981' },
  'property portal': { name: 'Property Portal', icon: 'Building', color: '#F59E0B' },
  'agent referral': { name: 'Agent Referral', icon: 'UserPlus', color: '#6366F1' },
  'online chat': { name: 'Online Chat', icon: 'MessageSquare', color: '#EC4899' },
  'newsletter': { name: 'Newsletter', icon: 'Newspaper', color: '#14B8A6' }
};

export function SourceTag({ source, className = '' }: SourceTagProps) {
  const { getSourceConfig } = useLeadSources();
  const normalizedSource = source.toLowerCase();
  
  // Check built-in sources first
  const builtInConfig = BUILT_IN_SOURCES[normalizedSource];
  
  // If not a built-in source, check custom sources
  const customConfig = !builtInConfig ? getSourceConfig(source) : null;
  
  // Use built-in config, custom config, or fallback
  const config = builtInConfig || customConfig || {
    name: source.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    icon: 'Globe',
    color: '#64748B'
  };

  const Icon = Icons[config.icon as keyof typeof Icons] || Icons.Globe;

  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
      style={{ 
        backgroundColor: `${config.color}15`,
        color: config.color
      }}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.name}
    </span>
  );
}
