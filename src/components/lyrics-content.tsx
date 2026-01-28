'use client'

import { useMemo } from 'react'
import { transposeChord } from '@/lib/transpose'
import { useStore } from '@/lib/store'

interface Props {
  content: string
}

export function LyricsContent({ content }: Props) {
  const { fontSize, showChords, transpose } = useStore()

  const parts = useMemo(() => {
    if (!content) return []
    
    // Handle [tab]...[/tab] sections
    let parsed = content.replace(/\[tab\]([\s\S]*?)\[\/tab\]/g, '$1')
    
    // Parse into parts
    const result: { type: 'text' | 'chord', content: string }[] = []
    let lastIndex = 0
    const chordRegex = /\[ch\](.*?)\[\/ch\]/g
    let match
    
    while ((match = chordRegex.exec(parsed)) !== null) {
      if (match.index > lastIndex) {
        result.push({ type: 'text', content: parsed.slice(lastIndex, match.index) })
      }
      // Transpose the chord
      const transposedChord = transposeChord(match[1], transpose)
      result.push({ type: 'chord', content: transposedChord })
      lastIndex = match.index + match[0].length
    }
    if (lastIndex < parsed.length) {
      result.push({ type: 'text', content: parsed.slice(lastIndex) })
    }
    
    return result
  }, [content, transpose])

  if (!content) {
    return <span className="text-zinc-400">No content available</span>
  }

  return (
    <pre 
      className="font-mono leading-loose"
      style={{ 
        fontSize: `${fontSize}px`, 
        lineHeight: '2',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        overflowWrap: 'anywhere',
      }}
    >
      {parts.map((part, i) => 
        part.type === 'chord' ? (
          showChords ? (
            <span 
              key={i} 
              className="inline-block font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/40 mx-0.5 my-0.5 shadow-[0_0_12px_rgba(16,185,129,0.4)] animate-pulse"
            >
              {part.content}
            </span>
          ) : null
        ) : (
          <span key={i} className="text-zinc-100">{part.content}</span>
        )
      )}
    </pre>
  )
}
