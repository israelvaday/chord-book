import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Song } from './api'

interface AppState {
  // Current song
  currentSong: Song | null
  setCurrentSong: (song: Song | null) => void
  
  // Favorites
  favorites: number[]
  toggleFavorite: (id: number) => void
  isFavorite: (id: number) => boolean
  
  // Settings
  fontSize: number
  setFontSize: (size: number) => void
  showChords: boolean
  setShowChords: (show: boolean) => void
  autoScroll: boolean
  setAutoScroll: (scroll: boolean) => void
  transpose: number
  setTranspose: (t: number) => void
  
  // Filter
  filter: 'all' | 'tabs' | 'chords'
  setFilter: (f: 'all' | 'tabs' | 'chords') => void
  
  // Sidebar
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Current song
      currentSong: null,
      setCurrentSong: (song) => set({ currentSong: song, transpose: 0 }),
      
      // Favorites
      favorites: [],
      toggleFavorite: (id) => set((state) => ({
        favorites: state.favorites.includes(id)
          ? state.favorites.filter(f => f !== id)
          : [...state.favorites, id]
      })),
      isFavorite: (id) => get().favorites.includes(id),
      
      // Settings
      fontSize: 15,
      setFontSize: (size) => set({ fontSize: Math.max(12, Math.min(24, size)) }),
      showChords: true,
      setShowChords: (show) => set({ showChords: show }),
      autoScroll: false,
      setAutoScroll: (scroll) => set({ autoScroll: scroll }),
      transpose: 0,
      setTranspose: (t) => set({ transpose: ((t % 12) + 12) % 12 }),
      
      // Filter
      filter: 'all',
      setFilter: (f) => set({ filter: f }),
      
      // Sidebar
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'chord-book-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        fontSize: state.fontSize,
        showChords: state.showChords,
      }),
    }
  )
)
