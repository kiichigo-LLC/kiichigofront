"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageWarning } from "@/components/page-parts";
import { featuredImgClient, wpGet } from "@/lib/wp-client";
import { asset, extractYoutubeId, metaStr, path, strip, wpPath } from "@/lib/wp";
import { WpError, WpLoading } from "@/components/wp/wp-status";

export function PortfolioListView() {
  const [items, setItems] = useState<{ post: any; img: string }[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cats = await wpGet<any[]>("/categories?slug=web");
        const id = cats[0]?.id;
        if (!id) {
          if (!cancelled) setItems([]);
          return;
        }
        const posts = await wpGet<any[]>(
          `/posts?categories=${id}&per_page=100&orderby=date&order=desc&_embed=wp:featuredmedia`
        );
        const mapped = await Promise.all(
          posts.map(async (p) => ({ post: p, img: await featuredImgClient(p) }))
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
          <span>ポートフォリオ</span>
        </h1>
        <blockquote className="single-title-sub elm-ttl-sub">
          <a
            href="https://kiichigonokami.com/#unkr-04"
            style={{ borderBottom: "1px solid #ff0348" }}
            target="_blank"
            rel="noreferrer"
          >
            スキルシート
          </a>
          ｜
          <Link
            href={path("/portfolio/dtp")}
            style={{ borderBottom: "1px solid #ff0348" }}
            target="_blank"
          >
            DTP系 <b>→</b>
          </Link>
        </blockquote>
        <div className="category-main">
          <div className="category-main-inr elm-flex between">
            {items.map(({ post: p, img }) => {
              const href = path(`${wpPath(p.link)}?from=portfolio`);
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
                        <a href={href} target="_blank" rel="noreferrer">
                          <img
                            src={asset("img/youtube_face.png")}
                            className="elm-box-img-youtube"
                            alt=""
                          />
                        </a>
                      ) : (
                        <a href={href} target="_blank" rel="noreferrer">
                          {img ? <img src={img} alt="" /> : null}
                        </a>
                      )}
                    </div>
                    <div className="elm-box-disp">
                      <a href={href} target="_blank" rel="noreferrer">
                        <div className="elm-box-disp-ttl">
                          <span>{strip(p.title.rendered)}</span>
                        </div>
                        <div className="elm-box-disp-cap">{metaStr(p.meta, "h3")}</div>
                        {metaStr(p.meta, "発表日").trim() ? (
                          <div className="elm-box-disp-date">{metaStr(p.meta, "発表日")}</div>
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

export function PortfolioDtpView() {
  const [images, setImages] = useState<{ id: number; url: string }[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pages = await wpGet<any[]>("/pages?slug=dtp");
        const html = pages[0]?.content?.rendered || "";
        const m = html.match(/\[gallery[^\]]*ids=["']([^"']+)["']/);
        if (!m?.[1]) {
          if (!cancelled) setImages([]);
          return;
        }
        const ids = m[1]
          .split(",")
          .map((s: string) => parseInt(s.trim(), 10))
          .filter((n: number) => n > 0);
        const out: { id: number; url: string }[] = [];
        for (const id of ids) {
          try {
            const media = await wpGet<any>(`/media/${id}`);
            if (media.source_url) out.push({ id: media.id, url: media.source_url });
          } catch {
            /* skip */
          }
        }
        if (!cancelled) setImages(out);
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <WpError />;
  if (!images) return <WpLoading />;

  return (
    <div className="category elm">
      <div className="category-inr elm-inr">
        <h1 className="category-title elm-ttl">
          <span>DTP系ポートフォリオ</span>
        </h1>
        <blockquote className="single-title-sub elm-ttl-sub">
          <Link href={path("/portfolio")} style={{ borderBottom: "1px solid #ff0348" }} target="_blank">
            <b>←</b> WEB系
          </Link>
          ｜
          <a
            href="https://kiichigonokami.com/#unkr-04"
            style={{ borderBottom: "1px solid #ff0348" }}
            target="_blank"
            rel="noreferrer"
          >
            スキルシート
          </a>
        </blockquote>
        <div className="category-main dtp">
          <div className="category-main-inr elm-flex between">
            {images.length > 0 ? (
              images.map((image) => (
                <div className="elm-box dtp" key={image.id}>
                  <div className="elm-box-inr">
                    <div className="elm-box-img">
                      <a href={image.url} className="group">
                        <img src={image.url} className="dsn contain" alt="" />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>ギャラリーが見つかりません。</p>
            )}
          </div>
        </div>
        <PageWarning />
      </div>
    </div>
  );
}
