import { computed, ref, watch, type Ref } from 'vue'
import { HOME_DEFAULTS } from '~/constants/home'
import { useHomeAggregateQuery } from '~/queries/home/useHomeAggregateQuery'
import { buildSliderProducts, mapHomeAggregateResponse } from '~/utils/homeMappers'
import { getScrollStep } from '~/utils/homeScroll'

const runningAnimations = new WeakMap<HTMLElement, number>()

const smoothScroll = (element: HTMLElement, targetPosition: number, duration = 700): void => {
  const previousFrame = runningAnimations.get(element)
  if (previousFrame) {
    cancelAnimationFrame(previousFrame)
  }

  const startPosition = element.scrollLeft
  const maxScroll = Math.max(0, element.scrollWidth - element.clientWidth)
  const clampedTarget = Math.min(Math.max(0, targetPosition), maxScroll)
  const distance = clampedTarget - startPosition

  if (Math.abs(distance) < 1) return

  let startTime: number | null = null

  const animation = (currentTime: number): void => {
    if (startTime === null) {
      startTime = currentTime
    }

    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easing = 1 - Math.pow(1 - progress, 4)

    element.scrollLeft = startPosition + distance * easing

    if (elapsed < duration) {
      const frameId = requestAnimationFrame(animation)
      runningAnimations.set(element, frameId)
      return
    }

    element.scrollLeft = clampedTarget
    runningAnimations.delete(element)
  }

  const frameId = requestAnimationFrame(animation)
  runningAnimations.set(element, frameId)
}

const scrollElementByStep = (element: HTMLElement, direction: 'left' | 'right'): void => {
  const step = getScrollStep(element)
  const target = direction === 'left' ? element.scrollLeft - step : element.scrollLeft + step

  smoothScroll(element, target)
}

export const useHomePage = () => {
  const homeQuery = useHomeAggregateQuery({
    campaignLimit: HOME_DEFAULTS.campaignProductLimit,
    categoryLimit: HOME_DEFAULTS.categorySectionLimit,
    categoryProductLimit: HOME_DEFAULTS.categoryProductLimit,
    blogLimit: HOME_DEFAULTS.blogLimit
  })

  const mappedHome = computed(() => mapHomeAggregateResponse(homeQuery.data.value))

  const campaignBadges = computed(() => mappedHome.value.campaigns.map((campaign) => campaign.badge))
  const sidebarCategories = computed(() => mappedHome.value.sidebarCategories)


  const activeCampaignId = ref('')

  watch(
    campaignBadges,
    (badges) => {
      if (!badges.length) {
        activeCampaignId.value = ''
        return
      }

      const hasCurrent = badges.some((badge) => badge.id === activeCampaignId.value)
      if (!hasCurrent) {
        activeCampaignId.value = badges[0].id
      }
    },
    { immediate: true }
  )

  const activeCampaign = computed(() => {
    return mappedHome.value.campaigns.find((campaign) => campaign.badge.id === activeCampaignId.value) || null
  })

  const selectedCampaignLink = computed(() => activeCampaign.value?.badge.slug || 'khuyen-mai-hot')

  const campaignDisplayProducts = computed(() => {

    return buildSliderProducts(activeCampaign.value?.products || [], 'campaign')
  })

  const categorySections = computed(() => mappedHome.value.categorySections)

  const categorySectionsDisplay = computed(() => {
    return categorySections.value.map((section) => ({
      ...section,
      sliderProducts: buildSliderProducts(section.products, section.slug)
    }))
  })

  const blogPrimaryPost = computed(() => mappedHome.value.blogs[0] || null)
  const blogSecondaryPosts = computed(() => mappedHome.value.blogs.slice(1, HOME_DEFAULTS.blogLimit))
  const blogIsEmpty = computed(() => !mappedHome.value.blogs.length)

  const isLoading = computed(() => homeQuery.isPending.value)
  const isError = computed(() => homeQuery.isError.value)
  const errorMessage = computed(() => {
    const err = homeQuery.error.value
    if (!err) return 'Khong the tai du lieu trang chu.'

    if (err instanceof Error && err.message) {
      return err.message
    }

    return 'Khong the tai du lieu trang chu.'
  })

  const campaignScrollRef = ref<HTMLElement | null>(null)
  const categoryScrollRefs = ref<Record<string, HTMLElement>>({})

  const setCategoryScrollRef = (
    slug: string,
    element: Element | { $el?: Element } | null
  ): void => {
    if (element instanceof HTMLElement) {
      categoryScrollRefs.value[slug] = element
      return
    }

    if (element && '$el' in element && element.$el instanceof HTMLElement) {
      categoryScrollRefs.value[slug] = element.$el
    }
  }

  const scrollCampaign = (direction: 'left' | 'right'): void => {
    const element = campaignScrollRef.value
    if (!element) return

    scrollElementByStep(element, direction)
  }

  const scrollCategory = (slug: string, direction: 'left' | 'right'): void => {
    const element = categoryScrollRefs.value[slug]
    if (!element) return

    scrollElementByStep(element, direction)
  }

  const setActiveCampaign = (id: string): void => {
    activeCampaignId.value = id
  }

  const retry = async (): Promise<void> => {
    await homeQuery.refetch()
  }

  return {
    sidebarCategories,
    activeCampaignId,
    campaignBadges,
    campaignDisplayProducts,
    selectedCampaignLink,
    categorySectionsDisplay,
    blogPrimaryPost,
    blogSecondaryPosts,
    blogIsEmpty,
    isLoading,
    isError,
    errorMessage,
    campaignScrollRef,
    setCategoryScrollRef,
    scrollCampaign,
    scrollCategory,
    setActiveCampaign,
    retry
  }
}
