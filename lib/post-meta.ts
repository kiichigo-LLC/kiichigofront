/** mu-plugin で REST 公開している meta キー（テーマの get_post_meta と同じ） */
export const POST_META_KEYS = [
  "h3",
  "youtube",
  "発表日",
  "audio",
  "type",
  "myURL",
  "URL",
  "製作期間",
  "WEB｜フォルダ名",
  "地図｜LIVE",
  "日程｜LIVE",
  "場所｜LIVE",
  "時間｜LIVE",
  "代金｜LIVE",
  "飲食｜LIVE",
  "地図リンク｜LIVE",
] as const;

export type PostMetaKey = (typeof POST_META_KEYS)[number];

export type PostMeta = Partial<Record<PostMetaKey, string>>;

export function metaString(
  meta: PostMeta | Record<string, unknown> | undefined,
  key: PostMetaKey
): string {
  const v = meta?.[key];
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  return "";
}
