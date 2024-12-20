import React from 'react';
import { useParams } from 'react-router-dom';
import { InfoBox } from './InfoBox/InfoBox';
import { ConversationReport } from '../ConversationReport';
import { AIAnalytics } from '../AIAnalytics';
import type { Lead } from '../../types';

interface LeadDetailsProps {
  lead: Lead;
  onUpdate: (lead: Lead) => Promise<void>;
}

export function LeadDetails({ lead, onUpdate }: LeadDetailsProps) {
  const { projectId } = useParams();

  const handleFollowUpUpdate = async (updatedLead: Lead) => {
    if (!projectId) {
      throw new Error('Project ID is required');
    }

    try {
      await onUpdate(updatedLead);
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <InfoBox 
        lead={lead} 
        onUpdate={handleFollowUpUpdate}
      />
      <AIAnalytics lead={lead} />
      <ConversationReport 
        lead={lead} 
        onUpdate={handleFollowUpUpdate}
      />
    </div>
  );
}
