import React from 'react'

export default function Footer({ isMusicPlaying, toggleMusic }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-left">
          Made with ❤️ for Khushi
        </div>
        <button
          className="music-toggle-btn"
          onClick={toggleMusic}
          aria-label={isMusicPlaying ? 'Pause music' : 'Play music'}
          title={isMusicPlaying ? 'Pause Zara Zara' : 'Play Zara Zara'}
        >
          {isMusicPlaying ? '⏸ Pause Music' : '🎵 Play Music'}
        </button>
      </div>
    </footer>
  )
}
