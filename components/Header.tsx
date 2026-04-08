"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import NextImage from "next/image"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchDialog } from "@/components/search-dialog"
import { CartSheet } from "@/components/CartSheet"
import { FavouritesSheet } from "@/components/FavouritesSheet"
import { getCart, getFavourites, subscribeStore, syncFavoritesWithServer, syncCartWithServer, fixImageUrl } from "@/lib/store"
import api from "@/utils/axios"
import { Category, Brand, PaginatedResponse } from "@/types/api"
import { useLanguage, Language } from "@/components/LanguageProvider"
import {
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  MapPin,
  LogOut,
  Settings,
  Package,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react"
import { useTheme } from "next-themes"

// Flag SVG components
const USFlag = () => (
  <svg className="h-4 w-4" viewBox="0 0 640 480" aria-label="US Flag">
    <defs>
      <clipPath id="us-clip">
        <rect width="640" height="480"/>
      </clipPath>
    </defs>
    <g clipPath="url(#us-clip)">
      <rect width="640" height="480" fill="#B22234"/>
      <g fill="#FFFFFF">
        <rect width="640" height="40"/>
        <rect y="80" width="640" height="40"/>
        <rect y="160" width="640" height="40"/>
        <rect y="240" width="640" height="40"/>
        <rect y="320" width="640" height="40"/>
        <rect y="400" width="640" height="40"/>
      </g>
      <rect width="280" height="280" fill="#3C3B6E"/>
      <g fill="#FFFFFF">
        <circle cx="40" cy="40" r="15"/>
        <circle cx="120" cy="40" r="15"/>
        <circle cx="200" cy="40" r="15"/>
        <circle cx="280" cy="40" r="15"/>
        <circle cx="80" cy="80" r="15"/>
        <circle cx="160" cy="80" r="15"/>
        <circle cx="240" cy="80" r="15"/>
        <circle cx="40" cy="120" r="15"/>
        <circle cx="120" cy="120" r="15"/>
        <circle cx="200" cy="120" r="15"/>
        <circle cx="280" cy="120" r="15"/>
        <circle cx="80" cy="160" r="15"/>
        <circle cx="160" cy="160" r="15"/>
        <circle cx="240" cy="160" r="15"/>
        <circle cx="40" cy="200" r="15"/>
        <circle cx="120" cy="200" r="15"/>
        <circle cx="200" cy="200" r="15"/>
        <circle cx="280" cy="200" r="15"/>
        <circle cx="80" cy="240" r="15"/>
        <circle cx="160" cy="240" r="15"/>
        <circle cx="240" cy="240" r="15"/>
      </g>
    </g>
  </svg>
)

const CambodiaFlag = () => (
  <svg className="h-4 w-4" viewBox="0 0 640 480" aria-label="Cambodia Flag">
    <defs>
      <clipPath id="kh-clip">
        <rect width="640" height="480"/>
      </clipPath>
    </defs>
    <g clipPath="url(#kh-clip)">
      <rect width="640" height="160" fill="#DA251A"/>
      <rect y="160" width="640" height="160" fill="#00257D"/>
      <rect y="320" width="640" height="160" fill="#DA251A"/>
      <g fill="#F0F0F0">
        <path d="M320 180L200 280H440L320 180Z"/>
        <path d="M240 220L280 260L320 220L360 260L400 220L320 280L240 220Z"/>
        <path d="M260 240L300 280L340 280L380 240L340 260L300 260L260 240Z"/>
      </g>
    </g>
  </svg>
)

interface AuthUser {
  name?: string
  email?: string
  phone?: string
  avatar?: string
}

function normalizeAuthUser(raw: unknown): AuthUser | null {
  if (!raw || typeof raw !== "object") return null
  const obj = raw as Record<string, unknown>

  const rawName =
    (typeof obj.name === "string" ? obj.name : undefined) ??
    (typeof obj.fullName === "string" ? obj.fullName : undefined) ??
    (typeof obj.username === "string" ? obj.username : undefined)

  const name =
    typeof rawName === "string" && rawName.trim()
      ? rawName.trim()
      : typeof obj.email === "string" && obj.email.includes("@")
        ? obj.email.split("@")[0]
        : typeof obj.phone === "string"
          ? obj.phone
          : undefined

  return {
    name,
    email: typeof obj.email === "string" ? obj.email : undefined,
    phone: typeof obj.phone === "string" ? obj.phone : undefined,
    avatar: typeof obj.avatar === "string" ? obj.avatar : undefined,
  }
}

function getInitials(name?: string | null) {
  const safeName = (name ?? "").trim()
  if (!safeName) return "?"
  const initials = safeName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2)
  return initials || "?"
}

