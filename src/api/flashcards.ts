import { apiClient } from './client';
import { Flashcard } from '../types';

export const flashcardsApi = {
  getCards: (paperId: string) => apiClient<Flashcard[]>(`/api/papers/${paperId}/flashcards`),

  updateDifficulty: (cardId: string, difficulty: 'easy' | 'medium' | 'hard' | null) => 
    apiClient<Flashcard>(`/api/flashcards/${cardId}/difficulty`, {
      method: 'PUT',
      body: { difficulty }
    })
};
