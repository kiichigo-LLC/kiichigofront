import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PageNav,
  PageWarning,
  SingleBackNav,
} from "@/components/page-parts";
import { metaForArticle } from "@/lib/seo";
import {
  WP,
  featuredImg,
  metaStr,
  path,
  strip,
  trajDate,
  wpPath,
} from "@/lib/wp";

const CATEGORY_SLUG = "trajectory";
const CATEGORY_ID = 4;

type Search = { slug?: string };

async function getPost(slug: string) {
  const res = await fetch(
    `${WP}/posts?slug=${encodeURIComponent(slug)}&_embed=wp:term,wp:featuredmedia`,
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

function extractTags(post: any) {
  const tags: any[] = [];
  for (const group of post._embedded?.["wp:term"] || []) {
    for (const term of group) {
      if (term.taxonomy === "post_tag") tags.push(term);
    }
  }
  return tags;
}

function TrajectoryLive({ meta }: { meta: any }) {
  if (metaStr(meta, "type") !== "live") return null;
  const mapEmbed = metaStr(meta, "地図｜LIVE");
  const schedule = metaStr(meta, "日程｜LIVE");
  const place = metaStr(meta, "場所｜LIVE");
  const time = metaStr(meta, "時間｜LIVE");
  const fee = metaStr(meta, "代金｜LIVE");
  const drink = metaStr(meta, "飲食｜LIVE");
  return (
    <>
      {mapEmbed ? (
        <>
          <iframe
            src={`https://www.google.com/maps/embed?${mapEmbed}`}
            width="100%"
            height="300px"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            title="会場地図"
          />
          <br />
          <br />
        </>
      ) : null}
      <div id="form">
        <h2 id="reserve_form">チケット予約フォーム</h2>
        <div
          className="event_details"
          style={{
            margin: 0,
            padding: "5%",
            background: "#eee",
            display: "block",
            overflow: "hidden",
            border: "1px solid #ccc",
          }}
        >
          <dl>
            <dt style={{ fontWeight: "bold" }}>公演内容</dt>
            {schedule ? (
              <dd>
                <span style={{ fontSize: "90%", color: "#777" }}>[日付]</span> {schedule}
              </dd>
            ) : null}
            {place ? (
              <dd>
                <span style={{ fontSize: "90%", color: "#777" }}>[場所]</span> {place}
              </dd>
            ) : null}
            {time ? (
              <dd>
                <span style={{ fontSize: "90%", color: "#777" }}>[時間]</span> {time}
              </dd>
            ) : null}
            {fee ? (
              <dd>
                <span style={{ fontSize: "90%", color: "#777" }}>[代金]</span> {fee}
                {drink ? <small>({drink})</small> : null}
              </dd>
            ) : null}
          </dl>
        </div>
      </div>
    </>
  );
}

/** 記事ごとの title（`?slug=` から WP を取って `<head>` に入れる） */
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
  return metaForArticle(title, `/trajectory/${slug}`, img || undefined);
}

export default async function TrajectorySinglePage({
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
  const tags = extractTags(post);
  const isCover = tags.some(
    (t: any) => t.name === "カバー" || t.slug === "tag_cover"
  );
  const youtube = metaStr(meta, "youtube").trim();
  const audio = metaStr(meta, "audio").trim();

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
                <span>
                  {title}
                  {isCover ? <small> (カバー)</small> : null}
                </span>
              </h1>
              <div className="elm-box single">
                <div className="elm-box-inr">
                  {youtube ? (
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
                      <span className="fontchange">公開日</span>｜{trajDate(post.date)}
                    </div>
                    {audio ? (
                      <div className="single-audio">
                        <div className="single-audio-inr">
                          <div className="single-audio-title">
                            <span>
                              {title}
                              {isCover ? <small> (カバー)</small> : null}
                            </span>
                            を聴く
                          </div>
                          <div className="single-audio-player">
                            <audio src={audio} id="player" />
                            <div className="player">
                              <div className="player-inr">
                                <span className="player-play"></span>
                                <span className="player-back"></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <TrajectoryLive meta={meta} />
              {tags.length > 0 ? (
                <div className="tag-cloud">
                  <div className="tag-cloud-list">
                    <ol>
                      {tags.map((tag: any) => (
                        <li key={tag.id}>
                          <Link href={path(wpPath(tag.link))}>
                            <span>
                              <small>#</small>
                              {tag.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ) : null}
              <PageNav older={adjacent.older} newer={adjacent.newer} />
              <PageWarning />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
