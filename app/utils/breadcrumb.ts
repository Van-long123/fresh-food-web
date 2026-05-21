export interface BreadcrumbConfigItem {
  label: string | ((params: Record<string, string>) => string);
  to?: string;
}

export type BreadcrumbConfig = Record<string, BreadcrumbConfigItem>;

export interface ResolvedBreadcrumb {
  label: string;
  to?: string;
  active: boolean;
}

/**
 * Route pattern mappings to Vietnamese display terms.
 * Supports dynamic placeholder params such as :id.
 */
export const BREADCRUMB_CONFIG: BreadcrumbConfig = {
  "/admin": { label: "Tổng quan", to: "/admin" },
  "/admin/products": { label: "Sản phẩm", to: "/admin/products" },
  "/admin/products/create": { label: "Tạo sản phẩm", to: "/admin/products/create" },
  "/admin/products/:id/edit": { label: "Chỉnh sửa sản phẩm" },
  "/admin/categories": { label: "Danh mục", to: "/admin/categories" },
  "/admin/categories/create": { label: "Tạo danh mục", to: "/admin/categories/create" },
  "/admin/categories/:id/edit": { label: "Chỉnh sửa danh mục" },
  "/admin/orders": { label: "Đơn hàng", to: "/admin/orders" },
  "/admin/orders/:id": { label: (params) => `Chi tiết đơn hàng ${params.id || ""}` },
  "/admin/users": { label: "Người dùng", to: "/admin/users" },
  "/admin/users/create": { label: "Tạo người dùng", to: "/admin/users/create" },
  "/admin/users/:id/edit": { label: "Chỉnh sửa người dùng" },
  "/admin/vouchers": { label: "Mã giảm giá", to: "/admin/vouchers" },
  "/admin/vouchers/create": { label: "Tạo mã giảm giá", to: "/admin/vouchers/create" },
  "/admin/vouchers/:id/edit": { label: "Chỉnh sửa mã giảm giá" },
  "/admin/reviews": { label: "Đánh giá", to: "/admin/reviews" },
  "/admin/articles": { label: "Bài viết", to: "/admin/articles" },
  "/admin/articles/create": { label: "Tạo bài viết", to: "/admin/articles/create" },
  "/admin/articles/:id/edit": { label: "Chỉnh sửa bài viết" },
  "/admin/roles": { label: "Vai trò", to: "/admin/roles" },
  "/admin/roles/create": { label: "Tạo vai trò", to: "/admin/roles/create" },
  "/admin/roles/:id/edit": { label: "Chỉnh sửa vai trò" },
  "/admin/payments": { label: "Thanh toán", to: "/admin/payments" },
  "/admin/settings": { label: "Cài đặt", to: "/admin/settings" },
  "/admin/pricing": { label: "Gói dịch vụ", to: "/admin/pricing" },
  "/admin/maintenance": { label: "Bảo trì", to: "/admin/maintenance" },
};

/**
 * Matches a concrete path segment-by-segment against a pattern mapping (like /admin/products/:id/edit).
 * Extract matched parameters if the patterns match.
 */
export function matchPathPattern(
  path: string,
  pattern: string,
): Record<string, string> | null {
  const pathParts = path.split("/");
  const patternParts = pattern.split("/");

  if (pathParts.length !== patternParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart.startsWith(":")) {
      const paramName = patternPart.slice(1);
      params[paramName] = pathPart;
    } else if (patternPart.toLowerCase() !== pathPart.toLowerCase()) {
      return null;
    }
  }

  return params;
}

/**
 * Resolves the full breadcrumb sequence for a given route path and its params.
 */
export function resolveBreadcrumbs(
  currentPath: string,
  currentParams: Record<string, string | string[]>,
): ResolvedBreadcrumb[] {
  // Normalize trailing slashes
  const normalizedPath = currentPath.replace(/\/$/, "") || "/";
  const segments = normalizedPath.split("/");

  const breadcrumbs: ResolvedBreadcrumb[] = [];
  let cumulative = "";
  const levels: string[] = [];

  for (let i = 0; i < segments.length; i++) {
    if (i === 0 && segments[i] === "") {
      continue;
    }
    cumulative += "/" + segments[i];
    levels.push(cumulative);
  }

  if (levels.length === 0) {
    levels.push("/admin");
  }

  // Ensure home/dashboard root /admin is always present if in admin scope
  if (normalizedPath.startsWith("/admin") && !levels.includes("/admin")) {
    levels.unshift("/admin");
  }

  for (const levelPath of levels) {
    let matchedConfig = BREADCRUMB_CONFIG[levelPath];
    let resolvedParams: Record<string, string> = {};

    if (!matchedConfig) {
      // Find parameter-based pattern matches
      for (const pattern in BREADCRUMB_CONFIG) {
        const match = matchPathPattern(levelPath, pattern);
        if (match) {
          matchedConfig = BREADCRUMB_CONFIG[pattern];
          resolvedParams = match;
          break;
        }
      }
    }

    if (matchedConfig) {
      // Consolidate extracted parameter values
      const mergedParams = {
        ...resolvedParams,
        ...Object.keys(currentParams).reduce(
          (acc, key) => {
            const val = currentParams[key];
            acc[key] = Array.isArray(val) ? val[0] : val;
            return acc;
          },
          {} as Record<string, string>,
        ),
      };

      const label =
        typeof matchedConfig.label === "function"
          ? matchedConfig.label(mergedParams)
          : matchedConfig.label;

      breadcrumbs.push({
        label,
        to: matchedConfig.to || undefined,
        active: levelPath === normalizedPath,
      });
    }
  }

  // Deduplicate consecutive identical labels if any
  return breadcrumbs.filter(
    (item, index, self) => self.findIndex((t) => t.label === item.label) === index,
  );
}
