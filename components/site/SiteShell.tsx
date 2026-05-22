import type { NavNewFlags } from "@/lib/wp";
import { ClientEnhancements } from "./ClientEnhancements";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { JsonLd } from "./JsonLd";
import { LoadingMask } from "./LoadingMask";

export type SiteShellProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  canonicalUrl: string;
  isHome?: boolean;
  showTrajectoryNav?: boolean;
  navNew: NavNewFlags;
  includeJsonLd?: boolean;
  loadPrism?: boolean;
  loadSingleWebIframe?: boolean;
  isTagPage?: boolean;
  loadContactForm?: boolean;
};

export function SiteShell({
  children,
  title,
  description,
  canonicalUrl,
  isHome = false,
  showTrajectoryNav = false,
  navNew,
  includeJsonLd = false,
  loadPrism = false,
  loadSingleWebIframe = false,
  isTagPage = false,
  loadContactForm = false,
}: SiteShellProps) {
  return (
    <>
      <ClientEnhancements />
      {includeJsonLd ? (
        <JsonLd title={title} description={description} url={canonicalUrl} />
      ) : null}

      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-58GB3CJ"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="gtm"
        />
      </noscript>

      {isHome ? <LoadingMask /> : null}

      <div className="wrap">
        <Header
          isHome={isHome}
          navNew={navNew}
          showTrajectoryNav={showTrajectoryNav}
        />
        {children}
        <Footer
          loadPrism={loadPrism}
          loadSingleWebIframe={loadSingleWebIframe}
          isTagPage={isTagPage}
          loadContactForm={loadContactForm}
        />
      </div>
    </>
  );
}
