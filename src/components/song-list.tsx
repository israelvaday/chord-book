'use client'

import { Song } from '@/lib/api'
import { useStore } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import { Star, Music, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  songs: Song[]
  showRank?: boolean
  onSelect: (song: Song) => void
}

export function SongList({ songs, showRank = false, onSelect }: Props) {
  const { currentSong } = useStore()

  if (songs.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-400">
        <Music className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No songs found</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-zinc-800/50">
      {songs.map((song, i) => {
        const isActive = currentSong?.tab_id === song.tab_id
        const isChord = song.content_type === 'chord'
        
        return (
          <button
            key={`${song.content_type}-${song.tab_id}`}
            onClick={() => onSelect(song)}
            className={cn(
              "w-full px-4 py-3 text-left transition-all hover:bg-emerald-500/5",
              isActive && "bg-emerald-500/10 border-l-4 border-emerald-500"
            )}
          >
            <div className="flex items-center gap-3">
              {showRank && (
                <span className="text-sm font-bold text-amber-400 w-8">#{i + 1}</span>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">{song.song}</div>
                <div className="text-xs text-zinc-400 truncate">{song.artist}</div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs",
                    isChord ? "border-emerald-500/50 text-emerald-400" : "border-amber-500/50 text-amber-400"
                  )}
                >
                  {isChord ? <Music className="h-3 w-3 mr-1" /> : <FileText className="h-3 w-3 mr-1" />}
                  {isChord ? 'Chord' : 'Tab'}
                </Badge>
                
                {song.rating && (
                  <div className="flex items-center text-xs text-zinc-400">
                    <Star className="h-3 w-3 text-amber-400 mr-1 fill-amber-400" />
                    {song.rating.toFixed(1)}
                  </div>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
