import type { Metadata } from "next";
import { SiteJsonLd } from "@/components/site-json-ld";
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
  const msg = HOME_MSG.replace(/（/g, "(").replace(/）/g, ")");
  const showBan = new Date() < new Date("2026-09-26T00:00:00+09:00");

  return (
    <>
      <SiteJsonLd title={SITE_NAME} description={DESC_HOME} url={canonical("/")} />
      <div className="main">
        <div className="main-inr">
          <div className="main-home">
            <div className="main-home-inr">
              <span>
                {msg}
                <br />
                {HOME_LOG ? (
                  <>
                    <small>
                      <i>Log: {HOME_LOG}</i>
                    </small>
                    <br />
                  </>
                ) : null}
                <small>
                  合同会社キイチゴ
                  <br />
                  🤖AI
                </small>
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
