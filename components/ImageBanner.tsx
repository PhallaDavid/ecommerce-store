"use client"

import * as React from "react"
import api from "@/utils/axios"
import { Banner, PaginatedResponse } from "@/types/api"

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
            <div key={poster.id} className={pair.length === 1 ? "w-full" : "w-1/2"}>
              <img
                src={poster.image}
                alt={poster.title}
                className="w-full h-full object-cover rounded-md"
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