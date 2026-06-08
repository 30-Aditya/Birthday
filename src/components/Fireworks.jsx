import React, {useEffect, useRef} from 'react'

export default function Fireworks({duration=7000}){
  const ref = useRef(null)

  useEffect(()=>{
    const canvas = ref.current
    if(!canvas) return
    const ctx = canvas.getContext('2d')
    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight
    const particles = []
    const colors = ['#ff4da6','#ffb3d9','#ffd1e6','#ff7fbf','#ff99cc','#ff5c99']

    function spawn(x,y){
      for(let i=0;i<120;i++){
        particles.push({
          x, y,
          vx:(Math.random()-0.5)*8,
          vy:(Math.random()-4)*8,
          life: Math.random()*80+40,
          color: colors[(Math.random()*colors.length)|0]
        })
      }
    }

    function resize(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight }
    window.addEventListener('resize', resize)

    let raf
    function step(){
      ctx.clearRect(0,0,w,h)
      for(let i=particles.length-1;i>=0;i--){
        const p = particles[i]
        p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life--
        ctx.fillStyle = p.color
        ctx.beginPath(); ctx.arc(p.x,p.y,3,0,Math.PI*2); ctx.fill()
        if(p.life<=0) particles.splice(i,1)
      }
      raf = requestAnimationFrame(step)
    }

    // Auto spawn bursts across the top area
    const interval = setInterval(()=>{
      const x = Math.random()*w
      const y = 120 + Math.random()*120
      spawn(x,y)
    }, 400)

    step()
    const timeout = setTimeout(()=>{ clearInterval(interval); cancelAnimationFrame(raf); ctx.clearRect(0,0,w,h) }, duration)

    return ()=>{ clearInterval(interval); clearTimeout(timeout); cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  },[duration])

  return (
    <canvas ref={ref} className="fixed inset-0 w-full h-full pointer-events-none z-50" />
  )
}
