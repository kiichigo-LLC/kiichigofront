import { PageWarning } from "@/components/site/PageWarning";
import { PageNav } from "@/components/single/PageNav";
import { PortfolioCloseNav } from "@/components/single/PortfolioCloseNav";
import { SingleBackNav } from "@/components/single/SingleBackNav";
import { themeAsset } from "@/lib/config";
import type { SingleAdjacentItem } from "@/lib/single-post";
import type { WebPostDetail } from "@/lib/web-post";

type Props = {
  post: WebPostDetail;
  adjacent: {
    older: SingleAdjacentItem | null;
    newer: SingleAdjacentItem | null;
  };
};

export function WebSingleContent({ post, adjacent }: Props) {
  const myUrl = post.myUrl.trim();
  const webFolder = post.webFolder.trim();
  const showSubImages = !myUrl && Boolean(webFolder);

  return (
    <>
      <SingleBackNav categorySlug="web" />

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
                  {myUrl ? (
                    <div className="elm-box-iframe">
                      <iframe
                        src={myUrl}
                        frameBorder="0"
                        allowFullScreen
                        scrolling="no"
                        title={post.title}
                      />
                    </div>
                  ) : null}

                  <div className="elm-box-wrap">
                    {post.featuredImage ? (
                      <div className="elm-box-img">
                        <img src={post.featuredImage} alt="" />
                      </div>
                    ) : null}

                    {showSubImages ? (
                      <div className="elm-box-img-sub elm-flex between nowrap">
                        <p>
                          <img
                            src={themeAsset(`img/${webFolder}/sub_img_1.jpg`)}
                            alt={`${webFolder} 1`}
                          />
                        </p>
                        <p>
                          <img
                            src={themeAsset(`img/${webFolder}/sub_img_2.jpg`)}
                            alt={`${webFolder} 2`}
                          />
                        </p>
                        <p>
                          <img
                            src={themeAsset(`img/${webFolder}/sub_img_3.jpg`)}
                            alt={`${webFolder} 3`}
                          />
                        </p>
                      </div>
                    ) : null}

                    <div className="elm-box-disp single">
                      {post.externalUrl ? (
                        <div className="elm-box-disp-link">
                          <a href={post.externalUrl} target="_blank" rel="noreferrer">
                            {post.externalUrl}
                          </a>
                        </div>
                      ) : null}

                      {post.excerptHtml ? (
                        <div
                          className="elm-box-disp-skill"
                          dangerouslySetInnerHTML={{ __html: post.excerptHtml }}
                        />
                      ) : null}

                      {post.publishedDate || post.productionPeriod ? (
                        <div className="elm-box-disp-date">
                          {post.publishedDate ? (
                            <>
                              <span className="fontchange">公開日｜</span>
                              {post.publishedDate}
                            </>
                          ) : null}
                          {post.productionPeriod ? (
                            <>（製作期間：{post.productionPeriod}）</>
                          ) : null}
                        </div>
                      ) : null}

                      {post.contentHtml ? (
                        <div
                          className="elm-box-disp-text"
                          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              {post.isPortfolio ? (
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
