import { apiClient } from './client';
import { Paper, Folder } from '../types';

export const papersApi = {
  getAll: () => apiClient<Paper[]>('/api/papers'),
  
  create: (data: {
    title: string;
    authors?: string;
    journal?: string;
    year?: number;
    folderId?: string | null;
    rawContent?: string;
    fileType?: string;
    size?: string;
    userId?: string;
  }) => apiClient<Paper>('/api/papers', {
    method: 'POST',
    body: data
  }),

  update: (id: string, updates: Partial<Paper>) => apiClient<Paper>(`/api/papers/${id}`, {
    method: 'PUT',
    body: updates
  }),

  delete: (id: string) => apiClient<{ success: boolean }>(`/api/papers/${id}`, {
    method: 'DELETE'
  }),

  getFolders: () => apiClient<Folder[]>('/api/folders'),

  createFolder: (folder: { name: string; description: string; color: string; userId: string }) => 
    apiClient<Folder>('/api/folders', {
      method: 'POST',
      body: folder
    }),

  deleteFolder: (id: string) => apiClient<{ success: boolean }>(`/api/folders/${id}`, {
    method: 'DELETE'
  })
};
