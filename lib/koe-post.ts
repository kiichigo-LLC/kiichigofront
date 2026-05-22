import { resolveFeaturedImageUrl } from "./featured-image";
import { metaString } from "./post-meta";
import {
  fetchPostBySlugEmbed,
  findAdjacentInList,
  type SingleAdjacentItem,
} from "./single-post";
import { CATEGORY_IDS, getCategoryArchive, stripHtml } from "./wp";

export type KoePostDetail = {
  id: number;
  slug: string;
  title: string;
  permalink: string;
  h3: string;
  featuredImage: string;
  youtube: string;
  dateLabel: string;
  datePrefix: string;
  contentHtml: string;
};

async function getKoeListItems(): Promise<SingleAdjacentItem[]> {
  const items = await getCategoryArchive("koe");
  return items.map((item) => ({
    slug: item.slug,
    title: item.title,
    permalink: item.permalink,
  }));
}

export async function getKoePostDetail(
  slug: string
): Promise<KoePostDetail | null> {
  const post = await fetchPostBySlugEmbed(slug);
  if (!post) return null;

  if (post.categories && !post.categories.includes(CATEGORY_IDS.koe)) {
    return null;
  }

  const meta = post.meta ?? {};
  const isLive = metaString(meta, "type") === "live";

  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title.rendered),
    permalink: post.link,
    h3: metaString(meta, "h3"),
    featuredImage: await resolveFeaturedImageUrl(post),
    youtube: metaString(meta, "youtube"),
    dateLabel: metaString(meta, "発表日"),
    datePrefix: isLive ? "公演日" : "公開日",
    contentHtml: post.content?.rendered ?? "",
  };
}

export async function getKoeAdjacentPosts(currentSlug: string): Promise<{
  older: SingleAdjacentItem | null;
  newer: SingleAdjacentItem | null;
}> {
  const items = await getKoeListItems();
  return findAdjacentInList(items, currentSlug);
}
