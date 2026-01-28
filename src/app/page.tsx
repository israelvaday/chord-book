'use client'

import { useState, useEffect } from 'react'
import { getStats, getTop100, getArtists, getGenres, search, getSong, getArtistSongs, getRandom, Song, Artist, Genre, Stats } from '@/lib/api'
import { useStore } from '@/lib/store'
import { SearchBar } from '@/components/search-bar'
import { SongList } from '@/components/song-list'
import { SongView } from '@/components/song-view'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Home, Flame, Mic2, Menu, Shuffle, Music, FileText, Guitar, 
  Search, Star, TrendingUp, Sparkles, Zap
} from 'lucide-react'

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [top100, setTop100] = useState<Song[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [searchResults, setSearchResults] = useState<Song[]>([])
  const [artistSongs, setArtistSongs] = useState<{ artist: string, songs: Song[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'home' | 'top100' | 'artists' | 'search' | 'artist'>('home')
  
  const { currentSong, setCurrentSong, filter, setFilter, sidebarOpen, setSidebarOpen } = useStore()

  // Load initial data
  useEffect(() => {
    getStats().then(setStats)
    getGenres().then(setGenres)
  }, [])

  // Load view data
  const loadTop100 = async () => {
    setLoading(true)
    setView('top100')
    const songs = await getTop100(filter)
    setTop100(songs)
    setLoading(false)
  }

  const loadArtists = async () => {
    setLoading(true)
    setView('artists')
    const data = await getArtists(100)
    setArtists(data)
    setLoading(false)
  }

  const doSearch = async (query: string) => {
    setLoading(true)
    setView('search')
    const results = await search(query, filter)
    setSearchResults(results)
    setLoading(false)
  }

  const loadArtist = async (name: string) => {
    setLoading(true)
    setView('artist')
    const data = await getArtistSongs(name, filter)
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
    setLoading(false)
    setSidebarOpen(false)
  }

  const loadRandom = async () => {
    setLoading(true)
    const song = await getRandom(filter)
    if (song?.tab_id) {
      const fullSong = await getSong(song.tab_id, song.content_type || 'chord')
      setCurrentSong({ ...fullSong, content_type: song.content_type || 'chord' })
    }
    setLoading(false)
  }

  const goHome = () => {
    setView('home')
    setCurrentSong(null)
    setSearchResults([])
    setArtistSongs(null)
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Search */}
      <div className="p-4 border-b border-zinc-800">
        <SearchBar 
          onSearch={doSearch} 
          onSelectArtist={loadArtist}
          onSelectSong={doSearch}
        />
      </div>

      {/* Filter */}
      <div className="flex gap-2 p-4 border-b border-zinc-800">
        {(['all', 'chords', 'tabs'] as const).map(f => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className="flex-1"
          >
            {f === 'all' ? 'All' : f === 'chords' ? <><Music className="h-3 w-3 mr-1" />Chords</> : <><FileText className="h-3 w-3 mr-1" />Tabs</>}
          </Button>
        ))}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        {view === 'home' && (
          <div className="p-4 space-y-6">
            <div>
              <h3 className="font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" /> Browse by Genre
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {genres.slice(0, 8).map((g, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    onClick={() => doSearch(g.query.split(' OR ')[0])}
                    className="justify-start text-xs"
                  >
                    {g.icon} {g.name.split(' ').pop()}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" /> Quick Start
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Wonderwall', 'Hotel California', 'Stairway to Heaven', 'Hallelujah'].map(s => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="cursor-pointer hover:bg-emerald-500/20 transition-colors"
                    onClick={() => doSearch(s)}
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'top100' && (
          loading ? <LoadingSkeleton /> : <SongList songs={top100} showRank onSelect={loadSong} />
        )}

        {view === 'artists' && (
          loading ? <LoadingSkeleton /> : (
            <div className="divide-y divide-zinc-800/50">
              {artists.map((a, i) => (
                <button
                  key={i}
                  onClick={() => loadArtist(a.artist)}
                  className="w-full px-4 py-3 text-left hover:bg-purple-500/5 transition-colors flex items-center gap-3"
                >
                  <span className="font-bold text-purple-400 text-sm w-8">#{i + 1}</span>
                  <div className="flex-1">
                    <div className="font-medium text-white">{a.artist}</div>
                    <div className="text-xs text-zinc-400">{a.song_count} songs</div>
                  </div>
                </button>
              ))}
            </div>
          )
        )}

        {view === 'search' && (
          loading ? <LoadingSkeleton /> : <SongList songs={searchResults} onSelect={loadSong} />
        )}

        {view === 'artist' && artistSongs && (
          <>
            <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-purple-500/10 border-b border-zinc-800">
              <h3 className="font-bold text-xl text-white flex items-center gap-2">
                <Mic2 className="h-5 w-5 text-purple-400" /> {artistSongs.artist}
              </h3>
              <p className="text-sm text-zinc-400 mt-1">{artistSongs.songs.length} songs</p>
            </div>
            {loading ? <LoadingSkeleton /> : <SongList songs={artistSongs.songs} onSelect={loadSong} />}
          </>
        )}
      </ScrollArea>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 dark overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 bg-zinc-950 border-zinc-800">
                <Sidebar />
              </SheetContent>
            </Sheet>
            
            <button onClick={goHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Guitar className="h-8 w-8 text-emerald-400" />
              <span className="font-bold text-xl hidden sm:inline bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
                Chord Book
              </span>
            </button>
          </div>

          {stats && (
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="font-bold text-emerald-400">{stats.total?.toLocaleString()}</div>
                <div className="text-xs text-zinc-500">Songs</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-400">{stats.tabs?.toLocaleString()}</div>
                <div className="text-xs text-zinc-500">Tabs</div>
              </div>
            </div>
          )}

          <Button onClick={loadRandom} className="bg-gradient-to-r from-emerald-500 to-purple-500 border-0 hover:opacity-90">
            <Shuffle className="h-4 w-4 mr-2" /> Random
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-2 p-2 border-t border-zinc-800/50">
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
              className={view === tab.key ? 'bg-emerald-500/20 text-emerald-400' : ''}
            >
              <tab.icon className="h-4 w-4 mr-1" /> {tab.label}
            </Button>
          ))}
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 border-r border-zinc-800 h-[calc(100vh-7rem)] sticky top-28">
          <Sidebar />
        </aside>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 min-h-[calc(100vh-7rem)] overflow-x-hidden">
          {currentSong ? (
            <SongView song={currentSong} onArtistClick={loadArtist} />
          ) : (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-lg px-4">
                <Guitar className="h-20 w-20 mx-auto text-emerald-400 mb-6" />
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Free Chord Book
                </h1>
                <p className="text-lg text-zinc-400 mb-8">
                  Search {stats?.total?.toLocaleString() || '654,000'}+ guitar tabs and chords
                </p>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto">
                  {[
                    { icon: Search, title: 'Easy Search', desc: 'Find any song', color: 'text-emerald-400' },
                    { icon: Music, title: 'Chord Diagrams', desc: 'Finger guides', color: 'text-purple-400' },
                    { icon: TrendingUp, title: 'Transpose', desc: 'Change key', color: 'text-amber-400' },
                    { icon: Star, title: 'Favorites', desc: 'Save songs', color: 'text-rose-400' },
                  ].map((card, i) => (
                    <Card key={i} className="bg-zinc-900/50 border-zinc-800 hover:border-emerald-500/30 transition-all hover:scale-105 cursor-pointer">
                      <CardContent className="pt-6 px-4">
                        <card.icon className={`h-8 w-8 mb-3 ${card.color}`} />
                        <h3 className="font-bold text-white text-sm">{card.title}</h3>
                        <p className="text-xs text-zinc-400">{card.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 p-4 text-center text-zinc-500 text-sm">
        🎸 Free Chord Book • Made with ❤️ for guitar lovers • 654K+ Songs
      </footer>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="p-4 space-y-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
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
