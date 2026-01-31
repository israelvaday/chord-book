'use client'

import { useMemo } from 'react'
import { transposeChord } from '@/lib/transpose'
import { useStore } from '@/lib/store'
import { ChordDiagram as ChordDiagramType } from '@/lib/api'
import { getChordPositions } from '@/lib/chord-library'

interface Props {
  content: string
  onChordClick?: (chord: string) => void
  chordDiagrams?: Record<string, ChordDiagramType>
}

// Minimum character spacing between chords to prevent overlap
const MIN_CHORD_SPACING = 4

// Detect if text contains Hebrew characters
function isHebrew(text: string): boolean {
  return /[\u0590-\u05FF]/.test(text)
}

export function LyricsContent({ content, onChordClick, chordDiagrams }: Props) {
  const { fontSize, showChords, transpose } = useStore()
  
  // Detect if content is Hebrew
  const containsHebrew = useMemo(() => isHebrew(content || ''), [content])

  // Parse content into lines with chords positioned above
  const lines = useMemo(() => {
    if (!content) return []
    
    // Handle [tab]...[/tab] sections - remove tags but keep content
    let parsed = content.replace(/\[tab\]([\s\S]*?)\[\/tab\]/g, '$1')
    
    // Split into lines and clean up \r
    const rawLines = parsed.split('\n').map(l => l.replace(/\r/g, ''))
    
    // Process lines - merge chord-only lines with following lyric lines
    const processedLines: { text: string, chords: { chord: string, position: number }[] }[] = []
    let pendingChords: { chord: string, position: number }[] = []
    
    for (const line of rawLines) {
      // Support both [ch]...[/ch] format AND [Chord] format for Hebrew songs
      const chordRegex = /\[ch\](.*?)\[\/ch\]|\[([A-Ga-g][#b]?(?:m|maj|min|dim|aug|sus|add|7|9|11|13|M)*[0-9]*(?:\/[A-G][#b]?)?)\]/g
      let match
      let lastIndex = 0
      let textWithoutChords = ''
      const chords: { chord: string, position: number }[] = []
      
      while ((match = chordRegex.exec(line)) !== null) {
        const textBefore = line.slice(lastIndex, match.index)
        textWithoutChords += textBefore
        // match[1] is from [ch]...[/ch], match[2] is from [Chord]
        const chordName = match[1] || match[2]
        const transposedChord = transposeChord(chordName, transpose)
        chords.push({ chord: transposedChord, position: textWithoutChords.length })
        lastIndex = match.index + match[0].length
      }
      textWithoutChords += line.slice(lastIndex)
      
      // Check if this line is chord-only (has chords but text is just whitespace)
      const isChordOnlyLine = chords.length > 0 && textWithoutChords.trim() === ''
      // Check if this line is lyric-only (no chords, has actual text)
      const isLyricOnlyLine = chords.length === 0 && textWithoutChords.trim() !== ''
      
      if (isChordOnlyLine) {
        // Store these chords for the next line
        pendingChords = chords
      } else if (isLyricOnlyLine && pendingChords.length > 0) {
        // Combine pending chords with this lyric line
        processedLines.push({ text: textWithoutChords, chords: pendingChords })
        pendingChords = []
      } else {
        // Normal line - flush any pending chords first
        if (pendingChords.length > 0) {
          processedLines.push({ text: '', chords: pendingChords })
          pendingChords = []
        }
        processedLines.push({ text: textWithoutChords, chords })
      }
    }
    
    // Don't forget any trailing pending chords
    if (pendingChords.length > 0) {
      processedLines.push({ text: '', chords: pendingChords })
    }
    
    return processedLines
  }, [content, transpose])

  // Adjust chord positions to prevent overlap
  const adjustChordPositions = (chords: { chord: string, position: number }[]): { chord: string, position: number }[] => {
    if (chords.length === 0) return chords
    
    const adjusted = [...chords]
    
    for (let i = 1; i < adjusted.length; i++) {
      const prevChord = adjusted[i - 1]
      const currChord = adjusted[i]
      const prevChordWidth = prevChord.chord.length + MIN_CHORD_SPACING
      const minPosition = prevChord.position + prevChordWidth
      
      if (currChord.position < minPosition) {
        adjusted[i] = { ...currChord, position: minPosition }
      }
    }
    
    return adjusted
  }

  if (!content) {
    return <span className="text-zinc-400">No content available</span>
  }

  // Check if chord has a diagram available (from API or chord library)
  const hasChordDiagram = (chord: string): boolean => {
    if (chordDiagrams?.[chord]) return true
    const positions = getChordPositions(chord)
    return positions.length > 0
  }

  return (
    <div 
      className="font-mono"
      style={{ 
        fontSize: `${fontSize}px`,
        direction: containsHebrew ? 'rtl' : 'ltr',
        textAlign: containsHebrew ? 'right' : 'left',
        fontFamily: containsHebrew ? '"David", "Noto Sans Hebrew", "Arial Hebrew", monospace' : undefined
      }}
    >
      {lines.map((line, lineIndex) => {
        // Check if this line has chords
        const hasChords = showChords && line.chords.length > 0
        // Adjust positions to prevent overlap
        const adjustedChords = hasChords ? adjustChordPositions(line.chords) : []
        
        return (
          <div key={lineIndex} className="min-h-[1.5em]">
            {/* Chord line above */}
            {hasChords && (
              <div className="text-emerald-400 font-bold h-8 relative select-none" style={{ direction: 'ltr' }}>
                {adjustedChords.map((c, i) => {
                  const isClickable = onChordClick && hasChordDiagram(c.chord)
                  return (
                    <span
                      key={i}
                      className={`absolute whitespace-nowrap ${
                        isClickable 
                          ? 'cursor-pointer hover:text-emerald-300 hover:scale-110 transition-transform bg-emerald-500/20 px-1 rounded border border-emerald-500/40' 
                          : ''
                      }`}
                      style={{ 
                        left: containsHebrew ? 'auto' : `${c.position}ch`,
                        right: containsHebrew ? `${c.position}ch` : 'auto',
                      }}
                      onClick={() => isClickable && onChordClick?.(c.chord)}
                      title={isClickable ? 'Click to see chord diagram' : undefined}
                    >
                      {c.chord}
                    </span>
                  )
                })}
              </div>
            )}
            
            {/* Lyrics line */}
            <div className="text-zinc-100 whitespace-pre-wrap" style={{ lineHeight: '1.6' }}>
              {line.text || '\u00A0'}
            </div>
          </div>
        )
      })}
    </div>
  )
}
