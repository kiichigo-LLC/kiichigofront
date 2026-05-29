"use client";

import { useState, type FormEvent } from "react";
import { FORM_CHECK_URL, RECAPTCHA_SITE_KEY } from "@/lib/wp";

const MSG = {
  name: "お名前またはニックネームを入力してください",
  emailRequired: "メールアドレスを入力してください",
  emailFormat: "正しいメールアドレスを入力してください",
  email2Required: "確認用メールアドレスを入力してください",
  email2Match: "メールアドレスが違います",
  inquiry: "内容を入力してください",
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <label className="error">{message}</label>;
}

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(form: HTMLFormElement) {
    const fd = new FormData(form);
    const next: Record<string, string> = {};

    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const email2 = String(fd.get("email2") ?? "").trim();
    const inquiry = String(fd.get("inquiry") ?? "").trim();

    if (!name) next.name = MSG.name;
    if (!email) next.email = MSG.emailRequired;
    else if (!EMAIL_RE.test(email)) next.email = MSG.emailFormat;
    if (!email2) next.email2 = MSG.email2Required;
    else if (email2 !== email) next.email2 = MSG.email2Match;
    if (!inquiry) next.inquiry = MSG.inquiry;

    return next;
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const next = validate(e.currentTarget);
    if (Object.keys(next).length > 0) {
      e.preventDefault();
      setErrors(next);
      return;
    }
    setErrors({});
  }

  return (
    <form method="post" action={FORM_CHECK_URL} id="guideform" onSubmit={onSubmit} noValidate>
      <input type="hidden" id="form_type" name="form_type" value="contact_us" />
      <div className="form">
        <div className="form-group">
          <div className="label required">会社名 / お名前</div>
          <div className="input">
            <input
              type="text"
              className="m"
              id="name"
              name="name"
              placeholder="例）合同会社キイチゴ"
            />
            <FieldError message={errors.name} />
          </div>
        </div>
        <div className="form-group">
          <div className="label required">メールアドレス</div>
          <div className="input">
            <input
              type="email"
              className="m"
              id="email"
              name="email"
              placeholder="PCメールを推奨します（Gmail等）"
            />
            <FieldError message={errors.email} />
          </div>
        </div>
        <div className="form-group">
          <div className="label required">確認用メールアドレス</div>
          <div className="input">
            <input
              type="email"
              className="m"
              id="email2"
              name="email2"
              placeholder="間違い防止のためもう一度ご入力ください"
              autoComplete="off"
            />
            <FieldError message={errors.email2} />
          </div>
        </div>
        <div className="form-group">
          <div className="label required">内容</div>
          <div className="input">
            <textarea name="inquiry" rows={7} cols={100} />
            <FieldError message={errors.inquiry} />
          </div>
        </div>
      </div>
      <div className="form-group">
        <div className="g-recaptcha" data-sitekey={RECAPTCHA_SITE_KEY} />
      </div>
      <div className="form-group_check_submit">
        <div className="multiple">
          <button type="submit" className="admin_btn" value="送信">
            送 信 <i className="fa fa-angle-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </form>
  );
}
