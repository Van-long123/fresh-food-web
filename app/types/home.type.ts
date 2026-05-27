export interface HomeAggregateQueryParams {
  campaignLimit?: number
  categoryLimit?: number
  categoryProductLimit?: number
  blogLimit?: number
  includeCampaigns?: boolean
  includeCategories?: boolean
  includeBlogs?: boolean
}

// export interface HomeSectionProductsQueryParams {
// slug: string
// limit?: number
// }

// export interface HomeBlogsQueryParams {
// limit?: number
// featured?: boolean
// }

export interface HomeProduct {
  id: number | string
  name: string
  slug: string
  image: string
  price: number
  originalPrice: number | null
  discountPercent: number | null
  isBestPrice: boolean
  isOnlineExclusive: boolean
  stock: number
  buttonText: string
}

export interface HomeCampaignBadge {
  id: string
  name: string
  slug: string
  color: string
  textColor: string
}

export interface HomeCampaign {
  badge: HomeCampaignBadge
  products: HomeProduct[]
}

export interface HomeCategorySection {
  id: string
  slug: string
  title: string
  badgeText: string
  bannerImage: string
  overlayClass: string
  titleClass: string
  badgeClass: string
  products: HomeProduct[]
}

export interface HomeBlogPost {
  id: string
  slug: string
  title: string
  description: string
  image: string
  publishedAt: string
  publishedLabel: string
}

export interface SidebarCategory {
  id: string
  slug: string
  title: string
  thumbnail: string
}

export interface HomeAggregateModel {
  sidebarCategories: SidebarCategory[]
  campaigns: HomeCampaign[]
  categorySections: HomeCategorySection[]
  blogs: HomeBlogPost[]
}

export interface HomeCampaignApi {
  id?: string
  slug?: string
  name?: string
  title?: string
  color?: string
  textColor?: string
  products?: unknown[]
}

export interface HomeCategoryApi {
  id?: string
  slug?: string
  name?: string
  title?: string
  bannerImage?: string
  image?: string
  badgeText?: string
  badge?: string
  products?: unknown[]
  thumbnail?: string
}

export interface HomeBlogApi {
  id?: string | number
  slug?: string
  title?: string
  description?: string
  excerpt?: string
  image?: string
  thumbnail?: string
  publishedAt?: string
  createdAt?: string
}

export interface HomeAggregateApiResponse {
  sidebarCategories?: HomeCategoryApi[]
  campaigns?: HomeCampaignApi[]
  campaignBadges?: HomeCampaignApi[]
  categorySections?: HomeCategoryApi[]
  categories?: HomeCategoryApi[]
  blogs?: HomeBlogApi[]
  posts?: HomeBlogApi[]
  meta?: {
    sectionProductMode?: 'embedded' | 'lazy'
  }
}

// export interface HomeCategoryProductsApiResponse {
// slug?: string
// products?: unknown[]
// }

// export interface HomeBlogsApiResponse {
// posts?: HomeBlogApi[]
// blogs?: HomeBlogApi[]
// }
