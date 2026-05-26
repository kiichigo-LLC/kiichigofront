import Link from "next/link";
import type { ReactNode } from "react";
import { path } from "utils/config";

function navSectionActive(pathname: string, section: string) {
  if (pathname === "/") return false;
  // `/category/{section}` と `/{section}/...` の両方を active 扱いにする
  return (
    pathname.startsWith(`/category/${section}`) ||
    pathname.startsWith(`/${section}/`)
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
function SiteNav({
  pathname,
  showTrajectoryNav,
}: {
  pathname: string;
  showTrajectoryNav?: boolean;
}) {
  const isHome = pathname === "/";
  // ブログメニューは、明示指定または trajectory 配下で表示
  const showBlog = showTrajectoryNav || navSectionActive(pathname, "trajectory");
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
              <Link href={path("/about")}>
                <ActiveLabel active={aboutActive}>合同会社キイチゴについて</ActiveLabel>
              </Link>
              <div className="plusnav-box">
                <ol>
                  <li>
                    <Link href={path("/about/#unkr-01")}>
                      <span>会社概要</span>
                    </Link>
                  </li>
                  <li>
                    <Link href={path("/about/#unkr-02")}>
                      <span>ロゴについて</span>
                    </Link>
                  </li>
                  <li>
                    <Link href={path("/dx")}>
                      <span>DX推進方針について</span>
                    </Link>
                  </li>
                </ol>
              </div>
            </li>
            <li>
              <Link href={path("/category/koe")}>
                <ActiveLabel active={koeActive}>声の仕事</ActiveLabel>
              </Link>
            </li>
            <li>
              <Link href={path("/category/web")}>
                <ActiveLabel active={webActive}>ウェブの仕事</ActiveLabel>
              </Link>
            </li>
            {showBlog && !isHome ? (
              <li>
                <Link href={path("/category/trajectory")}>
                  <ActiveLabel active={trajectoryActive}>ブログ</ActiveLabel>
                </Link>
              </li>
            ) : null}
            <li>
              <Link href={path("/contact")}>
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
          <li>
            <a
              href="https://www.youtube.com/@%E3%81%8A%E3%82%8C%E3%83%80%E3%83%A9"
              target="_blank"
              rel="noreferrer"
            >
              <span className="icon-youtube"></span>
            </a>
          </li>
        </ol>
      </div>
    </div>
  );
}

/** header.tsx から呼ぶ。左=メインメニュー、右=SNS */
export function Nav({
  pathname,
  showTrajectoryNav,
}: {
  pathname: string;
  showTrajectoryNav?: boolean;
}) {
  return (
    <div className="header-nav-inr">
      <div className="header-nav-r">
        <SiteNav pathname={pathname} showTrajectoryNav={showTrajectoryNav} />
      </div>
      <div className="header-nav-l">
        <SnsNav />
      </div>
    </div>
  );
}
