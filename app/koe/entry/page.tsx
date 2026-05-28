import type { Metadata } from "next";
import { KoeEntryView } from "@/components/wp/koe-views";
import { pageMeta, titleWithSite } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: titleWithSite("記事"),
    description: "",
    path: "/koe",
  });
}

export default function KoeEntryPage() {
  return <KoeEntryView />;
}
