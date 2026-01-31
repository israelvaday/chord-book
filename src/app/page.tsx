'use client'

import { useState, useEffect } from 'react'
import { getStats, getTop100, getArtists, getGenres, search, getSong, getArtistSongs, getRandom, Song, Artist, Genre, Stats } from '@/lib/api'
import { useStore } from '@/lib/store'
import { SongView } from '@/components/song-view'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Home, Flame, Mic2, Shuffle, Music, FileText, Guitar, 
  Search, Star, TrendingUp, Sparkles, Zap, User, ArrowLeft, X
} from 'lucide-react'

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [top100, setTop100] = useState<Song[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [searchResults, setSearchResults] = useState<Song[]>([])
  const [artistSongs, setArtistSongs] = useState<{ artist: string, songs: Song[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'home' | 'top100' | 'artists' | 'search' | 'artist' | 'song'>('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Song[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const { currentSong, setCurrentSong } = useStore()

  // Load initial data
  useEffect(() => {
    getStats().then(setStats)
    getGenres().then(setGenres)
  }, [])

  // Autocomplete using search API
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([])
      return
    }
    const timer = setTimeout(async () => {
      const results = await search(searchQuery, 'all', 8)
      setSuggestions(results)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Load view data
  const loadTop100 = async () => {
    setLoading(true)
    setView('top100')
    setCurrentSong(null)
    const songs = await getTop100('all')
    setTop100(songs)
    setLoading(false)
  }

  const loadArtists = async () => {
    setLoading(true)
    setView('artists')
    setCurrentSong(null)
    const data = await getArtists(200)
    setArtists(data)
    setLoading(false)
  }

  const doSearch = async (query: string) => {
    setLoading(true)
    setView('search')
    setCurrentSong(null)
    setSearchQuery(query)
    setShowSuggestions(false)
    const results = await search(query, 'all', 100)
    setSearchResults(results)
    setLoading(false)
  }

  const loadArtist = async (name: string) => {
    setLoading(true)
    setView('artist')
    setCurrentSong(null)
    setShowSuggestions(false)
    setSearchQuery('')
    const data = await getArtistSongs(name, 'all')
    setArtistSongs({ 
      artist: data.artist, 
      songs: data.all_results?.sort((a, b) => (b.rating || 0) - (a.rating || 0)) || [] 
    })
    setLoading(false)
  }

  const loadSong = async (song: Song) => {
    setLoading(true)
    const fullSong = await getSong(song.tab_id, song.content_type)
    setCurrentSong({ ...fullSong, content_type: song.content_type })
    setView('song')
    setLoading(false)
  }

  const loadRandom = async () => {
    setLoading(true)
    const song = await getRandom('all')
    if (song?.tab_id) {
      const fullSong = await getSong(song.tab_id, song.content_type || 'chord')
      setCurrentSong({ ...fullSong, content_type: song.content_type || 'chord' })
      setView('song')
    }
    setLoading(false)
  }

  const goHome = () => {
    setView('home')
    setCurrentSong(null)
    setSearchResults([])
    setArtistSongs(null)
    setSearchQuery('')
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.length >= 2) {
      doSearch(searchQuery)
    }
  }

  const hasSuggestions = suggestions.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 dark overflow-x-hidden overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button onClick={goHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0">
              <Guitar className="h-8 w-8 text-emerald-400 flex-shrink-0" />
              <span className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent truncate max-w-[120px] sm:max-w-none">
                Chord Book
              </span>
            </button>

            {stats && (
              <div className="hidden md:flex items-center gap-6">
                <div className="text-center">
                  <div className="font-bold text-emerald-400">{stats.total?.toLocaleString()}</div>
                  <div className="text-xs text-zinc-500">Songs</div>
                </div>
              </div>
            )}

            <Button onClick={loadRandom} className="bg-gradient-to-r from-emerald-500 to-purple-500 border-0 hover:opacity-90">
              <Shuffle className="h-4 w-4 mr-2" /> Random
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Search Bar - Always Visible on Main Pages */}
        {view !== 'song' && (
          <div className="mb-6 relative">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <Input
                placeholder="Search songs or artists..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true) }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleSearchKeyDown}
                className="pl-12 pr-4 py-6 text-lg bg-zinc-900/80 border-zinc-700 focus:border-emerald-500/50 rounded-2xl"
              />
              {searchQuery && (
                <button 
                  onClick={() => { setSearchQuery(''); setShowSuggestions(false) }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && searchQuery.length >= 2 && hasSuggestions && (
              <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-2xl mt-2 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-2 text-xs font-semibold text-zinc-400 bg-zinc-800/50 flex items-center gap-2">
                  <Music className="h-3 w-3" /> Results
                </div>
                {suggestions.map((song, i) => {
                  const isTab = song.tab_type?.toLowerCase().includes('tab') && song.tab_type !== 'Chords'
                  return (
                    <button
                      key={`${song.tab_id}-${i}`}
                      onClick={() => loadSong(song)}
                      className="w-full px-4 py-3 text-left hover:bg-emerald-500/10 transition-colors border-b border-zinc-800 last:border-0 flex items-center justify-between"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">{song.song}</div>
                        <div className="text-xs text-zinc-400 truncate">by {song.artist}</div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={isTab 
                          ? "border-amber-500/50 text-amber-400 ml-2 flex-shrink-0" 
                          : "border-emerald-500/50 text-emerald-400 ml-2 flex-shrink-0"
                        }
                      >
                        {isTab ? <><FileText className="h-3 w-3 mr-1" />Tab</> : <><Music className="h-3 w-3 mr-1" />Chords</>}
                      </Badge>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Navigation Tabs */}
        {view !== 'song' && (
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {[
              { key: 'home', icon: Home, label: 'Home', action: goHome },
              { key: 'top100', icon: Flame, label: 'Top 100', action: loadTop100 },
              { key: 'artists', icon: Mic2, label: 'Artists', action: loadArtists },
            ].map(tab => (
              <Button
                key={tab.key}
                variant={view === tab.key ? 'default' : 'ghost'}
                size="sm"
                onClick={tab.action}
                className={view === tab.key ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-400'}
              >
                <tab.icon className="h-4 w-4 mr-1" /> {tab.label}
              </Button>
            ))}
          </div>
        )}

        {/* HOME VIEW */}
        {view === 'home' && (
          <div className="space-y-8">
            {/* Hero */}
            <div className="text-center py-8">
              <Guitar className="h-16 w-16 mx-auto text-emerald-400 mb-4" />
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Free Chord Book
              </h1>
              <p className="text-lg text-zinc-400">
                Search {stats?.total?.toLocaleString() || '654,000'}+ guitar tabs and chords
              </p>
            </div>

            {/* Quick Start */}
            <div>
              <h3 className="font-semibold text-zinc-300 mb-4 flex items-center gap-2 justify-center">
                <Sparkles className="h-5 w-5 text-purple-400" /> Popular Songs
              </h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Wonderwall', 'Hotel California', 'Stairway to Heaven', 'Hallelujah', 'Wish You Were Here', 'Blackbird'].map(s => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="cursor-pointer hover:bg-emerald-500/20 transition-colors text-sm py-2 px-4"
                    onClick={() => doSearch(s)}
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Browse by Genre */}
            <div>
              <h3 className="font-semibold text-zinc-300 mb-4 flex items-center gap-2 justify-center">
                <Zap className="h-5 w-5 text-amber-400" /> Browse by Genre
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
                {genres.slice(0, 8).map((g, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    onClick={() => doSearch(g.query.split(' OR ')[0])}
                    className="justify-center py-6"
                  >
                    <span className="text-2xl mr-2">{g.icon}</span> {g.name.split(' ').pop()}
                  </Button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { icon: Search, title: 'Easy Search', desc: 'Find any song', color: 'text-emerald-400' },
                { icon: Music, title: 'Chord Diagrams', desc: 'Click to view', color: 'text-purple-400' },
                { icon: TrendingUp, title: 'Transpose', desc: 'Change key', color: 'text-amber-400' },
                { icon: Star, title: 'Favorites', desc: 'Save songs', color: 'text-rose-400' },
              ].map((card, i) => (
                <Card key={i} className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="pt-6 text-center">
                    <card.icon className={`h-8 w-8 mx-auto mb-3 ${card.color}`} />
                    <h3 className="font-bold text-white text-sm">{card.title}</h3>
                    <p className="text-xs text-zinc-400">{card.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TOP 100 VIEW */}
        {view === 'top100' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Flame className="h-6 w-6 text-orange-400" /> Top 100 Songs
            </h2>
            {loading ? <LoadingSkeleton /> : (
              <div className="grid gap-2">
                {top100.map((song, i) => (
                  <SongCard key={`${song.content_type}-${song.tab_id}`} song={song} rank={i + 1} onClick={() => loadSong(song)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ARTISTS VIEW */}
        {view === 'artists' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Mic2 className="h-6 w-6 text-purple-400" /> Popular Artists
            </h2>
            {loading ? <LoadingSkeleton /> : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {artists.map((a, i) => (
                  <button
                    key={i}
                    onClick={() => loadArtist(a.artist)}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-center group"
                  >
                    <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-purple-500/20 to-emerald-500/20 rounded-full flex items-center justify-center">
                      <Mic2 className="h-8 w-8 text-purple-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="font-medium text-white truncate">{a.artist}</div>
                    <div className="text-xs text-zinc-400">{a.song_count} songs</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SEARCH RESULTS VIEW */}
        {view === 'search' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Search className="h-6 w-6 text-emerald-400" /> 
              Results for "{searchQuery}"
              <span className="text-sm font-normal text-zinc-400 ml-2">({searchResults.length} found)</span>
            </h2>
            {loading ? <LoadingSkeleton /> : (
              <div className="grid gap-2">
                {searchResults.map((song, i) => (
                  <SongCard key={`${song.content_type}-${song.tab_id}`} song={song} onClick={() => loadSong(song)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ARTIST SONGS VIEW */}
        {view === 'artist' && artistSongs && (
          <div>
            <div className="mb-6 p-6 bg-gradient-to-r from-purple-500/10 to-emerald-500/10 rounded-2xl border border-purple-500/20">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/30 to-emerald-500/30 rounded-full flex items-center justify-center">
                  <Mic2 className="h-10 w-10 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{artistSongs.artist}</h2>
                  <p className="text-zinc-400">{artistSongs.songs.length} songs available</p>
                </div>
              </div>
            </div>
            {loading ? <LoadingSkeleton /> : (
              <div className="grid gap-2">
                {artistSongs.songs.map((song, i) => (
                  <SongCard key={`${song.content_type}-${song.tab_id}`} song={song} onClick={() => loadSong(song)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* SONG VIEW */}
        {view === 'song' && currentSong && (
          <div>
            <Button variant="ghost" onClick={() => setView(artistSongs ? 'artist' : 'home')} className="mb-4 text-zinc-400">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <SongView song={currentSong} onArtistClick={loadArtist} onSongClick={loadSong} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 p-4 text-center text-zinc-500 text-sm mt-8">
        🎸 Free Chord Book • Made with ❤️ for guitar lovers • 654K+ Songs
      </footer>
    </div>
  )
}

// Song Card Component
function SongCard({ song, rank, onClick }: { song: Song, rank?: number, onClick: () => void }) {
  const isChord = song.content_type === 'chord'
  
  return (
    <button
      onClick={onClick}
      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-left transition-all hover:bg-emerald-500/5 hover:border-emerald-500/30 flex items-center gap-4"
    >
      {rank && (
        <span className="text-lg font-bold text-amber-400 w-8">#{rank}</span>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="font-medium text-white truncate">{song.song}</div>
        <div className="text-sm text-zinc-400 truncate">{song.artist}</div>
      </div>
      
      <div className="flex items-center gap-3">
        <Badge 
          variant="outline" 
          className={isChord ? "border-emerald-500/50 text-emerald-400" : "border-amber-500/50 text-amber-400"}
        >
          {isChord ? <Music className="h-3 w-3 mr-1" /> : <FileText className="h-3 w-3 mr-1" />}
          {isChord ? 'Chord' : 'Tab'}
        </Badge>
        
        {song.rating && (
          <div className="flex items-center text-sm text-zinc-400">
            <Star className="h-4 w-4 text-amber-400 mr-1 fill-amber-400" />
            {song.rating.toFixed(1)}
          </div>
        )}
      </div>
    </button>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-xl">
          <Skeleton className="h-10 w-10 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
