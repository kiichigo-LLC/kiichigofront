import { SITE_URL } from "./config";
import { getSiteInfo } from "./wp";

type CategoryMetaInput = {
  listTitle: string;
  path: string;
  description?: string;
};

async function getCategoryPageMetadata({
  listTitle,
  path,
  description,
}: CategoryMetaInput) {
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

  const title = `${listTitle}｜${siteName}`;
  const canonical = SITE_URL
    ? `${SITE_URL.replace(/\/$/, "")}${path}`
    : `https://kiichigo.work${path}`;

  return {
    title,
    description: description ?? siteDescription,
    canonical,
  };
}

export function getKoeCategoryMetadata() {
  return getCategoryPageMetadata({
    listTitle: "合同会社キイチゴの声の仕事一覧",
    path: "/category/koe",
  });
}

export function getWebCategoryMetadata() {
  return getCategoryPageMetadata({
    listTitle: "合同会社キイチゴのウェブの仕事一覧",
    path: "/category/web",
    description:
      "デザイン・フロントエンド・バックエンド・ディレクション・広告・計測など。アプリ以外ならなんでも対応します。",
  });
}

export function getTrajectoryCategoryMetadata() {
  return getCategoryPageMetadata({
    listTitle: "ブログ",
    path: "/category/trajectory",
    description: "ブログ",
  });
}

export function getPortfolioMetadata() {
  return getCategoryPageMetadata({
    listTitle: "ポートフォリオ",
    path: "/portfolio",
  });
}

export function getPortfolioDtpMetadata() {
  return getCategoryPageMetadata({
    listTitle: "DTP系ポートフォリオ",
    path: "/portfolio/dtp",
  });
}
