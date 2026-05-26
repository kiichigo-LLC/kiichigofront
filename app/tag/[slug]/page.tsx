import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DESC_SITE, pageMeta, titleWithSite } from "@/lib/seo";
import { WP, getArchiveTags, path, strip, wpPath } from "@/lib/wp";

/** WP 管理画面の「1ページに表示する最大投稿数」（tag.php のメインクエリと揃える） */
const TAG_ARCHIVE_PER_PAGE = 10;

async function getTagPage(tagSlug: string, pageNum: number) {
  const t = await fetch(`${WP}/tags?slug=${encodeURIComponent(tagSlug)}`, {
    next: { revalidate: 60 },
  });
  if (!t.ok) return null;
  const tags: any = await t.json();
  const tag = tags[0];
  if (!tag) return null;
  const res = await fetch(
    `${WP}/posts?tags=${tag.id}&per_page=${TAG_ARCHIVE_PER_PAGE}&page=${pageNum}&orderby=date&order=desc`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  const posts = await res.json();
  const total = parseInt(res.headers.get("x-wp-totalpages") || "1", 10);
  return {
    tag,
    posts,
    page: pageNum,
    totalPages: total,
  };
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
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const pageNum = Math.max(1, parseInt(pageParam || "1", 10) || 1);

  const [archive, cloudTags] = await Promise.all([
    getTagPage(slug, pageNum),
    getArchiveTags(),
  ]);
  if (!archive) notFound();

  const tagPath = `/tag/${slug}`;
  const quotedTitle = `“${archive.tag.name}” 一覧`;

  return (
    <div className="tag elm">
        <div className="tag-inr elm-inr">
          <div className="tag-main">
            <div className="tag-main-inr">
              <h1 className="tag-title elm-ttl">
                <span>{quotedTitle}</span>
              </h1>
              <div className="tag-cloud">
                <div className="tag-cloud-list">
                  <ol>
                    {cloudTags.map((t: any) => (
                      <li key={t.id}>
                        <Link href={path(`/tag/${t.slug}`)}>
                          <span>
                            <small>#</small>
                            {t.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              <div className="category-main">
                <div className="category-main-inr">
                  {archive.posts.map((p: any) => (
                    <div className="category-list" key={p.id}>
                      <ul>
                        <li>
                          <Link href={path(wpPath(p.link))}>
                            <span className="category-list-title">
                              {strip(p.title.rendered)}
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pagenav">
                <div className="pagenav-inr">
                  <div className="pagenav-prev">
                    {archive.page > 1 ? (
                      <Link
                        href={
                          archive.page === 2
                            ? path(tagPath)
                            : path(`${tagPath}?page=${archive.page - 1}`)
                        }
                      >
                        前へ
                      </Link>
                    ) : null}
                  </div>
                  <div className="pagenav-center"> ｜{archive.tag.name} | </div>
                  <div className="pagenav-next">
                    {archive.page < archive.totalPages ? (
                      <Link href={path(`${tagPath}?page=${archive.page + 1}`)}>
                        次へ
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
