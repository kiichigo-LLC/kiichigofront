import { SITE_URL, themeAsset } from "./config";
import { getSiteInfo, permalinkToPath } from "./wp";
import type { Metadata } from "next";

type Input = {
  title: string;
  permalink: string;
  description?: string;
};

export async function buildSinglePostMetadata({
  title,
  permalink,
  description,
}: Input): Promise<Metadata> {
  let siteName = "合同会社キイチゴ";
  try {
    const site = await getSiteInfo();
    if (site.name) siteName = site.name;
  } catch {
    /* fallback */
  }

  const metaTitle = `${title}｜${siteName}`;
  const metaDescription = description ?? `合同会社キイチゴの仕事｜${title}`;
  const canonical = SITE_URL
    ? `${SITE_URL.replace(/\/$/, "")}${permalinkToPath(permalink)}`
    : `https://kiichigo.work${permalinkToPath(permalink)}`;
  const ogp = themeAsset("img/ogp.jpg");

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: { canonical },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonical,
      type: "article",
      images: [{ url: ogp }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Kiichigo_llc",
      title: metaTitle,
      description: metaDescription,
      images: [ogp],
    },
  };
}

export function singleCanonicalUrl(permalink: string): string {
  return SITE_URL
    ? `${SITE_URL.replace(/\/$/, "")}${permalinkToPath(permalink)}`
    : `https://kiichigo.work${permalinkToPath(permalink)}`;
}
