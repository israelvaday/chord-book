import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'

const API_BASE = 'https://api-production-da6a.up.railway.app'

// Detect if text contains Hebrew characters
function isHebrew(text) {
  return /[\u0590-\u05FF]/.test(text)
}

// Parse content and highlight chords with beautiful styling
function FormattedContent({ content, fontSize, showChords, onChordClick }) {
  if (!content) return <span className="text-gray-400">No content available</span>
  
  const containsHebrew = isHebrew(content)
  
  const parseContent = (text) => {
    // Handle [tab]...[/tab] sections
    let parsed = text.replace(/\[tab\]([\s\S]*?)\[\/tab\]/g, '$1')
    
    // Highlight chords - support both [ch]...[/ch] and [CHORD] formats
    const parts = []
    let lastIndex = 0
    
    // Combined regex for both formats: [ch]Chord[/ch] or [Am] [G] etc.
    const chordRegex = /\[ch\](.*?)\[\/ch\]|\[([A-Ga-g][#b]?(?:m|maj|min|dim|aug|sus|add|7|9|11|13|M)*[0-9]*(?:\/[A-G][#b]?)?)\]/g
    let match
    
    while ((match = chordRegex.exec(parsed)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: parsed.slice(lastIndex, match.index) })
      }
      // match[1] is from [ch]...[/ch], match[2] is from [CHORD]
      const chord = match[1] || match[2]
      parts.push({ type: 'chord', content: chord })
      lastIndex = match.index + match[0].length
    }
    if (lastIndex < parsed.length) {
      parts.push({ type: 'text', content: parsed.slice(lastIndex) })
    }
    
    return parts
  }
  
  const parts = parseContent(content)
  
  return (
    <pre style={{ 
      fontSize: `${fontSize}px`, 
      lineHeight: '2',
      fontFamily: containsHebrew ? '"David", "Noto Sans Hebrew", "Arial Hebrew", sans-serif' : '"SF Mono", "Fira Code", Monaco, Consolas, monospace',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      overflowWrap: 'anywhere',
      margin: 0,
      maxWidth: '100%',
      overflow: 'hidden',
      direction: containsHebrew ? 'rtl' : 'ltr',
      textAlign: containsHebrew ? 'right' : 'left'
    }}>
      {parts.map((part, i) => 
        part.type === 'chord' ? (
          showChords ? (
            <span 
              key={i} 
              className="chord-highlight cursor-pointer hover:scale-110 transition-transform"
              onClick={() => onChordClick && onChordClick(part.content)}
              style={{
                color: '#00FF88',
                fontWeight: '800',
                backgroundColor: 'rgba(0, 255, 136, 0.2)',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(0, 255, 136, 0.4)',
                textShadow: '0 0 12px rgba(0, 255, 136, 0.8)',
                display: 'inline-block',
                margin: '1px 2px',
                direction: 'ltr'  // Chords always LTR
              }}
              title="Click for chord diagram"
            >
              {part.content}
            </span>
          ) : null
        ) : (
          <span key={i} style={{ color: '#ffffff' }}>{part.content}</span>
        )
      )}
    </pre>
  )
}

// Chord Diagram - Enhanced with glow effect
function ChordDiagram({ chord, diagram, isSelected, onClick }) {
  if (!diagram) return null
  const { frets, barres, baseFret } = diagram
  
  return (
    <div 
      onClick={onClick}
      className={`bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-xl shadow-lg border transition-all hover:scale-105 cursor-pointer ${
        isSelected ? 'border-cyan-400 ring-2 ring-cyan-400/50' : 'border-cyan-500/30 hover:border-cyan-400/60'
      }`}
    >
      <div className="text-center font-bold text-cyan-400 mb-3 text-lg">{chord}</div>
      <svg width="90" height="110" viewBox="0 0 100 120" className="mx-auto drop-shadow-lg">
        {baseFret === 1 ? (
          <rect x="15" y="20" width="70" height="5" fill="#e2e8f0" rx="2" />
        ) : (
          <text x="5" y="35" fill="#94a3b8" fontSize="11" fontWeight="bold">{baseFret}fr</text>
        )}
        {[0,1,2,3,4,5].map(i => (
          <line key={`s${i}`} x1={15+i*14} y1="22" x2={15+i*14} y2="100" stroke="#475569" strokeWidth={i<3?2:1} />
        ))}
        {[0,1,2,3,4].map(i => (
          <line key={`f${i}`} x1="15" y1={22+i*20} x2="85" y2={22+i*20} stroke="#334155" />
        ))}
        {barres?.map((b,i) => (
          <rect key={`b${i}`} x="12" y={22+(b-baseFret)*20+5} width="76" height="14" rx="7" fill="#22d3ee" opacity="0.8" />
        ))}
        {frets.map((f,i) => {
          if (f === -1) return <text key={i} x={15+i*14} y="15" textAnchor="middle" fill="#f87171" fontSize="14" fontWeight="bold">✕</text>
          if (f === 0) return <circle key={i} cx={15+i*14} cy="12" r="5" fill="none" stroke="#22d3ee" strokeWidth="2" />
          return <circle key={i} cx={15+i*14} cy={22+(f-0.5)*20} r="7" fill="#22d3ee" className="drop-shadow-glow" />
        })}
      </svg>
    </div>
  )
}

// Common chord diagrams database for chords not in song data
const COMMON_CHORD_DIAGRAMS = {
  'C': { frets: [-1, 3, 2, 0, 1, 0], barres: [], baseFret: 1 },
  'D': { frets: [-1, -1, 0, 2, 3, 2], barres: [], baseFret: 1 },
  'E': { frets: [0, 2, 2, 1, 0, 0], barres: [], baseFret: 1 },
  'G': { frets: [3, 2, 0, 0, 0, 3], barres: [], baseFret: 1 },
  'A': { frets: [-1, 0, 2, 2, 2, 0], barres: [], baseFret: 1 },
  'Am': { frets: [-1, 0, 2, 2, 1, 0], barres: [], baseFret: 1 },
  'Em': { frets: [0, 2, 2, 0, 0, 0], barres: [], baseFret: 1 },
  'Dm': { frets: [-1, -1, 0, 2, 3, 1], barres: [], baseFret: 1 },
  'F': { frets: [1, 3, 3, 2, 1, 1], barres: [1], baseFret: 1 },
  'Bm': { frets: [-1, 2, 4, 4, 3, 2], barres: [2], baseFret: 1 },
  'B': { frets: [-1, 2, 4, 4, 4, 2], barres: [2], baseFret: 1 },
  'C#m': { frets: [-1, 4, 6, 6, 5, 4], barres: [4], baseFret: 1 },
  'F#m': { frets: [2, 4, 4, 2, 2, 2], barres: [2], baseFret: 1 },
  'G#m': { frets: [4, 6, 6, 4, 4, 4], barres: [4], baseFret: 1 },
  'A7': { frets: [-1, 0, 2, 0, 2, 0], barres: [], baseFret: 1 },
  'E7': { frets: [0, 2, 0, 1, 0, 0], barres: [], baseFret: 1 },
  'D7': { frets: [-1, -1, 0, 2, 1, 2], barres: [], baseFret: 1 },
  'G7': { frets: [3, 2, 0, 0, 0, 1], barres: [], baseFret: 1 },
  'C7': { frets: [-1, 3, 2, 3, 1, 0], barres: [], baseFret: 1 },
  'Cmaj7': { frets: [-1, 3, 2, 0, 0, 0], barres: [], baseFret: 1 },
  'Fmaj7': { frets: [-1, -1, 3, 2, 1, 0], barres: [], baseFret: 1 },
  'Bsus4': { frets: [-1, 2, 4, 4, 5, 2], barres: [2], baseFret: 1 },
  'Asus4': { frets: [-1, 0, 2, 2, 3, 0], barres: [], baseFret: 1 },
  'Dsus4': { frets: [-1, -1, 0, 2, 3, 3], barres: [], baseFret: 1 },
  'Esus4': { frets: [0, 2, 2, 2, 0, 0], barres: [], baseFret: 1 },
  'Emaj7': { frets: [0, 2, 1, 1, 0, 0], barres: [], baseFret: 1 },
  'Bm7': { frets: [-1, 2, 4, 2, 3, 2], barres: [2], baseFret: 1 }
}

// Chord Popup Modal
function ChordPopup({ chord, songDiagrams, onClose }) {
  if (!chord) return null
  
  // Get diagram from song data or common chords
  const diagram = songDiagrams?.[chord] || COMMON_CHORD_DIAGRAMS[chord]
  
  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-2xl border border-cyan-500/50 max-w-sm w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-cyan-400">{chord}</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center"
          >
            ✕
          </button>
        </div>
        
        {diagram ? (
          <div className="flex justify-center">
            <svg width="180" height="220" viewBox="0 0 100 120" className="drop-shadow-lg">
              {diagram.baseFret === 1 ? (
                <rect x="15" y="20" width="70" height="5" fill="#e2e8f0" rx="2" />
              ) : (
                <text x="5" y="35" fill="#94a3b8" fontSize="11" fontWeight="bold">{diagram.baseFret}fr</text>
              )}
              {[0,1,2,3,4,5].map(i => (
                <line key={`s${i}`} x1={15+i*14} y1="22" x2={15+i*14} y2="100" stroke="#475569" strokeWidth={i<3?2:1} />
              ))}
              {[0,1,2,3,4].map(i => (
                <line key={`f${i}`} x1="15" y1={22+i*20} x2="85" y2={22+i*20} stroke="#334155" />
              ))}
              {diagram.barres?.map((b,i) => (
                <rect key={`b${i}`} x="12" y={22+(b-diagram.baseFret)*20+5} width="76" height="14" rx="7" fill="#22d3ee" opacity="0.8" />
              ))}
              {diagram.frets.map((f,i) => {
                if (f === -1) return <text key={i} x={15+i*14} y="15" textAnchor="middle" fill="#f87171" fontSize="14" fontWeight="bold">✕</text>
                if (f === 0) return <circle key={i} cx={15+i*14} cy="12" r="5" fill="none" stroke="#22d3ee" strokeWidth="2" />
                return <circle key={i} cx={15+i*14} cy={22+(f-0.5)*20} r="7" fill="#22d3ee" className="drop-shadow-glow" />
              })}
            </svg>
          </div>
        ) : (
          <div className="text-center text-slate-400 py-8">
            <p className="text-4xl mb-4">🎸</p>
            <p>Diagram not available for this chord</p>
            <p className="text-sm mt-2">Try searching online for "{chord} guitar chord"</p>
          </div>
        )}
        
        <div className="mt-4 text-center text-slate-400 text-sm">
          Click outside or press ✕ to close
        </div>
      </div>
    </div>
  )
}

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [filter, setFilter] = useState('all')
  const [suggestions, setSuggestions] = useState({ artists: [], songs: [] })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [view, setView] = useState('home')
  const [top100, setTop100] = useState([])
  const [artists, setArtists] = useState([])
  const [genres, setGenres] = useState([])
  const [artistPage, setArtistPage] = useState(null)
  const [fontSize, setFontSize] = useState(15)
  const [showChords, setShowChords] = useState(true)
  const [autoScroll, setAutoScroll] = useState(false)
  const [selectedChord, setSelectedChord] = useState(null)
  const searchRef = useRef(null)
  const contentRef = useRef(null)
  const scrollIntervalRef = useRef(null)

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && contentRef.current) {
      scrollIntervalRef.current = setInterval(() => {
        contentRef.current?.scrollBy({ top: 1, behavior: 'smooth' })
      }, 50)
    } else {
      clearInterval(scrollIntervalRef.current)
    }
    return () => clearInterval(scrollIntervalRef.current)
  }, [autoScroll])

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    fetch(`${API_BASE}/stats`).then(r => r.json()).then(setStats).catch(console.error)
    fetch(`${API_BASE}/genres`).then(r => r.json()).then(d => setGenres(d.genres || [])).catch(console.error)
  }, [])

  const loadTop100 = async () => {
    setLoading(true)
    setView('top100')
    setSelected(null)
    try {
      const res = await fetch(`${API_BASE}/top100?type=${filter}`)
      const data = await res.json()
      setTop100(data.songs || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const loadArtists = async () => {
    setLoading(true)
    setView('artists')
    setSelected(null)
    try {
      const res = await fetch(`${API_BASE}/artists?limit=100`)
      const data = await res.json()
      setArtists(data.artists || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const doSearch = useCallback(async (q, f = filter) => {
    if (!q || q.length < 2) { setResults([]); setSuggestions({ artists: [], songs: [] }); return }
    setLoading(true)
    setView('search')
    try {
      const [sugRes, searchRes] = await Promise.all([
        fetch(`${API_BASE}/autocomplete?q=${encodeURIComponent(q)}&limit=5`),
        fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}&limit=50&type=${f}`)
      ])
      setSuggestions(await sugRes.json())
      setResults((await searchRes.json()).results || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [filter])

  const loadArtist = async (name) => {
    setLoading(true)
    setShowSuggestions(false)
    setSuggestions({ artists: [], songs: [] })
    setQuery('')
    setView('artist')
    setSelected(null)
    try {
      const res = await fetch(`${API_BASE}/artist/${encodeURIComponent(name)}?type=${filter}&sort=rating&limit=200`)
      const data = await res.json()
      if (data.all_results) {
        data.all_results.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.votes || 0) - (a.votes || 0))
      }
      setArtistPage(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => { if (query.length >= 2) doSearch(query, filter) }, 300)
    return () => clearTimeout(timer)
  }, [query, filter, doSearch])

  const loadItem = async (item) => {
    setLoading(true)
    setAutoScroll(false)
    try {
      const type = item.content_type === 'chord' ? 'chord' : 'tab'
      const res = await fetch(`${API_BASE}/${type}/${item.tab_id}`)
      setSelected({ ...(await res.json()), content_type: type })
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const loadRandom = async () => {
    setLoading(true)
    setAutoScroll(false)
    try {
      const res = await fetch(`${API_BASE}/random?type=${filter}`)
      const data = await res.json()
      if (data.tab_id) await loadItem(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const goHome = () => { setView('home'); setQuery(''); setResults([]); setSelected(null); setArtistPage(null); setAutoScroll(false) }
  const searchGenre = (g) => { setQuery(g.query.split(' OR ')[0]); doSearch(g.query.split(' OR ')[0], filter) }
  const stars = (r) => '⭐'.repeat(Math.min(Math.round(r || 0), 5))

  return (
    <div data-theme="dark" className="min-h-screen flex flex-col overflow-x-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)', maxWidth: '100vw' }}>
      {/* Navbar - Glassmorphism */}
      <div className="navbar px-2 sm:px-4 sticky top-0 z-50" style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(34, 211, 238, 0.2)' }}>
        <div className="flex-1">
          <button onClick={goHome} className="btn btn-ghost text-xl gap-2 hover:bg-cyan-500/10">
            <span className="text-3xl">🎸</span>
            <span className="font-bold hidden sm:inline bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Free Chord Book</span>
          </button>
        </div>
        {stats && (
          <div className="hidden md:flex gap-6 mr-4">
            <div className="text-center">
              <div className="font-bold text-cyan-400 text-lg">{stats.total?.toLocaleString()}</div>
              <div className="text-xs text-slate-400">Songs</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-purple-400 text-lg">{stats.tabs?.toLocaleString()}</div>
              <div className="text-xs text-slate-400">Tabs</div>
            </div>
          </div>
        )}
        <div className="flex-none gap-2">
          <button onClick={loadRandom} className="btn btn-sm bg-gradient-to-r from-cyan-500 to-purple-500 border-0 text-white hover:opacity-90">
            🎲 Random
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center gap-2 p-3 flex-wrap" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
        {[
          { key: 'home', icon: '🏠', label: 'Home', action: goHome },
          { key: 'top100', icon: '🔥', label: 'Top 100', action: loadTop100 },
          { key: 'artists', icon: '🎤', label: 'Artists', action: loadArtists }
        ].map(tab => (
          <button 
            key={tab.key}
            onClick={tab.action} 
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              view === tab.key 
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30' 
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-700/50 max-h-[40vh] lg:max-h-full overflow-hidden" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
          {/* Search */}
          <div className="p-3 relative" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search songs, artists..."
                value={query}
                onChange={e => { setQuery(e.target.value); setShowSuggestions(true) }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(71, 85, 105, 0.5)' }}
              />
              {loading && (
                <div className="absolute right-3 top-3">
                  <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            
            {/* Dropdown */}
            {showSuggestions && query.length >= 2 && (suggestions.artists?.length > 0 || suggestions.songs?.length > 0) && (
              <div className="absolute left-3 right-3 top-full mt-1 rounded-xl shadow-2xl z-50 overflow-hidden" style={{ background: 'rgba(30, 41, 59, 0.98)', border: '1px solid rgba(71, 85, 105, 0.5)', maxHeight: '50vh', overflowY: 'auto' }}>
                {suggestions.artists?.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-xs font-bold text-slate-400 bg-slate-800/50">🎤 Artists</div>
                    {suggestions.artists.slice(0, 5).map((a, i) => (
                      <div key={i} onClick={() => { loadArtist(a); setShowSuggestions(false); }} className="px-4 py-3 hover:bg-cyan-500/20 cursor-pointer flex justify-between items-center transition-colors border-b border-slate-700/30">
                        <span className="font-medium text-white">{a}</span>
                        <span className="text-xs text-cyan-400">View all →</span>
                      </div>
                    ))}
                  </>
                )}
                {suggestions.songs?.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-xs font-bold text-slate-400 bg-slate-800/50">🎵 Songs</div>
                    {suggestions.songs.slice(0, 5).map((s, i) => (
                      <div key={i} onClick={() => { setQuery(s.song); setShowSuggestions(false); doSearch(s.song); }} className="px-4 py-3 hover:bg-purple-500/20 cursor-pointer transition-colors border-b border-slate-700/30">
                        <div className="font-medium text-white">{s.song}</div>
                        <div className="text-xs text-slate-400">by {s.artist}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Filter */}
          <div className="flex gap-2 p-3 pt-0 justify-center">
            {[
              { key: 'all', label: 'All' },
              { key: 'tabs', label: '📝 Tabs' },
              { key: 'chords', label: '🎸 Chords' }
            ].map(f => (
              <button 
                key={f.key}
                onClick={() => setFilter(f.key)} 
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === f.key 
                    ? 'bg-cyan-500 text-white' 
                    : 'text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto">
            {view === 'home' && (
              <div className="p-4 space-y-5">
                <h3 className="font-bold text-white flex items-center gap-2">🎯 Browse by Genre</h3>
                <div className="grid grid-cols-2 gap-2">
                  {genres.slice(0, 8).map((g, i) => (
                    <button 
                      key={i} 
                      onClick={() => searchGenre(g)} 
                      className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 transition-all border border-slate-700/50 hover:border-cyan-500/50"
                    >
                      {g.icon} {g.name.split(' ').pop()}
                    </button>
                  ))}
                </div>
                <h3 className="font-bold text-white flex items-center gap-2">⚡ Quick Start</h3>
                <div className="flex flex-wrap gap-2">
                  {['Wonderwall', 'Hotel California', 'Smells Like Teen Spirit'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => { setQuery(s); doSearch(s) }} 
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {view === 'top100' && (
              <div className="divide-y divide-slate-700/30">
                {top100.map((item, i) => (
                  <div 
                    key={item.tab_id}
                    onClick={() => loadItem(item)} 
                    className={`px-4 py-3 cursor-pointer transition-all hover:bg-cyan-500/10 ${selected?.tab_id === item.tab_id ? 'bg-cyan-500/20 border-l-4 border-cyan-400' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-400 font-bold text-sm">#{i+1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium text-white">{item.song}</div>
                        <div className="text-xs text-slate-400">{item.artist}</div>
                      </div>
                      <span className="text-xs">{stars(item.rating)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {view === 'artists' && (
              <div className="divide-y divide-slate-700/30">
                {artists.map((a, i) => (
                  <div 
                    key={i}
                    onClick={() => loadArtist(a.artist)}
                    className="px-4 py-3 cursor-pointer transition-all hover:bg-purple-500/10"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-purple-400 font-bold text-sm">#{i+1}</span>
                      <div className="flex-1">
                        <div className="font-medium text-white">{a.artist}</div>
                        <div className="text-xs text-slate-400">{a.song_count} songs</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {view === 'search' && results.length > 0 && (
              <div className="divide-y divide-slate-700/30">
                {results.map(item => (
                  <div 
                    key={`${item.content_type}-${item.tab_id}`}
                    onClick={() => loadItem(item)} 
                    className={`px-4 py-3 cursor-pointer transition-all hover:bg-cyan-500/10 ${selected?.tab_id === item.tab_id ? 'bg-cyan-500/20 border-l-4 border-cyan-400' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium text-white">{item.song}</div>
                        <div className="text-xs text-slate-400">{item.artist}</div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded ${item.content_type === 'chord' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {item.content_type === 'chord' ? '🎸' : '📝'}
                        </span>
                        <div className="text-xs text-slate-400 mt-1">{item.rating?.toFixed(1)}⭐</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {view === 'artist' && artistPage && (
              <>
                <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-slate-700/50">
                  <h3 className="font-bold text-xl text-white">🎤 {artistPage.artist}</h3>
                  <p className="text-sm text-slate-400 mt-1">{artistPage.unique_songs} songs • {artistPage.total_results} versions</p>
                </div>
                <div className="divide-y divide-slate-700/30">
                  {artistPage.all_results?.map((item, i) => (
                    <div 
                      key={`${item.content_type}-${item.tab_id}`}
                      onClick={() => loadItem(item)} 
                      className={`px-4 py-3 cursor-pointer transition-all hover:bg-cyan-500/10 ${selected?.tab_id === item.tab_id ? 'bg-cyan-500/20 border-l-4 border-cyan-400' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 text-sm">#{i+1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="truncate font-medium text-white">{item.song}</div>
                          <div className="text-xs text-slate-400">{item.rating?.toFixed(1)}⭐ • {item.votes?.toLocaleString() || 0} votes</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${item.content_type === 'chord' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {item.content_type === 'chord' ? '🎸' : '📝'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-4 lg:p-6">
          {!selected ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center max-w-lg">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">🎸 Free Chord Book</span>
                </h1>
                <p className="text-lg text-slate-400 mb-8">Search {stats?.total?.toLocaleString() || '654,000'}+ tabs and chords</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: '🎯', title: 'Easy Search', desc: 'Find any song instantly' },
                    { icon: '🎸', title: 'Chord Diagrams', desc: 'Visual finger guides' },
                    { icon: '🔥', title: 'Top 100', desc: 'Most popular songs' },
                    { icon: '🎲', title: 'Discover', desc: 'Random songs' }
                  ].map((card, i) => (
                    <div key={i} className="p-5 rounded-xl transition-all hover:scale-105 cursor-pointer" style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(71, 85, 105, 0.4)' }}>
                      <div className="text-3xl mb-2">{card.icon}</div>
                      <div className="font-bold text-white">{card.title}</div>
                      <div className="text-xs text-slate-400">{card.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {/* Song Header */}
              <div className="p-5 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)', border: '1px solid rgba(34, 211, 238, 0.3)' }}>
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">{selected.song}</h2>
                <button onClick={() => loadArtist(selected.artist)} className="text-cyan-400 hover:text-cyan-300 text-lg transition-colors">
                  by {selected.artist} →
                </button>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${selected.content_type === 'chord' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {selected.content_type === 'chord' ? '🎸 Chords' : '📝 Tab'}
                  </span>
                  {selected.rating && (
                    <span className="px-3 py-1 rounded-full text-sm bg-slate-700/50 text-white">{stars(selected.rating)} {selected.rating?.toFixed(1)}</span>
                  )}
                  {selected.votes && (
                    <span className="px-3 py-1 rounded-full text-sm bg-slate-700/50 text-slate-300">👥 {selected.votes?.toLocaleString()}</span>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(71, 85, 105, 0.4)' }}>
                <span className="text-slate-400 text-sm">Font:</span>
                <button onClick={() => setFontSize(Math.max(12, fontSize - 2))} className="w-8 h-8 rounded-lg bg-slate-700 text-white hover:bg-slate-600 text-lg font-bold">−</button>
                <span className="text-white text-sm w-8 text-center">{fontSize}</span>
                <button onClick={() => setFontSize(Math.min(24, fontSize + 2))} className="w-8 h-8 rounded-lg bg-slate-700 text-white hover:bg-slate-600 text-lg font-bold">+</button>
                
                <div className="w-px h-6 bg-slate-600 mx-2 hidden sm:block"></div>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showChords} onChange={() => setShowChords(!showChords)} className="w-4 h-4 accent-cyan-500" />
                  <span className="text-slate-300 text-sm">Chords</span>
                </label>
                
                <div className="w-px h-6 bg-slate-600 mx-2 hidden sm:block"></div>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={autoScroll} onChange={() => setAutoScroll(!autoScroll)} className="w-4 h-4 accent-purple-500" />
                  <span className="text-slate-300 text-sm">Auto-scroll</span>
                </label>
              </div>

              {/* Chord Diagrams */}
              {selected.content_type === 'chord' && selected.chord_diagrams && Object.keys(selected.chord_diagrams).length > 0 && (
                <details className="rounded-xl overflow-hidden" style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(71, 85, 105, 0.4)' }}>
                  <summary className="p-4 cursor-pointer text-white font-bold hover:bg-slate-700/30 transition-colors">
                    🎸 Chord Diagrams ({Object.keys(selected.chord_diagrams).length}) — Click to expand
                  </summary>
                  <div className="p-4 pt-0">
                    <div className="flex flex-wrap gap-4">
                      {Object.entries(selected.chord_diagrams).map(([chord, diagram]) => (
                        diagram && <ChordDiagram key={chord} chord={chord} diagram={diagram} />
                      ))}
                    </div>
                  </div>
                </details>
              )}

              {/* LYRICS */}
              <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(15, 23, 42, 0.9)', border: '2px solid rgba(34, 211, 238, 0.4)' }}>
                <div className="p-4 border-b border-cyan-500/30 flex items-center justify-between" style={{ background: 'rgba(6, 182, 212, 0.1)' }}>
                  <h3 className="text-xl font-bold text-cyan-400">📜 Lyrics & Chords</h3>
                  <div className="text-sm text-slate-400">
                    <span className="inline-block w-3 h-3 rounded bg-cyan-400 mr-1"></span> = Chord (click for diagram)
                  </div>
                </div>
                <div className="p-4 lg:p-6" style={{ background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.95) 100%)' }}>
                  <FormattedContent 
                    content={selected.content} 
                    fontSize={fontSize} 
                    showChords={showChords} 
                    onChordClick={(chord) => setSelectedChord(chord)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chord Popup Modal */}
      {selectedChord && (
        <ChordPopup 
          chord={selectedChord} 
          songDiagrams={selected?.chord_diagrams}
          onClose={() => setSelectedChord(null)}
        />
      )}

      {/* Footer */}
      <footer className="p-4 text-center text-slate-500 text-sm" style={{ background: 'rgba(15, 23, 42, 0.8)', borderTop: '1px solid rgba(71, 85, 105, 0.3)' }}>
        🎸 Free Chord Book • Made with ❤️ for guitar lovers • 654K+ Songs
      </footer>
    </div>
  )
}

export default App
