import { apiClient } from './client';
import { Paper } from '../types';

export const summaryApi = {
  getSummary: async (paperId: string) => {
    // Returns paper which contains pre-processed chunks and summary object
    const paper = await apiClient<Paper>(`/api/papers`);
    // Find the relevant paper
    const papers = Array.isArray(paper) ? paper : [paper];
    const match = papers.find((p: any) => p.id === paperId);
    if (!match) {
      throw new Error('Paper not found in library.');
    }
    return match.summary;
  },

  getInsights: async (paperId: string) => {
    const paper = await apiClient<Paper>(`/api/papers`);
    const papers = Array.isArray(paper) ? paper : [paper];
    const match = papers.find((p: any) => p.id === paperId);
    if (!match) {
      throw new Error('Paper not found in library.');
    }
    return match.insights;
  }
};
