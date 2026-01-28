'use client'

import { useMemo } from 'react'
import { transposeChord } from '@/lib/transpose'
import { useStore } from '@/lib/store'
import { ChordDiagram as ChordDiagramType } from '@/lib/api'

interface Props {
  content: string
  onChordClick?: (chord: string) => void
  chordDiagrams?: Record<string, ChordDiagramType>
}

export function LyricsContent({ content, onChordClick, chordDiagrams }: Props) {
  const { fontSize, showChords, transpose } = useStore()

  // Parse content into lines with chords positioned above
  const lines = useMemo(() => {
    if (!content) return []
    
    // Handle [tab]...[/tab] sections
    let parsed = content.replace(/\[tab\]([\s\S]*?)\[\/tab\]/g, '$1')
    
    // Split into lines
    const rawLines = parsed.split('\n')
    
    return rawLines.map(line => {
      const parts: { type: 'text' | 'chord', content: string, position: number }[] = []
      let lastIndex = 0
      const chordRegex = /\[ch\](.*?)\[\/ch\]/g
      let match
      let textWithoutChords = ''
      const chords: { chord: string, position: number }[] = []
      
      while ((match = chordRegex.exec(line)) !== null) {
        // Add text before this chord
        const textBefore = line.slice(lastIndex, match.index)
        textWithoutChords += textBefore
        
        // Store chord with its position in the text
        const transposedChord = transposeChord(match[1], transpose)
        chords.push({ chord: transposedChord, position: textWithoutChords.length })
        
        lastIndex = match.index + match[0].length
      }
      
      // Add remaining text
      textWithoutChords += line.slice(lastIndex)
      
      return { text: textWithoutChords, chords }
    })
  }, [content, transpose])

  if (!content) {
    return <span className="text-zinc-400">No content available</span>
  }

  const hasClickableChords = onChordClick && chordDiagrams

  return (
    <div 
      className="font-mono"
      style={{ fontSize: `${fontSize}px` }}
    >
      {lines.map((line, lineIndex) => {
        // Check if this line has chords
        const hasChords = showChords && line.chords.length > 0
        
        return (
          <div key={lineIndex} className="min-h-[1.5em]">
            {/* Chord line above */}
            {hasChords && (
              <div className="text-emerald-400 font-bold h-8 relative select-none">
                {line.chords.map((c, i) => {
                  const isClickable = hasClickableChords && chordDiagrams?.[c.chord]
                  return (
                    <span
                      key={i}
                      className={`absolute whitespace-nowrap ${
                        isClickable 
                          ? 'cursor-pointer hover:text-emerald-300 hover:scale-110 transition-transform bg-emerald-500/20 px-1 rounded border border-emerald-500/40' 
                          : ''
                      }`}
                      style={{ 
                        left: `${c.position}ch`,
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
