import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { adminArticleService } from "~/services/admin/article.service";
import { adminArticleKeys } from "~/queries/article/useAdminArticlesQuery";

export const useCreateAdminArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FormData) => adminArticleService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminArticleKeys.all,
        refetchType: "all",
      });
    },
  });
};
