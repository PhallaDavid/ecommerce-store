"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ScrollToTop } from "@/components/ScrollToTop"
import { PromoPopup } from "@/components/PromoPopup"
import TopLoader from "@/components/TopLoader"
import { OfflineDetector } from "@/components/OfflineDetector"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Pages that should NOT have header/footer
  const isStandalonePage = pathname === "/maintenance"

  // We can't easily detect "Internet Error" state here without a shared state,
  // but we can make OfflineDetector handle its own "fullscreen" logic.
  // Actually, let's allow OfflineDetector to broadcast its state via a simple event or use a state here.
  
  const [isOffline, setIsOffline] = React.useState(false)

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    
    if (typeof window !== "undefined") {
      setIsOffline(!window.navigator.onLine)
      window.addEventListener("online", handleOnline)
      window.addEventListener("offline", handleOffline)
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isStandalonePage || isOffline) {
    return (
      <>
        {isOffline && <OfflineDetector />}
        <main className="flex-1">{children}</main>
      </>
    )
  }

  return (
    <>
      <TopLoader />
      <PromoPopup />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
