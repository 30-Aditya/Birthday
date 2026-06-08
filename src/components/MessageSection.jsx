import React from 'react'
import { motion } from 'framer-motion'

const message = `Dear Khushi,\n\nHappy Birthday!\n\nI wanted to create something special because you're someone special.\n\nYour kindness, positivity, smile, and the way you make people feel comfortable are things that make you genuinely unique.\n\nI hope this birthday brings you happiness, success, good health, unforgettable memories, and every reason to smile.\n\nThank you for being such a wonderful friend.\n\nNever stop being the amazing person you are.\n\nEnjoy your day, Khushi ❤️`

function Typewriter({text}){
  const [idx, setIdx] = React.useState(0)
  React.useEffect(()=>{
    if(idx < text.length){
      const t = setTimeout(()=> setIdx(i=>i+1), 18)
      return ()=> clearTimeout(t)
    }
  },[idx, text])
  return <pre style={{fontFamily:`'Merriweather', serif`}} className="whitespace-pre-wrap font-medium text-[#4a0826] leading-8 text-lg">{text.slice(0, idx)}</pre>
}

export default function MessageSection(){
  return (
    <section className="mt-12 glass p-6 rounded-xl shadow-lg">
      <motion.h3 initial={{opacity:0, y:-8}} animate={{opacity:1, y:0}} className="text-2xl md:text-3xl font-semibold text-[#6a1130]">Personal Message</motion.h3>
      <div className="mt-4">
        <Typewriter text={message} />
      </div>
    </section>
  )
}
