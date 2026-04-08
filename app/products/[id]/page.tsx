"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Check,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShareDialog } from "@/components/ShareDialog"
import { cn } from "@/lib/utils"
import { addToCart, getFavourites, toggleFavourite } from "@/lib/store"
import api from "@/utils/axios"

// Swiper
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Thumbs, FreeMode } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/thumbs"
import "swiper/css/free-mode"

// Simple Accordion Component
function Accordion({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className="border-b last:border-b-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-sm font-medium transition-all hover:text-primary"
      >
        <span>{title}</span>
        <Plus className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isOpen && "rotate-45")} />
      </button>
      <div className={cn("overflow-hidden text-sm transition-all duration-300 ease-in-out", isOpen ? "max-h-96 pb-4 opacity-100" : "max-h-0 opacity-0")}>
        <div className="text-muted-foreground leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}

const similarProducts = [
  {
    id: "p1",
    name: "Classic Tee",
    href: "/products/p1",
    image: "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/Homepage%20Collections/Category%20Highlight/MAR26-WEB%20Homepage_WOMEN_Tops.jpg",
    price: 29.99,
  },
  {
    id: "p2",
    name: "Street Hoodie",
    href: "/products/p2",
    image: "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/Homepage%20Collections/Category%20Highlight/MAR26-WEB%20Homepage_WOMEN_Tops.jpg",
    price: 49.0,
  },
  {
    id: "p3",
    name: "Everyday Sneakers",
    href: "/products/p3",
    image: "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/Homepage%20Collections/Category%20Highlight/MAR26-WEB%20Homepage_WOMEN_Tops.jpg",
    price: 79.0,
  },
  {
    id: "p4",
    name: "Minimal Watch",
    href: "/products/p4",
    image: "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/Homepage%20Collections/Category%20Highlight/MAR26-WEB%20Homepage_WOMEN_Tops.jpg",
    price: 119.0,
  },
]

type ApiVariant = {
  id: number
  sku: string | null
  color: string | null
  size: string | null
  stock: number | null
  variant_image: string | null
  original_price: string | number | null
  promo_price: string | number | null
  promo_start: string | null
  promo_end: string | null
}

type ApiGalleryItem = {
  id: number
  image_url: string
}

type ApiProductDetail = {
  id: number
  name: string
  description: string | null
  original_price: string | number | null
  promo_price: string | number | null
  promo_start: string | null
  promo_end: string | null
  thumbnail: string | null
  status: string | null
  created_at: string | null
  current_price: number | null
  is_on_sale: boolean | null
  variants: ApiVariant[] | null
  gallery: ApiGalleryItem[] | null
}

