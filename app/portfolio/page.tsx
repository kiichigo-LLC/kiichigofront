import type { Metadata } from "next";
import Link from "next/link";
import { PageWarning } from "@/components/page-parts";
import { DESC_SITE, pageMeta, titleWithSite } from "@/lib/seo";
import { STATIC_FETCH } from "@/lib/wp-fetch";
import {
  WP,
  asset,
  featuredImg,
  metaStr,
  path,
  strip,
  wpPath,
} from "@/lib/wp";

async function getWebPosts() {
  const cat = await fetch(`${WP}/categories?slug=web`, STATIC_FETCH);
  const cats: any = await cat.json();
  const id = cats[0]?.id;
  if (!id) return [];
  const res = await fetch(
    `${WP}/posts?categories=${id}&per_page=100&orderby=date&order=desc&_embed=wp:featuredmedia`,
    STATIC_FETCH
  );
  if (!res.ok) return [];
  return res.json();
}

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: titleWithSite("ポートフォリオ"),
    description: DESC_SITE,
    path: "/portfolio",
    noIndex: true,
  });
}

export default async function PortfolioPage() {
  const posts: any = await getWebPosts();
  const items = await Promise.all(
    posts.map(async (p: any) => ({ post: p, img: await featuredImg(p) }))
  );

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
                const youtube = metaStr(p.meta, "youtube").trim();
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
                          <Link href={href} target="_blank" rel="noreferrer">
                            <img src={asset("img/youtube_face.png")} className="elm-box-img-youtube" alt="" />
                          </Link>
                        ) : (
                          <Link href={href} target="_blank" rel="noreferrer">
                            {img ? <img src={img} alt="" /> : null}
                          </Link>
                        )}
                      </div>
                      <div className="elm-box-disp">
                        <Link href={href} target="_blank" rel="noreferrer">
                          <div className="elm-box-disp-ttl">
                            <span>{strip(p.title.rendered)}</span>
                          </div>
                          <div className="elm-box-disp-cap">{metaStr(p.meta, "h3")}</div>
                          {metaStr(p.meta, "発表日").trim() ? (
                            <div className="elm-box-disp-date">{metaStr(p.meta, "発表日")}</div>
                          ) : null}
                        </Link>
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
