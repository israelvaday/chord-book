'use client'

import { midiToNoteName, isBlackKey, type PianoChordPosition } from '@/lib/piano-chord-library'

interface PianoChordDiagramProps {
  chord: PianoChordPosition
  chordName: string
}

export function PianoChordDiagram({ chord, chordName }: PianoChordDiagramProps) {
  // Find the range of notes to display (typically 2 octaves centered around chord)
  const minNote = Math.min(...chord.notes)
  const maxNote = Math.max(...chord.notes)
  
  // Start from a C below the lowest note and end at a B above the highest
  const startOctave = Math.floor((minNote - 2) / 12)
  const endOctave = Math.floor((maxNote + 2) / 12)
  
  const startMidi = startOctave * 12 + 12 // Start at C
  const endMidi = (endOctave + 1) * 12 + 12 // End at B
  
  // Ensure we show at least 14 white keys (2 octaves)
  const minRange = 14
  
  // Build the keyboard
  const whiteKeys: number[] = []
  const blackKeys: number[] = []
  
  for (let midi = startMidi; midi <= endMidi; midi++) {
    if (isBlackKey(midi)) {
      blackKeys.push(midi)
    } else {
      whiteKeys.push(midi)
    }
  }
  
  // Ensure minimum display
  while (whiteKeys.length < minRange) {
    const nextMidi = whiteKeys[whiteKeys.length - 1] + 1
    if (!isBlackKey(nextMidi)) {
      whiteKeys.push(nextMidi)
    } else {
      blackKeys.push(nextMidi)
      whiteKeys.push(nextMidi + 1)
    }
  }
  
  const whiteKeyWidth = 24
  const whiteKeyHeight = 80
  const blackKeyWidth = 16
  const blackKeyHeight = 50
  
  const totalWidth = whiteKeys.length * whiteKeyWidth
  
  // Map white key index to get black key position
  const getBlackKeyX = (midi: number): number | null => {
    const baseNote = midi % 12
    // Black keys are after C, D, F, G, A (indices 1, 3, 6, 8, 10)
    const whiteBeforeBlack = [0, 2, 5, 7, 9] // C, D, F, G, A
    const blackNotes = [1, 3, 6, 8, 10] // C#, D#, F#, G#, A#
    
    if (!blackNotes.includes(baseNote)) return null
    
    // Find the white key before this black key
    const whiteKeyBefore = midi - 1
    if (!isBlackKey(whiteKeyBefore)) {
      const whiteIdx = whiteKeys.indexOf(whiteKeyBefore)
      if (whiteIdx >= 0) {
        return whiteIdx * whiteKeyWidth + whiteKeyWidth - blackKeyWidth / 2
      }
    } else {
      // The key before is also black, so go one more
      const whiteKeyBeforeBefore = midi - 2
      const whiteIdx = whiteKeys.indexOf(whiteKeyBeforeBefore)
      if (whiteIdx >= 0) {
        return (whiteIdx + 1) * whiteKeyWidth - blackKeyWidth / 2
      }
    }
    return null
  }
  
  const isPressed = (midi: number): boolean => chord.notes.includes(midi)
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: totalWidth, height: whiteKeyHeight + 20 }}>
        {/* White keys */}
        {whiteKeys.map((midi, idx) => (
          <div
            key={`white-${midi}`}
            className={`absolute border border-gray-400 rounded-b-md transition-colors ${
              isPressed(midi)
                ? 'bg-blue-500 border-blue-600'
                : 'bg-white hover:bg-gray-100'
            }`}
            style={{
              left: idx * whiteKeyWidth,
              top: 0,
              width: whiteKeyWidth - 1,
              height: whiteKeyHeight,
            }}
          >
            {isPressed(midi) && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-white font-bold">
                {midiToNoteName(midi).replace(/\d/, '')}
              </span>
            )}
          </div>
        ))}
        
        {/* Black keys */}
        {blackKeys.map((midi) => {
          const x = getBlackKeyX(midi)
          if (x === null) return null
          
          return (
            <div
              key={`black-${midi}`}
              className={`absolute rounded-b-md transition-colors z-10 ${
                isPressed(midi)
                  ? 'bg-blue-600 border-blue-700'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
              style={{
                left: x,
                top: 0,
                width: blackKeyWidth,
                height: blackKeyHeight,
              }}
            >
              {isPressed(midi) && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-white font-bold">
                  {midiToNoteName(midi).replace(/\d/, '')}
                </span>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Note names display */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {chord.notes.map(n => midiToNoteName(n)).join(' - ')}
      </div>
    </div>
  )
}

// Compact version for smaller displays
export function PianoChordDiagramCompact({ chord, chordName }: PianoChordDiagramProps) {
  // Show exactly one octave + some buffer centered on chord
  const minNote = Math.min(...chord.notes)
  const maxNote = Math.max(...chord.notes)
  const centerNote = Math.floor((minNote + maxNote) / 2)
  
  // Start from a C near the center
  const startMidi = Math.floor((centerNote - 6) / 12) * 12 + 48 // Around C4
  const endMidi = startMidi + 24 // Two octaves
  
  const whiteKeys: number[] = []
  const blackKeys: number[] = []
  
  for (let midi = startMidi; midi <= endMidi; midi++) {
    if (isBlackKey(midi)) {
      blackKeys.push(midi)
    } else {
      whiteKeys.push(midi)
    }
  }
  
  const whiteKeyWidth = 18
  const whiteKeyHeight = 60
  const blackKeyWidth = 12
  const blackKeyHeight = 38
  
  const totalWidth = whiteKeys.length * whiteKeyWidth
  
  const getBlackKeyX = (midi: number): number | null => {
    const whiteKeyBefore = midi - 1
    if (!isBlackKey(whiteKeyBefore)) {
      const whiteIdx = whiteKeys.indexOf(whiteKeyBefore)
      if (whiteIdx >= 0) {
        return whiteIdx * whiteKeyWidth + whiteKeyWidth - blackKeyWidth / 2
      }
    }
    return null
  }
  
  const isPressed = (midi: number): boolean => chord.notes.includes(midi)
  
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: totalWidth, height: whiteKeyHeight + 10 }}>
        {whiteKeys.map((midi, idx) => (
          <div
            key={`white-${midi}`}
            className={`absolute border border-gray-400 rounded-b-sm transition-colors ${
              isPressed(midi)
                ? 'bg-blue-500 border-blue-600'
                : 'bg-white'
            }`}
            style={{
              left: idx * whiteKeyWidth,
              top: 0,
              width: whiteKeyWidth - 1,
              height: whiteKeyHeight,
            }}
          />
        ))}
        
        {blackKeys.map((midi) => {
          const x = getBlackKeyX(midi)
          if (x === null) return null
          
          return (
            <div
              key={`black-${midi}`}
              className={`absolute rounded-b-sm z-10 ${
                isPressed(midi)
                  ? 'bg-blue-600'
                  : 'bg-gray-800'
              }`}
              style={{
                left: x,
                top: 0,
                width: blackKeyWidth,
                height: blackKeyHeight,
              }}
            />
          )
        })}
      </div>
      
      <div className="text-[10px] text-gray-500 dark:text-gray-400">
        {chord.notes.map(n => midiToNoteName(n).replace(/\d/, '')).join('-')}
      </div>
    </div>
  )
}
