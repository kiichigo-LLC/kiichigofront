import { sitePath } from "@/lib/config";
import { permalinkToPath } from "@/lib/wp";
import Link from "next/link";

type AdjacentLink = {
  title: string;
  permalink: string;
};

type Props = {
  older: AdjacentLink | null;
  newer: AdjacentLink | null;
};

export function PageNav({ older, newer }: Props) {
  return (
    <div className="pagenav">
      <div className="pagenav-inr">
        <div className="pagenav-prev">
          {older ? (
            <Link
              href={sitePath(permalinkToPath(older.permalink))}
              title={older.title}
            >
              <i className="fa fa-angle-left"></i> 前へ{" "}
            </Link>
          ) : null}
        </div>
        <div className="pagenav-center"> ｜ </div>
        <div className="pagenav-next">
          {newer ? (
            <Link
              href={sitePath(permalinkToPath(newer.permalink))}
              title={newer.title}
            >
              次へ <i className="fa fa-angle-right"></i>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
