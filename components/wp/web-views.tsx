"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  PageNav,
  PageWarning,
  PortfolioCloseNav,
  SingleBackNav,
} from "@/components/page-parts";
import { PortfolioAccessGuard } from "@/components/portfolio-access-guard";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { titleWithSite } from "@/lib/seo";
import { featuredImgClient, wpGet, wpGetWithHeaders } from "@/lib/wp-client";
import {
  asset,
  extractYoutubeId,
  hasPortfolioTag,
  metaStr,
  path,
  strip,
  wpPath,
  PORTFOLIO_TAG_ID,
} from "@/lib/wp";
import { WpError, WpLoading } from "@/components/wp/wp-status";

const CATEGORY_SLUG = "web";
const CATEGORY_ID = 2;
const H1 = "ホームページ制作・システム開発";

export function WebListView() {
  const [items, setItems] = useState<{ post: any; img: string }[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const posts = await wpGet<any[]>(
          `/posts?categories=${CATEGORY_ID}&per_page=100&orderby=date&order=desc&_embed=wp:featuredmedia,wp:term&tags_exclude=${PORTFOLIO_TAG_ID}`
        );
        const filtered = posts.filter((p) => !hasPortfolioTag(p));
        const mapped = await Promise.all(
          filtered.map(async (p) => ({ post: p, img: await featuredImgClient(p) }))
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
            href="https://kiichigonokami.com/#unkr-04"
            style={{ borderBottom: "1px solid #ff0348" }}
            target="_blank"
            rel="noreferrer"
          >
            スキルシートはこちら
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
              const dateLabel = metaStr(p.meta, "発表日");
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
                        {dateLabel.trim() ? (
                          <div className="elm-box-disp-date">{dateLabel}</div>
                        ) : null}
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

function parseWebSlug(pathname: string) {
  const m = pathname.match(/^\/web\/([^/]+)\/?$/);
  const slug = m?.[1] ?? "";
  return slug && slug !== "entry" ? slug : "";
}

async function getWebNavList() {
  const list: { slug: string; title: string; permalink: string }[] = [];
  let page = 1;
  let totalPages = 1;
  do {
    const { data: items, headers } = await wpGetWithHeaders<any[]>(
      `/posts?categories=${CATEGORY_ID}&per_page=100&page=${page}&orderby=date&order=desc&tags_exclude=${PORTFOLIO_TAG_ID}&_embed=wp:term`
    );
    for (const p of items) {
      if (hasPortfolioTag(p)) continue;
      list.push({
        slug: p.slug,
        title: strip(p.title.rendered),
        permalink: p.link,
      });
    }
    totalPages = parseInt(headers.get("x-wp-totalpages") || "1", 10);
    page++;
  } while (page <= totalPages);
  return list;
}

export function WebEntryView() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const slug = parseWebSlug(pathname);
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
        const list = await getWebNavList();
        const idx = list.findIndex((i) => i.slug === slug);
        const image = await featuredImgClient(p);
        if (!cancelled) {
          setPost(p);
          setImg(image);
          setAdjacent({
            older: list[idx - 1] || null,
            newer: list[idx + 1] || null,
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
  const isPortfolio = hasPortfolioTag(post);
  const myUrl = metaStr(meta, "myURL").trim();
  const webFolder = metaStr(meta, "WEB｜フォルダ名").trim();
  const showSubImages = !myUrl && Boolean(webFolder);

  return (
    <>
      {isPortfolio ? <PortfolioAccessGuard /> : null}
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
                  {myUrl ? (
                    <div className="elm-box-iframe">
                      <iframe
                        src={myUrl}
                        frameBorder="0"
                        allowFullScreen
                        scrolling="no"
                        title={title}
                      />
                    </div>
                  ) : null}
                  <div className="elm-box-wrap">
                    {img ? (
                      <div className="elm-box-img">
                        <img src={img} alt="" />
                      </div>
                    ) : null}
                    {showSubImages ? (
                      <div className="elm-box-img-sub elm-flex between nowrap">
                        {[1, 2, 3].map((n) => (
                          <p key={n}>
                            <img
                              src={asset(`img/${webFolder}/sub_img_${n}.jpg`)}
                              alt={`${webFolder} ${n}`}
                            />
                          </p>
                        ))}
                      </div>
                    ) : null}
                    <div className="elm-box-disp single">
                      {metaStr(meta, "URL") ? (
                        <div className="elm-box-disp-link">
                          <a href={metaStr(meta, "URL")} target="_blank" rel="noreferrer">
                            {metaStr(meta, "URL")}
                          </a>
                        </div>
                      ) : null}
                      {post.excerpt?.rendered ? (
                        <div
                          className="elm-box-disp-skill"
                          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                        />
                      ) : null}
                      {metaStr(meta, "発表日") || metaStr(meta, "製作期間") ? (
                        <div className="elm-box-disp-date">
                          {metaStr(meta, "発表日") ? (
                            <>
                              <span className="fontchange">公開日｜</span>
                              {metaStr(meta, "発表日")}
                            </>
                          ) : null}
                          {metaStr(meta, "製作期間") ? (
                            <>（製作期間：{metaStr(meta, "製作期間")}）</>
                          ) : null}
                        </div>
                      ) : null}
                      {post.content?.rendered ? (
                        <div
                          className="elm-box-disp-text"
                          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              {isPortfolio ? (
                <PortfolioCloseNav />
              ) : (
                <PageNav older={adjacent.older} newer={adjacent.newer} />
              )}
              <PageWarning />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
