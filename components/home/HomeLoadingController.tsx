"use client";

import { useEffect } from "react";

/**
 * toploading.min.js 相当（WP home のローディングアニメ）
 * Next では lazyOnload だと window.load を逃すためクライアントで実行
 */
export function HomeLoadingController() {
  useEffect(() => {
    let t1 = 0;
    let t2 = 0;
    let t3 = 0;

    const start = () => {
      const mask = document.getElementById("loading_mask");
      if (!mask) return;

      t1 = window.setTimeout(() => {
        mask.classList.add("out");
        t2 = window.setTimeout(() => {
          mask.style.display = "none";
          t3 = window.setTimeout(() => {
            document.querySelector(".main-inr")?.classList.add("ignition");
          }, 1000);
        }, 2000);
      }, 3000);
    };

    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
    }

    return () => {
      window.removeEventListener("load", start);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);

  return null;
}
