import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { adminArticleService } from "~/services/admin/article.service";
import { adminArticleKeys } from "~/queries/article/useAdminArticlesQuery";

export const useUpdateAdminArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
      adminArticleService.update(id, payload),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: adminArticleKeys.all,
        refetchType: "all",
      });
      if (data?._id) {
        queryClient.setQueryData(adminArticleKeys.detail(data._id), data);
      }
    },
  });
};
