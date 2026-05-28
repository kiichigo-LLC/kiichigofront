"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  PageNav,
  PageWarning,
  SingleBackNav,
} from "@/components/page-parts";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { titleWithSite } from "@/lib/seo";
import { featuredImgClient, wpGet } from "@/lib/wp-client";
import { asset, extractYoutubeId, metaStr, path, strip, wpPath } from "@/lib/wp";
import { WpError, WpLoading } from "@/components/wp/wp-status";

const CATEGORY_SLUG = "koe";
const CATEGORY_ID = 3;
const H1 = "歌・作詞・作曲・ナレーション";

export function KoeListView() {
  const [items, setItems] = useState<{ post: any; img: string }[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const posts = await wpGet<any[]>(
          `/posts?categories=${CATEGORY_ID}&per_page=100&orderby=date&order=desc&_embed=wp:featuredmedia`
        );
        const mapped = await Promise.all(
          posts.map(async (p) => {
            const youtube = extractYoutubeId(metaStr(p.meta, "youtube"));
            return { post: p, img: youtube ? "" : await featuredImgClient(p) };
          })
        );
        if (!cancelled) setItems(mapped);
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <WpError />;
  if (!items) return <WpLoading />;

  return (
    <div className="category elm">
      <div className="category-inr elm-inr">
        <h1 className="category-title elm-ttl">
          <span>{H1}</span>
        </h1>
        <blockquote className="single-title-sub elm-ttl-sub">
          <a
            href="https://rubu.studio/"
            style={{ borderBottom: "1px solid #ff0348" }}
            target="_blank"
            rel="noreferrer"
          >
            機材リスト<small>と</small>録音サンプル
          </a>
        </blockquote>
        <div className="category-main">
          <div className="category-main-inr elm-flex between">
            {items.map(({ post: p, img }) => {
              const href = path(wpPath(p.link));
              const youtube = extractYoutubeId(metaStr(p.meta, "youtube"));
              const hasYoutube = youtube.length > 0;
              const imgClass = hasYoutube ? "elm-box-img ythum" : "elm-box-img";
              const imgStyle = hasYoutube
                ? {
                    background: `url(https://i.ytimg.com/vi/${youtube}/hqdefault.jpg) center center no-repeat`,
                    backgroundSize: "cover" as const,
                  }
                : undefined;
              return (
                <div className="elm-box" key={p.id}>
                  <div className="elm-box-inr">
                    <div className={imgClass} style={imgStyle}>
                      {hasYoutube ? (
                        <a href={href}>
                          <img
                            src={asset("img/youtube_face.png")}
                            className="elm-box-img-youtube"
                            alt=""
                          />
                        </a>
                      ) : (
                        <a href={href}>
                          {img ? <img src={img} alt="" /> : null}
                        </a>
                      )}
                    </div>
                    <div className="elm-box-disp">
                      <a href={href}>
                        <div className="elm-box-disp-ttl">
                          <span>{strip(p.title.rendered)}</span>
                        </div>
                        <div className="elm-box-disp-cap">{metaStr(p.meta, "h3")}</div>
                        <div className="elm-box-disp-date">{metaStr(p.meta, "発表日")}</div>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <PageWarning />
      </div>
    </div>
  );
}

function parseKoeSlug(pathname: string) {
  const m = pathname.match(/^\/koe\/([^/]+)\/?$/);
  const slug = m?.[1] ?? "";
  return slug && slug !== "entry" ? slug : "";
}

export function KoeEntryView() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const slug = parseKoeSlug(pathname);
  const [state, setState] = useState<"loading" | "error" | "ready" | "missing">("loading");
  const [post, setPost] = useState<any>(null);
  const [img, setImg] = useState("");
  const [adjacent, setAdjacent] = useState<{
    older: { title: string; permalink: string } | null;
    newer: { title: string; permalink: string } | null;
  }>({ older: null, newer: null });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!slug) {
      setState("missing");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const posts = await wpGet<any[]>(
          `/posts?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia,wp:term`
        );
        const p = posts[0];
        if (!p || (p.categories && !p.categories.includes(CATEGORY_ID))) {
          if (!cancelled) setState("missing");
          return;
        }
        const list = await wpGet<any[]>(
          `/posts?categories=${CATEGORY_ID}&per_page=100&orderby=date&order=desc`
        );
        const nav = list.map((item: any) => ({
          slug: item.slug,
          title: strip(item.title.rendered),
          permalink: item.link,
        }));
        const idx = nav.findIndex((i) => i.slug === slug);
        const image = await featuredImgClient(p);
        if (!cancelled) {
          setPost(p);
          setImg(image);
          setAdjacent({
            older: nav[idx + 1] || null,
            newer: nav[idx - 1] || null,
          });
          setState("ready");
        }
      } catch {
        if (!cancelled) setState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mounted, slug]);

  const title = post ? strip(post.title.rendered) : "";
  useDocumentTitle(post ? titleWithSite(title) : titleWithSite("記事"));

  if (!mounted) return <WpLoading />;
  if (!slug || state === "missing") return <WpError message="記事がありません。" />;
  if (state === "error") return <WpError />;
  if (state !== "ready" || !post) return <WpLoading />;

  const meta = post.meta || {};
  const youtube = extractYoutubeId(metaStr(meta, "youtube"));
  const hasYoutube = youtube.length > 0;
  const isLive = metaStr(meta, "type") === "live";

  return (
    <>
      <SingleBackNav categorySlug={CATEGORY_SLUG} />
      <div className="single elm">
        <div className="single-inr elm-inr">
          <div className="single-main">
            <div className="single-main-inr">
              <h1 className="single-title elm-ttl">
                <span>{title}</span>
              </h1>
              {metaStr(meta, "h3") ? (
                <h2 className="single-title-sub elm-ttl-sub">{metaStr(meta, "h3")}</h2>
              ) : null}
              <div className="elm-box single">
                <div className="elm-box-inr">
                  {hasYoutube ? (
                    <div className="youtube">
                      <iframe
                        src={`https://www.youtube.com/embed/${youtube}`}
                        frameBorder="0"
                        allowFullScreen
                        title={title}
                      />
                    </div>
                  ) : img ? (
                    <div className="elm-box-img">
                      <img src={img} alt="" />
                    </div>
                  ) : null}
                  <div className="elm-box-disp single">
                    <div className="elm-box-disp-date">
                      <span className="fontchange">{isLive ? "公演日" : "公開日"}</span>｜
                      {metaStr(meta, "発表日")}
                    </div>
                    {post.content?.rendered ? (
                      <div
                        className="elm-box-disp-text"
                        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
              <PageNav older={adjacent.older} newer={adjacent.newer} />
              <PageWarning />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
