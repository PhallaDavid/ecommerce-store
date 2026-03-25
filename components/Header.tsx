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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthDialog } from "@/components/auth-dialog"
import { SearchDialog } from "@/components/search-dialog"
import {
  Home,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  Globe,
  MapPin,
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

export function Header() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [language, setLanguage] = React.useState("en")
  const [location, setLocation] = React.useState("")
  const [isAuthDialogOpen, setIsAuthDialogOpen] = React.useState(false)
  const [isSearchDialogOpen, setIsSearchDialogOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Get current location
  React.useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          
          try {
            // Use OpenStreetMap Nominatim API for reverse geocoding
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
            )
            const data = await response.json()
            
            if (data && data.display_name) {
              setLocation(data.display_name)
            } else {
              setLocation(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`)
            }
          } catch (error) {
            setLocation(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`)
          }
        },
        () => {
          setLocation("Location unavailable")
        }
      )
    } else {
      setLocation("Geolocation not supported")
    }
  }, [])

  const handleAccountClick = () => {
    setIsAuthDialogOpen(true)
  }

  const handleCloseAuthDialog = () => {
    setIsAuthDialogOpen(false)
  }

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "kh" : "en"))
  }

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports",
    "Beauty",
    "Books",
    "Toys",
    "Automotive",
  ]

  return (
    <>
      {/* Language and Location Bar */}
      <div className="bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8 text-sm">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 hover:text-gray-100 text-white transition-colors"
              >
                {language === "en" ? <USFlag /> : <CambodiaFlag />}
                <span className="truncate"  > {language === "en" ? "English" : "ខ្មែរ (Khmer)"}</span>
              </button>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <MapPin className="h-4 w-4" />
              <span className="truncate w-[200px]">
  {location}
</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full border  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-between">

            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <ShoppingCart className="h-6 w-6" />
                <span className="font-bold text-xl">E-Store</span>
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 w-full cursor-pointer"
                  onClick={() => setIsSearchDialogOpen(true)}
                  readOnly
                />
              </div>
            </div>

            {/* Action Icons */}
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" aria-label="Search" className="inline-flex md:hidden rounded-full" onClick={() => setIsSearchDialogOpen(true)}>
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Favourites">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Favourites</span>
              </Button>

              <Button variant="ghost" size="icon"  className="rounded-full" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Button>

              <Button
              className="hidden md:inline-flex rounded-full "
                variant="ghost"
                size="icon"
                aria-label="Account"
                onClick={handleAccountClick}
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>

          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden fixed inset-0 right-0 z-50 w-full bg-background  transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="flex flex-col ">
              <div className="flex items-center justify-between p-4 ">
                <span className="font-semibold">Menu</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto h-full py-4">
                <div className="space-y-2 px-4">
                  <Button variant="ghost" size="icon" aria-label="Search" className="w-full justify-start">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Favourites" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-2" />
                    Favourites
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Cart" className="w-full justify-start">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Account" className="w-full justify-start" onClick={handleAccountClick}>
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* Overlay */}
          {mobileMenuOpen && (
            <div 
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

        </div>
      </header>

      {/* Authentication Dialog */}
      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={handleCloseAuthDialog}
      />

      {/* Search Dialog */}
      <SearchDialog
        isOpen={isSearchDialogOpen}
        onClose={() => setIsSearchDialogOpen(false)}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
    </>
  )
}
