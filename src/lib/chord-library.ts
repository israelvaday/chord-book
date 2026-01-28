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
  // === MAJOR CHORDS ===
  'C': [
    { frets: [-1, 3, 2, 0, 1, 0], baseFret: 1, name: 'Open' },
    { frets: [-1, 3, 5, 5, 5, 3], barres: [3], baseFret: 3, name: 'Barre (3rd)' },
    { frets: [8, 10, 10, 9, 8, 8], barres: [8], baseFret: 8, name: 'Barre (8th)' },
  ],
  'D': [
    { frets: [-1, -1, 0, 2, 3, 2], baseFret: 1, name: 'Open' },
    { frets: [-1, 5, 7, 7, 7, 5], barres: [5], baseFret: 5, name: 'Barre (5th)' },
    { frets: [10, 12, 12, 11, 10, 10], barres: [10], baseFret: 10, name: 'Barre (10th)' },
  ],
  'E': [
    { frets: [0, 2, 2, 1, 0, 0], baseFret: 1, name: 'Open' },
    { frets: [-1, 7, 9, 9, 9, 7], barres: [7], baseFret: 7, name: 'Barre (7th)' },
    { frets: [12, 14, 14, 13, 12, 12], barres: [12], baseFret: 12, name: 'Barre (12th)' },
  ],
  'F': [
    { frets: [1, 3, 3, 2, 1, 1], barres: [1], baseFret: 1, name: 'Barre (1st)' },
    { frets: [-1, -1, 3, 2, 1, 1], baseFret: 1, name: 'Easy' },
    { frets: [-1, 8, 10, 10, 10, 8], barres: [8], baseFret: 8, name: 'Barre (8th)' },
  ],
  'G': [
    { frets: [3, 2, 0, 0, 0, 3], baseFret: 1, name: 'Open' },
    { frets: [3, 2, 0, 0, 3, 3], baseFret: 1, name: 'Open (alt)' },
    { frets: [3, 5, 5, 4, 3, 3], barres: [3], baseFret: 3, name: 'Barre (3rd)' },
    { frets: [-1, 10, 12, 12, 12, 10], barres: [10], baseFret: 10, name: 'Barre (10th)' },
  ],
  'A': [
    { frets: [-1, 0, 2, 2, 2, 0], baseFret: 1, name: 'Open' },
    { frets: [5, 7, 7, 6, 5, 5], barres: [5], baseFret: 5, name: 'Barre (5th)' },
    { frets: [-1, 0, 2, 2, 2, 0], baseFret: 1, name: 'Open (alt)' },
  ],
  'B': [
    { frets: [-1, 2, 4, 4, 4, 2], barres: [2], baseFret: 2, name: 'Barre (2nd)' },
    { frets: [7, 9, 9, 8, 7, 7], barres: [7], baseFret: 7, name: 'Barre (7th)' },
    { frets: [-1, -1, 4, 4, 4, 2], baseFret: 2, name: 'Easy' },
  ],

  // === MINOR CHORDS ===
  'Cm': [
    { frets: [-1, 3, 5, 5, 4, 3], barres: [3], baseFret: 3, name: 'Barre (3rd)' },
    { frets: [8, 10, 10, 8, 8, 8], barres: [8], baseFret: 8, name: 'Barre (8th)' },
  ],
  'Dm': [
    { frets: [-1, -1, 0, 2, 3, 1], baseFret: 1, name: 'Open' },
    { frets: [-1, 5, 7, 7, 6, 5], barres: [5], baseFret: 5, name: 'Barre (5th)' },
    { frets: [10, 12, 12, 10, 10, 10], barres: [10], baseFret: 10, name: 'Barre (10th)' },
  ],
  'Em': [
    { frets: [0, 2, 2, 0, 0, 0], baseFret: 1, name: 'Open' },
    { frets: [-1, 7, 9, 9, 8, 7], barres: [7], baseFret: 7, name: 'Barre (7th)' },
    { frets: [12, 14, 14, 12, 12, 12], barres: [12], baseFret: 12, name: 'Barre (12th)' },
  ],
  'Fm': [
    { frets: [1, 3, 3, 1, 1, 1], barres: [1], baseFret: 1, name: 'Barre (1st)' },
    { frets: [-1, -1, 3, 1, 1, 1], barres: [1], baseFret: 1, name: 'Easy' },
    { frets: [-1, 8, 10, 10, 9, 8], barres: [8], baseFret: 8, name: 'Barre (8th)' },
  ],
  'Gm': [
    { frets: [3, 5, 5, 3, 3, 3], barres: [3], baseFret: 3, name: 'Barre (3rd)' },
    { frets: [-1, -1, 5, 3, 3, 3], barres: [3], baseFret: 3, name: 'Easy' },
    { frets: [-1, 10, 12, 12, 11, 10], barres: [10], baseFret: 10, name: 'Barre (10th)' },
  ],
  'Am': [
    { frets: [-1, 0, 2, 2, 1, 0], baseFret: 1, name: 'Open' },
    { frets: [5, 7, 7, 5, 5, 5], barres: [5], baseFret: 5, name: 'Barre (5th)' },
    { frets: [-1, 0, 2, 2, 1, 0], baseFret: 1, name: 'Open (alt)' },
  ],
  'Bm': [
    { frets: [-1, 2, 4, 4, 3, 2], barres: [2], baseFret: 2, name: 'Barre (2nd)' },
    { frets: [7, 9, 9, 7, 7, 7], barres: [7], baseFret: 7, name: 'Barre (7th)' },
    { frets: [-1, -1, 4, 4, 3, 2], baseFret: 2, name: 'Easy' },
  ],

  // === 7TH CHORDS ===
  'C7': [
    { frets: [-1, 3, 2, 3, 1, 0], baseFret: 1, name: 'Open' },
    { frets: [8, 10, 8, 9, 8, 8], barres: [8], baseFret: 8, name: 'Barre (8th)' },
  ],
  'D7': [
    { frets: [-1, -1, 0, 2, 1, 2], baseFret: 1, name: 'Open' },
    { frets: [-1, 5, 7, 5, 7, 5], baseFret: 5, name: 'Barre (5th)' },
  ],
  'E7': [
    { frets: [0, 2, 0, 1, 0, 0], baseFret: 1, name: 'Open' },
    { frets: [0, 2, 2, 1, 3, 0], baseFret: 1, name: 'Open (alt)' },
  ],
  'F7': [
    { frets: [1, 3, 1, 2, 1, 1], barres: [1], baseFret: 1, name: 'Barre' },
  ],
  'G7': [
    { frets: [3, 2, 0, 0, 0, 1], baseFret: 1, name: 'Open' },
    { frets: [3, 5, 3, 4, 3, 3], barres: [3], baseFret: 3, name: 'Barre' },
  ],
  'A7': [
    { frets: [-1, 0, 2, 0, 2, 0], baseFret: 1, name: 'Open' },
    { frets: [-1, 0, 2, 2, 2, 3], baseFret: 1, name: 'Open (alt)' },
    { frets: [5, 7, 5, 6, 5, 5], barres: [5], baseFret: 5, name: 'Barre' },
  ],
  'B7': [
    { frets: [-1, 2, 1, 2, 0, 2], baseFret: 1, name: 'Open' },
    { frets: [-1, 2, 4, 2, 4, 2], barres: [2], baseFret: 2, name: 'Barre' },
    { frets: [7, 9, 7, 8, 7, 7], barres: [7], baseFret: 7, name: 'Barre (7th)' },
  ],

  // === MINOR 7TH CHORDS ===
  'Cm7': [
    { frets: [-1, 3, 5, 3, 4, 3], barres: [3], baseFret: 3, name: 'Barre' },
    { frets: [8, 10, 8, 8, 8, 8], barres: [8], baseFret: 8, name: 'Barre (8th)' },
  ],
  'Dm7': [
    { frets: [-1, -1, 0, 2, 1, 1], baseFret: 1, name: 'Open' },
    { frets: [-1, 5, 7, 5, 6, 5], barres: [5], baseFret: 5, name: 'Barre' },
  ],
  'Em7': [
    { frets: [0, 2, 0, 0, 0, 0], baseFret: 1, name: 'Open' },
    { frets: [0, 2, 2, 0, 3, 0], baseFret: 1, name: 'Open (alt)' },
  ],
  'Fm7': [
    { frets: [1, 3, 1, 1, 1, 1], barres: [1], baseFret: 1, name: 'Barre' },
  ],
  'Gm7': [
    { frets: [3, 5, 3, 3, 3, 3], barres: [3], baseFret: 3, name: 'Barre' },
    { frets: [-1, -1, 5, 3, 3, 3], barres: [3], baseFret: 3, name: 'Easy' },
  ],
  'Am7': [
    { frets: [-1, 0, 2, 0, 1, 0], baseFret: 1, name: 'Open' },
    { frets: [5, 7, 5, 5, 5, 5], barres: [5], baseFret: 5, name: 'Barre' },
  ],
  'Bm7': [
    { frets: [-1, 2, 4, 2, 3, 2], barres: [2], baseFret: 2, name: 'Barre' },
    { frets: [-1, -1, 4, 2, 3, 2], baseFret: 2, name: 'Easy' },
  ],

  // === MAJOR 7TH CHORDS ===
  'Cmaj7': [
    { frets: [-1, 3, 2, 0, 0, 0], baseFret: 1, name: 'Open' },
    { frets: [8, 10, 9, 9, 8, -1], baseFret: 8, name: 'Barre' },
  ],
  'Dmaj7': [
    { frets: [-1, -1, 0, 2, 2, 2], baseFret: 1, name: 'Open' },
  ],
  'Emaj7': [
    { frets: [0, 2, 1, 1, 0, 0], baseFret: 1, name: 'Open' },
  ],
  'Fmaj7': [
    { frets: [1, -1, 2, 2, 1, -1], baseFret: 1, name: 'Open' },
    { frets: [-1, -1, 3, 2, 1, 0], baseFret: 1, name: 'Easy' },
  ],
  'Gmaj7': [
    { frets: [3, 2, 0, 0, 0, 2], baseFret: 1, name: 'Open' },
  ],
  'Amaj7': [
    { frets: [-1, 0, 2, 1, 2, 0], baseFret: 1, name: 'Open' },
  ],
  'Bmaj7': [
    { frets: [-1, 2, 4, 3, 4, 2], barres: [2], baseFret: 2, name: 'Barre' },
  ],

  // === SUS CHORDS ===
  'Csus2': [
    { frets: [-1, 3, 0, 0, 1, 3], baseFret: 1, name: 'Open' },
  ],
  'Csus4': [
    { frets: [-1, 3, 3, 0, 1, 1], baseFret: 1, name: 'Open' },
  ],
  'Dsus2': [
    { frets: [-1, -1, 0, 2, 3, 0], baseFret: 1, name: 'Open' },
  ],
  'Dsus4': [
    { frets: [-1, -1, 0, 2, 3, 3], baseFret: 1, name: 'Open' },
  ],
  'Esus2': [
    { frets: [0, 2, 4, 4, 0, 0], baseFret: 1, name: 'Open' },
  ],
  'Esus4': [
    { frets: [0, 2, 2, 2, 0, 0], baseFret: 1, name: 'Open' },
  ],
  'Gsus2': [
    { frets: [3, 0, 0, 0, 3, 3], baseFret: 1, name: 'Open' },
  ],
  'Gsus4': [
    { frets: [3, 3, 0, 0, 1, 3], baseFret: 1, name: 'Open' },
  ],
  'Asus2': [
    { frets: [-1, 0, 2, 2, 0, 0], baseFret: 1, name: 'Open' },
  ],
  'Asus4': [
    { frets: [-1, 0, 2, 2, 3, 0], baseFret: 1, name: 'Open' },
  ],

  // === ADD CHORDS ===
  'Cadd9': [
    { frets: [-1, 3, 2, 0, 3, 0], baseFret: 1, name: 'Open' },
  ],
  'Dadd9': [
    { frets: [-1, -1, 0, 2, 3, 0], baseFret: 1, name: 'Open' },
  ],
  'Eadd9': [
    { frets: [0, 2, 2, 1, 0, 2], baseFret: 1, name: 'Open' },
  ],
  'Gadd9': [
    { frets: [3, 0, 0, 2, 0, 3], baseFret: 1, name: 'Open' },
  ],

  // === POWER CHORDS ===
  'C5': [
    { frets: [-1, 3, 5, 5, -1, -1], baseFret: 3, name: 'Power' },
    { frets: [8, 10, 10, -1, -1, -1], baseFret: 8, name: 'Power (8th)' },
  ],
  'D5': [
    { frets: [-1, 5, 7, 7, -1, -1], baseFret: 5, name: 'Power' },
    { frets: [10, 12, 12, -1, -1, -1], baseFret: 10, name: 'Power (10th)' },
  ],
  'E5': [
    { frets: [0, 2, 2, -1, -1, -1], baseFret: 1, name: 'Power (Open)' },
    { frets: [-1, 7, 9, 9, -1, -1], baseFret: 7, name: 'Power (7th)' },
  ],
  'F5': [
    { frets: [1, 3, 3, -1, -1, -1], baseFret: 1, name: 'Power' },
  ],
  'G5': [
    { frets: [3, 5, 5, -1, -1, -1], baseFret: 3, name: 'Power' },
  ],
  'A5': [
    { frets: [-1, 0, 2, 2, -1, -1], baseFret: 1, name: 'Power (Open)' },
    { frets: [5, 7, 7, -1, -1, -1], baseFret: 5, name: 'Power (5th)' },
  ],
  'B5': [
    { frets: [-1, 2, 4, 4, -1, -1], baseFret: 2, name: 'Power' },
    { frets: [7, 9, 9, -1, -1, -1], baseFret: 7, name: 'Power (7th)' },
  ],

  // === DIMINISHED CHORDS ===
  'Cdim': [
    { frets: [-1, 3, 4, 2, 4, 2], baseFret: 2, name: 'Standard' },
  ],
  'Ddim': [
    { frets: [-1, -1, 0, 1, 0, 1], baseFret: 1, name: 'Open' },
  ],
  'Edim': [
    { frets: [0, 1, 2, 0, 2, 0], baseFret: 1, name: 'Open' },
  ],
  'Fdim': [
    { frets: [1, 2, 3, 1, 3, 1], barres: [1], baseFret: 1, name: 'Barre' },
  ],
  'Gdim': [
    { frets: [3, 4, 5, 3, 5, 3], barres: [3], baseFret: 3, name: 'Barre' },
  ],
  'Adim': [
    { frets: [-1, 0, 1, 2, 1, 2], baseFret: 1, name: 'Open' },
  ],
  'Bdim': [
    { frets: [-1, 2, 3, 4, 3, -1], baseFret: 2, name: 'Standard' },
  ],

  // === AUGMENTED CHORDS ===
  'Caug': [
    { frets: [-1, 3, 2, 1, 1, 0], baseFret: 1, name: 'Open' },
  ],
  'Daug': [
    { frets: [-1, -1, 0, 3, 3, 2], baseFret: 1, name: 'Open' },
  ],
  'Eaug': [
    { frets: [0, 3, 2, 1, 1, 0], baseFret: 1, name: 'Open' },
  ],
  'Faug': [
    { frets: [-1, -1, 3, 2, 2, 1], baseFret: 1, name: 'Standard' },
  ],
  'Gaug': [
    { frets: [3, 2, 1, 0, 0, 3], baseFret: 1, name: 'Open' },
  ],
  'Aaug': [
    { frets: [-1, 0, 3, 2, 2, 1], baseFret: 1, name: 'Open' },
  ],
  'Baug': [
    { frets: [-1, 2, 1, 0, 0, 3], baseFret: 1, name: 'Standard' },
  ],

  // === FLAT/SHARP VARIATIONS ===
  'C#': [
    { frets: [-1, 4, 6, 6, 6, 4], barres: [4], baseFret: 4, name: 'Barre (4th)' },
    { frets: [9, 11, 11, 10, 9, 9], barres: [9], baseFret: 9, name: 'Barre (9th)' },
  ],
  'Db': [
    { frets: [-1, 4, 6, 6, 6, 4], barres: [4], baseFret: 4, name: 'Barre (4th)' },
  ],
  'D#': [
    { frets: [-1, 6, 8, 8, 8, 6], barres: [6], baseFret: 6, name: 'Barre (6th)' },
  ],
  'Eb': [
    { frets: [-1, 6, 8, 8, 8, 6], barres: [6], baseFret: 6, name: 'Barre (6th)' },
  ],
  'F#': [
    { frets: [2, 4, 4, 3, 2, 2], barres: [2], baseFret: 2, name: 'Barre (2nd)' },
  ],
  'Gb': [
    { frets: [2, 4, 4, 3, 2, 2], barres: [2], baseFret: 2, name: 'Barre (2nd)' },
  ],
  'G#': [
    { frets: [4, 6, 6, 5, 4, 4], barres: [4], baseFret: 4, name: 'Barre (4th)' },
  ],
  'Ab': [
    { frets: [4, 6, 6, 5, 4, 4], barres: [4], baseFret: 4, name: 'Barre (4th)' },
  ],
  'A#': [
    { frets: [-1, 1, 3, 3, 3, 1], barres: [1], baseFret: 1, name: 'Barre (1st)' },
  ],
  'Bb': [
    { frets: [-1, 1, 3, 3, 3, 1], barres: [1], baseFret: 1, name: 'Barre (1st)' },
    { frets: [6, 8, 8, 7, 6, 6], barres: [6], baseFret: 6, name: 'Barre (6th)' },
  ],
  
  // Minor sharps/flats
  'C#m': [
    { frets: [-1, 4, 6, 6, 5, 4], barres: [4], baseFret: 4, name: 'Barre (4th)' },
  ],
  'Dbm': [
    { frets: [-1, 4, 6, 6, 5, 4], barres: [4], baseFret: 4, name: 'Barre (4th)' },
  ],
  'D#m': [
    { frets: [-1, 6, 8, 8, 7, 6], barres: [6], baseFret: 6, name: 'Barre (6th)' },
  ],
  'Ebm': [
    { frets: [-1, 6, 8, 8, 7, 6], barres: [6], baseFret: 6, name: 'Barre (6th)' },
  ],
  'F#m': [
    { frets: [2, 4, 4, 2, 2, 2], barres: [2], baseFret: 2, name: 'Barre (2nd)' },
  ],
  'Gbm': [
    { frets: [2, 4, 4, 2, 2, 2], barres: [2], baseFret: 2, name: 'Barre (2nd)' },
  ],
  'G#m': [
    { frets: [4, 6, 6, 4, 4, 4], barres: [4], baseFret: 4, name: 'Barre (4th)' },
  ],
  'Abm': [
    { frets: [4, 6, 6, 4, 4, 4], barres: [4], baseFret: 4, name: 'Barre (4th)' },
  ],
  'A#m': [
    { frets: [-1, 1, 3, 3, 2, 1], barres: [1], baseFret: 1, name: 'Barre (1st)' },
  ],
  'Bbm': [
    { frets: [-1, 1, 3, 3, 2, 1], barres: [1], baseFret: 1, name: 'Barre (1st)' },
  ],

  // 7th sharps/flats
  'C#7': [
    { frets: [-1, 4, 6, 4, 6, 4], barres: [4], baseFret: 4, name: 'Barre' },
  ],
  'Eb7': [
    { frets: [-1, 6, 8, 6, 8, 6], barres: [6], baseFret: 6, name: 'Barre' },
  ],
  'F#7': [
    { frets: [2, 4, 2, 3, 2, 2], barres: [2], baseFret: 2, name: 'Barre' },
  ],
  'G#7': [
    { frets: [4, 6, 4, 5, 4, 4], barres: [4], baseFret: 4, name: 'Barre' },
  ],
  'Bb7': [
    { frets: [-1, 1, 3, 1, 3, 1], barres: [1], baseFret: 1, name: 'Barre' },
  ],
}

// Get chord positions from library or API diagrams
export function getChordPositions(chordName: string, apiDiagram?: { frets: number[], barres?: number[], baseFret: number }): ChordPosition[] {
  // Normalize chord name (handle variations)
  const normalized = chordName
    .replace(/maj(?!7)/i, '')  // Cmaj -> C but keep Cmaj7
    .replace(/minor/i, 'm')
    .replace(/min(?!or)/i, 'm')
    .trim()
  
  // Check library first
  const positions = chordLibrary[normalized] || chordLibrary[chordName]
  
  if (positions && positions.length > 0) {
    return positions
  }
  
  // Fall back to API diagram if available
  if (apiDiagram) {
    return [{ 
      ...apiDiagram, 
      name: 'Default',
      barres: apiDiagram.barres || []
    }]
  }
  
  // Generate a basic chord if nothing found (try to parse)
  return []
}
