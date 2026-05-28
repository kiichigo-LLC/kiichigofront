import type { Metadata } from "next";
import { TagIndexView } from "@/components/wp/tag-views";
import { DESC_SITE, pageMeta, titleWithSite } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: titleWithSite("タグ一覧"),
    description: DESC_SITE,
    path: "/tag",
  });
}

export default function TagIndexPage() {
  return <TagIndexView />;
}
