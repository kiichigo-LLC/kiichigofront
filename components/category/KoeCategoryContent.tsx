import { CategoryArchiveContent } from "./CategoryArchiveContent";
import type { CategoryArchiveItem } from "@/lib/wp";

type Props = {
  items: CategoryArchiveItem[];
};

export function KoeCategoryContent({ items }: Props) {
  return (
    <CategoryArchiveContent
      title="歌・作詞・作曲・ナレーション"
      subtitle={
        <a
          href="https://rubu.studio/"
          style={{ borderBottom: "1px solid #ff0348" }}
          target="_blank"
          rel="noreferrer"
        >
          機材リスト<small>と</small>録音サンプル
        </a>
      }
      items={items}
    />
  );
}
