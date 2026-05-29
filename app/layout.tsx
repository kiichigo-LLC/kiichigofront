import type { Metadata } from "next";
import Script from "next/script";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HomeLoading } from "@/components/home-loading";
import { TouchHoverFix } from "@/components/touch-hover-fix";
import { LightboxBinder } from "@/components/lightbox-binder";
import { asset } from "utils/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:1234"
  ),
  // app/favicon.ico があると Next デフォルトが /favicon.ico で勝つため、テーマ側を指定
  icons: {
    icon: asset("img/favicon.ico"),
    apple: asset("img/appHomeIcon.png"),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="loading-delay">
      <head>
        <meta charSet="utf-8" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={asset("css/style.css?v169")} />
        <meta name="google" content="notranslate" />
        <meta name="application-name" content="合同会社キイチゴ" />
        <meta name="msapplication-TileColor" content="#FF5C00" />
        <meta
          name="msapplication-square70x70logo"
          content={asset("img/msapplication/tiny.png")}
        />
        <meta
          name="msapplication-square150x150logo"
          content={asset("img/msapplication/square.png")}
        />
        <meta
          name="msapplication-wide310x150logo"
          content={asset("img/msapplication/wide.png")}
        />
        <meta
          name="msapplication-square310x310logo"
          content={asset("img/msapplication/large.png")}
        />
      </head>
      <body>
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-58GB3CJ');`}
        </Script>

        <Script id="typekit" strategy="afterInteractive">
          {`(function(d){var config={kitId:'zjo5ojg',scriptTimeout:3000,async:true},h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)})(document);`}
        </Script>

        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-58GB3CJ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="gtm"
          />
        </noscript>

        <HomeLoading />

        <div className="wrap">
          <Header />
          {children}
          <Footer />
        </div>

        <LightboxBinder />
        <TouchHoverFix />
      </body>
    </html>
  );
}
