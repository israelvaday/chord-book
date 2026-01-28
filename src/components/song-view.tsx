'use client'

import { useState, useEffect } from 'react'
import { Song, search, getArtistSongs } from '@/lib/api'
import { useStore } from '@/lib/store'
import { LyricsContent } from './lyrics-content'
import { TabContent } from './tab-content'
import { PlayerControls } from './player-controls'
import { ChordDiagram } from './chord-diagram'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Star, Users, ChevronRight, Music, Share2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  song: Song
  onArtistClick: (artist: string) => void
  onSongClick?: (song: Song) => void
}

export function SongView({ song, onArtistClick, onSongClick }: Props) {
  const { favorites, toggleFavorite, isFavorite } = useStore()
  const [suggestedSongs, setSuggestedSongs] = useState<Song[]>([])
  const [activeChord, setActiveChord] = useState<string | null>(null)

  const favorite = isFavorite(song.tab_id)
  const isChord = song.content_type === 'chord'
  const hasChordDiagrams = isChord && song.chord_diagrams && Object.keys(song.chord_diagrams).length > 0

  // Load suggested songs from same artist
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const data = await getArtistSongs(song.artist, 'all')
        const otherSongs = (data.all_results || [])
          .filter(s => s.tab_id !== song.tab_id)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 6)
        setSuggestedSongs(otherSongs)
      } catch (e) {
        console.error('Failed to load suggestions', e)
      }
    }
    loadSuggestions()
  }, [song.artist, song.tab_id])

  const handleShare = async () => {
    const url = `${window.location.origin}/song/${song.tab_id}?type=${song.content_type}`
    if (navigator.share) {
      await navigator.share({ title: `${song.song} - ${song.artist}`, url })
    } else {
      await navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    }
  }

  const handleChordClick = (chord: string) => {
    if (hasChordDiagrams && song.chord_diagrams?.[chord]) {
      setActiveChord(chord)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
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

      {/* Chord Popup Modal */}
      {activeChord && hasChordDiagrams && song.chord_diagrams?.[activeChord] && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setActiveChord(null)}
        >
          <div 
            className="relative bg-zinc-900 rounded-2xl p-6 border border-emerald-500/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveChord(null)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800"
            >
              <X className="h-6 w-6" />
            </button>
            <ChordDiagram chord={activeChord} diagram={song.chord_diagrams[activeChord]} size="large" />
          </div>
        </div>
      )}

      {/* Lyrics/Tab Content - Full Height, No Max Height */}
      <Card className="bg-zinc-900/80 border-emerald-500/20">
        <CardHeader className="border-b border-zinc-800 bg-emerald-500/5">
          <CardTitle className="flex items-center gap-2 text-emerald-400">
            <Music className="h-5 w-5" />
            {isChord ? 'Lyrics & Chords' : 'Guitar Tab'}
            {isChord && hasChordDiagrams && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Click chords to see diagrams
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isChord ? (
            <LyricsContent 
              content={song.content || ''} 
              onChordClick={hasChordDiagrams ? handleChordClick : undefined}
              chordDiagrams={song.chord_diagrams}
            />
          ) : (
            <TabContent content={song.content || ''} />
          )}
        </CardContent>
      </Card>

      {/* Suggested Songs from Same Artist */}
      {suggestedSongs.length > 0 && (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Music className="h-5 w-5" />
              More from {song.artist}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {suggestedSongs.map((s) => (
                <button
                  key={`${s.content_type}-${s.tab_id}`}
                  onClick={() => onSongClick?.(s)}
                  className="bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-left transition-all hover:bg-purple-500/10 hover:border-purple-500/30"
                >
                  <div className="font-medium text-white truncate">{s.song}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        s.content_type === 'chord' ? "border-emerald-500/50 text-emerald-400" : "border-amber-500/50 text-amber-400"
                      )}
                    >
                      {s.content_type === 'chord' ? 'Chord' : 'Tab'}
                    </Badge>
                    {s.rating && (
                      <span className="text-xs text-zinc-400 flex items-center">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400 mr-1" />
                        {s.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
