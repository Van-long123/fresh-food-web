import { computed, type Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { unref } from "vue";
import { adminArticleService } from "~/services/admin/article.service";
import type { AdminArticleQueryParams } from "~/types/article.type";

export const adminArticleKeys = {
  all: ["admin-articles"] as const,
  list: (params?: AdminArticleQueryParams) =>
    ["admin-articles", "list", params] as const,
  detail: (id: string) => ["admin-articles", "detail", id] as const,
};

export const useAdminArticlesQuery = (
  params?: Ref<AdminArticleQueryParams> | AdminArticleQueryParams,
) => {
  return useQuery({
    queryKey: computed(() => adminArticleKeys.list(unref(params))),
    queryFn: () => adminArticleService.getList(unref(params)),
  });
};
