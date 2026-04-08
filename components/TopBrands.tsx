"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import api from "@/utils/axios"
import { Brand, PaginatedResponse } from "@/types/api"
import { useLanguage } from "@/components/LanguageProvider"

export function TopBrands() {
  const { t } = useLanguage()
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
          
        setBrands(data.slice(0, 12))
      } catch (e: unknown) {
        if (cancelled) return
        setBrands([])
        setError(e instanceof Error ? e.message : t("common.error"))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [t])

  if (!isLoading && brands.length === 0) return null

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between">
        <h2 className="text-base font-semibold tracking-tight">{t("home.topBrands")}</h2>
        <Link
          href="/brands"
          className="text-sm font-medium text-muted-foreground hover:text-primary hover:underline transition-colors"
        >
          {t("home.seeAll")}
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
            ? Array.from({ length: 6 }).map((_, i) => (
                <CarouselItem
                  key={i}
                  className="basis-1/3 sm:basis-1/4 md:basis-1/6"
                >
                  <div className="flex w-full p-2 flex-col items-center rounded-md bg-card">
                    <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted animate-pulse" />
                    <div className="mt-2 h-3 w-2/3 rounded bg-muted animate-pulse mx-auto" />
                  </div>
                </CarouselItem>
              ))
            : brands.map((brand) => (
                <CarouselItem
                  key={brand.id}
                  className="basis-1/3 sm:basis-1/4 md:basis-1/6"
                >
                  <Link
                    href={`/brands/${brand.id}`}
                    className="group flex w-full p-2 flex-col items-center rounded-md bg-card transition-colors hover:bg-muted/30"
                    aria-label={brand.name}
                  >
                    <div className="flex w-full aspect-square items-center justify-center rounded-md bg-muted overflow-hidden border">
                      {brand.avatar ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={brand.avatar}
                            alt={brand.name}
                            fill
                            sizes="(max-width: 768px) 33vw, 100px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="text-xl font-bold text-muted-foreground">
                          {brand.name.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 truncate text-[11px] sm:text-xs font-medium text-center w-full">
                      {brand.name}
                    </div>
                  </Link>
                </CarouselItem>
              ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:inline-flex -left-6" />
        <CarouselNext className="hidden md:inline-flex -right-6" />
      </Carousel>
    </section>
  )
}
