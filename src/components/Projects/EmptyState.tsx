import React from 'react';
import { Building2, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateProject: () => void;
}

export function EmptyState({ onCreateProject }: EmptyStateProps) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-blue-100 mb-6">
        <Building2 className="w-8 h-8 text-blue-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No Projects Yet
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        Get started by creating your first real estate project. You can manage multiple properties and their leads efficiently.
      </p>

      <button
        onClick={onCreateProject}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Plus className="w-5 h-5" />
        Create Your First Project
      </button>
    </div>
  );
}
