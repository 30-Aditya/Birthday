import React, { useState } from 'react'

export default function Footer({ audioRef }) {
  const [playing, setPlaying] = useState(false)

  function togglePlay() {
    const audio = audioRef?.current
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-left">
          Made with ❤️ for Khushi
        </div>
        <button
          className="music-toggle-btn"
          onClick={togglePlay}
          aria-label={playing ? 'Pause music' : 'Play music'}
          title={playing ? 'Pause Zara Zara' : 'Play Zara Zara'}
        >
          {playing ? '⏸ Pause Music' : '🎵 Play Music'}
        </button>
      </div>
    </footer>
  )
}
