import React, {useEffect, useState} from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const lines = [
  'Some people make life brighter...',
  'Some people make ordinary moments special...',
  'And one such person is celebrating her birthday today...'
]

export default function IntroAnimation(){
  const [step, setStep] = useState(0)
  useEffect(()=>{
    if(step < lines.length) {
      const t = setTimeout(()=> setStep(s=>s+1), 2000)
      return ()=> clearTimeout(t)
    }
    const t2 = setTimeout(()=> setStep(s=>s+1), 1800)
    return ()=> clearTimeout(t2)
  },[step])

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <AnimatePresence>
          {step < lines.length && (
            <motion.h2 key={step} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="text-xl md:text-2xl text-[#6a1130]">
              {lines[step]}
            </motion.h2>
          )}
        </AnimatePresence>

        {step >= lines.length && (
          <motion.h1 initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="mt-6 text-4xl md:text-6xl neon font-extrabold">
            HAPPY BIRTHDAY KHUSHI ❤️
          </motion.h1>
        )}
      </div>
    </div>
  )
}
