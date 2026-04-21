export interface Product {
  id: number
  name: string
  image?: string
  price: number
  originalPrice?: number | null
  discountPercent?: number | null
  slug?: string
}
