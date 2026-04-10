"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  ChevronRight, Package, Truck, CheckCircle2, XCircle,
  Clock, ChevronDown, RotateCcw, Eye, Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { addToCart } from "@/lib/store"
import { useLanguage } from "@/components/LanguageProvider"
import api from "@/utils/axios"
import { fixImageUrl } from "@/lib/store"

// ── Types ─────────────────────────────────────────────────────────────────────
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

interface OrderItem {
  id: string | number
  name: string
  qty: number
  price: number
  image: string
}

interface Order {
  id: string | number
  date: string
  status: OrderStatus
  total: number
  items: OrderItem[]
  payment: string
  address: string
}

// ── Status config ──────────────────────────────────────────────────────────────
function getStatusConfig(t: any): Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> {
  return {
    pending:    { label: t("order.status.pending"),    color: "text-amber-600 bg-amber-50 border-amber-200",    icon: Clock },
    processing: { label: t("order.status.processing"), color: "text-blue-600 bg-blue-50 border-blue-200",       icon: Package },
    shipped:    { label: t("order.status.shipped"),    color: "text-purple-600 bg-purple-50 border-purple-200", icon: Truck },
    delivered:  { label: t("order.status.delivered"),  color: "text-green-600 bg-green-50 border-green-200",    icon: CheckCircle2 },
    cancelled:  { label: t("order.status.cancelled"),  color: "text-red-600 bg-red-50 border-red-200",          icon: XCircle },
  }
}

// ── Order progress bar ─────────────────────────────────────────────────────────
const PROGRESS_STEPS: OrderStatus[] = ["pending", "processing", "shipped", "delivered"]

