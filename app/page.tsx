import type { Metadata } from "next";
import { SiteJsonLd } from "@/components/site-json-ld";
import { HomeAiMessage } from "@/components/wp/home-ai-message";
import { DESC_HOME, pageMeta } from "@/lib/seo";
import { SITE_NAME, asset, canonical } from "@/lib/wp";

const HOME_MSG =
  process.env.NEXT_PUBLIC_HOME_MESSAGE || "まだ生成されていません";
const HOME_LOG = process.env.NEXT_PUBLIC_HOME_LAST_GENERATED || "";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: SITE_NAME,
    description: DESC_HOME,
    path: "/",
  });
}

export default function HomePage() {
  const showBan = new Date() < new Date("2026-09-26T00:00:00+09:00");

  return (
    <>
      <SiteJsonLd title={SITE_NAME} description={DESC_HOME} url={canonical("/")} />
      <div className="main">
        <div className="main-inr">
          <div className="main-home">
            <div className="main-home-inr">
              <span>
                <HomeAiMessage fallbackMessage={HOME_MSG} fallbackLog={HOME_LOG} />
              </span>
            </div>
          </div>
        </div>
      </div>
      {showBan ? (
        <div className="ban landscape">
          <div className="ban-img landscape">
            <a
              href="https://network.mobile.rakuten.co.jp/area/campaign/corporation/?scid=mi_rmb_web_promojp_invi_bnr_RWPS005269&corpid=RWPS005269"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={asset("img/out/rmobile_1200x628.png")}
                alt="楽天モバイル特別優待キャンペーン"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
