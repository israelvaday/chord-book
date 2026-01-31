'use client'

import { useState } from 'react'
import { ChordPosition, getChordPositions } from '@/lib/chord-library'
import { getPianoChordPositions, midiToNoteName, isBlackKey, type PianoChordPosition } from '@/lib/piano-chord-library'
import { ChevronLeft, ChevronRight, Guitar, Piano, HelpCircle } from 'lucide-react'

type Instrument = 'guitar' | 'piano'

interface Props {
  chord: string
  size?: 'normal' | 'large'
  positionIndex?: number
  onPositionChange?: (index: number) => void
  showNavigation?: boolean
}

// Chord type explanations for beginners
const chordExplanations: Record<string, string> = {
  // Basic types
  'm': 'Minor chord - Sad, melancholic sound',
  'maj': 'Major chord - Happy, bright sound',
  '7': 'Dominant 7th - Bluesy, tension sound',
  'maj7': 'Major 7th - Jazzy, dreamy sound',
  'm7': 'Minor 7th - Smooth, mellow jazz sound',
  'dim': 'Diminished - Tense, unstable, spooky sound',
  'dim7': 'Diminished 7th - Very tense, dramatic sound',
  'aug': 'Augmented - Dreamy, suspended, unresolved',
  'aug7': 'Augmented 7th - Jazzy with tension',
  'sus2': 'Suspended 2nd - Open, airy sound (no 3rd)',
  'sus4': 'Suspended 4th - Wanting to resolve (no 3rd)',
  'sus': 'Suspended - Open sound, wants to resolve',
  'add9': 'Add 9th - Richer major with extra color',
  'add11': 'Add 11th - Spacious, open sound',
  '9': '9th chord - Full, rich dominant sound',
  'maj9': 'Major 9th - Lush, sophisticated jazz',
  'm9': 'Minor 9th - Smooth, soulful minor',
  '11': '11th chord - Very full, stacked sound',
  'm11': 'Minor 11th - Dark, complex minor',
  '13': '13th chord - Maximum richness, full jazz',
  '6': '6th chord - Sweet, vintage sound',
  'm6': 'Minor 6th - Minor with sweet color',
  '7sus4': '7sus4 - Dominant with suspension',
  '7#9': '7#9 - The "Hendrix chord" - Purple Haze!',
  '7b9': '7b9 - Tension chord, wants to resolve',
  'm7b5': 'Half-diminished - Sad, unstable, jazzy',
  '5': 'Power chord - No 3rd, heavy rock sound',
  '/': 'Slash chord - Different bass note under chord',
}

