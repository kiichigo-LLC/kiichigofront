import { WP_API_URL } from "./config";
import type { WpPostRest, WpTag } from "./wp";

export type SingleAdjacentItem = {
  slug: string;
  title: string;
  permalink: string;
};

export async function fetchPostBySlugEmbed(
  slug: string
): Promise<WpPostRest | null> {
  const url = `${WP_API_URL.replace(/\/$/, "")}/posts?slug=${encodeURIComponent(slug)}&_embed=wp:term,wp:featuredmedia`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const posts = (await res.json()) as WpPostRest[];
  return posts[0] ?? null;
}

export function extractPostTags(post: WpPostRest): WpTag[] {
  const groups = post._embedded?.["wp:term"] ?? [];
  const tags: WpTag[] = [];
  for (const group of groups) {
    for (const term of group) {
      if (term.taxonomy === "post_tag") {
        tags.push({
          id: term.id,
          slug: term.slug,
          name: term.name,
          link: term.link,
        });
      }
    }
  }
  return tags;
}

export function postHasTagId(post: WpPostRest, tagId: number): boolean {
  if (post.tags?.includes(tagId)) return true;
  return extractPostTags(post).some((t) => t.id === tagId);
}

export function findAdjacentInList(
  items: SingleAdjacentItem[],
  currentSlug: string
): { older: SingleAdjacentItem | null; newer: SingleAdjacentItem | null } {
  const idx = items.findIndex((item) => item.slug === currentSlug);
  if (idx === -1) {
    return { older: null, newer: null };
  }
  return {
    older: items[idx + 1] ?? null,
    newer: items[idx - 1] ?? null,
  };
}
