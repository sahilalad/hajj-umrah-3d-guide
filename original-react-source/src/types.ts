export type Language = 'en' | 'gu';

export interface LocalizedText {
  en: string;
  gu: string;
}

export interface Chapter {
  id: string;
  number: string;
  title: LocalizedText;
  bookPage: number;
  sourcePdfPage: number;
  category: 'foundation' | 'rites' | 'rules' | 'days' | 'special' | 'ziyarah' | 'duas';
  summary?: LocalizedText;
  subtopics?: { title: LocalizedText; bookPage: number }[];
}

export interface JourneyStep {
  id: string;
  order: number;
  title: LocalizedText;
  place: LocalizedText;
  description: LocalizedText;
  instructions: LocalizedText[];
  duaIds?: string[];
  chapterIds?: string[];
  visual: 'miqat' | 'kaaba' | 'tawaf' | 'sai' | 'mina' | 'arafah' | 'muzdalifah' | 'jamarat' | 'halq' | 'complete';
}

export interface Dua {
  id: string;
  title: LocalizedText;
  category: 'quran' | 'travel' | 'ihram' | 'tawaf' | 'sai' | 'hajj-days' | 'general';
  arabic: string;
  transliteration: string;
  guPronunciation: string;
  meaning: LocalizedText;
  source: LocalizedText;
  bookPage?: number;
  verification: 'book-reference' | 'verified' | 'review';
}

export interface AppState {
  language: Language;
  completedSteps: string[];
  bookmarks: string[];
  favoriteDuas: string[];
  notes: Record<string, string>;
  fontScale: number;
  audioRate: number;
}
