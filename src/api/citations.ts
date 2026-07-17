import { apiClient } from './client';
import { SavedCitation } from '../types';

export const citationsApi = {
  getAll: () => apiClient<SavedCitation[]>('/api/citations'),

  save: (citation: {
    paperId: string;
    paperTitle: string;
    format: 'apa' | 'mla' | 'chicago' | 'harvard' | 'bibtex';
    citationText: string;
  }) => apiClient<SavedCitation>('/api/citations', {
    method: 'POST',
    body: citation
  }),

  delete: (id: string) => apiClient<{ success: boolean }>(`/api/citations/${id}`, {
    method: 'DELETE'
  })
};
