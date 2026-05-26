import {
  createAdminArticleRequest,
  deleteAdminArticleRequest,
  deleteAdminArticlesBulkRequest,
  getAdminArticleDetailRequest,
  getAdminArticlesRequest,
  updateAdminArticleBulkStatusRequest,
  updateAdminArticleRequest,
} from "~/api/admin/articleApi";
import { getAdminCategoriesRequest } from "~/api/admin/productApi";
import type {
  AdminArticlePayload,
  AdminArticleQueryParams,
  ArticleDetailResponse,
  ArticleListResponse,
  CategoryListResponse,
} from "~/types/article.type";
import { slugify } from "~/utils/formatters";

export const adminArticleService = {
  getList: (params?: AdminArticleQueryParams): Promise<ArticleListResponse> =>
    getAdminArticlesRequest(params),

  getDetail: (id: string): Promise<ArticleDetailResponse> =>
    getAdminArticleDetailRequest(id),

  create: (payload: FormData): Promise<ArticleDetailResponse> =>
    createAdminArticleRequest(payload),

  update: (
    id: string,
    payload: FormData | Record<string, any>,
  ): Promise<ArticleDetailResponse> => updateAdminArticleRequest(id, payload),

  delete: (id: string): Promise<ArticleDetailResponse> =>
    deleteAdminArticleRequest(id),

  bulkUpdateStatus: (payload: {
    article_ids: string[];
    status: "active" | "draft" | "inactive";
  }): Promise<{ updatedCount: number }> =>
    updateAdminArticleBulkStatusRequest(payload),

  bulkDelete: (payload: { article_ids: string[] }): Promise<{ deletedCount: number }> =>
    deleteAdminArticlesBulkRequest(payload),

  getCategories: (params?: any): Promise<CategoryListResponse> =>
    getAdminCategoriesRequest(params),
};

interface ArticleFormData {
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  thumbnail: string | File;
  authorName: string;
  readTime: number;
  views?: number;
  publishedAt?: string | null;
  status: "active" | "draft" | "inactive";
  featured: boolean;
  position?: number | null;
  primary_category_id: string | null;
  category_ids: string[];
  tags: string[];
}

const appendField = (fd: FormData, key: string, value: unknown) => {
  if (value === null || value === undefined) return;
  fd.append(key, String(value));
};

export const buildCreateArticlePayload = (form: ArticleFormData): FormData => {
  const fd = new FormData();

  appendField(fd, "title", form.title.trim());
  appendField(fd, "slug", form.slug.trim() || slugify(form.title));
  appendField(fd, "shortDescription", form.shortDescription || "");
  appendField(fd, "content", form.content || "");
  appendField(fd, "authorName", form.authorName || "");
  appendField(fd, "readTime", form.readTime ?? 0);
  appendField(fd, "views", form.views ?? 0);
  appendField(fd, "publishedAt", form.publishedAt || "");
  appendField(fd, "status", form.status || "draft");
  appendField(fd, "featured", String(form.featured ?? false));
  appendField(fd, "position", form.position ?? 0);
  appendField(fd, "primary_category_id", form.primary_category_id || "");

  (form.tags || []).forEach((tag) => fd.append("tags", tag));
  (form.category_ids || []).forEach((id) => fd.append("category_ids", id));

  if (form.thumbnail instanceof File) {
    fd.append("thumbnail", form.thumbnail, form.thumbnail.name);
  } else if (typeof form.thumbnail === "string" && form.thumbnail) {
    fd.append("thumbnail_url", form.thumbnail);
  }

  return fd;
};

export const buildUpdateArticlePayload = (form: ArticleFormData): FormData => {
  const fd = new FormData();

  appendField(fd, "title", form.title.trim());
  appendField(fd, "slug", form.slug.trim());
  appendField(fd, "shortDescription", form.shortDescription || "");
  appendField(fd, "content", form.content || "");
  appendField(fd, "authorName", form.authorName || "");
  appendField(fd, "readTime", form.readTime ?? 0);
  appendField(fd, "views", form.views ?? 0);
  appendField(fd, "publishedAt", form.publishedAt || "");
  appendField(fd, "status", form.status || "draft");
  appendField(fd, "featured", String(form.featured ?? false));
  appendField(fd, "position", form.position ?? 0);
  appendField(fd, "primary_category_id", form.primary_category_id || "");

  (form.tags || []).forEach((tag) => fd.append("tags", tag));
  (form.category_ids || []).forEach((id) => fd.append("category_ids", id));

  if (form.thumbnail instanceof File) {
    fd.append("thumbnail", form.thumbnail, form.thumbnail.name);
  } else if (typeof form.thumbnail === "string" && form.thumbnail) {
    fd.append("thumbnail_url", form.thumbnail);
  }

  return fd;
};

export type { AdminArticlePayload };