// Mobile accordion nav item
function MobileNavSection({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <div>
      <button
        className="flex items-center justify-between w-full px-3 py-3 text-sm font-medium hover:text-primary hover:bg-primary-50 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{label}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="bg-muted/30 px-3 pb-2 space-y-0.5">
          {children}
        </div>
      )}
    </div>
  )
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string
  onClick: () => void
  children: React.ReactNode
}) {
  const router = useRouter()
  return (
    <button
      className="flex items-center w-full text-left px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-primary hover:bg-primary-50 transition-colors"
      onClick={() => {
        router.push(href)
        onClick()
      }}
    >
      {children}
    </button>
  )
}

export function Header() {
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [location, setLocation] = React.useState("")
  const [isSearchDialogOpen, setIsSearchDialogOpen] = React.useState(false)
  const [isFavouritesOpen, setIsFavouritesOpen] = React.useState(false)
  const [isCartOpen, setIsCartOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [authUser, setAuthUser] = React.useState<AuthUser | null>(null)
  const [favCount, setFavCount] = React.useState(0)
  const [cartCount, setCartCount] = React.useState(0)
  const [categories, setCategories] = React.useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = React.useState(false)
  const [categoriesError, setCategoriesError] = React.useState<string | null>(null)
  const [brands, setBrands] = React.useState<Brand[]>([])
  const [brandsLoading, setBrandsLoading] = React.useState(false)
  const [brandsError, setBrandsError] = React.useState<string | null>(null)

  // Hydration safety: ensure sidebar is closed on mount and subscribe to store updates
  React.useEffect(() => {
    setMounted(true)
    setMobileMenuOpen(false)

    // Sync counts with store
    const updateCounts = () => {
      setFavCount(getFavourites().length)
      setCartCount(getCart().reduce((sum, item) => sum + item.qty, 0))
    }

    updateCounts() // Initial update
    return subscribeStore(updateCounts)
  }, [])

  // Load initial data (Categories, Brands, Profile) in parallel for performance
  React.useEffect(() => {
    let cancelled = false
    const token = localStorage.getItem("auth_token")

    const fetchData = async () => {
      setCategoriesLoading(true)
      setBrandsLoading(true)
      
      const promises: Promise<any>[] = [
        api.get<PaginatedResponse<Category>>("/categories"),
        api.get<PaginatedResponse<Brand>>("/brands")
      ]

      if (token) {
        promises.push(api.get("/auth/profile"))
      }

      const results = await Promise.allSettled(promises)
      if (cancelled) return

      // Handle Categories
      if (results[0].status === "fulfilled") {
        const res = results[0].value
        const rawData = res.data && "data" in res.data ? res.data.data : (Array.isArray(res.data) ? res.data : [])
        const data = rawData.map((c: any) => ({ ...c, avatar: fixImageUrl(c.avatar) }))
        setCategories(data)
      } else {
        setCategoriesError("Failed to load categories")
      }
      setCategoriesLoading(false)

      // Handle Brands
      if (results[1].status === "fulfilled") {
        const res = results[1].value
        const rawData = res.data && "data" in res.data ? res.data.data : (Array.isArray(res.data) ? res.data : [])
        const data = rawData.map((b: any) => ({ ...b, avatar: fixImageUrl(b.avatar) }))
        setBrands(data)
      } else {
        setBrandsError("Failed to load brands")
      }
      setBrandsLoading(false)

      // Handle Profile
      if (token && results[2]?.status === "fulfilled") {
        const res = results[2].value
        const rawProfile = res.data?.profile ?? res.data?.user ?? res.data
        const user = normalizeAuthUser(rawProfile)
        if (user) {
          localStorage.setItem("user_data", JSON.stringify(rawProfile))
          setAuthUser(user)
          syncFavoritesWithServer()
          syncCartWithServer()
        }
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    setAuthUser(null)
    router.push("/")
  }

  // Get current location
  React.useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
            )
            const data = await response.json()
            if (data && data.display_name) {
              setLocation(data.display_name)
            } else {
              setLocation(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`)
            }
          } catch {
            setLocation(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`)
          }
        },
        () => setLocation("Location unavailable")
      )
    } else {
      setLocation("Geolocation not supported")
    }
  }, [])

  const closeSidebar = () => setMobileMenuOpen(false)
  const navCategories = React.useMemo(() => categories.slice(0, 12), [categories])
  const navBrands = React.useMemo(() => brands.slice(0, 8), [brands])

  return (
    <>
      {/* Language and Location Bar */}
      <div className="bg-primary text-xs h-9 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-9 text-sm">
            <div className="flex items-center space-x-4">
              <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
                <SelectTrigger className="w-[120px] h-7 bg-transparent hover:bg-transparent data-[state=open]:bg-transparent border-none text-white shadow-none focus:ring-0 focus:ring-offset-0 px-0 font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">
                    <div className="flex items-center gap-2">
<img  className="w-6 h-4 rounded" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASIAAACuCAMAAAClZfCTAAAAFVBMVEX////IEC7FABnrtLvst7/GACPdfoqgTXQ1AAABiUlEQVR4nO3asQ3DMBAEQVqk1H/JdgcTPgTvVHDY+Naata8PXHt44rQSUYmoRFQiKhGViEpEJaISUYmoRFQiKhGViEpEJaISUYmoRFQiKhGViEpEJaISUYmoRFQiKhGViEpEJaISUYmoRFQiKhGViEpEJaISUYmoRFQiKhGViEpEJaISUYmoRFQiKhGViEpEJaISUYmoRFQiKhGViEpEJaISUYmoRHSc6Exv3KPOcyvR/ZzZjeuaxUK/RsMTlyf+uxJRiahEVCIqEZWISkQlohJRiahEVCIqEZWISkQlohJRiahEVCIqEZWISkQlohJRiahEVCIqEZWISkRdsKgjH01fLd9wBx3WqZhKRCWiElGJqERUIioRlYhKRCWiElGJqERUIioRlYhKRCWiElGJqERUIioRlYhKRCWiElGJqERUIioRlYhKRCWiElGJqERUIioRlYhKRCWiElGJqERUIioRlYhKRCWiElGJqERUIioRlYhKRCWiElGJqERUIioRlYhKRCWiFyT6AlXQRZ39U6PdAAAAAElFTkSuQmCC" alt="" />
                      <span>English</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="kh">
                    <div className="flex items-center gap-2">
                      <img className="w-6 rounded h-4" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_Cambodia.svg/960px-Flag_of_Cambodia.svg.png" alt="" />
                      <span>Cambodia</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 text-white/90">
              <MapPin className="h-4 w-4" />
              <span className="truncate w-[200px] text-xs font-medium">{location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-between">

            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                  <div className="flex items-center flex-row" >
              <span className=" text-xl font-bold">R </span>
              <p className="text-sm font-medium" >4kie.S</p>
              </div>
              </Link>
            
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("nav.search")}
                  className="pl-10 pr-4 py-2 w-full rounded-md cursor-pointer h-10 border-muted bg-transparent dark:bg-transparent focus-visible:ring-1"
                  onClick={() => setIsSearchDialogOpen(true)}
                  readOnly
                />
              </div>
            </div>

            {/* Action Icons */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search"
                className="inline-flex md:hidden rounded-full"
                onClick={() => setIsSearchDialogOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative"
                aria-label="Favourites"
                onClick={() => setIsFavouritesOpen(true)}
              >
                <Heart className="h-5 w-5" />
                {favCount > 0 ? (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold leading-5 text-center">
                    {favCount > 99 ? "99+" : favCount}
                  </span>
                ) : null}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative"
                aria-label="Cart"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 ? (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold leading-5 text-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                ) : null}
              </Button>

              {/* User Avatar dropdown (Desktop & Mobile - Only if logged in) */}
              {authUser && (
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 rounded-xl focus:outline-none transition-all hover:bg-muted/50 p-1 group">
                        <div className="relative">
                          <Avatar className="h-8 w-8 transition-transform group-hover:scale-105 border-2 border-transparent group-hover:border-primary/20">
                            <AvatarImage src={authUser.avatar} alt={authUser.name ?? "User"} />
                            <AvatarFallback className="text-xs font-bold bg-primary text-primary-foreground">
                              {getInitials(authUser.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
                        </div>
                        <span className="hidden lg:block max-w-[120px] text-sm font-semibold truncate">
                          {authUser.name}
                        </span>
                        <ChevronDown className="hidden lg:block h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </button>
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent align="end" className="w-64 p-2 shadow-xl border-muted/50">
                      <div className="flex items-center gap-3 p-3 mb-1 bg-muted/30 rounded-lg">
                        <Avatar className="h-10 w-10 border shadow-sm">
                          <AvatarImage src={authUser.avatar} />
                          <AvatarFallback className="font-bold bg-primary text-primary-foreground">
                            {getInitials(authUser.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold truncate">{authUser.name}</span>
                          <span className="text-[10px] text-muted-foreground truncate uppercase tracking-tighter">
                            {authUser.email || authUser.phone}
                          </span>
                        </div>
                      </div>
                      <DropdownMenuSeparator className="mx-1" />
                      <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer rounded-md">
                        <User className="mr-3 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{t("nav.profile")}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/orders")} className="cursor-pointer rounded-md">
                        <Package className="mr-3 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{t("nav.orders")}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer rounded-md">
                        <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{t("nav.settings")}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="mx-1" />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="mt-1 text-red-600 focus:text-white focus:bg-red-600 cursor-pointer font-bold rounded-md transition-colors"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        <span className="text-sm">{t("nav.logout")}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* ── Mobile Sidebar ── */}
          {mounted && mobileMenuOpen && (
            <div
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              onClick={closeSidebar}
            />
          )}

          <div
            className={`md:hidden fixed top-0 right-0 z-50 h-dvh w-full bg-background flex flex-col transition-transform duration-300 ease-in-out ${
              mounted && mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between px-4 py-3 shrink-0 border-b">
              <div className="flex items-center flex-row" >
                <span className=" text-xl font-bold">R </span>
                <p className="text-sm font-medium" >4kie.S</p>
              </div>
              <Button
                variant="ghost"
                className="rounded-full"
                size="icon"
                onClick={closeSidebar}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Scrollable area starts here */}
            <div className="flex-1 overflow-y-auto overscroll-contain flex flex-col">
              {/* User info */}
              {authUser && (
                <div className="flex items-center gap-3 px-4 py-4 shrink-0 border-b bg-muted/20">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={authUser.avatar} alt={authUser.name ?? "User"} />
                    <AvatarFallback className="text-sm font-medium bg-primary text-primary-foreground">
                      {getInitials(authUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-base font-semibold truncate">{authUser.name ?? t("nav.account")}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {authUser.email || authUser.phone}
                    </span>
                  </div>
                </div>
              )}

              {/* Sidebar Nav Items */}
              <div className="flex-1 py-2">
                <div>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium hover:text-primary hover:bg-primary/5 transition-colors"
                    onClick={() => { router.push("/"); closeSidebar() }}
                  >
                    {t("nav.home")}
                  </button>
                </div>

                <MobileNavSection label={t("nav.categories")}>
                  {categoriesError ? (
                    <div className="px-4 py-2 text-xs text-destructive font-medium">
                      Failed to load
                    </div>
                  ) : null}
                  {navCategories.map((c) => (
                    <MobileNavLink key={c.id} href={`/category/${c.id}`} onClick={closeSidebar}>
                      <span className="flex items-center gap-2 min-w-0">
                        {c.avatar ? (
                          <NextImage
                            src={c.avatar}
                            alt={c.name}
                            width={28}
                            height={28}
                            className="h-7 w-7 rounded-md object-cover bg-muted shrink-0"
                          />
                        ) : (
                          <span className="h-7 w-7 rounded-md bg-muted flex items-center justify-center text-[11px] font-semibold text-muted-foreground shrink-0">
                            {c.name.slice(0, 1).toUpperCase()}
                          </span>
                        )}
                        <span className="truncate">{c.name}</span>
                      </span>
                    </MobileNavLink>
                  ))}
                  <MobileNavLink href="/categories" onClick={closeSidebar}>
                    {t("nav.viewAll")}
                  </MobileNavLink>
                </MobileNavSection>

                <MobileNavSection label={t("nav.brands")}>
                  {brandsError ? (
                    <div className="px-4 py-2 text-xs text-destructive font-medium">
                      Failed to load
                    </div>
                  ) : null}
                  {navBrands.map((b) => (
                    <MobileNavLink key={b.id} href={`/brands/${b.id}`} onClick={closeSidebar}>
                      <span className="flex items-center gap-2 min-w-0">
                        {b.avatar ? (
                          <NextImage
                            src={b.avatar}
                            alt={b.name}
                            width={28}
                            height={28}
                            className="h-7 w-7 rounded-md object-cover bg-muted shrink-0"
                          />
                        ) : (
                          <span className="h-7 w-7 rounded-md bg-muted flex items-center justify-center text-[11px] font-semibold text-muted-foreground shrink-0">
                            {b.name.slice(0, 1).toUpperCase()}
                          </span>
                        )}
                        <span className="truncate">{b.name}</span>
                      </span>
                    </MobileNavLink>
                  ))}
                  <MobileNavLink href="/brands" onClick={closeSidebar}>
                    {t("nav.viewAll")}
                  </MobileNavLink>
                </MobileNavSection>

                <div>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium hover:text-primary hover:bg-primary/5 transition-colors"
                    onClick={() => { router.push("/deals"); closeSidebar() }}
                  >
                    {t("nav.deals")}
                  </button>
                </div>
                <div>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium hover:text-primary hover:bg-primary/5 transition-colors"
                    onClick={() => { router.push("/new-arrivals"); closeSidebar() }}
                  >
                    {t("nav.newArrivals")}
                  </button>
                </div>
                <div>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium hover:text-primary hover:bg-primary/5 transition-colors"
                    onClick={() => { router.push("/about"); closeSidebar() }}
                  >
                    {t("nav.about")}
                  </button>
                </div>
                <div>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium hover:text-primary hover:bg-primary/5 transition-colors"
                    onClick={() => { router.push("/contact"); closeSidebar() }}
                  >
                    {t("nav.contact")}
                  </button>
                  {!authUser && (
                    <button
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium hover:text-primary hover:bg-primary/5 transition-colors"
                      onClick={() => { router.push("/auth/login"); closeSidebar() }}
                    >
                      {t("nav.signIn")}
                    </button>
                  )}
                </div>

                {/* Account section */}
                <div className="px-1 py-1 space-y-1">
                  {authUser && (
                    <>
                      <p className="text-[10px] font-bold text-muted-foreground px-4 pb-1 pt-4 uppercase tracking-wider">
                        {t("nav.account")}
                      </p>
                      <button
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:text-primary hover:bg-primary/5 transition-colors"
                        onClick={() => { router.push("/profile"); closeSidebar() }}
                      >
                        {t("nav.profile")}
                      </button>
                      <button
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:text-primary hover:bg-primary/5 transition-colors"
                        onClick={() => { router.push("/orders"); closeSidebar() }}
                      >
                        {t("nav.orders")}
                      </button>
                      <button
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:text-primary hover:bg-primary/5 transition-colors"
                        onClick={() => { router.push("/settings"); closeSidebar() }}
                      >
                        {t("nav.settings")}
                      </button>
                    </>
                  )}
                </div>

                {/* Mobile Language Switcher */}
                <div className="px-5 py-4 mt-4 border-t border-muted/50">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Language / ភាសា</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setLanguage("en")}
                      className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-md border transition-all duration-300 ${language === "en" ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10" : "bg-muted/40 border-transparent text-muted-foreground hover:bg-muted/60"}`}
                    >
                      <USFlag /> <span className="text-[11px] font-semibold">English</span>
                    </button>
                    <button 
                      onClick={() => setLanguage("kh")}
                      className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-md border transition-all duration-300 ${language === "kh" ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10" : "bg-muted/40 border-transparent text-muted-foreground hover:bg-muted/60"}`}
                    >
                      <CambodiaFlag /> <span className="text-[11px] font-semibold">ខ្មែរ</span>
                    </button>
                  </div>
                </div>

                {/* Mobile Theme Switcher */}
                <div className="px-5 py-4 mt-1 border-t border-muted/50">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">{t("nav.theme")}</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => setTheme("light")}
                      className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-md border transition-all duration-300 ${mounted && theme === "light" ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10" : "bg-muted/40 border-transparent text-muted-foreground hover:bg-muted/60"}`}
                    >
                      <Sun className="h-3.5 w-3.5" /> 
                      <span className="text-[9px] font-semibold">{t("theme.light")}</span>
                    </button>
                    <button 
                      onClick={() => setTheme("dark")}
                      className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-md border transition-all duration-300 ${mounted && theme === "dark" ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10" : "bg-muted/40 border-transparent text-muted-foreground hover:bg-muted/60"}`}
                    >
                      <Moon className="h-3.5 w-3.5" /> 
                      <span className="text-[9px] font-semibold">{t("theme.dark")}</span>
                    </button>
                    <button 
                      onClick={() => setTheme("system")}
                      className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-md border transition-all duration-300 ${mounted && theme === "system" ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10" : "bg-muted/40 border-transparent text-muted-foreground hover:bg-muted/60"}`}
                    >
                      <Settings className="h-3.5 w-3.5" /> 
                      <span className="text-[9px] font-semibold">{t("theme.system")}</span>
                    </button>
                  </div>
                </div>

                {/* Logout section */}
                {authUser && (
                  <div className="mt-4 px-5 pb-10">
                    <button
                      className="group flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive hover:text-white transition-all duration-300 font-black text-sm uppercase tracking-widest shadow-sm active:scale-95"
                      onClick={() => { handleLogout(); closeSidebar() }}
                    >
                      <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      {t("nav.logout")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Menu — desktop only */}
      <nav className="bg-background pt-3 pb-3 border-b hidden md:block">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <NavigationMenu className="w-full">
            <NavigationMenuList className="justify-center space-x-6">
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
                  {t("nav.home")}
                </NavigationMenuLink>
              </NavigationMenuItem>

	              <NavigationMenuItem>
	                <NavigationMenuTrigger className="text-sm font-medium">{t("nav.categories")}</NavigationMenuTrigger>
	                <NavigationMenuContent>
	                  <div className="grid gap-3 p-4 w-[420px] lg:w-[560px] lg:grid-cols-[.75fr_1fr]">
	                    <div className="grid gap-3">
	                      <NavigationMenuLink asChild>
	                        <Link
	                          href="/categories"
	                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-linear-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:"
	                        >
	                          <div className="mb-2 mt-4 text-lg font-medium">{t("nav.browseCategories")}</div>
	                        </Link>
	                      </NavigationMenuLink>
	                    </div>
		                    <div className="grid grid-cols-2 gap-3">
		                      {navCategories.map((c) => (
		                        <NavigationMenuLink asChild key={c.id}>
		                          <Link
		                            href={`/category/${c.id}`}
		                            className="group block select-none rounded-md p-3 no-underline outline-none transition-colors hover:text-primary hover:bg-primary-50"
		                          >
		                            <div className="flex items-center gap-2">
		                              {c.avatar ? (
		                                <NextImage
		                                  src={c.avatar}
		                                  alt={c.name}
                                      width={32}
                                      height={32}
		                                  className="h-8 w-8 rounded-md object-cover bg-muted shrink-0"
		                                />
		                              ) : (
		                                <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
		                                  {c.name.slice(0, 1).toUpperCase()}
		                                </div>
		                              )}
		                              <div className="text-sm font-medium leading-none truncate">
		                                {c.name}
		                              </div>
		                            </div>
		                          </Link>
		                        </NavigationMenuLink>
		                      ))}
		                      <NavigationMenuLink asChild>
		                        <Link
		                          href="/categories"
		                          className="group block select-none rounded-md p-3 no-underline outline-none transition-colors hover:text-primary hover:bg-primary-50"
		                        >
		                          <div className="text-sm font-medium leading-none">{t("nav.viewAll")}</div>
		                        </Link>
		                      </NavigationMenuLink>
		                    </div>
	                  </div>
	                </NavigationMenuContent>
	              </NavigationMenuItem>

	              <NavigationMenuItem>
	                <NavigationMenuTrigger className="text-sm font-medium">{t("nav.brands")}</NavigationMenuTrigger>
	                <NavigationMenuContent>
	                  <div className="grid gap-3 p-4 w-[420px] lg:w-[560px] lg:grid-cols-[.75fr_1fr]">
	                    <div className="grid gap-3">
	                      <NavigationMenuLink asChild>
	                        <Link
	                          href="/brands"
	                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-linear-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:"
	                        >
	                          <div className="mb-2 mt-4 text-lg font-medium">{t("nav.browseBrands")}</div>
	                        </Link>
	                      </NavigationMenuLink>
	                    </div>
	                    <div className="grid grid-cols-2 gap-3">
	                      {navBrands.map((b) => (
	                        <NavigationMenuLink asChild key={b.id}>
                           
	                          <Link
	                            href={`/brands/${b.id}`}
	                            className="group block select-none rounded-md p-3 no-underline outline-none transition-colors hover:text-primary hover:bg-primary-50"
	                          >
	                            <div className="flex items-center gap-2">
	                              {b.avatar ? (
	                                <NextImage
	                                  src={b.avatar}
	                                  alt={b.name}
                                    width={32}
                                    height={32}
	                                  className="h-8 w-8 rounded-md object-cover bg-muted shrink-0"
	                                />
	                              ) : (
	                                <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
	                                  {b.name.slice(0, 1).toUpperCase()}
	                                </div>
	                              )}
	                              <div className="text-sm font-medium leading-none truncate">
	                                {b.name}
	                              </div>
	                            </div>
	                          </Link>
	                        </NavigationMenuLink>
	                      ))}
	                      <NavigationMenuLink asChild>
		                        <Link
		                          href="/brands"
		                          className="group block select-none rounded-md p-3 no-underline outline-none transition-colors hover:text-primary hover:bg-primary-50"
		                        >
		                          <div className="text-sm font-medium leading-none">{t("nav.viewAll")}</div>
		                        </Link>
		                      </NavigationMenuLink>
	                    </div>
	                  </div>
	                </NavigationMenuContent>
	              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/deals" className={navigationMenuTriggerStyle()}>
                  {t("nav.deals")}
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/new-arrivals" className={navigationMenuTriggerStyle()}>
                  {t("nav.newArrivals")}
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/about" className={navigationMenuTriggerStyle()}>
                  {t("nav.about")}
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/contact" className={navigationMenuTriggerStyle()}>
                  {t("nav.contact")}
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>

      <SearchDialog
        isOpen={isSearchDialogOpen}
        onClose={() => setIsSearchDialogOpen(false)}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <FavouritesSheet open={isFavouritesOpen} onOpenChange={setIsFavouritesOpen} />
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  )
}
