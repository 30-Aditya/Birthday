import React, {useRef, useState, useEffect} from 'react'
import { piano } from '../assets/images'
import { FaPlay, FaPause } from 'react-icons/fa'

export default function MusicPlayer(){
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(()=>{
    const a = audioRef.current
    if(!a) return
    playing ? a.play().catch(()=>{}) : a.pause()
  },[playing])

  return (
    <div className="flex items-center gap-3">
      <audio ref={audioRef} src={piano} loop />
      <button aria-pressed={playing} aria-label={playing? 'Pause music' : 'Play music'} onClick={()=>setPlaying(p=>!p)} className="p-2 bg-pink-100 rounded">
        {playing ? <FaPause aria-hidden/> : <FaPlay aria-hidden/>}
      </button>
      <div className="text-sm text-[#6a1130]">Background Music</div>
    </div>
  )
}
