import { TagArchiveContent } from "@/components/tag/TagArchiveContent";
import { SiteShell } from "@/components/site/SiteShell";
import { SITE_URL, themeAsset } from "@/lib/config";
import { getTagArchivePage, getTagCloudTags } from "@/lib/tag-archive";
import { getNavNewFlags, getSiteInfo, permalinkToPath } from "@/lib/wp";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagArchivePage(slug, 1);
  if (!tag) {
    return { title: "タグがありません" };
  }

  let siteName = "合同会社キイチゴ";
  try {
    const site = await getSiteInfo();
    if (site.name) siteName = site.name;
  } catch {
    /* fallback */
  }

  const title = `“${tag.tag.name}” 一覧｜${siteName}`;
  const canonical = SITE_URL
    ? `${SITE_URL.replace(/\/$/, "")}/tag/${slug}`
    : `https://kiichigo.work/tag/${slug}`;
  const ogp = themeAsset("img/ogp.jpg");

  return {
    title,
    alternates: { canonical },
    openGraph: {
      title,
      url: canonical,
      type: "article",
      images: [{ url: ogp }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Kiichigo_llc",
      title,
      images: [ogp],
    },
  };
}

export default async function TagArchivePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const [navNew, archive, cloudTags] = await Promise.all([
    getNavNewFlags(),
    getTagArchivePage(slug, page),
    getTagCloudTags(),
  ]);

  if (!archive) {
    notFound();
  }

  const canonical = SITE_URL
    ? `${SITE_URL.replace(/\/$/, "")}${permalinkToPath(archive.tag.link)}`
    : `https://kiichigo.work${permalinkToPath(archive.tag.link)}`;

  const shellTitle = `“${archive.tag.name}” 一覧｜合同会社キイチゴ`;

  return (
    <SiteShell
      title={shellTitle}
      description={shellTitle}
      canonicalUrl={canonical}
      navNew={navNew}
      isTagPage
    >
      <TagArchiveContent archive={archive} cloudTags={cloudTags} />
    </SiteShell>
  );
}
