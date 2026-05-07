export type AdminArticleStatus = 'active' | 'draft' | 'inactive'

export interface AdminArticleListItem {
  id: string
  title: string
  category: string
  author: string
  status: AdminArticleStatus
  publishedAt: string
  thumbnail: string
}

export interface AdminArticleForm {
  title: string
  slug: string
  shortDescription: string
  content: string
  thumbnail: string
  authorName: string
  primaryCategoryId: string | null
  tags: string[]
  status: AdminArticleStatus
  publishedAt: string | null
  metaTitle: string
  metaDescription: string
}
