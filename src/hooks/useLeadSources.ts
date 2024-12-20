import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { settingsService } from '../services/settingsService';
import type { LeadSource } from '../types';

export function useLeadSources() {
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { projectId } = useParams();

  useEffect(() => {
    const fetchSources = async () => {
      if (!projectId) return;

      try {
        const data = await settingsService.getLeadSources(projectId);
        setSources(data.filter(source => source.is_active));
      } catch (err) {
        setError('Failed to load lead sources');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSources();
  }, [projectId]);

  const getSourceConfig = (sourceName: string) => {
    return sources.find(s => s.name.toLowerCase() === sourceName.toLowerCase());
  };

  return { 
    sources, 
    loading, 
    error,
    getSourceConfig 
  };
}
