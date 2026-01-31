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

// Detect if text contains Hebrew characters
function isHebrew(text: string): boolean {
  return /[\u0590-\u05FF]/.test(text)
}

// Parse a line and return segments of text with optional chord above
interface LineSegment {
  text: string
  chord?: string
}

export function LyricsContent({ content, onChordClick, chordDiagrams }: Props) {
  const { fontSize, showChords, transpose } = useStore()
  
  // Detect if content is Hebrew
  const containsHebrew = useMemo(() => isHebrew(content || ''), [content])

  // Parse content into lines with inline chord segments
  const lines = useMemo(() => {
    if (!content) return []
    
    // Handle [tab]...[/tab] sections - remove tags but keep content
    let parsed = content.replace(/\[tab\]([\s\S]*?)\[\/tab\]/g, '$1')
    
    // Split into lines and clean up \r
    const rawLines = parsed.split('\n').map(l => l.replace(/\r/g, ''))
    
    // Process lines - each line becomes array of segments with optional chord
    const processedLines: { segments: LineSegment[], hasChords: boolean }[] = []
    let pendingChords: string[] = []
    
    for (const line of rawLines) {
      // Support [ch]...[/ch] format AND [multiple chords] format for Hebrew songs
      const chordRegex = /\[ch\](.*?)\[\/ch\]|\[([A-Ga-g#b0-9\s\/majmindimaugsusadd]+)\]/g
      let match
      let lastIndex = 0
      const segments: LineSegment[] = []
      let foundChords = false
      
      while ((match = chordRegex.exec(line)) !== null) {
        // Add text before the chord
        const textBefore = line.slice(lastIndex, match.index)
        if (textBefore) {
          segments.push({ text: textBefore })
        }
        
        // Get chord(s)
        const chordContent = match[1] || match[2]
        const chordList = chordContent.trim().split(/\s+/).filter(c => c)
        
        for (let i = 0; i < chordList.length; i++) {
          const transposedChord = transposeChord(chordList[i], transpose)
          // Add chord as a segment with placeholder text (space or empty)
          segments.push({ 
            text: i < chordList.length - 1 ? ' ' : '', 
            chord: transposedChord 
          })
          foundChords = true
        }
        
        lastIndex = match.index + match[0].length
      }
      
      // Add remaining text
      const remainingText = line.slice(lastIndex)
      if (remainingText) {
        segments.push({ text: remainingText })
      }
      
      // Check if this is chord-only line
      const textContent = segments.map(s => s.text).join('').trim()
      const isChordOnlyLine = foundChords && textContent === ''
      
      if (isChordOnlyLine) {
        // Save chords for next line
        pendingChords = segments.filter(s => s.chord).map(s => s.chord!)
      } else if (pendingChords.length > 0 && textContent !== '') {
        // Apply pending chords to this line
        // Distribute chords evenly across the text
        const textSegments = segments.filter(s => !s.chord)
        const newSegments: LineSegment[] = []
        
        if (textSegments.length > 0 && pendingChords.length > 0) {
          const fullText = textSegments.map(s => s.text).join('')
          const chordSpacing = Math.floor(fullText.length / (pendingChords.length + 1))
          
          let charCount = 0
          let chordIdx = 0
          
          for (const seg of textSegments) {
            let text = seg.text
            let segStart = 0
            
            while (chordIdx < pendingChords.length) {
              const targetPos = chordSpacing * (chordIdx + 1)
              const posInSeg = targetPos - charCount
              
              if (posInSeg > 0 && posInSeg < text.length) {
                // Insert chord at this position
                newSegments.push({ text: text.slice(segStart, posInSeg) })
                newSegments.push({ text: '', chord: pendingChords[chordIdx] })
                segStart = posInSeg
                chordIdx++
              } else if (posInSeg <= 0) {
                // Chord should have been placed earlier
                chordIdx++
              } else {
                break
              }
            }
            
            if (segStart < text.length) {
              newSegments.push({ text: text.slice(segStart) })
            }
            charCount += text.length
          }
          
          // Add any remaining chords at the end
          while (chordIdx < pendingChords.length) {
            newSegments.push({ text: ' ', chord: pendingChords[chordIdx] })
            chordIdx++
          }
          
          processedLines.push({ segments: newSegments, hasChords: true })
        } else {
          processedLines.push({ segments, hasChords: foundChords })
        }
        pendingChords = []
      } else {
        // Normal line
        if (pendingChords.length > 0 && segments.length === 0) {
          // Empty line with pending chords - just show chords
          processedLines.push({ 
            segments: pendingChords.map(c => ({ text: ' ', chord: c })), 
            hasChords: true 
          })
          pendingChords = []
        }
        if (segments.length > 0) {
          processedLines.push({ segments, hasChords: foundChords })
        }
      }
    }
    
    // Flush any remaining pending chords
    if (pendingChords.length > 0) {
      processedLines.push({ 
        segments: pendingChords.map(c => ({ text: ' ', chord: c })), 
        hasChords: true 
      })
    }
    
    return processedLines
  }, [content, transpose])

  if (!content) {
    return <span className="text-zinc-400">No content available</span>
  }

  // Check if chord has a diagram available
  const hasChordDiagram = (chord: string): boolean => {
    if (chordDiagrams?.[chord]) return true
    const positions = getChordPositions(chord)
    return positions.length > 0
  }

  return (
    <div 
      className="break-words overflow-x-auto max-w-full"
      style={{ 
        fontSize: `${fontSize}px`,
        direction: containsHebrew ? 'rtl' : 'ltr',
        textAlign: containsHebrew ? 'right' : 'left',
        lineHeight: '1.4',
        wordBreak: 'break-word'
      }}
    >
      {lines.map((line, lineIndex) => (
        <div key={lineIndex} className="min-h-[1em] my-1">
          <div className="flex flex-wrap items-end" style={{ direction: containsHebrew ? 'rtl' : 'ltr' }}>
            {line.segments.map((seg, segIndex) => (
              <span key={segIndex} className="inline-flex flex-col items-start">
                {/* Chord above */}
                {showChords && seg.chord && (
                  <span
                    className={`text-emerald-400 font-bold text-sm leading-tight mb-0.5 ${
                      onChordClick && hasChordDiagram(seg.chord)
                        ? 'cursor-pointer hover:text-emerald-300 bg-emerald-500/20 px-1 rounded border border-emerald-500/40'
                        : ''
                    }`}
                    onClick={() => onChordClick && hasChordDiagram(seg.chord!) && onChordClick(seg.chord!)}
                    title={hasChordDiagram(seg.chord) ? 'Click to see chord diagram' : undefined}
                  >
                    {seg.chord}
                  </span>
                )}
                {/* Add empty space for alignment when showing chords but segment has none */}
                {showChords && line.hasChords && !seg.chord && (
                  <span className="text-sm leading-tight mb-0.5">&nbsp;</span>
                )}
                {/* Text below */}
                <span className="text-zinc-100 whitespace-pre">{seg.text || '\u00A0'}</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
