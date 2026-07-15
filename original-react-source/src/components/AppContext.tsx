import { createContext, useContext, type ReactNode } from 'react';
import { useLocalAppState } from '../hooks/useLocalAppState';

type ContextValue = ReturnType<typeof useLocalAppState>;
const AppContext = createContext<ContextValue | null>(null);

export function AppProvider({children}:{children:ReactNode}) {
  const value = useLocalAppState();
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used inside AppProvider');
  return value;
}
