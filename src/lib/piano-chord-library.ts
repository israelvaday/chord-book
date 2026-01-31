// Piano chord library with multiple voicings
// Notes are represented as MIDI numbers or note names
// Middle C = C4 = 60

export interface PianoChordPosition {
  notes: number[] // MIDI note numbers (C4=60)
  name: string // e.g., "Root Position", "1st Inversion", "2nd Inversion"
}

// Helper to convert note name to MIDI number
const noteToMidi: Record<string, number> = {
  'C': 60, 'C#': 61, 'Db': 61, 'D': 62, 'D#': 63, 'Eb': 63,
  'E': 64, 'F': 65, 'F#': 66, 'Gb': 66, 'G': 67, 'G#': 68, 'Ab': 68,
  'A': 69, 'A#': 70, 'Bb': 70, 'B': 71
}

// Get MIDI note with octave adjustment
function midi(note: string, octave: number = 4): number {
  const base = noteToMidi[note] || 60
  return base + (octave - 4) * 12
}

export const pianoChordLibrary: Record<string, PianoChordPosition[]> = {
  // ========================
  // MAJOR CHORDS (All 12 keys)
  // ========================
  'C': [
    { notes: [midi('C', 4), midi('E', 4), midi('G', 4)], name: 'Root Position' },
    { notes: [midi('E', 4), midi('G', 4), midi('C', 5)], name: '1st Inversion' },
    { notes: [midi('G', 3), midi('C', 4), midi('E', 4)], name: '2nd Inversion' },
    { notes: [midi('C', 3), midi('G', 3), midi('C', 4), midi('E', 4)], name: 'Wide Voicing' },
  ],
  'C#': [
    { notes: [midi('C#', 4), midi('F', 4), midi('G#', 4)], name: 'Root Position' },
    { notes: [midi('F', 4), midi('G#', 4), midi('C#', 5)], name: '1st Inversion' },
    { notes: [midi('G#', 3), midi('C#', 4), midi('F', 4)], name: '2nd Inversion' },
  ],
  'Db': [
    { notes: [midi('Db', 4), midi('F', 4), midi('Ab', 4)], name: 'Root Position' },
    { notes: [midi('F', 4), midi('Ab', 4), midi('Db', 5)], name: '1st Inversion' },
    { notes: [midi('Ab', 3), midi('Db', 4), midi('F', 4)], name: '2nd Inversion' },
  ],
  'D': [
    { notes: [midi('D', 4), midi('F#', 4), midi('A', 4)], name: 'Root Position' },
    { notes: [midi('F#', 4), midi('A', 4), midi('D', 5)], name: '1st Inversion' },
    { notes: [midi('A', 3), midi('D', 4), midi('F#', 4)], name: '2nd Inversion' },
    { notes: [midi('D', 3), midi('A', 3), midi('D', 4), midi('F#', 4)], name: 'Wide Voicing' },
  ],
  'D#': [
    { notes: [midi('D#', 4), midi('G', 4), midi('A#', 4)], name: 'Root Position' },
    { notes: [midi('G', 4), midi('A#', 4), midi('D#', 5)], name: '1st Inversion' },
  ],
  'Eb': [
    { notes: [midi('Eb', 4), midi('G', 4), midi('Bb', 4)], name: 'Root Position' },
    { notes: [midi('G', 4), midi('Bb', 4), midi('Eb', 5)], name: '1st Inversion' },
    { notes: [midi('Bb', 3), midi('Eb', 4), midi('G', 4)], name: '2nd Inversion' },
  ],
  'E': [
    { notes: [midi('E', 4), midi('G#', 4), midi('B', 4)], name: 'Root Position' },
    { notes: [midi('G#', 4), midi('B', 4), midi('E', 5)], name: '1st Inversion' },
    { notes: [midi('B', 3), midi('E', 4), midi('G#', 4)], name: '2nd Inversion' },
    { notes: [midi('E', 3), midi('B', 3), midi('E', 4), midi('G#', 4)], name: 'Wide Voicing' },
  ],
  'F': [
    { notes: [midi('F', 4), midi('A', 4), midi('C', 5)], name: 'Root Position' },
    { notes: [midi('A', 4), midi('C', 5), midi('F', 5)], name: '1st Inversion' },
    { notes: [midi('C', 4), midi('F', 4), midi('A', 4)], name: '2nd Inversion' },
    { notes: [midi('F', 3), midi('C', 4), midi('F', 4), midi('A', 4)], name: 'Wide Voicing' },
  ],
  'F#': [
    { notes: [midi('F#', 4), midi('A#', 4), midi('C#', 5)], name: 'Root Position' },
    { notes: [midi('A#', 4), midi('C#', 5), midi('F#', 5)], name: '1st Inversion' },
  ],
  'Gb': [
    { notes: [midi('Gb', 4), midi('Bb', 4), midi('Db', 5)], name: 'Root Position' },
    { notes: [midi('Bb', 4), midi('Db', 5), midi('Gb', 5)], name: '1st Inversion' },
  ],
  'G': [
    { notes: [midi('G', 4), midi('B', 4), midi('D', 5)], name: 'Root Position' },
    { notes: [midi('B', 4), midi('D', 5), midi('G', 5)], name: '1st Inversion' },
    { notes: [midi('D', 4), midi('G', 4), midi('B', 4)], name: '2nd Inversion' },
    { notes: [midi('G', 3), midi('D', 4), midi('G', 4), midi('B', 4)], name: 'Wide Voicing' },
  ],
  'G#': [
    { notes: [midi('G#', 4), midi('C', 5), midi('D#', 5)], name: 'Root Position' },
  ],
  'Ab': [
    { notes: [midi('Ab', 4), midi('C', 5), midi('Eb', 5)], name: 'Root Position' },
    { notes: [midi('C', 4), midi('Eb', 4), midi('Ab', 4)], name: '1st Inversion' },
    { notes: [midi('Eb', 4), midi('Ab', 4), midi('C', 5)], name: '2nd Inversion' },
  ],
  'A': [
    { notes: [midi('A', 4), midi('C#', 5), midi('E', 5)], name: 'Root Position' },
    { notes: [midi('C#', 4), midi('E', 4), midi('A', 4)], name: '1st Inversion' },
    { notes: [midi('E', 4), midi('A', 4), midi('C#', 5)], name: '2nd Inversion' },
    { notes: [midi('A', 3), midi('E', 4), midi('A', 4), midi('C#', 5)], name: 'Wide Voicing' },
  ],
  'A#': [
    { notes: [midi('A#', 4), midi('D', 5), midi('F', 5)], name: 'Root Position' },
  ],
  'Bb': [
    { notes: [midi('Bb', 4), midi('D', 5), midi('F', 5)], name: 'Root Position' },
    { notes: [midi('D', 4), midi('F', 4), midi('Bb', 4)], name: '1st Inversion' },
    { notes: [midi('F', 4), midi('Bb', 4), midi('D', 5)], name: '2nd Inversion' },
  ],
  'B': [
    { notes: [midi('B', 4), midi('D#', 5), midi('F#', 5)], name: 'Root Position' },
    { notes: [midi('D#', 4), midi('F#', 4), midi('B', 4)], name: '1st Inversion' },
    { notes: [midi('F#', 4), midi('B', 4), midi('D#', 5)], name: '2nd Inversion' },
  ],

  // ========================
  // MINOR CHORDS (All 12 keys)
  // ========================
  'Cm': [
    { notes: [midi('C', 4), midi('Eb', 4), midi('G', 4)], name: 'Root Position' },
    { notes: [midi('Eb', 4), midi('G', 4), midi('C', 5)], name: '1st Inversion' },
    { notes: [midi('G', 3), midi('C', 4), midi('Eb', 4)], name: '2nd Inversion' },
  ],
  'C#m': [
    { notes: [midi('C#', 4), midi('E', 4), midi('G#', 4)], name: 'Root Position' },
    { notes: [midi('E', 4), midi('G#', 4), midi('C#', 5)], name: '1st Inversion' },
  ],
  'Dbm': [
    { notes: [midi('Db', 4), midi('E', 4), midi('Ab', 4)], name: 'Root Position' },
  ],
  'Dm': [
    { notes: [midi('D', 4), midi('F', 4), midi('A', 4)], name: 'Root Position' },
    { notes: [midi('F', 4), midi('A', 4), midi('D', 5)], name: '1st Inversion' },
    { notes: [midi('A', 3), midi('D', 4), midi('F', 4)], name: '2nd Inversion' },
  ],
  'D#m': [
    { notes: [midi('D#', 4), midi('F#', 4), midi('A#', 4)], name: 'Root Position' },
  ],
  'Ebm': [
    { notes: [midi('Eb', 4), midi('Gb', 4), midi('Bb', 4)], name: 'Root Position' },
    { notes: [midi('Gb', 4), midi('Bb', 4), midi('Eb', 5)], name: '1st Inversion' },
  ],
  'Em': [
    { notes: [midi('E', 4), midi('G', 4), midi('B', 4)], name: 'Root Position' },
    { notes: [midi('G', 4), midi('B', 4), midi('E', 5)], name: '1st Inversion' },
    { notes: [midi('B', 3), midi('E', 4), midi('G', 4)], name: '2nd Inversion' },
  ],
  'Fm': [
    { notes: [midi('F', 4), midi('Ab', 4), midi('C', 5)], name: 'Root Position' },
    { notes: [midi('Ab', 4), midi('C', 5), midi('F', 5)], name: '1st Inversion' },
    { notes: [midi('C', 4), midi('F', 4), midi('Ab', 4)], name: '2nd Inversion' },
  ],
  'F#m': [
    { notes: [midi('F#', 4), midi('A', 4), midi('C#', 5)], name: 'Root Position' },
    { notes: [midi('A', 4), midi('C#', 5), midi('F#', 5)], name: '1st Inversion' },
  ],
  'Gbm': [
    { notes: [midi('Gb', 4), midi('A', 4), midi('Db', 5)], name: 'Root Position' },
  ],
  'Gm': [
    { notes: [midi('G', 4), midi('Bb', 4), midi('D', 5)], name: 'Root Position' },
    { notes: [midi('Bb', 4), midi('D', 5), midi('G', 5)], name: '1st Inversion' },
    { notes: [midi('D', 4), midi('G', 4), midi('Bb', 4)], name: '2nd Inversion' },
  ],
  'G#m': [
    { notes: [midi('G#', 4), midi('B', 4), midi('D#', 5)], name: 'Root Position' },
  ],
  'Abm': [
    { notes: [midi('Ab', 4), midi('B', 4), midi('Eb', 5)], name: 'Root Position' },
  ],
  'Am': [
    { notes: [midi('A', 4), midi('C', 5), midi('E', 5)], name: 'Root Position' },
    { notes: [midi('C', 4), midi('E', 4), midi('A', 4)], name: '1st Inversion' },
    { notes: [midi('E', 4), midi('A', 4), midi('C', 5)], name: '2nd Inversion' },
  ],
  'A#m': [
    { notes: [midi('A#', 4), midi('C#', 5), midi('F', 5)], name: 'Root Position' },
  ],
  'Bbm': [
    { notes: [midi('Bb', 4), midi('Db', 5), midi('F', 5)], name: 'Root Position' },
    { notes: [midi('Db', 4), midi('F', 4), midi('Bb', 4)], name: '1st Inversion' },
  ],
  'Bm': [
    { notes: [midi('B', 4), midi('D', 5), midi('F#', 5)], name: 'Root Position' },
    { notes: [midi('D', 4), midi('F#', 4), midi('B', 4)], name: '1st Inversion' },
    { notes: [midi('F#', 4), midi('B', 4), midi('D', 5)], name: '2nd Inversion' },
  ],

  // ========================
  // DOMINANT 7TH CHORDS (All 12 keys)
  // ========================
  'C7': [
    { notes: [midi('C', 4), midi('E', 4), midi('G', 4), midi('Bb', 4)], name: 'Root Position' },
    { notes: [midi('E', 4), midi('G', 4), midi('Bb', 4), midi('C', 5)], name: '1st Inversion' },
    { notes: [midi('C', 3), midi('E', 4), midi('G', 4), midi('Bb', 4)], name: 'Shell Voicing' },
  ],
  'C#7': [
    { notes: [midi('C#', 4), midi('F', 4), midi('G#', 4), midi('B', 4)], name: 'Root Position' },
  ],
  'Db7': [
    { notes: [midi('Db', 4), midi('F', 4), midi('Ab', 4), midi('B', 4)], name: 'Root Position' },
  ],
  'D7': [
    { notes: [midi('D', 4), midi('F#', 4), midi('A', 4), midi('C', 5)], name: 'Root Position' },
    { notes: [midi('F#', 4), midi('A', 4), midi('C', 5), midi('D', 5)], name: '1st Inversion' },
    { notes: [midi('D', 3), midi('F#', 4), midi('A', 4), midi('C', 5)], name: 'Shell Voicing' },
  ],
  'D#7': [
    { notes: [midi('D#', 4), midi('G', 4), midi('A#', 4), midi('C#', 5)], name: 'Root Position' },
  ],
  'Eb7': [
    { notes: [midi('Eb', 4), midi('G', 4), midi('Bb', 4), midi('Db', 5)], name: 'Root Position' },
  ],
  'E7': [
    { notes: [midi('E', 4), midi('G#', 4), midi('B', 4), midi('D', 5)], name: 'Root Position' },
    { notes: [midi('G#', 4), midi('B', 4), midi('D', 5), midi('E', 5)], name: '1st Inversion' },
    { notes: [midi('E', 3), midi('G#', 4), midi('B', 4), midi('D', 5)], name: 'Shell Voicing' },
  ],
  'F7': [
    { notes: [midi('F', 4), midi('A', 4), midi('C', 5), midi('Eb', 5)], name: 'Root Position' },
    { notes: [midi('F', 3), midi('A', 4), midi('C', 5), midi('Eb', 5)], name: 'Shell Voicing' },
  ],
  'F#7': [
    { notes: [midi('F#', 4), midi('A#', 4), midi('C#', 5), midi('E', 5)], name: 'Root Position' },
  ],
  'Gb7': [
    { notes: [midi('Gb', 4), midi('Bb', 4), midi('Db', 5), midi('E', 5)], name: 'Root Position' },
  ],
  'G7': [
    { notes: [midi('G', 4), midi('B', 4), midi('D', 5), midi('F', 5)], name: 'Root Position' },
    { notes: [midi('B', 4), midi('D', 5), midi('F', 5), midi('G', 5)], name: '1st Inversion' },
    { notes: [midi('G', 3), midi('B', 4), midi('D', 5), midi('F', 5)], name: 'Shell Voicing' },
  ],
  'G#7': [
    { notes: [midi('G#', 4), midi('C', 5), midi('D#', 5), midi('F#', 5)], name: 'Root Position' },
  ],
  'Ab7': [
    { notes: [midi('Ab', 4), midi('C', 5), midi('Eb', 5), midi('Gb', 5)], name: 'Root Position' },
  ],
  'A7': [
    { notes: [midi('A', 4), midi('C#', 5), midi('E', 5), midi('G', 5)], name: 'Root Position' },
    { notes: [midi('A', 3), midi('C#', 5), midi('E', 5), midi('G', 5)], name: 'Shell Voicing' },
  ],
  'A#7': [
    { notes: [midi('A#', 4), midi('D', 5), midi('F', 5), midi('G#', 5)], name: 'Root Position' },
  ],
  'Bb7': [
    { notes: [midi('Bb', 4), midi('D', 5), midi('F', 5), midi('Ab', 5)], name: 'Root Position' },
  ],
  'B7': [
    { notes: [midi('B', 4), midi('D#', 5), midi('F#', 5), midi('A', 5)], name: 'Root Position' },
    { notes: [midi('B', 3), midi('D#', 5), midi('F#', 5), midi('A', 5)], name: 'Shell Voicing' },
  ],

  // ========================
  // MINOR 7TH CHORDS (All 12 keys)
  // ========================
  'Cm7': [
    { notes: [midi('C', 4), midi('Eb', 4), midi('G', 4), midi('Bb', 4)], name: 'Root Position' },
    { notes: [midi('Eb', 4), midi('G', 4), midi('Bb', 4), midi('C', 5)], name: '1st Inversion' },
  ],
  'C#m7': [
    { notes: [midi('C#', 4), midi('E', 4), midi('G#', 4), midi('B', 4)], name: 'Root Position' },
  ],
  'Dbm7': [
    { notes: [midi('Db', 4), midi('E', 4), midi('Ab', 4), midi('B', 4)], name: 'Root Position' },
  ],
  'Dm7': [
    { notes: [midi('D', 4), midi('F', 4), midi('A', 4), midi('C', 5)], name: 'Root Position' },
    { notes: [midi('F', 4), midi('A', 4), midi('C', 5), midi('D', 5)], name: '1st Inversion' },
  ],
  'D#m7': [
    { notes: [midi('D#', 4), midi('F#', 4), midi('A#', 4), midi('C#', 5)], name: 'Root Position' },
  ],
  'Ebm7': [
    { notes: [midi('Eb', 4), midi('Gb', 4), midi('Bb', 4), midi('Db', 5)], name: 'Root Position' },
  ],
  'Em7': [
    { notes: [midi('E', 4), midi('G', 4), midi('B', 4), midi('D', 5)], name: 'Root Position' },
    { notes: [midi('G', 4), midi('B', 4), midi('D', 5), midi('E', 5)], name: '1st Inversion' },
  ],
  'Fm7': [
    { notes: [midi('F', 4), midi('Ab', 4), midi('C', 5), midi('Eb', 5)], name: 'Root Position' },
  ],
  'F#m7': [
    { notes: [midi('F#', 4), midi('A', 4), midi('C#', 5), midi('E', 5)], name: 'Root Position' },
  ],
  'Gbm7': [
    { notes: [midi('Gb', 4), midi('A', 4), midi('Db', 5), midi('E', 5)], name: 'Root Position' },
  ],
  'Gm7': [
    { notes: [midi('G', 4), midi('Bb', 4), midi('D', 5), midi('F', 5)], name: 'Root Position' },
    { notes: [midi('Bb', 4), midi('D', 5), midi('F', 5), midi('G', 5)], name: '1st Inversion' },
  ],
  'G#m7': [
    { notes: [midi('G#', 4), midi('B', 4), midi('D#', 5), midi('F#', 5)], name: 'Root Position' },
  ],
  'Abm7': [
    { notes: [midi('Ab', 4), midi('B', 4), midi('Eb', 5), midi('Gb', 5)], name: 'Root Position' },
  ],
  'Am7': [
    { notes: [midi('A', 4), midi('C', 5), midi('E', 5), midi('G', 5)], name: 'Root Position' },
    { notes: [midi('C', 4), midi('E', 4), midi('G', 4), midi('A', 4)], name: '1st Inversion' },
  ],
  'A#m7': [
    { notes: [midi('A#', 4), midi('C#', 5), midi('F', 5), midi('G#', 5)], name: 'Root Position' },
  ],
  'Bbm7': [
    { notes: [midi('Bb', 4), midi('Db', 5), midi('F', 5), midi('Ab', 5)], name: 'Root Position' },
  ],
  'Bm7': [
    { notes: [midi('B', 4), midi('D', 5), midi('F#', 5), midi('A', 5)], name: 'Root Position' },
    { notes: [midi('D', 4), midi('F#', 4), midi('A', 4), midi('B', 4)], name: '1st Inversion' },
  ],

  // ========================
  // MAJOR 7TH CHORDS (All 12 keys)
  // ========================
  'Cmaj7': [
    { notes: [midi('C', 4), midi('E', 4), midi('G', 4), midi('B', 4)], name: 'Root Position' },
    { notes: [midi('E', 4), midi('G', 4), midi('B', 4), midi('C', 5)], name: '1st Inversion' },
  ],
  'C#maj7': [
    { notes: [midi('C#', 4), midi('F', 4), midi('G#', 4), midi('C', 5)], name: 'Root Position' },
  ],
  'Dbmaj7': [
    { notes: [midi('Db', 4), midi('F', 4), midi('Ab', 4), midi('C', 5)], name: 'Root Position' },
  ],
  'Dmaj7': [
    { notes: [midi('D', 4), midi('F#', 4), midi('A', 4), midi('C#', 5)], name: 'Root Position' },
    { notes: [midi('F#', 4), midi('A', 4), midi('C#', 5), midi('D', 5)], name: '1st Inversion' },
  ],
  'D#maj7': [
    { notes: [midi('D#', 4), midi('G', 4), midi('A#', 4), midi('D', 5)], name: 'Root Position' },
  ],
  'Ebmaj7': [
    { notes: [midi('Eb', 4), midi('G', 4), midi('Bb', 4), midi('D', 5)], name: 'Root Position' },
  ],
  'Emaj7': [
    { notes: [midi('E', 4), midi('G#', 4), midi('B', 4), midi('D#', 5)], name: 'Root Position' },
  ],
  'Fmaj7': [
    { notes: [midi('F', 4), midi('A', 4), midi('C', 5), midi('E', 5)], name: 'Root Position' },
    { notes: [midi('A', 4), midi('C', 5), midi('E', 5), midi('F', 5)], name: '1st Inversion' },
  ],
  'F#maj7': [
    { notes: [midi('F#', 4), midi('A#', 4), midi('C#', 5), midi('F', 5)], name: 'Root Position' },
  ],
  'Gbmaj7': [
    { notes: [midi('Gb', 4), midi('Bb', 4), midi('Db', 5), midi('F', 5)], name: 'Root Position' },
  ],
  'Gmaj7': [
    { notes: [midi('G', 4), midi('B', 4), midi('D', 5), midi('F#', 5)], name: 'Root Position' },
    { notes: [midi('B', 4), midi('D', 5), midi('F#', 5), midi('G', 5)], name: '1st Inversion' },
  ],
  'G#maj7': [
    { notes: [midi('G#', 4), midi('C', 5), midi('D#', 5), midi('G', 5)], name: 'Root Position' },
  ],
  'Abmaj7': [
    { notes: [midi('Ab', 4), midi('C', 5), midi('Eb', 5), midi('G', 5)], name: 'Root Position' },
  ],
  'Amaj7': [
    { notes: [midi('A', 4), midi('C#', 5), midi('E', 5), midi('G#', 5)], name: 'Root Position' },
  ],
  'A#maj7': [
    { notes: [midi('A#', 4), midi('D', 5), midi('F', 5), midi('A', 5)], name: 'Root Position' },
  ],
  'Bbmaj7': [
    { notes: [midi('Bb', 4), midi('D', 5), midi('F', 5), midi('A', 5)], name: 'Root Position' },
  ],
  'Bmaj7': [
    { notes: [midi('B', 4), midi('D#', 5), midi('F#', 5), midi('A#', 5)], name: 'Root Position' },
  ],

  // ========================
  // SUS CHORDS
  // ========================
  'Csus2': [
    { notes: [midi('C', 4), midi('D', 4), midi('G', 4)], name: 'Root Position' },
  ],
  'Csus4': [
    { notes: [midi('C', 4), midi('F', 4), midi('G', 4)], name: 'Root Position' },
  ],
  'Dsus2': [
    { notes: [midi('D', 4), midi('E', 4), midi('A', 4)], name: 'Root Position' },
  ],
  'Dsus4': [
    { notes: [midi('D', 4), midi('G', 4), midi('A', 4)], name: 'Root Position' },
  ],
  'Esus2': [
    { notes: [midi('E', 4), midi('F#', 4), midi('B', 4)], name: 'Root Position' },
  ],
  'Esus4': [
    { notes: [midi('E', 4), midi('A', 4), midi('B', 4)], name: 'Root Position' },
  ],
  'Fsus2': [
    { notes: [midi('F', 4), midi('G', 4), midi('C', 5)], name: 'Root Position' },
  ],
  'Fsus4': [
    { notes: [midi('F', 4), midi('Bb', 4), midi('C', 5)], name: 'Root Position' },
  ],
  'Gsus2': [
    { notes: [midi('G', 4), midi('A', 4), midi('D', 5)], name: 'Root Position' },
  ],
  'Gsus4': [
    { notes: [midi('G', 4), midi('C', 5), midi('D', 5)], name: 'Root Position' },
  ],
  'Asus2': [
    { notes: [midi('A', 4), midi('B', 4), midi('E', 5)], name: 'Root Position' },
  ],
  'Asus4': [
    { notes: [midi('A', 4), midi('D', 5), midi('E', 5)], name: 'Root Position' },
  ],
  'Bsus2': [
    { notes: [midi('B', 4), midi('C#', 5), midi('F#', 5)], name: 'Root Position' },
  ],
  'Bsus4': [
    { notes: [midi('B', 4), midi('E', 5), midi('F#', 5)], name: 'Root Position' },
  ],
  'B4': [
    { notes: [midi('B', 4), midi('E', 5), midi('F#', 5)], name: 'Root Position' },
  ],
  'A4': [
    { notes: [midi('A', 4), midi('D', 5), midi('E', 5)], name: 'Root Position' },
  ],

  // ========================
  // DIMINISHED AND AUGMENTED
  // ========================
  'Cdim': [
    { notes: [midi('C', 4), midi('Eb', 4), midi('Gb', 4)], name: 'Root Position' },
  ],
  'Ddim': [
    { notes: [midi('D', 4), midi('F', 4), midi('Ab', 4)], name: 'Root Position' },
  ],
  'Edim': [
    { notes: [midi('E', 4), midi('G', 4), midi('Bb', 4)], name: 'Root Position' },
  ],
  'Fdim': [
    { notes: [midi('F', 4), midi('Ab', 4), midi('B', 4)], name: 'Root Position' },
  ],
  'Gdim': [
    { notes: [midi('G', 4), midi('Bb', 4), midi('Db', 5)], name: 'Root Position' },
  ],
  'Adim': [
    { notes: [midi('A', 4), midi('C', 5), midi('Eb', 5)], name: 'Root Position' },
  ],
  'Bdim': [
    { notes: [midi('B', 4), midi('D', 5), midi('F', 5)], name: 'Root Position' },
  ],
  'Caug': [
    { notes: [midi('C', 4), midi('E', 4), midi('G#', 4)], name: 'Root Position' },
  ],
  'Daug': [
    { notes: [midi('D', 4), midi('F#', 4), midi('A#', 4)], name: 'Root Position' },
  ],
  'Eaug': [
    { notes: [midi('E', 4), midi('G#', 4), midi('C', 5)], name: 'Root Position' },
  ],
  'Faug': [
    { notes: [midi('F', 4), midi('A', 4), midi('C#', 5)], name: 'Root Position' },
  ],
  'Gaug': [
    { notes: [midi('G', 4), midi('B', 4), midi('D#', 5)], name: 'Root Position' },
  ],
  'Aaug': [
    { notes: [midi('A', 4), midi('C#', 5), midi('F', 5)], name: 'Root Position' },
  ],
  'Baug': [
    { notes: [midi('B', 4), midi('D#', 5), midi('G', 5)], name: 'Root Position' },
  ],

  // ========================
  // ADD9 and 9TH CHORDS
  // ========================
  'Cadd9': [
    { notes: [midi('C', 4), midi('E', 4), midi('G', 4), midi('D', 5)], name: 'Root Position' },
  ],
  'Dadd9': [
    { notes: [midi('D', 4), midi('F#', 4), midi('A', 4), midi('E', 5)], name: 'Root Position' },
  ],
  'Eadd9': [
    { notes: [midi('E', 4), midi('G#', 4), midi('B', 4), midi('F#', 5)], name: 'Root Position' },
  ],
  'Fadd9': [
    { notes: [midi('F', 4), midi('A', 4), midi('C', 5), midi('G', 5)], name: 'Root Position' },
  ],
  'Gadd9': [
    { notes: [midi('G', 4), midi('B', 4), midi('D', 5), midi('A', 5)], name: 'Root Position' },
  ],
  'Aadd9': [
    { notes: [midi('A', 4), midi('C#', 5), midi('E', 5), midi('B', 5)], name: 'Root Position' },
  ],
  'Badd9': [
    { notes: [midi('B', 4), midi('D#', 5), midi('F#', 5), midi('C#', 6)], name: 'Root Position' },
  ],
  'C9': [
    { notes: [midi('C', 4), midi('E', 4), midi('G', 4), midi('Bb', 4), midi('D', 5)], name: 'Root Position' },
  ],
  'D9': [
    { notes: [midi('D', 4), midi('F#', 4), midi('A', 4), midi('C', 5), midi('E', 5)], name: 'Root Position' },
  ],
  'E9': [
    { notes: [midi('E', 4), midi('G#', 4), midi('B', 4), midi('D', 5), midi('F#', 5)], name: 'Root Position' },
  ],
  'G9': [
    { notes: [midi('G', 4), midi('B', 4), midi('D', 5), midi('F', 5), midi('A', 5)], name: 'Root Position' },
  ],
  'A9': [
    { notes: [midi('A', 4), midi('C#', 5), midi('E', 5), midi('G', 5), midi('B', 5)], name: 'Root Position' },
  ],

  // ========================
  // 6TH CHORDS
  // ========================
  'C6': [
    { notes: [midi('C', 4), midi('E', 4), midi('G', 4), midi('A', 4)], name: 'Root Position' },
  ],
  'D6': [
    { notes: [midi('D', 4), midi('F#', 4), midi('A', 4), midi('B', 4)], name: 'Root Position' },
  ],
  'E6': [
    { notes: [midi('E', 4), midi('G#', 4), midi('B', 4), midi('C#', 5)], name: 'Root Position' },
  ],
  'F6': [
    { notes: [midi('F', 4), midi('A', 4), midi('C', 5), midi('D', 5)], name: 'Root Position' },
  ],
  'G6': [
    { notes: [midi('G', 4), midi('B', 4), midi('D', 5), midi('E', 5)], name: 'Root Position' },
  ],
  'A6': [
    { notes: [midi('A', 4), midi('C#', 5), midi('E', 5), midi('F#', 5)], name: 'Root Position' },
  ],
  'B6': [
    { notes: [midi('B', 4), midi('D#', 5), midi('F#', 5), midi('G#', 5)], name: 'Root Position' },
  ],

  // Common additional chords
  'Em9': [
    { notes: [midi('E', 4), midi('G', 4), midi('B', 4), midi('D', 5), midi('F#', 5)], name: 'Root Position' },
  ],
  'Am9': [
    { notes: [midi('A', 4), midi('C', 5), midi('E', 5), midi('G', 5), midi('B', 5)], name: 'Root Position' },
  ],
  'F#mb5': [
    { notes: [midi('F#', 4), midi('A', 4), midi('C', 5)], name: 'Root Position' },
  ],
  'F#m7b5': [
    { notes: [midi('F#', 4), midi('A', 4), midi('C', 5), midi('E', 5)], name: 'Root Position' },
  ],
  'Bm7b5': [
    { notes: [midi('B', 4), midi('D', 5), midi('F', 5), midi('A', 5)], name: 'Root Position' },
  ],
}

// Get piano chord positions
export function getPianoChordPositions(chordName: string): PianoChordPosition[] {
  // Try exact match first
  if (pianoChordLibrary[chordName]) {
    return pianoChordLibrary[chordName]
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
      if (pianoChordLibrary[converted]) {
        return pianoChordLibrary[converted]
      }
    }
  }
  
  for (const [from, to] of Object.entries(sharpToFlat)) {
    if (chordName.startsWith(from)) {
      const converted = to + chordName.slice(2)
      if (pianoChordLibrary[converted]) {
        return pianoChordLibrary[converted]
      }
    }
  }
  
  return []
}

// Check if piano chord exists
export function hasPianoChord(chordName: string): boolean {
  return getPianoChordPositions(chordName).length > 0
}

// Convert MIDI note to note name for display
export function midiToNoteName(midi: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const octave = Math.floor(midi / 12) - 1
  const note = noteNames[midi % 12]
  return `${note}${octave}`
}

// Check if a MIDI note is a black key
export function isBlackKey(midi: number): boolean {
  const note = midi % 12
  return [1, 3, 6, 8, 10].includes(note) // C#, D#, F#, G#, A#
}
