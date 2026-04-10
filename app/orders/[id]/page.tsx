"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { 
  ChevronLeft, Package, Truck, CheckCircle2, XCircle, 
  Clock, MapPin, Phone, CreditCard, Receipt, 
  Calendar, Hash, Store, ArrowLeft, Loader2,
  Lock, ShieldCheck, Printer, Download, RotateCcw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/LanguageProvider"
import api from "@/utils/axios"
import { fixImageUrl, addToCart } from "@/lib/store"
import { cn } from "@/lib/utils"

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

interface OrderDetail {
  order: {
    id: number
    user_id: number
    total_price: string
    address: string
    payment_method: string
    phone: string
    note: string | null
    status: OrderStatus
    created_at: string
  }
  items: Array<{
    id: number
    product_id: number
    quantity: number
    price_at_purchase: string
    name: string
    thumbnail: string | null
    color: string | null
    size: string | null
  }>
}

const STATUS_CONFIG: Record<OrderStatus, { label_en: string; label_kh: string; color: string; icon: any }> = {
  pending:    { label_en: "Pending",    label_kh: "កំពុងរងចាំ",    color: "bg-amber-500", icon: Clock },
  processing: { label_en: "Processing", label_kh: "កំពុងរៀបចំ",    color: "bg-blue-500",  icon: Package },
  shipped:    { label_en: "Shipped",    label_kh: "កំពុងដឹកជញ្ជូន", color: "bg-purple-500", icon: Truck },
  delivered:  { label_en: "Delivered",  label_kh: "បានដឹកជញ្ជូន", color: "bg-green-500",  icon: CheckCircle2 },
  cancelled:  { label_en: "Cancelled",  label_kh: "បានបោះបង់",    color: "bg-red-500",    icon: XCircle },
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { t, language } = useLanguage()
  const [data, setData] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/orders/${params.id}`)
        const rawData = res.data
        if (rawData && rawData.order) {
          // Robust mapping
          const mappedItems = (rawData.items || []).map((it: any) => ({
            ...it,
            name: (it.name || "Product").trim(),
            price_at_purchase: it.price_at_purchase || it.price || "0",
            thumbnail: it.thumbnail || it.image || ""
          }))
          setData({
            ...rawData,
            items: mappedItems
          })
        }
      } catch (err: any) {
        setError(err.response?.data?.message || t("common.error"))
      } finally {
        setLoading(false)
      }
    }
    if (params.id) fetchDetail()
  }, [params.id, t])

  if (loading) return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="space-y-4">
           <Skeleton className="h-16 w-full rounded-2xl" />
           <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )

  if (error || !data) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <XCircle className="h-12 w-12 text-destructive mb-4" />
      <p className="text-xl font-bold">{error || "Order not found"}</p>
      <Button className="mt-6 rounded-2xl" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> {t("checkout.back")}
      </Button>
    </div>
  )

  const { order, items } = data
  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
  const StatusIcon = statusCfg.icon
  const statusLabel = t(`order.status.${order.status}`)

  const handleReorder = () => {
    items.forEach(it => {
      addToCart({
        id: String(it.product_id),
        name: it.name,
        href: `/products/${it.product_id}`,
        image: fixImageUrl(it.thumbnail),
        price: Number(it.price_at_purchase)
      }, it.quantity)
    })
    router.push("/cart")
  }

  return (
    <div className="min-h-screen bg-muted/40 pb-20">
      {/* Header Bar */}
      <div className="bg-background border-b sticky top-0 z-30 shadow-sm transition-all">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-extrabold tracking-tight">{t("order.id")} #{order.id}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors" title="Print Invoice">
              <Printer className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        
        {/* Status Card */}
        <div className="bg-background rounded-3xl p-6 shadow-sm border overflow-hidden relative">
          <div className={cn("absolute top-0 right-0 h-1.5 w-full", statusCfg.color)} />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                 <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center text-white", statusCfg.color)}>
                    <StatusIcon className="h-5 w-5" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{t("checkout.stepDone")}</p>
                    <p className="text-2xl font-black text-foreground">{statusLabel}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  {new Date(order.created_at).toLocaleDateString(language === "kh" ? "km-KH" : "en-US", { 
                    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" 
                  })}
                </div>
              </div>
            </div>
            
            {order.status === "delivered" && (
              <Button onClick={handleReorder} className="rounded-2xl font-black shadow-lg shadow-primary/20">
                <RotateCcw className="mr-2 h-4 w-4" /> {t("order.reorder")}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          
          <div className="space-y-6">
            {/* Items List */}
            <div className="bg-background rounded-3xl p-6 shadow-sm border space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Store className="h-4 w-4 text-primary" />
                  {t("order.items")}
                </h2>
                <Badge variant="secondary" className="rounded-xl font-black bg-primary/10 text-primary border-none px-3 py-1">{items.length} {t("order.itemsCount")}</Badge>
              </div>
              
              <div className="divide-y divide-dashed">
                {items.map((it) => (
                  <div key={it.id} className="py-5 first:pt-0 last:pb-0 flex gap-4">
                    <img src={fixImageUrl(it.thumbnail)} alt={it.name} className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl object-cover bg-muted border p-1" />
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <Link href={`/products/${it.product_id}`} className="text-base sm:text-lg font-bold hover:text-primary transition-colors line-clamp-2 leading-tight">
                          {it.name}
                        </Link>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {it.color && <Badge variant="outline" className="rounded-md font-medium text-[10px]">{it.color}</Badge>}
                          {it.size && <Badge variant="outline" className="rounded-md font-medium text-[10px]">{it.size}</Badge>}
                          <Badge variant="secondary" className="rounded-md font-black text-[10px] bg-muted/60">x{it.quantity}</Badge>
                        </div>
                      </div>
                      <p className="text-xl font-black text-primary">${Number(it.price_at_purchase).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-background rounded-3xl p-6 shadow-sm border space-y-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                {t("checkout.deliveryDetails")}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                       <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("checkout.deliveryAddress")}</p>
                      <p className="text-sm font-bold leading-relaxed">{order.address}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                       <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("checkout.phone")}</p>
                      <p className="text-sm font-bold">{order.phone}</p>
                    </div>
                  </div>
                </div>

                {order.note && (
                  <div className="bg-muted/30 rounded-2xl p-4 border border-dashed">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{t("checkout.orderNote")}</p>
                    <p className="text-sm font-medium italic">"{order.note}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
             {/* Payment Summary */}
             <div className="bg-background rounded-3xl p-6 shadow-sm border space-y-5 sticky top-24">
               <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">{t("checkout.orderSummary")}</h2>
               
               <div className="space-y-3">
                 <div className="flex justify-between text-sm font-medium">
                   <span className="text-muted-foreground">{t("checkout.subtotal")}</span>
                   <span>${Number(order.total_price).toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-sm font-medium">
                   <span className="text-muted-foreground">{t("checkout.shipping")}</span>
                   <span className="text-primary font-bold">Free</span>
                 </div>
                 <Separator className="my-2 border-dashed" />
                 <div className="flex justify-between items-center text-lg font-black">
                   <span>{t("checkout.total")}</span>
                   <span className="text-primary text-2xl">${Number(order.total_price).toFixed(2)}</span>
                 </div>
               </div>

               <div className="pt-4 border-t space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center">
                       <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("checkout.paymentMethod")}</p>
                      <p className="text-sm font-bold">{order.payment_method}</p>
                    </div>
                  </div>
               </div>

               {/* Trust Badges */}
               <div className="pt-6 grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-muted/30 text-center">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <span className="text-[9px] font-bold uppercase tracking-tighter leading-none">{t("checkout.securePay")}</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-muted/30 text-center">
                    <Lock className="h-5 w-5 text-primary" />
                    <span className="text-[9px] font-bold uppercase tracking-tighter leading-none">{t("checkout.encrypted")}</span>
                  </div>
               </div>
             </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
