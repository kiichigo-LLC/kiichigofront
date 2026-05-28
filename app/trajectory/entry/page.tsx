import type { Metadata } from "next";
import { TrajectoryEntryView } from "@/components/wp/trajectory-views";
import { pageMeta, titleWithSite } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: titleWithSite("記事"),
    description: "",
    path: "/trajectory",
  });
}

export default function TrajectoryEntryPage() {
  return <TrajectoryEntryView />;
}
