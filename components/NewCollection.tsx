"use client"

import * as React from "react"
import Link from "next/link"
import { Heart } from "lucide-react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import api from "@/utils/axios"
import { getFavourites, isFavourite, subscribeStore, toggleFavourite } from "@/lib/store"

type ApiProduct = {
  id: number
  name: string
  thumbnail: string | null
  original_price: string | number | null
  promo_price: string | number | null
  current_price: number | null
  is_on_sale: boolean | null
  status?: string | null
  created_at?: string | null
}

type ProductCard = {
  id: string
  name: string
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

export function NewCollection() {
  const [products, setProducts] = React.useState<ProductCard[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [favs, setFavs] = React.useState<Record<string, boolean>>({})

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
          .slice(0, 12)
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

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between">
        <h2 className="text-base font-semibold tracking-tight">New Collections</h2>
        <Link
          href="/?sort=new"
          className="text-sm font-medium text-muted-foreground hover:text-primary hover:underline transition-colors"
        >
          Shop Now
        </Link>
      </div>

      {error ? (
        <div className="rounded-md border bg-card p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <Carousel
        className="w-full"
        opts={{ align: "start", dragFree: true, containScroll: "trimSnaps" }}
      >
        <CarouselContent>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <CarouselItem
                  key={`skeleton-${i}`}
                  className="basis-1/2 sm:basis-1/3 lg:basis-1/4"
                >
                  <div className="overflow-hidden rounded-md bg-card">
                    <div className="aspect-[3/4] bg-muted animate-pulse" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                      <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
                    </div>
                  </div>
                </CarouselItem>
              ))
            : null}

          {products.map((product) => {
            const discountPercent =
              product.compareAt && product.compareAt > product.price
                ? Math.round(
                    ((product.compareAt - product.price) / product.compareAt) * 100
                  )
                : 0

            return (
              <CarouselItem
                key={product.id}
                className="basis-1/2 sm:basis-1/3 lg:basis-1/4"
              >
                <Link
                  href={product.href}
                  className="group block overflow-hidden rounded-md bg-card transition-colors"
                >
                  <div className="relative">
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover rounded-md transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      size="icon-sm"
                      className="absolute right-3 top-3 rounded-full bg-background/85 backdrop-blur border cursor-pointer hover:bg-background"
                      aria-label="Add to wishlist"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleFavourite({
                          id: product.id,
                          name: product.name,
                          href: product.href,
                          image: product.image,
                          price: product.price,
                          compareAt: product.compareAt,
                        })
                        setFavs((prev) => ({ ...prev, [product.id]: !prev[product.id] }))
                      }}
                    >
                      <Heart className={favs[product.id] ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4"} />
                    </Button>
                  </div>

                  <div className="p-3">
                    <div className="truncate text-sm font-semibold">{product.name}</div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        {discountPercent > 0 ? (
                          <span className="text-sm font-semibold text-red-600">
                            -{discountPercent}%
                          </span>
                        ) : null}
                        {product.compareAt ? (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.compareAt)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            )
          })}
        </CarouselContent>

        <CarouselPrevious className="hidden md:inline-flex -left-6" />
        <CarouselNext className="hidden md:inline-flex -right-6" />
      </Carousel>
    </section>
  )
}
