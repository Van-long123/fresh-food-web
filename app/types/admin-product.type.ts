export type AdminProductStatus = 'active' | 'inactive' | 'draft' | 'out_of_stock'

export interface AdminProductListItem {
  id: string
  title: string
  slug: string
  sku: string
  category: string
  price: number
  stock: number
  status: AdminProductStatus
  thumbnail: string
  updatedAt: string
}

export interface AdminProductForm {
  title: string
  slug: string
  sku: string
  categories: string[]
  tags: string[]
  price: number
  salePrice: number | null
  costPrice: number | null
  saleStart: string | null
  saleEnd: string | null
  stock: number
  lowStockThreshold: number
  trackInventory: boolean
  shortDescription: string
  description: string
  images: string[]
  status: AdminProductStatus
  metaTitle: string
  metaDescription: string
  ogImage: string
}
