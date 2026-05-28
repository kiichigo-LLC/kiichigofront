import type { Metadata } from "next";
import { PortfolioListView } from "@/components/wp/portfolio-views";
import { DESC_SITE, pageMeta, titleWithSite } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: titleWithSite("ポートフォリオ"),
    description: DESC_SITE,
    path: "/portfolio",
    noIndex: true,
  });
}

export default function PortfolioPage() {
  return <PortfolioListView />;
}
