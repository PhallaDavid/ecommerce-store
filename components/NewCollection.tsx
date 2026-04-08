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
import { subscribeStore, getFavourites, isFavourite } from "@/lib/store"
import { formatPrice } from "@/lib/utils"
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard"

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
                  <ProductCardSkeleton />
                </CarouselItem>
              ))
            : null}

          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/2 sm:basis-1/3 lg:basis-1/4"
            >
              <ProductCard {...product} showAddToCart={false} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="hidden md:inline-flex -left-6" />
        <CarouselNext className="hidden md:inline-flex -right-6" />
      </Carousel>
    </section>
  )
}
