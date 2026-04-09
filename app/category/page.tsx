"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"

import api from "@/utils/axios"
import { Category, PaginatedResponse } from "@/types/api"

import { useLanguage } from "@/components/LanguageProvider"

export default function CategoriesPage() {
  const { t } = useLanguage()
  const [categories, setCategories] = React.useState<Category[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await api.get<PaginatedResponse<Category>>("/categories")
        if (cancelled) return
        
        // Handle both paginated and non-paginated (legacy) responses
        const data = res.data && "data" in res.data 
          ? res.data.data 
          : (Array.isArray(res.data) ? res.data : [])
          
        setCategories(data)
      } catch (e: unknown) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : t("common.error"))
        setCategories([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [t])

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
            <div className="h-4 w-72 bg-muted animate-pulse rounded-md" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="group overflow-hidden rounded-md border bg-card/60"
              >
                <div className="relative aspect-square bg-muted animate-pulse" />
                <div className="p-3 flex items-center justify-between gap-2">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  <ArrowRight className="h-4 w-4 text-muted/20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{t("cat.title")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("cat.description")}
            </p>
          </div>
        </div>

        {error ? (
          <div className="rounded-md border bg-destructive/5 p-6 text-center text-sm text-destructive font-medium">
            {error}
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-md border border-dashed bg-muted/30 p-12 text-center text-sm text-muted-foreground font-medium">
            {t("common.noProductsFound")}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products/category/${cat.id}`}
                className="group overflow-hidden rounded-md border bg-card hover:bg-muted/30 transition-colors"
                aria-label={cat.name}
              >
                <div className="relative aspect-square bg-muted">
                  {cat.avatar ? (
                    <>
                      <img
                        src={cat.avatar}
                        alt={cat.name}
                        className="absolute inset-0 h-full w-full object-cover opacity-95 transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-black/15" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-3xl font-semibold text-muted-foreground">
                      {cat.name.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="p-3 flex items-center justify-between gap-2">
                  <div className="truncate text-sm font-semibold">{cat.name}</div>
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

