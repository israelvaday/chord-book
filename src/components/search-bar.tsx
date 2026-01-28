'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Music, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { autocomplete } from '@/lib/api'
import { cn } from '@/lib/utils'

interface Props {
  onSearch: (query: string) => void
  onSelectArtist: (artist: string) => void
  onSelectSong: (song: string) => void
}

export function SearchBar({ onSearch, onSelectArtist, onSelectSong }: Props) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<{ artists: string[], songs: { song: string, artist: string }[] }>({ artists: [], songs: [] })
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions({ artists: [], songs: [] })
      return
    }
    const timer = setTimeout(async () => {
      const data = await autocomplete(query)
      setSuggestions(data)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.length >= 2) {
      onSearch(query)
      setOpen(false)
    }
  }

  const hasResults = suggestions.artists.length > 0 || suggestions.songs.length > 0

  return (
    <div ref={ref} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <Input
          placeholder="Search songs, artists..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 bg-zinc-900/50 border-zinc-700 focus:border-emerald-500/50 h-11"
        />
      </div>

      {open && query.length >= 2 && hasResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden max-h-[60vh] overflow-y-auto">
          {suggestions.artists.length > 0 && (
            <>
              <div className="px-3 py-2 text-xs font-semibold text-zinc-400 bg-zinc-800/50 flex items-center gap-2">
                <User className="h-3 w-3" /> Artists
              </div>
              {suggestions.artists.slice(0, 5).map((artist, i) => (
                <button
                  key={i}
                  onClick={() => { onSelectArtist(artist); setOpen(false); setQuery('') }}
                  className="w-full px-4 py-3 text-left hover:bg-emerald-500/10 transition-colors flex items-center justify-between border-b border-zinc-800 last:border-0"
                >
                  <span className="font-medium text-white">{artist}</span>
                  <span className="text-xs text-emerald-400">View all →</span>
                </button>
              ))}
            </>
          )}
          
          {suggestions.songs.length > 0 && (
            <>
              <div className="px-3 py-2 text-xs font-semibold text-zinc-400 bg-zinc-800/50 flex items-center gap-2">
                <Music className="h-3 w-3" /> Songs
              </div>
              {suggestions.songs.slice(0, 5).map((s, i) => (
                <button
                  key={i}
                  onClick={() => { onSelectSong(s.song); setOpen(false); setQuery(s.song) }}
                  className="w-full px-4 py-3 text-left hover:bg-purple-500/10 transition-colors border-b border-zinc-800 last:border-0"
                >
                  <div className="font-medium text-white">{s.song}</div>
                  <div className="text-xs text-zinc-400">by {s.artist}</div>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
