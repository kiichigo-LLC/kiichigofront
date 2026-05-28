import Link from "next/link";
import type { ReactNode } from "react";
import { path } from "utils/config";

function navSectionActive(pathname: string, section: string) {
  if (pathname === "/") return false;
  // `/{section}` 一覧と `/{section}/記事` の両方を active 扱いにする
  return (
    pathname === `/${section}` || pathname.startsWith(`/${section}/`)
  );
}

function ActiveLabel({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return <span className={active ? "active" : undefined}>{children}</span>;
}

// 左カラム：会社概要・カテゴリ・お問い合わせなど
function SiteNav({ pathname }: { pathname: string }) {
  const isHome = pathname === "/";
  const aboutActive = pathname.startsWith("/about") && !isHome;
  const contactActive = pathname.startsWith("/contact") && !isHome;
  const koeActive = navSectionActive(pathname, "koe");
  const webActive = navSectionActive(pathname, "web");
  const trajectoryActive = navSectionActive(pathname, "trajectory");

  return (
    <nav>
      <div className="header-nav-main">
        <div className="header-nav-main-list plusnav">
          <ul>
            <li>
              <Link href={path("/about")} prefetch={false}>
                <ActiveLabel active={aboutActive}>合同会社キイチゴについて</ActiveLabel>
              </Link>
              <div className="plusnav-box">
                <ol>
                  <li>
                    <Link href={path("/about/#unkr-01")} prefetch={false}>
                      <span>会社概要</span>
                    </Link>
                  </li>
                  <li>
                    <Link href={path("/about/#unkr-02")} prefetch={false}>
                      <span>ロゴについて</span>
                    </Link>
                  </li>
                  <li>
                    <Link href={path("/dx")} prefetch={false}>
                      <span>DX推進方針について</span>
                    </Link>
                  </li>
                </ol>
              </div>
            </li>
            <li>
              <Link href={path("/koe")} prefetch={false}>
                <ActiveLabel active={koeActive}>声の仕事</ActiveLabel>
              </Link>
            </li>
            <li>
              <Link href={path("/web")} prefetch={false}>
                <ActiveLabel active={webActive}>ウェブの仕事</ActiveLabel>
              </Link>
            </li>
            <li>
              <Link href={path("/trajectory")} prefetch={false}>
                <ActiveLabel active={trajectoryActive}>ブログ</ActiveLabel>
              </Link>
            </li>
            <li>
              <Link href={path("/contact")} prefetch={false}>
                <ActiveLabel active={contactActive}>お問い合わせ</ActiveLabel>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

// ヘッダー右側に出す SNS アイコンリンク（外部サイト）
function SnsNav() {
  return (
    <div className="header-nav-sns">
      <div className="header-nav-sns-list">
        <ol>
          <li>
            <a href="https://www.behance.net/kiichigo" target="_blank" rel="noreferrer">
              <span className="icon-behance"></span>
            </a>
          </li>
          <li>
            <a href="https://github.com/kiichigo-LLC" target="_blank" rel="noreferrer">
              <span className="icon-github"></span>
            </a>
          </li>
          {/* <li>
            <a
              href="https://www.youtube.com/@%E3%81%8A%E3%82%8C%E3%83%80%E3%83%A9"
              target="_blank"
              rel="noreferrer"
            >
              <span className="icon-youtube"></span>
            </a>
          </li> */}
        </ol>
      </div>
    </div>
  );
}

/** header.tsx から呼ぶ。左=メインメニュー、右=SNS */
export function Nav({ pathname }: { pathname: string }) {
  return (
    <div className="header-nav-inr">
      <div className="header-nav-r">
        <SiteNav pathname={pathname} />
      </div>
      <div className="header-nav-l">
        <SnsNav />
      </div>
    </div>
  );
}
