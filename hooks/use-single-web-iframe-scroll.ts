"use client";

import { useEffect } from "react";

/**
 * 旧テーマ `js/single-web-iframe.js` と同じ挙動。
 * スクロール量に応じて `.elm-box-iframe` の opacity を下げ、下の白いコンテンツへ見せる。
 */
export function useSingleWebIframeScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const wrap = document.querySelector(".elm-box-wrap");
    const iframeBox = document.querySelector(".elm-box-iframe");
    if (!wrap || !iframeBox) return;

    let scheduled = false;

    const update = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (vh <= 0) return;
      const top = wrap.getBoundingClientRect().top;
      const opacity = Math.max(0, Math.min(1, top / vh));
      (iframeBox as HTMLElement).style.opacity = String(opacity);
      (iframeBox as HTMLElement).style.pointerEvents =
        opacity < 0.02 ? "none" : "";
    };

    const onScrollOrResize = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        update();
      });
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", onScrollOrResize);
      vv.addEventListener("scroll", onScrollOrResize);
    }
    update();

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (vv) {
        vv.removeEventListener("resize", onScrollOrResize);
        vv.removeEventListener("scroll", onScrollOrResize);
      }
      (iframeBox as HTMLElement).style.opacity = "";
      (iframeBox as HTMLElement).style.pointerEvents = "";
    };
  }, [enabled]);
}
