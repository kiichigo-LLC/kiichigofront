import type { WpPostRest } from "./wp";

const WP_MEDIA_FALLBACK_URL = process.env.WP_MEDIA_FALLBACK_URL?.replace(
  /\/$/,
  ""
);

function fromEmbed(post: WpPostRest): string {
  if (post.featured_image_url) {
    return post.featured_image_url;
  }
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "";
}

async function fromFallbackMediaId(mediaId: number): Promise<string> {
  if (!WP_MEDIA_FALLBACK_URL || mediaId <= 0) return "";

  try {
    const res = await fetch(
      `${WP_MEDIA_FALLBACK_URL}/wp-json/wp/v2/media/${mediaId}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return "";
    const data = (await res.json()) as { source_url?: string };
    return data.source_url ?? "";
  } catch {
    return "";
  }
}

async function fromFallbackPostSlug(slug: string): Promise<string> {
  if (!WP_MEDIA_FALLBACK_URL || !slug) return "";

  try {
    const res = await fetch(
      `${WP_MEDIA_FALLBACK_URL}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return "";
    const posts = (await res.json()) as WpPostRest[];
    return fromEmbed(posts[0] ?? {});
  } catch {
    return "";
  }
}

/**
 * アイキャッチ URL
 * 1. featured_image_url / _embed
 * 2. ローカル DB に attachment が無いとき WP_MEDIA_FALLBACK_URL（本番）から取得
 */
export async function resolveFeaturedImageUrl(
  post: WpPostRest
): Promise<string> {
  const direct = fromEmbed(post);
  if (direct) return direct;

  const mediaId = post.featured_media ?? 0;
  const fromMedia = await fromFallbackMediaId(mediaId);
  if (fromMedia) return fromMedia;

  return fromFallbackPostSlug(post.slug);
}
