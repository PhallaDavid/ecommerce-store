"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn, formatPrice } from "@/lib/utils"
import { addToCart, getFavourites, isFavourite, subscribeStore, toggleFavourite } from "@/lib/store"

export type ProductCardProps = {
  id: string
  name: string
  href: string
  image: string
  price: number
  compareAt?: number
  showAddToCart?: boolean
  className?: string
}

export function ProductCard({
  id,
  name,
  href,
  image,
  price,
  compareAt,
  showAddToCart = true,
  className,
}: ProductCardProps) {
  const [isFav, setIsFav] = React.useState(false)
  const [isAdded, setIsAdded] = React.useState(false)

  React.useEffect(() => {
    setIsFav(isFavourite(id))
    return subscribeStore(() => {
      setIsFav(isFavourite(id))
    })
  }, [id])

  const discountPercent =
    compareAt && compareAt > price
      ? Math.round(((compareAt - price) / compareAt) * 100)
      : 0

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-lg">
      <Link href={href} className={cn("relative block aspect-4/5 overflow-hidden", className)}>
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {discountPercent > 0 && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Action Buttons (Floating) */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 translate-x-12 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            className={cn(
              "rounded-full bg-background/90 backdrop-blur-sm border shadow-sm transition-colors hover:bg-background",
              isFav && "text-primary border-primary/20"
            )}
            aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleFavourite({ id, name, href, image, price, compareAt })
            }}
          >
            <Heart className={cn("h-4 w-4", isFav && "fill-current")} />
          </Button>

          {showAddToCart && (
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              className={cn(
                "rounded-full bg-background/90 backdrop-blur-sm border shadow-sm transition-colors hover:bg-background",
                isAdded && "text-primary border-primary/20"
              )}
              aria-label={isAdded ? "Added to cart" : "Add to cart"}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                addToCart({ id, name, href, image, price }, 1)
                setIsAdded(true)
                setTimeout(() => setIsAdded(false), 2000)
              }}
            >
              {isAdded ? (
                <span className="text-[10px] font-bold">✓</span>
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={href}>
          <h3 className="line-clamp-2 text-sm font-medium transition-colors hover:text-primary">
            {name}
          </h3>
        </Link>
        
        <div className="mt-auto pt-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-primary">
              {formatPrice(price)}
            </span>
            {compareAt && compareAt > price && (
              <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/50">
                {formatPrice(compareAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm", className)}>
      <Skeleton className="aspect-4/5 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="pt-2 flex items-center gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  )
}
