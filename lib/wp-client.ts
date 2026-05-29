/* eslint-disable @typescript-eslint/no-explicit-any */

import { resolvePublicMediaUrl } from "@/lib/media-url";
import { SITE, WP_CLIENT } from "utils/config";
import { PORTFOLIO_TAG_ID } from "@/lib/wp-utils";

/** 本番 uploads など（投稿 API と別ホストになり得る） */
const WP_MEDIA_REMOTE = (
  process.env.NEXT_PUBLIC_WP_MEDIA_FALLBACK_URL || ""
).replace(/\/$/, "");

const WP_MEDIA_PROXY_PREFIX = (
  process.env.NEXT_PUBLIC_WP_MEDIA_PROXY_PREFIX || "/wp-media-proxy"
).replace(/\/$/, "");

function wpJsonBase(siteUrl: string) {
  const base = siteUrl.replace(/\/$/, "");
  return base.includes("/wp-json/") ? base : `${base}/wp-json/wp/v2`;
}

/** ブラウザからメディア REST を叩くベース URL（localhost では同一オリジン proxy） */
function mediaApiBase(): string {
  if (!WP_MEDIA_REMOTE) {
    return wpJsonBase(WP_CLIENT);
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocal =
      host === "localhost" || host === "127.0.0.1" || host === "[::1]";
    if (isLocal) {
      try {
        const remote = new URL(
          WP_MEDIA_REMOTE.startsWith("http")
            ? WP_MEDIA_REMOTE
            : `https://${WP_MEDIA_REMOTE}`
        );
        if (remote.hostname !== host) {
          return `${window.location.origin}${WP_MEDIA_PROXY_PREFIX}`;
        }
      } catch {
        /* fall through */
      }
    }
  }
  if (SITE && WP_MEDIA_REMOTE) {
    try {
      const siteOrigin = new URL(SITE).origin;
      const remote = new URL(
        WP_MEDIA_REMOTE.startsWith("http")
          ? WP_MEDIA_REMOTE
          : `https://${WP_MEDIA_REMOTE}`
      );
      if (siteOrigin !== remote.origin && typeof window === "undefined") {
        return wpJsonBase(WP_MEDIA_REMOTE);
      }
    } catch {
      /* noop */
    }
  }
  return wpJsonBase(WP_MEDIA_REMOTE);
}

function apiUrl(path: string) {
  if (!WP_CLIENT) {
    throw new Error(
      "NEXT_PUBLIC_WP_API_URL が未設定です。.env.local に WP と同じ URL を設定してください。"
    );
  }
  return `${wpJsonBase(WP_CLIENT)}${path.startsWith("/") ? path : `/${path}`}`;
}

function mediaApiUrl(path: string) {
  return `${mediaApiBase()}${path.startsWith("/") ? path : `/${path}`}`;
}

function mediaApiCandidates(path: string): string[] {
  if (!WP_MEDIA_REMOTE) return [];
  const p = path.startsWith("/") ? path : `/${path}`;
  const urls: string[] = [];
  urls.push(`${wpJsonBase(WP_MEDIA_REMOTE)}${p}`);
  if (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "[::1]")
  ) {
    urls.push(`${window.location.origin}${WP_MEDIA_PROXY_PREFIX}${p}`);
  }
  urls.push(mediaApiUrl(p));
  return Array.from(new Set(urls));
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function fetchJsonFromCandidates<T>(urls: string[]): Promise<T | null> {
  for (const url of urls) {
    const data = await fetchJson<T>(url);
    if (data) return data;
  }
  return null;
}

export async function wpGet<T = any>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(apiUrl(path));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(
      `WP API に接続できません（${WP_CLIENT}）。Docker の起動・CORS・NEXT_PUBLIC_WP_API_URL を確認してください。 ${msg}`
    );
  }
  if (!res.ok) {
    throw new Error(`WP API ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}

export async function wpGetWithHeaders<T = any>(
  path: string
): Promise<{ data: T; headers: Headers }> {
  const res = await fetch(apiUrl(path));
  if (!res.ok) {
    throw new Error(`WP API ${res.status}: ${path}`);
  }
  return { data: (await res.json()) as T, headers: res.headers };
}

function featuredFromPost(post: any): string {
  if (!post) return "";
  return normalizeMediaUrl(
    post.featured_image_url || post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || ""
  );
}

function normalizeMediaUrl(url: string): string {
  const v = (url || "").trim();
  if (!v) return "";
  let absolute = v;
  if (!/^https?:\/\//i.test(v)) {
    const base = WP_MEDIA_REMOTE || WP_CLIENT;
    if (!base) return v;
    try {
      absolute = new URL(v, base.endsWith("/") ? base : `${base}/`).toString();
    } catch {
      return v;
    }
  }
  return resolvePublicMediaUrl(absolute);
}

export async function featuredImgClient(post: any): Promise<string> {
  const direct = featuredFromPost(post);
  if (direct) return direct;

  if (post.slug) {
    const q = `/posts?slug=${encodeURIComponent(post.slug)}&_embed=wp:featuredmedia`;
    const postsPrimary = await fetchJson<any[]>(`${wpJsonBase(WP_CLIENT)}${q}`);
    const urlPrimary = featuredFromPost(postsPrimary?.[0]);
    if (urlPrimary) return urlPrimary;

    if (WP_MEDIA_REMOTE) {
      const postsFallback = await fetchJsonFromCandidates<any[]>(
        mediaApiCandidates(q)
      );
      const urlFallback = featuredFromPost(postsFallback?.[0]);
      if (urlFallback) return urlFallback;
    }
  }

  return "";
}

export async function getArchiveTagsClient() {
  const tags = await wpGet<any[]>(
    "/tags?per_page=100&orderby=count&order=desc&hide_empty=true"
  );
  return tags.filter((t) => t.slug !== "portfolio" && t.id !== PORTFOLIO_TAG_ID);
}

export const TAG_ARCHIVE_PER_PAGE = 10;

export async function getTagArchiveClient(tagSlug: string, pageNum: number) {
  const tags = await wpGet<any[]>(`/tags?slug=${encodeURIComponent(tagSlug)}`);
  const tag = tags[0];
  if (!tag) return null;

  const { data: posts, headers } = await wpGetWithHeaders<any[]>(
    `/posts?tags=${tag.id}&per_page=${TAG_ARCHIVE_PER_PAGE}&page=${pageNum}&orderby=date&order=desc&_embed=wp:featuredmedia`
  );
  const totalPages = parseInt(headers.get("x-wp-totalpages") || "1", 10);
  return { tag, posts, page: pageNum, totalPages };
}

export function tagArchivePath(slug: string, page: number) {
  if (page <= 1) return `/tag/${slug}`;
  return `/tag/${slug}/page/${page}`;
}
