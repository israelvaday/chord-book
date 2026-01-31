// Comprehensive chord library with multiple positions for each chord
// frets: [E, A, D, G, B, e] - low to high string
// -1 = muted, 0 = open

export interface ChordPosition {
  frets: number[]
  barres?: number[]
  baseFret: number
  fingers?: number[]
  name?: string // e.g., "Open", "Barre", "Jazz"
}

export const chordLibrary: Record<string, ChordPosition[]> = {
  // ========================
  // MAJOR CHORDS (All 12 keys)
  // ========================
  'C': [
    { frets: [-1, 3, 2, 0, 1, 0], baseFret: 1, name: 'Open' },
    { frets: [-1, 3, 5, 5, 5, 3], barres: [3], baseFret: 3, name: 'Barre (A shape)' },
    { frets: [8, 10, 10, 9, 8, 8], barres: [8], baseFret: 8, name: 'Barre (E shape)' },
  ],
  'C#': [
    { frets: [-1, 4, 6, 6, 6, 4], barres: [4], baseFret: 4, name: 'Barre (A shape)' },
    { frets: [9, 11, 11, 10, 9, 9], barres: [9], baseFret: 9, name: 'Barre (E shape)' },
    { frets: [-1, -1, 6, 6, 6, 4], baseFret: 4, name: 'Easy' },
  ],
  'Db': [
    { frets: [-1, 4, 6, 6, 6, 4], barres: [4], baseFret: 4, name: 'Barre (A shape)' },
    { frets: [9, 11, 11, 10, 9, 9], barres: [9], baseFret: 9, name: 'Barre (E shape)' },
  ],
  'D': [
    { frets: [-1, -1, 0, 2, 3, 2], baseFret: 1, name: 'Open' },
    { frets: [-1, 5, 7, 7, 7, 5], barres: [5], baseFret: 5, name: 'Barre (A shape)' },
    { frets: [10, 12, 12, 11, 10, 10], barres: [10], baseFret: 10, name: 'Barre (E shape)' },
  ],
  'D#': [
    { frets: [-1, 6, 8, 8, 8, 6], barres: [6], baseFret: 6, name: 'Barre (A shape)' },
    { frets: [11, 13, 13, 12, 11, 11], barres: [11], baseFret: 11, name: 'Barre (E shape)' },
  ],
  'Eb': [
    { frets: [-1, 6, 8, 8, 8, 6], barres: [6], baseFret: 6, name: 'Barre (A shape)' },
    { frets: [11, 13, 13, 12, 11, 11], barres: [11], baseFret: 11, name: 'Barre (E shape)' },
  ],
  'E': [
    { frets: [0, 2, 2, 1, 0, 0], baseFret: 1, name: 'Open' },
    { frets: [-1, 7, 9, 9, 9, 7], barres: [7], baseFret: 7, name: 'Barre (A shape)' },
    { frets: [12, 14, 14, 13, 12, 12], barres: [12], baseFret: 12, name: 'Barre (E shape)' },
  ],
  'F': [
    { frets: [1, 3, 3, 2, 1, 1], barres: [1], baseFret: 1, name: 'Barre (E shape)' },
    { frets: [-1, -1, 3, 2, 1, 1], baseFret: 1, name: 'Easy' },
    { frets: [-1, 8, 10, 10, 10, 8], barres: [8], baseFret: 8, name: 'Barre (A shape)' },
  ],
  'F#': [
    { frets: [2, 4, 4, 3, 2, 2], barres: [2], baseFret: 2, name: 'Barre (E shape)' },
    { frets: [-1, 9, 11, 11, 11, 9], barres: [9], baseFret: 9, name: 'Barre (A shape)' },
    { frets: [-1, -1, 4, 3, 2, 2], baseFret: 2, name: 'Easy' },
  ],
  'Gb': [
    { frets: [2, 4, 4, 3, 2, 2], barres: [2], baseFret: 2, name: 'Barre (E shape)' },
    { frets: [-1, 9, 11, 11, 11, 9], barres: [9], baseFret: 9, name: 'Barre (A shape)' },
  ],
  'G': [
    { frets: [3, 2, 0, 0, 0, 3], baseFret: 1, name: 'Open' },
    { frets: [3, 2, 0, 0, 3, 3], baseFret: 1, name: 'Open (4 finger)' },
    { frets: [3, 5, 5, 4, 3, 3], barres: [3], baseFret: 3, name: 'Barre (E shape)' },
    { frets: [-1, 10, 12, 12, 12, 10], barres: [10], baseFret: 10, name: 'Barre (A shape)' },
  ],
  'G#': [
    { frets: [4, 6, 6, 5, 4, 4], barres: [4], baseFret: 4, name: 'Barre (E shape)' },
    { frets: [-1, 11, 13, 13, 13, 11], barres: [11], baseFret: 11, name: 'Barre (A shape)' },
  ],
  'Ab': [
    { frets: [4, 6, 6, 5, 4, 4], barres: [4], baseFret: 4, name: 'Barre (E shape)' },
    { frets: [-1, 11, 13, 13, 13, 11], barres: [11], baseFret: 11, name: 'Barre (A shape)' },
  ],
  'A': [
    { frets: [-1, 0, 2, 2, 2, 0], baseFret: 1, name: 'Open' },
    { frets: [5, 7, 7, 6, 5, 5], barres: [5], baseFret: 5, name: 'Barre (E shape)' },
  ],
  'A#': [
    { frets: [-1, 1, 3, 3, 3, 1], barres: [1], baseFret: 1, name: 'Barre (A shape)' },
    { frets: [6, 8, 8, 7, 6, 6], barres: [6], baseFret: 6, name: 'Barre (E shape)' },
  ],
  'Bb': [
    { frets: [-1, 1, 3, 3, 3, 1], barres: [1], baseFret: 1, name: 'Barre (A shape)' },
    { frets: [6, 8, 8, 7, 6, 6], barres: [6], baseFret: 6, name: 'Barre (E shape)' },
    { frets: [-1, -1, 3, 3, 3, 1], baseFret: 1, name: 'Easy' },
  ],
  'B': [
    { frets: [-1, 2, 4, 4, 4, 2], barres: [2], baseFret: 2, name: 'Barre (A shape)' },
    { frets: [7, 9, 9, 8, 7, 7], barres: [7], baseFret: 7, name: 'Barre (E shape)' },
    { frets: [-1, -1, 4, 4, 4, 2], baseFret: 2, name: 'Easy' },
  ],

  // ========================
  // MINOR CHORDS (All 12 keys)
  // ========================
  'Cm': [
    { frets: [-1, 3, 5, 5, 4, 3], barres: [3], baseFret: 3, name: 'Barre (Am shape)' },
    { frets: [8, 10, 10, 8, 8, 8], barres: [8], baseFret: 8, name: 'Barre (Em shape)' },
  ],
  'C#m': [
    { frets: [-1, 4, 6, 6, 5, 4], barres: [4], baseFret: 4, name: 'Barre (Am shape)' },
    { frets: [9, 11, 11, 9, 9, 9], barres: [9], baseFret: 9, name: 'Barre (Em shape)' },
  ],
  'Dbm': [
    { frets: [-1, 4, 6, 6, 5, 4], barres: [4], baseFret: 4, name: 'Barre (Am shape)' },
  ],
  'Dm': [
    { frets: [-1, -1, 0, 2, 3, 1], baseFret: 1, name: 'Open' },
    { frets: [-1, 5, 7, 7, 6, 5], barres: [5], baseFret: 5, name: 'Barre (Am shape)' },
    { frets: [10, 12, 12, 10, 10, 10], barres: [10], baseFret: 10, name: 'Barre (Em shape)' },
  ],
  'D#m': [
    { frets: [-1, 6, 8, 8, 7, 6], barres: [6], baseFret: 6, name: 'Barre (Am shape)' },
  ],
  'Ebm': [
    { frets: [-1, 6, 8, 8, 7, 6], barres: [6], baseFret: 6, name: 'Barre (Am shape)' },
  ],
  'Em': [
    { frets: [0, 2, 2, 0, 0, 0], baseFret: 1, name: 'Open' },
    { frets: [-1, 7, 9, 9, 8, 7], barres: [7], baseFret: 7, name: 'Barre (Am shape)' },
  ],
  'Fm': [
    { frets: [1, 3, 3, 1, 1, 1], barres: [1], baseFret: 1, name: 'Barre (Em shape)' },
    { frets: [-1, 8, 10, 10, 9, 8], barres: [8], baseFret: 8, name: 'Barre (Am shape)' },
  ],
  'F#m': [
    { frets: [2, 4, 4, 2, 2, 2], barres: [2], baseFret: 2, name: 'Barre (Em shape)' },
    { frets: [-1, 9, 11, 11, 10, 9], barres: [9], baseFret: 9, name: 'Barre (Am shape)' },
  ],
  'Gbm': [
    { frets: [2, 4, 4, 2, 2, 2], barres: [2], baseFret: 2, name: 'Barre (Em shape)' },
  ],
  'Gm': [
    { frets: [3, 5, 5, 3, 3, 3], barres: [3], baseFret: 3, name: 'Barre (Em shape)' },
    { frets: [-1, -1, 5, 3, 3, 3], barres: [3], baseFret: 3, name: 'Easy' },
  ],
  'G#m': [
    { frets: [4, 6, 6, 4, 4, 4], barres: [4], baseFret: 4, name: 'Barre (Em shape)' },
  ],
  'Abm': [
    { frets: [4, 6, 6, 4, 4, 4], barres: [4], baseFret: 4, name: 'Barre (Em shape)' },
  ],
  'Am': [
    { frets: [-1, 0, 2, 2, 1, 0], baseFret: 1, name: 'Open' },
    { frets: [5, 7, 7, 5, 5, 5], barres: [5], baseFret: 5, name: 'Barre (Em shape)' },
  ],
  'A#m': [
    { frets: [-1, 1, 3, 3, 2, 1], barres: [1], baseFret: 1, name: 'Barre (Am shape)' },
    { frets: [6, 8, 8, 6, 6, 6], barres: [6], baseFret: 6, name: 'Barre (Em shape)' },
  ],
  'Bbm': [
    { frets: [-1, 1, 3, 3, 2, 1], barres: [1], baseFret: 1, name: 'Barre (Am shape)' },
    { frets: [6, 8, 8, 6, 6, 6], barres: [6], baseFret: 6, name: 'Barre (Em shape)' },
  ],
  'Bm': [
    { frets: [-1, 2, 4, 4, 3, 2], barres: [2], baseFret: 2, name: 'Barre (Am shape)' },
    { frets: [7, 9, 9, 7, 7, 7], barres: [7], baseFret: 7, name: 'Barre (Em shape)' },
  ],

  // ========================
  // DOMINANT 7TH CHORDS (All 12 keys)
  // ========================
  'C7': [
    { frets: [-1, 3, 2, 3, 1, 0], baseFret: 1, name: 'Open' },
    { frets: [8, 10, 8, 9, 8, 8], barres: [8], baseFret: 8, name: 'Barre (E7 shape)' },
  ],
  'C#7': [
    { frets: [-1, 4, 6, 4, 6, 4], barres: [4], baseFret: 4, name: 'Barre (A7 shape)' },
  ],
  'Db7': [
    { frets: [-1, 4, 6, 4, 6, 4], barres: [4], baseFret: 4, name: 'Barre (A7 shape)' },
  ],
  'D7': [
    { frets: [-1, -1, 0, 2, 1, 2], baseFret: 1, name: 'Open' },
    { frets: [-1, 5, 7, 5, 7, 5], barres: [5], baseFret: 5, name: 'Barre (A7 shape)' },
  ],
  'D#7': [
    { frets: [-1, 6, 8, 6, 8, 6], barres: [6], baseFret: 6, name: 'Barre (A7 shape)' },
  ],
  'Eb7': [
    { frets: [-1, 6, 8, 6, 8, 6], barres: [6], baseFret: 6, name: 'Barre (A7 shape)' },
  ],
  'E7': [
    { frets: [0, 2, 0, 1, 0, 0], baseFret: 1, name: 'Open' },
    { frets: [0, 2, 2, 1, 3, 0], baseFret: 1, name: 'Open (alt)' },
  ],
  'F7': [
    { frets: [1, 3, 1, 2, 1, 1], barres: [1], baseFret: 1, name: 'Barre (E7 shape)' },
  ],
  'F#7': [
    { frets: [2, 4, 2, 3, 2, 2], barres: [2], baseFret: 2, name: 'Barre (E7 shape)' },
  ],
  'Gb7': [
    { frets: [2, 4, 2, 3, 2, 2], barres: [2], baseFret: 2, name: 'Barre (E7 shape)' },
  ],
  'G7': [
    { frets: [3, 2, 0, 0, 0, 1], baseFret: 1, name: 'Open' },
    { frets: [3, 5, 3, 4, 3, 3], barres: [3], baseFret: 3, name: 'Barre (E7 shape)' },
  ],
  'G#7': [
    { frets: [4, 6, 4, 5, 4, 4], barres: [4], baseFret: 4, name: 'Barre (E7 shape)' },
  ],
  'Ab7': [
    { frets: [4, 6, 4, 5, 4, 4], barres: [4], baseFret: 4, name: 'Barre (E7 shape)' },
  ],
  'A7': [
    { frets: [-1, 0, 2, 0, 2, 0], baseFret: 1, name: 'Open' },
    { frets: [5, 7, 5, 6, 5, 5], barres: [5], baseFret: 5, name: 'Barre (E7 shape)' },
  ],
  'A#7': [
    { frets: [-1, 1, 3, 1, 3, 1], barres: [1], baseFret: 1, name: 'Barre (A7 shape)' },
  ],
  'Bb7': [
    { frets: [-1, 1, 3, 1, 3, 1], barres: [1], baseFret: 1, name: 'Barre (A7 shape)' },
  ],
  'B7': [
    { frets: [-1, 2, 1, 2, 0, 2], baseFret: 1, name: 'Open' },
    { frets: [-1, 2, 4, 2, 4, 2], barres: [2], baseFret: 2, name: 'Barre (A7 shape)' },
  ],

  // ========================
  // MINOR 7TH CHORDS (All 12 keys)
  // ========================
  'Cm7': [
    { frets: [-1, 3, 5, 3, 4, 3], barres: [3], baseFret: 3, name: 'Barre' },
    { frets: [8, 10, 8, 8, 8, 8], barres: [8], baseFret: 8, name: 'Barre (Em7)' },
  ],
  'C#m7': [
    { frets: [-1, 4, 6, 4, 5, 4], barres: [4], baseFret: 4, name: 'Barre' },
  ],
  'Dbm7': [
    { frets: [-1, 4, 6, 4, 5, 4], barres: [4], baseFret: 4, name: 'Barre' },
  ],
  'Dm7': [
    { frets: [-1, -1, 0, 2, 1, 1], baseFret: 1, name: 'Open' },
    { frets: [-1, 5, 7, 5, 6, 5], barres: [5], baseFret: 5, name: 'Barre' },
  ],
  'D#m7': [
    { frets: [-1, 6, 8, 6, 7, 6], barres: [6], baseFret: 6, name: 'Barre' },
  ],
  'Ebm7': [
    { frets: [-1, 6, 8, 6, 7, 6], barres: [6], baseFret: 6, name: 'Barre' },
  ],
  'Em7': [
    { frets: [0, 2, 0, 0, 0, 0], baseFret: 1, name: 'Open' },
    { frets: [0, 2, 2, 0, 3, 0], baseFret: 1, name: 'Open (alt)' },
  ],
  'Fm7': [
    { frets: [1, 3, 1, 1, 1, 1], barres: [1], baseFret: 1, name: 'Barre' },
  ],
  'F#m7': [
    { frets: [2, 4, 2, 2, 2, 2], barres: [2], baseFret: 2, name: 'Barre' },
  ],
  'Gbm7': [
    { frets: [2, 4, 2, 2, 2, 2], barres: [2], baseFret: 2, name: 'Barre' },
  ],
  'Gm7': [
    { frets: [3, 5, 3, 3, 3, 3], barres: [3], baseFret: 3, name: 'Barre' },
  ],
  'G#m7': [
    { frets: [4, 6, 4, 4, 4, 4], barres: [4], baseFret: 4, name: 'Barre' },
  ],
  'Abm7': [
    { frets: [4, 6, 4, 4, 4, 4], barres: [4], baseFret: 4, name: 'Barre' },
  ],
  'Am7': [
    { frets: [-1, 0, 2, 0, 1, 0], baseFret: 1, name: 'Open' },
    { frets: [5, 7, 5, 5, 5, 5], barres: [5], baseFret: 5, name: 'Barre' },
  ],
  'A#m7': [
    { frets: [-1, 1, 3, 1, 2, 1], barres: [1], baseFret: 1, name: 'Barre' },
  ],
  'Bbm7': [
    { frets: [-1, 1, 3, 1, 2, 1], barres: [1], baseFret: 1, name: 'Barre' },
  ],
  'Bm7': [
    { frets: [-1, 2, 4, 2, 3, 2], barres: [2], baseFret: 2, name: 'Barre' },
  ],

  // ========================
  // MAJOR 7TH CHORDS (All 12 keys)
  // ========================
  'Cmaj7': [
    { frets: [-1, 3, 2, 0, 0, 0], baseFret: 1, name: 'Open' },
  ],
  'C#maj7': [
    { frets: [-1, 4, 6, 5, 6, 4], barres: [4], baseFret: 4, name: 'Barre' },
  ],
  'Dbmaj7': [
    { frets: [-1, 4, 6, 5, 6, 4], barres: [4], baseFret: 4, name: 'Barre' },
  ],
  'Dmaj7': [
    { frets: [-1, -1, 0, 2, 2, 2], baseFret: 1, name: 'Open' },
  ],
  'D#maj7': [
    { frets: [-1, 6, 8, 7, 8, 6], barres: [6], baseFret: 6, name: 'Barre' },
  ],
  'Ebmaj7': [
    { frets: [-1, 6, 8, 7, 8, 6], barres: [6], baseFret: 6, name: 'Barre' },
  ],
  'Emaj7': [
    { frets: [0, 2, 1, 1, 0, 0], baseFret: 1, name: 'Open' },
  ],
  'Fmaj7': [
    { frets: [-1, -1, 3, 2, 1, 0], baseFret: 1, name: 'Easy' },
    { frets: [1, -1, 2, 2, 1, -1], baseFret: 1, name: 'Standard' },
  ],
  'F#maj7': [
    { frets: [2, -1, 3, 3, 2, -1], baseFret: 2, name: 'Standard' },
  ],
  'Gbmaj7': [
    { frets: [2, -1, 3, 3, 2, -1], baseFret: 2, name: 'Standard' },
  ],
  'Gmaj7': [
    { frets: [3, 2, 0, 0, 0, 2], baseFret: 1, name: 'Open' },
  ],
  'G#maj7': [
    { frets: [4, 6, 5, 5, 4, 4], barres: [4], baseFret: 4, name: 'Barre' },
  ],
  'Abmaj7': [
    { frets: [4, 6, 5, 5, 4, 4], barres: [4], baseFret: 4, name: 'Barre' },
  ],
  'Amaj7': [
    { frets: [-1, 0, 2, 1, 2, 0], baseFret: 1, name: 'Open' },
  ],
  'A#maj7': [
    { frets: [-1, 1, 3, 2, 3, 1], barres: [1], baseFret: 1, name: 'Barre' },
  ],
  'Bbmaj7': [
    { frets: [-1, 1, 3, 2, 3, 1], barres: [1], baseFret: 1, name: 'Barre' },
  ],
  'Bmaj7': [
    { frets: [-1, 2, 4, 3, 4, 2], barres: [2], baseFret: 2, name: 'Barre' },
  ],

  // ========================
  // SUS2 CHORDS (All 12 keys)
  // ========================
  'Csus2': [
    { frets: [-1, 3, 0, 0, 1, 3], baseFret: 1, name: 'Open' },
  ],
  'C#sus2': [
    { frets: [-1, 4, 6, 6, 4, 4], barres: [4], baseFret: 4, name: 'Barre' },
  ],
  'Dbsus2': [
    { frets: [-1, 4, 6, 6, 4, 4], barres: [4], baseFret: 4, name: 'Barre' },
  ],
  'Dsus2': [
    { frets: [-1, -1, 0, 2, 3, 0], baseFret: 1, name: 'Open' },
  ],
  'D#sus2': [
    { frets: [-1, 6, 8, 8, 6, 6], barres: [6], baseFret: 6, name: 'Barre' },
  ],
  'Ebsus2': [
    { frets: [-1, 6, 8, 8, 6, 6], barres: [6], baseFret: 6, name: 'Barre' },
  ],
  'Esus2': [
    { frets: [0, 2, 4, 4, 0, 0], baseFret: 1, name: 'Open' },
  ],
  'Fsus2': [
    { frets: [-1, -1, 3, 0, 1, 1], baseFret: 1, name: 'Open' },
  ],
  'F#sus2': [
    { frets: [-1, 9, 11, 11, 9, 9], barres: [9], baseFret: 9, name: 'Barre' },
  ],
  'Gbsus2': [
    { frets: [-1, 9, 11, 11, 9, 9], barres: [9], baseFret: 9, name: 'Barre' },
  ],
  'Gsus2': [
    { frets: [3, 0, 0, 0, 3, 3], baseFret: 1, name: 'Open' },
  ],
  'G#sus2': [
    { frets: [4, 6, 6, 5, 4, 4], barres: [4], baseFret: 4, name: 'Barre' },
  ],
  'Absus2': [
    { frets: [4, 6, 6, 5, 4, 4], barres: [4], baseFret: 4, name: 'Barre' },
  ],
  'Asus2': [
    { frets: [-1, 0, 2, 2, 0, 0], baseFret: 1, name: 'Open' },
  ],
  'A#sus2': [
    { frets: [-1, 1, 3, 3, 1, 1], barres: [1], baseFret: 1, name: 'Barre' },
  ],
  'Bbsus2': [
    { frets: [-1, 1, 3, 3, 1, 1], barres: [1], baseFret: 1, name: 'Barre' },
  ],
  'Bsus2': [
    { frets: [-1, 2, 4, 4, 2, 2], barres: [2], baseFret: 2, name: 'Barre' },
  ],

  // ========================
  // SUS4 CHORDS (All 12 keys)
  // ========================
  'Csus4': [
    { frets: [-1, 3, 3, 0, 1, 1], baseFret: 1, name: 'Open' },
  ],
  'C#sus4': [
    { frets: [-1, 4, 6, 6, 7, 4], barres: [4], baseFret: 4, name: 'Barre' },
  ],
  'Dbsus4': [
    { frets: [-1, 4, 6, 6, 7, 4], barres: [4], baseFret: 4, name: 'Barre' },
  ],
  'Dsus4': [
    { frets: [-1, -1, 0, 2, 3, 3], baseFret: 1, name: 'Open' },
  ],
  'D#sus4': [
    { frets: [-1, 6, 8, 8, 9, 6], barres: [6], baseFret: 6, name: 'Barre' },
  ],
  'Ebsus4': [
    { frets: [-1, 6, 8, 8, 9, 6], barres: [6], baseFret: 6, name: 'Barre' },
  ],
  'Esus4': [
    { frets: [0, 2, 2, 2, 0, 0], baseFret: 1, name: 'Open' },
  ],
  'Fsus4': [
    { frets: [1, 3, 3, 3, 1, 1], barres: [1], baseFret: 1, name: 'Barre' },
  ],
  'F#sus4': [
    { frets: [2, 4, 4, 4, 2, 2], barres: [2], baseFret: 2, name: 'Barre' },
  ],
  'Gbsus4': [
    { frets: [2, 4, 4, 4, 2, 2], barres: [2], baseFret: 2, name: 'Barre' },
  ],
  'Gsus4': [
    { frets: [3, 3, 0, 0, 1, 3], baseFret: 1, name: 'Open' },
  ],
  'G#sus4': [
    { frets: [4, 6, 6, 6, 4, 4], barres: [4], baseFret: 4, name: 'Barre' },
  ],
  'Absus4': [
    { frets: [4, 6, 6, 6, 4, 4], barres: [4], baseFret: 4, name: 'Barre' },
  ],
  'Asus4': [
    { frets: [-1, 0, 2, 2, 3, 0], baseFret: 1, name: 'Open' },
  ],
  'A#sus4': [
    { frets: [-1, 1, 3, 3, 4, 1], barres: [1], baseFret: 1, name: 'Barre' },
  ],
  'Bbsus4': [
    { frets: [-1, 1, 3, 3, 4, 1], barres: [1], baseFret: 1, name: 'Barre' },
  ],
  'Bsus4': [
    { frets: [-1, 2, 4, 4, 5, 2], barres: [2], baseFret: 2, name: 'Barre' },
  ],
  'B4': [
    { frets: [-1, 2, 4, 4, 5, 2], barres: [2], baseFret: 2, name: 'Barre' },
  ],
  'A4': [
    { frets: [-1, 0, 2, 2, 3, 0], baseFret: 1, name: 'Open' },
  ],
  'E4': [
    { frets: [0, 2, 2, 2, 0, 0], baseFret: 1, name: 'Open' },
  ],
  'D4': [
    { frets: [-1, -1, 0, 2, 3, 3], baseFret: 1, name: 'Open' },
  ],

  // ========================
  // DIMINISHED CHORDS
  // ========================
  'Cdim': [
    { frets: [-1, 3, 4, 2, 4, 2], baseFret: 1, name: 'Standard' },
  ],
  'C#dim': [
    { frets: [-1, 4, 5, 3, 5, 3], baseFret: 1, name: 'Standard' },
  ],
  'Dbdim': [
    { frets: [-1, 4, 5, 3, 5, 3], baseFret: 1, name: 'Standard' },
  ],
  'Ddim': [
    { frets: [-1, -1, 0, 1, 3, 1], baseFret: 1, name: 'Open' },
  ],
  'D#dim': [
    { frets: [-1, -1, 1, 2, 4, 2], baseFret: 1, name: 'Standard' },
  ],
  'Ebdim': [
    { frets: [-1, -1, 1, 2, 4, 2], baseFret: 1, name: 'Standard' },
  ],
  'Edim': [
    { frets: [0, 1, 2, 0, 2, 0], baseFret: 1, name: 'Open' },
  ],
  'Fdim': [
    { frets: [1, 2, 3, 1, 3, 1], barres: [1], baseFret: 1, name: 'Barre' },
  ],
  'F#dim': [
    { frets: [2, 3, 4, 2, 4, 2], barres: [2], baseFret: 2, name: 'Barre' },
  ],
  'Gbdim': [
    { frets: [2, 3, 4, 2, 4, 2], barres: [2], baseFret: 2, name: 'Barre' },
  ],
  'Gdim': [
    { frets: [3, 4, 5, 3, 5, 3], barres: [3], baseFret: 3, name: 'Barre' },
  ],
  'G#dim': [
    { frets: [4, 5, 6, 4, 6, 4], barres: [4], baseFret: 4, name: 'Barre' },
  ],
  'Abdim': [
    { frets: [4, 5, 6, 4, 6, 4], barres: [4], baseFret: 4, name: 'Barre' },
  ],
  'Adim': [
    { frets: [-1, 0, 1, 2, 1, 2], baseFret: 1, name: 'Open' },
  ],
  'A#dim': [
    { frets: [-1, 1, 2, 3, 2, 3], baseFret: 1, name: 'Standard' },
  ],
  'Bbdim': [
    { frets: [-1, 1, 2, 3, 2, 3], baseFret: 1, name: 'Standard' },
  ],
  'Bdim': [
    { frets: [-1, 2, 3, 4, 3, 4], baseFret: 1, name: 'Standard' },
  ],

  // ========================
  // AUGMENTED CHORDS
  // ========================
  'Caug': [
    { frets: [-1, 3, 2, 1, 1, 0], baseFret: 1, name: 'Open' },
  ],
  'C#aug': [
    { frets: [-1, 4, 3, 2, 2, 1], baseFret: 1, name: 'Standard' },
  ],
  'Dbaug': [
    { frets: [-1, 4, 3, 2, 2, 1], baseFret: 1, name: 'Standard' },
  ],
  'Daug': [
    { frets: [-1, -1, 0, 3, 3, 2], baseFret: 1, name: 'Open' },
  ],
  'D#aug': [
    { frets: [-1, -1, 1, 4, 4, 3], baseFret: 1, name: 'Standard' },
  ],
  'Ebaug': [
    { frets: [-1, -1, 1, 4, 4, 3], baseFret: 1, name: 'Standard' },
  ],
  'Eaug': [
    { frets: [0, 3, 2, 1, 1, 0], baseFret: 1, name: 'Open' },
  ],
  'Faug': [
    { frets: [1, 4, 3, 2, 2, 1], barres: [1], baseFret: 1, name: 'Barre' },
  ],
  'F#aug': [
    { frets: [2, 5, 4, 3, 3, 2], barres: [2], baseFret: 2, name: 'Barre' },
  ],
  'Gbaug': [
    { frets: [2, 5, 4, 3, 3, 2], barres: [2], baseFret: 2, name: 'Barre' },
  ],
  'Gaug': [
    { frets: [3, 2, 1, 0, 0, 3], baseFret: 1, name: 'Open' },
  ],
  'G#aug': [
    { frets: [4, 3, 2, 1, 1, 0], baseFret: 1, name: 'Standard' },
  ],
  'Abaug': [
    { frets: [4, 3, 2, 1, 1, 0], baseFret: 1, name: 'Standard' },
  ],
  'Aaug': [
    { frets: [-1, 0, 3, 2, 2, 1], baseFret: 1, name: 'Open' },
  ],
  'A#aug': [
    { frets: [-1, 1, 4, 3, 3, 2], baseFret: 1, name: 'Standard' },
  ],
  'Bbaug': [
    { frets: [-1, 1, 4, 3, 3, 2], baseFret: 1, name: 'Standard' },
  ],
  'Baug': [
    { frets: [-1, 2, 5, 4, 4, 3], baseFret: 1, name: 'Standard' },
  ],

  // ========================
  // ADD9 CHORDS
  // ========================
  'Cadd9': [
    { frets: [-1, 3, 2, 0, 3, 0], baseFret: 1, name: 'Open' },
  ],
  'Dadd9': [
    { frets: [-1, -1, 0, 2, 3, 0], baseFret: 1, name: 'Open' },
  ],
  'Eadd9': [
    { frets: [0, 2, 2, 1, 0, 2], baseFret: 1, name: 'Open' },
  ],
  'Fadd9': [
    { frets: [-1, -1, 3, 2, 1, 3], baseFret: 1, name: 'Standard' },
  ],
  'Gadd9': [
    { frets: [3, 0, 0, 0, 0, 3], baseFret: 1, name: 'Open' },
    { frets: [3, 2, 0, 2, 0, 3], baseFret: 1, name: 'Open (full)' },
  ],
  'Aadd9': [
    { frets: [-1, 0, 2, 2, 0, 0], baseFret: 1, name: 'Open' },
  ],
  'Badd9': [
    { frets: [-1, 2, 4, 4, 2, 2], barres: [2], baseFret: 2, name: 'Standard' },
  ],

  // ========================
  // 9TH CHORDS
  // ========================
  'C9': [
    { frets: [-1, 3, 2, 3, 3, 3], barres: [3], baseFret: 1, name: 'Standard' },
  ],
  'D9': [
    { frets: [-1, -1, 0, 2, 1, 0], baseFret: 1, name: 'Open' },
  ],
  'E9': [
    { frets: [0, 2, 0, 1, 0, 2], baseFret: 1, name: 'Open' },
  ],
  'F9': [
    { frets: [1, 3, 1, 2, 1, 3], barres: [1], baseFret: 1, name: 'Barre' },
  ],
  'G9': [
    { frets: [3, 2, 0, 2, 0, 1], baseFret: 1, name: 'Open' },
  ],
  'A9': [
    { frets: [-1, 0, 2, 0, 0, 0], baseFret: 1, name: 'Open' },
  ],
  'B9': [
    { frets: [-1, 2, 1, 2, 2, 2], barres: [2], baseFret: 2, name: 'Standard' },
  ],

  // ========================
  // 6TH CHORDS
  // ========================
  'C6': [
    { frets: [-1, 3, 2, 2, 1, 0], baseFret: 1, name: 'Open' },
  ],
  'D6': [
    { frets: [-1, -1, 0, 2, 0, 2], baseFret: 1, name: 'Open' },
  ],
  'E6': [
    { frets: [0, 2, 2, 1, 2, 0], baseFret: 1, name: 'Open' },
  ],
  'F6': [
    { frets: [1, 3, 3, 2, 3, 1], barres: [1], baseFret: 1, name: 'Barre' },
  ],
  'G6': [
    { frets: [3, 2, 0, 0, 0, 0], baseFret: 1, name: 'Open' },
  ],
  'A6': [
    { frets: [-1, 0, 2, 2, 2, 2], baseFret: 1, name: 'Open' },
  ],
  'B6': [
    { frets: [-1, 2, 4, 4, 4, 4], barres: [4], baseFret: 2, name: 'Barre' },
  ],

  // ========================
  // POWER CHORDS (5TH)
  // ========================
  'C5': [
    { frets: [-1, 3, 5, 5, -1, -1], baseFret: 3, name: 'Standard' },
  ],
  'D5': [
    { frets: [-1, 5, 7, 7, -1, -1], baseFret: 5, name: 'Standard' },
  ],
  'E5': [
    { frets: [0, 2, 2, -1, -1, -1], baseFret: 1, name: 'Open' },
  ],
  'F5': [
    { frets: [1, 3, 3, -1, -1, -1], baseFret: 1, name: 'Standard' },
  ],
  'G5': [
    { frets: [3, 5, 5, -1, -1, -1], baseFret: 3, name: 'Standard' },
  ],
  'A5': [
    { frets: [-1, 0, 2, 2, -1, -1], baseFret: 1, name: 'Open' },
  ],
  'B5': [
    { frets: [-1, 2, 4, 4, -1, -1], baseFret: 2, name: 'Standard' },
  ],

  // ========================
  // MINOR 6TH CHORDS
  // ========================
  'Cm6': [
    { frets: [-1, 3, 1, 2, 1, 3], baseFret: 1, name: 'Standard' },
  ],
  'Dm6': [
    { frets: [-1, -1, 0, 2, 0, 1], baseFret: 1, name: 'Open' },
  ],
  'Em6': [
    { frets: [0, 2, 2, 0, 2, 0], baseFret: 1, name: 'Open' },
  ],
  'Am6': [
    { frets: [-1, 0, 2, 2, 1, 2], baseFret: 1, name: 'Open' },
  ],
  'Bm6': [
    { frets: [-1, 2, 4, 4, 3, 4], baseFret: 2, name: 'Standard' },
  ],

  // ========================
  // COMMON SLASH CHORDS
  // ========================
  'C/E': [
    { frets: [0, 3, 2, 0, 1, 0], baseFret: 1, name: 'Open' },
  ],
  'C/G': [
    { frets: [3, 3, 2, 0, 1, 0], baseFret: 1, name: 'Open' },
  ],
  'D/F#': [
    { frets: [2, 0, 0, 2, 3, 2], baseFret: 1, name: 'Open' },
  ],
  'G/B': [
    { frets: [-1, 2, 0, 0, 0, 3], baseFret: 1, name: 'Open' },
  ],
  'G/D': [
    { frets: [-1, -1, 0, 0, 0, 3], baseFret: 1, name: 'Open' },
  ],
  'Am/G': [
    { frets: [3, 0, 2, 2, 1, 0], baseFret: 1, name: 'Open' },
  ],
  'Am/E': [
    { frets: [0, 0, 2, 2, 1, 0], baseFret: 1, name: 'Open' },
  ],
  'Em/D': [
    { frets: [-1, -1, 0, 0, 0, 0], baseFret: 1, name: 'Open' },
  ],
  'F/C': [
    { frets: [-1, 3, 3, 2, 1, 1], barres: [1], baseFret: 1, name: 'Standard' },
  ],

  // Additional flat 5 and other common variants
  'F#mb5': [
    { frets: [2, 3, 4, 2, -1, -1], baseFret: 2, name: 'Standard' },
  ],
  'F#m7b5': [
    { frets: [2, 0, 2, 2, 1, 0], baseFret: 1, name: 'Open' },
  ],
  'Bm7b5': [
    { frets: [-1, 2, 3, 2, 3, -1], baseFret: 2, name: 'Standard' },
  ],
  'Em9': [
    { frets: [0, 2, 0, 0, 0, 2], baseFret: 1, name: 'Open' },
  ],
  'Am9': [
    { frets: [-1, 0, 2, 0, 1, 2], baseFret: 1, name: 'Open' },
  ],
}

