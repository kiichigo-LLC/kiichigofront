import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageWarning } from "@/components/page-parts";
import { DESC_WEB_CAT, pageMeta, titleWithSite } from "@/lib/seo";
import {
  WP,
  asset,
  featuredImg,
  hasPortfolioTag,
  metaStr,
  path,
  strip,
  wpPath,
  PORTFOLIO_TAG_ID,
} from "@/lib/wp";

const CATEGORY_SLUG = "web";
const CATEGORY_ID = 2;
const META_TITLE = "合同会社キイチゴのウェブの仕事一覧";
const H1 = "ホームページ制作・システム開発";

async function getPosts() {
  const res = await fetch(
    `${WP}/posts?categories=${CATEGORY_ID}&per_page=100&orderby=date&order=desc&_embed=wp:featuredmedia,wp:term&tags_exclude=${PORTFOLIO_TAG_ID}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return [];
  const posts: any[] = await res.json();
  return posts.filter((p) => !hasPortfolioTag(p));
}

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: titleWithSite(META_TITLE),
    description: DESC_WEB_CAT,
    path: `/category/${CATEGORY_SLUG}`,
  });
}

export default async function WebCategoryPage() {
  const cat = await fetch(`${WP}/categories?slug=${CATEGORY_SLUG}`, {
    next: { revalidate: 60 },
  });
  if (!cat.ok) notFound();
  const cats: any = await cat.json();
  if (!cats[0]?.id) notFound();

  const posts: any[] = await getPosts();
  const items = await Promise.all(
    posts.map(async (p: any) => ({ post: p, img: await featuredImg(p) }))
  );

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
                const youtube = metaStr(p.meta, "youtube").trim();
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
                          <Link href={href}>
                            <img
                              src={asset("img/youtube_face.png")}
                              className="elm-box-img-youtube"
                              alt=""
                            />
                          </Link>
                        ) : (
                          <Link href={href}>
                            {img ? <img src={img} alt="" /> : null}
                          </Link>
                        )}
                      </div>
                      <div className="elm-box-disp">
                        <Link href={href}>
                          <div className="elm-box-disp-ttl">
                            <span>{strip(p.title.rendered)}</span>
                          </div>
                          <div className="elm-box-disp-cap">{metaStr(p.meta, "h3")}</div>
                          {dateLabel.trim() ? (
                            <div className="elm-box-disp-date">{dateLabel}</div>
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
