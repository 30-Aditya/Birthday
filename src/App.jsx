import React, { Suspense, lazy, useState, useEffect, useRef } from 'react'
import Hero from './components/Hero'
import Qualities from './components/Qualities'
import CakeSection from './components/CakeSection'
import FinalWish from './components/FinalWish'
import Footer from './components/Footer'
import Fireworks from './components/Fireworks'
import { piano } from './assets/images'

// Lazy-loaded sections
const MessageSection = lazy(()=> import('./components/MessageSection'))
const Gallery = lazy(()=> import('./components/Gallery'))
const VideoSection = lazy(()=> import('./components/VideoSection'))
const Memories = lazy(()=> import('./components/Memories'))

export default function App(){
  const [showFireworks, setShowFireworks] = useState(true)
  const baseUrl = import.meta.env.BASE_URL || '/'
  const [audioSrc, setAudioSrc] = useState(`${baseUrl}assets/zara-zara.mp3`)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const [audioStarted, setAudioStarted] = useState(false)
  const audioRef = useRef(null)

  useEffect(()=>{
    // allow URL param to explicitly disable fireworks (useful for testing)
    try{
      const params = new URLSearchParams(window.location.search)
      const fire = params.get('fireworks') || params.get('celebrate')
      if(fire === '0' || fire === 'false') setShowFireworks(false)
    }catch(e){ }
  },[])

  useEffect(()=>{
    const audio = audioRef.current
    if(!audio) return
    audio.loop = true
    audio.preload = 'auto'

    // fallback to remote piano sample if local Zara file missing
    const onError = ()=>{ if(audioSrc !== piano) setAudioSrc(piano) }
    audio.addEventListener('error', onError)

    // Try autoplay once on load
    const tryPlay = async ()=>{
      try{
        await audio.play()
        setAutoplayBlocked(false)
        setAudioStarted(true)
      }catch(err){
        if(!audioStarted){
          setAutoplayBlocked(true)
        }
      }
    }
    
    if (audioStarted || !autoplayBlocked) {
      tryPlay()
    }

    return ()=>{
      audio.removeEventListener('error', onError)
    }
  },[audioSrc])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audioStarted) {
      audio.pause()
      setAudioStarted(false)
    } else {
      audio.play().then(() => {
        setAudioStarted(true)
        setAutoplayBlocked(false)
      }).catch(err => {
        console.error("Failed to play audio:", err)
      })
    }
  }
  return (
    <div className="min-h-screen flex flex-col">
      {showFireworks && <Fireworks duration={12000} />}
      <audio ref={audioRef} src={audioSrc} preload="auto" />

      {autoplayBlocked && !audioStarted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
          <button
            aria-label="Start surprise"
            className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg text-lg md:text-xl"
            onClick={async ()=>{
              try{
                await audioRef.current.play()
                setAudioStarted(true)
                setAutoplayBlocked(false)
              }catch(e){ /* ignore */ }
            }}
          >
            Tap to Start Surprise 🎉
          </button>
        </div>
      )}
      <main className="flex-1">
        <Hero />
        <div className="max-w-5xl mx-auto px-6 py-12">
          <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
            <MessageSection />
            <Gallery />
            <Qualities />
            <VideoSection />
            <CakeSection />
            <Memories />
            <FinalWish />
          </Suspense>
        </div>
      </main>
      <Footer audioStarted={audioStarted} togglePlay={togglePlay} />
    </div>
  )
}
