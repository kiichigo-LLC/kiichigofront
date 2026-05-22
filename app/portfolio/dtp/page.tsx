import { PortfolioDtpContent } from "@/components/portfolio/PortfolioDtpContent";
import { SiteShell } from "@/components/site/SiteShell";
import { themeAsset } from "@/lib/config";
import { getPortfolioDtpMetadata } from "@/lib/category-meta";
import { getDtpGalleryImages } from "@/lib/portfolio";
import { getNavNewFlags } from "@/lib/wp";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { title, description, canonical } = await getPortfolioDtpMetadata();
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

export default async function PortfolioDtpPage() {
  const [navNew, images, meta] = await Promise.all([
    getNavNewFlags(),
    getDtpGalleryImages("dtp"),
    getPortfolioDtpMetadata(),
  ]);

  return (
    <SiteShell
      title={meta.title}
      description={meta.description}
      canonicalUrl={meta.canonical}
      navNew={navNew}
    >
      <PortfolioDtpContent images={images} />
    </SiteShell>
  );
}
