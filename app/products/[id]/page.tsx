import { Metadata } from 'next'
import api from "@/utils/axios"
import { fixImageUrl } from "@/lib/store"
import { ProductDetailView } from "./ProductDetailView"

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

const FALLBACK_IMG = "/images/STU_8189-cr-450x672.jpg"

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim()) {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }
  return null
}

async function getProduct(id: string) {
  try {
    const res = await api.get<ApiProductDetail>(`/products/detail/${id}`)
    return res.data
  } catch (err) {
    console.error(`Error fetching product ${id}:`, err)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const raw = await getProduct(id)
  
  if (!raw) {
    return {
      title: 'Product Not Found | R4kie.S',
      description: 'The requested product could not be found.'
    }
  }

  // Price calculation
  const original = toNumber(raw.original_price)
  const current =
    (typeof raw.current_price === "number" && Number.isFinite(raw.current_price)
      ? raw.current_price
      : null) ??
    toNumber(raw.promo_price) ??
    original ??
    0

  const priceStr = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(current)

  const saleInfo = raw.is_on_sale ? " Sale " : ""
  
  // Create rich title and description for Telegram/Social Media
  const title = `${raw.name} - ${priceStr}${saleInfo}| R4kie.S`
  const description = raw.description 
    ? (raw.description.length > 160 ? raw.description.substring(0, 157) + "..." : raw.description)
    : `Discover ${raw.name} at great prices on R4kie.S.`
  
  const imageUrl = fixImageUrl(raw.thumbnail)
  
  // Ensure the image URL is absolute for social previews
  let absoluteImageUrl = imageUrl
  if (imageUrl && !imageUrl.startsWith('http')) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ecommerce-store-phi-nine.vercel.app' // Fallback to a production URL if env not set
    absoluteImageUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: absoluteImageUrl,
          width: 800,
          height: 1000,
          alt: raw.name,
        }
      ],
      type: 'website',
      siteName: 'R4kie.S',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteImageUrl],
    },
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const raw = await getProduct(id)
  
  // We can pass the raw data to the client component or transform it here
  // Transforming here to match the ProductVM expected by ProductDetailView
  let initialProduct = null
  if (raw) {
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

    initialProduct = {
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
  }

  return <ProductDetailView id={id} initialProduct={initialProduct} />
}
