"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { bindLightbox } from "@/lib/kiichigo-lightbox";

/** ページ遷移のたびにライトボックスを再バインド（WP 本文の a.group 等） */
export function LightboxBinder() {
  const pathname = usePathname();

  useEffect(() => {
    const unbind = bindLightbox();
    return unbind;
  }, [pathname]);

  return null;
}
