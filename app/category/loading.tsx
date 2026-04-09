import * as React from "react"
import { ArrowRight } from "lucide-react"

export default function Loading() {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
          <div className="h-4 w-72 bg-muted animate-pulse rounded-md" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
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
