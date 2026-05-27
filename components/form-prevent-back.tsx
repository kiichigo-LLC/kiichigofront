"use client";

import { useEffect } from "react";

/** フォーム送信後ページでブラウザ戻るを抑止（旧 ok.php / error.php 相当） */
export function FormPreventBack() {
  useEffect(() => {
    if (!window.history?.pushState) return;

    history.pushState("nohb", "", "");

    const onPopState = (event: PopStateEvent) => {
      if (!event.state) {
        history.pushState("nohb", "", "");
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return null;
}
