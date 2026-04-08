"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import {
  ChevronRight,
  CreditCard,
  Truck,
  ShieldCheck,
  Lock,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  MapPin,
  CheckCircle2,
  Tag,
  QrCode,
  Banknote,
  Wallet,
  Smartphone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  getCart,
  updateCartQty,
  removeFromCart,
  setCart,
  subscribeStore,
  type CartItem,
} from "@/lib/store"
import { useLanguage } from "@/components/LanguageProvider"

// Dynamic import — Leaflet cannot run on SSR
const LocationPicker = dynamic(
  () => import("@/components/LocationPicker").then((m) => m.LocationPicker),
  { ssr: false }
)

// ── Types ─────────────────────────────────────────────────────────────────────
type LatLng = { lat: number; lng: number }
type PayMethod = "card" | "khqr" | "aba" | "bank" | "cod"

function StepBar({ current }: { current: number }) {
  const { t } = useLanguage()
  const STEPS = [t("checkout.stepCart"), t("checkout.stepDelivery"), t("checkout.stepPayment"), t("checkout.stepDone")]
  
  return (
    <div className="flex items-center w-full max-w-lg mx-auto">
      {STEPS.map((label, i) => (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center gap-1">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
              i < current ? "bg-primary text-primary-foreground"
                : i === current ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                : "bg-muted text-muted-foreground"
            )}>
              {i < current ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn("text-[10px] font-medium", i === current ? "text-primary" : "text-muted-foreground")}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={cn("flex-1 h-0.5 mx-2 mb-4 rounded transition-all duration-500", i < current ? "bg-primary" : "bg-border")} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// ── Form Input ─────────────────────────────────────────────────────────────────
function Field({ label, id, type = "text", placeholder, value, onChange, required, className }: {
  label: string; id: string; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void; required?: boolean; className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        id={id} type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)} required={required}
        className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/30"
      />
    </div>
  )
}

// ── Payment Method Card ─────────────────────────────────────────────────────────
function PayCard({ id, label, subtitle, icon, selected, onSelect }: {
  id: string; label: string; subtitle: string; icon: React.ReactNode;
  selected: boolean; onSelect: () => void;
}) {
  return (
    <button
      type="button" onClick={onSelect}
      className={cn(
        "flex items-center gap-3 w-full rounded-xl border p-3 text-left transition-all",
        selected
          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
          : "border-border bg-card hover:border-primary/40"
      )}
    >
      <div className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
        selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-semibold", selected ? "text-primary" : "text-foreground")}>{label}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className={cn(
        "h-4 w-4 shrink-0 rounded-full border-2 transition-colors",
        selected ? "border-primary bg-primary" : "border-muted-foreground"
      )}>
        {selected && <div className="m-0.5 h-2 w-2 rounded-full bg-primary-foreground" />}
      </div>
    </button>
  )
}

// ── KHQR mock QR code SVG ──────────────────────────────────────────────────────
function KHQRDisplay({ amount }: { amount: number }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border bg-white p-5">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-[#003087]">
          <span className="text-[8px] font-black text-white leading-none">KH</span>
        </div>
        <span className="text-sm font-bold text-[#003087] tracking-wide">KHQR</span>
      </div>
      {/* Simulated QR — uses a real QR-like grid pattern via CSS */}
      <div className="relative">
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=KHQR:R4KIES:${amount.toFixed(2)}&color=003087`}
          alt="KHQR payment code"
          className="h-40 w-40 rounded-lg border"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-white p-1 ">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003087]">
              <span className="text-[7px] font-black text-white leading-none">KH</span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs text-muted-foreground">{t("checkout.scanBank")}</p>
        <p className="mt-1 text-base font-bold text-[#003087]">${amount.toFixed(2)} USD</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {["ABA", "ACLEDA", "Wing", "True Money", "Bakong"].map((b) => (
          <Badge key={b} variant="secondary" className="text-[10px]">{b}</Badge>
        ))}
      </div>
    </div>
  )
}

// ── ABA Pay display ────────────────────────────────────────────────────────────
function ABADisplay({ amount }: { amount: number }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border bg-white p-5">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e31837]">
          <span className="text-[8px] font-black text-white leading-none">A</span>
        </div>
        <span className="text-sm font-bold text-[#e31837]">ABA PAY</span>
      </div>
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=ABAPAY:R4KIES:${amount.toFixed(2)}&color=e31837`}
        alt="ABA Pay QR"
        className="h-40 w-40 rounded-lg border"
      />
      <p className="text-xs text-muted-foreground text-center">Open ABA Mobile → Scan QR → Confirm payment</p>
      <p className="text-base font-bold text-[#e31837]">${amount.toFixed(2)} USD</p>
    </div>
  )
}

