import React from 'react'
import { FaPlay, FaPause } from 'react-icons/fa'

export default function MusicPlayer({ audioStarted, togglePlay }){
  return (
    <div className="flex items-center gap-3">
      <button
        aria-pressed={audioStarted}
        aria-label={audioStarted ? 'Pause music' : 'Play music'}
        onClick={togglePlay}
        className="p-2 bg-pink-100 rounded hover:bg-pink-200 transition-colors"
      >
        {audioStarted ? <FaPause aria-hidden /> : <FaPlay aria-hidden />}
      </button>
      <div className="text-sm text-[#6a1130]">Background Music</div>
    </div>
  )
}
