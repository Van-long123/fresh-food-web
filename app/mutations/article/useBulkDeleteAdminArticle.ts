import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { adminArticleService } from "~/services/admin/article.service";

export const useBulkDeleteAdminArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { article_ids: string[] }) =>
      adminArticleService.bulkDelete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
    },
  });
};
