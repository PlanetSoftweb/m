import type { Lead } from '../../types';

export interface CreateLeadDTO {
  name: string;
  email: string;
  phone: string;
  source: string;
  notes?: string;
  property_interest?: string;
  budget?: number;
  location?: string;
  status: Lead['status'];
  next_followup: string;
  last_contact: string;
}

export interface UpdateLeadDTO extends Partial<CreateLeadDTO> {
  optin_status?: boolean;
  optin_viewed_at?: string;
}

export interface LeadFilters {
  status?: Lead['status'];
  source?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}
