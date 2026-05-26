import type { Metadata } from "next";
import Link from "next/link";
import { DESC_SITE, pageMeta, titleWithSite } from "@/lib/seo";
import { getArchiveTags, path } from "@/lib/wp";

const PAGE_TITLE = "タグ一覧";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: titleWithSite(PAGE_TITLE),
    description: DESC_SITE,
    path: "/tag",
  });
}

export default async function TagIndexPage() {
  const tags = await getArchiveTags();

  return (
    <div className="tag elm">
      <div className="tag-inr elm-inr">
        <div className="tag-main">
          <div className="tag-main-inr">
            <h1 className="tag-title elm-ttl">
              <span>{PAGE_TITLE}</span>
            </h1>
            <div className="tag-cloud">
              <div className="tag-cloud-list">
                <ol>
                  {tags.map((t) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}
