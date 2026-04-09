"use client"

import * as React from "react"
import { ArrowUp, Bot } from "lucide-react"

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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      {/* Support Bot Button */}
      <Button
        type="button"
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-110 active:scale-95 group relative border-2 border-primary/20"
        aria-label="Contact Support"
        onClick={() => {
          // Placeholder action
          window.open("https://t.me/rakiestore_bot", "_blank")
        }}
      >
        <Bot className="h-6 w-6" />
        <span className="absolute -top-10 right-0 scale-0 group-hover:scale-100 transition-all duration-200 bg-foreground text-background text-[10px] px-2 py-1 rounded-md whitespace-nowrap font-medium shadow-md pointer-events-none">
          Support Bot
        </span>
      </Button>
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isVisible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-10 scale-50"
        )}
      >
        <Button
          type="button"
          size="icon"
          variant="secondary"
          onClick={scrollToTop}
          className="h-10 w-10 rounded-full border-2 bg-background/90 backdrop-blur-sm hover:bg-muted shadow-md flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </div>
  )
}

