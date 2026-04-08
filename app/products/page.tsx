"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight, Heart, Loader2, Search, ShoppingCart } from "lucide-react"

import api from "@/utils/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn, formatPrice } from "@/lib/utils"
import { subscribeStore, getFavourites, isFavourite } from "@/lib/store"
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard"
import { Product, PaginatedResponse } from "@/types/api"

type ProductCardProps = {
  id: string
  name: string
  description?: string
  href: string
  image: string
  price: number
  compareAt?: number
}

const FALLBACK_IMG = "/images/STU_8189-cr-450x672.jpg"

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim()) {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }
  return null
}


export default function ProductsPage() {
  const [products, setProducts] = React.useState<ProductCardProps[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [query, setQuery] = React.useState("")
  const [favs, setFavs] = React.useState<Record<string, boolean>>({})
  const [added, setAdded] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await api.get<PaginatedResponse<Product>>("/products")
        
        // Handle both paginated and non-paginated (legacy) responses
        const data = res.data && "data" in res.data 
          ? res.data.data 
          : (Array.isArray(res.data) ? res.data : [])

        const mapped: ProductCardProps[] = data
          .filter((p) => (p.status ? p.status === "active" : true))
          .map((p) => {
            const id = String(p.id)
            const original = toNumber(p.original_price)
            const current =
              (typeof p.current_price === "number" && Number.isFinite(p.current_price)
                ? p.current_price
                : null) ??
              toNumber(p.promo_price) ??
              original ??
              0

            const compareAt =
              original != null && original > current ? original : undefined

            return {
              id,
              name: p.name,
              description: p.description ?? undefined,
              href: `/products/${id}`,
              image: p.thumbnail || FALLBACK_IMG,
              price: current,
              compareAt,
            }
          })

        if (!cancelled) setProducts(mapped)
      } catch (e: unknown) {
        if (cancelled) return
        setProducts([])
        setError(e instanceof Error ? e.message : "Failed to load products")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  React.useEffect(() => {
    setFavs(Object.fromEntries(products.map((p) => [p.id, isFavourite(p.id)])))
    return subscribeStore(() => {
      const favSet = new Set(getFavourites().map((f) => f.id))
      setFavs(Object.fromEntries(products.map((p) => [p.id, favSet.has(p.id)])))
    })
  }, [products])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description ? p.description.toLowerCase().includes(q) : false)
    )
  }, [products, query])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:px-8 space-y-6">
        <nav className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Products</span>
        </nav>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">All Products</h1>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : `${filtered.length} products`}
            </p>
          </div>

          <div className="relative w-full sm:w-[360px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-9"
            />
          </div>
        </div>

        {error ? (
          <div className="rounded-md border bg-card p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-md border bg-card p-6 text-center text-sm text-muted-foreground">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
