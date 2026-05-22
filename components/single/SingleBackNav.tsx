import { sitePath } from "@/lib/config";
import Link from "next/link";

type Props = {
  categorySlug: string;
};

export function SingleBackNav({ categorySlug }: Props) {
  return (
    <nav>
      <div className="single-back">
        <div className="single-back-link">
          <Link href={sitePath(`/category/${categorySlug}`)}>前に戻る</Link>
        </div>
      </div>
    </nav>
  );
}
