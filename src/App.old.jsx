import { useState, useEffect, useCallback } from 'react'
import './App.css'

// API base URL - Railway production
const API_BASE = 'https://api-production-da6a.up.railway.app'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [recentSearches, setRecentSearches] = useState([])
  const [contentFilter, setContentFilter] = useState('all') // 'all', 'tabs', 'chords'
  const [suggestions, setSuggestions] = useState({ artists: [], songs: [] })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [artistPage, setArtistPage] = useState(null) // Artist page data
  const [sortBy, setSortBy] = useState('rating') // rating, song, votes

  // Load stats on mount
  useEffect(() => {
    fetch(`${API_BASE}/stats`)
      .then(res => res.json())
      .then(setStats)
      .catch(console.error)
  }, [])

  // Search function with debounce
  const doSearch = useCallback(async (query, filter = contentFilter) => {
    if (!query || query.length < 2) {
      setSearchResults([])
      setSuggestions({ artists: [], songs: [] })
      return
    }
    
    setLoading(true)
    try {
      // Get autocomplete suggestions
      const suggestRes = await fetch(`${API_BASE}/autocomplete?q=${encodeURIComponent(query)}&limit=5`)
      const suggestData = await suggestRes.json()
      setSuggestions(suggestData)
      
      // Get search results
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&limit=50&type=${filter}`)
      const data = await res.json()
      setSearchResults(data.results || [])
      
      // Add to recent searches
      if (data.results?.length > 0 && !recentSearches.includes(query)) {
        setRecentSearches(prev => [query, ...prev.slice(0, 9)])
      }
    } catch (err) {
      console.error('Search failed:', err)
    }
    setLoading(false)
  }, [recentSearches, contentFilter])

  // Load artist page
  const loadArtist = async (artistName) => {
    setLoading(true)
    setShowSuggestions(false)
    setSearchQuery(artistName)
    try {
      const res = await fetch(`${API_BASE}/artist/${encodeURIComponent(artistName)}?type=${contentFilter}&sort=${sortBy}`)
      const data = await res.json()
      setArtistPage(data)
      setSelectedItem(null)
      setSearchResults([])
    } catch (err) {
      console.error('Failed to load artist:', err)
    }
    setLoading(false)
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) doSearch(searchQuery, contentFilter)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, contentFilter, doSearch])

  // Re-search when filter changes
  useEffect(() => {
    if (searchQuery) {
      doSearch(searchQuery, contentFilter)
    }
  }, [contentFilter])

  // Load full item
  const loadItem = async (item) => {
    setLoading(true)
    try {
      const type = item.content_type === 'chord' ? 'chord' : 'tab'
      const res = await fetch(`${API_BASE}/${type}/${item.tab_id}`)
      const data = await res.json()
      setSelectedItem({ ...data, content_type: type })
    } catch (err) {
      console.error('Failed to load item:', err)
    }
    setLoading(false)
  }

  // Get random item
  const loadRandom = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/random`)
      const data = await res.json()
      setSelectedItem(data)
    } catch (err) {
      console.error('Failed to load random:', err)
    }
    setLoading(false)
  }

  // Parse tab/chord content
  const parseContent = (content) => {
    if (!content) return []
    return content
      .replace(/\[tab\]/g, '')
      .replace(/\[\/tab\]/g, '')
      .replace(/\[ch\]([^\[]+)\[\/ch\]/g, '<span class="chord">$1</span>')
      .split('\n')
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="main-header">
        <div className="header-content">
          <h1>🎸 Tab Viewer</h1>
          {stats && (
            <div className="stats">
              <span>{stats.tabs?.toLocaleString()} tabs</span>
              <span>{stats.chords?.toLocaleString()} chords</span>
              <span className="total">{stats.total?.toLocaleString()} total</span>
            </div>
          )}
        </div>
      </header>

      <div className="main-container">
        {/* Sidebar - Search & Results */}
        <aside className="sidebar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search artist or song..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value)
                setShowSuggestions(true)
                setArtistPage(null)
              }}
              onFocus={() => setShowSuggestions(true)}
              className="search-input"
            />
            {loading && <div className="search-loading">⏳</div>}
            
            {/* Autocomplete Suggestions */}
            {showSuggestions && searchQuery.length >= 2 && (suggestions.artists?.length > 0 || suggestions.songs?.length > 0) && (
              <div className="suggestions-dropdown">
                {suggestions.artists?.length > 0 && (
                  <>
                    <div className="suggestion-header">Artists</div>
                    {suggestions.artists.map((artist, i) => (
                      <div 
                        key={`artist-${i}`} 
                        className="suggestion-item"
                        onClick={() => loadArtist(artist)}
                      >
                        <span className="suggestion-icon">👤</span>
                        <span className="suggestion-text">{artist}</span>
                        <span className="suggestion-action">View all songs →</span>
                      </div>
                    ))}
                  </>
                )}
                {suggestions.songs?.length > 0 && (
                  <>
                    <div className="suggestion-header">Songs</div>
                    {suggestions.songs.map((s, i) => (
                      <div 
                        key={`song-${i}`} 
                        className="suggestion-item"
                        onClick={() => {
                          setSearchQuery(s.song)
                          setShowSuggestions(false)
                        }}
                      >
                        <span className="suggestion-icon">🎵</span>
                        <span className="suggestion-text">{s.song}</span>
                        <span className="suggestion-artist">by {s.artist}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Filter Toggle */}
          <div className="filter-toggle">
            <button 
              className={`filter-btn ${contentFilter === 'all' ? 'active' : ''}`}
              onClick={() => setContentFilter('all')}
            >
              All ({stats?.total?.toLocaleString()})
            </button>
            <button 
              className={`filter-btn ${contentFilter === 'tabs' ? 'active' : ''}`}
              onClick={() => setContentFilter('tabs')}
            >
              📝 Tabs ({stats?.tabs?.toLocaleString()})
            </button>
            <button 
              className={`filter-btn ${contentFilter === 'chords' ? 'active' : ''}`}
              onClick={() => setContentFilter('chords')}
            >
              🎵 Chords ({stats?.chords?.toLocaleString()})
            </button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && !searchQuery && (
            <div className="recent-searches">
              <h4>Recent Searches</h4>
              {recentSearches.map((q, i) => (
                <button key={i} onClick={() => setSearchQuery(q)} className="recent-btn">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Search Results */}
          <div className="results-list">
            {searchResults.map(item => (
              <div 
                key={`${item.content_type}-${item.tab_id}`}
                className={`result-item ${selectedItem?.tab_id === item.tab_id ? 'selected' : ''}`}
                onClick={() => loadItem(item)}
              >
                <div className="result-main">
                  <span className="result-song">{item.song}</span>
                  <span className="result-artist">{item.artist}</span>
                </div>
                <div className="result-meta">
                  <span className={`type-badge ${item.content_type}`}>
                    {item.content_type === 'chord' ? '🎵' : '📝'} {item.tab_type || item.content_type}
                  </span>
                  {item.rating > 0 && (
                    <span className="rating">⭐ {item.rating?.toFixed(1)}</span>
                  )}
                </div>
              </div>
            ))}
            
            {searchQuery && searchResults.length === 0 && !loading && (
              <div className="no-results">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="content-area">
          {/* Artist Page View */}
          {artistPage ? (
            <div className="artist-page">
              <div className="artist-header">
                <h2>👤 {artistPage.artist}</h2>
                <div className="artist-stats">
                  <span>{artistPage.unique_songs} songs</span>
                  <span>{artistPage.total_results} versions</span>
                </div>
                <div className="sort-options">
                  <span>Sort by:</span>
                  <button 
                    className={sortBy === 'rating' ? 'active' : ''}
                    onClick={() => { setSortBy('rating'); loadArtist(artistPage.artist) }}
                  >⭐ Rating</button>
                  <button 
                    className={sortBy === 'song' ? 'active' : ''}
                    onClick={() => { setSortBy('song'); loadArtist(artistPage.artist) }}
                  >🔤 A-Z</button>
                  <button 
                    className={sortBy === 'votes' ? 'active' : ''}
                    onClick={() => { setSortBy('votes'); loadArtist(artistPage.artist) }}
                  >👥 Votes</button>
                </div>
              </div>
              <div className="artist-songs">
                {artistPage.songs?.map((song, i) => (
                  <div key={i} className="artist-song-card">
                    <div className="song-title">{song.song}</div>
                    <div className="song-versions">
                      {song.versions?.map((v, j) => (
                        <button 
                          key={j} 
                          className={`version-btn ${v.type}`}
                          onClick={() => loadItem({ tab_id: v.tab_id, content_type: v.type })}
                        >
                          {v.type === 'chord' ? '🎵' : '📝'} {v.tab_type || v.type}
                          {v.rating > 0 && <span className="v-rating">⭐{v.rating?.toFixed(1)}</span>}
                          {v.votes > 0 && <span className="v-votes">({v.votes})</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : selectedItem ? (
            <>
              {/* Content Header */}
              <div className="content-header">
                <div className="content-info">
                  <h2>{selectedItem.song}</h2>
                  <p className="artist-name" onClick={() => loadArtist(selectedItem.artist)} style={{cursor: 'pointer'}}>
                    👤 {selectedItem.artist} <span style={{fontSize: '0.8em', color: '#666'}}>→ view all songs</span>
                  </p>
                </div>
                <div className="content-badges">
                  <span className={`type-badge ${selectedItem.content_type}`}>
                    {selectedItem.tab_type || selectedItem.content_type}
                  </span>
                  {selectedItem.rating > 0 && (
                    <span className="rating-badge">⭐ {selectedItem.rating?.toFixed(1)} ({selectedItem.votes} votes)</span>
                  )}
                </div>
              </div>

              {/* Tab/Chord Content */}
              <div className="tab-content">
                {selectedItem.content ? (
                  <pre className="tab-text">
                    {parseContent(selectedItem.content).map((line, i) => {
                      if (line.match(/^\[(Intro|Verse|Chorus|Bridge|Outro|Pre-Chorus|Solo|Instrumental)/i)) {
                        return <div key={i} className="section-marker">{line.replace(/[\[\]]/g, '')}</div>
                      }
                      return <div key={i} className="tab-line" dangerouslySetInnerHTML={{__html: line || ' '}} />
                    })}
                  </pre>
                ) : (
                  <div className="no-content">
                    <p>📝 No content available for this item</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="welcome-screen">
              <div className="welcome-content">
                <h2>🎸 Welcome to Tab Viewer</h2>
                <p>Search for your favorite songs or try a random one!</p>
                
                {stats && (
                  <div className="welcome-stats">
                    <div className="stat-card">
                      <span className="stat-number">{stats.tabs?.toLocaleString()}</span>
                      <span className="stat-label">Guitar Tabs</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-number">{stats.chords?.toLocaleString()}</span>
                      <span className="stat-label">Chord Charts</span>
                    </div>
                  </div>
                )}

                <div className="quick-actions">
                  <button onClick={loadRandom} className="action-btn">
                    🎲 Show Random Song
                  </button>
                </div>

                <div className="popular-searches">
                  <h4>Popular Searches</h4>
                  <div className="search-tags">
                    {['Wonderwall', 'Hotel California', 'Stairway to Heaven', 'Sweet Child O Mine', 'Nothing Else Matters'].map(q => (
                      <button key={q} onClick={() => setSearchQuery(q)} className="tag-btn">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
