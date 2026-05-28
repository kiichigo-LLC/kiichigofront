import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  PageNav,
  PageWarning,
  PortfolioCloseNav,
  SingleBackNav,
} from "@/components/page-parts";
import { PortfolioAccessGuard } from "@/components/portfolio-access-guard";
import { postSlugParams } from "@/lib/build-params";
import { metaForArticle } from "@/lib/seo";
import { STATIC_FETCH } from "@/lib/wp-fetch";
import {
  WP,
  asset,
  featuredImg,
  hasPortfolioTag,
  metaStr,
  strip,
  PORTFOLIO_TAG_ID,
} from "@/lib/wp";

const CATEGORY_SLUG = "web";
const CATEGORY_ID = 2;

export async function generateStaticParams() {
  return postSlugParams(CATEGORY_ID);
}

type Params = { slug: string };

async function getPost(slug: string) {
  const res = await fetch(
    `${WP}/posts?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia,wp:term`,
    STATIC_FETCH
  );
  if (!res.ok) return null;
  const posts: any = await res.json();
  return posts[0] || null;
}

async function getWebArchiveList() {
  const list: { slug: string; title: string; permalink: string }[] = [];
  let page = 1;
  let totalPages = 1;
  do {
    const res = await fetch(
      `${WP}/posts?categories=${CATEGORY_ID}&per_page=100&page=${page}&orderby=date&order=desc&tags_exclude=${PORTFOLIO_TAG_ID}&_embed=wp:term`,
      STATIC_FETCH
    );
    if (!res.ok) break;
    const items: any[] = await res.json();
    for (const p of items) {
      if (hasPortfolioTag(p)) continue;
      list.push({
        slug: p.slug,
        title: strip(p.title.rendered),
        permalink: p.link,
      });
    }
    totalPages = parseInt(res.headers.get("x-wp-totalpages") || "1", 10);
    page++;
  } while (page <= totalPages);
  return list;
}

async function getAdjacent(currentSlug: string) {
  const list = await getWebArchiveList();
  const idx = list.findIndex((i) => i.slug === currentSlug);
  if (idx === -1) return { older: null, newer: null };
  return {
    older: list[idx - 1] || null,
    newer: list[idx + 1] || null,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "記事がありません" };
  const title = strip(post.title.rendered);
  const img = await featuredImg(post);
  return metaForArticle(title, `/web/${slug}`, img || undefined, hasPortfolioTag(post));
}

export default async function WebSinglePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const post = await getPost(slug);
  if (!post || (post.categories && !post.categories.includes(CATEGORY_ID))) {
    notFound();
  }

  const title = strip(post.title.rendered);
  const meta = post.meta || {};
  const isPortfolio = hasPortfolioTag(post);

  const myUrl = metaStr(meta, "myURL").trim();
  const webFolder = metaStr(meta, "WEB｜フォルダ名").trim();
  const showSubImages = !myUrl && Boolean(webFolder);

  const [adjacent, img] = await Promise.all([
    getAdjacent(slug),
    featuredImg(post),
  ]);

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
