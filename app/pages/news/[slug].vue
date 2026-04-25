<template>
  <div class="article-shell">
    <div
      class="fixed left-0 top-0 z-50 h-1 bg-linear-to-r from-orange-500 via-orange-600 to-green-600 transition-[width] duration-150"
      :style="{ width: `${readingProgress}%` }"
    />

    <main
      v-if="loading"
      class="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8"
    >
      <Skeleton height="24px" width="220px" borderRadius="0.5rem" />
      <Skeleton class="mt-4" height="360px" borderRadius="1.5rem" />
      <div
        class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
      >
        <div class="space-y-4">
          <Skeleton height="34px" width="70%" />
          <Skeleton height="18px" width="100%" />
          <Skeleton height="18px" width="92%" />
          <Skeleton height="18px" width="95%" />
        </div>
        <div class="space-y-3">
          <Skeleton height="180px" borderRadius="1rem" />
          <Skeleton height="180px" borderRadius="1rem" />
        </div>
      </div>
    </main>

    <template v-else>
      <section class="hero-wrap px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <div class="mx-auto w-full max-w-6xl">
          <nav
            aria-label="Breadcrumb"
            class="mb-4 flex items-center gap-2 text-sm text-slate-500"
          >
            <NuxtLink :to="ROUTES.HOME" class="hover:text-orange-600"
              >Trang chu</NuxtLink
            >
            <i class="pi pi-angle-right text-xs" />
            <NuxtLink :to="ROUTES.NEWS" class="hover:text-orange-600"
              >Tin tuc</NuxtLink
            >
            <i class="pi pi-angle-right text-xs" />
            <span class="line-clamp-1 text-slate-700">{{ article.title }}</span>
          </nav>

          <header class="hero-card">
            <img :src="article.cover" :alt="article.title" class="hero-image" />
            <div class="hero-overlay" />
            <button
              type="button"
              aria-label="Mo menu chia se"
              class="share-toggle"
              @click="showShareMenu = !showShareMenu"
            >
              <i class="pi pi-share-alt" />
            </button>
            <div v-if="showShareMenu" class="share-popover">
              <button
                type="button"
                class="share-row"
                @click="shareArticle('facebook')"
              >
                <i class="pi pi-facebook text-blue-600" /> Facebook
              </button>
              <button
                type="button"
                class="share-row"
                @click="shareArticle('zalo')"
              >
                <i class="pi pi-comments text-green-600" /> Zalo
              </button>
              <button
                type="button"
                class="share-row"
                @click="shareArticle('copy')"
              >
                <i class="pi pi-link text-orange-600" /> Sao chep lien ket
              </button>
            </div>

            <div class="hero-content">
              <p class="hero-kicker">SmartFood Journal</p>
              <h1 class="hero-title">{{ article.title }}</h1>
              <div
                class="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/90"
              >
                <Avatar
                  :label="article.authorInitial"
                  shape="circle"
                  class="bg-orange-500! text-white!"
                />
                <span>{{ article.author }}</span>
                <span>•</span>
                <span>{{ article.date }}</span>
                <span>•</span>
                <span>{{ article.readTime }} phut doc</span>
              </div>
            </div>
          </header>
        </div>
      </section>

      <main
        class="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 pb-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8"
      >
        <article
          class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >
          <details
            class="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:hidden"
          >
            <summary class="cursor-pointer text-sm font-bold text-slate-900">
              Muc luc bai viet
            </summary>
            <div class="mt-3 space-y-1">
              <button
                v-for="item in sections"
                :key="item.id"
                type="button"
                class="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-orange-50"
                @click="scrollTo(item.id)"
              >
                {{ item.title }}
              </button>
            </div>
          </details>

          <p class="lead reveal">
            {{ article.intro }}
          </p>

          <section
            v-for="(section, index) in sections"
            :id="section.id"
            :key="section.id"
            class="reveal mt-10 scroll-mt-28"
          >
            <h2 class="section-title">{{ index + 1 }}. {{ section.title }}</h2>
            <p class="mt-4 text-base leading-8 text-slate-700">
              {{ section.p1 }}
            </p>
            <p class="mt-4 text-base leading-8 text-slate-700">
              {{ section.p2 }}
            </p>

            <div
              v-if="section.highlight"
              class="mt-5 rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm italic text-orange-900"
            >
              {{ section.highlight }}
            </div>

            <figure
              v-if="section.image"
              class="mt-6 overflow-hidden rounded-2xl border border-slate-200"
            >
              <img
                :src="section.image"
                :alt="section.title"
                class="h-64 w-full object-cover sm:h-80"
              />
              <figcaption class="bg-white px-4 py-3 text-sm text-slate-500">
                Minh hoa noi dung thuc hanh dinh duong trong doi song hang ngay.
              </figcaption>
            </figure>

            <ol v-if="section.steps?.length" class="mt-5 space-y-2">
              <li
                v-for="(step, stepIndex) in section.steps"
                :key="step"
                class="step-row"
              >
                <span>{{ stepIndex + 1 }}</span>
                <p>{{ step }}</p>
              </li>
            </ol>

            <blockquote
              v-if="section.quote"
              class="mt-6 rounded-2xl border-l-4 border-orange-500 bg-slate-50 px-5 py-4 text-slate-700"
            >
              <p class="text-lg italic leading-8">"{{ section.quote }}"</p>
              <cite class="mt-2 block text-sm text-slate-500"
                >- Chuyen gia dinh duong SmartFood</cite
              >
            </blockquote>

            <Divider class="my-8!" />
          </section>

          <section class="reveal">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in tags"
                :key="tag"
                type="button"
                class="tag-chip"
              >
                #{{ tag }}
              </button>
            </div>
          </section>

          <section
            class="reveal mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <button
              type="button"
              class="reaction orange"
              :class="{ active: liked }"
              @click="toggleLike"
            >
              Thich ({{ likeCount }})
            </button>
            <button
              type="button"
              class="reaction green"
              :class="{ active: saved }"
              @click="saved = !saved"
            >
              Luu bai viet
            </button>
          </section>

          <section class="reveal mt-10" aria-labelledby="comment-title">
            <h2 id="comment-title" class="text-2xl font-black text-slate-900">
              Binh luan ({{ comments.length }})
            </h2>

            <div class="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div class="flex gap-3">
                <Avatar
                  label="U"
                  shape="circle"
                  class="bg-orange-100! text-orange-700!"
                />
                <div class="w-full">
                  <textarea
                    v-model="newComment"
                    :rows="commentFocused ? 4 : 2"
                    placeholder="Chia se goc nhin cua ban..."
                    class="comment-box"
                    @focus="commentFocused = true"
                    @blur="commentFocused = false"
                  />
                  <div class="mt-3 flex justify-end">
                    <Button
                      label="Gui binh luan"
                      :disabled="!newComment.trim()"
                      @click="submitComment"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 space-y-3">
              <article
                v-for="comment in comments"
                :key="comment.id"
                class="comment-card"
              >
                <div class="flex gap-3">
                  <Avatar
                    :label="comment.initial"
                    shape="circle"
                    class="bg-green-100! text-green-700!"
                  />
                  <div>
                    <p class="text-sm font-bold text-slate-900">
                      {{ comment.name }}
                    </p>
                    <p class="text-xs text-slate-500">{{ comment.time }}</p>
                    <p class="mt-2 text-sm leading-7 text-slate-700">
                      {{ comment.content }}
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </article>

        <aside class="sidebar" :class="{ elevated: sidebarElevated }">
          <section class="panel">
            <h3 class="text-base font-black text-slate-900">Muc luc</h3>
            <button
              v-for="item in sections"
              :key="item.id"
              type="button"
              class="toc-item"
              :class="{ active: activeSection === item.id }"
              @click="scrollTo(item.id)"
            >
              {{ item.title }}
            </button>
          </section>

          <section class="panel text-center">
            <Avatar
              :label="article.authorInitial"
              shape="circle"
              class="mx-auto h-16 w-16 bg-orange-500! text-white!"
            />
            <p class="mt-3 text-lg font-black text-slate-900">
              {{ article.author }}
            </p>
            <p class="text-sm text-green-700">Chuyen gia dinh duong</p>
            <p class="mt-2 text-sm leading-6 text-slate-600">
              Dong hanh cung SmartFood trong cac chu de an sach, song khoe va
              toi uu thuc don.
            </p>
          </section>

          <section class="panel">
            <h3 class="text-base font-black text-slate-900">
              Bai viet pho bien
            </h3>
            <NuxtLink
              v-for="(item, idx) in popularArticles"
              :key="item.id"
              :to="ROUTES.NEWS_DETAIL(item.slug)"
              class="popular-row"
            >
              <span>{{ String(idx + 1).padStart(2, "0") }}</span>
              <div>
                <p>{{ item.title }}</p>
                <small>{{ item.views }} luot xem</small>
              </div>
            </NuxtLink>
          </section>
        </aside>
      </main>

      <section class="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-black text-slate-900">Co the ban quan tam</h2>
        <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="item in relatedArticles"
            :key="item.id"
            :to="ROUTES.NEWS_DETAIL(item.slug)"
            class="related-card"
          >
            <img
              :src="item.cover"
              :alt="item.title"
              class="h-40 w-full rounded-xl object-cover"
            />
            <p
              class="mt-3 text-xs font-bold uppercase tracking-wide text-orange-600"
            >
              {{ item.category }}
            </p>
            <h3 class="mt-1 line-clamp-2 text-lg font-black text-slate-900">
              {{ item.title }}
            </h3>
            <p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
              {{ item.excerpt }}
            </p>
          </NuxtLink>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ROUTES } from "~/constants/routes";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";

