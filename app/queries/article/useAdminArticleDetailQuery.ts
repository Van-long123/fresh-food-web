import { computed, type Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { adminArticleService } from "~/services/admin/article.service";
import { adminArticleKeys } from "./useAdminArticlesQuery";

export const useAdminArticleDetailQuery = (id: Ref<string | null>) => {
  const enabled = computed(() => Boolean(id.value));

  return useQuery({
    queryKey: computed(() => adminArticleKeys.detail(id.value as string)),
    enabled,
    queryFn: () => adminArticleService.getDetail(id.value as string),
    staleTime: 60_000,
  });
};
