import type { Metadata } from "next";
import { KoeListView } from "@/components/wp/koe-views";
import { DESC_SITE, pageMeta, titleWithSite } from "@/lib/seo";

const META_TITLE = "合同会社キイチゴの声の仕事一覧";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: titleWithSite(META_TITLE),
    description: DESC_SITE,
    path: "/koe",
  });
}

export default function KoeCategoryPage() {
  return <KoeListView />;
}
