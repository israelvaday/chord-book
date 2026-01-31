'use client'

import { useState } from 'react'
import { ChordPosition, getChordPositions } from '@/lib/chord-library'
import { getPianoChordPositions, midiToNoteName, isBlackKey, type PianoChordPosition } from '@/lib/piano-chord-library'
import { ChevronLeft, ChevronRight, Guitar, Piano } from 'lucide-react'

type Instrument = 'guitar' | 'piano'

interface Props {
  chord: string
  size?: 'normal' | 'large'
  positionIndex?: number
  onPositionChange?: (index: number) => void
  showNavigation?: boolean
}

// Piano keyboard component
function PianoKeyboard({ chordPosition, isLarge }: { chordPosition: PianoChordPosition; isLarge: boolean }) {
  const notes = chordPosition.notes
  
  // Find range for display (about 2 octaves centered on chord)
  const minNote = Math.min(...notes)
  const maxNote = Math.max(...notes)
  
  // Start from a C below the lowest note
  const startMidi = Math.floor((minNote - 2) / 12) * 12 + 48 // Around C4
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
  
  const whiteKeyWidth = isLarge ? 20 : 14
  const whiteKeyHeight = isLarge ? 65 : 45
  const blackKeyWidth = isLarge ? 12 : 9
  const blackKeyHeight = isLarge ? 42 : 28
  
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
  
  const isPressed = (midi: number): boolean => notes.includes(midi)
  
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: totalWidth, height: whiteKeyHeight + 5 }}>
        {/* White keys */}
        {whiteKeys.map((midi, idx) => (
          <div
            key={`white-${midi}`}
            className={`absolute border border-gray-400 rounded-b-sm transition-colors ${
              isPressed(midi)
                ? 'bg-emerald-500 border-emerald-600'
                : 'bg-white'
            }`}
            style={{
              left: idx * whiteKeyWidth,
              top: 0,
              width: whiteKeyWidth - 1,
              height: whiteKeyHeight,
            }}
          >
            {isPressed(midi) && (
              <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 font-bold text-white ${isLarge ? 'text-[9px]' : 'text-[7px]'}`}>
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
              className={`absolute rounded-b-sm z-10 ${
                isPressed(midi)
                  ? 'bg-emerald-600'
                  : 'bg-gray-800'
              }`}
              style={{
                left: x,
                top: 0,
                width: blackKeyWidth,
                height: blackKeyHeight,
              }}
            >
              {isPressed(midi) && (
                <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 font-bold text-white ${isLarge ? 'text-[7px]' : 'text-[5px]'}`}>
                  {midiToNoteName(midi).replace(/\d/, '')}
                </span>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Note names display */}
      {isLarge && (
        <div className="text-xs text-zinc-400 mt-1">
          {notes.map(n => midiToNoteName(n)).join(' - ')}
        </div>
      )}
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

  const width = isLarge ? 180 : 90
  const height = isLarge ? 220 : 110
  const viewBox = "0 0 100 120"

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
                {/* Fret number background box */}
                <rect x="0" y="22" width="14" height="20" fill="#10b981" rx="3" />
                <text x="7" y="36" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">{guitarPosition.baseFret}</text>
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
    </div>
  )
}
