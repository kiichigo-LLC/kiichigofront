import { KoeCategoryContent } from "@/components/category/KoeCategoryContent";
import { SiteShell } from "@/components/site/SiteShell";
import { themeAsset } from "@/lib/config";
import { getKoeCategoryMetadata } from "@/lib/category-meta";
import { getCategoryArchive, getNavNewFlags } from "@/lib/wp";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { title, description, canonical } = await getKoeCategoryMetadata();
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

export default async function KoeCategoryPage() {
  const [navNew, items, meta] = await Promise.all([
    getNavNewFlags(),
    getCategoryArchive("koe"),
    getKoeCategoryMetadata(),
  ]);

  return (
    <SiteShell
      title={meta.title}
      description={meta.description}
      canonicalUrl={meta.canonical}
      navNew={navNew}
    >
      <KoeCategoryContent items={items} />
    </SiteShell>
  );
}
