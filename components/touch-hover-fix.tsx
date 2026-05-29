"use client";

import { useEffect } from "react";
import { stripTouchHoverStyles } from "@/lib/touch-hover-fix";

/** layout 末尾で1回だけ実行 */
export function TouchHoverFix() {
  useEffect(() => {
    stripTouchHoverStyles();
  }, []);

  return null;
}
