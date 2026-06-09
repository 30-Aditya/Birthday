import React from 'react'
import MusicPlayer from './MusicPlayer'

export default function Footer({ audioStarted, togglePlay }){
  return (
    <footer className="py-6 mt-8">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
        <div className="text-sm text-[#6a1130]">Made with ❤️ for Khushi</div>
        <MusicPlayer audioStarted={audioStarted} togglePlay={togglePlay} />
      </div>
    </footer>
  )
}
