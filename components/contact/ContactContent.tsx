import { FORM_CHECK_URL, RECAPTCHA_SITE_KEY } from "@/lib/config";

type Props = {
  pageTitle: string;
};

export function ContactContent({ pageTitle }: Props) {
  return (
    <div className="contact elm">
      <div className="contact-inr elm-inr">
        <h1 className="contact-title elm-ttl">
          <span>{pageTitle}</span>
        </h1>

        <div className="contact-check">
          <div className="contact-check-inr">
            <p className="contact-check-cap">
              お仕事のお問い合わせ、ご依頼は、下記のお問い合わせフォームからお願いいたします。
            </p>
            <div className="contact-check-list">
              ・受信時の状況により、お返事にお時間がかかる事もございます。
              <br />
              ・また、お問い合わせの内容によっては回答致しかねる場合もございます。何卒ご了承ください。
              <br />
              ・お名前、メールアドレスを含むお問い合わせ内容は、返信する目的にのみ使用し、それ以外の目的には使用いたしません。
            </div>
          </div>
        </div>

        <div className="contact-main elm-main">
          <form method="post" action={FORM_CHECK_URL} id="guideform">
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
                </div>
              </div>

              <div className="form-group">
                <div className="label required">内容</div>
                <div className="input">
                  <textarea name="inquiry" rows={7} cols={100} placeholder="" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <div
                className="g-recaptcha"
                data-sitekey={RECAPTCHA_SITE_KEY}
              />
            </div>

            <div className="form-group_check_submit">
              <div className="multiple">
                <button type="submit" className="admin_btn" value="送信">
                  送 信 <i className="fa fa-angle-right" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
