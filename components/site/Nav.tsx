"use client";

import { sitePath } from "@/lib/config";
import type { NavNewFlags } from "@/lib/wp";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  navNew: NavNewFlags;
  showTrajectoryNav?: boolean;
};

function isNavSectionActive(pathname: string, section: string): boolean {
  if (pathname === "/") return false;
  return (
    pathname.startsWith(`/category/${section}`) ||
    pathname.startsWith(`/${section}/`) ||
    pathname === `/${section}`
  );
}

export function Nav({ navNew, showTrajectoryNav = false }: Props) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isKoeActive = isNavSectionActive(pathname, "koe");
  const isWebActive = isNavSectionActive(pathname, "web");
  const isTrajectoryActive = isNavSectionActive(pathname, "trajectory");
  const showBlogNav = showTrajectoryNav || isTrajectoryActive;

  return (
    <nav>
      <div className="header-nav-main">
        <div className="header-nav-main-list plusnav">
          <ul>
            <li>
              <Link href={sitePath("/about")}>
                <span
                  className={
                    pathname.startsWith("/about") && !isHome ? "active" : undefined
                  }
                >
                  合同会社キイチゴについて
                </span>
              </Link>
              <div className="plusnav-box">
                <ol>
                  <li>
                    <Link href={sitePath("/about/#unkr-01")}>
                      <span>会社概要</span>
                    </Link>
                  </li>
                  <li>
                    <Link href={sitePath("/about/#unkr-02")}>
                      <span>ロゴについて</span>
                    </Link>
                  </li>
                  <li>
                    <Link href={sitePath("/dx")}>
                      <span>DX推進方針について</span>
                    </Link>
                  </li>
                </ol>
              </div>
            </li>
            <li className={navNew.koe ? "new" : undefined}>
              <Link href={sitePath("/category/koe")}>
                <span className={isKoeActive ? "active" : undefined}>
                  声の仕事
                </span>
              </Link>
            </li>
            <li className={navNew.web ? "new" : undefined}>
              <Link href={sitePath("/category/web")}>
                <span className={isWebActive ? "active" : undefined}>
                  ウェブの仕事
                </span>
              </Link>
            </li>
            {showBlogNav && !isHome ? (
              <li className={navNew.trajectory ? "new" : undefined}>
                <Link href={sitePath("/category/trajectory")}>
                  <span className={isTrajectoryActive ? "active" : undefined}>
                    ブログ
                  </span>
                </Link>
              </li>
            ) : null}
            <li>
              <Link href={sitePath("/contact")}>
                <span
                  className={
                    pathname.startsWith("/contact") && !isHome
                      ? "active"
                      : undefined
                  }
                >
                  お問い合わせ
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
