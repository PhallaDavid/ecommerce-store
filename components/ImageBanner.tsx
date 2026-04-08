"use client"

import * as React from "react"
import Image from "next/image"
import api from "@/utils/axios"
import { Banner, PaginatedResponse } from "@/types/api"
import { cn } from "@/lib/utils"

export function ImageBanners() {
  const [posters, setPosters] = React.useState<Banner[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await api.get<PaginatedResponse<Banner>>("/posters")
        if (cancelled) return
        
        const data = res.data && "data" in res.data 
          ? res.data.data 
          : (Array.isArray(res.data) ? res.data : [])
          
        setPosters(data.filter(p => p.status === "active"))
      } catch (e: unknown) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : "Failed to load posters")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (isLoading) {
    return (
      <section className="w-full space-y-4 animate-pulse">
        <div className="flex w-full gap-4 h-48 sm:h-64 lg:h-80">
          <div className="w-1/2 h-full bg-muted rounded-md" />
          <div className="w-1/2 h-full bg-muted rounded-md" />
        </div>
        <div className="flex w-full gap-4 h-48 sm:h-64 lg:h-80">
          <div className="w-1/2 h-full bg-muted rounded-md" />
          <div className="w-1/2 h-full bg-muted rounded-md" />
        </div>
      </section>
    )
  }

  if (error || posters.length === 0) {
    return null
  }

  // Group posters into pairs for the layout
  const pairs: Banner[][] = []
  for (let i = 0; i < posters.length; i += 2) {
    pairs.push(posters.slice(i, i + 2))
  }

  return (
    <section className="w-full space-y-4">
      {pairs.map((pair, idx) => (
        <div key={idx} className="flex w-full gap-4">
          {pair.map((poster) => (
            <div key={poster.id} className={cn("relative overflow-hidden rounded-md", pair.length === 1 ? "w-full aspect-21/9" : "w-1/2 aspect-16/10")}>
              <Image
                src={poster.image}
                alt={poster.title || "Promotion Banner"}
                fill
                priority={idx === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ))}
    </section>
  )
}

export function ImageBanner() {
  return <ImageBanners />
}