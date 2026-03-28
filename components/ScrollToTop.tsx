"use client"

import * as React from "react"
import { ArrowUp, MousePointerClick, Mouse  } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 400)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" })
  }

  return (
    <div
      className={cn(
        "fixed bottom-5 right-5 z-50 transition-all duration-200",
        isVisible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2"
      )}
    >
      <Button
        type="button"
        size="icon"
        variant="secondary"
        onClick={scrollToTop}
        // className="h-11 w-11 rounded-full border-2 bg-background/90 backdrop-blur hover:bg-muted"
        aria-label="Scroll to top"
      >
        {/* <MousePointerClick className="h-4 w-4" /> */}
        <Mouse className="h-12 w-12 " />
      </Button>
    </div>
  )
}

