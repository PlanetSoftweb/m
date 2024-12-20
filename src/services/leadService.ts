import { supabase } from '../lib/supabase';
import type { Lead } from '../types';
import type { CreateLeadDTO } from '../services/leads/types';

export const leadService = {
  async getLeads(projectId: string, filters?: LeadFilters, page?: number, pageSize?: number): Promise<Lead[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    await supabase.rpc('set_current_project', { project_id: projectId });

    let query = leadQueries.getAll(projectId);

    if (filters) {
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.source) query = query.eq('source', filters.source);
      if (filters.searchTerm) {
        query = query.or(
          'name', 'ilike', `%${filters.searchTerm}%`,
          'email', 'ilike', `%${filters.searchTerm}%`,
          'phone', 'ilike', `%${filters.searchTerm}%`
        );
      }
      if (filters.startDate) query = query.gte('created_at', filters.startDate);
      if (filters.endDate) query = query.lte('created_at', filters.endDate);
    }

    if (page && pageSize) {
      query = query.range((page - 1) * pageSize, page * pageSize - 1);
    }

    const { data, error } = await query;

    if (error) throw handleSupabaseError(error);
    return data as Lead[];
  },

  async getDeletedLeads(projectId: string): Promise<Lead[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    await supabase.rpc('set_current_project', { project_id: projectId });

    const { data, error } = await leadQueries.getDeleted(projectId);

    if (error) throw handleSupabaseError(error);
    return data as Lead[];
  },

  async getLeadCount(projectId: string, filters?: LeadFilters): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    await supabase.rpc('set_current_project', { project_id: projectId });

    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('project_id', projectId)
      .is('deleted_at', null);

    if (filters) {
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.source) query = query.eq('source', filters.source);
      if (filters.searchTerm) {
        query = query.or(
          'name', 'ilike', `%${filters.searchTerm}%`,
          'email', 'ilike', `%${filters.searchTerm}%`,
          'phone', 'ilike', `%${filters.searchTerm}%`
        );
      }
      if (filters.startDate) query = query.gte('created_at', filters.startDate);
      if (filters.endDate) query = query.lte('created_at', filters.endDate);
    }

    const { count, error } = await query;

    if (error) throw handleSupabaseError(error);
    return count || 0;
  },

  async updateLead(leadId: string, updates: UpdateLeadDTO): Promise<Lead> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await leadQueries.update(leadId, updates);

    if (error) throw handleSupabaseError(error);
    return data as Lead;
  },

  async softDeleteLead(leadId: string): Promise<Lead> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await leadQueries.softDelete(leadId);

    if (error) throw handleSupabaseError(error);
    return data as Lead;
  },

  async permanentlyDeleteLead(leadId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await leadQueries.permanentDelete(leadId);

    if (error) throw handleSupabaseError(error);
  },

  async createLead(projectId: string, leadData: CreateLeadDTO): Promise<Lead> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    await supabase.rpc('set_current_project', { project_id: projectId });

    const { data, error } = await leadQueries.create(projectId, leadData);

    if (error) throw handleSupabaseError(error);
    return data as Lead;
  },

  async restoreLead(leadId: string): Promise<Lead> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await leadQueries.restore(leadId);

    if (error) throw handleSupabaseError(error);
    return data as Lead;
  },
};