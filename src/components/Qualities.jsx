import React from 'react'
import { motion } from 'framer-motion'

const qualities = [
  {emoji:'🌸', title:'Kind Heart'},
  {emoji:'✨', title:'Beautiful Smile'},
  {emoji:'🌈', title:'Positive Energy'},
  {emoji:'⭐', title:'Amazing Friend'},
  {emoji:'💫', title:'Wonderful Personality'}
]

export default function Qualities(){
  return (
    <section className="mt-12">
      <h3 className="text-2xl font-semibold mb-6">Special Qualities</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {qualities.map((q,i)=> (
          <motion.div key={i} whileInView={{y:0, opacity:1}} initial={{y:20, opacity:0}} viewport={{once:true}} className="glass p-4 rounded-xl flex items-center gap-4">
            <div className="text-3xl">{q.emoji}</div>
            <div>
              <div className="font-semibold">{q.title}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