useHead({
  title: "Chi tiết tin tức - SmartFood",
  meta: [
    { name: "description", content: "Trang Chi tiết tin tức của SmartFood" },
  ],
});

type Section = {
  id: string;
  title: string;
  p1: string;
  p2: string;
  highlight?: string;
  image?: string;
  quote?: string;
  steps?: string[];
};

type Article = {
  slug: string;
  title: string;
  category: string;
  author: string;
  authorInitial: string;
  date: string;
  readTime: number;
  cover: string;
  intro: string;
  sections: Section[];
};

type CommentItem = {
  id: number;
  initial: string;
  name: string;
  time: string;
  content: string;
};

const loading = ref(true);
const route = useRoute();
const slug = computed(() =>
  String(route.params.slug || "immune-foods-everyday"),
);

const articleDB: Article[] = [
  {
    slug: "immune-foods-everyday",
    title: "5 Thuc pham giup tang suc de khang ban nen an moi ngay",
    category: "Dinh duong",
    author: "Lena Nguyen",
    authorInitial: "L",
    date: "03/04/2026",
    readTime: 7,
    cover:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1400&q=80",
    intro:
      "Suc de khang khong chi den tu vien bo sung, ma con tu cach ban an, nghi ngoi va quan ly nhịp sinh hoat. Bai viet nay goi y mot khung thuc hanh de ban bat dau de dang va duy tri ben vung.",
    sections: [
      {
        id: "tong-quan",
        title: "Tai sao dinh duong quyet dinh suc de khang",
        p1: "Khi co the duoc cung cap chat xơ, vitamin va khoang chat can thiet, he mien dich co du nguyen lieu de phan ung nhanh hon truoc tac nhan gay benh. Dieu quan trong la su deu dan, khong phai nhung dot no luc ngan han.",
        p2: "Nhip song nhanh de dan den bo bua, an toi muon hoac phu thuoc thuc pham che bien. Cac thoi quen nay lam roi nhip duong huyet va anh huong truc tiep den nang luong, giac ngu va kha nang phuc hoi.",
        highlight:
          "Bat dau tu thay doi nho: moi bua trua them mot phan rau mau dam.",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "nhom-thuc-pham",
        title: "5 nhom thuc pham nen co trong tuan",
        p1: "Rau la xanh, trai cay giau vitamin C, dam chat luong cao, thuc pham len men va chat beo tot la nhom nen duoc luan phien thuong xuyen. Su ket hop nay tao ra bo nen can bang cho he mien dich va he tieu hoa.",
        p2: "Ban khong can an phuc tap. Uu tien cach che bien gon, it dau mo, it duong va han che vi man. Thoi quen nho lap lai moi ngay se hieu qua hon mot ke hoach qua tham vong.",
        quote: "An lanh manh la mot he thong, khong phai mot bai test y chi.",
        steps: [
          "Moi bua co rau va dam",
          "Chon trai cay nguyen qua thay do uong nuoc ngot",
          "Them 3 bua len men moi tuan",
          "Uong nuoc deu trong ngay",
        ],
      },
      {
        id: "ung-dung",
        title: "Ung dung cho lich lam viec ban ron",
        p1: "Hay chia nho cong viec theo block vao cuoi tuan: so che rau, chuan bi dam nen, va chia khau phan co ban. Trong tuan ban chi can ghep nhanh la co bua an can bang.",
        p2: "Ket hop them ngu som va van dong nhe 20-30 phut moi ngay, ban se thay doi ro chat luong nang luong va muc tap trung. Dinh duong hieu qua can di cung giac ngu va quan ly stress.",
        highlight:
          "Muc tieu 1 phan tram moi ngay de tao buoc nhay lon trong 30 ngay.",
        image:
          "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
];

const article = computed(
  () => articleDB.find((item) => item.slug === slug.value) || articleDB[0]!,
);
const sections = computed(() => article.value.sections);

const tags = ["dinh-duong", "an-sach", "song-khoe", "smartfood"];

const relatedArticles = [
  {
    id: 1,
    slug: "smart-grocery-budget",
    title: "How To Cut Grocery Costs Without Compromising Nutrition",
    category: "Shopping Tips",
    excerpt:
      "Len ngan sach thong minh de tiet kiem ma van giu chat luong bua an.",
    cover:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    slug: "quick-healthy-lunches",
    title: "7 Quick Lunch Ideas For Busy Weekdays",
    category: "Recipes",
    excerpt: "Goi y bua trua nhanh gon, can bang va de duy tri lau dai.",
    cover:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    slug: "seasonal-fruits-guide",
    title: "Seasonal Fruit Guide: What To Buy This Month",
    category: "Tips",
    excerpt: "Huong dan chon trai cay theo mua de ngon hon va toi uu chi phi.",
    cover:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80",
  },
];

const popularArticles = [
  {
    id: 1,
    slug: "smart-grocery-budget",
    title: "Cat chi phi di cho thong minh",
    views: "12.8K",
  },
  {
    id: 2,
    slug: "quick-healthy-lunches",
    title: "Bua trua nhanh cho dan van phong",
    views: "9.1K",
  },
  {
    id: 3,
    slug: "seasonal-fruits-guide",
    title: "Trai cay theo mua nen mua",
    views: "8.4K",
  },
  {
    id: 4,
    slug: "immune-foods-everyday",
    title: "Top thuc pham tang de khang",
    views: "7.9K",
  },
];

const comments = ref<CommentItem[]>([
  {
    id: 1,
    initial: "H",
    name: "Ha Tran",
    time: "2 gio truoc",
    content:
      "Bai viet ro rang va de ap dung. Minh da bat dau tu phan rau trong bua trua.",
  },
  {
    id: 2,
    initial: "P",
    name: "Phuc Nguyen",
    time: "Hom qua",
    content: "Phan chia block cuoi tuan rat huu ich cho nguoi di lam.",
  },
]);

const showShareMenu = ref(false);
const copied = ref(false);
const likeCount = ref(124);
const liked = ref(false);
const saved = ref(false);
const commentFocused = ref(false);
const newComment = ref("");
const readingProgress = ref(0);
const sidebarElevated = ref(false);
const activeSection = ref(sections.value[0]?.id || "");

let sectionObserver: IntersectionObserver | null = null;
let revealObserver: IntersectionObserver | null = null;

const updateProgress = () => {
  const root = document.documentElement;
  const total = root.scrollHeight - root.clientHeight;
  readingProgress.value =
    total > 0 ? Math.min(100, (root.scrollTop / total) * 100) : 0;
  sidebarElevated.value = root.scrollTop > 280;
};

const scrollTo = (id: string) => {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
};

const shareArticle = async (channel: string) => {
  if (channel === "copy") {
    try {
      await navigator.clipboard.writeText(window.location.href);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 1200);
    } catch {
      copied.value = false;
    }
  }

  showShareMenu.value = false;
};

const toggleLike = () => {
  liked.value = !liked.value;
  likeCount.value += liked.value ? 1 : -1;
};

const submitComment = () => {
  const content = newComment.value.trim();
  if (!content) return;

  comments.value.unshift({
    id: Date.now(),
    initial: "U",
    name: "Ban",
    time: "Vua xong",
    content,
  });

  newComment.value = "";
};

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 520);

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        activeSection.value = entry.target.id;
      });
    },
    { threshold: 0.3 },
  );

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.15 },
  );

  setTimeout(() => {
    sections.value.forEach((section) => {
      const node = document.getElementById(section.id);
      if (node) sectionObserver?.observe(node);
    });

    document
      .querySelectorAll(".reveal")
      .forEach((node) => revealObserver?.observe(node));
  }, 650);
});

