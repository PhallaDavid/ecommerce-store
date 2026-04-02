'use client'

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

function TopLoaderContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Add custom styles for nprogress
    const style = document.createElement('style')
    style.textContent = `
      #nprogress .bar {
        background: oklch(52.5% 0.223 3.958) !important;
      }
      #nprogress .peg {
        box-shadow: 0 0 10px oklch(52.5% 0.223 3.958), 0 0 5px oklch(52.5% 0.223 3.958) !important;
      }
    `
    document.head.appendChild(style)

    // Configure NProgress
    NProgress.configure({
      showSpinner: false,
      minimum: 0.1,
      easing: 'ease',
      speed: 500
    })

    // Start progress when route changes
    NProgress.start()

    // Complete progress after a short delay
    const timer = setTimeout(() => {
      NProgress.done()
    }, 100)

    return () => {
      clearTimeout(timer)
      NProgress.done()
      document.head.removeChild(style)
    }
  }, [pathname, searchParams])

  return null
}

export default function TopLoader() {
  return (
    <Suspense fallback={null}>
      <TopLoaderContent />
    </Suspense>
  )
}
