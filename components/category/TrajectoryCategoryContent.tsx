import { PageWarning } from "@/components/site/PageWarning";
import { sitePath } from "@/lib/config";
import { permalinkToPath, type TrajectoryListItem, type WpTag } from "@/lib/wp";
import Link from "next/link";

type Props = {
  tags: WpTag[];
  items: TrajectoryListItem[];
};

export function TrajectoryCategoryContent({ tags, items }: Props) {
  return (
    <div className="category elm">
      <div className="category-inr elm-inr">
        <h1 className="category-title elm-ttl">
          <span>ブログ</span>
        </h1>

        <div className="tag-cloud">
          <div className="tag-cloud-list">
            <ol>
              {tags.map((tag) => (
                <li key={tag.id}>
                  <Link href={sitePath(permalinkToPath(tag.link))}>
                    <span>
                      <small>#</small>
                      {tag.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="category-main">
          <div className="category-main-inr">
            {items.map((item) => (
              <div className="category-list" key={item.id}>
                <ul>
                  <li>
                    <Link href={sitePath(permalinkToPath(item.permalink))}>
                      <span className="category-list-date">{item.listDate}</span>
                      <span className="category-list-title">{item.title}</span>
                    </Link>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>

        <PageWarning />
      </div>
    </div>
  );
}
