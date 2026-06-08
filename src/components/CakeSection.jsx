import React, {useState, useRef} from 'react'
import { motion } from 'framer-motion'

export default function CakeSection(){
  const [form, setForm] = useState({flavor:'Chocolate Truffle', name:'', address:'', message:''})
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const confettiRef = useRef(null)

  async function handleSubmit(e){
    e.preventDefault()
    // simple validation
    if(!form.name.trim() || !form.address.trim()){ setStatus('Please provide name and address.'); return }
    setSubmitting(true)
    setStatus('')
    try{
      const res = await fetch('/api/cake-order', {
        method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(form)
      })
      if(res.ok){
        setStatus('Your birthday surprise is being prepared ❤️')
        launchConfetti()
        setForm({flavor:'Chocolate Truffle', name:'', address:'', message:''})
        setSubmitting(false)
        return
      }
    }catch(err){
      // fallback to localStorage
    }
    const orders = JSON.parse(localStorage.getItem('cakeOrders')||'[]')
    orders.push({...form, date:new Date().toISOString()})
    localStorage.setItem('cakeOrders', JSON.stringify(orders))
    setStatus('Your birthday surprise is being prepared ❤️')
    launchConfetti()
    setForm({flavor:'Chocolate Truffle', name:'', address:'', message:''})
    setSubmitting(false)
  }

  function launchConfetti(){
    const canvas = confettiRef.current
    if(!canvas) return
    const ctx = canvas.getContext('2d')
    let particles = []
    function spawn(){
      for(let i=0;i<120;i++){
        particles.push({x: canvas.width/2 + (Math.random()-0.5)*200, y: canvas.height/2 + (Math.random()-0.5)*40, vx:(Math.random()-0.5)*6, vy:(Math.random()-4)*6, color:`hsl(${Math.random()*360},80%,60%)`, life:Math.random()*80+40})
      }
    }
    function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    spawn()
    let raf
    function step(){ ctx.clearRect(0,0,canvas.width,canvas.height); for(let i=particles.length-1;i>=0;i--){ const p=particles[i]; p.x+=p.vx; p.y+=p.vy; p.vy+=0.14; p.life--; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x,p.y,3,0,Math.PI*2); ctx.fill(); if(p.life<=0) particles.splice(i,1)} if(particles.length) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    setTimeout(()=>{ cancelAnimationFrame(raf); ctx.clearRect(0,0,canvas.width,canvas.height) }, 3500)
  }

  // Simple cake image set (public internet images) mapped to flavors for the preview.
  // Use stable placeholder images (picsum) per flavor seed so previews reliably load.
  const CAKE_IMAGES = {
    'Chocolate Truffle': 'https://picsum.photos/seed/chocolate/800/800',
    'Red Velvet': 'https://picsum.photos/seed/redvelvet/800/800',
    'Black Forest': 'https://picsum.photos/seed/blackforest/800/800',
    'Butterscotch': 'https://picsum.photos/seed/butterscotch/800/800'
  }

  // Prefer local cake images placed in public/images/cakes with these filenames
  const LOCAL_CAKE_FILES = {
    'Chocolate Truffle': '/images/cakes/chocolate-truffle.svg',
    'Red Velvet': '/images/cakes/red-velvet.svg',
    'Black Forest': '/images/cakes/black-forest.svg',
    'Butterscotch': '/images/cakes/butterscotch.svg'
  }

  return (
    <section className="mt-12">
      <h3 className="text-2xl font-semibold mb-4">Cake Surprise</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-xl">
          <div className="mb-4">
            <h4 className="text-lg font-semibold">3D Cake Preview</h4>
            <div className="mt-4 p-6 rounded-xl flex items-center justify-center">
                <div className="w-56 h-56 rounded-xl overflow-hidden shadow-inner flex items-center justify-center bg-white">
                  <img
                    src={LOCAL_CAKE_FILES[form.flavor] || CAKE_IMAGES[form.flavor]}
                    alt={`${form.flavor} cake`}
                    className="w-full h-full object-cover"
                    onError={(e)=>{
                      // first fallback: remote placeholder (picsum)
                      if(e.currentTarget.src && e.currentTarget.src.includes('/images/cakes/')){
                        e.currentTarget.onerror = null
                        e.currentTarget.src = CAKE_IMAGES[form.flavor] || 'https://via.placeholder.com/800x800?text=Cake+Preview'
                        return
                      }
                      // final fallback
                      e.currentTarget.onerror=null
                      e.currentTarget.src='https://via.placeholder.com/800x800?text=Cake+Preview'
                    }}
                  />
                </div>
              </div>
          </div>
          <div className="mt-4 text-sm text-[#6a1130]">Options: Chocolate Truffle | Red Velvet | Black Forest | Butterscotch</div>
        </div>

        <form className="glass p-6 rounded-xl" onSubmit={handleSubmit} aria-label="Cake order form">
          <label className="block mb-2">Flavor</label>
          <select value={form.flavor} onChange={e=>setForm({...form, flavor:e.target.value})} className="w-full p-2 rounded mb-4 bg-transparent border">
            <option>Chocolate Truffle</option>
            <option>Red Velvet</option>
            <option>Black Forest</option>
            <option>Butterscotch</option>
          </select>

          <label className="block mb-2">Name</label>
          <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full p-2 rounded mb-4 bg-transparent border" aria-label="Recipient name" required />

          <label className="block mb-2">Address</label>
          <input value={form.address} onChange={e=>setForm({...form, address:e.target.value})} className="w-full p-2 rounded mb-4 bg-transparent border" aria-label="Delivery address" required />

          <label className="block mb-2">Birthday Message</label>
          <textarea value={form.message} onChange={e=>setForm({...form, message:e.target.value})} className="w-full p-2 rounded mb-4 bg-transparent border" rows={4} aria-label="Birthday message" />

          <div className="flex items-center gap-3">
            <button disabled={submitting} className="px-4 py-2 rounded font-semibold bg-gradient-to-r from-pink-400 to-pink-200 text-[#4a0826]">{submitting ? 'Sending...' : 'Submit Surprise'}</button>
            <div className="text-sm text-[#6a1130]">{status}</div>
          </div>
          <canvas ref={confettiRef} className="fixed inset-0 pointer-events-none z-50" />
        </form>
      </div>
    </section>
  )
}
