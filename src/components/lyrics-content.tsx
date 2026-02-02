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
        // Parse the line and track positions WITHOUT brackets
        let renderPos = 0  // Position in the rendered output (without brackets)
        while ((match = chordRegex.exec(line)) !== null) {
          // Calculate how many spaces were before this chord in the source
          // by looking at characters between last match end and this match start
          const spacesBeforeInSource = match.index - (chordRegex.lastIndex - match[0].length === 0 ? 0 : chordRegex.lastIndex - match[0].length)
          
          const chordContent = match[1] || match[2]
          const chordList = chordContent.trim().split(/\s+/).filter(c => c)
          
          for (const chord of chordList) {
            const transposedChord = transposeChord(chord, transpose)
            chords.push({ chord: transposedChord, position: renderPos })
            renderPos += transposedChord.length
          }
          
          // Add the spaces that follow this chord in source (until next chord or end)
          // We'll calculate this by looking at what comes after the match
        }
        
        // Re-parse to get correct spacing
        chords.length = 0
        chordRegex.lastIndex = 0
        let lastMatchEnd = 0
        renderPos = 0
        
        while ((match = chordRegex.exec(line)) !== null) {
          // Spaces before this chord = characters between last match end and this match start
          const spacesBefore = match.index - lastMatchEnd
          renderPos += spacesBefore
          
          const chordContent = match[1] || match[2]
          const transposedChord = transposeChord(chordContent.trim(), transpose)
          chords.push({ chord: transposedChord, position: renderPos })
          renderPos += transposedChord.length
          
          lastMatchEnd = match.index + match[0].length
        }
        
        if (chords.length > 0) {
          result.push({ type: 'chords', text: '', chords })
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
  const renderChord = (chord: string, key: string | number) => {
    const isClickable = onChordClick && hasChordDiagram(chord)
    return (
      <span
        key={key}
        className={`text-emerald-400 font-bold ${
          isClickable
            ? 'cursor-pointer hover:text-emerald-300 bg-emerald-500/20 px-0.5 rounded border border-emerald-500/40'
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
  const buildChordLine = (chords: { chord: string; position: number }[], textLength: number) => {
    if (!showChords || chords.length === 0) return null
    
    // Sort by position
    const sorted = [...chords].sort((a, b) => a.position - b.position)
    
    // Build line with spaces
    const elements: React.ReactNode[] = []
    let currentPos = 0
    
    for (let i = 0; i < sorted.length; i++) {
      const { chord, position } = sorted[i]
      
      // Add spaces before this chord
      const spaces = Math.max(0, position - currentPos)
      if (spaces > 0) {
        elements.push(<span key={`space-${i}`}>{' '.repeat(spaces)}</span>)
      }
      
      elements.push(renderChord(chord, `chord-${i}`))
      currentPos = position + chord.length
    }
    
    return (
      <div className="text-emerald-400 font-bold leading-tight select-none whitespace-pre">
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
              {buildChordLine(line.chords!, Math.max(...(line.chords?.map(c => c.position + c.chord.length) || [0])))}
            </div>
          )
        }
        
        if (line.type === 'lyrics') {
          // Lyrics-only line
          return (
            <div key={lineIndex} className="text-zinc-100 whitespace-pre-wrap mb-2">
              {line.text || '\u00A0'}
            </div>
          )
        }
        
        if (line.type === 'combined') {
          // Line with inline chords - show chord line above, then lyrics
          return (
            <div key={lineIndex} className="mb-2">
              {buildChordLine(line.chords!, line.text.length)}
              <div className="text-zinc-100 whitespace-pre-wrap">
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
