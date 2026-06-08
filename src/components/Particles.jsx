import React, {useRef, useEffect} from 'react'

export default function Particles(){
  const canvasRef = useRef(null)

  useEffect(()=>{
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf = null
    function resize(){
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // simple floating hearts
    const hearts = []
    function rand(min,max){return Math.random()*(max-min)+min}
    for(let i=0;i<30;i++){
      hearts.push({x:rand(0,canvas.width), y:rand(0,canvas.height), s:rand(6,18), vx:rand(-0.2,0.2), vy:rand(-0.2,0.6), a:rand(0.4,1)})
    }

    function drawHeart(x,y,s,a){
      ctx.save(); ctx.translate(x,y); ctx.scale(s/20,s/20); ctx.globalAlpha = a;
      ctx.beginPath(); ctx.moveTo(0,0); ctx.bezierCurveTo(0,-3, -6,-15, -15,-15); ctx.bezierCurveTo(-35,-15, -35,10, -35,10); ctx.bezierCurveTo(-35,30, -10,55, 0,70); ctx.bezierCurveTo(10,55, 35,30, 35,10); ctx.bezierCurveTo(35,10, 35,-15, 15,-15); ctx.bezierCurveTo(6,-15, 0,-3, 0,0); ctx.closePath(); ctx.fillStyle = 'rgba(255,111,181,0.9)'; ctx.fill(); ctx.restore();
    }

    function step(){
      ctx.clearRect(0,0,canvas.width,canvas.height)
      for(const h of hearts){
        drawHeart(h.x, h.y, h.s, h.a)
        h.x += h.vx; h.y -= h.vy*0.6
        h.a -= 0.002
        if(h.a <= 0.02){
          h.x = rand(0,canvas.width); h.y = canvas.height + rand(10,200); h.s = rand(6,18); h.vx=rand(-0.2,0.2); h.vy=rand(-0.2,0.6); h.a=rand(0.4,1)
        }
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  },[])

  return <canvas ref={canvasRef} style={{position:'fixed', inset:0, pointerEvents:'none', zIndex:5}} />
}
