import { WP } from "utils/config";
import { STATIC_FETCH } from "@/lib/wp-fetch";

const PORTFOLIO_TAG_ID = 49;

async function fetchAllPaginated<T>(
  urlForPage: (page: number) => string,
  mapItem: (item: { slug: string }) => T
): Promise<T[]> {
  const out: T[] = [];
  let page = 1;
  let totalPages = 1;
  do {
    const res = await fetch(urlForPage(page), STATIC_FETCH);
    if (!res.ok) break;
    const items: { slug: string }[] = await res.json();
    for (const item of items) out.push(mapItem(item));
    totalPages = parseInt(res.headers.get("x-wp-totalpages") || "1", 10);
    page++;
  } while (page <= totalPages);
  return out;
}

export async function postSlugParams(categoryId: number) {
  return fetchAllPaginated(
    (page) =>
      `${WP}/posts?categories=${categoryId}&per_page=100&page=${page}&_fields=slug`,
    (p) => ({ slug: p.slug })
  );
}

export async function tagSlugParams() {
  const tags = await fetchAllPaginated(
    (page) => `${WP}/tags?per_page=100&page=${page}&hide_empty=true`,
    (t) => t
  );
  return tags
    .filter((t) => t.slug !== "portfolio")
    .map((t) => ({ slug: t.slug }));
}

export async function tagArchivePageParams(
  tagSlug: string,
  perPage: number
): Promise<{ slug: string; pageNum: string }[]> {
  const t = await fetch(
    `${WP}/tags?slug=${encodeURIComponent(tagSlug)}`,
    STATIC_FETCH
  );
  if (!t.ok) return [];
  const tags: { id: number }[] = await t.json();
  const tag = tags[0];
  if (!tag) return [];

  const res = await fetch(
    `${WP}/posts?tags=${tag.id}&per_page=${perPage}&page=1&_fields=id`,
    STATIC_FETCH
  );
  if (!res.ok) return [];
  const totalPages = parseInt(res.headers.get("x-wp-totalpages") || "1", 10);
  const params: { slug: string; pageNum: string }[] = [];
  for (let p = 2; p <= totalPages; p++) {
    params.push({ slug: tagSlug, pageNum: String(p) });
  }
  return params;
}

export async function allTagArchivePageParams(perPage: number) {
  const tagSlugs = await tagSlugParams();
  const all = await Promise.all(
    tagSlugs.map(({ slug }) => tagArchivePageParams(slug, perPage))
  );
  return all.flat();
}

export { PORTFOLIO_TAG_ID };
