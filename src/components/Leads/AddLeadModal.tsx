import React from 'react';
import { X } from 'lucide-react';
import { LeadForm } from '../LeadForm';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadAdded: () => void;
}

export function AddLeadModal({
  isOpen,
  onClose,
  onLeadAdded,
}: AddLeadModalProps) {
  if (!isOpen) return null;

  const handleSuccess = () => {
    onLeadAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Lead</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <LeadForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}
