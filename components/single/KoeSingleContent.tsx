import { PageWarning } from "@/components/site/PageWarning";
import { PageNav } from "@/components/single/PageNav";
import { SingleBackNav } from "@/components/single/SingleBackNav";
import type { KoePostDetail } from "@/lib/koe-post";
import type { SingleAdjacentItem } from "@/lib/single-post";

type Props = {
  post: KoePostDetail;
  adjacent: {
    older: SingleAdjacentItem | null;
    newer: SingleAdjacentItem | null;
  };
};

export function KoeSingleContent({ post, adjacent }: Props) {
  const youtube = post.youtube.trim();
  const hasYoutube = youtube.length > 0;

  return (
    <>
      <SingleBackNav categorySlug="koe" />

      <div className="single elm">
        <div className="single-inr elm-inr">
          <div className="single-main">
            <div className="single-main-inr">
              <h1 className="single-title elm-ttl">
                <span>{post.title}</span>
              </h1>

              {post.h3 ? (
                <h2 className="single-title-sub elm-ttl-sub">{post.h3}</h2>
              ) : null}

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
                      <span className="fontchange">{post.datePrefix}</span>｜
                      {post.dateLabel}
                    </div>
                    {post.contentHtml ? (
                      <div
                        className="elm-box-disp-text"
                        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
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
