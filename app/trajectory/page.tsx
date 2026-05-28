import type { Metadata } from "next";
import { TrajectoryListView } from "@/components/wp/trajectory-views";
import { DESC_TRAJ, pageMeta, titleWithSite } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: titleWithSite("ブログ"),
    description: DESC_TRAJ,
    path: "/trajectory",
  });
}

export default function TrajectoryCategoryPage() {
  return <TrajectoryListView />;
}
