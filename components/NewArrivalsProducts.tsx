"use client"

import * as React from "react"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { addToCart, getFavourites, isFavourite, subscribeStore, toggleFavourite } from "@/lib/store"

const products = [
  {
    id: "p1",
    name: "Classic Tee",
    href: "/products/p1",
    image: "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/Homepage%20Collections/Category%20Highlight/MAR26-WEB%20Homepage_WOMEN_Tops.jpg",
    price: 29.99,
    compareAt: 39.99,
  },
  {
    id: "p2",
    name: "Street Hoodie",
    href: "/products/p2",
    image: "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/Homepage%20Collections/Category%20Highlight/MAR26-WEB%20Homepage_WOMEN_Tops.jpg",
    price: 49.0,
    compareAt: 69.0,
  },
  {
    id: "p3",
    name: "Everyday Sneakers",
    href: "/products/p3",
    image: "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/Homepage%20Collections/Category%20Highlight/MAR26-WEB%20Homepage_WOMEN_Tops.jpg",
    price: 79.0,
    compareAt: 99.0,
  },
  {
    id: "p4",
    name: "Minimal Watch",
    href: "/products/p4",
    image: "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/Homepage%20Collections/Category%20Highlight/MAR26-WEB%20Homepage_WOMEN_Tops.jpg",
    price: 119.0,
    compareAt: 149.0,
  },
  {
    id: "p5",
    name: "Wireless Headphones",
    href: "/products/p5",
    image: "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/Homepage%20Collections/Category%20Highlight/MAR26-WEB%20Homepage_WOMEN_Tops.jpg",
    price: 89.0,
    compareAt: 109.0,
  },
  {
    id: "p6",
    name: "Smartphone Case",
    href: "/products/p6",
    image: "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/Homepage%20Collections/Category%20Highlight/MAR26-WEB%20Homepage_WOMEN_Tops.jpg",
    price: 15.0,
    compareAt: 25.0,
  },
] as const

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value)
}

export function NewArrivalsProducts() {
  const [favs, setFavs] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    setFavs(
      Object.fromEntries(products.map((p) => [p.id, isFavourite(p.id)]))
    )
    return subscribeStore(() => {
      const favSet = new Set(getFavourites().map((f) => f.id))
      setFavs(Object.fromEntries(products.map((p) => [p.id, favSet.has(p.id)])))
    })
  }, [])

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between">
        <h2 className="text-base font-semibold tracking-tight">New Arrivals</h2>
        <Link
          href="/?sort=new"
          className="text-sm font-medium text-muted-foreground hover:text-primary hover:underline transition-colors"
        >
          Shop Now
        </Link>
      </div>

      <Carousel
        className="w-full"
        opts={{ align: "start", dragFree: true, containScroll: "trimSnaps" }}
      >
        <CarouselContent>
          {products.map((product) => {
            const discountPercent =
              product.compareAt > product.price
                ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
                : 0

            return (
              <CarouselItem
                key={product.id}
                className="basis-1/2 sm:basis-1/3 lg:basis-1/4"
              >
                <Link
                  href={product.href}
                  className="group block overflow-hidden rounded-md bg-card transition-colors"
                >
                  <div className="relative">
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover rounded-md transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>

                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    className="absolute right-3 top-3 rounded-full bg-background/85 backdrop-blur border cursor-pointer hover:bg-background"
                    aria-label="Add to wishlist"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleFavourite({
                        id: product.id,
                        name: product.name,
                        href: product.href,
                        image: product.image,
                        price: product.price,
                        compareAt: product.compareAt,
                      })
                      setFavs((prev) => ({ ...prev, [product.id]: !prev[product.id] }))
                    }}
                  >
                    <Heart className={favs[product.id] ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4"} />
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    className="absolute right-3 top-14 rounded-full bg-background/85 backdrop-blur border cursor-pointer hover:bg-background"
                    aria-label="Add to cart"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      addToCart(
                        {
                          id: product.id,
                          name: product.name,
                          href: product.href,
                          image: product.image,
                          price: product.price,
                        },
                        1
                      )
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>

                  <div className="p-3">
                    <div className="truncate text-sm font-semibold">{product.name}</div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        {discountPercent > 0 ? (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                            -{discountPercent}%
                          </span>
                        ) : null}
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.compareAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            )
          })}
        </CarouselContent>

        <CarouselPrevious className="hidden md:inline-flex -left-6" />
        <CarouselNext className="hidden md:inline-flex -right-6" />
      </Carousel>
    </section>
  )
}
