import { useEffect, useMemo, useState } from 'react';
import type { AppState, Language } from '../types';

const STORAGE_KEY = 'manasik-3d-state-v1';
const defaults: AppState = {
  language: 'en',
  completedSteps: [],
  bookmarks: [],
  favoriteDuas: [],
  notes: {},
  fontScale: 1,
  audioRate: 1
};

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
}

export function useLocalAppState() {
  const [state, setState] = useState<AppState>(load);
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(state)), [state]);

  return useMemo(() => ({
    state,
    setLanguage: (language: Language) => setState(s => ({...s, language})),
    toggleCompleted: (id: string) => setState(s => ({...s, completedSteps: s.completedSteps.includes(id) ? s.completedSteps.filter(x => x !== id) : [...s.completedSteps,id]})),
    toggleBookmark: (id: string) => setState(s => ({...s, bookmarks: s.bookmarks.includes(id) ? s.bookmarks.filter(x => x !== id) : [...s.bookmarks,id]})),
    toggleFavoriteDua: (id: string) => setState(s => ({...s, favoriteDuas: s.favoriteDuas.includes(id) ? s.favoriteDuas.filter(x => x !== id) : [...s.favoriteDuas,id]})),
    setNote: (id: string, value: string) => setState(s => ({...s, notes: {...s.notes,[id]:value}})),
    setFontScale: (fontScale: number) => setState(s => ({...s,fontScale})),
    setAudioRate: (audioRate: number) => setState(s => ({...s,audioRate})),
    replaceState: (next: AppState) => setState({...defaults,...next}),
    reset: () => setState(defaults)
  }), [state]);
}
