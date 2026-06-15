export type AiContentType = 'product' | 'article' | 'category'

export interface AiProductResult {
  description: string
  tags: string[]
}

export interface AiArticleResult {
  shortDescription: string
  content: string
  tags: string[]
}

export interface AiCategoryResult {
  badge: string
  description: string
}

export type AiContentResult = AiProductResult | AiArticleResult | AiCategoryResult
