const API_BASE = 'https://api-production-da6a.up.railway.app'

export interface Song {
  tab_id: number
  song: string
  artist: string
  rating?: number
  votes?: number
  content_type: 'chord' | 'tab'
  content?: string
  chord_diagrams?: Record<string, ChordDiagram>
}

export interface ChordDiagram {
  frets: number[]
  barres?: number[]
  baseFret: number
}

export interface Artist {
  artist: string
  song_count: number
}

export interface Stats {
  total: number
  tabs: number
  chords: number
}

export interface Genre {
  name: string
  icon: string
  query: string
}

export async function getStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE}/stats`)
  return res.json()
}

export async function getTop100(type: string = 'all'): Promise<Song[]> {
  const res = await fetch(`${API_BASE}/top100?type=${type}`)
  const data = await res.json()
  return data.songs || []
}

export async function getArtists(limit: number = 100): Promise<Artist[]> {
  const res = await fetch(`${API_BASE}/artists?limit=${limit}`)
  const data = await res.json()
  return data.artists || []
}

export async function getGenres(): Promise<Genre[]> {
  const res = await fetch(`${API_BASE}/genres`)
  const data = await res.json()
  return data.genres || []
}

export async function search(q: string, type: string = 'all', limit: number = 50): Promise<Song[]> {
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}&type=${type}&limit=${limit}`)
  const data = await res.json()
  return data.results || []
}

export async function autocomplete(q: string): Promise<{ artists: string[], songs: { song: string, artist: string }[] }> {
  const res = await fetch(`${API_BASE}/autocomplete?q=${encodeURIComponent(q)}&limit=5`)
  return res.json()
}

export async function getSong(id: number, type: 'chord' | 'tab' = 'chord'): Promise<Song> {
  const res = await fetch(`${API_BASE}/${type}/${id}`)
  return res.json()
}

export async function getArtistSongs(name: string, type: string = 'all'): Promise<{ artist: string, all_results: Song[], total_results: number, unique_songs: number }> {
  const res = await fetch(`${API_BASE}/artist/${encodeURIComponent(name)}?type=${type}&sort=rating&limit=200`)
  return res.json()
}

export async function getRandom(type: string = 'all'): Promise<Song> {
  const res = await fetch(`${API_BASE}/random?type=${type}`)
  return res.json()
}
