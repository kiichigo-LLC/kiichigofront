"use client";

import { useEffect } from "react";

/** WP header.php の loading-delay 付与（クライアント側の保険） */
export function ClientEnhancements() {
  useEffect(() => {
    document.documentElement.classList.add("loading-delay");

    const t = window.setTimeout(() => {
      document.documentElement.classList.add("loading-delay");
    }, 3000);

    return () => window.clearTimeout(t);
  }, []);

  return null;
}
