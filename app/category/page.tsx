"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

const categories = [
  {
    slug: "fashion",
    label: "Fashion",
    image: "/images/STU_8189-cr-450x672.jpg",
  },
  {
    slug: "electronics",
    label: "Electronics",
    image: "/images/STU_8189-cr-450x672.jpg",
  },
  {
    slug: "accessories",
    label: "Accessories",
    image: "/images/STU_8189-cr-450x672.jpg",
  },
  {
    slug: "audio",
    label: "Audio",
    image: "/images/STU_8189-cr-450x672.jpg",
  },
  {
    slug: "computers",
    label: "Computers",
    image: "/images/STU_8189-cr-450x672.jpg",
  },
  {
    slug: "gaming",
    label: "Gaming",
    image: "/images/STU_8189-cr-450x672.jpg",
  },
  {
    slug: "new",
    label: "New Arrivals",
    image: "/images/STU_8189-cr-450x672.jpg",
  },
  {
    slug: "essentials",
    label: "Essentials",
    image: "/images/STU_8189-cr-450x672.jpg",
  },
] as const

export default function CategoriesPage() {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Categories</h1>
            <p className="text-sm text-muted-foreground">
              Browse by category to find what you want faster.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group overflow-hidden rounded-2xl border bg-card hover:bg-muted/30 transition-colors"
              aria-label={cat.label}
            >
              <div className="relative aspect-square bg-muted">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-3 flex items-center justify-between gap-2">
                <div className="truncate text-sm font-semibold">{cat.label}</div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
