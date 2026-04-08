"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { X } from "lucide-react"
import api from "@/utils/axios"
import { fixImageUrl } from "@/lib/store"

type ApiSearchProduct = {
  id: number
  name: string
  thumbnail?: string | null
  current_price?: number | null
  original_price?: string | number | null
  promo_price?: string | number | null
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

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  onSearchQueryChange: (query: string) => void
}

export function SearchDialog({ isOpen, onClose, searchQuery, onSearchQueryChange }: SearchDialogProps) {
  const [results, setResults] = React.useState<ApiSearchProduct[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!isOpen) return

    const q = searchQuery.trim()
    if (!q) {
      setResults([])
      setError(null)
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await api.get<unknown>("/products/search", {
          params: { q },
          signal: controller.signal,
        })

        const data = res.data as { products?: unknown } | unknown
        const list = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.products)
            ? (data as any).products
            : []

        setResults(list as ApiSearchProduct[])
      } catch (e: unknown) {
        // ignore aborts
        if (controller.signal.aborted) return
        setResults([])
        setError(e instanceof Error ? e.message : "Search failed")
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }, 300)

    return () => {
      controller.abort()
      window.clearTimeout(timeout)
    }
  }, [isOpen, searchQuery])

  return (
    <div
      className={`
        fixed inset-0 z-50 bg-background
        transform transition-all duration-300 ease-in-out
        ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}
      `}
    >
      {/* Header */}
      <div className="sticky max-w-7xl mx-auto top-0 bg-background border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 max-w-6xl">
            <div className="relative flex-1">
              <svg aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                type="search"
                placeholder="Search ..."
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                className="pl-10 pr-4 rounded-md py-2 w-full text-lg bg-transparent dark:bg-transparent border-muted focus-visible:ring-1"
                autoFocus
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={onClose}
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Image Search Section */}
        <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    console.log('Image selected for search:', file.name)
                  }
                }}
              />
              <label htmlFor="image-upload" className="cursor-pointer flex items-center space-x-2 hover:text-foreground">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Upload Image</span>
              </label>
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Search by image to find similar products
          </p>
        </div>
      </div>

      {/* Search Results Area */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {searchQuery ? (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Search results for: <span className="font-medium">{searchQuery}</span>
              </p>
              {error ? (
                <div className="mb-4 rounded-md border bg-card p-3 text-sm text-destructive">
                  {error}
                </div>
              ) : null}

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="aspect-square bg-muted animate-pulse rounded mb-3" />
                      <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                      <div className="mt-2 h-4 w-1/2 bg-muted animate-pulse rounded" />
                    </div>
                  ))}
                </div>
              ) : results.length === 0 ? (
                <div className="rounded-md border bg-card p-6 text-center text-sm text-muted-foreground">
                  No products found.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((p) => {
                    const original = toNumber(p.original_price)
                    const current =
                      (typeof p.current_price === "number" && Number.isFinite(p.current_price)
                        ? p.current_price
                        : null) ??
                      toNumber(p.promo_price) ??
                      original ??
                      0

                    return (
                      <a
                        key={p.id}
                        href={`/products/${p.id}`}
                        className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                        onClick={onClose}
                      >
                        <div className="relative aspect-square bg-muted rounded mb-3 overflow-hidden">
                          <Image
                            src={fixImageUrl(p.thumbnail)}
                            alt={p.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                        <h3 className="font-medium line-clamp-1">{p.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatPrice(current)}
                        </p>
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="h-12 w-12 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h2 className="text-xl font-bold mb-2">Search for products</h2>
              <p className="text-muted-foreground">Enter a search term or upload an image to find products</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
