import { PageWarning } from "@/components/site/PageWarning";
import { sitePath, themeAsset } from "@/lib/config";
import { permalinkToPath, type CategoryArchiveItem } from "@/lib/wp";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle: ReactNode;
  items: CategoryArchiveItem[];
  /** true のとき 発表日 がある項目だけ日付行を出す（web） */
  dateOnlyWhenSet?: boolean;
};

export function CategoryArchiveContent({
  title,
  subtitle,
  items,
  dateOnlyWhenSet = false,
}: Props) {
  return (
    <div className="category elm">
      <div className="category-inr elm-inr">
        <h1 className="category-title elm-ttl">
          <span>{title}</span>
        </h1>

        <blockquote className="single-title-sub elm-ttl-sub">{subtitle}</blockquote>

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
              const showDate =
                !dateOnlyWhenSet || Boolean(item.date_label?.trim());

              return (
                <div className="elm-box" key={item.id}>
                  <div className="elm-box-inr">
                    <div className={imgClass} style={imgStyle}>
                      {hasYoutube ? (
                        <Link href={href}>
                          <img
                            src={themeAsset("img/youtube_face.png")}
                            className="elm-box-img-youtube"
                            alt=""
                          />
                        </Link>
                      ) : (
                        <Link href={href}>
                          {item.featured_image ? (
                            <img src={item.featured_image} alt="" />
                          ) : null}
                        </Link>
                      )}
                    </div>
                    <div className="elm-box-disp">
                      <Link href={href}>
                        <div className="elm-box-disp-ttl">
                          <span>{item.title}</span>
                        </div>
                        <div className="elm-box-disp-cap">{item.h3}</div>
                        {showDate ? (
                          <div className="elm-box-disp-date">{item.date_label}</div>
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
