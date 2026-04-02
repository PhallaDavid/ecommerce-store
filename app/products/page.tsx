"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { ChevronRight, SlidersHorizontal, X, Heart, Star, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { addToCart, toggleFavourite, getFavourites } from "@/lib/store"

// ── Mock data ──────────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Women", "Men", "Tops", "Bottoms", "Shoes", "Accessories", "New Arrivals", "Best Sellers"]
const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Best Rated", value: "rating" },
]

const BASE_IMG = "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/Homepage%20Collections/Category%20Highlight/MAR26-WEB%20Homepage_WOMEN_Tops.jpg"
const BANNER_IMG = "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/banner/2026/TEN11/Mar/KNY%20Sale/MAR26-CatFeed%20-Women-BestSellers-WEB%20HP.jpg"

const PRODUCTS = [
  { id: "p1",  name: "Classic Halter Twist Top",    price: 8.95,  compareAt: 12.50, category: "Tops",        rating: 4.8, reviews: 124, badge: "BEST SELLER", image: BASE_IMG },
  { id: "p2",  name: "Floral Mini Skirt",           price: 14.50, compareAt: 20.00, category: "Bottoms",     rating: 4.6, reviews: 89,  badge: "NEW",         image: BANNER_IMG },
  { id: "p3",  name: "Ruched Bodycon Dress",        price: 22.00, compareAt: 30.00, category: "Women",       rating: 4.9, reviews: 210, badge: "HOT",         image: BASE_IMG },
  { id: "p4",  name: "Linen Wide-Leg Pants",        price: 19.99, compareAt: null,  category: "Bottoms",     rating: 4.5, reviews: 67,  badge: null,          image: BANNER_IMG },
  { id: "p5",  name: "Oversized Graphic Tee",       price: 11.00, compareAt: 15.00, category: "Men",         rating: 4.7, reviews: 155, badge: "SALE",        image: BASE_IMG },
  { id: "p6",  name: "Knit Cardigan",               price: 29.95, compareAt: 40.00, category: "Tops",        rating: 4.4, reviews: 43,  badge: null,          image: BANNER_IMG },
  { id: "p7",  name: "Strappy Heeled Sandals",      price: 35.00, compareAt: 50.00, category: "Shoes",       rating: 4.6, reviews: 98,  badge: "NEW",         image: BASE_IMG },
  { id: "p8",  name: "Canvas Tote Bag",             price: 9.50,  compareAt: null,  category: "Accessories", rating: 4.3, reviews: 32,  badge: null,          image: BANNER_IMG },
  { id: "p9",  name: "Ribbed Crop Tank",            price: 7.99,  compareAt: 12.00, category: "New Arrivals",rating: 4.8, reviews: 178, badge: "NEW",         image: BASE_IMG },
  { id: "p10", name: "Pleated Midi Skirt",          price: 17.50, compareAt: 25.00, category: "Best Sellers",rating: 4.9, reviews: 302, badge: "BEST SELLER", image: BANNER_IMG },
  { id: "p11", name: "Slim-Fit Chinos",             price: 24.00, compareAt: null,  category: "Men",         rating: 4.5, reviews: 87,  badge: null,          image: BASE_IMG },
  { id: "p12", name: "Pearl Drop Earrings",         price: 5.99,  compareAt: 9.00,  category: "Accessories", rating: 4.7, reviews: 56,  badge: "SALE",        image: BANNER_IMG },
]

