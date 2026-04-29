import { formatCount, formatDate } from '~/utils/formatters'

export type ContentHeading = {
  id: string
  title: string
  order: number
}

export const getInitial = (name: string) => {
  const trimmed = String(name || '').trim()
  return trimmed ? trimmed.charAt(0).toUpperCase() : 'U'
}

export const normalizeSectionId = (id: string, index: number) => {
  const raw = String(id || '').trim()
  if (raw) return raw
  return `section-${index + 1}`
}

const normalizeHeadingText = (rawValue: string) => {
  return String(rawValue || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const slugifyHeading = (value: string, index: number) => {
  const normalized = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return normalized ? `toc-${normalized}-${index + 1}` : `toc-heading-${index + 1}`
}

export const buildContentWithToc = (htmlContent: string | null | undefined) => {
  const source = String(htmlContent || '')
  if (!source) {
    return {
      contentHtml: '',
      headings: [] as ContentHeading[]
    }
  }

  if (typeof DOMParser === 'undefined') {
    const headings: ContentHeading[] = []
    let headingIndex = 0
    const contentHtml = source.replace(/<h1([^>]*)>([\s\S]*?)<\/h1>/gi, (_match, attrs, textHtml) => {
      const headingTitle = normalizeHeadingText(textHtml)
      if (!headingTitle) return `<h1${attrs}>${textHtml}</h1>`
      const headingId = slugifyHeading(headingTitle, headingIndex)
      headings.push({ id: headingId, title: headingTitle, order: headingIndex + 1 })
      headingIndex += 1

      const attrString = String(attrs || '')
      if (/\sid\s*=/.test(attrString)) return `<h1${attrString}>${textHtml}</h1>`
      return `<h1${attrString} id="${headingId}">${textHtml}</h1>`
    })

    return { contentHtml, headings }
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(source, 'text/html')
  const headings: ContentHeading[] = []

  doc.querySelectorAll('h1').forEach((node, index) => {
    const headingTitle = normalizeHeadingText(node.textContent || '')
    if (!headingTitle) return

    const headingId = slugifyHeading(headingTitle, index)
    node.setAttribute('id', headingId)
    headings.push({
      id: headingId,
      title: headingTitle,
      order: index + 1
    })
  })

  return {
    contentHtml: doc.body.innerHTML,
    headings
  }
}

export const formatNewsDate = (dateValue: string | null | undefined) => {
  return formatDate(dateValue || null)
}

export const formatViews = (views: number | undefined) => {
  return formatCount(views)
}

export const formatCommentDate = (dateValue: string | null | undefined) => {
  return formatDate(dateValue || null)
}
