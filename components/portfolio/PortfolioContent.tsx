import { PageWarning } from "@/components/site/PageWarning";
import { sitePath, themeAsset } from "@/lib/config";
import { permalinkToPath, type CategoryArchiveItem } from "@/lib/wp";
import Link from "next/link";

type Props = {
  items: CategoryArchiveItem[];
};

/** portfolio.php — リンクはすべて target="_blank" */
export function PortfolioContent({ items }: Props) {
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
            href={sitePath("/portfolio/dtp")}
            style={{ borderBottom: "1px solid #ff0348" }}
            target="_blank"
          >
            DTP系 <b>→</b>
          </Link>
        </blockquote>

        <div className="category-main">
          <div className="category-main-inr elm-flex between">
            {items.map((item) => {
              const href = sitePath(permalinkToPath(item.permalink));
              const youtube = item.youtube?.trim() ?? "";
              const hasYoutube = youtube.length > 0;
              const imgClass = hasYoutube ? "elm-box-img ythum" : "elm-box-img";
              const imgStyle = hasYoutube
                ? {
                    background: `url(https://i.ytimg.com/vi/${youtube}/hqdefault.jpg) center center no-repeat`,
                    backgroundSize: "cover" as const,
                  }
                : undefined;

              return (
                <div className="elm-box" key={item.id}>
                  <div className="elm-box-inr">
                    <div className={imgClass} style={imgStyle}>
                      {hasYoutube ? (
                        <Link href={href} target="_blank" rel="noreferrer">
                          <img
                            src={themeAsset("img/youtube_face.png")}
                            alt=""
                          />
                        </Link>
                      ) : (
                        <Link href={href} target="_blank" rel="noreferrer">
                          {item.featured_image ? (
                            <img src={item.featured_image} alt="" />
                          ) : null}
                        </Link>
                      )}
                    </div>
                    <div className="elm-box-disp">
                      <Link href={href} target="_blank" rel="noreferrer">
                        <div className="elm-box-disp-ttl">
                          <span>{item.title}</span>
                        </div>
                        <div className="elm-box-disp-cap">{item.h3}</div>
                        {item.date_label?.trim() ? (
                          <div className="elm-box-disp-date">
                            {item.date_label}
                          </div>
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
