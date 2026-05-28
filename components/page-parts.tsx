import Link from "next/link";
import { path, wpPath } from "@/lib/wp";

export function PageWarning() {
  return (
    <div className="page-main">
      <div
        className="page-main-text"
        style={{ textAlign: "justify", wordBreak: "break-all" }}
      >
        <small>
          このウェブサイトは合同会社キイチゴの会社紹介として制作しております。掲載している写真や動画、音楽の著作権、及び肖像権は許可を得てないものも含まれています。関係者各位のご理解の程、宜しくお願い致します。不都合がございましたら削除、変更を致しますのでお手数ですが連絡ください。
        </small>
      </div>
    </div>
  );
}

export function SingleBackNav({ categorySlug }: { categorySlug: string }) {
  return (
    <nav>
      <div className="single-back">
        <div className="single-back-link">
          <Link href={path(`/${categorySlug}`)} prefetch={false}>前に戻る</Link>
        </div>
      </div>
    </nav>
  );
}

export function PageNav({
  older,
  newer,
}: {
  older: { title: string; permalink: string } | null;
  newer: { title: string; permalink: string } | null;
}) {
  return (
    <div className="pagenav">
      <div className="pagenav-inr">
        <div className="pagenav-prev">
          {older ? (
            <a href={path(wpPath(older.permalink))} title={older.title}>
              <i className="fa fa-angle-left"></i> 前へ{" "}
            </a>
          ) : null}
        </div>
        <div className="pagenav-center"> ｜ </div>
        <div className="pagenav-next">
          {newer ? (
            <a href={path(wpPath(newer.permalink))} title={newer.title}>
              次へ <i className="fa fa-angle-right"></i>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function PortfolioCloseNav() {
  return (
    <div className="pagenav">
      <div className="pagenav-inr">
        <div
          className="pagenav-center"
          dangerouslySetInnerHTML={{
            __html:
              '<button type="button" class="admin_btn" onclick="window.close()">閉じる <i class="fa fa-times" aria-hidden="true"></i></button>',
          }}
        />
      </div>
    </div>
  );
}
