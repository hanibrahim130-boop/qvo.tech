import { useEffect, useRef, useState } from 'react'

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4'
const MAX_WIDTH = 960
const MAX_FRAMES = 90

interface ScrollVideoProps {
  scrollRef: React.RefObject<HTMLDivElement | null>
}

export default function ScrollVideo({ scrollRef }: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const posterRef = useRef<HTMLImageElement>(null)
  const offscreenVideoRef = useRef<HTMLVideoElement | null>(null)
  
  const [frames, setFrames] = useState<ImageBitmap[]>([])
  const [framesReady, setFramesReady] = useState(false)
  const [videoHasFrame, setVideoHasFrame] = useState(false)
  const [posterVisible, setPosterVisible] = useState(true)
  const [videoVisible, setVideoVisible] = useState(true)
  
  const smoothedProgress = useRef<number>(0)
  const animationFrameId = useRef<number | null>(null)
  const frameExtractionStarted = useRef(false)
  
  // Create offscreen video for frame extraction
  useEffect(() => {
    const offscreenVideo = document.createElement('video')
    offscreenVideo.src = VIDEO_URL
    offscreenVideo.muted = true
    offscreenVideo.playsInline = true
    offscreenVideo.preload = 'auto'
    offscreenVideo.crossOrigin = 'anonymous'
    offscreenVideoRef.current = offscreenVideo
    
    return () => {
      if (offscreenVideoRef.current) {
        offscreenVideoRef.current = null
      }
    }
  }, [])
  
  // Handle visible video loadeddata
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    const handleLoadedData = () => {
      setVideoHasFrame(true)
      
      // Start frame extraction after delay
      if (!frameExtractionStarted.current) {
        frameExtractionStarted.current = true
        setTimeout(() => {
          extractFrames()
        }, 300)
      }
    }
    
    video.addEventListener('loadeddata', handleLoadedData)
    
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [])
  
  // Handle offscreen video loadedmetadata for frame extraction
  useEffect(() => {
    const offscreenVideo = offscreenVideoRef.current
    if (!offscreenVideo) return
    
    const handleMetadataLoaded = () => {
      // Trigger extraction if visible video already has data
      if (videoRef.current && videoHasFrame && !frameExtractionStarted.current) {
        frameExtractionStarted.current = true
        setTimeout(() => {
          extractFrames()
        }, 300)
      }
    }
    
    offscreenVideo.addEventListener('loadedmetadata', handleMetadataLoaded)
    
    return () => {
      offscreenVideo.removeEventListener('loadedmetadata', handleMetadataLoaded)
    }
  }, [videoHasFrame])
  
  const extractFrames = async () => {
    const offscreenVideo = offscreenVideoRef.current
    if (!offscreenVideo || !offscreenVideo.duration) return
    
    const duration = offscreenVideo.duration
    const fps = 12
    const targetFrameCount = Math.min(MAX_FRAMES, Math.max(24, Math.floor(duration * fps)))
    const frameInterval = duration / targetFrameCount
    
    const extractedFrames: ImageBitmap[] = []
    const tempCanvas = document.createElement('canvas')
    const ctx = tempCanvas.getContext('2d')
    
    if (!ctx) return
    
    // Seek through video and extract frames
    for (let i = 0; i < targetFrameCount; i++) {
      const time = i * frameInterval
      offscreenVideo.currentTime = time
      
      await new Promise<void>((resolve) => {
        const handleSeeked = () => {
          offscreenVideo.removeEventListener('seeked', handleSeeked)
          
          // Calculate scaled dimensions for object-cover
          const videoRatio = offscreenVideo.videoWidth / offscreenVideo.videoHeight
          let drawWidth = MAX_WIDTH
          let drawHeight = MAX_WIDTH / videoRatio
          
          tempCanvas.width = drawWidth
          tempCanvas.height = drawHeight
          
          ctx.drawImage(offscreenVideo, 0, 0, drawWidth, drawHeight)
          
          createImageBitmap(tempCanvas).then((bitmap) => {
            extractedFrames.push(bitmap)
            resolve()
          })
        }
        
        offscreenVideo.addEventListener('seeked', handleSeeked, { once: true })
      })
    }
    
    setFrames(extractedFrames)
    setFramesReady(true)
  }
  
  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return
      
      const { scrollHeight, clientHeight } = scrollRef.current
      const scrollY = scrollRef.current.scrollTop
      
      const maxScroll = scrollHeight - clientHeight
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0
      const clampedProgress = Math.min(1, Math.max(0, progress))
      
      // Smooth with lerp
      smoothedProgress.current += (clampedProgress - smoothedProgress.current) * 0.12
    }
    
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll() // Initial call
      
      return () => {
        scrollElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [scrollRef])
  
  // Animation loop for drawing
  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    
    const animate = () => {
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      
      if (framesReady && frames.length > 0) {
        // Draw from frame cache
        const frameIndex = Math.floor(smoothedProgress.current * (frames.length - 1))
        const frame = frames[frameIndex]
        
        if (frame) {
          // Object-cover math
          const canvasRatio = rect.width / rect.height
          const frameRatio = frame.width / frame.height
          
          let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number
          
          if (canvasRatio > frameRatio) {
            drawHeight = rect.height
            drawWidth = rect.height * frameRatio
            offsetX = (rect.width - drawWidth) / 2
            offsetY = 0
          } else {
            drawWidth = rect.width
            drawHeight = rect.width / frameRatio
            offsetX = 0
            offsetY = (rect.height - drawHeight) / 2
          }
          
          ctx.drawImage(frame, offsetX, offsetY, drawWidth, drawHeight)
        }
        
        // Fade in canvas when ready
        if (posterVisible) {
          setPosterVisible(false)
        }
        if (videoVisible) {
          setVideoVisible(false)
        }
      } else if (video && video.duration && videoHasFrame) {
        // Fallback: seek video
        const targetTime = smoothedProgress.current * (video.duration - 0.05)
        const currentTime = video.currentTime
        
        if (Math.abs(targetTime - currentTime) > 0.04) {
          video.currentTime = targetTime
        }
      }
      
      animationFrameId.current = requestAnimationFrame(animate)
    }
    
    animationFrameId.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [framesReady, frames, posterVisible, videoVisible, videoHasFrame])
  
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
    }
    
    window.addEventListener('resize', handleResize)
    handleResize()
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return (\n    <div className="fixed inset-0 z-0 overflow-hidden bg-page pointer-events-none">\n      {/* Poster */}
      <img
        ref={posterRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4"
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${posterVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ display: 'none' }}
      />
      
      {/* Video element for fallback */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${videoVisible && !framesReady ? 'opacity-100' : 'opacity-0'}`}
      />
      
      {/* Canvas for scrubbed frames */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${framesReady ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
