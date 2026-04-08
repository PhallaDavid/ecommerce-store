"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"

import api from "@/utils/axios"
import { Brand, PaginatedResponse } from "@/types/api"

export default function BrandsPage() {
  const [brands, setBrands] = React.useState<Brand[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await api.get<PaginatedResponse<Brand>>("/brands")
        if (cancelled) return
        
        const data = res.data && "data" in res.data 
          ? res.data.data 
          : (Array.isArray(res.data) ? res.data : [])

        setBrands(data)
      } catch (e: unknown) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : "Failed to load brands")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Brands</h1>
          <p className="text-sm text-muted-foreground">
            Pick a brand to browse products.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading brands
          </div>
        ) : error ? (
          <div className="rounded-2xl border bg-card p-6 text-center text-sm text-destructive">
            {error}
          </div>
        ) : brands.length === 0 ? (
          <div className="rounded-2xl border bg-card p-6 text-center text-sm text-muted-foreground">
            No brands found.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.id}`}
                className="group overflow-hidden rounded-2xl border bg-card hover:bg-muted/30 transition-colors"
                aria-label={brand.name}
              >
                <div className="relative aspect-16/10 bg-muted">
                  {brand.avatar ? (
                    <>
                      <img
                        src={brand.avatar}
                        alt={brand.name}
                        className="absolute inset-0 h-full w-full object-cover opacity-95 transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-black/15" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-muted-foreground">
                      {brand.name.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="p-3 flex items-center justify-between gap-2">
                  <div className="truncate text-sm font-semibold">{brand.name}</div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
