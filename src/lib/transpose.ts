import { Chord, Note } from 'tonal'

// All chord names in order
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const FLAT_NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

export function transposeChord(chord: string, semitones: number): string {
  if (semitones === 0) return chord
  
  // Parse chord - e.g., "Am7", "C#maj7", "Bb"
  const match = chord.match(/^([A-G][#b]?)(.*)$/)
  if (!match) return chord
  
  const [, root, suffix] = match
  
  // Normalize the root note
  let noteIndex = NOTES.indexOf(root)
  if (noteIndex === -1) {
    noteIndex = FLAT_NOTES.indexOf(root)
  }
  if (noteIndex === -1) return chord
  
  // Transpose
  const newIndex = ((noteIndex + semitones) % 12 + 12) % 12
  
  // Use sharps or flats based on original
  const useFlats = root.includes('b')
  const newRoot = useFlats ? FLAT_NOTES[newIndex] : NOTES[newIndex]
  
  return newRoot + suffix
}

export function transposeContent(content: string, semitones: number): string {
  if (semitones === 0) return content
  
  // Replace all [ch]CHORD[/ch] patterns
  return content.replace(/\[ch\](.*?)\[\/ch\]/g, (match, chord) => {
    return `[ch]${transposeChord(chord, semitones)}[/ch]`
  })
}

export function getKeyName(semitones: number): string {
  const keys = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B']
  return keys[((semitones % 12) + 12) % 12]
}
