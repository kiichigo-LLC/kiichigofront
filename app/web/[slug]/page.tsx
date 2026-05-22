import { WebSingleContent } from "@/components/single/WebSingleContent";
import { SiteShell } from "@/components/site/SiteShell";
import { sitePath } from "@/lib/config";
import {
  buildSinglePostMetadata,
  singleCanonicalUrl,
} from "@/lib/single-metadata";
import {
  getWebAdjacentPosts,
  getWebPostDetail,
  isPortfolioReferer,
} from "@/lib/web-post";
import { getNavNewFlags } from "@/lib/wp";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getWebPostDetail(slug);
  if (!post) {
    return { title: "記事がありません" };
  }
  return buildSinglePostMetadata({
    title: post.title,
    permalink: post.permalink,
    description: `合同会社キイチゴのウェブの仕事｜${post.title}`,
  });
}

export default async function WebSinglePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { from } = await searchParams;
  const [navNew, post, adjacent] = await Promise.all([
    getNavNewFlags(),
    getWebPostDetail(slug),
    getWebAdjacentPosts(slug),
  ]);

  if (!post) {
    notFound();
  }

  if (post.isPortfolio) {
    const referer = (await headers()).get("referer");
    const fromPortfolio = from === "portfolio" || isPortfolioReferer(referer);
    if (!fromPortfolio) {
      redirect(sitePath("/category/web"));
    }
  }

  const canonical = singleCanonicalUrl(post.permalink);

  return (
    <SiteShell
      title={`${post.title}｜合同会社キイチゴ`}
      description={`合同会社キイチゴのウェブの仕事｜${post.title}`}
      canonicalUrl={canonical}
      navNew={navNew}
      loadSingleWebIframe
    >
      <WebSingleContent post={post} adjacent={adjacent} />
    </SiteShell>
  );
}
