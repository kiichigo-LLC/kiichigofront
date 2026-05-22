import { resolveFeaturedImageUrl } from "./featured-image";
import { metaString, type PostMeta } from "./post-meta";
import { extractPostTags, fetchPostBySlugEmbed } from "./single-post";
import {
  CATEGORY_IDS,
  getTrajectoryListItems,
  stripHtml,
  type TrajectoryListItem,
  type WpTag,
} from "./wp";

export type TrajectoryPostDetail = {
  id: number;
  slug: string;
  title: string;
  permalink: string;
  publishedLabel: string;
  featuredImage: string;
  youtube: string;
  audio: string;
  isCover: boolean;
  tags: WpTag[];
  meta: PostMeta;
};

function hasCoverTag(tags: WpTag[]): boolean {
  return tags.some((t) => t.name === "カバー" || t.slug === "tag_cover");
}

/** get_the_date('Y.m.d') */
export function formatTrajectoryPublishedDate(isoDate: string): string {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export async function getTrajectoryPostDetail(
  slug: string
): Promise<TrajectoryPostDetail | null> {
  const post = await fetchPostBySlugEmbed(slug);
  if (!post) return null;

  const trajectoryId = CATEGORY_IDS.trajectory;
  if (post.categories && !post.categories.includes(trajectoryId)) {
    return null;
  }

  const tags = extractPostTags(post);
  const meta = post.meta ?? {};

  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title.rendered),
    permalink: post.link,
    publishedLabel: formatTrajectoryPublishedDate(post.date),
    featuredImage: await resolveFeaturedImageUrl(post),
    youtube: metaString(meta, "youtube"),
    audio: metaString(meta, "audio"),
    isCover: hasCoverTag(tags),
    tags,
    meta,
  };
}

export async function getTrajectoryAdjacentPosts(currentSlug: string): Promise<{
  older: TrajectoryListItem | null;
  newer: TrajectoryListItem | null;
}> {
  const items = await getTrajectoryListItems();
  const idx = items.findIndex((item) => item.slug === currentSlug);
  if (idx === -1) {
    return { older: null, newer: null };
  }
  return {
    older: items[idx + 1] ?? null,
    newer: items[idx - 1] ?? null,
  };
}
