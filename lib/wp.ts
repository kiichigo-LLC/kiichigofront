import { KIICHIGO_API_URL, WP_API_URL } from "./config";
import { resolveFeaturedImageUrl } from "./featured-image";
import { metaString, type PostMeta } from "./post-meta";

export type WpPost = {
  id: number;
  slug: string;
  title: { rendered: string };
  date: string;
};

export type WpPage = {
  id: number;
  slug: string;
  title: { rendered: string };
  content?: { rendered: string };
};

export type HomeData = {
  message: string;
  last_generated: string;
};

export type NavNewFlags = {
  web: boolean;
  koe: boolean;
  trajectory: boolean;
};

/** カテゴリ slug → ID（WP 本番と同じ想定。変わったらここだけ更新） */
export const CATEGORY_IDS: Record<keyof NavNewFlags, number> = {
  web: 2,
  koe: 3,
  trajectory: 4,
};

export type CategoryArchiveItem = {
  id: number;
  slug: string;
  title: string;
  permalink: string;
  featured_image: string;
  youtube: string;
  h3: string;
  date_label: string;
  meta: PostMeta;
};

export type WpTermEmbed = {
  id: number;
  name: string;
  slug: string;
  link: string;
  taxonomy: string;
};

export type WpPostRest = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
  content?: { rendered: string };
  link: string;
  date: string;
  categories?: number[];
  tags?: number[];
  featured_media?: number;
  meta?: PostMeta;
  featured_image_url?: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
    "wp:term"?: WpTermEmbed[][];
  };
};

async function wpFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${WP_API_URL.replace(/\/$/, "")}${path}`;
  const res = await fetch(url, {
    ...init,
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`WP API ${res.status}: ${url}`);
  }
  return res.json() as Promise<T>;
}

async function kiichigoFetch<T>(path: string): Promise<T> {
  const url = `${KIICHIGO_API_URL.replace(/\/$/, "")}${path}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Kiichigo API ${res.status}: ${url}`);
  }
  return res.json() as Promise<T>;
}

export async function getSiteInfo(): Promise<{
  name?: string;
  description?: string;
}> {
  const root = WP_API_URL.replace(/\/wp\/v2\/?$/, "");
  const res = await fetch(root, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`WP API root ${res.status}`);
  return res.json();
}

export async function getPageBySlug(slug: string): Promise<WpPage | null> {
  try {
    const pages = await wpFetch<WpPage[]>(
      `/pages?slug=${encodeURIComponent(slug)}`
    );
    return pages[0] ?? null;
  } catch {
    return null;
  }
}

/** 標準 REST 以外: wp_options の AI 文言のみ */
export async function getHomeData(): Promise<HomeData> {
  try {
    return await kiichigoFetch<HomeData>("/home");
  } catch {
    return { message: "まだ生成されていません", last_generated: "" };
  }
}

/** ナビの「new」— 各カテゴリ最新投稿が7日以内か（Next 側で計算） */
export async function getNavNewFlags(): Promise<NavNewFlags> {
  const now = Date.now();
  const flags: NavNewFlags = { web: false, koe: false, trajectory: false };

  await Promise.all(
    (Object.entries(CATEGORY_IDS) as [keyof NavNewFlags, number][]).map(
      async ([slug, categoryId]) => {
        try {
          const posts = await wpFetch<WpPostRest[]>(
            `/posts?categories=${categoryId}&per_page=1&orderby=date&order=desc`
          );
          const post = posts[0];
          if (!post?.date) return;
          const entry = new Date(post.date).getTime();
          flags[slug] = (now - entry) / (86400 * 1000) < 7;
        } catch {
          /* ignore */
        }
      }
    )
  );

  return flags;
}

export async function getCategoryIdBySlug(slug: string): Promise<number | null> {
  const cats = await wpFetch<Array<{ id: number }>>(
    `/categories?slug=${encodeURIComponent(slug)}`
  );
  return cats[0]?.id ?? null;
}

export async function mapPostToArchiveItem(
  post: WpPostRest
): Promise<CategoryArchiveItem> {
  const meta = post.meta ?? {};
  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title.rendered),
    permalink: post.link,
    featured_image: await resolveFeaturedImageUrl(post),
    youtube: metaString(meta, "youtube"),
    h3: metaString(meta, "h3"),
    date_label: metaString(meta, "発表日"),
    meta,
  };
}

export type CategoryArchiveOptions = {
  /** category-web.php: ポートフォリオ用タグ ID 49 を除外 */
  tags_exclude?: number[];
};

/** カテゴリ一覧 — GET /wp/v2/posts?categories={id}&_embed */
export async function getCategoryArchive(
  slug: string,
  options?: CategoryArchiveOptions
): Promise<CategoryArchiveItem[]> {
  const catId = await getCategoryIdBySlug(slug);
  if (!catId) return [];

  const params = new URLSearchParams({
    categories: String(catId),
    per_page: "100",
    orderby: "date",
    order: "desc",
    _embed: "wp:featuredmedia",
  });
  if (options?.tags_exclude?.length) {
    params.set("tags_exclude", options.tags_exclude.join(","));
  }

  const posts = await wpFetch<WpPostRest[]>(`/posts?${params}`);

  return Promise.all(posts.map(mapPostToArchiveItem));
}

/** 投稿1件 — GET /wp/v2/posts?slug= */
export async function getPostBySlug(slug: string): Promise<WpPostRest | null> {
  const posts = await wpFetch<WpPostRest[]>(
    `/posts?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia`
  );
  return posts[0] ?? null;
}

/** タグ一覧 — GET /wp/v2/posts?tags={id} */
export async function getTagArchive(slug: string): Promise<CategoryArchiveItem[]> {
  const tags = await wpFetch<Array<{ id: number }>>(
    `/tags?slug=${encodeURIComponent(slug)}`
  );
  const tagId = tags[0]?.id;
  if (!tagId) return [];

  const posts = await wpFetch<WpPostRest[]>(
    `/posts?tags=${tagId}&per_page=100&orderby=date&order=desc&_embed=wp:featuredmedia`
  );

  return Promise.all(posts.map(mapPostToArchiveItem));
}

export function permalinkToPath(permalink: string): string {
  try {
    return new URL(permalink).pathname;
  } catch {
    return permalink;
  }
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

export type WpTag = {
  id: number;
  slug: string;
  name: string;
  link: string;
};

export type TrajectoryListItem = {
  id: number;
  slug: string;
  title: string;
  permalink: string;
  /** get_the_date('m.d, Y') 相当 */
  listDate: string;
};

/** ブログ一覧の日付表示（WP テーマと同じ形式） */
export function formatTrajectoryListDate(isoDate: string): string {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return "";
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${m}.${day}, ${d.getFullYear()}`;
}

export async function getAllTags(): Promise<WpTag[]> {
  try {
    return await wpFetch<WpTag[]>(
      "/tags?per_page=100&orderby=count&order=desc&hide_empty=true"
    );
  } catch {
    return [];
  }
}

/** category-trajectory.php のリスト */
export async function getTrajectoryListItems(): Promise<TrajectoryListItem[]> {
  const catId = await getCategoryIdBySlug("trajectory");
  if (!catId) return [];

  const posts = await wpFetch<WpPostRest[]>(
    `/posts?categories=${catId}&per_page=100&orderby=date&order=desc`
  );

  return posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title.rendered),
    permalink: post.link,
    listDate: formatTrajectoryListDate(post.date),
  }));
}
