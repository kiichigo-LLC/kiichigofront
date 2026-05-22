import { CategoryArchiveContent } from "./CategoryArchiveContent";
import type { CategoryArchiveItem } from "@/lib/wp";

type Props = {
  items: CategoryArchiveItem[];
};

export function WebCategoryContent({ items }: Props) {
  return (
    <CategoryArchiveContent
      title="ホームページ制作・システム開発"
      subtitle={
        <a
          href="https://kiichigonokami.com/#unkr-04"
          style={{ borderBottom: "1px solid #ff0348" }}
          target="_blank"
          rel="noreferrer"
        >
          スキルシートはこちら
        </a>
      }
      items={items}
      dateOnlyWhenSet
    />
  );
}
