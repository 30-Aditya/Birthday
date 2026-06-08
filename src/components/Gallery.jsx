import React, {useState, useRef, useEffect} from 'react'
import { images, allUploaded } from '../assets/images'
import { motion } from 'framer-motion'

// Build gallery items dynamically from uploaded images when available.
// Falls back to the mapped `images.khushi*` slots if there are no uploaded files.
const fallbackItems = [images.khushi1, images.khushi2, images.khushi3, images.khushi4, images.khushi5]
const items = (allUploaded && allUploaded.length > 0) ? allUploaded : fallbackItems

export default function Gallery(){
  const [light, setLight] = useState({open:false, src:null, idx:0})
  const containerRef = useRef(null)

  useEffect(()=>{
    function onKey(e){
      if(!light.open) return
      if(e.key === 'Escape') setLight({open:false, src:null, idx:0})
      if(e.key === 'ArrowRight') goto(light.idx+1)
      if(e.key === 'ArrowLeft') goto(light.idx-1)
    }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  },[light])

  function goto(i){
    const idx = (i + items.length) % items.length
    setLight(s=> ({...s, src: items[idx], idx}))
  }

  // basic swipe support
  useEffect(()=>{
    const c = containerRef.current
    if(!c) return
    let sx = 0, sy=0
    function start(e){ sx = e.touches ? e.touches[0].clientX : e.clientX }
    function end(e){ const ex = e.changedTouches ? e.changedTouches[0].clientX : e.clientX; const d = ex - sx; if(Math.abs(d) > 50){ if(d<0) goto(light.idx+1); else goto(light.idx-1) } }
    c.addEventListener('touchstart', start); c.addEventListener('touchend', end); c.addEventListener('mousedown', start); c.addEventListener('mouseup', end)
    return ()=>{ c.removeEventListener('touchstart', start); c.removeEventListener('touchend', end); c.removeEventListener('mousedown', start); c.removeEventListener('mouseup', end) }
  },[light])

  return (
    <section className="mt-12">
      <h3 className="text-2xl font-semibold mb-4">Photo Gallery</h3>
      <div ref={containerRef} className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {items.map((src,i)=> (
          <motion.div key={i} whileHover={{scale:1.02}} className="break-inside-avoid relative cursor-zoom-in">
            <img src={src} alt={`Photo ${i+1} of Khushi`} loading="lazy" className="w-full rounded-lg object-cover premium-img" onClick={()=>setLight({open:true,src, idx:i})} tabIndex={0} onKeyDown={(e)=> e.key==='Enter' && setLight({open:true,src, idx:i})} />
          </motion.div>
        ))}
      </div>

      {light.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 lightbox-backdrop" role="dialog" aria-modal="true">
          <button aria-label="close lightbox" className="absolute top-6 right-6 text-[#6a1130] p-2 z-60 text-2xl" onClick={()=>setLight({open:false,src:null, idx:0})}>✕</button>
          <button aria-label="previous" className="absolute left-6 top-1/2 -translate-y-1/2 text-[#6a1130] p-2 z-60 text-3xl" onClick={()=> goto(light.idx-1)}>‹</button>
          <button aria-label="next" className="absolute right-6 top-1/2 -translate-y-1/2 text-[#6a1130] p-2 z-60 text-3xl" onClick={()=> goto(light.idx+1)}>›</button>
          <motion.img src={light.src} initial={{scale:0.96, opacity:0}} animate={{scale:1, opacity:1}} className="max-w-4xl max-h-[90vh] rounded-2xl shadow-glow-md" />
        </div>
      )}
    </section>
  )
}
