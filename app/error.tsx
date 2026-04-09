"use client"

import * as React from "react"
import { Settings, RefreshCcw, Home } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/LanguageProvider"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useLanguage()

  // Detect if it's likely a server-down or maintenance issue (common in axios/fetch failures)
  const isServerDown = 
    error.message?.toLowerCase().includes("network error") || 
    error.message?.toLowerCase().includes("failed to fetch") ||
    error.message?.toLowerCase().includes("503") ||
    error.message?.toLowerCase().includes("502")

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center rounded-3xl bg-primary/10 text-primary group">
          <Settings className="h-12 w-12 animate-[spin_4s_linear_infinite]" />
          <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-xl bg-background border flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
             <RefreshCcw className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
                {isServerDown ? t("error.serverDownTitle") : t("error.maintenanceTitle")}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
                {isServerDown ? t("error.serverDownDesc") : t("error.maintenanceDesc")}
            </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-4">
            <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto h-12 rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-all font-semibold gap-2"
                onClick={() => reset()}
            >
                <RefreshCcw className="h-4 w-4" />
                {t("error.refresh")}
            </Button>
            
            <Link href="/" className="w-full sm:w-auto">
                <Button 
                    size="lg" 
                    className="w-full sm:w-auto h-12 rounded-xl font-semibold gap-2"
                >
                    <Home className="h-4 w-4" />
                    {t("common.backToHome")}
                </Button>
            </Link>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 rounded-xl bg-destructive/5 border border-destructive/10 text-xs text-left overflow-auto max-h-40 font-mono text-destructive/70">
             <p className="font-bold mb-1">Debug Info:</p>
             {error.message}
          </div>
        )}
      </div>
    </div>
  )
}
