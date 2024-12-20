import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { leadService } from '../services/leadService';
import { LeadTable } from './Leads/LeadTable';
import { LeadActions } from './Leads/LeadActions';
import { PipelineView } from './Leads/PipelineView';
import { AddLeadModal } from './Leads/AddLeadModal';
import { ImportLeadsModal } from './Leads/ImportLeadsModal';
import { AdvancedFilters } from './Leads/AdvancedFilters';
import { LeadDetailsModal } from './LeadDetails/LeadDetailsModal';
import { exportLeadsToCSV } from '../utils/csvHelpers';
import { GlassLoader } from './common/GlassLoader';
import type { Lead } from '../types';

interface LeadListProps {
  filterFn?: (leads: Lead[]) => Lead[];
}

export function LeadList({ filterFn }: LeadListProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'table' | 'pipeline'>('table');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const { projectId } = useParams();

  useEffect(() => {
    const fetchLeads = async () => {
      if (!projectId) return;
      
      setLoading(true);
      try {
        const data = await leadService.getLeads(projectId);
        setLeads(filterFn ? filterFn(data) : data);
      } catch (err) {
        setError('Failed to load leads');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [projectId, filterFn]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleExport = () => {
    exportLeadsToCSV(leads);
  };

  const handleImport = async (importedLeads: Partial<Lead>[]) => {
    if (!projectId) return;
    
    try {
      for (const lead of importedLeads) {
        await leadService.createLead(projectId, {
          ...lead,
          status: 'new',
          source: lead.source || 'import',
          last_contact: new Date().toISOString(),
          next_followup: new Date().toISOString()
        } as Lead);
      }
      // Refresh leads after import
      const updatedLeads = await leadService.getLeads(projectId);
      setLeads(filterFn ? filterFn(updatedLeads) : updatedLeads);
      setShowImportModal(false);
    } catch (err) {
      console.error('Failed to import leads:', err);
      throw err;
    }
  };

  const handleLeadAdded = async () => {
    if (!projectId) return;
    
    try {
      const updatedLeads = await leadService.getLeads(projectId);
      setLeads(filterFn ? filterFn(updatedLeads) : updatedLeads);
    } catch (err) {
      console.error('Failed to refresh leads:', err);
    }
  };

  const handleLeadUpdate = async (updatedLead: Lead) => {
    if (!projectId) return;

    try {
      await leadService.updateLead(projectId, updatedLead.id, updatedLead);
      const updatedLeads = await leadService.getLeads(projectId);
      setLeads(filterFn ? filterFn(updatedLeads) : updatedLeads);
    } catch (err) {
      console.error('Failed to update lead:', err);
      throw err;
    }
  };

  const filteredLeads = leads.filter(lead => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      lead.name.toLowerCase().includes(searchLower) ||
      lead.email.toLowerCase().includes(searchLower) ||
      lead.phone.toLowerCase().includes(searchLower)
    );
  });

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
      <LeadActions
        view={view}
        onViewChange={setView}
        onAddLead={() => setShowAddModal(true)}
        onSearch={handleSearch}
        onExport={handleExport}
        onImport={() => setShowImportModal(true)}
        onOpenFilters={() => setShowFilters(true)}
      />

      {view === 'table' ? (
        <LeadTable 
          leads={filteredLeads}
          onSelectLead={setSelectedLead}
        />
      ) : (
        <PipelineView 
          leads={filteredLeads}
          onSelectLead={setSelectedLead}
        />
      )}

      {showAddModal && (
        <AddLeadModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onLeadAdded={handleLeadAdded}
        />
      )}

      {showImportModal && (
        <ImportLeadsModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={handleImport}
        />
      )}

      {showFilters && (
        <AdvancedFilters
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          onApplyFilters={(filters) => {
            // Handle filter application
            setShowFilters(false);
          }}
        />
      )}

      {selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={handleLeadUpdate}
        />
      )}
    </div>
  );
}
