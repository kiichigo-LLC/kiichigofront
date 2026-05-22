import { WebCategoryContent } from "@/components/category/WebCategoryContent";
import { SiteShell } from "@/components/site/SiteShell";
import { themeAsset } from "@/lib/config";
import { getWebCategoryMetadata } from "@/lib/category-meta";
import { getCategoryArchive, getNavNewFlags } from "@/lib/wp";
import type { Metadata } from "next";

/** category-web.php: タグ ID 49（ポートフォリオ）を一覧から除外 */
const EXCLUDE_TAG_IDS = [49];

export async function generateMetadata(): Promise<Metadata> {
  const { title, description, canonical } = await getWebCategoryMetadata();
  const ogp = themeAsset("img/ogp.jpg");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      images: [{ url: ogp }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Kiichigo_llc",
      title,
      description,
      images: [ogp],
    },
  };
}

export default async function WebCategoryPage() {
  const [navNew, items, meta] = await Promise.all([
    getNavNewFlags(),
    getCategoryArchive("web", { tags_exclude: EXCLUDE_TAG_IDS }),
    getWebCategoryMetadata(),
  ]);

  return (
    <SiteShell
      title={meta.title}
      description={meta.description}
      canonicalUrl={meta.canonical}
      navNew={navNew}
    >
      <WebCategoryContent items={items} />
    </SiteShell>
  );
}
