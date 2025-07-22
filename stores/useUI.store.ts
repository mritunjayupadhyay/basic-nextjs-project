import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  // Global UI state
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  activeTab: 'details' | 'communication';
  isPanelOpen: boolean;
  
  // Global loading states (if needed)
  globalLoading: boolean;
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setActiveTab: (tab: 'details' | 'communication') => void;
  setIsPanelOpen: (open: boolean) => void;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      sidebarOpen: true,
      theme: 'light',
      activeTab: 'details',
      isPanelOpen: false,
      globalLoading: false,
      
      setSidebarOpen: (sidebarOpen) => 
        set({ sidebarOpen }, false, 'setSidebarOpen'),
      
      setTheme: (theme) => 
        set({ theme }, false, 'setTheme'),
      
      setActiveTab: (activeTab) => 
        set({ activeTab }, false, 'setActiveTab'),
      
      setIsPanelOpen: (isPanelOpen) => 
        set({ isPanelOpen }, false, 'setIsPanelOpen'),
      
      setGlobalLoading: (globalLoading) => 
        set({ globalLoading }, false, 'setGlobalLoading'),
    }),
    { name: 'ui-store' }
  )
);