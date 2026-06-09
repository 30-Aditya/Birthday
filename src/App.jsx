import React, { Suspense, lazy, useState, useRef, useEffect } from 'react'
import Hero from './components/Hero'
import Qualities from './components/Qualities'
import CakeSection from './components/CakeSection'
import FinalWish from './components/FinalWish'
import Footer from './components/Footer'
import Fireworks from './components/Fireworks'
import BalloonBlast from './components/BalloonBlast'

const MessageSection = lazy(() => import('./components/MessageSection'))
const Gallery = lazy(() => import('./components/Gallery'))
const VideoSection = lazy(() => import('./components/VideoSection'))
const Memories = lazy(() => import('./components/Memories'))

export default function App() {
  const [surprisePhase, setSurprisePhase] = useState('idle') // idle | balloons | fireworks | done
  const [showGlowText, setShowGlowText] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)
  const [showBalloons, setShowBalloons] = useState(false)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [musicWasPlayingBeforeVideo, setMusicWasPlayingBeforeVideo] = useState(false)
  
  const audioRef = useRef(null)
  const videoElementRef = useRef(null)

  const baseUrl = import.meta.env.BASE_URL || '/'
  const audioSrc = `${baseUrl}assets/zara-zara.webm`

  // ── SEQUENCE WHEN USER TAPS SURPRISE ──────────────────────────
  function handleSurprise() {
    if (surprisePhase !== 'idle') return

    // Start balloons, fireworks, and glow text immediately
    setSurprisePhase('balloons')
    setShowBalloons(true)
    setShowFireworks(true)
    setShowGlowText(true)

    // Start music immediately
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.volume = 0.85
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true)
      }).catch(() => {})
    }

    // Stop effects after 15s from button click
    setTimeout(() => {
      setShowFireworks(false)
      setShowGlowText(false)
      setShowBalloons(false)
      setSurprisePhase('done')
    }, 15000)
  }

  // ── VIDEO PLAY/PAUSE INTERCEPTORS FOR AUDIO PRIORITY ──────────
  const handleVideoPlay = (videoEl) => {
    videoElementRef.current = videoEl
    if (audioRef.current && !audioRef.current.paused) {
      setMusicWasPlayingBeforeVideo(true)
      audioRef.current.pause()
      setIsMusicPlaying(false)
    } else {
      setMusicWasPlayingBeforeVideo(false)
    }
  }

  const handleVideoPause = () => {
    if (musicWasPlayingBeforeVideo) {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsMusicPlaying(true)
        }).catch(() => {})
      }
      setMusicWasPlayingBeforeVideo(false)
    }
  }

  const toggleMusic = () => {
    const audio = audioRef?.current
    if (!audio) return
    if (audio.paused) {
      // Never allow video audio and background music to play together
      if (videoElementRef.current && !videoElementRef.current.paused) {
        videoElementRef.current.pause()
      }
      audio.play().then(() => setIsMusicPlaying(true)).catch(() => {})
    } else {
      audio.pause()
      setIsMusicPlaying(false)
    }
  }

  return (
    <div className="app-root">
      {/* Inject balloon keyframes */}
      <style>{`
        @keyframes balloonRise {
          0%   { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
          70%  { transform: translateY(-70vh) scale(1.15) rotate(8deg); opacity: 1; }
          85%  { transform: translateY(-80vh) scale(1.35) rotate(-5deg); opacity: 0.9; }
          100% { transform: translateY(-100vh) scale(0.2) rotate(15deg); opacity: 0; }
        }
        @keyframes sparkFly {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--sx), var(--sy)) scale(0); opacity: 0; }
        }
        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 20px #ff69b4, 0 0 40px #ff69b4, 0 0 80px #ff69b4; }
          50%       { text-shadow: 0 0 40px #ff1493, 0 0 80px #ff1493, 0 0 120px #ff1493, 0 0 200px #ff69b4; }
        }
        @keyframes glowTextFadeIn {
          0%   { opacity: 0; transform: translateY(30px) scale(0.85); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-12px) rotate(1deg); }
        }
      `}</style>

      {/* Background floating hearts (always present but subtle) */}
      <div className="floating-hearts-bg" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="bg-heart"
            style={{
              left: `${(i * 8.3 + Math.random() * 5)}%`,
              animationDelay: `${i * 0.7}s`,
              fontSize: `${Math.random() * 14 + 10}px`,
              animationDuration: `${Math.random() * 4 + 6}s`
            }}
          >💕</span>
        ))}
      </div>

      {/* Balloon blast */}
      {showBalloons && <BalloonBlast />}

      {/* Fireworks */}
      {showFireworks && <Fireworks duration={13800} />}

      {/* Glowing Birthday Text overlay */}
      {showGlowText && (
        <div className="glow-text-overlay" aria-live="assertive">
          <div className="glow-text-inner">
            <div className="glow-title">🎂 Happy Birthday Khushi ❤️</div>
            <div className="glow-sub">Wishing you all the love in the world ✨</div>
          </div>
        </div>
      )}

      {/* Hidden audio — NO autoplay */}
      <audio ref={audioRef} src={audioSrc} preload="auto" loop />

      {/* TAP TO SURPRISE button — only show when idle */}
      {surprisePhase === 'idle' && (
        <div className="surprise-btn-wrapper">
          <button
            id="tap-to-surprise"
            className="surprise-btn"
            onClick={handleSurprise}
            aria-label="Tap To Surprise"
          >
            🎉 Tap To Surprise
          </button>
        </div>
      )}

      <main className="main-content">
        <Hero />
        <div className="sections-container">
          <Suspense fallback={<div className="loading-placeholder">Loading...</div>}>
            <MessageSection />
            <Gallery />
            <Qualities />
            <VideoSection videoRef={videoElementRef} onVideoPlay={handleVideoPlay} onVideoPause={handleVideoPause} />
            <CakeSection />
            <Memories />
            <FinalWish />
          </Suspense>
        </div>
      </main>

      <Footer isMusicPlaying={isMusicPlaying} toggleMusic={toggleMusic} />
    </div>
  )
}