// ── Bank Transfer display ─────────────────────────────────────────────────────
function BankTransferDisplay() {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <p className="text-sm font-semibold text-foreground">Bank Transfer Details</p>
      {[
        { label: "Bank Name", value: "ACLEDA Bank" },
        { label: "Account Name", value: "R4KIES Store" },
        { label: "Account Number", value: "1234-5678-9012" },
        { label: "Currency", value: "USD / KHR" },
      ].map(({ label, value }) => (
        <div key={label} className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-semibold text-foreground">{value}</span>
        </div>
      ))}
      <div className="mt-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
        <p className="text-xs text-amber-700">
          Please transfer the exact amount and include your order number in the reference. Send payment proof to our support.
        </p>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { t } = useLanguage()
  const [step, setStep] = useState(0)
  const [items, setItems] = useState<CartItem[]>([])
  const [coupon, setCoupon] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [payMethod, setPayMethod] = useState<PayMethod>("khqr")
  const [placing, setPlacing] = useState(false)
  const [orderNum] = useState(() => `R4K-${Math.floor(Math.random() * 90000) + 10000}`)

  // Delivery location from map
  const [mapLocation, setMapLocation] = useState<LatLng | null>(null)
  const [mapAddress, setMapAddress] = useState("")

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", note: "",
    cardNumber: "", cardExpiry: "", cardCvc: "", cardName: "",
  })

  useEffect(() => {
    setItems(getCart())
    return subscribeStore(() => setItems(getCart()))
  }, [])

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0)
  const discount = couponApplied ? subtotal * 0.1 : 0
  const shipping = subtotal > 50 ? 0 : 4.99
  const total = subtotal - discount + shipping

  function applyCoupon() {
    if (coupon.trim().toUpperCase() === "SAVE10") setCouponApplied(true)
  }

  async function placeOrder() {
    setPlacing(true)
    await new Promise((r) => setTimeout(r, 1800))
    setCart([])
    setPlacing(false)
    setStep(3)
  }

  const canProceed = (() => {
    if (step === 0) return items.length > 0
    if (step === 1) return !!mapLocation
    if (step === 2) {
      if (payMethod === "card") return !!(form.cardName && form.cardNumber && form.cardExpiry && form.cardCvc)
      return true // khqr, aba, bank, cod — no extra fields
    }
    return false
  })()

  // ── PAYMENT METHODS config ─────────────────────────────────────────────────
  const PAY_METHODS: { id: PayMethod; label: string; subtitle: string; icon: React.ReactNode }[] = [
    { id: "khqr", label: "KHQR", subtitle: "ABA · ACLEDA · Wing · Bakong", icon: <QrCode className="h-5 w-5" /> },
    { id: "aba", label: "ABA Pay", subtitle: "Scan with ABA Mobile app", icon: <Smartphone className="h-5 w-5" /> },
    { id: "card", label: t("checkout.paymentMethod"), subtitle: "Visa, Mastercard, UnionPay", icon: <CreditCard className="h-5 w-5" /> },
    { id: "bank", label: "Bank Transfer", subtitle: "ACLEDA, Canadia, etc.", icon: <Banknote className="h-5 w-5" /> },
    { id: "cod", label: "Cash on Delivery", subtitle: "Pay when you receive", icon: <Wallet className="h-5 w-5" /> },
  ]

  // ── STEP 0: Cart ───────────────────────────────────────────────────────────
  const CartStep = (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <p className="text-sm font-semibold">{t("cart.empty")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("home.addBanners")}</p>
          <Button className="mt-5" asChild><Link href="/products">{t("home.browseCategories")}</Link></Button>
        </div>
      ) : (
        items.map((it) => (
          <div key={it.id} className="flex gap-3 rounded-2xl border bg-card p-3">
            <Link href={it.href} className="shrink-0">
              <img src={it.image} alt={it.name} className="h-20 w-20 rounded-xl object-cover bg-muted" />
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <Link href={it.href} className="truncate text-sm font-semibold hover:text-primary transition-colors">{it.name}</Link>
                <button type="button" onClick={() => removeFromCart(it.id)}
                  className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">${it.price.toFixed(2)} each</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-bold text-primary">${(it.price * it.qty).toFixed(2)}</span>
                <div className="inline-flex items-center rounded-full border bg-background">
                  <button type="button" onClick={() => updateCartQty(it.id, it.qty - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted transition-colors">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-semibold tabular-nums">{it.qty}</span>
                  <button type="button" onClick={() => updateCartQty(it.id, it.qty + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted transition-colors">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {items.length > 0 && (
        <div className="rounded-2xl border bg-card p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5" /> {t("checkout.couponCode")}
          </p>
          <div className="flex gap-2">
            <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="e.g. SAVE10"
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" />
            <Button type="button" variant={couponApplied ? "secondary" : "outline"} onClick={applyCoupon} disabled={couponApplied}>
              {couponApplied ? t("checkout.applied") : t("checkout.apply")}
            </Button>
          </div>
          {couponApplied && <p className="text-xs text-primary font-medium">🎉 10% discount applied!</p>}
        </div>
      )}
    </div>
  )

  // ── STEP 1: Delivery ───────────────────────────────────────────────────────
  const DeliveryStep = (
    <div className="space-y-5">
      {/* Map location picker */}
      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <p className="text-sm font-semibold flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" /> {t("checkout.deliveryAddress")}
          {!mapLocation && <span className="ml-auto text-[10px] text-destructive font-normal">Required *</span>}
        </p>
        <LocationPicker
          value={mapLocation}
          onChange={(loc, addr) => { setMapLocation(loc); setMapAddress(addr) }}
        />
      </div>

    </div>
  )

  // ── STEP 2: Payment ────────────────────────────────────────────────────────
  const PaymentStep = (
    <div className="space-y-5">
      <div className="rounded-2xl border bg-card p-5 space-y-3">
        <p className="text-sm font-semibold flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" /> {t("checkout.paymentMethod")}
        </p>
        <div className="space-y-2">
          {PAY_METHODS.map((m) => (
            <PayCard key={m.id} {...m} selected={payMethod === m.id} onSelect={() => setPayMethod(m.id)} />
          ))}
        </div>
      </div>

      {/* Method-specific UI */}
      {payMethod === "khqr" && <KHQRDisplay amount={total} />}
      {payMethod === "aba" && <ABADisplay amount={total} />}
      {payMethod === "bank" && <BankTransferDisplay />}
      {payMethod === "cod" && (
        <div className="rounded-xl border bg-card p-4 flex items-start gap-3">
          <Wallet className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pay with cash when your order arrives. Our delivery partner will contact you beforehand.
          </p>
        </div>
      )}
      {payMethod === "card" && (
        <div className="rounded-2xl border bg-card p-5 space-y-4">
          <p className="text-sm font-semibold flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" /> Card Details
          </p>
          <Field label="Cardholder Name" id="cardName" placeholder="John Doe" value={form.cardName} onChange={(v) => setForm(f => ({ ...f, cardName: v }))} required />
          <Field label="Card Number" id="cardNumber" placeholder="1234 5678 9012 3456" value={form.cardNumber} onChange={(v) => setForm(f => ({ ...f, cardNumber: v }))} required />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Expiry (MM/YY)" id="cardExpiry" placeholder="08/28" value={form.cardExpiry} onChange={(v) => setForm(f => ({ ...f, cardExpiry: v }))} required />
            <Field label="CVC" id="cardCvc" placeholder="123" value={form.cardCvc} onChange={(v) => setForm(f => ({ ...f, cardCvc: v }))} required />
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Lock className="h-3 w-3 text-primary" /> Encrypted · never stored
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 rounded-xl bg-primary/5 border border-primary/15 px-4 py-3">
        <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
        <p className="text-xs text-muted-foreground">
          All orders are protected by our <span className="text-primary font-medium">buyer security guarantee</span>.
        </p>
      </div>
    </div>
  )

  // ── STEP 3: Confirmation ───────────────────────────────────────────────────
  const ConfirmationStep = (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-5">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-30" />
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20">
          <CheckCircle2 className="h-12 w-12 text-primary" />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold">{t("checkout.orderPlaced")}</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs">
          {t("checkout.thankYou")} <span className="font-medium text-foreground">{form.email || "your email"}</span>.
        </p>
      </div>
      <Badge variant="secondary" className="text-xs px-3 py-1.5 font-mono">{orderNum}</Badge>
      {mapAddress && (
        <div className="flex items-start gap-2 rounded-lg bg-muted px-4 py-3 text-left max-w-sm">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-xs text-muted-foreground">{mapAddress}</p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button asChild><Link href="/products">{t("checkout.continueShopping")}</Link></Button>
        <Button variant="outline" asChild><Link href="/">{t("checkout.goHome")}</Link></Button>
      </div>
    </div>
  )

  const stepContent = [CartStep, DeliveryStep, PaymentStep, ConfirmationStep]
  const stepTitles = [t("checkout.reviewCart"), t("checkout.deliveryDetails"), t("checkout.stepPayment"), ""]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:px-8">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center space-x-2 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">{t("nav.home")}</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/products" className="hover:text-primary transition-colors">{t("nav.categories")}</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{t("checkout.title")}</span>
        </nav>

        {/* Step bar */}
        {step < 3 && <div className="mb-10"><StepBar current={step} /></div>}

        {step === 3 ? (
          <div className="max-w-md mx-auto">{ConfirmationStep}</div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">

            {/* Left: step content */}
            <div className="space-y-6">
              <h1 className="text-xl font-bold tracking-tight">{stepTitles[step]}</h1>
              {stepContent[step]}
            </div>

            {/* Right: Order summary */}
            <div>
              <div className="rounded-2xl border bg-card p-5 space-y-4 sticky top-24">
                <h2 className="text-sm font-bold uppercase tracking-wide">{t("checkout.orderSummary")}</h2>
                <Separator />

                {/* Items compact */}
                <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                  {items.map((it) => (
                    <div key={it.id} className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img src={it.image} alt={it.name} className="h-11 w-11 rounded-lg object-cover bg-muted" />
                        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                          {it.qty}
                        </span>
                      </div>
                      <span className="min-w-0 flex-1 truncate text-xs font-medium">{it.name}</span>
                      <span className="shrink-0 text-xs font-semibold">${(it.price * it.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("checkout.subtotal")}</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-primary">
                      <span>Coupon (SAVE10)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("checkout.shipping")}</span>
                    <span>{shipping === 0
                      ? <span className="text-primary font-medium">Free</span>
                      : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-base font-bold">
                  <span>{t("checkout.total")}</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>

                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add <span className="font-medium text-foreground">${(50 - subtotal).toFixed(2)}</span> more for free shipping
                  </p>
                )}

                {/* Delivery summary (step 2+) */}
                {step >= 2 && mapAddress && (
                  <div className="flex items-start gap-2 rounded-lg bg-muted px-3 py-2">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{mapAddress}</p>
                  </div>
                )}

                {/* CTA */}
                {step < 2 ? (
                  <Button className="w-full" size="lg" disabled={!canProceed} onClick={() => setStep((s) => s + 1)}>
                    {step === 0 ? t("checkout.continueToDelivery") : t("checkout.continueToPayment")}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-black hover:bg-black/80" size="lg"
                    disabled={!canProceed || placing} onClick={placeOrder}
                  >
                    {placing ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        {t("checkout.placingOrder")}
                      </span>
                    ) : (
                      <><Lock className="mr-2 h-4 w-4" />{t("checkout.placeOrder")} · ${total.toFixed(2)}</>
                    )}
                  </Button>
                )}

                {step > 0 && (
                  <button type="button" onClick={() => setStep((s) => s - 1)}
                    className="w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors">
                    ← {t("checkout.back")}
                  </button>
                )}

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t">
                  {[{ icon: Truck, label: t("checkout.fastDelivery") }, { icon: ShieldCheck, label: t("checkout.securePay") }, { icon: Lock, label: t("checkout.encrypted") }].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1 text-center pt-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[9px] font-medium uppercase text-muted-foreground">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
