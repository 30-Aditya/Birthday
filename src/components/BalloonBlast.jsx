import React, { useEffect, useRef } from 'react'

const COLORS = ['#FF6B6B','#FF8E53','#FFD93D','#6BCB77','#4D96FF','#C77DFF','#FF6DB2','#FF9EF5','#F72585','#7209B7']
const EMOJIS = ['🎈','🎉','🎊','💖','✨','🌸','🎀','🎆']

export default function BalloonBlast({ onDone }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const balloons = []
    const count = 28

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div')
      el.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}vw;
        bottom: -80px;
        font-size: ${Math.random() * 30 + 30}px;
        z-index: 9999;
        pointer-events: none;
        user-select: none;
        animation: balloonRise ${Math.random() * 1.5 + 1.5}s ease-out forwards;
        animation-delay: ${Math.random() * 0.8}s;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
      `
      el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
      document.body.appendChild(el)
      balloons.push(el)

      // burst effect
      el.addEventListener('animationend', () => {
        // create burst particles
        const rect = el.getBoundingClientRect()
        for (let j = 0; j < 10; j++) {
          const spark = document.createElement('div')
          const color = COLORS[Math.floor(Math.random() * COLORS.length)]
          spark.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: ${color};
            z-index: 9999;
            pointer-events: none;
            animation: sparkFly ${Math.random() * 0.5 + 0.4}s ease-out forwards;
            --sx: ${(Math.random() - 0.5) * 120}px;
            --sy: ${(Math.random() - 0.5) * 120}px;
            box-shadow: 0 0 6px ${color};
          `
          document.body.appendChild(spark)
          setTimeout(() => spark.remove(), 1000)
        }
        el.remove()
      })
    }

    const cleanup = setTimeout(() => {
      balloons.forEach(b => b.remove())
      if (onDone) onDone()
    }, 3500)

    return () => {
      clearTimeout(cleanup)
      balloons.forEach(b => { try { b.remove() } catch (e) {} })
    }
  }, [onDone])

  return null
}
