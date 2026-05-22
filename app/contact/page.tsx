import { ContactContent } from "@/components/contact/ContactContent";
import { SiteShell } from "@/components/site/SiteShell";
import { SITE_URL } from "@/lib/config";
import { buildPageMetadata, resolvePageTitle } from "@/lib/metadata";
import { getNavNewFlags, getSiteInfo } from "@/lib/wp";
import type { Metadata } from "next";
import Script from "next/script";

const PATH = "/contact";
const FALLBACK_TITLE = "お問い合わせ";

export async function generateMetadata(): Promise<Metadata> {
  const pageTitle = await resolvePageTitle("contact", FALLBACK_TITLE);
  return buildPageMetadata({
    pageTitle,
    path: PATH,
    description:
      "合同会社キイチゴへのお仕事のお問い合わせ・ご依頼はこちらのフォームからお願いいたします。",
  });
}

export default async function ContactPage() {
  const [navNew, pageTitle] = await Promise.all([
    getNavNewFlags(),
    resolvePageTitle("contact", FALLBACK_TITLE),
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
      loadContactForm
    >
      <Script
        src="https://www.google.com/recaptcha/api.js"
        strategy="lazyOnload"
      />
      <ContactContent pageTitle={pageTitle} />
    </SiteShell>
  );
}
