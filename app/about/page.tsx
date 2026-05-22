import { AboutContent } from "@/components/about/AboutContent";
import { SiteShell } from "@/components/site/SiteShell";
import { SITE_URL } from "@/lib/config";
import { buildPageMetadata, resolvePageTitle } from "@/lib/metadata";
import { getNavNewFlags, getSiteInfo } from "@/lib/wp";
import type { Metadata } from "next";

const PATH = "/about";
const FALLBACK_TITLE = "プロフィール";

export async function generateMetadata(): Promise<Metadata> {
  const pageTitle = await resolvePageTitle("about", FALLBACK_TITLE);
  return buildPageMetadata({ pageTitle, path: PATH });
}

export default async function AboutPage() {
  const [navNew, pageTitle] = await Promise.all([
    getNavNewFlags(),
    resolvePageTitle("about", FALLBACK_TITLE),
  ]);

  let siteName = "合同会社キイチゴ";
  let siteDescription =
    "東京世田谷区でホームページ制作、音楽制作を行う、合同会社キイチゴのホームページ";

  try {
    const site = await getSiteInfo();
    if (site.name) siteName = site.name;
    if (site.description) siteDescription = site.description;
  } catch {
    /* fallback */
  }

  const metaTitle = `${pageTitle}｜${siteName}`;
  const canonical = SITE_URL
    ? `${SITE_URL.replace(/\/$/, "")}${PATH}`
    : `https://kiichigo.work${PATH}`;

  return (
    <SiteShell
      title={metaTitle}
      description={siteDescription}
      canonicalUrl={canonical}
      navNew={navNew}
      includeJsonLd
    >
      <AboutContent pageTitle={pageTitle} />
    </SiteShell>
  );
}
