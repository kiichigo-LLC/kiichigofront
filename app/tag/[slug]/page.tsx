import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TagArchiveView } from "@/components/tag-archive-view";
import { tagSlugParams } from "@/lib/build-params";
import { DESC_SITE, pageMeta, titleWithSite } from "@/lib/seo";
import { getTagPage, TAG_ARCHIVE_PER_PAGE } from "@/lib/tag-archive";
import { getArchiveTags } from "@/lib/wp";

export async function generateStaticParams() {
  return tagSlugParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getTagPage(slug, 1);
  if (!data) return { title: "タグがありません" };
  return pageMeta({
    title: titleWithSite(`“${data.tag.name}” 一覧`),
    description: DESC_SITE,
    path: `/tag/${slug}`,
  });
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [archive, cloudTags] = await Promise.all([
    getTagPage(slug, 1),
    getArchiveTags(),
  ]);
  if (!archive) notFound();

  return <TagArchiveView archive={archive} cloudTags={cloudTags} />;
}
