import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TagArchiveView } from "@/components/tag-archive-view";
import { allTagArchivePageParams } from "@/lib/build-params";
import { DESC_SITE, pageMeta, titleWithSite } from "@/lib/seo";
import { getTagPage, TAG_ARCHIVE_PER_PAGE, tagArchivePath } from "@/lib/tag-archive";
import { getArchiveTags } from "@/lib/wp";

export async function generateStaticParams() {
  return allTagArchivePageParams(TAG_ARCHIVE_PER_PAGE);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; pageNum: string }>;
}): Promise<Metadata> {
  const { slug, pageNum } = await params;
  const page = Math.max(2, parseInt(pageNum, 10) || 2);
  const data = await getTagPage(slug, page);
  if (!data) return { title: "タグがありません" };
  return pageMeta({
    title: titleWithSite(`“${data.tag.name}” 一覧`),
    description: DESC_SITE,
    path: tagArchivePath(slug, page),
  });
}

export default async function TagArchivePagedPage({
  params,
}: {
  params: Promise<{ slug: string; pageNum: string }>;
}) {
  const { slug, pageNum } = await params;
  const page = Math.max(2, parseInt(pageNum, 10) || 2);

  const [archive, cloudTags] = await Promise.all([
    getTagPage(slug, page),
    getArchiveTags(),
  ]);
  if (!archive || archive.page !== page) notFound();

  return <TagArchiveView archive={archive} cloudTags={cloudTags} />;
}
