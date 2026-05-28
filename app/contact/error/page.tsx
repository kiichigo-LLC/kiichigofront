import type { Metadata } from "next";
import { ContactErrorBody } from "@/components/contact-error-body";
import { FormPreventBack } from "@/components/form-prevent-back";
import { pageMeta, titleWithSite } from "@/lib/seo";

const PATH = "/contact/error";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: titleWithSite("送信エラー"),
    description: "お問い合わせフォームの送信に失敗しました。",
    path: PATH,
    noIndex: true,
  });
}

export default function ContactErrorPage() {
  return (
    <>
      <FormPreventBack />
      <ContactErrorBody />
    </>
  );
}
