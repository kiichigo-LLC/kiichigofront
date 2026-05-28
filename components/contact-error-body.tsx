"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { path } from "utils/config";

function ErrorInner() {
  const formError = useSearchParams().get("form_error");
  const isRecaptchaError = formError === "recaptchaerror";

  return (
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
  );
}

export function ContactErrorBody() {
  return (
    <Suspense fallback={<div className="contact elm" />}>
      <ErrorInner />
    </Suspense>
  );
}