type ProductVM = {
  id: string
  name: string
  description: string
  price: number
  compareAt?: number
  images: string[]
  colors: Array<{ name: string; image: string }>
  sizes: string[]
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

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <div className="space-y-3">
        <div className="relative aspect-[3/4] overflow-hidden rounded-md border bg-muted/60 animate-pulse" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="relative aspect-[3/4] overflow-hidden rounded-md border bg-muted/60 animate-pulse"
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col space-y-8">
        <div className="space-y-4">
          <div className="h-8 w-3/4 rounded bg-muted/60 animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="h-7 w-28 rounded bg-muted/60 animate-pulse" />
            <div className="h-5 w-20 rounded bg-muted/60 animate-pulse" />
            <div className="h-6 w-24 rounded bg-muted/60 animate-pulse" />
          </div>
        </div>

        <div className="h-px w-full bg-border" />

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-16 rounded bg-muted/60 animate-pulse" />
              <div className="h-4 w-20 rounded bg-muted/60 animate-pulse" />
            </div>
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square w-20 rounded-md border bg-muted/60 animate-pulse"
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-muted/60 animate-pulse" />
              <div className="h-4 w-20 rounded bg-muted/60 animate-pulse" />
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 w-10 rounded-md border bg-muted/60 animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="h-10 flex-1 rounded-md border bg-muted/60 animate-pulse" />
          <div className="h-10 w-10 rounded-md border bg-muted/60 animate-pulse" />
          <div className="h-10 w-10 rounded-md border bg-muted/60 animate-pulse" />
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 sm:divide-x">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center space-y-2"
            >
              <div className="h-5 w-5 rounded bg-muted/60 animate-pulse" />
              <div className="h-3 w-20 rounded bg-muted/60 animate-pulse" />
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 w-full rounded border bg-muted/60 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState("")
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [isFav, setIsFav] = useState(false)
  const [product, setProduct] = useState<ProductVM | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Custom nav refs — product gallery
  const galleryPrevRef = useRef<HTMLButtonElement>(null)
  const galleryNextRef = useRef<HTMLButtonElement>(null)

  // Custom nav refs — similar products
  const similarPrevRef = useRef<HTMLButtonElement>(null)
  const similarNextRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const favs = getFavourites()
    setIsFav(favs.some((f) => f.id === id))
  }, [id])

	  useEffect(() => {
	    let cancelled = false
	    ;(async () => {
	      setIsLoading(true)
	      setError(null)
        setProduct(null)
        setSelectedColor("")
        setSelectedSize(null)
	      try {
	        const res = await api.get<ApiProductDetail>(`/products/detail/${id}`)
	        const raw = res.data

        const baseImages: string[] = []
        if (raw.thumbnail) baseImages.push(raw.thumbnail)
        for (const g of raw.gallery ?? []) {
          if (g?.image_url) baseImages.push(g.image_url)
        }
        const images = Array.from(new Set(baseImages.filter(Boolean)))
        const safeImages = images.length ? images : [FALLBACK_IMG]

        const original = toNumber(raw.original_price)
        const current =
          (typeof raw.current_price === "number" && Number.isFinite(raw.current_price)
            ? raw.current_price
            : null) ??
          toNumber(raw.promo_price) ??
          original ??
          0

        const compareAt =
          original != null && original > current ? original : undefined

        const variants = Array.isArray(raw.variants) ? raw.variants : []
        const sizes = Array.from(
          new Set(variants.map((v) => v.size).filter((x): x is string => !!x))
        )

        const colorMap = new Map<string, string>()
        for (const v of variants) {
          if (!v.color) continue
          if (!colorMap.has(v.color)) {
            colorMap.set(v.color, v.variant_image || raw.thumbnail || safeImages[0])
          }
        }
        const colors = Array.from(colorMap.entries()).map(([name, image]) => ({
          name,
          image,
        }))

        const vm: ProductVM = {
          id: String(raw.id),
          name: raw.name,
          description: raw.description || "",
          price: current,
          compareAt,
          images: safeImages,
          colors,
          sizes,
        }

        if (cancelled) return
        setProduct(vm)
        if (!selectedColor && vm.colors.length) setSelectedColor(vm.colors[0].name)
        if (!selectedSize && vm.sizes.length) setSelectedSize(vm.sizes[0])
      } catch (e: unknown) {
        if (cancelled) return
        setProduct(null)
        setError(e instanceof Error ? e.message : "Failed to load product")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <>
      <style>{`
        /* ── Thumb swiper ── */
        .thumb-swiper .swiper-slide { opacity: .55; cursor: pointer; border-radius: 8px; overflow: hidden; border: 2px solid transparent; transition: opacity .2s, border-color .2s; }
        .thumb-swiper .swiper-slide-thumb-active { opacity: 1; border-color: var(--primary); }
        /* hide Swiper's own nav everywhere since we use custom buttons */
        .swiper-button-prev, .swiper-button-next { display: none !important; }
      `}</style>

	      <div className="min-h-screen bg-background">
	        <div className="container mx-auto px-4 py-8 lg:px-8">
	          {/* Breadcrumb */}
	          <nav className="mb-8 flex items-center space-x-2 text-sm font-medium text-muted-foreground">
	            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
	            <ChevronRight className="h-4 w-4" />
	            <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
	            <ChevronRight className="h-4 w-4" />
	            <span className="text-foreground truncate max-w-[200px]">{product?.name || "Product"}</span>
	          </nav>

            {error ? (
              <div className="rounded-md border bg-card p-4 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            {isLoading || !product ? (
              <ProductDetailSkeleton />
            ) : (
	          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">

	            {/* ── Left: Product Images ── */}
	            <div className="space-y-3">
              {/* Main gallery */}
              <div className="relative">
                <Swiper
                  className="w-full rounded-md overflow-hidden"
                  modules={[Navigation, Pagination, Thumbs]}
                  navigation={{ prevEl: galleryPrevRef.current, nextEl: galleryNextRef.current }}
                  onBeforeInit={(swiper) => {
                    if (typeof swiper.params.navigation === 'object' && swiper.params.navigation) {
                      swiper.params.navigation.prevEl = galleryPrevRef.current
                      swiper.params.navigation.nextEl = galleryNextRef.current
                    }
                  }}
                  pagination={{ clickable: true, dynamicBullets: true }}
	                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
	                  loop={product.images.length > 1}
	                >
	                  {product.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="group relative aspect-3/4 overflow-hidden bg-muted">
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Custom prev/next — lucide icons */}
                <button
                  ref={galleryPrevRef}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90  hover:bg-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-800" />
                </button>
                <button
                  ref={galleryNextRef}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90  hover:bg-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5 text-gray-800" />
                </button>
              </div>

	              {/* Thumbnails */}
	              <Swiper
                className="thumb-swiper w-full"
                modules={[Thumbs, FreeMode]}
                onSwiper={setThumbsSwiper}
                slidesPerView={4}
                spaceBetween={10}
                freeMode
                watchSlidesProgress
              >
	                {product.images.map((img, i) => (
                  <SwiperSlide key={i}>
                    <div className="aspect-3/4 overflow-hidden">
                      <img src={img} alt={`thumb ${i + 1}`} className="h-full w-full object-cover" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

	            {/* ── Right: Product Details ── */}
	            <div className="flex flex-col space-y-8">
	              <div className="space-y-4">
	                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-3xl">
	                  {product.name}
	                </h1>
	                
	                <div className="flex flex-wrap items-baseline items-center gap-x-4 gap-y-2">
	                  <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
	                  {product.compareAt ? (
	                    <span className="text-lg text-muted-foreground line-through">
	                      {formatPrice(product.compareAt)}
	                    </span>
	                  ) : null}
	                  {product.compareAt ? (
	                    <Badge variant="destructive" className="rounded-sm text-white">
	                      SAVE{" "}
	                      {Math.round(((product.compareAt - product.price) / product.compareAt) * 100)}%
	                    </Badge>
	                  ) : null}
	                </div>
	              </div>

              <Separator />

	              {/* Selection Options */}
	              {(product.colors.length || product.sizes.length) ? (
	              <div className="space-y-6">
	                {/* Color Selection */}
	                {product.colors.length ? (
	                <div className="space-y-3">
	                  <div className="flex items-center justify-between">
	                    <h3 className="text-sm font-semibold uppercase tracking-wide">Color</h3>
	                    <span className="text-sm text-muted-foreground">{selectedColor}</span>
	                  </div>
		                  <div className="flex flex-wrap gap-3">
		                    {product.colors.map((color) => (
		                      <button
		                        key={color.name}
		                        onClick={() => setSelectedColor(color.name)}
		                        className={cn(
		                          "group relative aspect-square w-20 overflow-hidden rounded-md border-2 transition-all",
		                          selectedColor === color.name
		                            ? "border-primary scale-105"
		                            : "border-transparent opacity-80 hover:opacity-100"
		                        )}
		                      >
		                        <img
		                          src={color.image}
		                          alt={color.name}
		                          className="h-full w-full object-cover"
		                        />
		                        <div className="absolute inset-x-0 bottom-0 bg-black/40 py-1 text-center">
		                          <span className="text-[10px] text-white font-medium">
		                            {color.name}
		                          </span>
		                        </div>
		                        {selectedColor === color.name ? (
		                          <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
		                            <Check className="h-2 w-2 text-white" />
		                          </div>
		                        ) : null}
		                      </button>
		                    ))}
		                  </div>
	                </div>
                  ) : null}

	                {/* Size Selection */}
	                {product.sizes.length ? (
	                <div className="space-y-3">
	                  <div className="flex items-center justify-between">
	                    <h3 className="text-sm font-semibold uppercase tracking-wide">Select Size</h3>
	                    <button className="text-xs font-medium text-primary hover:underline">Size Guide</button>
	                  </div>
	                  <div className="flex flex-wrap gap-2">
	                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "flex h-10 w-10 max-w-[80px] items-center justify-center rounded-md border text-sm font-medium transition-all hover:border-primary",
                          selectedSize === size 
                            ? "border-primary bg-primary/5 text-primary  ring-1 ring-primary"
                            : "bg-card text-muted-foreground"
                        )}
                      >
                        {size}
                      </button>
	                    ))}
	                  </div>
	                </div>
                  ) : null}
	              </div>
                ) : null}

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1 bg-primary hover:bg-primary/90 h-10 text-lg"
	                  onClick={() => {
	                    addToCart(
	                      {
	                        id,
	                        name: product.name,
	                        href: `/products/${id}`,
	                        image: product.images[0] ?? "",
	                        price: product.price,
	                      },
                      1
                    )
                  }}
                >
                  ADD TO CART
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-md border"
                  aria-label="Add to favourites"
                  onClick={() => {
                    toggleFavourite({
                      id,
                      name: product.name,
                      href: `/products/${id}`,
                      image: product.images[0] ?? "",
                      price: product.price,
                    })
                    setIsFav((v) => !v)
                  }}
                >
                  <Heart className={isFav ? "h-6 w-6 fill-primary text-primary" : "h-6 w-6"} />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-md border"
                  onClick={() => setShareOpen(true)}
                  aria-label="Share"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              <ShareDialog open={shareOpen} onOpenChange={setShareOpen} />

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 py-4 sm:divide-x">
                <div className="flex flex-col items-center text-center space-y-1">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <span className="text-[10px] font-medium uppercase text-muted-foreground">Fast Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-1">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground" /> 
                  <span className="text-[10px] font-medium uppercase text-muted-foreground">Secure Pay</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-1">
                  <RotateCcw className="h-5 w-5 text-muted-foreground" />
                  <span className="text-[10px] font-medium uppercase text-muted-foreground">Easy Returns</span>
                </div>
              </div>

              {/* Accordions */}
              <div className="space-y-1 pt-4">
	                <Accordion title="About the Product" defaultOpen>
	                  {product.description || "No description provided for this product yet."}
	                </Accordion>
                <Accordion title="Shipping & Returns">
                  We offer free standard shipping on all orders over $50. Standard delivery typically takes 3-5 business days. If you're not completely satisfied with your purchase, it can be returned within 30 days of receipt, provided the items remain in their original condition.
                </Accordion>
                <Accordion title="Care Instructions">
                  Machine wash cold with like colors. Do not bleach. Tumble dry low. Iron on low heat if necessary. Do not dry clean.
                </Accordion>
		          </div>
		        </div>
		      </div>
	            )}
	          {/* ── Similar Products ── */}
	          <section className="mt-20 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Similar Products</h2>
              <Link href="/products" className="text-sm font-medium text-primary hover:underline">View All</Link>
            </div>

            <div className="relative">
              <Swiper
                modules={[Navigation]}
                navigation={{ prevEl: similarPrevRef.current, nextEl: similarNextRef.current }}
                onBeforeInit={(swiper) => {
                  if (typeof swiper.params.navigation === 'object' && swiper.params.navigation) {
                    swiper.params.navigation.prevEl = similarPrevRef.current
                    swiper.params.navigation.nextEl = similarNextRef.current
                  }
                }}
                spaceBetween={16}
                breakpoints={{
                  0:   { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024:{ slidesPerView: 4 },
                }}
              >
                {similarProducts.map((p) => (
                  <SwiperSlide key={p.id}>
                    <Link href={p.href} className="group block">
                      <div className="relative aspect-3/4 overflow-hidden rounded-md border bg-muted">
                        <img 
                          src={p.image} 
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-3 space-y-1">
                        <h3 className="text-sm font-medium group-hover:text-primary transition-colors">{p.name}</h3>
                        <p className="text-sm font-bold">${p.price}</p>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom prev/next — lucide icons */}
              <button
                ref={similarPrevRef}
                className="absolute -left-5 top-[35%] -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white  hover:bg-gray-50 transition-colors border"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5 text-gray-800" />
              </button>
              <button
                ref={similarNextRef}
                className="absolute -right-5 top-[35%] -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white  hover:bg-gray-50 transition-colors border"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5 text-gray-800" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
