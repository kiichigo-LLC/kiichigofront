"use client";

import Link from "next/link";
import { asset, path } from "utils/config";
import usePageType from "@hooks/usePageType";
import { Nav } from "@components/nav";

export function Header() {
  const { pathname, isHome } = usePageType();
  const LogoTag = isHome ? "h1" : "div";

  return (
    <header>
      <div className="header">
        <div className="bgr">
          <span></span>
        </div>
        <div className="header-inr">
          <div className="header-logo">
            <LogoTag className="header-logo-img">
              <Link href={path("/")} prefetch={false}>
                <img src={asset("img/logo_s.svg")} alt="合同会社キイチゴ" />
              </Link>
            </LogoTag>
          </div>
          <div className="header-nav">
            <Nav pathname={pathname} />
          </div>
        </div>
      </div>
    </header>
  );
}
