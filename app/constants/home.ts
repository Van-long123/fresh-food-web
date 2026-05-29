export const HOME_DEFAULTS = {
  campaignProductLimit: 30,
  categorySectionLimit: 100,
  categoryProductLimit: 30,
  blogLimit: 9
} as const

export const HOME_QUERY_KEYS = {
  aggregate: ['home', 'aggregate'] as const,
  // blogs: (limit: number, featured: boolean) => ['home', 'blogs', limit, featured] as const,
  // categoryProducts: (slug: string, limit: number) => ['home', 'category-products', slug, limit] as const
}

export const HOME_CAMPAIGN_BADGE_FALLBACKS = [
  {
    id: 'khuyen_mai_hot',
    name: 'Khuyến mãi hot',
    slug: 'khuyen-mai-hot',
    color: 'bg-[#e84142]',
    textColor: 'text-white'
  },
  {
    id: 'ban_chay',
    name: 'Bán chạy',
    slug: 'ban-chay',
    color: 'bg-orange-500',
    textColor: 'text-white'
  },
  {
    id: 'doc_quyen_online',
    name: 'Độc quyền online',
    slug: 'doc-quyen-online',
    color: 'bg-gradient-to-br from-[#2563eb] via-[#0ea5e9] to-[#06b6d4]',
    textColor: 'text-white'
  },
  {
    id: 'noi_bat',
    name: 'Nổi bật',
    slug: 'noi-bat',
    color: 'bg-[#0bb5d8]',
    textColor: 'text-white'
  }
] as const

export const HOME_SECTION_STYLE_PRESETS = [
  {
    overlayClass: 'bg-gradient-to-r from-green-900/90 to-transparent',
    titleClass: 'text-[#eaff00]',
    badgeClass: 'bg-green-700 border border-green-500 text-white'
  },
  {
    overlayClass: 'bg-gradient-to-r from-emerald-900/90 to-transparent',
    titleClass: 'text-[#eaffc4]',
    badgeClass: 'bg-emerald-700 border border-emerald-500 text-white'
  },
  {
    overlayClass: 'bg-gradient-to-r from-rose-900/90 to-transparent',
    titleClass: 'text-[#ffe3e3]',
    badgeClass: 'bg-rose-700 border border-rose-500 text-white'
  },
  {
    overlayClass: 'bg-gradient-to-r from-amber-900/90 to-transparent',
    titleClass: 'text-[#ffe9c3]',
    badgeClass: 'bg-amber-700 border border-amber-500 text-white'
  },
  {
    overlayClass: 'bg-gradient-to-r from-cyan-900/90 to-transparent',
    titleClass: 'text-[#d9fbff]',
    badgeClass: 'bg-cyan-700 border border-cyan-500 text-white'
  },
  {
    overlayClass: 'bg-gradient-to-r from-orange-900/90 to-transparent',
    titleClass: 'text-[#ffefcf]',
    badgeClass: 'bg-orange-700 border border-orange-500 text-white'
  },
  {
    overlayClass: 'bg-gradient-to-r from-fuchsia-900/90 to-transparent',
    titleClass: 'text-[#ffe3ff]',
    badgeClass: 'bg-fuchsia-700 border border-fuchsia-500 text-white'
  },
  {
    overlayClass: 'bg-gradient-to-r from-slate-900/90 to-transparent',
    titleClass: 'text-[#f0f6ff]',
    badgeClass: 'bg-slate-700 border border-slate-500 text-white'
  },
  {
    overlayClass: 'bg-gradient-to-r from-red-900/90 to-transparent',
    titleClass: 'text-[#ffe6dc]',
    badgeClass: 'bg-red-700 border border-red-500 text-white'
  },
  {
    overlayClass: 'bg-gradient-to-r from-pink-900/90 to-transparent',
    titleClass: 'text-[#ffe3f4]',
    badgeClass: 'bg-pink-700 border border-pink-500 text-white'
  },
  {
    overlayClass: 'bg-gradient-to-r from-lime-900/90 to-transparent',
    titleClass: 'text-[#f2ffd4]',
    badgeClass: 'bg-lime-700 border border-lime-500 text-white'
  },
  {
    overlayClass: 'bg-gradient-to-r from-indigo-900/90 to-transparent',
    titleClass: 'text-[#e2e6ff]',
    badgeClass: 'bg-indigo-700 border border-indigo-500 text-white'
  }
] as const
