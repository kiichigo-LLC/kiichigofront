import type { Metadata } from "next";
import { ContactThanksBody } from "@/components/contact-thanks-body";
import { FormPreventBack } from "@/components/form-prevent-back";
import { pageMeta, titleWithSite } from "@/lib/seo";

const PATH = "/contact/thanks";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: titleWithSite("送信完了"),
    description: "お問い合わせ・ご予約の送信が完了しました。",
    path: PATH,
    noIndex: true,
  });
}

export default function ContactThanksPage() {
  return (
    <>
      <FormPreventBack />
      <ContactThanksBody />
    </>
  );
}
