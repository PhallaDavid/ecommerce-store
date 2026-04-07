"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight, Heart, Loader2, Search, ShoppingCart } from "lucide-react"

import api from "@/utils/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { addToCart, getFavourites, isFavourite, subscribeStore, toggleFavourite } from "@/lib/store"

type ApiProduct = {
  id: number
  name: string
  description: string | null
  original_price: string | number | null
  promo_price: string | number | null
  current_price: number | null
  is_on_sale: boolean | null
  thumbnail: string | null
  status: string | null
  created_at: string | null
}

type ProductCard = {
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

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value)
}

export default function ProductsPage() {
  const [products, setProducts] = React.useState<ProductCard[]>([])
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
        const res = await api.get<ApiProduct[]>("/products")
        const list = Array.isArray(res.data) ? res.data : []
        const mapped: ProductCard[] = list
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
          <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading products
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-md border bg-card p-6 text-center text-sm text-muted-foreground">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => {
              const discountPercent =
                p.compareAt && p.compareAt > p.price
                  ? Math.round(((p.compareAt - p.price) / p.compareAt) * 100)
                  : 0

              return (
                <Link
                  key={p.id}
                  href={p.href}
                  className="group overflow-hidden rounded-md border bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="relative">
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>

                    {discountPercent > 0 ? (
                      <span className="absolute left-3 top-3 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                        -{discountPercent}%
                      </span>
                    ) : null}

                    <Button
                      type="button"
                      variant="secondary"
                      size="icon-sm"
                      className="absolute right-3 top-3 rounded-full bg-background/85 backdrop-blur border hover:bg-background"
                      aria-label="Add to wishlist"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleFavourite({
                          id: p.id,
                          name: p.name,
                          href: p.href,
                          image: p.image,
                          price: p.price,
                          compareAt: p.compareAt,
                        })
                        setFavs((prev) => ({ ...prev, [p.id]: !prev[p.id] }))
                      }}
                    >
                      <Heart className={cn("h-4 w-4", favs[p.id] ? "fill-primary text-primary" : "")} />
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      size="icon-sm"
                      className="absolute right-3 top-14 rounded-full bg-background/85 backdrop-blur border hover:bg-background"
                      aria-label="Add to cart"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        addToCart(
                          { id: p.id, name: p.name, href: p.href, image: p.image, price: p.price },
                          1
                        )
                        setAdded((prev) => ({ ...prev, [p.id]: true }))
                        setTimeout(() => {
                          setAdded((prev) => ({ ...prev, [p.id]: false }))
                        }, 800)
                      }}
                    >
                      {added[p.id] ? (
                        <span className="text-xs font-semibold text-primary">✓</span>
                      ) : (
                        <ShoppingCart className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="p-3">
                    <div className="truncate text-sm font-semibold">{p.name}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-primary">
                        {formatPrice(p.price)}
                      </span>
                      {p.compareAt ? (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(p.compareAt)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
