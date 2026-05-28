"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { path } from "utils/config";

function Guard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("from") === "portfolio") return;
    if (typeof document !== "undefined" && document.referrer.includes("/portfolio/")) {
      return;
    }
    router.replace(path("/web"));
  }, [router, searchParams]);

  return null;
}

/** ポートフォリオ記事の直リンクを /web へ（静的ホスト向け・referer はクライアントのみ） */
export function PortfolioAccessGuard() {
  return (
    <Suspense fallback={null}>
      <Guard />
    </Suspense>
  );
}
