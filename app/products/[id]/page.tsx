"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Plus, 
  Minus,
  Check,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw
} from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Simple Accordion Component since it's not in UI directory
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

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState("White")
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  
  const product = {
    name: "Classic Halter Twist Top",
    price: 8.95,
    description: "A-line skirt with twist halter top. Premium quality fabric with elegant design.",
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Black", image: "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/Homepage%20Collections/Category%20Highlight/MAR26-WEB%20Homepage_WOMEN_Tops.jpg" },
      { name: "White", image: "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/Homepage%20Collections/Category%20Highlight/MAR26-WEB%20Homepage_WOMEN_Tops.jpg" },
    ],
    images: [
      "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/Homepage%20Collections/Category%20Highlight/MAR26-WEB%20Homepage_WOMEN_Tops.jpg",
      "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/banner/2026/TEN11/Mar/KNY%20Sale/MAR26-CatFeed%20-Women-BestSellers-WEB%20HP.jpg",
      "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/banner/2026/TEN11/Mar/KNY%20Sale/MAR26-CatFeed%20-Women-BestSellers-WEB%20HP.jpg",
    ]
  }

  useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center space-x-2 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          
          {/* Left: Product Images */}
          <div className="space-y-4">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="group relative aspect-3/4 overflow-hidden rounded-md border bg-muted">
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className=" md:flex hidden left-4" />
              <CarouselNext className=" md:flex hidden right-4" />
              
              {/* Image Indicators */}
              <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 space-x-2">
                {product.images.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => api?.scrollTo(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      current === i ? "w-6 bg-white" : "w-1.5 bg-white/50"
                    )}
                  />
                ))}
              </div>
            </Carousel>
            
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  className={cn(
                    "relative aspect-3/4 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                    current === i ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-4xl">
                {product.name}
              </h1>
              
              <div className="flex items-baseline space-x-4">
                <span className="text-3xl font-bold text-primary">${product.price}</span>
                <span className="text-lg text-muted-foreground line-through">$12.50</span>
                <Badge variant="destructive" className="rounded-sm">SAVE 30%</Badge>
              </div>
            </div>

            <Separator />

            {/* Selection Options */}
            <div className="space-y-6">
              {/* Color Selection */}
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
                        selectedColor === color.name ? "border-primary scale-105" : "border-transparent opacity-80 hover:opacity-100"
                      )}
                    >
                      <img src={color.image} className="h-full w-full object-cover" />
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

              {/* Size Selection */}
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
                        "flex h-12 w-full max-w-[80px] items-center justify-center rounded-md border text-sm font-medium transition-all hover:border-primary",
                        selectedSize === size 
                          ? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary"
                          : "bg-card text-muted-foreground"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button size="lg" className="flex-1 bg-black hover:bg-black h-12 text-lg">
                ADD TO CART
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-md border-2">
                <Heart className="h-6 w-6" />
              </Button>
            </div>

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

            {/* Additional Info */}
            <div className="space-y-1 pt-4">
              <Accordion title="About the Product" defaultOpen>
                This classic halter twist top is designed for both comfort and style. Made from a lightweight, breathable blend of cotton and spandex, it offers a soft feel with just the right amount of stretch. The twisted front detail adds a sophisticated touch, while the halter neckline creates a flattering silhouette.
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

        {/* Similar Products Section */}
        <section className="mt-20 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Similar Products</h2>
            <Link href="/products" className="text-sm font-medium text-primary hover:underline">View All</Link>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {similarProducts.map((p) => (
                <CarouselItem key={p.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
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
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </Carousel>
        </section>
      </div>
    </div>
  )
}
