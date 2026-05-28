/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { path, strip, wpPath } from "@/lib/wp";
import { tagArchivePath } from "@/lib/tag-archive";

type Props = {
  archive: {
    tag: { id: number; name: string; slug: string };
    posts: any[];
    page: number;
    totalPages: number;
  };
  cloudTags: any[];
};

export function TagArchiveView({ archive, cloudTags }: Props) {
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
                    <Link href={path(tagArchivePath(archive.tag.slug, archive.page - 1))}>
                      前へ
                    </Link>
                  ) : null}
                </div>
                <div className="pagenav-center"> ｜{archive.tag.name} | </div>
                <div className="pagenav-next">
                  {archive.page < archive.totalPages ? (
                    <Link href={path(tagArchivePath(archive.tag.slug, archive.page + 1))}>
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
