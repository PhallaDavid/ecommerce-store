"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  ChevronRight, Package, Truck, CheckCircle2, XCircle,
  Clock, ChevronDown, RotateCcw, Eye, Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { addToCart } from "@/lib/store"

// ── Mock orders data ───────────────────────────────────────────────────────────
const BASE_IMG = "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/Homepage%20Collections/Category%20Highlight/MAR26-WEB%20Homepage_WOMEN_Tops.jpg"
const BANNER_IMG = "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/banner/2026/TEN11/Mar/KNY%20Sale/MAR26-CatFeed%20-Women-BestSellers-WEB%20HP.jpg"

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

const ORDERS = [
  {
    id: "R4K-72841", date: "2026-03-28", status: "delivered" as OrderStatus, total: 31.45,
    items: [
      { id: "p1", name: "Classic Halter Twist Top", qty: 2, price: 8.95, image: BASE_IMG },
      { id: "p3", name: "Ruched Bodycon Dress",     qty: 1, price: 13.55, image: BANNER_IMG },
    ],
    payment: "KHQR", address: "12 Street 274, Phnom Penh"
  },
  {
    id: "R4K-63920", date: "2026-03-20", status: "shipped" as OrderStatus, total: 19.99,
    items: [
      { id: "p4", name: "Linen Wide-Leg Pants", qty: 1, price: 19.99, image: BANNER_IMG },
    ],
    payment: "ABA Pay", address: "45 Norodom Blvd, Phnom Penh"
  },
  {
    id: "R4K-55103", date: "2026-03-10", status: "processing" as OrderStatus, total: 46.95,
    items: [
      { id: "p7", name: "Strappy Heeled Sandals", qty: 1, price: 35.00, image: BASE_IMG },
      { id: "p8", name: "Canvas Tote Bag",        qty: 1, price: 9.50,  image: BANNER_IMG },
      { id: "p12", name: "Pearl Drop Earrings",   qty: 2, price: 2.45,  image: BASE_IMG },
    ],
    payment: "Credit Card", address: "12 Street 274, Phnom Penh"
  },
  {
    id: "R4K-41287", date: "2026-02-28", status: "cancelled" as OrderStatus, total: 22.00,
    items: [{ id: "p3", name: "Ruched Bodycon Dress", qty: 1, price: 22.00, image: BANNER_IMG }],
    payment: "COD", address: "12 Street 274, Phnom Penh"
  },
  {
    id: "R4K-38002", date: "2026-02-14", status: "delivered" as OrderStatus, total: 11.00,
    items: [{ id: "p5", name: "Oversized Graphic Tee", qty: 1, price: 11.00, image: BASE_IMG }],
    payment: "Bank Transfer", address: "12 Street 274, Phnom Penh"
  },
]

// ── Status config ──────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending:    { label: "Pending",    color: "text-amber-600 bg-amber-50 border-amber-200",    icon: Clock },
  processing: { label: "Processing", color: "text-blue-600 bg-blue-50 border-blue-200",       icon: Package },
  shipped:    { label: "Shipped",    color: "text-purple-600 bg-purple-50 border-purple-200", icon: Truck },
  delivered:  { label: "Delivered",  color: "text-green-600 bg-green-50 border-green-200",    icon: CheckCircle2 },
  cancelled:  { label: "Cancelled",  color: "text-red-600 bg-red-50 border-red-200",          icon: XCircle },
}

// ── Order progress bar ─────────────────────────────────────────────────────────
const PROGRESS_STEPS: OrderStatus[] = ["pending", "processing", "shipped", "delivered"]

