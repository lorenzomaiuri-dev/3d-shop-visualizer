import { create } from 'zustand'
import { initDatabase } from '../services/database'

interface AppState {
  isDbReady: boolean
  isLoading: boolean
  error: string | null
  initialize: () => Promise<void>
}

export const useAppStore = create<AppState>((set) => ({
  isDbReady: false,
  isLoading: false,
  error: null,

  initialize: async () => {
    set({ isLoading: true, error: null })
    try {
      await initDatabase()
      set({ isDbReady: true, isLoading: false })
    } catch (err) {
      console.error('App initialization error:', err)
      set({ error: (err as Error).message, isLoading: false })
    }
  },
}))
