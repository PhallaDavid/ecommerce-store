export type Category = {
  id: number
  name: string
  description: string | null
  avatar: string | null
  status?: string
  created_at: string
}

export type Brand = {
  id: number
  name: string
  description: string | null
  avatar: string | null
  status?: string
  created_at: string
}

export type Banner = {
  id: number
  title: string
  description: string | null
  image: string
  status: string
  created_at: string
}

export type Pagination = {
  totalItems: number
  totalPages: number
  currentPage: number
  itemsPerPage: number
}

export type Product = {
  id: number
  category_id: number | null
  subcategory_id: number | null
  brand_id: number | null
  name: string
  slug: string
  description: string | null
  original_price: string | number | null
  promo_price: string | number | null
  promo_start: string | null
  promo_end: string | null
  thumbnail: string | null
  status: string
  created_at: string
  current_price: number | null
  is_on_sale: boolean | null
}

export type PaginatedResponse<T> = {
  data: T[]
  pagination: Pagination
}