onUnmounted(() => {
  sectionObserver?.disconnect();
  revealObserver?.disconnect();
  window.removeEventListener("scroll", updateProgress);
});
</script>

<style scoped>
.article-shell {
  background:
    radial-gradient(
      circle at 10% -10%,
      rgba(249, 115, 22, 0.09),
      transparent 35%
    ),
    radial-gradient(
      circle at 90% -15%,
      rgba(22, 163, 74, 0.08),
      transparent 30%
    ),
    #f8fafc;
  color: #0f172a;
  min-height: 100vh;
  padding-bottom: 88px;
}

.hero-wrap {
  background: linear-gradient(180deg, #fff7ed, transparent);
}

.hero-card {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  min-height: 380px;
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.14);
}

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(2, 6, 23, 0.18),
    rgba(2, 6, 23, 0.75)
  );
}

.hero-content {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  z-index: 10;
  padding: 2rem;
}

.hero-kicker {
  width: fit-content;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.32);
  color: white;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 0.38rem 0.7rem;
}

.hero-title {
  margin-top: 0.85rem;
  color: white;
  font-weight: 900;
  line-height: 1.15;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  max-width: 22ch;
}

.share-toggle {
  position: absolute;
  right: 1rem;
  top: 1rem;
  z-index: 11;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  color: white;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(6px);
}

