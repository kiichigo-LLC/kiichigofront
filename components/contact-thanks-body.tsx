"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { path } from "utils/config";

function ThanksInner() {
  const rawFormType = useSearchParams().get("form_type");
  const isReservation = rawFormType === "reservation";
  const topHref = isReservation ? path("/koe") : path("/");

  return (
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
  );
}

export function ContactThanksBody() {
  return (
    <Suspense fallback={<div className="contact elm" />}>
      <ThanksInner />
    </Suspense>
  );
}
