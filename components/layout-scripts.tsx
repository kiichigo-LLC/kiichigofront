"use client";

import Script from "next/script";
import { asset } from "utils/config";
import usePageType from "@hooks/usePageType";

/** pathname に応じたテーマ JS（layout 末尾） */
export function LayoutScripts() {
  const { loadContactForm, loadPrism, loadSingleWebIframe, loadTagPlayer } =
    usePageType();

  return (
    <>
      {loadContactForm ? (
        <>
          <Script
            src={asset("js/jquery.validate.min.js")}
            strategy="afterInteractive"
          />
          <Script
            src={asset("js/jquery.validate.japlugin.js")}
            strategy="afterInteractive"
          />
          <Script src={asset("js/check.min.js?v1")} strategy="afterInteractive" />
        </>
      ) : null}

      {loadPrism ? (
        <Script src={asset("js/prism.js?v1")} strategy="afterInteractive" />
      ) : null}

      {loadSingleWebIframe ? (
        <Script
          src={asset("js/single-web-iframe.js")}
          strategy="afterInteractive"
        />
      ) : null}

      {loadTagPlayer ? (
        <Script src={asset("js/player2.js?22")} strategy="lazyOnload" />
      ) : (
        <Script src={asset("js/player.min.js")} strategy="lazyOnload" />
      )}

      <Script
        src={asset("js/jquery.colorbox-min.js")}
        strategy="afterInteractive"
      />
      <Script src={asset("js/script.min.js?1")} strategy="afterInteractive" />
    </>
  );
}
