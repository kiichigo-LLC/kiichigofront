import type { Metadata } from "next";
import Link from "next/link";
import { FormPreventBack } from "@/components/form-prevent-back";
import { pageMeta, titleWithSite } from "@/lib/seo";
import { path } from "utils/config";

const PATH = "/contact/thanks";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: titleWithSite("送信完了"),
    description: "お問い合わせ・ご予約の送信が完了しました。",
    path: PATH,
    noIndex: true,
  });
}

export default async function ContactThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ form_type?: string }>;
}) {
  const { form_type: rawFormType } = await searchParams;
  const formType = rawFormType === "reservation" ? "reservation" : "contact_us";
  const isReservation = formType === "reservation";
  const topHref = isReservation ? path("/koe") : path("/");

  return (
    <>
      <FormPreventBack />
      <div className="contact elm">
        <div className="contact-inr elm-inr">
          {isReservation ? (
            <>
              <h1 className="contact-title elm-ttl">
                <span>ご予約承りました</span>
              </h1>
              <div className="contact-intro">
                ご予約どうもありがとうございます♫
                <br />
                ご入力いただいたメールアドレスに内容を送信しましたのでご確認ください。
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

          <div className="contact-check">
            <div className="contact-check-inr">
              <p className="contact-check-cap">
                登録完了メールが届かない場合は､下記の理由が考えられますので､ご確認ください｡
              </p>
              <div className="contact-check-list">
                ・<b>迷惑メール</b>ボックスに入ってしまっている可能性があります。
                <br />
                ・『<b>kiichigo.work</b>』のメール受信/拒否の解除をお願いします。
                <br />
                ・メールアドレスが間違っている｡
                <br />
                ・メールの受信/拒否設定がされている｡
              </div>
            </div>
          </div>

          <div className="contact-link elm-list">
            <ul>
              <li>
                <Link href={topHref}>
                  {" "}
                  <i className="fa fa-angle-left" aria-hidden="true"></i> トップページへ戻る
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
