'use client'

import { useStore } from '@/lib/store'

interface Props {
  content: string
}

export function TabContent({ content }: Props) {
  const { fontSize } = useStore()

  if (!content) {
    return <span className="text-zinc-400">No content available</span>
  }

  // Clean up the tab content - remove [tab] tags but keep the content
  let cleaned = content
    .replace(/\[tab\]/g, '')
    .replace(/\[\/tab\]/g, '')
    .replace(/\[ch\](.*?)\[\/ch\]/g, '$1') // Just show chord names inline for tabs

  return (
    <pre 
      className="font-mono text-zinc-100 overflow-x-auto"
      style={{ 
        fontSize: `${fontSize}px`,
        lineHeight: '1.4',
        whiteSpace: 'pre',
        tabSize: 4,
      }}
    >
      {cleaned}
    </pre>
  )
}
