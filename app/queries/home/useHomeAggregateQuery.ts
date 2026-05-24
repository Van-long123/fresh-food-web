import { useQuery } from '@tanstack/vue-query'
import { getHomeAggregateRequest } from '~/api/client/home.api'
import { HOME_DEFAULTS, HOME_QUERY_KEYS } from '~/constants/home'
import { homeService } from '~/services/home.service'
import type { HomeAggregateQueryParams } from '~/types/home.type'

export const useHomeAggregateQuery = (params?: HomeAggregateQueryParams) => {
  const mergedParams: HomeAggregateQueryParams = {
    campaignLimit: HOME_DEFAULTS.campaignProductLimit,
    categoryLimit: HOME_DEFAULTS.categorySectionLimit,
    categoryProductLimit: HOME_DEFAULTS.categoryProductLimit,
    blogLimit: HOME_DEFAULTS.blogLimit,
    includeBlogs: true,
    includeCampaigns: true,
    includeCategories: true,
    ...params
  }

  return useQuery({
    queryKey: [...HOME_QUERY_KEYS.aggregate, mergedParams],
    // queryFn: () => getHomeAggregateRequest(mergedParams),
    queryFn: () => homeService.getAggregate(mergedParams)
  })
}
