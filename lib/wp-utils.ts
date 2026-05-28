/* eslint-disable @typescript-eslint/no-explicit-any */

export const PORTFOLIO_TAG_ID = 49;

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

export function trajDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${m}.${day}, ${d.getFullYear()}`;
}

export function extractYoutubeId(input: string): string {
  const raw = (input || "").trim();
  if (!raw) return "";
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;
  try {
    const u = new URL(raw);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace(/\//g, "");
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : "";
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v") || "";
      if (/^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      const m = u.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
      if (m?.[1]) return m[1];
    }
  } catch {
    return "";
  }
  return "";
}