function OrderProgress({ status, statusConfig }: { status: OrderStatus; statusConfig: any }) {
  if (status === "cancelled") return null
  const idx = PROGRESS_STEPS.indexOf(status)
  return (
    <div className="flex items-center gap-1 mt-3">
      {PROGRESS_STEPS.map((s, i) => {
        const cfg = statusConfig[s]
        const Icon = cfg.icon
        const done = i <= idx
        return (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-1">
              <div className={cn("flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-bold transition-colors",
                done ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-border text-muted-foreground"
              )}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className={cn("text-[10px] font-medium", done ? "text-primary" : "text-muted-foreground")}>{cfg.label}</span>
            </div>
            {i < PROGRESS_STEPS.length - 1 && (
              <div className={cn("flex-1 h-0.5 mb-4 rounded", i < idx ? "bg-primary" : "bg-border")} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ── Order card ─────────────────────────────────────────────────────────────────
function OrderCard({ order, statusConfig }: { order: Order; statusConfig: any }) {
  const { t } = useLanguage()
  const [expanded, setExpanded] = useState(false)
  const cfg = statusConfig[order.status]
  const Icon = cfg.icon

  function reorder() {
    order.items.forEach(it => addToCart({ id: String(it.id), name: it.name, href: `/products/${it.id}`, image: it.image, price: it.price }, it.qty))
  }

  return (
    <div className="group rounded-[2rem] border bg-background shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 border-b bg-muted/5">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">{t("order.id")}</p>
          <p className="text-sm font-bold font-mono text-primary flex items-center gap-1.5">
            <Hash className="h-3.5 w-3.5 opacity-50" />
            {order.id}
          </p>
        </div>
        <div className="space-y-1 text-right sm:text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">{t("order.date")}</p>
          <p className="text-sm font-bold text-foreground/80">{new Date(order.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</p>
        </div>
        <div className="hidden sm:block space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">{t("order.total")}</p>
          <p className="text-sm font-black text-primary">${order.total.toFixed(2)}</p>
        </div>
        <span className={cn("inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-black uppercase tracking-wider shadow-sm transition-colors", cfg.color)}>
          <Icon className="h-3.5 w-3.5" /> {cfg.label}
        </span>
      </div>

      {/* Item preview */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3 overflow-hidden">
            {order.items.slice(0, 3).map((it) => (
              <div key={it.id} className="relative inline-block ring-4 ring-background rounded-2xl overflow-hidden shadow-sm">
                <img src={it.image} alt={it.name} className="h-14 w-14 sm:h-16 sm:w-16 object-cover bg-muted border transition-transform duration-500 group-hover:scale-110" />
              </div>
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-bold truncate text-foreground/90 leading-tight">
              {order.items.length > 0 ? (
                <>
                  {order.items[0].name}
                  {order.items.length > 1 && (
                    <span className="text-muted-foreground font-medium ml-1.5 inline-flex items-center">
                       + {order.items.length - 1} {t("order.itemsCount")}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-muted-foreground font-medium italic opacity-60">No items listed</span>
              )}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground font-semibold">
              <CreditCard className="h-3 w-3" />
              {order.payment}
              <span className="sm:hidden ml-auto font-black text-primary text-sm">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <OrderProgress status={order.status} statusConfig={statusConfig} />

        {/* Expanded detail */}
        {expanded && (
          <div className="mt-4 space-y-4 border-t pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t("order.items")}</p>
            <div className="space-y-3">
              {order.items.map((it) => (
                <div key={it.id} className="flex items-center gap-4">
                  <img src={it.image} alt={it.name} className="h-14 w-14 rounded-2xl object-cover bg-muted border shrink-0 shadow-sm" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/products/${it.id}`} className="text-sm font-bold hover:text-primary transition-colors line-clamp-1">{it.name}</Link>
                    <p className="text-xs text-muted-foreground font-medium">{t("order.qty")}: {it.qty}</p>
                  </div>
                  <span className="text-sm font-bold shrink-0">${(it.price * it.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-muted/40 p-4 space-y-2 text-sm border border-dashed">
              <div className="flex justify-between"><span className="text-muted-foreground text-xs font-medium">{t("order.payment")}</span><span className="font-bold">{order.payment}</span></div>
              <div className="flex justify-between items-start"><span className="text-muted-foreground text-xs font-medium">{t("order.deliveryTo")}</span><span className="font-semibold text-right max-w-[200px] text-xs leading-relaxed">{order.address}</span></div>
              <div className="border-t border-dashed pt-2 flex justify-between font-bold text-base"><span>{t("order.total")}</span><span className="text-primary">${order.total.toFixed(2)}</span></div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 border-t pt-3 mt-1">
          <Link href={`/orders/${order.id}`}
            className="group/link flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
            <Eye className="h-4 w-4 transition-transform group-hover/link:scale-125" /> 
            <span>{t("order.viewDetails")}</span>
          </Link>
          <div className="flex-1" />
          {order.status === "delivered" && (
            <Button size="sm" variant="outline" className="text-xs font-bold gap-1.5 h-8 rounded-xl px-4" onClick={reorder}>
              <RotateCcw className="h-3.5 w-3.5" /> {t("order.reorder")}
            </Button>
          )}
          {(order.status === "shipped" || order.status === "processing") && (
            <Button size="sm" variant="outline" className="text-xs font-bold gap-1.5 h-8 rounded-xl px-4">
              <Truck className="h-3.5 w-3.5" /> {t("order.track")}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function OrderSkeleton() {
  return (
    <div className="rounded-2xl border bg-card p-4 space-y-4">
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="space-y-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-12 ml-auto" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-2 flex-1 rounded-full" />
        <Skeleton className="h-2 flex-1 rounded-full" />
        <Skeleton className="h-2 flex-1 rounded-full" />
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const { t } = useLanguage()
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const statusConfig = getStatusConfig(t)

  React.useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const res = await api.get("/orders")
        // Mapping real API data to our UI component types
        const rawOrders = Array.isArray(res.data) ? res.data : (res.data?.data || [])
        const mappedOrders: Order[] = rawOrders.map((o: any) => {
          const apiStatus = (o.status || "pending").toLowerCase()
          const validStatuses: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"]
          const status = validStatuses.includes(apiStatus as OrderStatus) ? (apiStatus as OrderStatus) : "pending"
          
          return {
            id: o.order_number || o.id,
            date: o.created_at || o.date,
            status: status,
            total: Number(o.total_price || o.total || 0),
            payment: o.payment_method || "Unknown",
            address: o.address || o.location_name || "N/A",
            items: (o.items || []).map((it: any) => ({
              id: it.product_id || it.id,
              name: (it.product?.name || it.name || "Product").trim(),
              qty: it.quantity || it.qty || 1,
              price: Number(it.price || it.price_at_purchase || 0),
              image: fixImageUrl(it.product?.image || it.image || it.thumbnail || "")
            }))
          }
        })
        setOrders(mappedOrders)
      } catch (err) {
        console.error("Failed to fetch orders", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [t])

  const filtered = orders.filter((o) => {
    if (tab === "active" && !["pending", "processing", "shipped"].includes(o.status)) return false
    if (tab === "delivered" && o.status !== "delivered") return false
    if (tab === "cancelled" && o.status !== "cancelled") return false
    if (search && !String(o.id).toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const tabs = [
    { label: t("home.seeAll"), value: "all", count: orders.length },
    { label: t("order.status.processing"), value: "active", count: orders.filter(o => ["pending", "processing", "shipped"].includes(o.status)).length },
    { label: t("order.status.delivered"), value: "delivered", count: orders.filter(o => o.status === "delivered").length },
    { label: t("order.status.cancelled"), value: "cancelled", count: orders.filter(o => o.status === "cancelled").length },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8 lg:px-8 max-w-5xl">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center space-x-2 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">{t("nav.home")}</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/profile" className="hover:text-primary transition-colors">{t("nav.profile")}</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-bold">{t("orders.title")}</span>
        </nav>

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{t("orders.title")}</h1>
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
               <Package className="h-4 w-4" />
               {orders.length} {t("order.itemsCount")}
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder={t("orders.searchPlaceholder")}
              className="w-full rounded-full border bg-card py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm" 
            />
          </div>
        </div>

        {/* Status tabs */}
        <div className="mb-8 flex gap-2 p-1.5 bg-muted/40 rounded-[2rem] overflow-x-auto no-scrollbar border">
          {tabs.map((t) => (
            <button key={t.value} type="button" onClick={() => setTab(t.value)}
              className={cn("whitespace-nowrap flex items-center gap-2 rounded-[1.5rem] px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all",
                tab === t.value ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
              )}>
              {t.label}
              <span className={cn("inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-2 text-[10px] font-black tabular-nums border",
                tab === t.value ? "bg-primary/10 text-primary border-primary/20" : "bg-muted-foreground/10 text-muted-foreground border-transparent"
              )}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Orders list */}
        <div className="space-y-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <OrderSkeleton key={i} />)
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-3xl bg-muted/20">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 text-muted-foreground/40 ring-8 ring-muted/20">
                <Package className="h-10 w-10" />
              </div>
              <p className="text-xl font-bold text-foreground mb-2">{t("orders.noOrders")}</p>
              <p className="max-w-xs mx-auto text-sm text-muted-foreground mb-8">
                {search ? "Try searching for a different order ID." : t("orders.noOrdersDesc")}
              </p>
              <Button size="lg" className="rounded-2xl font-bold px-8" asChild>
                <Link href="/products">{t("home.shopNow")}</Link>
              </Button>
            </div>
          ) : (
            filtered.map((order) => <OrderCard key={String(order.id)} order={order} statusConfig={statusConfig} />)
          )}
        </div>
      </div>
    </div>
  )
}