function getChordExplanation(chordName: string): string {
  // Check for slash chord first
  if (chordName.includes('/')) {
    return chordExplanations['/']
  }
  
  // Extract the chord type from name (e.g., "Am7" -> "m7", "Cmaj9" -> "maj9")
  const root = chordName.match(/^[A-G][#b]?/)?.[0] || ''
  const type = chordName.slice(root.length)
  
  // Try exact match first
  if (chordExplanations[type]) {
    return chordExplanations[type]
  }
  
  // Try partial matches for complex chords
  for (const [key, explanation] of Object.entries(chordExplanations)) {
    if (type.includes(key) && key.length > 1) {
      return explanation
    }
  }
  
  // Check for minor
  if (type.startsWith('m') && !type.startsWith('maj')) {
    return chordExplanations['m']
  }
  
  // Default for major chords (no suffix)
  if (!type || type === '') {
    return 'Major chord - Happy, bright sound'
  }
  
  return 'A chord variation'
}

// Piano keyboard component - proper key layout
function PianoKeyboard({ chordPosition, isLarge }: { chordPosition: PianoChordPosition; isLarge: boolean }) {
  const notes = chordPosition.notes
  
  if (!notes || notes.length === 0) {
    return <div className="text-zinc-500 text-sm">No piano data</div>
  }
  
  // Piano key pattern: C=0, C#=1, D=2, D#=3, E=4, F=5, F#=6, G=7, G#=8, A=9, A#=10, B=11
  // White keys: C(0), D(2), E(4), F(5), G(7), A(9), B(11)
  // Black keys: C#(1), D#(3), F#(6), G#(8), A#(10)
  
  const whiteKeyNotes = [0, 2, 4, 5, 7, 9, 11] // C, D, E, F, G, A, B
  const blackKeyNotes = [1, 3, 6, 8, 10] // C#, D#, F#, G#, A#
  
  // Find range - start from C below lowest note
  const minNote = Math.min(...notes)
  const maxNote = Math.max(...notes)
  const startOctave = Math.floor(minNote / 12)
  const endOctave = Math.floor(maxNote / 12) + 1
  
  // Start from C of start octave
  const startMidi = startOctave * 12
  const endMidi = (endOctave * 12) + 11
  
  const whiteKeyWidth = isLarge ? 28 : 18
  const whiteKeyHeight = isLarge ? 100 : 65
  const blackKeyWidth = isLarge ? 18 : 12
  const blackKeyHeight = isLarge ? 60 : 40
  
  // Build white keys array
  const whiteKeys: number[] = []
  for (let midi = startMidi; midi <= endMidi; midi++) {
    if (whiteKeyNotes.includes(midi % 12)) {
      whiteKeys.push(midi)
    }
  }
  
  const totalWidth = whiteKeys.length * whiteKeyWidth
  
  // Check if key should be pressed
  const isPressed = (midi: number): boolean => notes.includes(midi)
  
  // Get black key position relative to white keys
  // Black keys sit between white keys:
  // C#/Db between C and D
  // D#/Eb between D and E  
  // F#/Gb between F and G
  // G#/Ab between G and A
  // A#/Bb between A and B
  const getBlackKeyPosition = (midi: number): number | null => {
    const noteInOctave = midi % 12
    if (!blackKeyNotes.includes(noteInOctave)) return null
    
    // Find the white key before this black key
    const whiteKeyBefore = noteInOctave === 1 ? midi - 1 : // C# -> C
                          noteInOctave === 3 ? midi - 1 : // D# -> D
                          noteInOctave === 6 ? midi - 1 : // F# -> F
                          noteInOctave === 8 ? midi - 1 : // G# -> G
                          noteInOctave === 10 ? midi - 1 : // A# -> A
                          null
    
    if (whiteKeyBefore === null) return null
    
    const whiteKeyIndex = whiteKeys.indexOf(whiteKeyBefore)
    if (whiteKeyIndex === -1) return null
    
    // Position black key at the edge between two white keys
    return (whiteKeyIndex + 1) * whiteKeyWidth - blackKeyWidth / 2
  }
  
  // Get all black keys in range
  const blackKeysList: number[] = []
  for (let midi = startMidi; midi <= endMidi; midi++) {
    if (blackKeyNotes.includes(midi % 12)) {
      blackKeysList.push(midi)
    }
  }
  
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const getNoteName = (midi: number): string => noteNames[midi % 12]
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative border-2 border-zinc-600 rounded-b-lg overflow-hidden" style={{ width: totalWidth, height: whiteKeyHeight }}>
        {/* White keys */}
        {whiteKeys.map((midi, idx) => {
          const pressed = isPressed(midi)
          return (
            <div
              key={`white-${midi}`}
              className={`absolute border-r border-gray-300 transition-all ${
                pressed
                  ? 'bg-emerald-400'
                  : 'bg-white'
              }`}
              style={{
                left: idx * whiteKeyWidth,
                top: 0,
                width: whiteKeyWidth,
                height: whiteKeyHeight,
              }}
            >
              {pressed && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center ${isLarge ? 'w-6 h-6' : ''}`}>
                    <span className={`font-bold text-white ${isLarge ? 'text-xs' : 'text-[8px]'}`}>
                      {getNoteName(midi)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        
        {/* Black keys */}
        {blackKeysList.map((midi) => {
          const xPos = getBlackKeyPosition(midi)
          if (xPos === null) return null
          
          const pressed = isPressed(midi)
          return (
            <div
              key={`black-${midi}`}
              className={`absolute rounded-b-md z-10 transition-all ${
                pressed
                  ? 'bg-emerald-500'
                  : 'bg-zinc-900'
              }`}
              style={{
                left: xPos,
                top: 0,
                width: blackKeyWidth,
                height: blackKeyHeight,
              }}
            >
              {pressed && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                  <div className={`w-4 h-4 rounded-full bg-emerald-300 flex items-center justify-center ${isLarge ? 'w-5 h-5' : 'w-3 h-3'}`}>
                    <span className={`font-bold text-emerald-900 ${isLarge ? 'text-[8px]' : 'text-[6px]'}`}>
                      {getNoteName(midi).replace('#', '')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Finger position guide */}
      <div className="text-center">
        <div className="text-[10px] text-zinc-500 mb-1">Press these keys:</div>
        <div className="flex gap-1 justify-center flex-wrap">
          {notes.map((n, i) => (
            <span key={i} className="bg-emerald-500 text-white px-2 py-0.5 rounded text-xs font-bold">
              {getNoteName(n)}{Math.floor(n / 12) - 1}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ChordDiagram({ chord, size = 'normal', positionIndex = 0, onPositionChange, showNavigation = false }: Props) {
  const [instrument, setInstrument] = useState<Instrument>('guitar')
  const [pianoPositionIndex, setPianoPositionIndex] = useState(0)
  
  // Get positions for both instruments
  const guitarPositions = getChordPositions(chord)
  const pianoPositions = getPianoChordPositions(chord)
  
  const hasGuitar = guitarPositions.length > 0
  const hasPiano = pianoPositions.length > 0
  
  // If no positions available for current instrument, try other
  const effectiveInstrument = instrument === 'guitar' 
    ? (hasGuitar ? 'guitar' : (hasPiano ? 'piano' : 'guitar'))
    : (hasPiano ? 'piano' : (hasGuitar ? 'guitar' : 'piano'))
  
  // If no positions available at all, show empty state
  if (!hasGuitar && !hasPiano) {
    return (
      <div className={`bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 rounded-xl shadow-lg border border-zinc-600/30 ${size === 'large' ? 'min-w-[200px]' : 'min-w-[110px]'}`}>
        <div className={`text-center font-bold text-zinc-400 mb-3 ${size === 'large' ? 'text-2xl' : 'text-lg'}`}>{chord}</div>
        <div className="text-center text-zinc-500 text-sm py-4">No diagram available</div>
      </div>
    )
  }
  
  const isLarge = size === 'large'
  
  // Guitar diagram setup
  const guitarCurrentIndex = Math.max(0, Math.min(positionIndex, guitarPositions.length - 1))
  const guitarPosition = guitarPositions[guitarCurrentIndex]
  const guitarHasMultiple = guitarPositions.length > 1
  
  // Piano setup
  const pianoCurrentIndex = Math.max(0, Math.min(pianoPositionIndex, pianoPositions.length - 1))
  const pianoPosition = pianoPositions[pianoCurrentIndex]
  const pianoHasMultiple = pianoPositions.length > 1

  const goToPrevious = () => {
    if (effectiveInstrument === 'guitar') {
      const newIndex = guitarCurrentIndex === 0 ? guitarPositions.length - 1 : guitarCurrentIndex - 1
      onPositionChange?.(newIndex)
    } else {
      const newIndex = pianoCurrentIndex === 0 ? pianoPositions.length - 1 : pianoCurrentIndex - 1
      setPianoPositionIndex(newIndex)
    }
  }

  const goToNext = () => {
    if (effectiveInstrument === 'guitar') {
      const newIndex = (guitarCurrentIndex + 1) % guitarPositions.length
      onPositionChange?.(newIndex)
    } else {
      const newIndex = (pianoCurrentIndex + 1) % pianoPositions.length
      setPianoPositionIndex(newIndex)
    }
  }

  const currentPosition = effectiveInstrument === 'guitar' ? guitarPosition : pianoPosition
  const currentIndex = effectiveInstrument === 'guitar' ? guitarCurrentIndex : pianoCurrentIndex
  const hasMultiplePositions = effectiveInstrument === 'guitar' ? guitarHasMultiple : pianoHasMultiple
  const positionsCount = effectiveInstrument === 'guitar' ? guitarPositions.length : pianoPositions.length

  // Expanded viewBox to make room for fret number on left
  const width = isLarge ? 200 : 100
  const height = isLarge ? 220 : 110
  const viewBox = "-15 0 115 120"  // Extra space on left for fret number

  return (
    <div className={`bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 rounded-xl shadow-lg border border-emerald-500/30 hover:border-emerald-400/60 transition-all ${isLarge ? 'min-w-[260px]' : 'min-w-[130px]'}`}>
      {/* Header with chord name */}
      <div className={`text-center font-bold text-emerald-400 mb-2 ${isLarge ? 'text-2xl' : 'text-lg'}`}>{chord}</div>
      
      {/* Instrument tabs - only show if both are available */}
      {hasGuitar && hasPiano && (showNavigation || isLarge) && (
        <div className="flex justify-center gap-1 mb-3">
          <button
            onClick={(e) => { e.stopPropagation(); setInstrument('guitar') }}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
              effectiveInstrument === 'guitar'
                ? 'bg-emerald-500 text-white'
                : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
            }`}
          >
            <Guitar className="h-3 w-3" />
            Guitar
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setInstrument('piano') }}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
              effectiveInstrument === 'piano'
                ? 'bg-emerald-500 text-white'
                : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
            }`}
          >
            <Piano className="h-3 w-3" />
            Piano
          </button>
        </div>
      )}
      
      {/* Position name and navigation */}
      {(showNavigation || isLarge) && hasMultiplePositions && (
        <div className="flex items-center justify-center gap-2 mb-2">
          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious() }}
            className="p-1 rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs text-zinc-400 min-w-[80px] text-center">
            {currentPosition?.name || `Position ${currentIndex + 1}`}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); goToNext() }}
            className="p-1 rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {/* Position dots indicator */}
      {(showNavigation || isLarge) && hasMultiplePositions && (
        <div className="flex justify-center gap-1 mb-2">
          {Array.from({ length: positionsCount }).map((_, i) => (
            <button
              key={i}
              onClick={(e) => { 
                e.stopPropagation()
                if (effectiveInstrument === 'guitar') {
                  onPositionChange?.(i)
                } else {
                  setPianoPositionIndex(i)
                }
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentIndex ? 'bg-emerald-400' : 'bg-zinc-600 hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Guitar Diagram */}
      {effectiveInstrument === 'guitar' && guitarPosition && (
        <>
          <svg width={width} height={height} viewBox={viewBox} className="mx-auto">
            {/* Nut or fret number indicator */}
            {guitarPosition.baseFret === 1 ? (
              <rect x="15" y="20" width="70" height="5" fill="#e4e4e7" rx="2" />
            ) : (
              <>
                {/* Fret number - positioned clearly to the left */}
                <rect x="-12" y="28" width="18" height="18" fill="#10b981" rx="4" />
                <text x="-3" y="42" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">{guitarPosition.baseFret}</text>
                {/* Small "fr" label */}
                <text x="-3" y="52" fill="#10b981" fontSize="6" textAnchor="middle">fr</text>
              </>
            )}
            
            {/* Strings */}
            {[0,1,2,3,4,5].map(i => (
              <line key={`s${i}`} x1={15+i*14} y1="22" x2={15+i*14} y2="100" stroke="#52525b" strokeWidth={i<3?2:1} />
            ))}
            
            {/* Frets */}
            {[0,1,2,3,4].map(i => (
              <line key={`f${i}`} x1="15" y1={22+i*20} x2="85" y2={22+i*20} stroke="#3f3f46" />
            ))}
            
            {/* Barres */}
            {guitarPosition.barres?.map((b, i) => {
              const fretPosition = guitarPosition.baseFret === 1 ? b : b - guitarPosition.baseFret + 1
              return (
                <rect key={`b${i}`} x="12" y={22+(fretPosition-0.5)*20-7} width="76" height="14" rx="7" fill="#10b981" opacity="0.8" />
              )
            })}
            
            {/* Fingers */}
            {guitarPosition.frets.map((f, i) => {
              if (f === -1) return <text key={i} x={15+i*14} y="15" textAnchor="middle" fill="#f87171" fontSize="14" fontWeight="bold">✕</text>
              if (f === 0) return <circle key={i} cx={15+i*14} cy="12" r="5" fill="none" stroke="#10b981" strokeWidth="2" />
              const displayFret = guitarPosition.baseFret === 1 ? f : f - guitarPosition.baseFret + 1
              return <circle key={i} cx={15+i*14} cy={22+(displayFret-0.5)*20} r="7" fill="#10b981" />
            })}
          </svg>
          
          {/* Fret numbers for large view - with better styling */}
          {isLarge && (
            <div className="flex justify-center gap-2 mt-3">
              {guitarPosition.frets.map((f, i) => (
                <span key={i} className={`w-6 h-6 flex items-center justify-center text-xs rounded ${
                  f === -1 ? 'text-red-400 font-bold' : 
                  f === 0 ? 'text-emerald-400 font-bold' : 
                  'bg-zinc-700 text-zinc-300'
                }`}>
                  {f === -1 ? 'X' : f === 0 ? 'O' : f}
                </span>
              ))}
            </div>
          )}
        </>
      )}
      
      {/* Piano Diagram */}
      {effectiveInstrument === 'piano' && pianoPosition && (
        <div className="flex justify-center py-2">
          <PianoKeyboard chordPosition={pianoPosition} isLarge={isLarge} />
        </div>
      )}
      
      {/* Beginner explanation - only show in large view */}
      {isLarge && (
        <div className="mt-3 pt-3 border-t border-zinc-700/50">
          <p className="text-xs text-zinc-400 text-center italic mb-2">
            {getChordExplanation(chord)}
          </p>
          
          {/* Legend for guitar diagram - compact */}
          {effectiveInstrument === 'guitar' && guitarPosition && (
            <div className="flex justify-center gap-4 text-[10px] text-zinc-500">
              <span className="flex items-center gap-1">
                <span className="text-red-400">✕</span> Mute
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full border border-emerald-400"></span> Open
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Press
              </span>
              {guitarPosition.baseFret > 1 && (
                <span className="flex items-center gap-1">
                  <span className="bg-emerald-500 text-white px-1 rounded text-[8px]">{guitarPosition.baseFret}</span> Fret
                </span>
              )}
            </div>
          )}
          
          {/* Legend for piano - compact */}
          {effectiveInstrument === 'piano' && (
            <div className="flex justify-center text-[10px] text-zinc-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-2 rounded-sm bg-emerald-400"></span> Press these keys
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
