import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PerformanceMetrics } from './Analytics/PerformanceMetrics';
import { LeadTrendChart } from './Analytics/LeadTrendChart';
import { ConversionFunnel } from './Analytics/ConversionFunnel';
import { LeadSourceAnalytics } from './Analytics/LeadSourceAnalytics';
import { useProject } from '../contexts/ProjectContext';
import { leadService } from '../services/leadService';
import { GlassLoader } from './common/GlassLoader';
import type { Lead } from '../types';

export function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { projectId } = useParams();
  const { currentProject } = useProject();

  useEffect(() => {
    const fetchLeads = async () => {
      if (!projectId) return;
      
      setLoading(true);
      try {
        const data = await leadService.getLeads(projectId);
        setLeads(data);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <GlassLoader size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentProject?.name} Dashboard
          </h1>
          <p className="text-gray-500">
            Overview of your project's performance
          </p>
        </div>
      </div>

      <PerformanceMetrics leads={leads} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadTrendChart leads={leads} />
        <LeadSourceAnalytics leads={leads} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConversionFunnel leads={leads} />
      </div>
    </div>
  );
}
