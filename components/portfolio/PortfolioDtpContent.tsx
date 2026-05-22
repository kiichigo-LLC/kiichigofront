import { PageWarning } from "@/components/site/PageWarning";
import { sitePath } from "@/lib/config";
import type { DtpGalleryImage } from "@/lib/portfolio";
import Link from "next/link";

type Props = {
  images: DtpGalleryImage[];
};

export function PortfolioDtpContent({ images }: Props) {
  return (
    <div className="category elm">
      <div className="category-inr elm-inr">
        <h1 className="category-title elm-ttl">
          <span>DTP系ポートフォリオ</span>
        </h1>

        <blockquote className="single-title-sub elm-ttl-sub">
          <Link
            href={sitePath("/portfolio")}
            style={{ borderBottom: "1px solid #ff0348" }}
            target="_blank"
          >
            <b>←</b> WEB系
          </Link>
          ｜
          <a
            href="https://kiichigonokami.com/#unkr-04"
            style={{ borderBottom: "1px solid #ff0348" }}
            target="_blank"
            rel="noreferrer"
          >
            スキルシート
          </a>
        </blockquote>

        <div className="category-main dtp">
          <div className="category-main-inr elm-flex between">
            {images.length > 0 ? (
              images.map((image) => (
                <div className="elm-box dtp" key={image.id}>
                  <div className="elm-box-inr">
                    <div className="elm-box-img">
                      <a href={image.url} className="group">
                        <img
                          src={image.url}
                          className="dsn contain"
                          alt=""
                        />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>ギャラリーが見つかりません。</p>
            )}
          </div>
        </div>

        <PageWarning />
      </div>
    </div>
  );
}
