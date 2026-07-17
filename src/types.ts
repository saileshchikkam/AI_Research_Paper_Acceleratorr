export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'professor' | 'researcher' | 'engineer';
  avatar?: string;
  enrolledAt: string;
  username?: string;
  university?: string;
  department?: string;
  bio?: string;
}

export interface Paper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  abstract: string;
  folderId: string | null;
  isBookmarked: boolean;
  uploadedAt: string;
  fileType: string;
  size: string;
  content: string; // The full text content
  pages: string[]; // Segmented into pages
  citations: CitationData;
  readingProgress: number; // 0 to 100
  chunks?: any[];
  summary?: any;
  insights?: any;
}

export interface CitationData {
  apa: string;
  mla: string;
  chicago: string;
  harvard: string;
  bibtex: string;
}

export interface Folder {
  id: string;
  name: string;
  description: string;
  color: string; // Tailwind hex or class representation
  userId: string;
  createdAt: string;
}

export interface Source {
  title: string;
  snippet: string;
  page?: number;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: Source[];
}

export interface ChatSession {
  id: string;
  paperId: string | 'all'; // 'all' for comparative chat
  title: string;
  lastMessageAt: string;
  messages: Message[];
}

export interface Note {
  id: string;
  paperId: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  paperId: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  lastReviewed?: string;
  category?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  paperId: string;
  title: string;
  questions: QuizQuestion[];
  score?: number; // Last taken score
  takenAt?: string;
}

export interface LiteratureReview {
  id: string;
  title: string;
  papers: string[]; // Paper IDs
  synthesisTable: {
    heading: string;
    values: Record<string, string>; // paperId -> summary/value
  }[];
  summary: string;
  gapAnalysis: string;
  createdAt: string;
}

export interface SavedCitation {
  id: string;
  paperId: string;
  paperTitle: string;
  format: 'apa' | 'mla' | 'chicago' | 'harvard' | 'bibtex';
  citationText: string;
  savedAt: string;
}

export interface StudyActivity {
  id: string;
  userId: string;
  type: 'read' | 'chat' | 'quiz' | 'flashcard' | 'note';
  paperTitle: string;
  paperId?: string;
  detail: string;
  timestamp: string;
}

export interface DashboardMetrics {
  totalPapers: number;
  totalFolders: number;
  quizzesCompleted: number;
  flashcardsReviewed: number;
  readingHours: number;
  weeklyProgress: { day: string; minutes: number }[];
  recentActivity: StudyActivity[];
}