// ── Price range slider (simple) ────────────────────────────────────────────────
function PriceSlider({ min, max, value, onChange }: {
  min: number; max: number; value: [number, number]
  onChange: (v: [number, number]) => void
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs font-medium">
        <span>${value[0]}</span>
        <span>${value[1]}</span>
      </div>
      <div className="relative h-1.5 rounded-full bg-muted">
        <div
          className="absolute h-full rounded-full bg-primary"
          style={{ left: `${((value[0] - min) / (max - min)) * 100}%`, right: `${100 - ((value[1] - min) / (max - min)) * 100}%` }}
        />
        <input type="range" min={min} max={max} value={value[0]}
          onChange={(e) => { const v = +e.target.value; if (v < value[1]) onChange([v, value[1]]) }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
        <input type="range" min={min} max={max} value={value[1]}
          onChange={(e) => { const v = +e.target.value; if (v > value[0]) onChange([value[0], v]) }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
      </div>
      <div className="flex gap-2">
        <input type="number" min={min} max={value[1] - 1} value={value[0]}
          onChange={(e) => onChange([Math.max(min, +e.target.value), value[1]])}
          className="w-full rounded-md border bg-background px-2 py-1.5 text-xs text-center outline-none focus:border-primary" />
        <span className="text-muted-foreground self-center">–</span>
        <input type="number" min={value[0] + 1} max={max} value={value[1]}
          onChange={(e) => onChange([value[0], Math.min(max, +e.target.value)])}
          className="w-full rounded-md border bg-background px-2 py-1.5 text-xs text-center outline-none focus:border-primary" />
      </div>
    </div>
  )
}

// ── Star display ───────────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} className={cn("h-3 w-3", s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted")} />
      ))}
    </div>
  )
}

