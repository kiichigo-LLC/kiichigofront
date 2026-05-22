import { TrajectorySingleContent } from "@/components/single/TrajectorySingleContent";
import { SiteShell } from "@/components/site/SiteShell";
import { SITE_URL, themeAsset } from "@/lib/config";
import {
  getTrajectoryAdjacentPosts,
  getTrajectoryPostDetail,
} from "@/lib/trajectory-post";
import { getNavNewFlags, getSiteInfo, permalinkToPath } from "@/lib/wp";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getTrajectoryPostDetail(slug);
  if (!post) {
    return { title: "記事がありません" };
  }

  let siteName = "合同会社キイチゴ";
  try {
    const site = await getSiteInfo();
    if (site.name) siteName = site.name;
  } catch {
    /* fallback */
  }

  const title = post.title;
  const metaTitle = `${title}｜${siteName}`;
  const description = `合同会社キイチゴの仕事｜${title}`;
  const canonical = SITE_URL
    ? `${SITE_URL.replace(/\/$/, "")}${permalinkToPath(post.permalink)}`
    : `https://kiichigo.work${permalinkToPath(post.permalink)}`;
  const ogp = themeAsset("img/ogp.jpg");

  return {
    title: metaTitle,
    description,
    alternates: { canonical },
    openGraph: {
      title: metaTitle,
      description,
      url: canonical,
      type: "article",
      images: [{ url: ogp }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Kiichigo_llc",
      title: metaTitle,
      description,
      images: [ogp],
    },
  };
}

export default async function TrajectorySinglePage({ params }: Props) {
  const { slug } = await params;
  const [navNew, post, adjacent] = await Promise.all([
    getNavNewFlags(),
    getTrajectoryPostDetail(slug),
    getTrajectoryAdjacentPosts(slug),
  ]);

  if (!post) {
    notFound();
  }

  const canonical = SITE_URL
    ? `${SITE_URL.replace(/\/$/, "")}${permalinkToPath(post.permalink)}`
    : `https://kiichigo.work${permalinkToPath(post.permalink)}`;

  return (
    <SiteShell
      title={`${post.title}｜合同会社キイチゴ`}
      description={`合同会社キイチゴの仕事｜${post.title}`}
      canonicalUrl={canonical}
      navNew={navNew}
      showTrajectoryNav
      loadPrism
    >
      <TrajectorySingleContent post={post} adjacent={adjacent} />
    </SiteShell>
  );
}
