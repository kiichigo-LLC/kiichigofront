import { resolveFeaturedImageUrl } from "./featured-image";
import { metaString } from "./post-meta";
import {
  fetchPostBySlugEmbed,
  findAdjacentInList,
  postHasTagId,
  type SingleAdjacentItem,
} from "./single-post";
import {
  CATEGORY_IDS,
  getCategoryArchive,
  stripHtml,
} from "./wp";

/** single-web.php: ポートフォリオ用タグ */
export const WEB_PORTFOLIO_TAG_ID = 49;

export type WebPostDetail = {
  id: number;
  slug: string;
  title: string;
  permalink: string;
  h3: string;
  featuredImage: string;
  myUrl: string;
  webFolder: string;
  externalUrl: string;
  publishedDate: string;
  productionPeriod: string;
  excerptHtml: string;
  contentHtml: string;
  isPortfolio: boolean;
};

async function getWebListItems(): Promise<SingleAdjacentItem[]> {
  const items = await getCategoryArchive("web", {
    tags_exclude: [WEB_PORTFOLIO_TAG_ID],
  });
  return items.map((item) => ({
    slug: item.slug,
    title: item.title,
    permalink: item.permalink,
  }));
}

export async function getWebPostDetail(
  slug: string
): Promise<WebPostDetail | null> {
  const post = await fetchPostBySlugEmbed(slug);
  if (!post) return null;

  if (post.categories && !post.categories.includes(CATEGORY_IDS.web)) {
    return null;
  }

  const meta = post.meta ?? {};
  const myUrl = metaString(meta, "myURL");

  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title.rendered),
    permalink: post.link,
    h3: metaString(meta, "h3"),
    featuredImage: await resolveFeaturedImageUrl(post),
    myUrl,
    webFolder: metaString(meta, "WEB｜フォルダ名"),
    externalUrl: metaString(meta, "URL"),
    publishedDate: metaString(meta, "発表日"),
    productionPeriod: metaString(meta, "製作期間"),
    excerptHtml: post.excerpt?.rendered ?? "",
    contentHtml: post.content?.rendered ?? "",
    isPortfolio: postHasTagId(post, WEB_PORTFOLIO_TAG_ID),
  };
}

export function isPortfolioReferer(referer: string | null): boolean {
  if (!referer) return false;
  return referer.includes("/portfolio");
}

export async function getWebAdjacentPosts(currentSlug: string): Promise<{
  older: SingleAdjacentItem | null;
  newer: SingleAdjacentItem | null;
}> {
  const items = await getWebListItems();
  return findAdjacentInList(items, currentSlug);
}
