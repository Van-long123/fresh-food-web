import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { adminArticleService } from "~/services/admin/article.service";

export const useBulkUpdateAdminArticleStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      article_ids: string[];
      status: "active" | "draft" | "inactive";
    }) => adminArticleService.bulkUpdateStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
    },
  });
};
