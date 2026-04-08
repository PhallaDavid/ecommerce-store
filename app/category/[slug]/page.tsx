"use client"

import * as React from "react"
import Link from "next/link"
import { Heart, Loader2, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { addToCart, getFavourites, subscribeStore, toggleFavourite } from "@/lib/store"
import api from "@/utils/axios"
import { Category, PaginatedResponse } from "@/types/api"

type PageProps = {
  params: Promise<{ slug: string }>
}

const allProducts = [
  {
    id: "p1",
    name: "Classic Tee",
    category: "fashion",
    image: "/images/STU_8189-cr-450x672.jpg",
    price: 29.99,
    compareAt: 39.99,
  },
  {
    id: "p2",
    name: "Street Hoodie",
    category: "fashion",
    image: "/images/STU_8189-cr-450x672.jpg",
    price: 49.0,
    compareAt: 69.0,
  },
  {
    id: "p3",
    name: "Wireless Headphones",
    category: "audio",
    image: "/images/STU_8189-cr-450x672.jpg",
    price: 89.0,
    compareAt: 109.0,
  },
  {
    id: "p4",
    name: "Minimal Watch",
    category: "accessories",
    image: "/images/STU_8189-cr-450x672.jpg",
    price: 119.0,
    compareAt: 149.0,
  },
  {
    id: "p5",
    name: "Laptop Sleeve",
    category: "computers",
    image: "/images/STU_8189-cr-450x672.jpg",
    price: 25.0,
    compareAt: 35.0,
  },
  {
    id: "p6",
    name: "Gaming Controller",
    category: "gaming",
    image: "/images/STU_8189-cr-450x672.jpg",
    price: 59.0,
    compareAt: 79.0,
  },
  {
    id: "p7",
    name: "Smartphone Case",
    category: "electronics",
    image: "/images/STU_8189-cr-450x672.jpg",
    price: 15.0,
    compareAt: 25.0,
  },
  {
    id: "p8",
    name: "Everyday Sneakers",
    category: "essentials",
    image: "/images/STU_8189-cr-450x672.jpg",
    price: 79.0,
    compareAt: 99.0,
  },
] as const

function titleFromSlug(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value)
}

type SortValue = "new" | "price_asc" | "price_desc"

export default function CategoryPage({ params }: PageProps) {
  const { slug } = React.use(params)
  const [category, setCategory] = React.useState<Category | null>(null)
  const [categoryLoading, setCategoryLoading] = React.useState(false)
  const [categoryError, setCategoryError] = React.useState<string | null>(null)

  const categoryId = React.useMemo(() => {
    const n = Number(slug)
    return Number.isFinite(n) ? n : null
  }, [slug])

  React.useEffect(() => {
    if (categoryId == null) return
    let cancelled = false
    ;(async () => {
      setCategoryLoading(true)
      setCategoryError(null)
      try {
        const res = await api.get<PaginatedResponse<Category>>("/categories")
        
        // Handle both paginated and non-paginated (legacy) responses
        const data = res.data && "data" in res.data 
          ? res.data.data 
          : (Array.isArray(res.data) ? res.data : [])

        const found = data.find((c) => c.id === categoryId) ?? null
        if (!cancelled) setCategory(found)
      } catch (e: unknown) {
        if (!cancelled) {
          setCategory(null)
          setCategoryError(
            e instanceof Error ? e.message : "Failed to load category"
          )
        }
      } finally {
        if (!cancelled) setCategoryLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [categoryId])

  const categoryTitle = category?.name ?? titleFromSlug(slug)
  const [sort, setSort] = React.useState<SortValue>("new")
  const [wishlisted, setWishlisted] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    const refresh = () => {
      const favs = getFavourites()
      setWishlisted(Object.fromEntries(favs.map((f) => [f.id, true])))
    }
    refresh()
    return subscribeStore(refresh)
  }, [])

  const products = React.useMemo(() => {
    const filterKey = category ? slugify(category.name) : slug
    const base =
      filterKey === "new"
        ? [...allProducts]
        : allProducts.filter((p) => p.category === filterKey)

    if (sort === "price_asc") return [...base].sort((a, b) => a.price - b.price)
    if (sort === "price_desc") return [...base].sort((a, b) => b.price - a.price)
    return base
  }, [category, slug, sort])

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <nav className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/categories" className="hover:text-foreground transition-colors">
            Categories
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{categoryTitle}</span>
        </nav>

        <div className="rounded-2xl border bg-card p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{categoryTitle}</h1>
              <p className="text-sm text-muted-foreground">
                {products.length} products
              </p>
              {categoryLoading ? (
                <p className="mt-2 inline-flex items-center text-xs text-muted-foreground">
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Loading category details
                </p>
              ) : categoryError ? (
                <p className="mt-2 text-xs text-destructive">{categoryError}</p>
              ) : category?.description ? (
                <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-muted-foreground">
                Sort
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortValue)}
                className={cn(
                  "h-9 rounded-md border bg-background px-3 text-sm",
                  "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                )}
              >
                <option value="new">New</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => {
            const discountPercent =
              p.compareAt > p.price
                ? Math.round(((p.compareAt - p.price) / p.compareAt) * 100)
                : 0

            return (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                className="group overflow-hidden rounded-2xl border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="relative">
                  <div className="relative aspect-3/4 overflow-hidden bg-muted">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>

                  {discountPercent > 0 ? (
                    <Badge className="absolute left-3 top-3">-{discountPercent}%</Badge>
                  ) : null}

                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    className="absolute right-3 top-3 rounded-full bg-background/85 backdrop-blur border  hover:bg-background"
                    aria-label="Add to wishlist"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleFavourite({
                        id: p.id,
                        name: p.name,
                        href: `/products/${p.id}`,
                        image: p.image,
                        price: p.price,
                        compareAt: p.compareAt,
                      })
                      setWishlisted((prev) => ({ ...prev, [p.id]: !prev[p.id] }))
                    }}
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4",
                        wishlisted[p.id] ? "fill-primary text-primary" : ""
                      )}
                    />
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    className="absolute right-3 top-14 rounded-full bg-background/85 backdrop-blur border  hover:bg-background"
                    aria-label="Add to cart"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      addToCart(
                        {
                          id: p.id,
                          name: p.name,
                          href: `/products/${p.id}`,
                          image: p.image,
                          price: p.price,
                        },
                        1
                      )
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-3">
                  <div className="truncate text-sm font-semibold">{p.name}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-primary">{formatPrice(p.price)}</span>
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(p.compareAt)}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border bg-card p-6 text-center text-sm text-muted-foreground">
            No products found in this category yet.
          </div>
        ) : null}
      </div>
    </div>
  )
}
