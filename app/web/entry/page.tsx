import type { Metadata } from "next";
import { WebEntryView } from "@/components/wp/web-views";
import { pageMeta, titleWithSite } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: titleWithSite("記事"),
    description: "",
    path: "/web",
  });
}

export default function WebEntryPage() {
  return <WebEntryView />;
}
