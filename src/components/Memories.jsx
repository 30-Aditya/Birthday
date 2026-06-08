import React from 'react'
import { motion } from 'framer-motion'


const memories = [
  {title:'A day I will always remember', text:'A day I will always remember with you ❤️'},
  {title:'Every moment', text:'Every moment with you feels special ✨'},
  {title:'Smiles and laughter', text:'Smiles, laughter, and beautiful memories 🌸'},
  {title:'So many more', text:'So many more memories to come 💫'}
]

export default function Memories(){
  return (
    <section className="mt-12">
      <h3 className="text-2xl font-semibold mb-6">Memories</h3>
      <div className="space-y-4">
        {memories.map((m,i)=> (
          <motion.div key={i} initial={{opacity:0, x:-20}} whileInView={{opacity:1, x:0}} viewport={{once:true}} className="glass p-4 rounded-lg">
            <div className="font-semibold text-[#501033]">{m.title}</div>
            <div className="text-[#6a1130] mt-1">{m.text}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
