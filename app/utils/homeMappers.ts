import dayjs from 'dayjs'
import {
  HOME_CAMPAIGN_BADGE_FALLBACKS,
  HOME_DEFAULTS,
  HOME_SECTION_STYLE_PRESETS
} from '~/constants/home'
import type {
  HomeAggregateApiResponse,
  HomeAggregateModel,
  HomeBlogApi,
  HomeBlogPost,
  HomeCampaign,
  HomeCampaignApi,
  HomeCampaignBadge,
  HomeCategoryApi,
  HomeCategorySection,
  HomeProduct
} from '~/types/home.type'

const FALLBACK_BANNER =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000'

const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=800&q=80'

const FALLBACK_BLOG_IMAGE =
  'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=1200'

const normalizeText = (value: unknown, fallback: string): string => {
  if (typeof value !== 'string') return fallback

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : fallback
}

const toId = (value: unknown, fallback: string): string => {
  const normalized = normalizeText(value, fallback)
  return normalized.replace(/\s+/g, '_').toLowerCase()
}

const toSlug = (value: unknown, fallback: string): string => {
  const normalized = normalizeText(value, fallback)

  return normalized
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

const toNumber = (value: unknown, fallback: number): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    if (Number.isFinite(parsed)) return parsed
  }

  return fallback
}

const toNullableNumber = (value: unknown): number | null => {
  const parsed = toNumber(value, Number.NaN)
  return Number.isNaN(parsed) ? null : parsed
}

const toBoolean = (value: unknown, fallback = false): boolean => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value > 0
  if (typeof value === 'string') {
    const normalized = value.toLowerCase().trim()
    if (normalized === 'true' || normalized === '1') return true
    if (normalized === 'false' || normalized === '0') return false
  }

  return fallback
}

const mapProduct = (product: unknown): HomeProduct | null => {
  if (!product || typeof product !== 'object') return null

  const raw = product as Record<string, unknown>
  const id = raw.id ?? raw._id ?? raw.productId

  if (!id) return null

  const title = raw.name ?? raw.title
  const slugSeed = raw.slug ?? title ?? id
  const originalPrice = toNullableNumber(raw.originalPrice ?? raw.compareAtPrice)
  const price = toNumber(raw.price ?? raw.salePrice, 0)
  const stock = toNumber(raw.stock, 0)

  return {
    id: typeof id === 'number' || typeof id === 'string' ? id : String(id),
    name: normalizeText(title, 'San pham dang cap nhat'),
    slug: toSlug(slugSeed, `product-${String(id)}`),
    image: normalizeText(raw.image ?? raw.thumbnail, FALLBACK_PRODUCT_IMAGE),
    price,
    originalPrice,
    discountPercent: toNullableNumber(raw.discountPercent ?? raw.discount),
    isBestPrice: toBoolean(raw.isBestPrice),
    isOnlineExclusive: toBoolean(raw.isOnlineExclusive),
    stock,
    buttonText: normalizeText(raw.buttonText, 'Mua')
  }
}

const mapBlogPost = (post: HomeBlogApi): HomeBlogPost => {
  const idSeed = post.id ?? post.slug ?? post.title ?? Date.now().toString()
  const publishedAt = normalizeText(post.publishedAt ?? post.createdAt, new Date().toISOString())

  return {
    id: String(idSeed),
    slug: toSlug(post.slug ?? post.title ?? idSeed, `news-${String(idSeed)}`),
    title: normalizeText(post.title, 'Tin tuc dang cap nhat'),
    description: normalizeText(post.description ?? post.excerpt, 'Noi dung dang duoc cap nhat.'),
    image: normalizeText(post.image ?? post.thumbnail, FALLBACK_BLOG_IMAGE),
    publishedAt,
    publishedLabel: dayjs(publishedAt).format('DD/MM/YYYY')
  }
}

