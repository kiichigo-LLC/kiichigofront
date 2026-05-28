import type { Metadata } from "next";
import { TagEntryView } from "@/components/wp/tag-views";
import { DESC_SITE, pageMeta, titleWithSite } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: titleWithSite("タグ一覧"),
    description: DESC_SITE,
    path: "/tag",
  });
}

export default function TagEntryPage() {
  return <TagEntryView />;
}
