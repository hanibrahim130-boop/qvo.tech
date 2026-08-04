import { ScrollScrubVideo } from 'scroll-scrub-video'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4'

interface ScrollVideoProps {
  scrollRef: React.RefObject<HTMLDivElement | null>
}

export default function ScrollVideo({ scrollRef }: ScrollVideoProps) {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-page pointer-events-none">
      <ScrollScrubVideo
        src={VIDEO_URL}
        poster="/hero-poster.jpg"
        scrollRef={scrollRef}
      />
    </div>
  )
}
