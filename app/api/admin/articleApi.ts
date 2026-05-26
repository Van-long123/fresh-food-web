import { API_ENDPOINTS } from "~/constants/api";
import { getAuthorizedAxios } from "~/utils/authorizedAxios";
import type {
  AdminArticlePayload,
  AdminArticleQueryParams,
  ArticleDetailResponse,
  ArticleListResponse,
} from "~/types/article.type";

export const getAdminArticlesRequest = async (
  params?: AdminArticleQueryParams,
): Promise<ArticleListResponse> => {
  const response = await getAuthorizedAxios().get(
    API_ENDPOINTS.ADMIN.ARTICLE.LIST,
    { params },
  );
  return response.data;
};

export const getAdminArticleDetailRequest = async (
  id: string,
): Promise<ArticleDetailResponse> => {
  const response = await getAuthorizedAxios().get(
    API_ENDPOINTS.ADMIN.ARTICLE.DETAIL(id),
  );
  return response.data?.data || response.data;
};

export const createAdminArticleRequest = async (
  payload: AdminArticlePayload | FormData,
): Promise<ArticleDetailResponse> => {
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
  const response = await getAuthorizedAxios().post(
    API_ENDPOINTS.ADMIN.ARTICLE.CREATE,
    payload,
    {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
    },
  );
  return response.data?.data || response.data;
};

export const updateAdminArticleRequest = async (
  id: string,
  payload: Partial<AdminArticlePayload> | FormData,
): Promise<ArticleDetailResponse> => {
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
  const response = await getAuthorizedAxios().put(
    API_ENDPOINTS.ADMIN.ARTICLE.UPDATE(id),
    payload,
    {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
    },
  );
  return response.data?.data || response.data;
};

export const deleteAdminArticleRequest = async (
  id: string,
): Promise<ArticleDetailResponse> => {
  const response = await getAuthorizedAxios().delete(
    API_ENDPOINTS.ADMIN.ARTICLE.DELETE(id),
  );
  return response.data?.data || response.data;
};

export const updateAdminArticleBulkStatusRequest = async (payload: {
  article_ids: string[];
  status: "active" | "draft" | "inactive";
}): Promise<{ updatedCount: number }> => {
  const response = await getAuthorizedAxios().put(
    API_ENDPOINTS.ADMIN.ARTICLE.BULK_STATUS,
    payload,
  );
  return response.data;
};

export const deleteAdminArticlesBulkRequest = async (payload: {
  article_ids: string[];
}): Promise<{ deletedCount: number }> => {
  const response = await getAuthorizedAxios().delete(
    API_ENDPOINTS.ADMIN.ARTICLE.BULK_DELETE,
    { data: payload },
  );
  return response.data;
};
