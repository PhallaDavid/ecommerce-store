"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight, Loader2, PackageOpen, Search, SearchX } from "lucide-react"

import api from "@/utils/axios"
import { Input } from "@/components/ui/input"
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard"
import { Product, Brand, PaginatedResponse } from "@/types/api"
import { useLanguage } from "@/components/LanguageProvider"

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

export default function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { t } = useLanguage()
  const { slug } = React.use(params)
  // Support both slug (name) or ID (number)
  const brandId = React.useMemo(() => {
    const n = Number(slug)
    return Number.isFinite(n) ? n : null
  }, [slug])

  const [products, setProducts] = React.useState<ProductCardProps[]>([])
  const [brand, setBrand] = React.useState<Brand | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [query, setQuery] = React.useState("")

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      setIsLoading(true)
      setError(null)
      try {
        // If it's a number, we can fetch products by brand ID
        if (brandId !== null) {
          // 1. Fetch products by brand
          const productsRes = await api.get<PaginatedResponse<Product>>(`/products/brand/${brandId}`)
          
          // 2. Fetch all brands to find the current one's name
          const brandsRes = await api.get<PaginatedResponse<Brand>>("/brands")
          
          if (cancelled) return

          const productsData = productsRes.data && "data" in productsRes.data 
            ? productsRes.data.data 
            : (Array.isArray(productsRes.data) ? productsRes.data : [])

          const mapped = productsData
            .filter((p) => (p.status ? p.status === "active" : true))
            .map((p) => {
              const id = String(p.id)
              const original = toNumber(p.original_price)
              const current = (typeof p.current_price === "number" ? p.current_price : null) ?? toNumber(p.promo_price) ?? original ?? 0
              const compareAt = original != null && original > current ? original : undefined
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

          const brandsData = brandsRes.data && "data" in brandsRes.data ? brandsRes.data.data : (Array.isArray(brandsRes.data) ? brandsRes.data : [])
          const currentBrand = brandsData.find(b => b.id === brandId)

          if (!cancelled) {
            setProducts(mapped)
            setBrand(currentBrand || null)
          }
        } else {
            // Slug-based logic (if needed, but for now we prioritize ID as requested)
            // For now, if it's not a number, we just show empty
            setIsLoading(false)
        }
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
  }, [brandId, slug])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description ? p.description.toLowerCase().includes(q) : false)
    )
  }, [products, query])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 lg:px-8 space-y-6">
          <nav className="flex items-center space-x-2 text-sm">
            <div className="h-4 w-10 bg-muted animate-pulse rounded" />
            <ChevronRight className="h-4 w-4 text-muted/40" />
            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
            <ChevronRight className="h-4 w-4 text-muted/40" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </nav>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-10 w-full sm:w-[360px] bg-muted animate-pulse rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:px-8 space-y-6">
        <nav className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            {t("nav.home")}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/brands" className="hover:text-primary transition-colors">
            {t("nav.brands")}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{brand?.name || t("brand.title")}</span>
        </nav>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
               {brand?.avatar && (
                 <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border bg-muted">
                    <img src={brand.avatar} alt={brand.name} className="h-full w-full object-cover" />
                 </div>
               )}
               <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {brand ? brand.name : (brandId ? t("brand.title") : slug)}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {filtered.length} {t("common.productsFound")}
                  </p>
               </div>
            </div>
          </div>

          <div className="relative w-full sm:w-[360px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("brand.searchPlaceholder")}
              className="pl-9 h-10 rounded-xl"
            />
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-muted/30 p-12 text-center">
             <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-muted/50 text-muted-foreground/40">
                <PackageOpen className="h-8 w-8" />
             </div>
             <p className="font-semibold text-foreground text-xl mb-1">{t("brand.noProducts")}</p>
             <p className="max-w-xs mx-auto text-sm text-muted-foreground">{t("brand.noProductsDesc")}</p>
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
