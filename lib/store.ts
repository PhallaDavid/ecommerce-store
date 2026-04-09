import api from "@/utils/axios"
import { toast } from "sonner"

export type FavouriteItem = {
  id: string
  name: string
  href: string
  image: string
  price: number
  compareAt?: number
}

export type CartItem = {
  id: string // product id or composite id
  cart_id?: number // backend cart item id
  variant_id?: number
  name: string
  href: string
  image: string
  price: number
  qty: number
  color?: string
  size?: string
}

const FAVOURITES_KEY = "r4kies:favourites" 
const CART_KEY = "r4kies:cart"
const STORE_EVENT = "r4kies:store"

// In-memory cache for favorites
let inMemoryFavs: FavouriteItem[] = []
// In-memory cache for cart
let inMemoryCart: CartItem[] = []

function safeParseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function emitStoreUpdate() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(STORE_EVENT))
}

/**
 * Fix potential double URL mess: http://rakiestore-w04r.onrender.comhttps://res.cloudinary.com/...
 */
export function fixImageUrl(url?: string | null): string {
  if (!url) return "/images/STU_8189-cr-450x672.jpg"
  if (url.includes("http") && url.lastIndexOf("http") > 0) {
    return url.slice(url.lastIndexOf("http"))
  }
  return url
}

export function subscribeStore(callback: () => void) {
  if (typeof window === "undefined") return () => {}

  const onCustom = () => callback()
  window.addEventListener(STORE_EVENT, onCustom)
  return () => {
    window.removeEventListener(STORE_EVENT, onCustom)
  }
}

export function getFavourites(): FavouriteItem[] {
  return inMemoryFavs
}

export function setFavourites(items: FavouriteItem[]) {
  inMemoryFavs = items
  emitStoreUpdate()
}

export function isFavourite(id: string) {
  return inMemoryFavs.some((item) => item.id === id)
}

/**
 * Synchronize local favorites with the server if logged in.
 */
export async function syncFavoritesWithServer() {
  if (typeof window === "undefined") return
  const token = localStorage.getItem("auth_token")
  if (!token) return

  try {
    const res = await api.get("/favorites")
    const serverFavs = Array.isArray(res.data) ? res.data : []
    
    const mapped: FavouriteItem[] = serverFavs.map((f: any) => ({
      id: String(f.id),
      name: f.name,
      href: `/products/${f.id}`,
      image: fixImageUrl(f.thumbnail || f.image),
      price: typeof f.current_price === "number" ? f.current_price : Number(f.promo_price || f.original_price || 0),
      compareAt: f.original_price ? Number(f.original_price) : undefined
    }))
    
    setFavourites(mapped)
  } catch (err) {
    console.error("Failed to sync favorites:", err)
  }
}

export async function syncCartWithServer() {
  if (typeof window === "undefined") return
  const token = localStorage.getItem("auth_token")
  if (!token) return

  try {
    const res = await api.get("/cart")
    const serverCart = Array.isArray(res.data) ? res.data : []
    
    const mapped: CartItem[] = serverCart.map((it: any) => {
      return {
        id: String(it.product_id),
        cart_id: it.id,
        variant_id: it.variant_id,
        name: it.name || it.product_name || "Product",
        href: `/products/${it.product_id}`,
        image: fixImageUrl(it.thumbnail || it.image),
        price: Number(it.promo_price || it.original_price || it.price || 0),
        qty: it.quantity
      }
    })
    
    setCart(mapped)
  } catch (err) {
    console.error("Failed to sync cart:", err)
  }
}

export function toggleFavourite(item: FavouriteItem) {
  if (typeof window === "undefined") return []

  const token = localStorage.getItem("auth_token")
  if (!token) {
    toast.error("Please login to continue")
    window.location.href = "/auth/login"
    return inMemoryFavs
  }

  // Optimistic UI update
  const exists = inMemoryFavs.some((x) => x.id === item.id)
  const next = exists 
    ? inMemoryFavs.filter((x) => x.id !== item.id) 
    : [item, ...inMemoryFavs]
  
  setFavourites(next)
  
  if (exists) {
    toast.success("Removed from favourites")
    api.delete(`/favorites/${item.id}`)
      .catch(err => console.error("Failed to remove favorite on server:", err))
  } else {
    toast.success("Added to favourites")
    api.post("/favorites/add", { product_id: Number(item.id) })
      .catch(err => console.error("Failed to add favorite on server:", err))
  }

  return next
}

export function getCart(): CartItem[] {
  return inMemoryCart
}

export function setCart(items: CartItem[]) {
  inMemoryCart = items
  emitStoreUpdate()
}

export function addToCart(item: Omit<CartItem, "qty">, qty = 1) {
  if (typeof window === "undefined") return []

  const token = localStorage.getItem("auth_token")
  if (!token) {
    toast.error("Please login to continue")
    window.location.href = "/auth/login"
    return inMemoryCart
  }

  const current = getCart()
  const idx = current.findIndex((x) => x.id === item.id && x.variant_id === item.variant_id)
  const next =
    idx >= 0
      ? current.map((x, i) => (i === idx ? { ...x, qty: x.qty + qty } : x))
      : [{ ...item, qty }, ...current]
  
  setCart(next)
  toast.success("Added to cart")

  // Sync with server
  api.post("/cart/add", { 
    product_id: Number(item.id), 
    variant_id: item.variant_id || null, 
    quantity: qty 
  }).then(() => syncCartWithServer()) // Re-sync to get the backend cart_id
    .catch(err => console.error("Failed to add to cart on server:", err))

  return next
}

export function updateCartQty(id: string, qty: number, variant_id?: number) {
  const current = getCart()
  const item = current.find((x) => x.id === id && (variant_id ? x.variant_id === variant_id : true))
  
  const next = current
    .map((x) => (x.id === id && (variant_id ? x.variant_id === variant_id : true) ? { ...x, qty } : x))
    .filter((x) => x.qty > 0)
  
  setCart(next)
  
  if (qty <= 0) {
    toast.success("Removed from cart")
  } else {
    toast.success("Cart updated")
  }

  if (item?.cart_id) {
    if (qty <= 0) {
      api.delete(`/cart/${item.cart_id}`)
        .catch(err => console.error("Failed to remove from cart on server:", err))
    } else {
      api.put(`/cart/${item.cart_id}`, { quantity: qty })
        .catch(err => console.error("Failed to update cart qty on server:", err))
    }
  }

  return next
}

export function removeFromCart(id: string, variant_id?: number) {
  const current = getCart()
  const item = current.find((x) => x.id === id && (variant_id ? x.variant_id === variant_id : true))
  const next = current.filter((x) => !(x.id === id && (variant_id ? x.variant_id === variant_id : true)))
  
  setCart(next)
  toast.success("Removed from cart")

  if (item?.cart_id) {
    api.delete(`/cart/${item.cart_id}`)
      .catch(err => console.error("Failed to remove from cart on server:", err))
  }

  return next
}
