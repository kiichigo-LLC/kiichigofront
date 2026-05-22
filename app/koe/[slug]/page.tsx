import { KoeSingleContent } from "@/components/single/KoeSingleContent";
import { SiteShell } from "@/components/site/SiteShell";
import { getKoeAdjacentPosts, getKoePostDetail } from "@/lib/koe-post";
import {
  buildSinglePostMetadata,
  singleCanonicalUrl,
} from "@/lib/single-metadata";
import { getNavNewFlags } from "@/lib/wp";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getKoePostDetail(slug);
  if (!post) {
    return { title: "記事がありません" };
  }
  return buildSinglePostMetadata({
    title: post.title,
    permalink: post.permalink,
    description: `合同会社キイチゴの声の仕事｜${post.title}`,
  });
}

export default async function KoeSinglePage({ params }: Props) {
  const { slug } = await params;
  const [navNew, post, adjacent] = await Promise.all([
    getNavNewFlags(),
    getKoePostDetail(slug),
    getKoeAdjacentPosts(slug),
  ]);

  if (!post) {
    notFound();
  }

  const canonical = singleCanonicalUrl(post.permalink);

  return (
    <SiteShell
      title={`${post.title}｜合同会社キイチゴ`}
      description={`合同会社キイチゴの声の仕事｜${post.title}`}
      canonicalUrl={canonical}
      navNew={navNew}
    >
      <KoeSingleContent post={post} adjacent={adjacent} />
    </SiteShell>
  );
}