// Normalize chord name for lookup
function normalizeChordName(chord: string): string {
  // Common aliases
  const aliases: Record<string, string> = {
    'maj': '',
    'M': '',
    'min': 'm',
    'mi': 'm',
    '-': 'm',
    'dom7': '7',
    'sus': 'sus4',
  }
  
  let normalized = chord
  for (const [alias, replacement] of Object.entries(aliases)) {
    if (normalized.includes(alias) && alias !== '') {
      normalized = normalized.replace(alias, replacement)
    }
  }
  
  return normalized
}

// Get chord positions with fallback
export function getChordPositions(chordName: string): ChordPosition[] {
  // Try exact match first
  if (chordLibrary[chordName]) {
    return chordLibrary[chordName]
  }
  
  // Try normalized
  const normalized = normalizeChordName(chordName)
  if (chordLibrary[normalized]) {
    return chordLibrary[normalized]
  }
  
  // Try with sharp/flat conversion
  const flatToSharp: Record<string, string> = {
    'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
  }
  const sharpToFlat: Record<string, string> = {
    'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb'
  }
  
  for (const [from, to] of Object.entries(flatToSharp)) {
    if (chordName.startsWith(from)) {
      const converted = to + chordName.slice(2)
      if (chordLibrary[converted]) {
        return chordLibrary[converted]
      }
    }
  }
  
  for (const [from, to] of Object.entries(sharpToFlat)) {
    if (chordName.startsWith(from)) {
      const converted = to + chordName.slice(2)
      if (chordLibrary[converted]) {
        return chordLibrary[converted]
      }
    }
  }
  
  return []
}

// Check if chord has a diagram
export function hasChord(chordName: string): boolean {
  return getChordPositions(chordName).length > 0
}
