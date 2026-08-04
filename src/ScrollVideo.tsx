import { useEffect, useRef, useState } from 'react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4'

interface ScrollVideoProps {
  scrollRef: React.RefObject<HTMLDivElement | null>
}

export default function ScrollVideo({ scrollRef }: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const animationFrameId = useRef<number | null>(null)
  const targetProgress = useRef(0)
  const smoothedProgress = useRef(0)
  const lastSeekAt = useRef(0)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const scrollElement = scrollRef.current
    if (!video || !scrollElement) return

    const stopAnimation = () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current)
        animationFrameId.current = null
      }
    }

    const seekVideo = (now: number) => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return
      if (now - lastSeekAt.current < 33) return

      const targetTime = Math.min(
        Math.max(0, smoothedProgress.current * Math.max(0, video.duration - 0.05)),
        Math.max(0, video.duration - 0.05),
      )

      if (Math.abs(targetTime - video.currentTime) > 0.04) {
        video.currentTime = targetTime
        lastSeekAt.current = now
      }
    }

    const animate = (now: number) => {
      const delta = targetProgress.current - smoothedProgress.current
      smoothedProgress.current = Math.abs(delta) < 0.0005
        ? targetProgress.current
        : smoothedProgress.current + delta * 0.18

      seekVideo(now)

      if (Math.abs(targetProgress.current - smoothedProgress.current) >= 0.0005) {
        animationFrameId.current = requestAnimationFrame(animate)
      } else {
        animationFrameId.current = null
      }
    }

    const scheduleAnimation = () => {
      if (animationFrameId.current === null) {
        animationFrameId.current = requestAnimationFrame(animate)
      }
    }

    const updateTargetProgress = () => {
      const maxScroll = scrollElement.scrollHeight - scrollElement.clientHeight
      targetProgress.current = maxScroll > 0
        ? Math.min(1, Math.max(0, scrollElement.scrollTop / maxScroll))
        : 0
      scheduleAnimation()
    }

    const handleVideoReady = () => {
      setVideoReady(true)
      updateTargetProgress()
    }

    scrollElement.addEventListener('scroll', updateTargetProgress, { passive: true })
    video.addEventListener('loadedmetadata', handleVideoReady)
    video.addEventListener('loadeddata', handleVideoReady)
    video.addEventListener('seeked', scheduleAnimation)
    updateTargetProgress()

    return () => {
      stopAnimation()
      scrollElement.removeEventListener('scroll', updateTargetProgress)
      video.removeEventListener('loadedmetadata', handleVideoReady)
      video.removeEventListener('loadeddata', handleVideoReady)
      video.removeEventListener('seeked', scheduleAnimation)
    }
  }, [scrollRef])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-page pointer-events-none">
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
