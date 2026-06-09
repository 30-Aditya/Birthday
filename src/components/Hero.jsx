import React from 'react'
import { motion } from 'framer-motion'
import { images } from '../assets/images'

export default function Hero() {
  return (
    <section className="hero-section" style={{ position: 'relative', zIndex: 1 }}>
      <motion.div
        className="hero-photo-ring"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <img src={images.khushi1} alt="Khushi" />
      </motion.div>

      <motion.h1
        className="hero-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Happy Birthday Khushi ❤️
      </motion.h1>

      <motion.p
        className="hero-subtitle"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        Today is all about you ✨
      </motion.p>
    </section>
  )
}
