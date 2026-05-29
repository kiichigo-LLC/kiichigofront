"use client";

import Link from "next/link";
import { useEffect } from "react";
import { asset, path } from "utils/config";
import usePageType from "@hooks/usePageType";
import { Nav } from "@components/nav";
import { closeMobileNav, toggleMobileNav } from "@/lib/mobile-nav";

export function Header() {
  const { pathname, isHome } = usePageType();
  const LogoTag = isHome ? "h1" : "div";

  useEffect(() => {
    closeMobileNav();
  }, [pathname]);

  return (
    <header>
      <div className="header">
        <div className="bgr" onClick={toggleMobileNav}>
          <span></span>
        </div>
        <div className="header-inr">
          <div className="header-logo">
            <LogoTag className="header-logo-img">
              <Link href={path("/")} prefetch={false} onClick={closeMobileNav}>
                <img src={asset("img/logo_s.svg")} alt="合同会社キイチゴ" />
              </Link>
            </LogoTag>
          </div>
          <div className="header-nav">
            <Nav pathname={pathname} onNavigate={closeMobileNav} />
          </div>
        </div>
      </div>
    </header>
  );
}
