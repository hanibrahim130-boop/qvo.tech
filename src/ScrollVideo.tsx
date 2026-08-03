import { useEffect, useRef, useState } from 'react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4'
const DESKTOP_MAX_WIDTH = 720
const DESKTOP_MAX_FRAMES = 48
const MOBILE_MAX_WIDTH = 540
const MOBILE_MAX_FRAMES = 32

interface ScrollVideoProps {
  scrollRef: React.RefObject<HTMLDivElement | null>
}

interface CanvasSize {
  width: number
  height: number
  dpr: number
}

export default function ScrollVideo({ scrollRef }: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const offscreenVideoRef = useRef<HTMLVideoElement | null>(null)
  const animationFrameId = useRef<number | null>(null)
  const frameExtractionStarted = useRef(false)
  const targetProgress = useRef(0)
  const smoothedProgress = useRef(0)
  const lastFrameIndex = useRef(-1)
  const lastSeekAt = useRef(0)
  const canvasSize = useRef<CanvasSize>({ width: 0, height: 0, dpr: 1 })

  const [frames, setFrames] = useState<ImageBitmap[]>([])
  const [framesReady, setFramesReady] = useState(false)
  const [videoHasFrame, setVideoHasFrame] = useState(false)
  const [posterVisible, setPosterVisible] = useState(true)
  const [videoVisible, setVideoVisible] = useState(true)

  useEffect(() => {
    const offscreenVideo = document.createElement('video')
    offscreenVideo.src = VIDEO_URL
    offscreenVideo.muted = true
    offscreenVideo.playsInline = true
    offscreenVideo.preload = 'auto'
    offscreenVideo.crossOrigin = 'anonymous'
    offscreenVideoRef.current = offscreenVideo

    return () => {
      offscreenVideo.pause()
      offscreenVideo.removeAttribute('src')
      offscreenVideo.load()
      offscreenVideoRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      frames.forEach((frame) => frame.close())
    }
  }, [frames])

  const extractFrames = async () => {
    const offscreenVideo = offscreenVideoRef.current
    if (!offscreenVideo) return

    if (!offscreenVideo.duration) {
      offscreenVideo.addEventListener('loadedmetadata', () => {
        void extractFrames()
      }, { once: true })
      return
    }

    const isMobile = window.matchMedia('(max-width: 767px)').matches
    const maxWidth = isMobile ? MOBILE_MAX_WIDTH : DESKTOP_MAX_WIDTH
    const maxFrames = isMobile ? MOBILE_MAX_FRAMES : DESKTOP_MAX_FRAMES
    const targetFrameCount = Math.min(maxFrames, Math.max(24, Math.floor(offscreenVideo.duration * 12)))
    const frameInterval = offscreenVideo.duration / targetFrameCount
    const extractedFrames: ImageBitmap[] = []
    const tempCanvas = document.createElement('canvas')
    const context = tempCanvas.getContext('2d', { alpha: false })

    if (!context || !offscreenVideo.videoWidth || !offscreenVideo.videoHeight) return

    const frameWidth = Math.min(maxWidth, offscreenVideo.videoWidth)
    const frameHeight = Math.round(frameWidth / (offscreenVideo.videoWidth / offscreenVideo.videoHeight))
    tempCanvas.width = frameWidth
    tempCanvas.height = frameHeight

    for (let i = 0; i < targetFrameCount; i += 1) {
      offscreenVideo.currentTime = i * frameInterval

      await new Promise<void>((resolve) => {
        const handleSeeked = async () => {
          offscreenVideo.removeEventListener('seeked', handleSeeked)
          context.drawImage(offscreenVideo, 0, 0, frameWidth, frameHeight)

          try {
            extractedFrames.push(await createImageBitmap(tempCanvas))
          } catch {
            // Keep the video-seek fallback active if a frame cannot be decoded.
          }
          resolve()
        }

        offscreenVideo.addEventListener('seeked', handleSeeked, { once: true })
      })

      // Let input and painting run while the cache is being built.
      if (i > 0 && i % 4 === 0) {
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
      }
    }

    if (extractedFrames.length) {
      setFrames(extractedFrames)
      setFramesReady(true)
      setPosterVisible(false)
      setVideoVisible(false)
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const startExtraction = () => {
      setVideoHasFrame(true)
      if (frameExtractionStarted.current) return

      frameExtractionStarted.current = true
      window.setTimeout(() => {
        void extractFrames()
      }, 300)
    }

    video.addEventListener('loadeddata', startExtraction)
    return () => video.removeEventListener('loadeddata', startExtraction)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollElement = scrollRef.current
      if (!scrollElement) return

      const maxScroll = scrollElement.scrollHeight - scrollElement.clientHeight
      targetProgress.current = maxScroll > 0
        ? Math.min(1, Math.max(0, scrollElement.scrollTop / maxScroll))
        : 0
    }

    const scrollElement = scrollRef.current
    if (!scrollElement) return

    scrollElement.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => scrollElement.removeEventListener('scroll', handleScroll)
  }, [scrollRef])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d', { alpha: false })
    if (!context) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const backingWidth = Math.max(1, Math.round(rect.width * dpr))
      const backingHeight = Math.max(1, Math.round(rect.height * dpr))

      if (canvas.width === backingWidth && canvas.height === backingHeight) return

      canvas.width = backingWidth
      canvas.height = backingHeight
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.imageSmoothingQuality = 'medium'
      canvasSize.current = { width: rect.width, height: rect.height, dpr }
      lastFrameIndex.current = -1
    }

    resizeCanvas()
    const observer = new ResizeObserver(resizeCanvas)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas) return

    const context = canvas.getContext('2d', { alpha: false })
    if (!context) return

    const animate = (now: number) => {
      const delta = targetProgress.current - smoothedProgress.current
      smoothedProgress.current = Math.abs(delta) < 0.0001
        ? targetProgress.current
        : smoothedProgress.current + delta * 0.12

      const { width, height } = canvasSize.current
      if (width > 0 && height > 0 && framesReady && frames.length > 0) {
        const frameIndex = Math.floor(smoothedProgress.current * (frames.length - 1))
        const frame = frames[frameIndex]

        if (frame && frameIndex !== lastFrameIndex.current) {
          const canvasRatio = width / height
          const frameRatio = frame.width / frame.height
          let drawWidth: number
          let drawHeight: number
          let offsetX: number
          let offsetY: number

          if (canvasRatio > frameRatio) {
            drawWidth = width
            drawHeight = width / frameRatio
            offsetX = 0
            offsetY = (height - drawHeight) / 2
          } else {
            drawWidth = height * frameRatio
            drawHeight = height
            offsetX = (width - drawWidth) / 2
            offsetY = 0
          }

          context.drawImage(frame, offsetX, offsetY, drawWidth, drawHeight)
          lastFrameIndex.current = frameIndex
        }
      } else if (video && video.duration && videoHasFrame && now - lastSeekAt.current > 42) {
        const targetTime = smoothedProgress.current * Math.max(0, video.duration - 0.05)
        if (Math.abs(targetTime - video.currentTime) > 0.08) {
          video.currentTime = targetTime
          lastSeekAt.current = now
        }
      }

      animationFrameId.current = requestAnimationFrame(animate)
    }

    animationFrameId.current = requestAnimationFrame(animate)
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [frames, framesReady, videoHasFrame])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-page pointer-events-none">
      <img
        src={VIDEO_URL}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${posterVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ display: 'none' }}
      />
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${videoVisible && !framesReady ? 'opacity-100' : 'opacity-0'}`}
      />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${framesReady ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
