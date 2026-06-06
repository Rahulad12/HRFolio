import { create } from 'zustand'

type ThemeMode = 'light' | 'dark'

interface ThemeStore {
  mode: ThemeMode
  setThemeMode: (mode: ThemeMode) => void
  toggleThemeMode: () => void
}

const getInitialMode = (): ThemeMode => {
  const saved = localStorage.getItem('themeMode')
  return saved === 'dark' ? 'dark' : 'light'
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: getInitialMode(),
  setThemeMode: (mode) => {
    localStorage.setItem('themeMode', mode)
    set({ mode })
  },
  toggleThemeMode: () =>
    set((state) => {
      const mode = state.mode === 'light' ? 'dark' : 'light'
      localStorage.setItem('themeMode', mode)
      return { mode }
    }),
}))
