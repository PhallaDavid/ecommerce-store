export type FavouriteItem = {
  id: string
  name: string
  href: string
  image: string
  price: number
  compareAt?: number
}

export type CartItem = {
  id: string
  name: string
  href: string
  image: string
  price: number
  qty: number
}

const FAVOURITES_KEY = "r4kies:favourites"
const CART_KEY = "r4kies:cart"
const STORE_EVENT = "r4kies:store"

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

export function subscribeStore(callback: () => void) {
  if (typeof window === "undefined") return () => {}

  const onStorage = (e: StorageEvent) => {
    if (e.key === FAVOURITES_KEY || e.key === CART_KEY) callback()
  }
  const onCustom = () => callback()

  window.addEventListener("storage", onStorage)
  window.addEventListener(STORE_EVENT, onCustom)
  return () => {
    window.removeEventListener("storage", onStorage)
    window.removeEventListener(STORE_EVENT, onCustom)
  }
}

export function getFavourites(): FavouriteItem[] {
  if (typeof window === "undefined") return []
  return safeParseJson<FavouriteItem[]>(window.localStorage.getItem(FAVOURITES_KEY), [])
}

export function setFavourites(items: FavouriteItem[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(FAVOURITES_KEY, JSON.stringify(items))
  emitStoreUpdate()
}

export function isFavourite(id: string) {
  return getFavourites().some((item) => item.id === id)
}

export function toggleFavourite(item: FavouriteItem) {
  const current = getFavourites()
  const exists = current.some((x) => x.id === item.id)
  const next = exists ? current.filter((x) => x.id !== item.id) : [item, ...current]
  setFavourites(next)
  return next
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return []
  return safeParseJson<CartItem[]>(window.localStorage.getItem(CART_KEY), [])
}

export function setCart(items: CartItem[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(CART_KEY, JSON.stringify(items))
  emitStoreUpdate()
}

export function addToCart(item: Omit<CartItem, "qty">, qty = 1) {
  const current = getCart()
  const idx = current.findIndex((x) => x.id === item.id)
  const next =
    idx >= 0
      ? current.map((x, i) => (i === idx ? { ...x, qty: x.qty + qty } : x))
      : [{ ...item, qty }, ...current]
  setCart(next)
  return next
}

export function updateCartQty(id: string, qty: number) {
  const current = getCart()
  const next = current
    .map((x) => (x.id === id ? { ...x, qty } : x))
    .filter((x) => x.qty > 0)
  setCart(next)
  return next
}

export function removeFromCart(id: string) {
  const current = getCart()
  const next = current.filter((x) => x.id !== id)
  setCart(next)
  return next
}