const mapCampaignBadge = (campaign: HomeCampaignApi, index: number): HomeCampaignBadge => {
  const title = normalizeText(campaign.name ?? campaign.title, '')
  const id = toId(campaign.id ?? campaign.slug ?? title, `campaign_${index + 1}`)

  const fallbackById = HOME_CAMPAIGN_BADGE_FALLBACKS.find((fb) => fb.id === id)
  const fallback = fallbackById || HOME_CAMPAIGN_BADGE_FALLBACKS[index % HOME_CAMPAIGN_BADGE_FALLBACKS.length]

  const name = title || fallback?.name || ''

  return {
    id,
    slug: toSlug(campaign.slug ?? campaign.id ?? title, fallback?.slug || ''),
    name: name.replace(/\n/g, '<br/>'),
    color: normalizeText(campaign.color, fallback?.color || ''),
    textColor: normalizeText(campaign.textColor, fallback?.textColor || '')
  }
}

const mapCampaign = (campaign: HomeCampaignApi, index: number): HomeCampaign => {
  const products = Array.isArray(campaign.products)
    ? campaign.products.map(mapProduct).filter((item): item is HomeProduct => item !== null)
    : []

  return {
    badge: mapCampaignBadge(campaign, index),
    products: products.slice(0, HOME_DEFAULTS.campaignProductLimit)
  }
}

const mapCategorySection = (category: HomeCategoryApi, index: number): HomeCategorySection | null => {
  const title = normalizeText(category.title ?? category.name, '')
  if (!title) return null

  const id = toId(category.id ?? category.slug ?? title, `category_${index + 1}`)
  const slug = toSlug(category.slug ?? category.id ?? title, `category-${index + 1}`)
  const products = Array.isArray(category.products)
    ? category.products.map(mapProduct).filter((item): item is HomeProduct => item !== null)
    : []
  const style = HOME_SECTION_STYLE_PRESETS[index % HOME_SECTION_STYLE_PRESETS.length]

  return {
    id,
    slug,
    title,
    badgeText: normalizeText(category.badgeText ?? category.badge, 'Uu dai moi ngay'),
    bannerImage: normalizeText(category.bannerImage ?? category.image, FALLBACK_BANNER),
    products: products.slice(0, HOME_DEFAULTS.categoryProductLimit),
    overlayClass: style?.overlayClass || '',
    titleClass: style?.titleClass || '',
    badgeClass: style?.badgeClass || ''
  }
}

export const mapHomeAggregateResponse = (payload: HomeAggregateApiResponse | null | undefined): HomeAggregateModel => {
  const sidebarSource = Array.isArray(payload?.sidebarCategories) ? payload.sidebarCategories : []
  const sidebarCategories = sidebarSource.map((cat, index) => {
    const title = normalizeText(cat.title ?? cat.name, '')
    const id = toId(cat.id ?? cat.slug ?? title, `sidebar_category_${index + 1}`)
    const slug = toSlug(cat.slug ?? cat.id ?? title, `sidebar-category-${index + 1}`)
    
    return {
      id,
      slug,
      title: title || 'Danh muc',
      thumbnail: normalizeText(cat.thumbnail ?? cat.image, '')
    }
  }).filter(item => item.title !== 'Danh muc')

  const campaignsSource = Array.isArray(payload?.campaigns)
    ? payload.campaigns
    : Array.isArray(payload?.campaignBadges)
      ? payload.campaignBadges
      : []

  const campaigns = campaignsSource.map(mapCampaign)

  const categorySource = Array.isArray(payload?.categorySections)
    ? payload.categorySections
    : Array.isArray(payload?.categories)
      ? payload.categories
      : []

  const categorySections = categorySource
    .map(mapCategorySection)
    .filter((item): item is HomeCategorySection => item !== null)
    .slice(0, HOME_DEFAULTS.categorySectionLimit)

  const blogSource = Array.isArray(payload?.blogs)
    ? payload.blogs
    : Array.isArray(payload?.posts)
      ? payload.posts
      : []

  const blogs = blogSource.map(mapBlogPost).slice(0, HOME_DEFAULTS.blogLimit)

  return {
    sidebarCategories,
    campaigns,
    categorySections,
    blogs
  }
}

export const buildSliderProducts = (products: HomeProduct[], prefix: string): Array<HomeProduct & { uniqueId: string }> => {
  const normalized = products
  // const normalized = products.slice(0, HOME_DEFAULTS.categoryProductLimit)

  if (normalized.length === 0) return []

  return normalized.map((product, index) => ({
    ...product,
    uniqueId: `${prefix}-${String(product.id)}-${index}`
  }))
}
