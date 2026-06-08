import React, { Suspense, lazy, useState, useEffect } from 'react'
import Hero from './components/Hero'
import Qualities from './components/Qualities'
import CakeSection from './components/CakeSection'
import FinalWish from './components/FinalWish'
import Footer from './components/Footer'
import Fireworks from './components/Fireworks'

// Lazy-loaded sections
const MessageSection = lazy(()=> import('./components/MessageSection'))
const Gallery = lazy(()=> import('./components/Gallery'))
const VideoSection = lazy(()=> import('./components/VideoSection'))
const Memories = lazy(()=> import('./components/Memories'))

export default function App(){
  const [showFireworks, setShowFireworks] = useState(false)

  useEffect(()=>{
    try{
      const params = new URLSearchParams(window.location.search)
      const fire = params.get('fireworks') || params.get('celebrate')
      if(fire === '1' || fire === 'true') setShowFireworks(true)
    }catch(e){ }
  },[])
  return (
    <div className="min-h-screen flex flex-col">
      {showFireworks && <Fireworks duration={9000} />}
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
      <Footer />
    </div>
  )
}
