"use client";

import { useEffect, useRef } from "react";
import { asset } from "utils/config";
import usePageType from "@hooks/usePageType";

/**
 * トップ専用のフルスクリーンローディング。
 * `<Script id="...">` は同じ id がクライアント遷移で再実行されないため、
 * トップに戻るたびに `useEffect` でタイマーを張り直す。
 */
export function HomeLoading() {
  const { isHome } = usePageType();
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (!isHome) return;

    const clearTimers = () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };

    const mask = document.getElementById("loading_mask");
    if (!mask) {
      return clearTimers;
    }

    const t1 = window.setTimeout(() => {
      mask.classList.add("out");
      const t2 = window.setTimeout(() => {
        mask.style.display = "none";
        const t3 = window.setTimeout(() => {
          document.querySelector(".main-inr")?.classList.add("ignition");
        }, 1000);
        timers.current.push(t3);
      }, 2000);
      timers.current.push(t2);
    }, 3000);
    timers.current.push(t1);

    return clearTimers;
  }, [isHome]);

  if (!isHome) return null;

  return (
    <div id="loading_mask">
      <div className="loading_mask-title">
        <div className="loading_mask-title-top">
          <p className="logo">
            <img src={asset("img/logo.svg")} alt="" />
          </p>
        </div>
      </div>
      <div className="loading_mask-cover">
        <div className="loading_mask-cover-inner">
          <p className="loading_mask-cover-l"></p>
          <p className="loading_mask-cover-r"></p>
        </div>
      </div>
    </div>
  );
}
