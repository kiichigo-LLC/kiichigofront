/* eslint-disable @typescript-eslint/no-explicit-any */

import { WP } from "utils/config";
import { STATIC_FETCH } from "@/lib/wp-fetch";

/** WP 管理画面の「1ページに表示する最大投稿数」（tag.php のメインクエリと揃える） */
export const TAG_ARCHIVE_PER_PAGE = 10;

export async function getTagPage(tagSlug: string, pageNum: number) {
  const t = await fetch(`${WP}/tags?slug=${encodeURIComponent(tagSlug)}`, STATIC_FETCH);
  if (!t.ok) return null;
  const tags: any = await t.json();
  const tag = tags[0];
  if (!tag) return null;
  const res = await fetch(
    `${WP}/posts?tags=${tag.id}&per_page=${TAG_ARCHIVE_PER_PAGE}&page=${pageNum}&orderby=date&order=desc`,
    STATIC_FETCH
  );
  if (!res.ok) return null;
  const posts = await res.json();
  const total = parseInt(res.headers.get("x-wp-totalpages") || "1", 10);
  return {
    tag,
    posts,
    page: pageNum,
    totalPages: total,
  };
}

export function tagArchivePath(slug: string, page: number) {
  if (page <= 1) return `/tag/${slug}`;
  return `/tag/${slug}/page/${page}`;
}
