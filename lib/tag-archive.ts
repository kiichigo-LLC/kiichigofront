import { WP_API_URL } from "./config";
import { stripHtml, type WpPostRest, type WpTag } from "./wp";

/** WP タグアーカイブのデフォルト件数に合わせる */
export const TAG_POSTS_PER_PAGE = 10;

/** tag.php: タグクラウドから除外するスラッグ */
export const TAG_CLOUD_EXCLUDE_SLUGS = ["portfolio"];

export type TagArchiveListItem = {
  id: number;
  title: string;
  permalink: string;
};

export type TagArchivePage = {
  tag: WpTag;
  items: TagArchiveListItem[];
  page: number;
  totalPages: number;
};

async function wpFetchTagPosts(
  tagId: number,
  page: number
): Promise<{ posts: WpPostRest[]; totalPages: number }> {
  const params = new URLSearchParams({
    tags: String(tagId),
    per_page: String(TAG_POSTS_PER_PAGE),
    page: String(page),
    orderby: "date",
    order: "desc",
  });
  const url = `${WP_API_URL.replace(/\/$/, "")}/posts?${params}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`WP API ${res.status}: ${url}`);
  }
  const totalPages = Math.max(
    1,
    parseInt(res.headers.get("X-WP-TotalPages") ?? "1", 10) || 1
  );
  const posts = (await res.json()) as WpPostRest[];
  return { posts, totalPages };
}

export async function getTagBySlug(slug: string): Promise<WpTag | null> {
  const url = `${WP_API_URL.replace(/\/$/, "")}/tags?slug=${encodeURIComponent(slug)}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const tags = (await res.json()) as WpTag[];
  return tags[0] ?? null;
}

export async function getTagCloudTags(): Promise<WpTag[]> {
  const url = `${WP_API_URL.replace(/\/$/, "")}/tags?per_page=100&orderby=count&order=desc&hide_empty=true`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const tags = (await res.json()) as WpTag[];
  return tags.filter((t) => !TAG_CLOUD_EXCLUDE_SLUGS.includes(t.slug));
}

export async function getTagArchivePage(
  slug: string,
  page: number
): Promise<TagArchivePage | null> {
  const tag = await getTagBySlug(slug);
  if (!tag) return null;

  const safePage = Math.max(1, page);
  const { posts, totalPages } = await wpFetchTagPosts(tag.id, safePage);

  return {
    tag,
    items: posts.map((post) => ({
      id: post.id,
      title: stripHtml(post.title.rendered),
      permalink: post.link,
    })),
    page: safePage,
    totalPages,
  };
}
