"use client"

import React, { useState, useRef } from "react"
import Link from "next/link"
import {
  ChevronRight, User, Lock, MapPin, Bell, Camera, Check,
  Package, Heart, LogOut, ShieldCheck, Pencil, Trash2, Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const TABS = [
  { id: "info",     label: "Personal Info",    icon: User },
  { id: "security", label: "Security",         icon: Lock },
  { id: "address",  label: "Addresses",        icon: MapPin },
  { id: "notif",    label: "Notifications",    icon: Bell },
]

function Field({ label, id, type = "text", value, onChange, placeholder }: {
  label: string; id: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</label>
      <input id={id} type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/30" />
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={cn("relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
        checked ? "bg-primary" : "bg-muted"
      )}>
      <span className={cn("inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform",
        checked ? "translate-x-4.5" : "translate-x-0.5"
      )} />
    </button>
  )
}

export default function ProfilePage() {
  const [tab, setTab] = useState("info")
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [avatarSrc, setAvatarSrc] = useState("")

  const [info, setInfo] = useState({ firstName: "Sopheak", lastName: "Mao", email: "sopheak@example.com", phone: "+855 12 345 678", dob: "1998-05-12" })
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" })
  const [addresses, setAddresses] = useState([
    { id: "a1", label: "Home", line: "12 Street 274, Phnom Penh", default: true },
    { id: "a2", label: "Office", line: "45 Norodom Blvd, Phnom Penh", default: false },
  ])
  const [notif, setNotif] = useState({ orders: true, promos: true, reviews: false, security: true })

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setAvatarSrc(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:px-8 max-w-5xl">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center space-x-2 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Profile</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">

          {/* ── Sidebar ── */}
          <aside className="space-y-4">
            {/* Avatar card */}
            <div className="flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 text-center">
              <div className="relative">
                <Avatar className="h-20 w-20 ring-4 ring-primary/20">
                  <AvatarImage src={avatarSrc} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                    {info.firstName[0]}{info.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-colors">
                  <Camera className="h-3.5 w-3.5" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
              </div>
              <div>
                <p className="font-semibold">{info.firstName} {info.lastName}</p>
                <p className="text-xs text-muted-foreground">{info.email}</p>
              </div>
              <Badge variant="secondary" className="text-xs gap-1">
                <ShieldCheck className="h-3 w-3 text-primary" /> Verified
              </Badge>
            </div>

            {/* Quick links */}
            <div className="rounded-2xl border bg-card overflow-hidden">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" onClick={() => setTab(id)}
                  className={cn("flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted border-b last:border-b-0",
                    tab === id ? "bg-primary/5 text-primary font-semibold border-l-2 border-l-primary" : "text-foreground"
                  )}>
                  <Icon className="h-4 w-4 shrink-0" /> {label}
                </button>
              ))}
              <Separator />
              <Link href="/orders" className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors">
                <Package className="h-4 w-4 shrink-0" /> My Orders
              </Link>
              <Link href="/products" className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors border-t">
                <Heart className="h-4 w-4 shrink-0" /> Wishlist
              </Link>
            </div>

            <button type="button"
              className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm text-destructive hover:bg-destructive/5 transition-colors"
              onClick={() => { localStorage.removeItem("auth_token"); localStorage.removeItem("user_data"); window.location.href = "/" }}>
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </aside>

          {/* ── Main content ── */}
          <div className="space-y-6">

            {/* Personal Info */}
            {tab === "info" && (
              <div className="rounded-2xl border bg-card p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Personal Information</h2>
                </div>
                <Separator />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="First Name" id="fn" value={info.firstName} onChange={v => setInfo(f => ({...f, firstName: v}))} />
                  <Field label="Last Name"  id="ln" value={info.lastName}  onChange={v => setInfo(f => ({...f, lastName: v}))} />
                </div>
                <Field label="Email Address" id="email" type="email" value={info.email} onChange={v => setInfo(f => ({...f, email: v}))} />
                <Field label="Phone Number"  id="phone" type="tel"   value={info.phone} onChange={v => setInfo(f => ({...f, phone: v}))} placeholder="+855 12 000 000" />
                <Field label="Date of Birth" id="dob"  type="date"  value={info.dob}   onChange={v => setInfo(f => ({...f, dob: v}))} />
                <Button onClick={handleSave} className={cn("gap-2", saved && "bg-green-600 hover:bg-green-600")}>
                  {saved ? <><Check className="h-4 w-4" /> Saved!</> : "Save Changes"}
                </Button>
              </div>
            )}

            {/* Security */}
            {tab === "security" && (
              <div className="rounded-2xl border bg-card p-6 space-y-5">
                <h2 className="text-base font-bold flex items-center gap-2"><Lock className="h-4 w-4 text-primary" /> Change Password</h2>
                <Separator />
                <Field label="Current Password" id="cp" type="password" value={passwords.current} onChange={v => setPasswords(p => ({...p, current: v}))} placeholder="••••••••" />
                <Field label="New Password"     id="np" type="password" value={passwords.next}    onChange={v => setPasswords(p => ({...p, next: v}))} placeholder="Minimum 8 characters" />
                <Field label="Confirm Password" id="cnp" type="password" value={passwords.confirm} onChange={v => setPasswords(p => ({...p, confirm: v}))} placeholder="Repeat new password" />
                {passwords.next && passwords.confirm && passwords.next !== passwords.confirm && (
                  <p className="text-xs text-destructive">Passwords do not match.</p>
                )}
                <Button onClick={handleSave} disabled={!passwords.current || !passwords.next || passwords.next !== passwords.confirm}
                  className={cn(saved && "bg-green-600 hover:bg-green-600")}>
                  {saved ? "Updated!" : "Update Password"}
                </Button>
                <div className="mt-4 rounded-xl bg-muted p-4 space-y-1">
                  <p className="text-xs font-semibold">Password Requirements</p>
                  {["At least 8 characters", "One uppercase letter", "One number or symbol"].map(r => (
                    <p key={r} className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-primary" /> {r}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Addresses */}
            {tab === "address" && (
              <div className="rounded-2xl border bg-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Saved Addresses</h2>
                  <Button size="sm" variant="outline" className="gap-1 text-xs">
                    <Plus className="h-3.5 w-3.5" /> Add New
                  </Button>
                </div>
                <Separator />
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={cn("flex items-start justify-between gap-3 rounded-xl border p-4 transition-colors",
                      addr.default ? "border-primary bg-primary/5" : "bg-card"
                    )}>
                      <div className="flex items-start gap-3">
                        <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                          addr.default ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}>
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold">{addr.label}</p>
                            {addr.default && <Badge className="text-[10px] py-0">Default</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{addr.line}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button type="button" className="rounded-full p-1.5 hover:bg-muted transition-colors"><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></button>
                        {!addr.default && (
                          <button type="button" onClick={() => setAddresses(a => a.filter(x => x.id !== addr.id))}
                            className="rounded-full p-1.5 hover:bg-destructive/10 hover:text-destructive transition-colors">
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notifications */}
            {tab === "notif" && (
              <div className="rounded-2xl border bg-card p-6 space-y-4">
                <h2 className="text-base font-bold flex items-center gap-2"><Bell className="h-4 w-4 text-primary" /> Notification Preferences</h2>
                <Separator />
                {([
                  { key: "orders",   label: "Order Updates",         desc: "Shipping & delivery status" },
                  { key: "promos",   label: "Promotions & Deals",    desc: "Discounts and flash sales" },
                  { key: "reviews",  label: "Review Reminders",      desc: "After receiving your order" },
                  { key: "security", label: "Security Alerts",       desc: "Login and account changes" },
                ] as const).map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between gap-4 py-3 border-b last:border-b-0">
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <Toggle checked={notif[key]} onChange={v => setNotif(n => ({...n, [key]: v}))} />
                  </div>
                ))}
                <Button onClick={handleSave} className={cn("mt-2", saved && "bg-green-600 hover:bg-green-600")}>
                  {saved ? "Saved!" : "Save Preferences"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
