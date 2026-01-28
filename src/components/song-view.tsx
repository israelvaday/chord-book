'use client'

import { useRef, useEffect } from 'react'
import { Song } from '@/lib/api'
import { useStore } from '@/lib/store'
import { LyricsContent } from './lyrics-content'
import { PlayerControls } from './player-controls'
import { ChordDiagram } from './chord-diagram'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Star, Users, ChevronRight, Music, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  song: Song
  onArtistClick: (artist: string) => void
}

export function SongView({ song, onArtistClick }: Props) {
  const { autoScroll, favorites, toggleFavorite, isFavorite } = useStore()
  const contentRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<NodeJS.Timeout | null>(null)

  const favorite = isFavorite(song.tab_id)
  const isChord = song.content_type === 'chord'
  const hasChordDiagrams = isChord && song.chord_diagrams && Object.keys(song.chord_diagrams).length > 0

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && contentRef.current) {
      scrollRef.current = setInterval(() => {
        contentRef.current?.scrollBy({ top: 1, behavior: 'smooth' })
      }, 50)
    } else if (scrollRef.current) {
      clearInterval(scrollRef.current)
    }
    return () => {
      if (scrollRef.current) clearInterval(scrollRef.current)
    }
  }, [autoScroll])

  const handleShare = async () => {
    const url = `${window.location.origin}/song/${song.tab_id}?type=${song.content_type}`
    if (navigator.share) {
      await navigator.share({ title: `${song.song} - ${song.artist}`, url })
    } else {
      await navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-emerald-500/10 to-purple-500/10 border-emerald-500/20">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">{song.song}</h1>
              <button 
                onClick={() => onArtistClick(song.artist)}
                className="text-emerald-400 hover:text-emerald-300 text-lg transition-colors inline-flex items-center gap-1"
              >
                by {song.artist} <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={favorite ? "default" : "outline"}
                size="icon"
                onClick={() => toggleFavorite(song.tab_id)}
                className={cn(favorite && "bg-rose-500 hover:bg-rose-600")}
              >
                <Heart className={cn("h-4 w-4", favorite && "fill-white")} />
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge 
              variant="outline" 
              className={cn(
                "text-sm",
                isChord ? "border-emerald-500/50 text-emerald-400" : "border-amber-500/50 text-amber-400"
              )}
            >
              <Music className="h-3 w-3 mr-1" />
              {isChord ? 'Chords' : 'Tab'}
            </Badge>
            
            {song.rating && (
              <Badge variant="outline" className="text-sm">
                <Star className="h-3 w-3 mr-1 text-amber-400 fill-amber-400" />
                {song.rating.toFixed(1)}
              </Badge>
            )}
            
            {song.votes && (
              <Badge variant="outline" className="text-sm text-zinc-400">
                <Users className="h-3 w-3 mr-1" />
                {song.votes.toLocaleString()} votes
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <PlayerControls />

      {/* Chord Diagrams */}
      {hasChordDiagrams && (
        <details className="bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden">
          <summary className="p-4 cursor-pointer text-white font-semibold hover:bg-zinc-800/30 transition-colors flex items-center gap-2">
            <Music className="h-5 w-5 text-emerald-400" />
            Chord Diagrams ({Object.keys(song.chord_diagrams!).length}) — Click to expand
          </summary>
          <div className="p-4 pt-0 border-t border-zinc-800">
            <div className="flex flex-wrap gap-4 pt-4">
              {Object.entries(song.chord_diagrams!).map(([chord, diagram]) => (
                diagram && <ChordDiagram key={chord} chord={chord} diagram={diagram} />
              ))}
            </div>
          </div>
        </details>
      )}

      {/* Lyrics Content */}
      <Card className="bg-zinc-900/80 border-emerald-500/20">
        <CardHeader className="border-b border-zinc-800 bg-emerald-500/5">
          <CardTitle className="flex items-center gap-2 text-emerald-400">
            <Music className="h-5 w-5" />
            Lyrics & Chords
            <Badge variant="secondary" className="ml-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1 inline-block" />
              = Chord
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent ref={contentRef} className="pt-6 overflow-y-auto max-h-[60vh]">
          <LyricsContent content={song.content || ''} />
        </CardContent>
      </Card>
    </div>
  )
}
