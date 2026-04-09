"use client"

import * as React from "react"
import { WifiOff, RefreshCcw, SignalHigh } from "lucide-react"
import { useLanguage } from "@/components/LanguageProvider"
import { Button } from "@/components/ui/button"

export function OfflineDetector() {
  const { t } = useLanguage()
  const [isOffline, setIsOffline] = React.useState(false)

  React.useEffect(() => {
    // Check initial state
    if (typeof window !== "undefined") {
      setIsOffline(!window.navigator.onLine)
    }

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className="fixed inset-0 z-9999 bg-background/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="max-w-md w-full bg-card border rounded-3xl p-8 shadow-2xl space-y-8 text-center scale-in-center animate-in zoom-in-95 duration-500">
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
          <WifiOff className="h-12 w-12 animate-pulse" />
          <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background border shadow-sm">
             <SignalHigh className="h-4 w-4 text-muted-foreground opacity-30 line-through decoration-destructive decoration-2" />
          </div>
        </div>

        <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {t("error.noInternetTitle")}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
                {t("error.noInternetDesc")}
            </p>
        </div>

        <div className="pt-4">
            <Button 
                size="lg" 
                className="w-full h-14 rounded-2xl font-bold gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => window.location.reload()}
            >
                <RefreshCcw className="h-5 w-5" />
                {t("error.refresh")}
            </Button>
        </div>
        
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-50">
            Offline Mode Detection
        </p>
      </div>
    </div>
  )
}