.share-popover {
  position: absolute;
  right: 1rem;
  top: 4rem;
  z-index: 12;
  width: 13rem;
  border-radius: 0.9rem;
  border: 1px solid #e2e8f0;
  background: white;
  padding: 0.35rem;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.2);
}

.share-row {
  width: 100%;
  border: 0;
  background: transparent;
  border-radius: 0.65rem;
  text-align: left;
  padding: 0.58rem 0.65rem;
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.share-row:hover {
  background: #fff7ed;
}

.lead {
  border-left: 4px solid #f97316;
  padding-left: 1rem;
  color: #334155;
  font-size: 1.09rem;
  line-height: 1.95;
}

.section-title {
  font-size: 1.45rem;
  line-height: 1.3;
  font-weight: 900;
  color: #0f172a;
}

.step-row {
  display: grid;
  grid-template-columns: 2rem 1fr;
  gap: 0.7rem;
  align-items: start;
}

.step-row span {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  display: grid;
  place-items: center;
  font-size: 0.84rem;
  font-weight: 800;
  color: #c2410c;
  background: #ffedd5;
}

.step-row p {
  margin: 0;
  color: #475569;
  line-height: 1.8;
}

.tag-chip {
  border-radius: 9999px;
  border: 1px solid #fed7aa;
  background: #fff7ed;
  color: #c2410c;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.4rem 0.68rem;
}

.share-circle {
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 9999px;
  display: grid;
  place-items: center;
  border: 0;
  color: white;
  font-weight: 700;
}

.reaction {
  border-radius: 9999px;
  padding: 0.55rem 1rem;
  border: 1.5px solid;
  font-weight: 700;
  font-size: 0.86rem;
}

.reaction.orange {
  color: #ea580c;
  border-color: #fb923c;
  background: white;
}

.reaction.green {
  color: #15803d;
  border-color: #4ade80;
  background: white;
}

.reaction.orange.active {
  background: #f97316;
  color: white;
  border-color: #f97316;
}

.reaction.green.active {
  background: #16a34a;
  color: white;
  border-color: #16a34a;
}

.comment-box {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid #cbd5e1;
  min-height: 2.9rem;
  padding: 0.65rem 0.8rem;
  resize: vertical;
}

.comment-box:focus {
  outline: none;
  border-color: #f97316;
}

.comment-card {
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  background: white;
  padding: 0.9rem;
}

.sidebar {
  position: sticky;
  top: 5.8rem;
  align-self: start;
  display: grid;
  gap: 0.9rem;
  transition: filter 0.25s ease;
}

.sidebar.elevated {
  filter: drop-shadow(0 14px 28px rgba(15, 23, 42, 0.15));
}

.panel {
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  background: white;
  padding: 0.9rem;
}

.toc-item {
  width: 100%;
  border: 0;
  border-left: 2px solid transparent;
  border-radius: 0.6rem;
  text-align: left;
  padding: 0.52rem 0.58rem;
  margin-top: 0.3rem;
  color: #475569;
  background: transparent;
}

.toc-item.active {
  color: #9a3412;
  border-left-color: #f97316;
  background: #fff7ed;
  font-weight: 700;
}

.popular-row {
  display: grid;
  grid-template-columns: 2rem 1fr;
  gap: 0.6rem;
  margin-top: 0.5rem;
}

.popular-row span {
  font-size: 1.45rem;
  line-height: 1;
  font-weight: 900;
  color: rgba(249, 115, 22, 0.4);
}

.popular-row p {
  margin: 0;
  font-size: 0.86rem;
  font-weight: 700;
  color: #0f172a;
}

.popular-row small {
  color: #64748b;
  font-size: 0.73rem;
}

.related-card {
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  background: white;
  padding: 0.75rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.related-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 22px rgba(15, 23, 42, 0.12);
}

.reveal {
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.mobile-share {
  position: fixed;
  left: 50%;
  bottom: 0.8rem;
  transform: translateX(-50%);
  z-index: 40;
  display: flex;
  gap: 0.45rem;
  padding: 0.52rem 0.62rem;
  border-radius: 9999px;
  background: rgba(15, 23, 42, 0.86);
}

@media (max-width: 1024px) {
  .sidebar {
    position: static;
  }
}

@media (max-width: 640px) {
  .hero-card {
    min-height: 330px;
    border-radius: 1.1rem;
  }

  .hero-content {
    padding: 1.2rem;
  }
}
</style>
