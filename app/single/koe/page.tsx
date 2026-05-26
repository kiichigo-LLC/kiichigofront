import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  PageNav,
  PageWarning,
  SingleBackNav,
} from "@/components/page-parts";
import { metaForArticle } from "@/lib/seo";
import { WP, featuredImg, hasPortfolioTag, metaStr, strip } from "@/lib/wp";

// --- カテゴリ設定（コピペで増やすときはここだけ変える） ---
const CATEGORY_SLUG = "koe";
const CATEGORY_ID = 3;

type Search = { slug?: string };

async function getPost(slug: string) {
  const res = await fetch(
    `${WP}/posts?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia,wp:term`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  const posts: any = await res.json();
  return posts[0] || null;
}

async function getAdjacent(currentSlug: string) {
  const res = await fetch(
    `${WP}/posts?categories=${CATEGORY_ID}&per_page=100&orderby=date&order=desc`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return { older: null, newer: null };
  const items: any = await res.json();
  const list = items.map((p: any) => ({
    slug: p.slug,
    title: strip(p.title.rendered),
    permalink: p.link,
  }));
  const idx = list.findIndex((i: any) => i.slug === currentSlug);
  if (idx === -1) return { older: null, newer: null };
  return { older: list[idx + 1] || null, newer: list[idx - 1] || null };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Search>;
}): Promise<Metadata> {
  const { slug } = await searchParams;
  if (!slug) return { title: "記事がありません" };
  const post = await getPost(slug);
  if (!post) return { title: "記事がありません" };
  const title = strip(post.title.rendered);
  const img = await featuredImg(post);
  return metaForArticle(title, `/koe/${slug}`, img || undefined, hasPortfolioTag(post));
}

export default async function KoeSinglePage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { slug } = await searchParams;
  if (!slug) notFound();

  const post = await getPost(slug);
  if (!post || (post.categories && !post.categories.includes(CATEGORY_ID))) {
    notFound();
  }

  const title = strip(post.title.rendered);
  const meta = post.meta || {};
  const youtube = metaStr(meta, "youtube").trim();
  const hasYoutube = youtube.length > 0;
  const isLive = metaStr(meta, "type") === "live";

  const [adjacent, img] = await Promise.all([
    getAdjacent(slug),
    featuredImg(post),
  ]);

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
