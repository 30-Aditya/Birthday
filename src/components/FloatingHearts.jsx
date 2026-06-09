import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaHeart } from 'react-icons/fa'

export default function FloatingHearts() {
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    // Generate hearts periodically
    const interval = setInterval(() => {
      setHearts(prev => {
        // limit number of hearts to 30 to prevent performance issues
        const updated = [...prev, {
          id: Math.random().toString(),
          left: Math.random() * 100, // percentage for x-position
          size: Math.random() * 20 + 10, // 10px to 30px
          duration: Math.random() * 5 + 5 // 5s to 10s floating duration
        }]
        if (updated.length > 30) return updated.slice(updated.length - 30)
        return updated
      })
    }, 800)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          initial={{ y: '100vh', opacity: 1, scale: 0 }}
          animate={{ y: '-10vh', opacity: 0, scale: 1 }}
          transition={{ duration: heart.duration, ease: 'easeOut' }}
          className="absolute text-pink-400 drop-shadow-md"
          style={{ left: `${heart.left}%`, fontSize: heart.size }}
        >
          <FaHeart />
        </motion.div>
      ))}
    </div>
  )
}
