'use client'

import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Minus, Plus, Music, Scroll, ChevronUp, ChevronDown } from 'lucide-react'
import { getKeyName } from '@/lib/transpose'

export function PlayerControls() {
  const { 
    fontSize, setFontSize, 
    showChords, setShowChords,
    autoScroll, setAutoScroll,
    scrollSpeed, setScrollSpeed,
    transpose, setTranspose
  } = useStore()

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2 sm:p-3 bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800 overflow-hidden">
      {/* Font Size */}
      <div className="flex items-center gap-2">
        <span className="text-zinc-400 text-sm hidden sm:inline">Font</span>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => setFontSize(fontSize - 1)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="text-sm w-6 text-center">{fontSize}</span>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => setFontSize(fontSize + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <div className="w-px h-6 bg-zinc-700 hidden sm:block" />

      {/* Transpose */}
      <div className="flex items-center gap-2">
        <span className="text-zinc-400 text-sm hidden sm:inline">Key</span>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => setTranspose(transpose - 1)}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
        <Badge variant={transpose === 0 ? "secondary" : "default"} className="min-w-[60px] justify-center">
          {transpose === 0 ? 'Original' : `+${transpose}`}
        </Badge>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => setTranspose(transpose + 1)}
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
      </div>

      <div className="w-px h-6 bg-zinc-700 hidden sm:block" />

      {/* Toggles */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <Switch 
            checked={showChords} 
            onCheckedChange={setShowChords}
          />
          <span className="text-sm text-zinc-300">
            <Music className="h-4 w-4 inline mr-1" />
            <span className="hidden sm:inline">Chords</span>
          </span>
        </label>

        <div className="flex items-center gap-2">
          <Switch 
            checked={autoScroll} 
            onCheckedChange={setAutoScroll}
          />
          <span className="text-sm text-zinc-300">
            <Scroll className="h-4 w-4 inline mr-1" />
            <span className="hidden sm:inline">Scroll</span>
          </span>
          {autoScroll && (
            <div className="flex items-center gap-1 ml-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => setScrollSpeed(scrollSpeed - 10)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-xs text-zinc-400 w-6 text-center">{scrollSpeed}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => setScrollSpeed(scrollSpeed + 10)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
