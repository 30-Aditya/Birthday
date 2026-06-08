import React, {useState} from 'react'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { images } from '../assets/images'

export default function FinalWish(){
  const [open, setOpen] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)
  useEffect(()=>{
    let raf
    if(showFireworks){
      const canvas = document.getElementById('fireworks-canvas')
      if(!canvas) return
      const ctx = canvas.getContext('2d')
      function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight }
      resize(); window.addEventListener('resize', resize)

      const particles = []
      function spawn(){
        const cx = Math.random()*canvas.width
        const cy = Math.random()*canvas.height*0.6
        const hue = 330 + Math.random()*40
        const color = `hsl(${hue},85%,65%)`
        for(let i=0;i<36;i++){
          particles.push({x:cx,y:cy,vx:(Math.random()-0.5)*6, vy:(Math.random()-0.5)*6, life: Math.random()*60+30, color})
        }
      }
      function loop(){
        ctx.fillStyle = 'rgba(255,240,247,0.12)'
        ctx.fillRect(0,0,canvas.width,canvas.height)
        if(Math.random()<0.14) spawn()
        for(let i=particles.length-1;i>=0;i--){
          const p = particles[i]
          p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.life--
          ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(0, p.life/80)
          ctx.beginPath(); ctx.arc(p.x,p.y,Math.max(1, p.life/18),0,Math.PI*2); ctx.fill()
          if(p.life<=0) particles.splice(i,1)
        }
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)

      const t = setTimeout(()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize', resize); const c = document.getElementById('fireworks-canvas'); if(c) c.getContext('2d').clearRect(0,0,c.width,c.height); }, 4200)
      return ()=>{ clearTimeout(t); cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
    }
  },[showFireworks])

  return (
    <section className="mt-12 text-center">
      <button onClick={()=>setOpen(true)} className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-400 to-pink-200 text-[#4a0826] font-bold shadow-glow-md">Open Final Birthday Wish</button>

      {open && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 flex items-center justify-center z-50 p-6 lightbox-backdrop" role="dialog">
          <div className="max-w-2xl w-full glass p-6 rounded-2xl text-left relative">
            <div className="flex gap-4 items-start">
              <img src={images.khushi3} alt="Final" className="w-40 h-40 object-cover rounded-xl shadow-glow-md" />
              <div>
                <h2 className="text-2xl font-bold neon">Khushi,</h2>
                <p className="mt-4 text-[#4a0826]">You are truly special. May your life always be filled with happiness, love, and success.</p>
                <p className="mt-3 font-semibold text-[#9b1452]">Happy Birthday ❤️</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={()=>{ setShowFireworks(true); setTimeout(()=>setShowFireworks(false),4000) }} className="px-4 py-2 bg-pink-400 rounded text-[#4a0826] font-bold">Launch Fireworks</button>
              <button onClick={()=>setOpen(false)} className="px-4 py-2 bg-pink-100 rounded">Close</button>
            </div>
          </div>
        </motion.div>
      )}
      {showFireworks && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <canvas id="fireworks-canvas" className="w-full h-full" />
        </div>
      )}
    </section>
  )
}
