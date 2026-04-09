import * as React from "react"
import { ChevronRight, Search } from "lucide-react"
import { ProductCardSkeleton } from "@/components/ProductCard"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:px-8 space-y-6">
        {/* Breadcrumb Skeleton */}
        <nav className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
          <div className="h-4 w-10 bg-muted animate-pulse rounded" />
          <ChevronRight className="h-4 w-4 text-muted/40" />
          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          <ChevronRight className="h-4 w-4 text-muted/40" />
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
        </nav>

        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          </div>

          <div className="relative w-full sm:w-[360px]">
             <div className="h-10 w-full bg-muted animate-pulse rounded-xl" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