function OrderProgress({ status }: { status: OrderStatus }) {
  if (status === "cancelled") return null
  const idx = PROGRESS_STEPS.indexOf(status)
  return (
    <div className="flex items-center gap-1 mt-3">
      {PROGRESS_STEPS.map((s, i) => {
        const cfg = STATUS_CONFIG[s]
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
function OrderCard({ order }: { order: typeof ORDERS[0] }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = STATUS_CONFIG[order.status]
  const Icon = cfg.icon

  function reorder() {
    order.items.forEach(it => addToCart({ id: it.id, name: it.name, href: `/products/${it.id}`, image: it.image, price: it.price }, it.qty))
  }

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b">
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground">Order ID</p>
          <p className="text-sm font-bold font-mono">{order.id}</p>
        </div>
        <div className="space-y-0.5 text-right">
          <p className="text-xs text-muted-foreground">Date</p>
          <p className="text-sm font-medium">{new Date(order.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</p>
        </div>
        <div className="space-y-0.5 text-right">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-sm font-bold text-primary">${order.total.toFixed(2)}</p>
        </div>
        <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold", cfg.color)}>
          <Icon className="h-3.5 w-3.5" /> {cfg.label}
        </span>
      </div>

      {/* Item preview */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          {order.items.slice(0, 3).map((it) => (
            <div key={it.id} className="relative">
              <img src={it.image} alt={it.name} className="h-12 w-12 rounded-lg object-cover bg-muted border" />
              {it.qty > 1 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">{it.qty}</span>
              )}
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted border text-xs font-semibold text-muted-foreground">
              +{order.items.length - 3}
            </div>
          )}
          <div className="ml-2 flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{order.items[0].name}{order.items.length > 1 && ` +${order.items.length - 1} more`}</p>
            <p className="text-xs text-muted-foreground">{order.payment}</p>
          </div>
        </div>

        {/* Progress */}
        <OrderProgress status={order.status} />

        {/* Expanded detail */}
        {expanded && (
          <div className="mt-3 space-y-3 border-t pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Items</p>
            {order.items.map((it) => (
              <div key={it.id} className="flex items-center gap-3">
                <img src={it.image} alt={it.name} className="h-14 w-14 rounded-xl object-cover bg-muted border shrink-0" />
                <div className="min-w-0 flex-1">
                  <Link href={`/products/${it.id}`} className="text-sm font-medium hover:text-primary transition-colors line-clamp-1">{it.name}</Link>
                  <p className="text-xs text-muted-foreground">Qty: {it.qty}</p>
                </div>
                <span className="text-sm font-semibold shrink-0">${(it.price * it.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="rounded-xl bg-muted p-3 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span className="font-medium">{order.payment}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery to</span><span className="font-medium text-right max-w-[180px] text-xs">{order.address}</span></div>
              <div className="flex justify-between font-bold"><span>Total</span><span className="text-primary">${order.total.toFixed(2)}</span></div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 border-t pt-3">
          <button type="button" onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
            <Eye className="h-3.5 w-3.5" /> {expanded ? "Hide" : "View"} Details
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
          </button>
          <div className="flex-1" />
          {order.status === "delivered" && (
            <Button size="sm" variant="outline" className="text-xs gap-1.5 h-7" onClick={reorder}>
              <RotateCcw className="h-3 w-3" /> Reorder
            </Button>
          )}
          {order.status === "shipped" && (
            <Button size="sm" variant="outline" className="text-xs gap-1.5 h-7">
              <Truck className="h-3 w-3" /> Track
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
const STATUS_TABS: { label: string; value: string }[] = [
  { label: "All",       value: "all" },
  { label: "Active",    value: "active" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
]

export default function OrdersPage() {
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")

  const filtered = ORDERS.filter((o) => {
    if (tab === "active" && !["pending", "processing", "shipped"].includes(o.status)) return false
    if (tab === "delivered" && o.status !== "delivered") return false
    if (tab === "cancelled" && o.status !== "cancelled") return false
    if (search && !o.id.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:px-8 max-w-7xl">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center space-x-2 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/profile" className="hover:text-primary transition-colors">Profile</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">My Orders</span>
        </nav>

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{ORDERS.length} orders</p>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID…"
              className="w-44 rounded-full border bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" />
          </div>
        </div>

        {/* Status tabs */}
        <div className="mb-6 flex gap-1 rounded-xl bg-muted p-1">
          {STATUS_TABS.map((t) => (
            <button key={t.value} type="button" onClick={() => setTab(t.value)}
              className={cn("flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all",
                tab === t.value ? "bg-background  text-foreground" : "text-muted-foreground hover:text-foreground"
              )}>
              {t.label}
              {t.value !== "all" && (
                <span className="ml-1 opacity-60">
                  ({ORDERS.filter(o => t.value === "active" ? ["pending","processing","shipped"].includes(o.status) : o.status === t.value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders list */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <Package className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-semibold">No orders found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {search ? "Try a different order ID." : "You haven't placed any orders yet."}
              </p>
              <Button className="mt-4" asChild><Link href="/products">Start Shopping</Link></Button>
            </div>
          ) : (
            filtered.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </div>
      </div>
    </div>
  )
}
