import { supabase } from '../../../lib/supabase';
import type { Lead } from '../../../types';

export const leadQueries = {
  getAll: (projectId: string) => 
    supabase
      .from('leads')
      .select('*')
      .eq('project_id', projectId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false }),

  update: (projectId: string, leadId: string, updates: Partial<Lead>) => 
    supabase
      .from('leads')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId)
      .eq('project_id', projectId)
      .select()
      .single()
};
