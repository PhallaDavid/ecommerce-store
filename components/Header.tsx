"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthDialog } from "@/components/auth-dialog"
import { SearchDialog } from "@/components/search-dialog"
import { CartSheet } from "@/components/CartSheet"
import { FavouritesSheet } from "@/components/FavouritesSheet"
import { getCart, getFavourites, subscribeStore } from "@/lib/store"
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
  ChevronRight,
} from "lucide-react"

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
  name: string
  email?: string
  phone?: string
  avatar?: string
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
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
        className="flex items-center justify-between w-full px-3 py-3 text-sm font-medium hover:bg-accent transition-colors"
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
      className="flex items-center w-full text-left px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      onClick={() => {
        router.push(href)
        onClick()
      }}
    >
      <ChevronRight className="h-3 w-3 shrink-0" />
      {children}
    </button>
  )
}

export function Header() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [language, setLanguage] = React.useState("en")
  const [location, setLocation] = React.useState("")
  const [isAuthDialogOpen, setIsAuthDialogOpen] = React.useState(false)
  const [isSearchDialogOpen, setIsSearchDialogOpen] = React.useState(false)
  const [isFavouritesOpen, setIsFavouritesOpen] = React.useState(false)
  const [isCartOpen, setIsCartOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [authUser, setAuthUser] = React.useState<AuthUser | null>(null)
  const [favCount, setFavCount] = React.useState(0)
  const [cartCount, setCartCount] = React.useState(0)

  // Hydration safety: ensure sidebar is closed on mount
  React.useEffect(() => {
    setMounted(true)
    setMobileMenuOpen(false)
  }, [])

  React.useEffect(() => {
    if (!mounted) return
    const refresh = () => {
      setFavCount(getFavourites().length)
      setCartCount(getCart().reduce((sum, it) => sum + it.qty, 0))
    }
    refresh()
    return subscribeStore(refresh)
  }, [mounted])

  // Check localStorage for user & token on mount
  React.useEffect(() => {
    const token = localStorage.getItem("auth_token")
    const userRaw = localStorage.getItem("user_data")
    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw)
        setAuthUser(user)
      } catch {
        setAuthUser(null)
      }
    }
  }, [])

  // Re-check auth when dialog closes (in case user just logged in)
  const handleCloseAuthDialog = () => {
    setIsAuthDialogOpen(false)
    const token = localStorage.getItem("auth_token")
    const userRaw = localStorage.getItem("user_data")
    if (token && userRaw) {
      try {
        setAuthUser(JSON.parse(userRaw))
      } catch {
        setAuthUser(null)
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
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

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "kh" : "en"))
  }

  const closeSidebar = () => setMobileMenuOpen(false)

  return (
    <>
      {/* Language and Location Bar */}
      <div className="bg-black text-white text-xs h-8 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8 text-sm">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 hover:text-gray-100 text-white transition-colors"
              >
                {language === "en" ? <USFlag /> : <CambodiaFlag />}
                <span className="truncate">{language === "en" ? "English" : "ខ្មែរ (Khmer)"}</span>
              </button>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <MapPin className="h-4 w-4" />
              <span className="truncate w-[200px]">{location}</span>
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
                  placeholder="Search ..."
                  className="pl-10 pr-4 py-2 w-full rounded-full cursor-pointer"
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
                className="rounded-full relative hidden md:block"
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
                className="rounded-full relative hidden md:block"
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

              {/* Desktop: Avatar dropdown if logged in, else User icon */}
              <div className="hidden md:flex">
                {authUser ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        <Avatar className="h-8 w-8 cursor-pointer">
                          <AvatarImage src={authUser.avatar} alt={authUser.name} />
                          <AvatarFallback className="text-xs font-medium bg-primary text-primary-foreground">
                            {getInitials(authUser.name)}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push("/profile")}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/orders")}>
                        <Package className="mr-2 h-4 w-4" />
                        My Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/settings")}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label="Account"
                    onClick={() => setIsAuthDialogOpen(true)}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {/* Mobile menu toggle — only opens sidebar on click */}
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
          {/* Overlay */}
          {mounted && mobileMenuOpen && (
            <div
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              onClick={closeSidebar}
            />
          )}

          <div
            className={`md:hidden fixed top-0 right-0 z-50 h-screen w-full bg-background  flex flex-col transition-transform duration-300 ease-in-out ${
              mounted && mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between px-4 py-3 shrink-0">
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

            {/* User info if logged in */}
            {authUser && (
              <div className="flex items-center gap-3 px-4 py-3 shrink-0">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={authUser.avatar} alt={authUser.name} />
                  <AvatarFallback className="text-xs font-medium bg-primary text-primary-foreground">
                    {getInitials(authUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate">{authUser.name}</span>
                  <span className="text-xs text-muted-foreground truncate">
                    {authUser.email || authUser.phone}
                  </span>
                </div>
              </div>
            )}

            {/* Sidebar Nav Items */}
            <div className="flex-1 overflow-y-auto">

              {/* ── Simple links ── */}
              <div className="">
                <button
                  className="flex items-center gap-2 w-full px-3 py-3 text-sm font-medium hover:bg-accent transition-colors"
                  onClick={() => { router.push("/"); closeSidebar() }}
                >
                  Home
                </button>
              </div>

              {/* ── Categories ── */}
              <MobileNavSection label="Categories">
                {/* Electronics */}
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 pt-3 pb-1">
                  Electronics
                </p>
                <MobileNavLink href="/categories/electronics/smartphones" onClick={closeSidebar}>Smartphones</MobileNavLink>
                <MobileNavLink href="/categories/electronics/laptops" onClick={closeSidebar}>Laptops</MobileNavLink>
                <MobileNavLink href="/categories/electronics/tablets" onClick={closeSidebar}>Tablets</MobileNavLink>
                <MobileNavLink href="/categories/electronics/accessories" onClick={closeSidebar}>Accessories</MobileNavLink>

                {/* Clothing */}
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 pt-3 pb-1">
                  Clothing
                </p>
                <MobileNavLink href="/categories/clothing/men" onClick={closeSidebar}>Men's Clothing</MobileNavLink>
                <MobileNavLink href="/categories/clothing/women" onClick={closeSidebar}>Women's Clothing</MobileNavLink>
                <MobileNavLink href="/categories/clothing/kids" onClick={closeSidebar}>Kids Clothing</MobileNavLink>
                <MobileNavLink href="/categories/clothing/shoes" onClick={closeSidebar}>Shoes & Footwear</MobileNavLink>

                {/* Home & Garden */}
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 pt-3 pb-1">
                  Home & Garden
                </p>
                <MobileNavLink href="/categories/home/furniture" onClick={closeSidebar}>Furniture</MobileNavLink>
                <MobileNavLink href="/categories/home/decor" onClick={closeSidebar}>Home Decor</MobileNavLink>
                <MobileNavLink href="/categories/home/kitchen" onClick={closeSidebar}>Kitchen & Dining</MobileNavLink>
                <MobileNavLink href="/categories/home/garden" onClick={closeSidebar}>Garden & Outdoor</MobileNavLink>

                {/* Beauty & Health */}
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 pt-3 pb-1">
                  Beauty & Health
                </p>
                <MobileNavLink href="/categories/beauty/skincare" onClick={closeSidebar}>Skincare</MobileNavLink>
                <MobileNavLink href="/categories/beauty/cosmetics" onClick={closeSidebar}>Cosmetics</MobileNavLink>
                <MobileNavLink href="/categories/beauty/fragrances" onClick={closeSidebar}>Fragrances</MobileNavLink>
                <MobileNavLink href="/categories/beauty/health" onClick={closeSidebar}>Health & Wellness</MobileNavLink>

                {/* Sports & Outdoors */}
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 pt-3 pb-1">
                  Sports & Outdoors
                </p>
                <MobileNavLink href="/categories/sports/fitness" onClick={closeSidebar}>Fitness Equipment</MobileNavLink>
                <MobileNavLink href="/categories/sports/outdoor" onClick={closeSidebar}>Outdoor Gear</MobileNavLink>
                <MobileNavLink href="/categories/sports/cycling" onClick={closeSidebar}>Cycling</MobileNavLink>
                <MobileNavLink href="/categories/sports/water-sports" onClick={closeSidebar}>Water Sports</MobileNavLink>
              </MobileNavSection>

              {/* ── Brands ── */}
              <MobileNavSection label="Brands">
                <MobileNavLink href="/brands/apple" onClick={closeSidebar}>Apple</MobileNavLink>
                <MobileNavLink href="/brands/nike" onClick={closeSidebar}>Nike</MobileNavLink>
                <MobileNavLink href="/brands/samsung" onClick={closeSidebar}>Samsung</MobileNavLink>
                <MobileNavLink href="/brands/adidas" onClick={closeSidebar}>Adidas</MobileNavLink>
                <MobileNavLink href="/brands/sony" onClick={closeSidebar}>Sony</MobileNavLink>
              </MobileNavSection>

              {/* ── Simple links ── */}
              <div>
                <button
                  className="flex items-center gap-2 w-full px-3 py-3 text-sm font-medium hover:bg-accent transition-colors"
                  onClick={() => { router.push("/deals"); closeSidebar() }}
                >
                  Deals
                </button>
              </div>
              <div>
                <button
                  className="flex items-center gap-2 w-full px-3 py-3 text-sm font-medium hover:bg-accent transition-colors"
                  onClick={() => { router.push("/new-arrivals"); closeSidebar() }}
                >
                  New Arrivals
                </button>
              </div>
              <div>
                <button
                  className="flex items-center gap-2 w-full px-3 py-3 text-sm font-medium hover:bg-accent transition-colors"
                  onClick={() => { router.push("/about"); closeSidebar() }}
                >
                  About Us
                </button>
              </div>
              <div>
                <button
                  className="flex items-center gap-2 w-full px-3 py-3 text-sm font-medium hover:bg-accent transition-colors"
                  onClick={() => { router.push("/contact"); closeSidebar() }}
                >
                  Contact
                </button>
                <button
                      className="flex items-center gap-2 w-full px-3 py-3 text-sm font-medium hover:bg-accent transition-colors"
                      onClick={() => { setIsAuthDialogOpen(true); closeSidebar() }}
                    >
                      Sign In
                    </button>
              </div>

              {/* ── Account section ── */}
              <div className="px-3 py-3 space-y-1">
                {authUser ? (
                  <>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 pb-1 pt-2">
                      Account
                    </p>
                    <button
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
                      onClick={() => { router.push("/profile"); closeSidebar() }}
                    >
                      Profile
                    </button>
                    <button
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
                      onClick={() => { router.push("/orders"); closeSidebar() }}
                    >
                      My Orders
                    </button>
                    <button
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
                      onClick={() => { router.push("/settings"); closeSidebar() }}
                    >
                      Settings
                    </button>
                  </>
                ) : (
                  <>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar Footer — Logout */}
            {authUser && (
              <div className="shrink-0 px-3 py-3">
                <button
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors"
                  onClick={() => { handleLogout(); closeSidebar() }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Menu — desktop only */}
      <nav className="bg-white pt-4 hidden md:block">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <NavigationMenu className="w-full">
            <NavigationMenuList className="justify-center space-x-8">
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[600px] lg:w-[700px] lg:grid-cols-[.75fr_1fr]">
                    <div className="grid gap-3">
                      <div className="grid gap-3">
                        <NavigationMenuLink asChild>
                          <Link
                            href="/categories/electronics"
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-linear-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Electronics
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Latest smartphones, laptops, and gadgets
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground">Electronics</h4>
                        <div className="space-y-1">
                          <NavigationMenuLink asChild>
                            <Link href="/categories/electronics/smartphones" className="block rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Smartphones</Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link href="/categories/electronics/laptops" className="block rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Laptops</Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link href="/categories/electronics/tablets" className="block rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Tablets</Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link href="/categories/electronics/accessories" className="block rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Accessories</Link>
                          </NavigationMenuLink>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground">Clothing</h4>
                        <div className="space-y-1">
                          <NavigationMenuLink asChild>
                            <Link href="/categories/clothing/men" className="block rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Men's Clothing</Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link href="/categories/clothing/women" className="block rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Women's Clothing</Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link href="/categories/clothing/kids" className="block rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Kids Clothing</Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link href="/categories/clothing/shoes" className="block rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Shoes & Footwear</Link>
                          </NavigationMenuLink>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground">Home & Garden</h4>
                        <div className="space-y-1">
                          <NavigationMenuLink asChild>
                            <Link href="/categories/home/furniture" className="block rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Furniture</Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link href="/categories/home/decor" className="block rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Home Decor</Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link href="/categories/home/kitchen" className="block rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Kitchen & Dining</Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link href="/categories/home/garden" className="block rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Garden & Outdoor</Link>
                          </NavigationMenuLink>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground">Beauty & Health</h4>
                        <div className="space-y-1">
                          <NavigationMenuLink asChild>
                            <Link href="/categories/beauty/skincare" className="block rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Skincare</Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link href="/categories/beauty/cosmetics" className="block rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Cosmetics</Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link href="/categories/beauty/fragrances" className="block rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Fragrances</Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link href="/categories/beauty/health" className="block rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Health & Wellness</Link>
                          </NavigationMenuLink>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground">Sports & Outdoors</h4>
                        <div className="space-y-1">
                          <NavigationMenuLink asChild>
                            <Link href="/categories/sports/fitness" className="block rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Fitness Equipment</Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link href="/categories/sports/outdoor" className="block rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Outdoor Gear</Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link href="/categories/sports/cycling" className="block rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Cycling</Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link href="/categories/sports/water-sports" className="block rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Water Sports</Link>
                          </NavigationMenuLink>
                        </div>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">Brands</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <div className="grid gap-3">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/brands/apple"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-linear-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">Apple</div>
                          <p className="text-sm leading-tight text-muted-foreground">Premium electronics and devices</p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <NavigationMenuLink asChild>
                        <Link href="/brands/nike" className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Nike</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Athletic footwear and apparel</p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/brands/samsung" className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Samsung</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Electronics and smart devices</p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/brands/adidas" className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Adidas</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Sportswear and lifestyle products</p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/brands/sony" className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Sony</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Audio, gaming, and entertainment</p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/deals" className={navigationMenuTriggerStyle()}>
                  Deals
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/new-arrivals" className={navigationMenuTriggerStyle()}>
                  New Arrivals
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/about" className={navigationMenuTriggerStyle()}>
                  About Us
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/contact" className={navigationMenuTriggerStyle()}>
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>

      {/* Authentication Dialog */}
      <AuthDialog isOpen={isAuthDialogOpen} onClose={handleCloseAuthDialog} />

      {/* Search Dialog */}
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
