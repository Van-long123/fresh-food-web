import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { adminArticleService } from "~/services/admin/article.service";
import { adminArticleKeys } from "~/queries/article/useAdminArticlesQuery";

export const useDeleteAdminArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminArticleService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminArticleKeys.all,
        refetchType: "all",
      });
    },
  });
};
