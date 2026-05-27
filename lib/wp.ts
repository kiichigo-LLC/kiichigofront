/* eslint-disable @typescript-eslint/no-explicit-any */

import { WP } from "utils/config";

export { SITE_NAME, SITE, THEME, WP, asset, path, canonical } from "utils/config";

export const FORM_CHECK_URL =
  process.env.NEXT_PUBLIC_FORM_CHECK_URL ||
  "https://wp.kiichigo.work/form/check.php";
export const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
  "6LdQSDIaAAAAAAkqYuSdqvkMmY0JtKB5fwjDUvJ4";

const WP_MEDIA = (process.env.WP_MEDIA_FALLBACK_URL || "").replace(/\/$/, "");

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-fA-F]+);/gi, (_, hex) => {
      const cp = parseInt(hex, 16);
      return Number.isNaN(cp) ? _ : String.fromCodePoint(cp);
    })
    .replace(/&#(\d+);/g, (_, dec) => {
      const cp = parseInt(dec, 10);
      return Number.isNaN(cp) ? _ : String.fromCodePoint(cp);
    })
    .replace(/&nbsp;/g, "\u00a0")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

export function strip(html: string) {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, "")).trim();
}

export function wpPath(link: string) {
  try {
    return new URL(link).pathname;
  } catch {
    return link;
  }
}

export const PORTFOLIO_TAG_ID = 49;

export function hasPortfolioTag(post: any): boolean {
  if (
    Array.isArray(post.tags) &&
    post.tags.some((t: number | string) => Number(t) === PORTFOLIO_TAG_ID)
  ) {
    return true;
  }
  const groups = post._embedded?.["wp:term"];
  if (!Array.isArray(groups)) return false;
  for (const group of groups) {
    if (!Array.isArray(group)) continue;
    for (const term of group) {
      if (
        term.taxonomy === "post_tag" &&
        (term.id === PORTFOLIO_TAG_ID || term.slug === "portfolio")
      ) {
        return true;
      }
    }
  }
  return false;
}

export function metaStr(meta: any, key: string) {
  if (!meta) return "";
  const v = meta[key];
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v[0] || "";
  return v != null ? String(v) : "";
}

function featuredFromEmbed(post: any) {
  if (post.featured_image_url) return post.featured_image_url;
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";
}

export async function featuredImg(post: any): Promise<string> {
  const direct = featuredFromEmbed(post);
  if (direct) return direct;

  const mediaId = post.featured_media ?? 0;
  if (WP_MEDIA && mediaId > 0) {
    try {
      const res = await fetch(`${WP_MEDIA}/wp-json/wp/v2/media/${mediaId}`, {
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const data: any = await res.json();
        if (data.source_url) return data.source_url;
      }
    } catch {
      /* noop */
    }
  }

  if (WP_MEDIA && post.slug) {
    try {
      const res = await fetch(
        `${WP_MEDIA}/wp-json/wp/v2/posts?slug=${encodeURIComponent(post.slug)}&_embed=wp:featuredmedia`,
        { next: { revalidate: 3600 } }
      );
      if (res.ok) {
        const posts: any = await res.json();
        const url = featuredFromEmbed(posts[0] ?? {});
        if (url) return url;
      }
    } catch {
      /* noop */
    }
  }

  return "";
}

/** タグクラウド用（portfolio 除外。tag.php / ブログ一覧と同じ） */
export async function getArchiveTags() {
  const res = await fetch(
    `${WP}/tags?per_page=100&orderby=count&order=desc&hide_empty=true`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return [];
  const tags: any[] = await res.json();
  return tags.filter((t) => t.slug !== "portfolio" && t.id !== 49);
}

export function trajDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${m}.${day}, ${d.getFullYear()}`;
}
