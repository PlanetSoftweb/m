import { supabase } from '../../lib/supabase';
import type { CreateLeadDTO, UpdateLeadDTO } from './types';

export const leadQueries = {
  getAll: (projectId: string) => 
    supabase
      .from('leads')
      .select('*')
      .eq('project_id', projectId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false }),

  getDeleted: (projectId: string) => 
    supabase
      .from('leads')
      .select('*')
      .eq('project_id', projectId)
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false }),

  create: (projectId: string, lead: CreateLeadDTO) => 
    supabase
      .from('leads')
      .insert([{
        ...lead,
        project_id: projectId,
        created_at: new Date().toISOString()
      }])
      .select()
      .single(),

  update: (projectId: string, leadId: string, updates: UpdateLeadDTO) => 
    supabase
      .from('leads')
      .update(updates)
      .eq('id', leadId)
      .eq('project_id', projectId)
      .select()
      .single(),

  softDelete: (projectId: string, leadId: string) => 
    supabase
      .from('leads')
      .update({
        status: 'deleted',
        deleted_at: new Date().toISOString()
      })
      .eq('id', leadId)
      .eq('project_id', projectId)
      .select()
      .single(),

  restore: (projectId: string, leadId: string) => 
    supabase
      .from('leads')
      .update({
        status: 'new',
        deleted_at: null
      })
      .eq('id', leadId)
      .eq('project_id', projectId)
      .select()
      .single(),

  permanentDelete: (projectId: string, leadId: string) => 
    supabase
      .from('leads')
      .delete()
      .eq('id', leadId)
      .eq('project_id', projectId)
};
