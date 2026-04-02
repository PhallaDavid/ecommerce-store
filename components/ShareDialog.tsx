"use client"

import * as React from "react"
import { Camera, Copy, MessageCircle, Send, Share2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ShareDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  url?: string
  title?: string
}

export function ShareDialog({ open, onOpenChange, url, title = "Share" }: ShareDialogProps) {
  const [shareUrl, setShareUrl] = React.useState("")
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    setCopied(false)
    setShareUrl(url ?? window.location.href)
  }, [open, url])

  React.useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onOpenChange])

  const copyLink = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  const shareTelegram = () => {
    if (!shareUrl) return
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`, "_blank")
  }

  const shareFacebook = () => {
    if (!shareUrl) return
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank"
    )
  }

  const shareMessenger = () => {
    if (!shareUrl) return
    const encoded = encodeURIComponent(shareUrl)
    window.open(
      `https://www.facebook.com/dialog/send?link=${encoded}&app_id=YOUR_APP_ID&redirect_uri=${encoded}`,
      "_blank"
    )
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/55"
        onClick={() => onOpenChange(false)}
        aria-label="Close share dialog"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "absolute left-1/2 top-1/2 w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2",
          "rounded-2xl border bg-background "
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="text-sm font-semibold">{title}</div>
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

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-16 flex-col gap-2 rounded-xl"
              onClick={shareTelegram}
            >
              <Send className="h-5 w-5" />
              <span className="text-[11px] font-medium">Telegram</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-16 flex-col gap-2 rounded-xl"
              onClick={shareFacebook}
            >
              <Share2 className="h-5 w-5" />
              <span className="text-[11px] font-medium">Facebook</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-16 flex-col gap-2 rounded-xl"
              onClick={shareMessenger}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-[11px] font-medium">Messenger</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-16 flex-col gap-2 rounded-xl"
              onClick={copyLink}
            >
              {copied ? <Camera className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              <span className="text-[11px] font-medium">{copied ? "Copied" : "Copy"}</span>
            </Button>
          </div>

          <div className="rounded-xl border bg-muted/30 p-3">
            <div className="text-xs text-muted-foreground mb-1">Link</div>
            <div className="text-xs break-all">{shareUrl}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

