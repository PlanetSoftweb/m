import { supabase } from '../lib/supabase';
import type { Conversation } from '../types';

export const conversationService = {
  async getConversations(leadId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('lead_id', leadId)
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data as Conversation[];
  },

  async addConversation(conversation: Omit<Conversation, 'id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('conversations')
      .insert([{
        ...conversation,
        user_id: user.id
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Conversation;
  },

  async updateConversation(id: string, updates: Partial<Conversation>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('conversations')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Conversation;
  },

  async deleteConversation(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) throw error;
  }
};