// ── Product card ───────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: typeof PRODUCTS[0] }) {
  const [fav, setFav] = useState(() => getFavourites().some(f => f.id === product.id))
  const [added, setAdded] = useState(false)

  function handleAddToCart() {
    addToCart({ id: product.id, name: product.name, href: `/products/${product.id}`, image: product.image, price: product.price })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="group relative flex flex-col rounded-2xl border bg-card overflow-hidden hover: transition-shadow duration-300">
      {/* Image */}
      <Link href={`/products/${product.id}`} className="relative aspect-3/4 overflow-hidden bg-muted block">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {product.badge && (
          <Badge className={cn("absolute top-2 left-2 text-[10px] px-1.5 py-0.5 text-white rounded-sm",
            product.badge === "SALE" || product.badge === "BEST SELLER" ? "bg-destructive" : "bg-primary"
          )}>{product.badge}</Badge>
        )}
        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); toggleFavourite({ id: product.id, name: product.name, href: `/products/${product.id}`, image: product.image, price: product.price }); setFav(v => !v) }}
          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className={cn("h-4 w-4", fav ? "fill-red-500 text-red-500" : "text-gray-600")} />
        </button>
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-1.5 p-3">
        <Link href={`/products/${product.id}`} className="text-sm font-semibold line-clamp-1 hover:text-primary transition-colors">
          {product.name}
        </Link>
        <div className="flex items-center gap-1.5">
          <Stars rating={product.rating} />
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-primary">${product.price}</span>
          {product.compareAt && <span className="text-xs text-muted-foreground line-through">${product.compareAt}</span>}
          {product.compareAt && <span className="text-xs font-semibold text-destructive">{Math.round((1 - product.price / product.compareAt) * 100)}% OFF</span>}
        </div>
        <Button size="sm" className={cn("w-full h-8 text-xs mt-1 transition-all", added ? "bg-green-600 hover:bg-green-600" : "bg-black hover:bg-black/80")} onClick={handleAddToCart}>
          {added ? "✓ Added" : "Add to Cart"}
        </Button>
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50])
  const [sort, setSort] = useState("newest")
  const [minRating, setMinRating] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      if (activeCategory !== "All" && p.category !== activeCategory) return false
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false
      if (p.rating < minRating) return false
      return true
    })
    if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price)
    else if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price)
    else if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating)
    return list
  }, [search, activeCategory, priceRange, sort, minRating])

  const activeSort = SORT_OPTIONS.find(s => s.value === sort)!

  function resetFilters() {
    setActiveCategory("All")
    setPriceRange([0, 50])
    setMinRating(0)
    setSearch("")
  }

  const hasFilters = activeCategory !== "All" || priceRange[0] > 0 || priceRange[1] < 50 || minRating > 0 || search

  // ── Sidebar content ──────────────────────────────────────────────────────────
  const Sidebar = (
    <div className="space-y-6">
      {/* Category */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</h3>
        <div className="flex flex-col gap-0.5">
          {CATEGORIES.map((cat) => (
            <button key={cat} type="button" onClick={() => setActiveCategory(cat)}
              className={cn("flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors text-left",
                activeCategory === cat ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted text-foreground"
              )}>
              {cat}
              {activeCategory === cat && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Price Range</h3>
        <PriceSlider min={0} max={50} value={priceRange} onChange={setPriceRange} />
      </div>

      <Separator />

      {/* Rating */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Min. Rating</h3>
        <div className="flex flex-col gap-1">
          {[0, 3, 4, 4.5].map((r) => (
            <button key={r} type="button" onClick={() => setMinRating(r)}
              className={cn("flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                minRating === r ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted"
              )}>
              {r === 0 ? "All ratings" : <><Stars rating={r} /><span className="text-xs">& up</span></>}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <Button variant="outline" className="w-full text-xs" onClick={resetFilters}>
          <X className="h-3.5 w-3.5 mr-1.5" /> Reset Filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:px-8">

        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center space-x-2 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Products</span>
        </nav>

        {/* Header row */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">All Products</h1>
            <p className="text-sm text-muted-foreground mt-1">{filtered.length} results{activeCategory !== "All" && ` in ${activeCategory}`}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile filter toggle */}
            <Button variant="outline" size="sm" className="lg:hidden gap-2" onClick={() => setSidebarOpen(true)}>
              <SlidersHorizontal className="h-4 w-4" /> Filters
              {hasFilters && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{[activeCategory !== "All", priceRange[0] > 0 || priceRange[1] < 50, minRating > 0].filter(Boolean).length}</span>}
            </Button>

            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…"
                className="w-48 rounded-full border bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" />
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button type="button" onClick={() => setSortOpen(v => !v)}
                className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-sm font-medium hover:border-primary transition-colors">
                {activeSort.label} <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", sortOpen && "rotate-180")} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1 z-20 w-48 rounded-xl border bg-popover  py-1">
                  {SORT_OPTIONS.map((opt) => (
                    <button key={opt.value} type="button" onClick={() => { setSort(opt.value); setSortOpen(false) }}
                      className={cn("flex w-full items-center px-3 py-2 text-sm transition-colors hover:bg-muted",
                        sort === opt.value && "font-semibold text-primary"
                      )}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="mb-4 flex flex-wrap gap-2">
            {activeCategory !== "All" && (
              <Badge variant="secondary" className="gap-1 pr-1">
                {activeCategory}
                <button onClick={() => setActiveCategory("All")} className="ml-1 rounded-full hover:bg-muted"><X className="h-3 w-3" /></button>
              </Badge>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 50) && (
              <Badge variant="secondary" className="gap-1 pr-1">
                ${priceRange[0]}–${priceRange[1]}
                <button onClick={() => setPriceRange([0, 50])} className="ml-1 rounded-full hover:bg-muted"><X className="h-3 w-3" /></button>
              </Badge>
            )}
            {minRating > 0 && (
              <Badge variant="secondary" className="gap-1 pr-1">
                ⭐ {minRating}+
                <button onClick={() => setMinRating(0)} className="ml-1 rounded-full hover:bg-muted"><X className="h-3 w-3" /></button>
              </Badge>
            )}
            {search && (
              <Badge variant="secondary" className="gap-1 pr-1">
                "{search}"
                <button onClick={() => setSearch("")} className="ml-1 rounded-full hover:bg-muted"><X className="h-3 w-3" /></button>
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">{Sidebar}</aside>

          {/* Product grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                  <Search className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="text-base font-semibold">No products found</p>
                <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search term.</p>
                <Button className="mt-4" onClick={resetFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-background p-5 ">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setSidebarOpen(false)} className="rounded-full p-1 hover:bg-muted"><X className="h-5 w-5" /></button>
            </div>
            {Sidebar}
            <Button className="w-full mt-4" onClick={() => setSidebarOpen(false)}>
              Show {filtered.length} Results
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
