import React, { useEffect, useRef } from 'react'

export default function Fireworks({ duration = 15000, onDone }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight
    const particles = []
    const colors = [
      '#FF6B6B','#FF8E53','#FFD93D','#6BCB77','#4D96FF',
      '#C77DFF','#FF6DB2','#F72585','#7209B7','#FFB347',
      '#ff69b4','#ffd700','#00e5ff','#76ff03','#ff1744'
    ]

    function spawnBurst(x, y) {
      const burstColor = colors[Math.floor(Math.random() * colors.length)]
      const count = Math.floor(Math.random() * 60 + 80)
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count
        const speed = Math.random() * 5 + 2
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
          vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 2,
          life: Math.random() * 70 + 50,
          maxLife: 120,
          color: Math.random() > 0.3 ? burstColor : colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 3 + 1,
          trail: []
        })
      }
      // Add some sparkle stars
      for (let i = 0; i < 20; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 30,
          y: y + (Math.random() - 0.5) * 30,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          life: Math.random() * 40 + 20,
          maxLife: 60,
          color: '#ffffff',
          size: Math.random() * 2 + 0.5,
          isStar: true
        })
      }
    }

    function resize() {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)

    let raf
    let active = true
    function step() {
      if (!active) return
      ctx.fillStyle = 'rgba(0,0,0,0.12)'
      ctx.fillRect(0, 0, w, h)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.08 // gravity
        p.vx *= 0.98 // air resistance
        p.life--

        const alpha = Math.max(0, p.life / p.maxLife)
        ctx.globalAlpha = alpha

        if (p.isStar) {
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, Math.max(0.5, p.size * alpha), 0, Math.PI * 2)
          ctx.fill()
        }

        if (p.life <= 0) particles.splice(i, 1)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(step)
    }

    // Schedule random burst intervals
    const burstInterval = setInterval(() => {
      if (!active) return
      const x = Math.random() * w * 0.8 + w * 0.1
      const y = Math.random() * h * 0.5 + 50
      spawnBurst(x, y)
    }, 350)

    // Initial burst cluster
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        if (!active) return
        spawnBurst(Math.random() * w * 0.8 + w * 0.1, Math.random() * h * 0.4 + 80)
      }, i * 150)
    }

    step()

    const timeout = setTimeout(() => {
      active = false
      clearInterval(burstInterval)
      cancelAnimationFrame(raf)
      // Fade out canvas
      let alpha = 1
      const fadeInterval = setInterval(() => {
        alpha -= 0.05
        ctx.globalAlpha = alpha
        ctx.clearRect(0, 0, w, h)
        if (alpha <= 0) {
          clearInterval(fadeInterval)
          ctx.clearRect(0, 0, w, h)
          if (onDone) onDone()
        }
      }, 50)
    }, duration)

    return () => {
      active = false
      clearInterval(burstInterval)
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [duration, onDone])

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 9990 }}
    />
  )
}
