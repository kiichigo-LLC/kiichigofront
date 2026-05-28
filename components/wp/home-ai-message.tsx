"use client";

import { useEffect, useState } from "react";
import { WP_CLIENT } from "utils/config";

type HomeApiResponse = {
  message?: string;
  last_generated?: string;
};

type Props = {
  fallbackMessage: string;
  fallbackLog: string;
};

function normalizeMessage(message: string): string {
  return message.replace(/（/g, "(").replace(/）/g, ")");
}

function homeApiUrl(): string {
  const base = (WP_CLIENT || "").replace(/\/$/, "");
  if (!base) return "/wp-json/kiichigo/v1/home";
  if (base.includes("/wp-json/wp/v2")) {
    return `${base.replace("/wp-json/wp/v2", "")}/wp-json/kiichigo/v1/home`;
  }
  if (base.includes("/wp-json/")) {
    return `${base.replace(/\/wp-json\/.*$/, "")}/wp-json/kiichigo/v1/home`;
  }
  return `${base}/wp-json/kiichigo/v1/home`;
}

function homeApiCandidates(): string[] {
  const urls: string[] = [];
  const primary = homeApiUrl();
  urls.push(primary);

  if (typeof window !== "undefined") {
    urls.push(`${window.location.origin}/wp-json/kiichigo/v1/home`);
  }

  urls.push("https://wp.kiichigo.work/wp-json/kiichigo/v1/home");

  return Array.from(new Set(urls));
}

export function HomeAiMessage({ fallbackMessage, fallbackLog }: Props) {
  const [message, setMessage] = useState(normalizeMessage(fallbackMessage));
  const [lastGenerated, setLastGenerated] = useState(fallbackLog);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      for (const url of homeApiCandidates()) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const data = (await res.json()) as HomeApiResponse;
          if (cancelled) return;

          const nextMessage = (data?.message || "").trim();
          const nextLog = (data?.last_generated || "").trim();

          if (nextMessage) setMessage(normalizeMessage(nextMessage));
          if (nextLog) setLastGenerated(nextLog);
          if (nextMessage || nextLog) return;
        } catch {
          // 次の候補 URL で継続
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {message}
      <br />
      {lastGenerated ? (
        <>
          <small>
            <i>Log: {lastGenerated}</i>
          </small>
          <br />
        </>
      ) : null}
      <small>
        合同会社キイチゴ
        <br />
        🤖AI
      </small>
    </>
  );
}
