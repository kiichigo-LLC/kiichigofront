import type { Metadata } from "next";
import Link from "next/link";
import { PageWarning } from "@/components/page-parts";
import { DESC_SITE, pageMeta, titleWithSite } from "@/lib/seo";
import { STATIC_FETCH } from "@/lib/wp-fetch";
import { WP, path } from "@/lib/wp";

async function getDtpImages() {
  const res = await fetch(`${WP}/pages?slug=dtp`, STATIC_FETCH);
  if (!res.ok) return [];
  const pages: any = await res.json();
  const html = pages[0]?.content?.rendered || "";
  const m = html.match(/\[gallery[^\]]*ids=["']([^"']+)["']/);
  if (!m?.[1]) return [];
  const ids = m[1].split(",").map((s: string) => parseInt(s.trim(), 10)).filter((n: number) => n > 0);
  const images: { id: number; url: string }[] = [];
  for (const id of ids) {
    const mr = await fetch(`${WP}/media/${id}`, STATIC_FETCH);
    if (!mr.ok) continue;
    const media: any = await mr.json();
    if (media.source_url) images.push({ id: media.id, url: media.source_url });
  }
  return images;
}

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: titleWithSite("DTP系ポートフォリオ"),
    description: DESC_SITE,
    path: "/portfolio/dtp",
    noIndex: true,
  });
}

export default async function PortfolioDtpPage() {
  const images = await getDtpImages();

  return (
    <div className="category elm">
        <div className="category-inr elm-inr">
          <h1 className="category-title elm-ttl">
            <span>DTP系ポートフォリオ</span>
          </h1>
          <blockquote className="single-title-sub elm-ttl-sub">
            <Link href={path("/portfolio")} style={{ borderBottom: "1px solid #ff0348" }} target="_blank">
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
                          <img src={image.url} className="dsn contain" alt="" />
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
