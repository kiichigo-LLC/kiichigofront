import { PortfolioContent } from "@/components/portfolio/PortfolioContent";
import { SiteShell } from "@/components/site/SiteShell";
import { themeAsset } from "@/lib/config";
import { getPortfolioMetadata } from "@/lib/category-meta";
import { getPortfolioWebItems } from "@/lib/portfolio";
import { getNavNewFlags } from "@/lib/wp";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { title, description, canonical } = await getPortfolioMetadata();
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

export default async function PortfolioPage() {
  const [navNew, items, meta] = await Promise.all([
    getNavNewFlags(),
    getPortfolioWebItems(),
    getPortfolioMetadata(),
  ]);

  return (
    <SiteShell
      title={meta.title}
      description={meta.description}
      canonicalUrl={meta.canonical}
      navNew={navNew}
    >
      <PortfolioContent items={items} />
    </SiteShell>
  );
}
