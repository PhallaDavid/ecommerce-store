"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

const brands = [
  { slug: "apple", name: "Apple", image: "/images/logo.jpg" },
  { slug: "samsung", name: "Samsung", image: "/images/logo.jpg" },
  { slug: "sony", name: "Sony", image: "/images/logo.jpg" },
  { slug: "nike", name: "Nike", image: "/images/logo.jpg" },
  { slug: "adidas", name: "Adidas", image: "/images/logo.jpg" },
  { slug: "puma", name: "Puma", image: "/images/logo.jpg" },
  { slug: "xiaomi", name: "Xiaomi", image: "/images/logo.jpg" },
  { slug: "lenovo", name: "Lenovo", image: "/images/logo.jpg" },
] as const

export default function BrandsPage() {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Brands</h1>
          <p className="text-sm text-muted-foreground">
            Pick a brand to browse products.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              className="group overflow-hidden rounded-2xl border bg-card hover:bg-muted/30 transition-colors"
              aria-label={brand.name}
            >
              <div className="relative aspect-[16/10] bg-muted">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/25" />
              </div>
              <div className="p-3 flex items-center justify-between gap-2">
                <div className="truncate text-sm font-semibold">{brand.name}</div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

