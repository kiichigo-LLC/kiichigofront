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
import { featuredImgClient, getArchiveTagsClient, wpGet } from "@/lib/wp-client";
import { extractYoutubeId, metaStr, path, strip, trajDate, wpPath } from "@/lib/wp";
import { WpError, WpLoading } from "@/components/wp/wp-status";

const CATEGORY_SLUG = "trajectory";
const CATEGORY_ID = 4;
const H1 = "ブログ";

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

export function TrajectoryListView() {
  const [tags, setTags] = useState<any[] | null>(null);
  const [posts, setPosts] = useState<any[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [t, p] = await Promise.all([
          getArchiveTagsClient(),
          wpGet<any[]>(
            `/posts?categories=${CATEGORY_ID}&per_page=100&orderby=date&order=desc`
          ),
        ]);
        if (!cancelled) {
          setTags(t);
          setPosts(p);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <WpError />;
  if (!tags || !posts) return <WpLoading />;

  return (
    <div className="category elm">
      <div className="category-inr elm-inr">
        <h1 className="category-title elm-ttl">
          <span>{H1}</span>
        </h1>
        <div className="tag-cloud">
          <div className="tag-cloud-list">
            <ol>
              {tags.map((tag: any) => (
                <li key={tag.id}>
                  <a href={path(`/tag/${tag.slug}`)}>
                    <span>
                      <small>#</small>
                      {tag.name}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="category-main">
          <div className="category-main-inr">
            {posts.map((p: any) => (
              <div className="category-list" key={p.id}>
                <ul>
                  <li>
                    <a href={path(wpPath(p.link))}>
                      <span className="category-list-date">{trajDate(p.date)}</span>
                      <span className="category-list-title">{strip(p.title.rendered)}</span>
                    </a>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
        <PageWarning />
      </div>
    </div>
  );
}

function parseTrajectorySlug(pathname: string) {
  const m = pathname.match(/^\/trajectory\/([^/]+)\/?$/);
  const slug = m?.[1] ?? "";
  return slug && slug !== "entry" ? slug : "";
}

export function TrajectoryEntryView() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const slug = parseTrajectorySlug(pathname);
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
          `/posts?slug=${encodeURIComponent(slug)}&_embed=wp:term,wp:featuredmedia`
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
  const tags = extractTags(post);
  const isCover = tags.some(
    (t: any) => t.name === "カバー" || t.slug === "tag_cover"
  );
  const youtube = extractYoutubeId(metaStr(meta, "youtube"));
  const audio = metaStr(meta, "audio").trim();

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
                          <a href={path(wpPath(tag.link))}>
                            <span>
                              <small>#</small>
                              {tag.name}
                            </span>
                          </a>
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
