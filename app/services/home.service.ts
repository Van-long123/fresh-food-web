import {
  getHomeAggregateRequest,
  // getHomeBlogsRequest,
  // getHomeCategoryProductsRequest
} from '~/api/home.api'
import type {
  HomeAggregateQueryParams,
  // HomeBlogsQueryParams,
  // HomeSectionProductsQueryParams
} from '~/types/home.type'

export const homeService = {
  getAggregate: (params: HomeAggregateQueryParams) => getHomeAggregateRequest(params),
  // getCategoryProducts: (params: HomeSectionProductsQueryParams) =>
  //   getHomeCategoryProductsRequest(params),
  // getBlogs: (params: HomeBlogsQueryParams) => getHomeBlogsRequest(params)
}
