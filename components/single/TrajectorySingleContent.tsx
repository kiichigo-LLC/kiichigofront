import { PageWarning } from "@/components/site/PageWarning";
import { PageNav } from "@/components/single/PageNav";
import { TrajectoryLiveSection } from "@/components/single/TrajectoryLiveSection";
import { SingleBackNav } from "@/components/single/SingleBackNav";
import { sitePath } from "@/lib/config";
import type { TrajectoryPostDetail } from "@/lib/trajectory-post";
import { permalinkToPath, type TrajectoryListItem } from "@/lib/wp";
import Link from "next/link";

type Props = {
  post: TrajectoryPostDetail;
  adjacent: {
    older: TrajectoryListItem | null;
    newer: TrajectoryListItem | null;
  };
};

function CoverSuffix({ isCover }: { isCover: boolean }) {
  if (!isCover) return null;
  return <> (カバー)</>;
}

export function TrajectorySingleContent({ post, adjacent }: Props) {
  const youtube = post.youtube.trim();
  const hasYoutube = youtube.length > 0;
  const hasAudio = Boolean(post.audio.trim());

  return (
    <>
      <SingleBackNav categorySlug="trajectory" />

      <div className="single elm">
        <div className="single-inr elm-inr">
          <div className="single-main">
            <div className="single-main-inr">
              <h1 className="single-title elm-ttl">
                <span>
                  {post.title} <small><CoverSuffix isCover={post.isCover} /></small>
                </span>
              </h1>

              <div className="elm-box single">
                <div className="elm-box-inr">
                  {hasYoutube ? (
                    <div className="youtube">
                      <iframe
                        src={`https://www.youtube.com/embed/${youtube}`}
                        frameBorder="0"
                        allowFullScreen
                        title={post.title}
                      />
                    </div>
                  ) : post.featuredImage ? (
                    <div className="elm-box-img">
                      <img src={post.featuredImage} alt="" />
                    </div>
                  ) : null}

                  <div className="elm-box-disp single">
                    <div className="elm-box-disp-date">
                      <span className="fontchange">公開日</span>｜{post.publishedLabel}
                    </div>

                    {hasAudio ? (
                      <div className="single-audio">
                        <div className="single-audio-inr">
                          <div className="single-audio-title">
                            <span>
                              {post.title}{" "}
                              <small>
                                <CoverSuffix isCover={post.isCover} />
                              </small>
                            </span>
                            を聴く
                          </div>
                          <div className="single-audio-player">
                            <audio src={post.audio} id="player" />
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

              <TrajectoryLiveSection meta={post.meta} />

              {post.tags.length > 0 ? (
                <div className="tag-cloud">
                  <div className="tag-cloud-list">
                    <ol>
                      {post.tags.map((tag) => (
                        <li key={tag.id}>
                          <Link href={sitePath(permalinkToPath(tag.link))}>
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

              <PageNav
                older={
                  adjacent.older
                    ? {
                        title: adjacent.older.title,
                        permalink: adjacent.older.permalink,
                      }
                    : null
                }
                newer={
                  adjacent.newer
                    ? {
                        title: adjacent.newer.title,
                        permalink: adjacent.newer.permalink,
                      }
                    : null
                }
              />

              <PageWarning />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
