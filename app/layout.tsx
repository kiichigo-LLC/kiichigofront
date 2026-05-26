import type { Metadata } from "next";
import Script from "next/script";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HomeLoading } from "@/components/home-loading";
import { LayoutScripts } from "@/components/layout-scripts";
import { asset } from "utils/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:1234"
  ),
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
        <link rel="icon" href={asset("img/favicon.ico")} />
        <link rel="apple-touch-icon" href={asset("img/appHomeIcon.png")} />
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

        <Script
          src="https://code.jquery.com/jquery-3.5.1.js"
          integrity="sha256-QWo7LDvxbWT2tbbQ97B53yJnYU3WhH/C8ycbRAkjPDc="
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

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

        <LayoutScripts />
      </body>
    </html>
  );
}
