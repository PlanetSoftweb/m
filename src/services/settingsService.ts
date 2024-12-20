import { supabase } from '../lib/supabase';
import type { LeadSource, AppSettings } from '../types';

export const settingsService = {
  async getSettings(projectId: string): Promise<AppSettings> {
    try {
      // Set the current project context
      await supabase.rpc('set_current_project', { project_id: projectId });

      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('project_id', projectId)
        .single();
      
      if (error) {
        console.error('Settings fetch error:', error);
        throw new Error(error.message || 'Failed to load settings');
      }
      return data as AppSettings;
    } catch (error) {
      console.error('Settings error:', error);
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  async getLeadSources(projectId: string): Promise<LeadSource[]> {
    try {
      // Set the current project context
      await supabase.rpc('set_current_project', { project_id: projectId });

      const { data, error } = await supabase
        .from('lead_sources')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Lead sources fetch error:', error);
        throw new Error(error.message || 'Failed to load lead sources');
      }
      return data as LeadSource[];
    } catch (error) {
      console.error('Lead sources error:', error);
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  async createLeadSource(projectId: string, source: Omit<LeadSource, 'id' | 'created_at' | 'user_id' | 'project_id'>): Promise<LeadSource> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Set the current project context
      await supabase.rpc('set_current_project', { project_id: projectId });

      const { data, error } = await supabase
        .from('lead_sources')
        .insert([{ 
          ...source, 
          user_id: user.id,
          project_id: projectId,
          created_at: new Date().toISOString() 
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Create lead source error:', error);
        throw new Error(error.message || 'Failed to create lead source');
      }
      return data as LeadSource;
    } catch (error) {
      console.error('Create lead source error:', error);
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  async updateLeadSource(projectId: string, id: string, updates: Partial<LeadSource>): Promise<LeadSource> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Set the current project context
      await supabase.rpc('set_current_project', { project_id: projectId });

      const { data, error } = await supabase
        .from('lead_sources')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .eq('project_id', projectId)
        .select()
        .single();
      
      if (error) {
        console.error('Update lead source error:', error);
        throw new Error(error.message || 'Failed to update lead source');
      }
      return data as LeadSource;
    } catch (error) {
      console.error('Update lead source error:', error);
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  async deleteLeadSource(projectId: string, id: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Set the current project context
      await supabase.rpc('set_current_project', { project_id: projectId });

      const { error } = await supabase
        .from('lead_sources')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
        .eq('project_id', projectId);
      
      if (error) {
        console.error('Delete lead source error:', error);
        throw new Error(error.message || 'Failed to delete lead source');
      }
    } catch (error) {
      console.error('Delete lead source error:', error);
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  }
};
