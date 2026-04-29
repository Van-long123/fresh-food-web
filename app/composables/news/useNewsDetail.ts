import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ROUTES } from '~/constants/routes'
import { useArticleDetailQuery } from '~/queries/article/useArticleDetailQuery'
import { buildContentWithToc, formatCommentDate, formatNewsDate, formatViews, getInitial } from '~/utils/newsDetail'

export const useNewsDetail = () => {
  const route = useRoute()
  const slug = computed(() => String(route.params.slug || ''))

  const { data, isPending } = useArticleDetailQuery(slug)

  const articleEntity = computed(() => data.value || null)

  const contentMeta = computed(() => {
    return buildContentWithToc(articleEntity.value?.content)
  })

  const article = computed(() => {
    const item = articleEntity.value
    if (!item) return null

    const author = item.authorName || 'SmartFood Team'

    return {
      slug: item.slug,
      title: item.title || '',
      category: item.primary_category?.title || 'Tin tuc',
      author,
      authorInitial: getInitial(author),
      date: formatNewsDate(item.publishedAt),
      readTime: Number(item.readTime || 0),
      cover: item.thumbnail || '',
      intro: item.shortDescription || '',
      contentHtml: contentMeta.value.contentHtml
    }
  })

  const sections = computed(() => {
    return contentMeta.value.headings
  })

  const tags = computed(() => {
    if (!Array.isArray(articleEntity.value?.tags)) return []
    return articleEntity.value.tags.filter((tag) => Boolean(tag))
  })

  const reactionSummary = computed(() => ({
    likes: 0,
    saves: 0
  }))

  const comments = computed(() => {
    const commentList = Array.isArray(articleEntity.value?.comments)
      ? articleEntity.value.comments
      : []

    return commentList.map((comment, index) => {
      const name = comment.name || 'Khach hang'
      return {
        id: comment._id || `${index}-${name}`,
        avatar: comment.avatar || '',
        initial: getInitial(name),
        name,
        time: formatCommentDate(comment.createdAt),
        content: comment.content || ''
      }
    })
  })

  const relatedArticles = computed(() => {
    const relatedList = Array.isArray(articleEntity.value?.relatedArticles)
      ? articleEntity.value.relatedArticles
      : []

    return relatedList.map((item) => ({
      id: item._id,
      slug: item.slug,
      title: item.title,
      excerpt: item.shortDescription || '',
      cover: item.thumbnail || ''
    }))
  })

  const popularArticles = computed(() => {
    const popularList = Array.isArray(articleEntity.value?.popularArticles)
      ? articleEntity.value.popularArticles
      : []

    return popularList.map((item, index) => ({
      id: item._id,
      slug: item.slug,
      title: item.title,
      rank: String(index + 1).padStart(2, '0'),
      viewsLabel: formatViews(item.views)
    }))
  })

  const loading = computed(() => isPending.value)
  const hasArticle = computed(() => Boolean(article.value))

  return {
    slug,
    loading,
    hasArticle,
    article,
    sections,
    tags,
    comments,
    relatedArticles,
    popularArticles,
    reactionSummary,
    ROUTES
  }
}
