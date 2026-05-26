import { useQuery } from "@tanstack/vue-query";
import { adminArticleService } from "~/services/admin/article.service";

const adminArticleCategoryKeys = {
  all: ["admin-article-categories"] as const,
};

export const useAdminArticleCategoriesQuery = () => {
  return useQuery({
    queryKey: adminArticleCategoryKeys.all,
    queryFn: () => adminArticleService.getCategories({ limit: 1000 }),
    staleTime: 5 * 60_000,
    // Thay vì trả về toàn bộ dữ liệu thô (raw data) mà hàm queryFn (adminArticleService.getCategories()) nhận được từ API backend, thuộc tính select cho phép bạn lọc (filter) hoặc biến đổi (transform) dữ liệu đó trước khi trả về cho Component   
    select: (data) => data.data.filter((c) => c.type === "article" && c.status === "active"),
  });
};
