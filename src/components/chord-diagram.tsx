'use client'

import { ChordDiagram as ChordDiagramType } from '@/lib/api'

interface Props {
  chord: string
  diagram: ChordDiagramType
  size?: 'normal' | 'large'
}

export function ChordDiagram({ chord, diagram, size = 'normal' }: Props) {
  if (!diagram) return null
  const { frets, barres, baseFret } = diagram

  const isLarge = size === 'large'
  const width = isLarge ? 180 : 90
  const height = isLarge ? 220 : 110
  const viewBox = "0 0 100 120"
  const scale = isLarge ? 2 : 1

  return (
    <div className={`bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 rounded-xl shadow-lg border border-emerald-500/30 hover:border-emerald-400/60 transition-all ${isLarge ? 'min-w-[200px]' : 'min-w-[110px]'}`}>
      <div className={`text-center font-bold text-emerald-400 mb-3 ${isLarge ? 'text-2xl' : 'text-lg'}`}>{chord}</div>
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
        {barres?.map((b,i) => (
          <rect key={`b${i}`} x="12" y={22+(b-baseFret)*20+5} width="76" height="14" rx="7" fill="#10b981" opacity="0.8" />
        ))}
        
        {/* Fingers */}
        {frets.map((f,i) => {
          if (f === -1) return <text key={i} x={15+i*14} y="15" textAnchor="middle" fill="#f87171" fontSize="14" fontWeight="bold">✕</text>
          if (f === 0) return <circle key={i} cx={15+i*14} cy="12" r="5" fill="none" stroke="#10b981" strokeWidth="2" />
          return <circle key={i} cx={15+i*14} cy={22+(f-0.5)*20} r="7" fill="#10b981" />
        })}
      </svg>
      
      {/* Finger numbers for large view */}
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
