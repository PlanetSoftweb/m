import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { leadService } from '../../../services/leads/leadService';
import type { Lead } from '../../../types';

export function useLeadUpdate() {
  const { projectId } = useParams();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateLead = async (leadId: string, updates: Partial<Lead>) => {
    if (!projectId) {
      throw new Error('Project ID is required');
    }

    setUpdating(true);
    setError(null);

    try {
      const updatedLead = await leadService.updateLead(projectId, leadId, updates);
      return updatedLead;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update lead';
      setError(error);
      throw new Error(error);
    } finally {
      setUpdating(false);
    }
  };

  return {
    updateLead,
    updating,
    error
  };
}
