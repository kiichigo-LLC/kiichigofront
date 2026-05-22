import { SITE_URL, themeAsset } from "@/lib/config";
import { getSiteInfo, stripHtml } from "@/lib/wp";
import type { Metadata } from "next";

type PageMetaInput = {
  pageTitle: string;
  path: string;
  description?: string;
};

export async function buildPageMetadata({
  pageTitle,
  path,
  description,
}: PageMetaInput): Promise<Metadata> {
  let siteName = "合同会社キイチゴ";
  let siteDescription =
    "東京世田谷区でホームページ制作、音楽制作を行う、合同会社キイチゴのホームページ";

  try {
    const site = await getSiteInfo();
    if (site.name) siteName = site.name;
    if (site.description) siteDescription = site.description;
  } catch {
    /* WP 未起動時 */
  }

  const title = `${pageTitle}｜${siteName}`;
  const metaDescription = description ?? siteDescription;
  const canonical = SITE_URL
    ? `${SITE_URL.replace(/\/$/, "")}${path}`
    : `https://kiichigo.work${path}`;
  const ogp = themeAsset("img/ogp.jpg");

  return {
    title,
    description: metaDescription,
    alternates: { canonical },
    openGraph: {
      title,
      description: metaDescription,
      url: canonical,
      siteName,
      type: "article",
      images: [{ url: ogp }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Kiichigo_llc",
      title,
      description: metaDescription,
      images: [ogp],
    },
  };
}

export async function resolvePageTitle(
  slug: string,
  fallback: string
): Promise<string> {
  const { getPageBySlug } = await import("@/lib/wp");
  const page = await getPageBySlug(slug);
  if (page?.title?.rendered) {
    return stripHtml(page.title.rendered);
  }
  return fallback;
}
