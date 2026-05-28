import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageWarning } from "@/components/page-parts";
import { DESC_TRAJ, pageMeta, titleWithSite } from "@/lib/seo";
import { STATIC_FETCH } from "@/lib/wp-fetch";
import { WP, getArchiveTags, path, strip, trajDate, wpPath } from "@/lib/wp";

const CATEGORY_SLUG = "trajectory";
const CATEGORY_ID = 4;
const META_TITLE = "ブログ";
const H1 = "ブログ";

async function getPosts() {
  const res = await fetch(
    `${WP}/posts?categories=${CATEGORY_ID}&per_page=100&orderby=date&order=desc`,
    STATIC_FETCH
  );
  if (!res.ok) return [];
  return res.json();
}

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: titleWithSite(META_TITLE),
    description: DESC_TRAJ,
    path: `/${CATEGORY_SLUG}`,
  });
}

export default async function TrajectoryCategoryPage() {
  const cat = await fetch(`${WP}/categories?slug=${CATEGORY_SLUG}`, {
    ...STATIC_FETCH,
  });
  if (!cat.ok) notFound();
  const cats: any = await cat.json();
  if (!cats[0]?.id) notFound();

  const [tags, posts]: any[] = await Promise.all([getArchiveTags(), getPosts()]);

  return (
    <div className="category elm">
        <div className="category-inr elm-inr">
          <h1 className="category-title elm-ttl">
            <span>{H1}</span>
          </h1>
          <div className="tag-cloud">
            <div className="tag-cloud-list">
              <ol>
                {tags.map((tag: any) => (
                  <li key={tag.id}>
                    <Link href={path(`/tag/${tag.slug}`)}>
                      <span>
                        <small>#</small>
                        {tag.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="category-main">
            <div className="category-main-inr">
              {posts.map((p: any) => (
                <div className="category-list" key={p.id}>
                  <ul>
                    <li>
                      <Link href={path(wpPath(p.link))}>
                        <span className="category-list-date">{trajDate(p.date)}</span>
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
          <PageWarning />
        </div>
      </div>
  );
}
