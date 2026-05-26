/**
 * SEO 用の文言と generateMetadata ヘルパー（旧 themes/main/header.php と同じルール）
 */

import type { Metadata } from "next";
import { asset, canonical, SITE_NAME } from "utils/config";

/** トップ・about など */
export const DESC_HOME =
  "東京世田谷区でホームページ制作、音楽制作を行う、合同会社キイチゴのホームページ";

/** WP のサイト説明（未設定時は DESC_HOME） */
export const DESC_SITE =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION || DESC_HOME;

export const DESC_WEB_CAT =
  "デザイン・フロントエンド・バックエンド・ディレクション・広告・計測など。アプリ以外ならなんでも対応します。";

export const DESC_TRAJ = "ブログ";

export const DESC_CONTACT =
  "お仕事のお問い合わせ、ご依頼は、下記のお問い合わせフォームからお願いいたします。";

export const DESC_DX =
  "合同会社キイチゴのDX推進方針。データとデジタル技術の活用、ITシステム環境の整備、KPIについて。";

const TWITTER = "@Kiichigo_llc";

export function titleWithSite(pageTitle: string) {
  return `${pageTitle}｜${SITE_NAME}`;
}

/** 記事詳細の description（旧 is_single） */
export function descForArticle(articleTitle: string) {
  return `合同会社キイチゴの仕事｜${articleTitle}`;
}

/** 記事詳細の generateMetadata（旧 is_single） */
export function metaForArticle(
  articleTitle: string,
  publicPath: string,
  image?: string,
  noIndex?: boolean
): Metadata {
  return pageMeta({
    title: articleTitle,
    description: descForArticle(articleTitle),
    path: publicPath,
    image,
    noIndex,
  });
}

type PageMetaInput = {
  title: string;
  description: string;
  /** canonical 用パス（例: `/contact`） */
  path: string;
  image?: string;
  noIndex?: boolean;
};

/** title / description / canonical / OGP / Twitter をまとめて返す */
export function pageMeta({
  title,
  description,
  path,
  image,
  noIndex,
}: PageMetaInput): Metadata {
  const url = canonical(path);
  const ogp = image || asset("img/ogp.jpg");
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "article",
      images: [{ url: ogp }],
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER,
      title,
      description,
      images: [ogp],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
