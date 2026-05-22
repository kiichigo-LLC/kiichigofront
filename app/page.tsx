import { HomeBan } from "@/components/home/HomeBan";
import { HomeLoadingController } from "@/components/home/HomeLoadingController";
import { HomeMain } from "@/components/home/HomeMain";
import { SiteShell } from "@/components/site/SiteShell";
import { SITE_URL, themeAsset } from "@/lib/config";
import { getHomeData, getNavNewFlags, getSiteInfo } from "@/lib/wp";
import type { Metadata } from "next";

const HOME_DESCRIPTION =
  "東京世田谷区でホームページ制作、音楽制作を行う、合同会社キイチゴのホームページ";

export async function generateMetadata(): Promise<Metadata> {
  let title = "合同会社キイチゴ";
  try {
    const site = await getSiteInfo();
    if (site.name) title = site.name;
  } catch {
    /* WP 未起動時 */
  }

  const canonical = SITE_URL ? `${SITE_URL}/` : "https://kiichigo.work/";
  const ogp = themeAsset("img/ogp.jpg");

  return {
    title,
    description: HOME_DESCRIPTION,
    alternates: { canonical },
    openGraph: {
      title,
      description: HOME_DESCRIPTION,
      url: canonical,
      siteName: title,
      type: "article",
      images: [{ url: ogp }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Kiichigo_llc",
      title,
      description: HOME_DESCRIPTION,
      images: [ogp],
    },
  };
}

export default async function HomePage() {
  const [home, navNew] = await Promise.all([getHomeData(), getNavNewFlags()]);

  let title = "合同会社キイチゴ";
  try {
    const site = await getSiteInfo();
    if (site.name) title = site.name;
  } catch {
    /* fallback */
  }

  const canonical = SITE_URL ? `${SITE_URL}/` : "https://kiichigo.work/";

  return (
    <>
      <HomeLoadingController />

      <SiteShell
        title={title}
        description={HOME_DESCRIPTION}
        canonicalUrl={canonical}
        isHome
        navNew={navNew}
        includeJsonLd
      >
        <HomeMain home={home} />
        <HomeBan />
      </SiteShell>
    </>
  );
}
