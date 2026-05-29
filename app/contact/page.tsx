import type { Metadata } from "next";
import Script from "next/script";
import { ContactForm } from "@/components/contact-form";
import { DESC_CONTACT, pageMeta, titleWithSite } from "@/lib/seo";

const PATH = "/contact";
const PAGE_TITLE = "お問い合わせ";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: titleWithSite(PAGE_TITLE),
    description: DESC_CONTACT,
    path: PATH,
  });
}

export default function ContactPage() {
  return (
    <>
      <Script
        src="https://www.google.com/recaptcha/api.js"
        strategy="lazyOnload"
      />
      <div className="contact elm">
        <div className="contact-inr elm-inr">
          <h1 className="contact-title elm-ttl">
            <span>{PAGE_TITLE}</span>
          </h1>
          <div className="contact-check">
            <div className="contact-check-inr">
              <p className="contact-check-cap">
                お仕事のお問い合わせ、ご依頼は、下記のお問い合わせフォームからお願いいたします。
              </p>
              <div className="contact-check-list">
                ・受信時の状況により、お返事にお時間がかかる事もございます。<br />
                ・また、お問い合わせの内容によっては回答致しかねる場合もございます。何卒ご了承ください。<br />
                ・お名前、メールアドレスを含むお問い合わせ内容は、返信する目的にのみ使用し、それ以外の目的には使用いたしません。
              </div>
            </div>
          </div>
          <div className="contact-main elm-main">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
