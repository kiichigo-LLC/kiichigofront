import type { Metadata } from "next";
import { PortfolioDtpView } from "@/components/wp/portfolio-views";
import { DESC_SITE, pageMeta, titleWithSite } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: titleWithSite("DTP系ポートフォリオ"),
    description: DESC_SITE,
    path: "/portfolio/dtp",
    noIndex: true,
  });
}

export default function PortfolioDtpPage() {
  return <PortfolioDtpView />;
}
