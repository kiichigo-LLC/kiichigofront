import type { Metadata } from "next";
import { WebListView } from "@/components/wp/web-views";
import { DESC_WEB_CAT, pageMeta, titleWithSite } from "@/lib/seo";

const META_TITLE = "合同会社キイチゴのウェブの仕事一覧";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: titleWithSite(META_TITLE),
    description: DESC_WEB_CAT,
    path: "/web",
  });
}

export default function WebCategoryPage() {
  return <WebListView />;
}
