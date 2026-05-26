import type { Metadata } from "next";
import Link from "next/link";
import { PageWarning } from "@/components/page-parts";
import { SiteJsonLd } from "@/components/site-json-ld";
import { DESC_SITE, pageMeta, titleWithSite } from "@/lib/seo";
import { asset, canonical, path } from "@/lib/wp";

const PATH = "/about";
const PAGE_TITLE = "プロフィール";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: titleWithSite(PAGE_TITLE),
    description: DESC_SITE,
    path: PATH,
  });
}

export default function AboutPage() {
  const homeUrl = path("/");
  const contactUrl = path("/contact");
  const dxUrl = path("/dx");
  const metaTitle = titleWithSite(PAGE_TITLE);

  return (
    <>
      <SiteJsonLd title={metaTitle} description={DESC_SITE} url={canonical(PATH)} />
      <div className="page elm">
        <div className="page-inr elm-inr">
          <h1 className="page-title elm-ttl">
            <span>{PAGE_TITLE}</span>
          </h1>
          <h2 className="page-title-sub elm-ttl-sub" id="unkr-01">
            会社概要
          </h2>
          <div className="page-main">
            <div className="page-main-table">
              <table>
                <tbody>
                  <tr>
                    <th style={{ whiteSpace: "nowrap" }}>社名</th>
                    <td>
                      合同会社キイチゴ
                      <br />
                      <small>(英文名称：Kiichigo LLC)</small>
                    </td>
                  </tr>
                  <tr>
                    <th style={{ whiteSpace: "nowrap" }}>設立</th>
                    <td>
                      2021<small>(令和3)年</small>1<small>月</small>8<small>日</small>
                    </td>
                  </tr>
                  <tr>
                    <th style={{ whiteSpace: "nowrap" }}>代表</th>
                    <td>
                      五野上 貴一　<small><a href="https://kiichigonokami.com/">--プロフィール</a></small>
                    </td>
                  </tr>
                  <tr>
                    <th style={{ whiteSpace: "nowrap" }}>事業内容</th>
                    <td>
                      <ol>
                        <li>ウェブサイト、ウェブコンテンツ、その他インターネットを利用した各種サービス等の企画、制作、販売、配信、運営及び管理</li>
                        <li>各種システム、ソフトウェア等の企画、開発、制作、配信、保守、管理、運営、販売及びそれらの受託</li>
                        <li>楽曲、詞の企画、制作、編集、配信及び販売</li>
                        <li>ナレーション業務</li>
                        <li>動画、その他各種映像の企画、制作、撮影、編集、配信及び販売</li>
                        <li>前各号に附帯関連する一切の事業</li>
                      </ol>
                    </td>
                  </tr>
                  <tr>
                    <th style={{ whiteSpace: "nowrap" }}>資本金</th>
                    <td>2,000,000円</td>
                  </tr>
                  <tr>
                    <th style={{ whiteSpace: "nowrap" }}>所在地</th>
                    <td>東京都世田谷区</td>
                  </tr>
                  <tr>
                    <th style={{ whiteSpace: "nowrap" }}>取引先</th>
                    <td><Link href={contactUrl}>お問い合わせ</Link>ください。</td>
                  </tr>
                  <tr>
                    <th style={{ whiteSpace: "nowrap" }}>顧問税理士</th>
                    <td>税理士法人クラウドパートナーズ</td>
                  </tr>
                  <tr>
                    <th style={{ whiteSpace: "nowrap" }}>取引銀行</th>
                    <td>三井住友銀行<br />大和ネクスト銀行</td>
                  </tr>
                  <tr>
                    <th style={{ whiteSpace: "nowrap" }}>適格請求書発行事業者登録番号</th>
                    <td>T7010903006210</td>
                  </tr>
                  <tr>
                    <th style={{ whiteSpace: "nowrap" }}>お問い合わせ</th>
                    <td><Link href={contactUrl}>お問い合わせフォーム</Link></td>
                  </tr>
                  <tr>
                    <th style={{ whiteSpace: "nowrap" }}>URL</th>
                    <td><a href={homeUrl}>{homeUrl || "https://kiichigo.work/"}</a></td>
                  </tr>
                  <tr>
                    <th style={{ whiteSpace: "nowrap" }}>DXへの取り組み</th>
                    <td><Link href={dxUrl}>{dxUrl || "https://kiichigo.work/dx/"}</Link></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <h2 className="page-title-sub elm-ttl-sub" id="unkr-02">
            ロゴについて
          </h2>
          <div className="page-main">
            <div className="page-main-img">
              <img src={asset("img/logo.svg")} alt="モ・ベターデザインの中村健さんが手掛けたキイチゴのロゴ" />
            </div>
            <div className="page-main-text">
              モ・ベターデザインの中村健さんによるデザイン
              <br />
              <a href="http://www.mobetter.jp/" target="_blank" rel="noreferrer">
                MO&apos; BETTER DESIGN
              </a>
            </div>
          </div>
          <PageWarning />
        </div>
      </div>
    </>
  );
}
