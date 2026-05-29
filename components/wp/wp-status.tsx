"use client";

import { usePathname } from "next/navigation";
import { pickMessageFromSeed } from "@/lib/wp-status-messages";

/** 読み込み中に表示する文言（好きに増やして OK） */
export const WP_LOADING_MESSAGES = [
  "読み込み中…",
  "ちょ待てよ",
  "データを運んでます",
  "少々お待ちを",
  "ちょっと待ってね",
  "はいは〜い",
  "まぁまぁ",
] as const;

/** エラー時にランダム表示する文言（`message` 指定時は使わない） */
export const WP_ERROR_MESSAGES = [
  "読み込みに失敗しました。",
] as const;

type WpLoadingProps = {
  /** 指定するとシードではなくこの文言だけ */
  label?: string;
  /** false で先頭の既定文言 */
  random?: boolean;
  /** 未指定時は pathname から決定（ページごとに文言が変わる） */
  seed?: string;
};

export function WpLoading({ label, random = true, seed }: WpLoadingProps) {
  const pathname = usePathname() ?? "/";
  const text =
    label ??
    pickMessageFromSeed(
      WP_LOADING_MESSAGES,
      seed ?? `${pathname}:loading`,
      random
    );

  return (
    <div className="category elm">
      <div className="category-inr elm-inr">
        <p>{text}</p>
      </div>
    </div>
  );
}

type WpErrorProps = {
  message?: string;
  random?: boolean;
  seed?: string;
};

export function WpError({ message, random = true, seed }: WpErrorProps) {
  const pathname = usePathname() ?? "/";
  const text =
    message ??
    pickMessageFromSeed(
      WP_ERROR_MESSAGES,
      seed ?? `${pathname}:error`,
      random
    );

  return (
    <div className="category elm">
      <div className="category-inr elm-inr">
        <p>{text}</p>
      </div>
    </div>
  );
}
