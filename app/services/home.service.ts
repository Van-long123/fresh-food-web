import {
  getHomeAggregateRequest,
  getCampaignProductsRequest
  // getHomeBlogsRequest,
  // getHomeCategoryProductsRequest
} from '~/api/client/home.api'
import type {
  HomeAggregateQueryParams,
  // HomeBlogsQueryParams,
  // HomeSectionProductsQueryParams
} from '~/types/home.type'

export const homeService = {
  getAggregate: (params: HomeAggregateQueryParams) => getHomeAggregateRequest(params),
  getCampaignProducts: (slug: string, params: any) => getCampaignProductsRequest(slug, params),
  // getCategoryProducts: (params: HomeSectionProductsQueryParams) =>
  // getHomeCategoryProductsRequest(params),
  // getBlogs: (params: HomeBlogsQueryParams) => getHomeBlogsRequest(params)
}
