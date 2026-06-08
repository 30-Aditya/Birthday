import React from 'react'
import { motion } from 'framer-motion'
import { images } from '../assets/images'

export default function Hero(){
  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
        <div className="w-72 h-72 rounded-full overflow-hidden ring-4 ring-pink-200/60 shadow-glow-md mx-auto relative">
          <motion.img src={images.khushi1} alt="Khushi" className="w-full h-full object-cover premium-img" initial={{scale:0.98}} animate={{scale:1}} transition={{duration:1.6}} />
          {/* floating hearts */}
          <span className="heart left-6 top-4" style={{color:'var(--pink-1)'}}>💖</span>
          <span className="heart left-24 top-20" style={{animationDelay:'0.8s'}}>💕</span>
          <span className="heart left-40 top-10" style={{animationDelay:'1.4s'}}>💗</span>
        </div>

        <div>
          <motion.h1 initial={{opacity:0, x:-10}} animate={{opacity:1, x:0}} className="text-3xl md:text-5xl font-bold neon">Happy Birthday Khushi ❤️</motion.h1>
          <motion.p initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} className="mt-4 text-xl text-[#6a1130] max-w-xl">Today is all about you ✨</motion.p>
        </div>
      </div>
    </section>
  )
}
