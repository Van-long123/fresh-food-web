export interface CartRequestItem {
  productId: string
  quantity: number
}

export interface CartAdjustment {
  productId: string
  name?: string
  from?: number
  to?: number
  reason?: string
}

export interface CartItem {
  id: string
  productId: string
  categoryId?: string | null
  name: string
  image: string
  price: number
  originalPrice: number | null
  stock: number
  quantity: number
  slug?: string
  unit?: string
}

export interface CartResponse {
  items: Array<{
    productId: string
    categoryId?: string | null
    name: string
    image: string
    price: number
    originalPrice: number | null
    stock: number
    quantity: number
    slug?: string
    unit?: string
  }>
  totalCartItems: number
  totalQuantity: number
  adjustments?: {
    clamped: CartAdjustment[]
    removed: CartAdjustment[]
  }
}
