import { apiClient } from './client';
import { Quiz } from '../types';

export const quizApi = {
  getQuiz: (paperId: string) => apiClient<Quiz[]>(`/api/papers/${paperId}/quiz`),
  
  submitScore: (quizId: string, score: number, userId?: string) => apiClient<Quiz>(`/api/quizzes/${quizId}/score`, {
    method: 'PUT',
    body: { score, userId }
  })
};
