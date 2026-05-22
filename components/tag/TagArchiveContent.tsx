import { sitePath } from "@/lib/config";
import type { TagArchiveListItem, TagArchivePage } from "@/lib/tag-archive";
import { permalinkToPath, type WpTag } from "@/lib/wp";
import Link from "next/link";

type Props = {
  archive: TagArchivePage;
  cloudTags: WpTag[];
};

export function TagArchiveContent({ archive, cloudTags }: Props) {
  const { tag, items, page, totalPages } = archive;
  const tagPath = `/tag/${tag.slug}`;
  const quotedTitle = `“${tag.name}” 一覧`;

  return (
    <>
      <div className="tag elm">
        <div className="tag-inr elm-inr">
          <div className="tag-main">
            <div className="tag-main-inr">
              <h1 className="tag-title elm-ttl">
                <span>{quotedTitle}</span>
              </h1>

              <div className="tag-cloud">
                <div className="tag-cloud-list">
                  <ol>
                    {cloudTags.map((t) => (
                      <li key={t.id}>
                        <Link href={sitePath(permalinkToPath(t.link))}>
                          <span>
                            <small>#</small>
                            {t.name}
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
                    <TagListEntry key={item.id} item={item} />
                  ))}
                </div>
              </div>

              <div className="pagenav">
                <div className="pagenav-inr">
                  <div className="pagenav-prev">
                    {page > 1 ? (
                      <Link
                        href={
                          page === 2
                            ? sitePath(tagPath)
                            : sitePath(`${tagPath}?page=${page - 1}`)
                        }
                      >
                        前へ
                      </Link>
                    ) : null}
                  </div>
                  <div className="pagenav-center"> ｜{tag.name} | </div>
                  <div className="pagenav-next">
                    {page < totalPages ? (
                      <Link href={sitePath(`${tagPath}?page=${page + 1}`)}>
                        次へ
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function TagListEntry({ item }: { item: TagArchiveListItem }) {
  return (
    <div className="category-list">
      <ul>
        <li>
          <Link href={sitePath(permalinkToPath(item.permalink))}>
            <span className="category-list-title">{item.title}</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
