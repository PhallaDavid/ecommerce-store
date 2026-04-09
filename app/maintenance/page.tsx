"use client"

import * as React from "react"
import { Settings, RefreshCcw, Hand } from "lucide-react"
import { useLanguage } from "@/components/LanguageProvider"
import { Button } from "@/components/ui/button"

export default function MaintenancePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center rounded-[2.5rem] bg-amber-500/10 text-amber-500">
          <Settings className="h-16 w-16 animate-[spin_6s_linear_infinite]" />
          <div className="absolute top-0 right-0 h-10 w-10 bg-background border flex items-center justify-center rounded-2xl shadow-sm animate-bounce">
              <Hand className="h-5 w-5 text-amber-600" />
          </div>
        </div>

        <div className="space-y-4">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
                {t("error.maintenanceTitle")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
                {t("error.maintenanceDesc")}
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm mx-auto pt-4 text-left">
            <div className="p-4 rounded-2xl bg-muted/50 border space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Expected Wait</span>
                <p className="text-sm font-semibold">Around 30 mins</p>
            </div>
            <div className="p-4 rounded-2xl bg-muted/50 border space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Update</span>
                <p className="text-sm font-semibold">Security Update</p>
            </div>
        </div>

        <div className="pt-8">
            <Button 
                size="lg" 
                className="h-14 px-10 rounded-2xl font-bold gap-3 hover:scale-105 active:scale-95 transition-all shadow-lg"
                onClick={() => window.location.reload()}
            >
                <RefreshCcw className="h-5 w-5" />
                {t("error.refresh")}
            </Button>
            
            <p className="mt-8 text-xs text-muted-foreground font-medium uppercase tracking-[0.2em]">
                &copy; {new Date().getFullYear()} Rakie Store
            </p>
        </div>
      </div>
      
      {/* Decorative noise background */}
      <div className="fixed inset-0 -z-10 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
    </div>
  )
}
