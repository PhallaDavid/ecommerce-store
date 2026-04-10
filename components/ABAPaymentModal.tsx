"use client"

import React, { useState, useEffect } from "react"
import { X, Smartphone, Download, ExternalLink, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/LanguageProvider"
import api from "@/utils/axios"

interface ABAPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  qrImage: string
  qrString: string
  deeplink: string
  orderId: string | number
  amount: number
  onSuccess?: () => void
}

export function ABAPaymentModal({ 
  isOpen, 
  onClose, 
  qrImage, 
  deeplink, 
  orderId, 
  amount,
  onSuccess 
}: ABAPaymentModalProps) {
  const { t } = useLanguage()
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending")
  const [checking, setChecking] = useState(false)

  // Polling to check transaction status
  useEffect(() => {
    if (!isOpen || status === "success") return

    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/orders/${orderId}`)
        // If order status updated to 'paid' in backend via webhook
        if (res.data.order.status === "paid" || res.data.order.status === "processing") {
          setStatus("success")
          clearInterval(interval)
          if (onSuccess) onSuccess()
        }
      } catch (err) {
        console.error("Status check failed", err)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isOpen, orderId, status, onSuccess])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-background rounded-[2.5rem] shadow-2xl overflow-hidden border border-border animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-[#e31837] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl">
              <span className="text-[#e31837] font-black tracking-tighter text-xl leading-none">ABA</span>
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">ABA PAY</h3>
              <p className="text-white/80 text-xs font-medium uppercase tracking-widest">Secure Checkout</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 animate-in fade-in zoom-in duration-500">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-foreground">Payment Successful!</h4>
                <p className="text-sm text-muted-foreground">Your order #{orderId} is being processed.</p>
              </div>
              <Button onClick={onClose} className="w-full rounded-2xl h-12 text-base font-bold">
                Continue to My Orders
              </Button>
            </div>
          ) : (
            <>
              {/* QR Code Section */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-[#e31837]/20 to-[#e31837]/5 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-white p-6 rounded-[2rem] border-2 border-[#e31837]/10 shadow-xl">
                    <img src={qrImage} alt="ABA Pay QR" className="h-48 w-48 object-contain" />
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-2xl font-black text-primary">${Number(amount).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Scan with ABA Mobile</p>
                </div>
              </div>

              {/* Steps/Info */}
              <div className="bg-muted/30 rounded-3xl p-5 space-y-3 border border-border/50">
                <div className="flex gap-3 items-start">
                  <div className="h-6 w-6 rounded-full bg-[#e31837] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                  <p className="text-xs font-medium text-foreground/80 leading-relaxed">Open <span className="font-bold text-[#e31837]">ABA Mobile</span> on your phone.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="h-6 w-6 rounded-full bg-[#e31837] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                  <p className="text-xs font-medium text-foreground/80 leading-relaxed">Tap on <span className="font-bold">ABA PAY</span> or <span className="font-bold">Scan QR</span> button.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="h-6 w-6 rounded-full bg-[#e31837] text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                  <p className="text-xs font-medium text-foreground/80 leading-relaxed">Scan the QR code above and confirm your payment.</p>
                </div>
              </div>

              {/* Mobile CTA */}
              <div className="pt-2 sm:hidden">
                <Button 
                  asChild
                  className="w-full rounded-[1.25rem] h-12 bg-[#e31837] hover:bg-[#c1142d] text-white font-bold gap-2"
                >
                  <a href={deeplink}>
                    <Smartphone className="h-4 w-4" /> Open ABA App
                  </a>
                </Button>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-center gap-2 py-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Waiting for payment ...</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-muted/20 border-t flex items-center justify-center gap-6">
           <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
             <Download className="h-3 w-3" /> Save QR
           </div>
           <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
             <ExternalLink className="h-3 w-3" /> Help
           </div>
        </div>
      </div>
    </div>
  )
}
