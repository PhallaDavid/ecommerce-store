"use client"

import * as React from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SideSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
}

export function SideSheet({ open, onOpenChange, title, children }: SideSheetProps) {
  React.useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onOpenChange])

  React.useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <div className={cn("fixed inset-0 z-50", open ? "" : "pointer-events-none")}>
      <button
        type="button"
        className={cn(
          "absolute inset-0 bg-black/55 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={() => onOpenChange(false)}
        aria-label="Close sheet"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "absolute right-0 top-0 h-full w-full sm:w-[420px]",
          "border-l bg-background flex flex-col",
          "transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b px-4 py-3 shrink-0">
          <div className="text-sm font-semibold text-foreground">{title}</div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-4">
          {children}
        </div>
      </aside>
    </div>
  )
}
