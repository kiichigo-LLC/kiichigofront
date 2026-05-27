import type { Metadata } from "next";
import Link from "next/link";
import { FormPreventBack } from "@/components/form-prevent-back";
import { pageMeta, titleWithSite } from "@/lib/seo";
import { path } from "utils/config";

const PATH = "/contact/error";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: titleWithSite("送信エラー"),
    description: "お問い合わせフォームの送信に失敗しました。",
    path: PATH,
    noIndex: true,
  });
}

export default async function ContactErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ form_error?: string }>;
}) {
  const { form_error: formError } = await searchParams;
  const isRecaptchaError = formError === "recaptchaerror";

  return (
    <>
      <FormPreventBack />
      <div className="contact elm">
        <div className="contact-inr elm-inr">
          {isRecaptchaError ? (
            <>
              <h1 className="contact-title elm-ttl">
                <span>お問い合わせフォームに戻りもう一度ご入力ください</span>
              </h1>
              <div className="contact-intro elm-text">
                <b>「私はロボットではありません」</b>
                にチェックが入っておりませんでしたので、お問い合わせが完了しませんでした。
              </div>
            </>
          ) : (
            <>
              <h1 className="contact-title elm-ttl">
                <span>送信完了しました</span>
              </h1>
              <div className="contact-intro elm-text">
                お問合わせありがとうございました
                <br />
                ご入力いただいたメールアドレスに内容を送信しましたのでご確認ください。
              </div>
            </>
          )}

          <div className="contact-link elm-list">
            <ul>
              <li>
                <Link href={path("/contact")}>
                  {" "}
                  <i className="fa fa-angle-left" aria-hidden="true"></i>{" "}
                  お問い合わせフォームへ戻る
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
