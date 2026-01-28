'use client'

import { ChordDiagram as ChordDiagramType } from '@/lib/api'
import { ChordPosition, getChordPositions } from '@/lib/chord-library'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  chord: string
  diagram?: ChordDiagramType
  size?: 'normal' | 'large'
  positionIndex?: number
  onPositionChange?: (index: number) => void
  showNavigation?: boolean
}

export function ChordDiagram({ chord, diagram, size = 'normal', positionIndex = 0, onPositionChange, showNavigation = false }: Props) {
  // Get all positions for this chord from library, falling back to API diagram
  const positions = getChordPositions(chord, diagram)
  
  // If no positions available, show empty state
  if (positions.length === 0) {
    return (
      <div className={`bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 rounded-xl shadow-lg border border-zinc-600/30 ${size === 'large' ? 'min-w-[200px]' : 'min-w-[110px]'}`}>
        <div className={`text-center font-bold text-zinc-400 mb-3 ${size === 'large' ? 'text-2xl' : 'text-lg'}`}>{chord}</div>
        <div className="text-center text-zinc-500 text-sm py-4">No diagram available</div>
      </div>
    )
  }
  
  // Ensure index is within bounds
  const currentIndex = Math.max(0, Math.min(positionIndex, positions.length - 1))
  const position = positions[currentIndex]
  const { frets, barres = [], baseFret } = position

  const isLarge = size === 'large'
  const width = isLarge ? 180 : 90
  const height = isLarge ? 220 : 110
  const viewBox = "0 0 100 120"

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? positions.length - 1 : currentIndex - 1
    onPositionChange?.(newIndex)
  }

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % positions.length
    onPositionChange?.(newIndex)
  }

  const hasMultiplePositions = positions.length > 1

  return (
    <div className={`bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 rounded-xl shadow-lg border border-emerald-500/30 hover:border-emerald-400/60 transition-all ${isLarge ? 'min-w-[220px]' : 'min-w-[110px]'}`}>
      {/* Header with chord name and position indicator */}
      <div className={`text-center font-bold text-emerald-400 mb-1 ${isLarge ? 'text-2xl' : 'text-lg'}`}>{chord}</div>
      
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
            {position.name || `Position ${currentIndex + 1}`}
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
          {positions.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); onPositionChange?.(i) }}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentIndex ? 'bg-emerald-400' : 'bg-zinc-600 hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>
      )}
      
      <svg width={width} height={height} viewBox={viewBox} className="mx-auto">
        {/* Nut or fret number */}
        {baseFret === 1 ? (
          <rect x="15" y="20" width="70" height="5" fill="#e4e4e7" rx="2" />
        ) : (
          <text x="5" y="35" fill="#a1a1aa" fontSize="11" fontWeight="bold">{baseFret}fr</text>
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
        {barres?.map((b,i) => {
          // Calculate the correct y position for the barre
          const fretPosition = baseFret === 1 ? b : b - baseFret + 1
          return (
            <rect key={`b${i}`} x="12" y={22+(fretPosition-0.5)*20-7} width="76" height="14" rx="7" fill="#10b981" opacity="0.8" />
          )
        })}
        
        {/* Fingers */}
        {frets.map((f,i) => {
          if (f === -1) return <text key={i} x={15+i*14} y="15" textAnchor="middle" fill="#f87171" fontSize="14" fontWeight="bold">✕</text>
          if (f === 0) return <circle key={i} cx={15+i*14} cy="12" r="5" fill="none" stroke="#10b981" strokeWidth="2" />
          // Calculate the correct position - if baseFret > 1, subtract to show relative position
          const displayFret = baseFret === 1 ? f : f - baseFret + 1
          return <circle key={i} cx={15+i*14} cy={22+(displayFret-0.5)*20} r="7" fill="#10b981" />
        })}
      </svg>
      
      {/* Fret numbers for large view */}
      {isLarge && (
        <div className="flex justify-center gap-2 mt-3 text-xs text-zinc-400">
          {frets.map((f, i) => (
            <span key={i} className="w-5 text-center">
              {f === -1 ? 'x' : f === 0 ? 'o' : f}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
