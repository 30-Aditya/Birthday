import React, { useRef, useState, useEffect } from 'react'
import { images, uploaded } from '../assets/images'

export default function VideoSection({ videoRef: parentVideoRef, onVideoPlay, onVideoPause }){
  const localVideoRef = useRef(null)
  const videoRef = parentVideoRef || localVideoRef
  const [aspect, setAspect] = useState(null)

  function onLoadedMeta(e){
    const v = e.currentTarget
    if(v && v.videoWidth && v.videoHeight){
      setAspect(`${v.videoWidth}/${v.videoHeight}`)
    }
  }

  useEffect(() => {
    return () => {
      // If the component is unmounting while the video is playing, trigger pause/ended callback
      if (videoRef && videoRef.current && !videoRef.current.paused) {
        onVideoPause && onVideoPause()
      }
    }
  }, [onVideoPause, videoRef])

  return (
    <section className="mt-12">
      <h3 className="text-2xl font-semibold mb-4">A Special Birthday Moment for Khushi ❤️</h3>
      <div className="glass rounded-xl p-4">
        {uploaded.specialVideo ? (
          <div className="rounded overflow-hidden flex items-center justify-center" style={aspect ? { aspectRatio: aspect } : {}}>
            <video 
              ref={videoRef} 
              src={uploaded.specialVideo} 
              controls 
              className="w-full h-full object-cover rounded-lg shadow-glow-md" 
              preload="metadata" 
              onLoadedMetadata={onLoadedMeta}
              onPlay={(e) => onVideoPlay && onVideoPlay(e.currentTarget)}
              onPause={() => onVideoPause && onVideoPause()}
              onEnded={() => onVideoPause && onVideoPause()}
            />
          </div>
        ) : (
          <div className="text-center text-[#6a1130]">No birthday video found in the project assets. Please add the MP4 to <strong>src/assets</strong>.</div>
        )}
      </div>
    </section>
  )
}
