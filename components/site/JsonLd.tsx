import { themeAsset } from "@/lib/config";

type Props = {
  title: string;
  description: string;
  url: string;
};

export function JsonLd({ title, description, url }: Props) {
  const ogp = themeAsset("img/ogp.jpg");
  const website = {
    "@context": "http://schema.org",
    "@type": "website",
    name: "五野上貴一が代表をつとめる合同会社キイチゴのホームページ",
    inLanguage: "jp",
    publisher: {
      "@type": "Organization",
      name: title,
      logo: { "@type": "ImageObject", url: ogp },
    },
    copyrightYear: "2021-01-08T00:00:00+0000",
    headline: title,
    description,
    url,
  };
  const company = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "合同会社キイチゴ",
    founder: "五野上貴一",
    foundingDate: "2021-01-08",
    description,
    url: "https://kiichigo.work",
    logo: ogp,
    address: {
      "@type": "PostalAddress",
      addressLocality: "世田谷区",
      addressRegion: "東京都",
      addressCountry: "JP",
    },
    sameAs: [
      "https://twitter.com/Kiichigo_llc",
      "https://www.youtube.com/channel/UC2rCm474X9G1kvUeGe0KFTQ",
      "https://www.behance.net/kiichigo",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(company) }}
      />
    </>
  );
}
