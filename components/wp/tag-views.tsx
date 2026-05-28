"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { titleWithSite } from "@/lib/seo";
import {
  getArchiveTagsClient,
  getTagArchiveClient,
  tagArchivePath,
} from "@/lib/wp-client";
import { path, strip, wpPath } from "@/lib/wp";
import { WpError, WpLoading } from "@/components/wp/wp-status";

const PAGE_TITLE = "タグ一覧";

export function TagIndexView() {
  const [tags, setTags] = useState<any[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getArchiveTagsClient()
      .then((t) => {
        if (!cancelled) setTags(t);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <WpError />;
  if (!tags) return <WpLoading />;

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
                      <a href={path(`/tag/${t.slug}`)}>
                        <span>
                          <small>#</small>
                          {t.name}
                        </span>
                      </a>
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

function parseTagPath(pathname: string) {
  const m = pathname.match(/^\/tag\/([^/]+)(?:\/page\/(\d+))?\/?$/);
  if (!m?.[1] || m[1] === "entry") return null;
  return {
    tagSlug: decodeURIComponent(m[1]),
    page: Math.max(1, parseInt(m[2] || "1", 10) || 1),
  };
}

export function TagEntryView() {
  const pathname = usePathname();
  const parsed = parseTagPath(pathname);
  const [archive, setArchive] = useState<any>(null);
  const [cloudTags, setCloudTags] = useState<any[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!parsed) {
      setError(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [data, tags] = await Promise.all([
          getTagArchiveClient(parsed.tagSlug, parsed.page),
          getArchiveTagsClient(),
        ]);
        if (!data) {
          if (!cancelled) setError(true);
          return;
        }
        if (!cancelled) {
          setArchive(data);
          setCloudTags(tags);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [parsed?.tagSlug, parsed?.page]);

  const quotedTitle = archive ? `“${archive.tag.name}” 一覧` : PAGE_TITLE;
  useDocumentTitle(titleWithSite(quotedTitle));

  if (!parsed || error) return <WpError message="タグがありません。" />;
  if (!archive || !cloudTags) return <WpLoading />;

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
                      <a href={path(`/tag/${t.slug}`)}>
                        <span>
                          <small>#</small>
                          {t.name}
                        </span>
                      </a>
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
                        <a href={path(wpPath(p.link))}>
                          <span className="category-list-title">
                            {strip(p.title.rendered)}
                          </span>
                        </a>
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
                    <a href={path(tagArchivePath(archive.tag.slug, archive.page - 1))}>
                      前へ
                    </a>
                  ) : null}
                </div>
                <div className="pagenav-center"> ｜{archive.tag.name} | </div>
                <div className="pagenav-next">
                  {archive.page < archive.totalPages ? (
                    <a href={path(tagArchivePath(archive.tag.slug, archive.page + 1))}>
                      次へ
                    </a>
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
