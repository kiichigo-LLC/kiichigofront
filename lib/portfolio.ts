import { WP_API_URL } from "./config";
import { getCategoryArchive, getPageBySlug, type CategoryArchiveItem } from "./wp";

/** portfolio.php: web カテゴリ全件（タグ 49 も含む） */
export async function getPortfolioWebItems(): Promise<CategoryArchiveItem[]> {
  return getCategoryArchive("web");
}

export type DtpGalleryImage = {
  id: number;
  url: string;
};

type WpPageRest = {
  id: number;
  slug: string;
  content?: { rendered: string };
};

type WpMedia = {
  id: number;
  source_url: string;
};

/** [gallery ids="1,2,3"] から ID を抽出 */
export function parseGalleryIds(content: string): number[] {
  const match = content.match(/\[gallery[^\]]*ids=["']([^"']+)["']/);
  if (!match?.[1]) return [];
  return match[1]
    .split(",")
    .map((id) => parseInt(id.trim(), 10))
    .filter((id) => Number.isFinite(id) && id > 0);
}

async function getMediaById(id: number): Promise<WpMedia | null> {
  const url = `${WP_API_URL.replace(/\/$/, "")}/media/${id}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json() as Promise<WpMedia>;
}

/** portfolio-dtp.php: 固定ページのギャラリー画像 */
export async function getDtpGalleryImages(
  pageSlug = "dtp"
): Promise<DtpGalleryImage[]> {
  const page = (await getPageBySlug(pageSlug)) as WpPageRest | null;
  if (!page?.content?.rendered) return [];

  const ids = parseGalleryIds(page.content.rendered);
  if (!ids.length) return [];

  const images = await Promise.all(
    ids.map(async (id) => {
      const media = await getMediaById(id);
      if (!media?.source_url) return null;
      return { id: media.id, url: media.source_url };
    })
  );

  return images.filter((img): img is DtpGalleryImage => img !== null);
}
