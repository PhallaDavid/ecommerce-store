"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Heart, ShoppingCart, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { getCart, subscribeStore } from "@/lib/store"

export function MobileBottomNav() {
  const pathname = usePathname()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Initialize count
    const updateCount = () => {
      const items = getCart()
      const total = items.reduce((sum, item) => sum + item.qty, 0)
      setCartCount(total)
    }
    
    updateCount()
    return subscribeStore(updateCount)
  }, [])

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Wishlist", href: "/products?tab=wishlist", icon: Heart }, // You can redirect to right route
    { name: "Cart", href: "/checkout", icon: ShoppingCart, badge: cartCount },
    { name: "Account", href: "/profile", icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-[60px] w-full items-center justify-around border-t border-border bg-background/80 backdrop-blur-md pb-safe lg:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const Icon = item.icon
        // Simple active check logic
        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/")
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="relative">
              <Icon className={cn("h-5 w-5", isActive && "fill-primary/20")} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground shadow-sm">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </div>
            <span className={cn("text-[10px] font-semibold", isActive ? "font-bold text-primary" : "font-medium")}>
              {item.name}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
