import { apiClient } from './client';
import { ChatSession, Message } from '../types';

export const chatApi = {
  getSessions: (paperId?: string) => {
    const url = paperId ? `/api/chats?paperId=${paperId}` : '/api/chats';
    return apiClient<ChatSession[]>(url);
  },

  createSession: (paperId: string, title?: string) => apiClient<ChatSession>('/api/chats', {
    method: 'POST',
    body: { paperId, title }
  }),

  sendMessage: (sessionId: string, text: string, userId?: string) => apiClient<Message>(`/api/chats/${sessionId}/messages`, {
    method: 'POST',
    body: { text, userId }
  })
};
