import { supabase } from '../lib/supabase';
import type { Project } from '../types';

export const projectService = {
  async getProjects() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Project[];
  },

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'deleted_at' | 'deleted_by'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // First create the project
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert([{
        ...project,
        user_id: user.id,
        status: 'active'
      }])
      .select()
      .single();

    if (projectError) throw projectError;

    // Set up initial lead sources for the project
    const defaultSources = [
      { name: 'Website', icon: 'Globe', color: '#0EA5E9' },
      { name: 'Referral', icon: 'Users', color: '#10B981' },
      { name: 'Zillow', icon: 'Home', color: '#8B5CF6' },
      { name: 'Email', icon: 'Mail', color: '#6366F1' },
      { name: 'Phone', icon: 'Phone', color: '#EF4444' }
    ];

    const { error: sourcesError } = await supabase
      .from('lead_sources')
      .insert(defaultSources.map(source => ({
        ...source,
        user_id: user.id,
        project_id: projectData.id,
        is_active: true
      })));

    if (sourcesError) throw sourcesError;

    return projectData as Project;
  },

  async setCurrentProject(projectId: string) {
    const { error } = await supabase.rpc('set_current_project', {
      project_id: projectId
    });

    if (error) {
      // If the error is about unrecognized parameter, try to initialize the context
      if (error.message.includes('unrecognized configuration parameter')) {
        await supabase.rpc('initialize_project_context');
        // Retry setting the project
        const { error: retryError } = await supabase.rpc('set_current_project', {
          project_id: projectId
        });
        if (retryError) throw retryError;
      } else {
        throw error;
      }
    }
  },

  async getCurrentProject() {
    const { data, error } = await supabase.rpc('get_current_project');
    if (error) throw error;
    return data;
  }
};
