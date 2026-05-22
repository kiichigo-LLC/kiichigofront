import { sitePath, themeAsset } from "@/lib/config";
import type { NavNewFlags } from "@/lib/wp";
import Link from "next/link";
import { Nav } from "./Nav";
import { SnsNav } from "./SnsNav";

type Props = {
  isHome?: boolean;
  navNew: NavNewFlags;
  showTrajectoryNav?: boolean;
};

export function Header({ isHome = false, navNew, showTrajectoryNav }: Props) {
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
              <Link href={sitePath("/")}>
                <img src={themeAsset("img/logo_s.svg")} alt="合同会社キイチゴ" />
              </Link>
            </LogoTag>
          </div>
          <div className="header-nav">
            <div className="header-nav-inr">
              <div className="header-nav-r">
                <Nav navNew={navNew} showTrajectoryNav={showTrajectoryNav} />
              </div>
              <div className="header-nav-l">
                <SnsNav />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
