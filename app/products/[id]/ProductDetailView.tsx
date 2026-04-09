"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus,
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
import { addToCart, getFavourites, toggleFavourite, fixImageUrl } from "@/lib/store"
import api from "@/utils/axios"
import { useLanguage } from "@/components/LanguageProvider"

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

type SimilarProduct = {
  id: string
  name: string
  href: string
  image: string
  price: number
}

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
  category_id: number | null
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
  category_id: number | null
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
        <div className="relative aspect-3/4 overflow-hidden rounded-md border bg-muted/60 animate-pulse" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="relative aspect-3/4 overflow-hidden rounded-md border bg-muted/60 animate-pulse"
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

export function ProductDetailView({ id, initialProduct }: { id: string, initialProduct?: ProductVM | null }) {
  const { t } = useLanguage()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [isFav, setIsFav] = useState(false)
  const [product, setProduct] = useState<ProductVM | null>(initialProduct || null)
  const [isLoading, setIsLoading] = useState(!initialProduct)
  const [error, setError] = useState<string | null>(null)
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([])
  const [isSimilarLoading, setIsSimilarLoading] = useState(false)

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

  // Fetch current product details if not provided via initialProduct
  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct)
      if (initialProduct.colors.length) setSelectedColor(initialProduct.colors[0].name)
      if (initialProduct.sizes.length) setSelectedSize(initialProduct.sizes[0])
      return
    }

    let cancelled = false
    ;(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await api.get<ApiProductDetail>(`/products/detail/${id}`)
        const raw = res.data

        const baseImages: string[] = []
        if (raw.thumbnail) baseImages.push(fixImageUrl(raw.thumbnail))
        for (const g of raw.gallery ?? []) {
          if (g?.image_url) baseImages.push(fixImageUrl(g.image_url))
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

        const compareAt = original != null && original > current ? original : undefined
        const variants = Array.isArray(raw.variants) ? raw.variants : []
        const sizes = Array.from(new Set(variants.map((v) => v.size).filter((x): x is string => !!x)))

        const colorMap = new Map<string, string>()
        for (const v of variants) {
          if (!v.color) continue
          if (!colorMap.has(v.color)) {
            const vImg = fixImageUrl(v.variant_image || raw.thumbnail || safeImages[0])
            colorMap.set(v.color, vImg)
          }
        }
        const colors = Array.from(colorMap.entries()).map(([name, image]) => ({ name, image }))

        const vm: ProductVM = {
          id: String(raw.id),
          name: raw.name,
          description: raw.description || "",
          price: current,
          compareAt,
          images: safeImages,
          colors,
          sizes,
          category_id: raw.category_id,
        }

        if (cancelled) return
        setProduct(vm)
        if (!selectedColor && vm.colors.length) setSelectedColor(vm.colors[0].name)
        if (!selectedSize && vm.sizes.length) setSelectedSize(vm.sizes[0])
      } catch (e: unknown) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : "Failed to load product")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [id, initialProduct])

  // Separate useEffect for Similar Products
  useEffect(() => {
    if (!product?.category_id) return

    let cancelled = false
    setIsSimilarLoading(true)
    
    api.get(`/products/category/${product.category_id}`)
      .then(sRes => {
        if (cancelled) return
        const sData = sRes.data && typeof sRes.data === 'object' && 'data' in sRes.data
          ? sRes.data.data
          : (Array.isArray(sRes.data) ? sRes.data : [])

        const mapped: SimilarProduct[] = sData
          .filter((p: any) => String(p.id) !== String(id))
          .map((p: any) => ({
            id: String(p.id),
            name: p.name,
            href: `/products/${p.id}`,
            image: fixImageUrl(p.thumbnail),
            price: typeof p.current_price === "number" ? p.current_price : Number(p.promo_price || p.original_price || 0)
          }))
          .slice(0, 8)

        setSimilarProducts(mapped)
      })
      .catch(err => {
        if (!cancelled) console.error("Failed to fetch similar products:", err)
      })
      .finally(() => {
        if (!cancelled) setIsSimilarLoading(false)
      })

    return () => { cancelled = true }
  }, [id, product?.category_id])

  if (isLoading && !product) {
    return (
      <div className="container mx-auto px-4 py-8 lg:px-8">
        <ProductDetailSkeleton />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 lg:px-8">
        <div className="rounded-md border bg-card p-4 text-sm text-destructive">
          {error || t("common.error")}
        </div>
      </div>
    )
  }

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
            <Link href="/" className="hover:text-primary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/products" className="hover:text-primary transition-colors">{t("nav.categories")}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">

            {/* ── Left: Product Images ── */}
            <div className="space-y-3">
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

                <button
                  ref={galleryPrevRef}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 hover:bg-white transition-colors border shadow-sm"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-800" />
                </button>
                <button
                  ref={galleryNextRef}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 hover:bg-white transition-colors border shadow-sm"
                >
                  <ChevronRight className="h-5 w-5 text-gray-800" />
                </button>
              </div>

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

            {/* ── Right: Details ── */}
            <div className="flex flex-col space-y-8">
              <div className="space-y-4">
                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {product.name}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
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

              {/* Selection */}
              {(product.colors.length > 0 || product.sizes.length > 0) && (
                <div className="space-y-6">
                  {product.colors.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold uppercase tracking-wide">{t("product.color")}: {selectedColor}</h3>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {product.colors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => setSelectedColor(color.name)}
                            className={cn(
                              "group relative aspect-square w-20 overflow-hidden rounded-md border-2 transition-all",
                              selectedColor === color.name ? "border-primary scale-105" : "border-transparent opacity-80 hover:opacity-100"
                            )}
                          >
                            <img src={color.image} alt={color.name} className="h-full w-full object-cover" />
                             <div className="absolute inset-x-0 bottom-0 bg-black/40 py-1 text-center">
                                <span className="text-[10px] text-white font-medium">{color.name}</span>
                             </div>
                             {selectedColor === color.name && (
                               <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
                                 <Check className="h-2 w-2 text-white" />
                               </div>
                             )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.sizes.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold uppercase tracking-wide">{t("product.selectSize")}</h3>
                        <button className="text-xs font-medium text-primary hover:underline">{t("product.sizeGuide")}</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-md border text-sm font-medium transition-all hover:border-primary",
                              selectedSize === size ? "border-primary bg-primary/5 text-primary ring-1 ring-primary" : "bg-card text-muted-foreground"
                            )}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide">{t("order.qty")}</h3>
                <div className="flex h-11 w-32 items-center justify-between rounded-md border bg-card">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-full w-10 items-center justify-center transition-colors hover:text-primary disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-semibold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-full w-10 items-center justify-center transition-colors hover:text-primary"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="flex-1 bg-primary hover:bg-primary/90 h-12 text-lg font-bold" 
                  onClick={() => addToCart({ 
                    id, 
                    name: product.name, 
                    href: `/products/${id}`, 
                    image: product.images[0] ?? "", 
                    price: product.price,
                    color: selectedColor,
                    size: selectedSize || undefined
                  }, quantity)}
                >
                  {t("cart.addToCart")}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-12 w-12 rounded-md border" 
                  onClick={() => { 
                    toggleFavourite({ 
                      id, 
                      name: product.name, 
                      href: `/products/${id}`, 
                      image: product.images[0] ?? "", 
                      price: product.price 
                    }); 
                    setIsFav(!isFav) 
                  }}
                >
                  <Heart className={isFav ? "h-6 w-6 fill-primary text-primary" : "h-6 w-6"} />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-md border" onClick={() => setShareOpen(true)}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              <ShareDialog open={shareOpen} onOpenChange={setShareOpen} />

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 py-4 sm:divide-x border-y">
                <div className="flex flex-col items-center text-center space-y-1">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <span className="text-[10px] font-medium uppercase text-muted-foreground">{t("product.fastShipping")}</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-1">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground" /> 
                  <span className="text-[10px] font-medium uppercase text-muted-foreground">{t("product.securePay")}</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-1">
                  <RotateCcw className="h-5 w-5 text-muted-foreground" />
                  <span className="text-[10px] font-medium uppercase text-muted-foreground">{t("product.easyReturns")}</span>
                </div>
              </div>

              {/* Accordions */}
              <div className="space-y-1">
                <Accordion title={t("product.about")} defaultOpen>
                  {product.description || t("product.noDescription")}
                </Accordion>
                <Accordion title={t("product.shippingReturns")}>
                  {t("product.shippingDesc")}
                </Accordion>
                <Accordion title={t("product.care")}>
                  {t("product.careDesc")}
                </Accordion>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          <section className="mt-20 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">{t("product.similar")}</h2>
              <Link href="/products" className="text-sm font-medium text-primary hover:underline">{t("nav.viewAll")}</Link>
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
                breakpoints={{ 0: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }}
              >
                {isSimilarLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <SwiperSlide key={i}>
                      <div className="space-y-3">
                         <div className="aspect-3/4 rounded-md bg-muted animate-pulse" />
                         <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                         <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
                      </div>
                    </SwiperSlide>
                  ))
                ) : similarProducts.length === 0 ? (
                  <div className="col-span-full py-10 text-center text-muted-foreground">{t("cat.noProducts")}</div>
                ) : (
                  similarProducts.map((p) => (
                    <SwiperSlide key={p.id}>
                      <Link href={p.href} className="group block">
                        <div className="relative aspect-3/4 overflow-hidden rounded-md border bg-muted">
                          <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div className="mt-3 space-y-1">
                          <h3 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">{p.name}</h3>
                          <p className="text-sm font-bold">{formatPrice(p.price)}</p>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))
                )}
              </Swiper>
              <button ref={similarPrevRef} className="absolute -left-5 top-[35%] -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white hover:bg-gray-50 transition-colors border shadow-sm">
                <ChevronLeft className="h-5 w-5 text-gray-800" />
              </button>
              <button ref={similarNextRef} className="absolute -right-5 top-[35%] -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white hover:bg-gray-50 transition-colors border shadow-sm">
                <ChevronRight className="h-5 w-5 text-gray-800" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
