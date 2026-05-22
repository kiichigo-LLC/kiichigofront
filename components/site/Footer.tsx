import { themeAsset } from "@/lib/config";
import Script from "next/script";

type Props = {
  isTagPage?: boolean;
  loadPrism?: boolean;
  loadSingleWebIframe?: boolean;
  loadContactForm?: boolean;
};

export function Footer({
  isTagPage = false,
  loadPrism = false,
  loadSingleWebIframe = false,
  loadContactForm = false,
}: Props) {
  const year = new Date().getFullYear();

  return (
    <>
      <footer>
        <div className="footer">
          <div className="footer-inr">
            <div className="footer-copyright">
              <span>
                {year} <s>&copy;</s> Kiichigo LLC
              </span>
            </div>
          </div>
        </div>
      </footer>

      {loadPrism ? (
        <Script src={themeAsset("js/prism.js?v1")} strategy="lazyOnload" />
      ) : null}
      {loadSingleWebIframe ? (
        <Script
          src={themeAsset("js/single-web-iframe.js")}
          strategy="lazyOnload"
        />
      ) : null}
      {loadContactForm ? (
        <>
          <Script
            src={themeAsset("js/jquery.validate.min.js")}
            strategy="lazyOnload"
          />
          <Script
            src={themeAsset("js/jquery.validate.japlugin.js")}
            strategy="lazyOnload"
          />
          <Script
            src={themeAsset("js/check.min.js?v1")}
            strategy="lazyOnload"
          />
        </>
      ) : null}
      <Script src={themeAsset("js/jquery.colorbox-min.js")} strategy="lazyOnload" />
      <Script src={themeAsset("js/swiper.min.js")} strategy="lazyOnload" />
      <Script src={themeAsset("js/script.min.js?1")} strategy="lazyOnload" />
      {isTagPage ? (
        <Script src={themeAsset("js/player2.js?22")} strategy="lazyOnload" />
      ) : (
        <Script src={themeAsset("js/player.min.js")} strategy="lazyOnload" />
      )}
    </>
  );
}
