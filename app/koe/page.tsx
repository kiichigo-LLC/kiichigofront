import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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

const CATEGORY_SLUG = "koe";
const CATEGORY_ID = 3;
const META_TITLE = "合同会社キイチゴの声の仕事一覧";
const H1 = "歌・作詞・作曲・ナレーション";

async function getPosts() {
  const res = await fetch(
    `${WP}/posts?categories=${CATEGORY_ID}&per_page=100&orderby=date&order=desc&_embed=wp:featuredmedia`,
    STATIC_FETCH
  );
  if (!res.ok) return [];
  return res.json();
}

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: titleWithSite(META_TITLE),
    description: DESC_SITE,
    path: `/${CATEGORY_SLUG}`,
  });
}

export default async function KoeCategoryPage() {
  const cat = await fetch(`${WP}/categories?slug=${CATEGORY_SLUG}`, {
    ...STATIC_FETCH,
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
                          <div className="elm-box-disp-date">
                            {metaStr(p.meta, "発表日")}
                          </div>
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
