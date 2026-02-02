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

interface ParsedLine {
  type: 'lyrics' | 'chords' | 'empty' | 'combined'
  text: string
  chords?: { chord: string; position: number }[]
}

export function LyricsContent({ content, onChordClick, chordDiagrams }: Props) {
  const { fontSize, showChords, transpose } = useStore()
  
  // Detect if content is Hebrew
  const containsHebrew = useMemo(() => isHebrew(content || ''), [content])

  // Parse content - keep chord lines separate from lyric lines
  const lines = useMemo(() => {
    if (!content) return []
    
    // Handle [tab]...[/tab] sections
    let parsed = content.replace(/\[tab\]([\s\S]*?)\[\/tab\]/g, '$1')
    
    const rawLines = parsed.split('\n').map(l => l.replace(/\r/g, ''))
    const result: ParsedLine[] = []
    
    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i]
      
      // Extract chords and their positions
      // Use [ch]...[/ch] format or [CHORD] format
      const chordRegex = /\[ch\](.*?)\[\/ch\]|\[([A-Ga-g#b0-9\s\/majmindimaugsusadd]+)\]/g
      let match
      let lastIndex = 0
      let textWithoutChords = ''
      const chords: { chord: string; position: number }[] = []
      
      // Check if this is a chord-only line (only chords and spaces, no other text)
      const lineWithoutChords = line.replace(chordRegex, '').trim()
      const isChordOnlyLine = lineWithoutChords === '' && chordRegex.test(line)
      chordRegex.lastIndex = 0 // Reset regex after test
      
      if (isChordOnlyLine) {
        // For chord-only lines, preserve ORIGINAL spacing from the content
        // Build the display text by keeping exact spacing, just remove brackets
        let displayLine = ''
        let lastMatchEnd = 0
        chordRegex.lastIndex = 0
        
        while ((match = chordRegex.exec(line)) !== null) {
          // Add spaces between last match and this one
          const spacesBefore = line.slice(lastMatchEnd, match.index)
          displayLine += spacesBefore
          
          const chordContent = match[1] || match[2]
          const transposedChord = transposeChord(chordContent.trim(), transpose)
          chords.push({ chord: transposedChord, position: displayLine.length })
          displayLine += transposedChord
          
          lastMatchEnd = match.index + match[0].length
        }
        // Add any trailing spaces
        displayLine += line.slice(lastMatchEnd)
        
        if (chords.length > 0) {
          result.push({ type: 'chords', text: displayLine, chords })
        } else {
          result.push({ type: 'empty', text: '' })
        }
      } else {
        // Original logic for lines with text
        while ((match = chordRegex.exec(line)) !== null) {
          const textBefore = line.slice(lastIndex, match.index)
          const positionInText = textWithoutChords.length + textBefore.length
          textWithoutChords += textBefore
          
          const chordContent = match[1] || match[2]
          const chordList = chordContent.trim().split(/\s+/).filter(c => c)
          
          let pos = positionInText
          for (const chord of chordList) {
            const transposedChord = transposeChord(chord, transpose)
            chords.push({ chord: transposedChord, position: pos })
            pos += transposedChord.length + 1
          }
          
          lastIndex = match.index + match[0].length
        }
        textWithoutChords += line.slice(lastIndex)
        
        const hasChords = chords.length > 0
        const hasText = textWithoutChords.trim() !== ''
        
        if (hasChords && hasText) {
          // Line has both chords and text inline - combined format
          result.push({ type: 'combined', text: textWithoutChords, chords })
        } else if (hasText) {
          // Text-only line
          result.push({ type: 'lyrics', text: textWithoutChords })
        } else {
          // Empty line
          result.push({ type: 'empty', text: '' })
        }
      }
    }
    
    return result
  }, [content, transpose])

  if (!content) {
    return <span className="text-zinc-400">No content available</span>
  }

  // Check if chord has a diagram available
  const hasChordDiagram = (chord: string): boolean => {
    if (chordDiagrams?.[chord]) return true
    return getChordPositions(chord).length > 0
  }

  // Render a clickable chord
  const renderChord = (
    chord: string,
    key: string | number,
    compact: boolean = false
  ) => {
    const isClickable = onChordClick && hasChordDiagram(chord)
    return (
      <span
        key={key}
        className={`text-emerald-400 font-bold ${
          isClickable
            ? compact
              ? 'cursor-pointer hover:text-emerald-300'
              : 'cursor-pointer hover:text-emerald-300 bg-emerald-500/20 px-0.5 rounded border border-emerald-500/40'
            : ''
        }`}
        onClick={() => isClickable && onChordClick?.(chord)}
        title={isClickable ? 'Click to see chord diagram' : undefined}
      >
        {chord}
      </span>
    )
  }

  // Build chord line with proper spacing using monospace
  const buildChordLine = (
    chords: { chord: string; position: number }[],
    textLength: number,
    textOnly: boolean = false,
    prebuiltText?: string
  ) => {
    if (!showChords || chords.length === 0) return null
    
    // For Hebrew chord-only lines, use prebuilt text if available
    if (textOnly && prebuiltText) {
      return (
        <div
          className="text-emerald-400 font-bold leading-tight select-none whitespace-pre"
        >
          {prebuiltText}
        </div>
      )
    }
    
    // Sort by position
    const sorted = [...chords].sort((a, b) => a.position - b.position)
    
    // Build line with spaces
    const elements: React.ReactNode[] = []
    let currentPos = 0

    if (textOnly) {
      let lineText = ''
      for (let i = 0; i < sorted.length; i++) {
        const { chord, position } = sorted[i]
        const spaces = Math.max(0, position - currentPos)
        if (spaces > 0) {
          lineText += ' '.repeat(spaces)
        }
        lineText += chord
        currentPos = position + chord.length
      }

      return (
        <div
          className="text-emerald-400 font-bold leading-tight select-none whitespace-pre"
        >
          {lineText}
        </div>
      )
    }

    for (let i = 0; i < sorted.length; i++) {
      const { chord, position } = sorted[i]

      // Add spaces before this chord
      const spaces = Math.max(0, position - currentPos)
      if (spaces > 0) {
        elements.push(' '.repeat(spaces))
      }

      elements.push(renderChord(chord, `chord-${i}`, true))
      currentPos = position + chord.length
    }

    return (
      <div
        className="text-emerald-400 font-bold leading-tight select-none whitespace-pre"
      >
        {elements}
      </div>
    )
  }

  return (
    <div 
      className="break-words overflow-x-auto max-w-full font-mono"
      style={{ 
        fontSize: `${fontSize}px`,
        direction: containsHebrew ? 'rtl' : 'ltr',
        textAlign: containsHebrew ? 'right' : 'left',
        lineHeight: '1.4',
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
      }}
    >
      {lines.map((line, lineIndex) => {
        // Check if next line is lyrics (for chord-only lines)
        const nextLine = lines[lineIndex + 1]
        const isChordLineAboveLyrics = line.type === 'chords' && nextLine?.type === 'lyrics'
        
        if (line.type === 'empty') {
          return <div key={lineIndex} className="h-4" />
        }
        
        if (line.type === 'chords') {
          // Chord-only line - render with spacing
          return (
            <div key={lineIndex} className={isChordLineAboveLyrics ? 'mb-0' : 'mb-2'}>
              {buildChordLine(
                line.chords!,
                Math.max(...(line.chords?.map(c => c.position + c.chord.length) || [0])),
                containsHebrew,
                line.text  // Pass prebuilt text for Hebrew
              )}
            </div>
          )
        }
        
        if (line.type === 'lyrics') {
          // Lyrics line - natural direction, no bidi-override
          return (
            <div 
              key={lineIndex} 
              className="text-zinc-100 whitespace-pre mb-2"
            >
              {line.text || '\u00A0'}
            </div>
          )
        }
        
        if (line.type === 'combined') {
          // Line with inline chords - show chord line above, then lyrics
          return (
            <div key={lineIndex} className="mb-2">
              {buildChordLine(line.chords!, line.text.length, containsHebrew)}
              <div 
                className="text-zinc-100 whitespace-pre"
              >
                {line.text || '\u00A0'}
              </div>
            </div>
          )
        }
        
        return null
      })}
    </div>
  )
}
// Build trigger Mon Feb  2 01:07:40 AM UTC 2026
