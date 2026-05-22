import { metaString, type PostMeta } from "@/lib/post-meta";

type Props = {
  meta: PostMeta;
};

/** single/live.php — type が live のときのみ */
export function TrajectoryLiveSection({ meta }: Props) {
  if (metaString(meta, "type") !== "live") {
    return null;
  }

  const mapEmbed = metaString(meta, "地図｜LIVE");
  const schedule = metaString(meta, "日程｜LIVE");
  const place = metaString(meta, "場所｜LIVE");
  const time = metaString(meta, "時間｜LIVE");
  const fee = metaString(meta, "代金｜LIVE");
  const drink = metaString(meta, "飲食｜LIVE");

  return (
    <>
      {mapEmbed ? (
        <>
          <iframe
            src={`https://www.google.com/maps/embed?${mapEmbed}`}
            width="100%"
            height="300px"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            title="会場地図"
          />
          <br />
          <br />
        </>
      ) : null}

      <div id="form">
        <h2 id="reserve_form">チケット予約フォーム</h2>

        <div
          className="event_details"
          style={{
            margin: 0,
            padding: "5%",
            background: "#eee",
            display: "block",
            overflow: "hidden",
            border: "1px solid #ccc",
          }}
        >
          <dl>
            <dt style={{ fontWeight: "bold" }}>公演内容</dt>
            {schedule ? (
              <dd>
                <span style={{ fontSize: "90%", color: "#777" }}>[日付]</span>{" "}
                {schedule}
              </dd>
            ) : null}
            {place ? (
              <dd>
                <span style={{ fontSize: "90%", color: "#777" }}>[場所]</span>{" "}
                {place}
              </dd>
            ) : null}
            {time ? (
              <dd>
                <span style={{ fontSize: "90%", color: "#777" }}>[時間]</span>{" "}
                {time}
              </dd>
            ) : null}
            {fee ? (
              <dd>
                <span style={{ fontSize: "90%", color: "#777" }}>[代金]</span>{" "}
                {fee}
                {drink ? <small>({drink})</small> : null}
              </dd>
            ) : null}
          </dl>
        </div>

        <div className="sub_work">
          <div className="sub_work_box">
            <p className="m_cap">
              公演内容をよくご確認いただき、下記フォームからご予約をお願いいたします。
            </p>
            <div className="m_disp">
              お名前、メールアドレスを含むお問い合わせ内容は、返信する目的にのみ使用し、それ以外の目的には使用いたしません。
            </div>
          </div>
        </div>

        <form
          method="post"
          action="https://kiichigo.work/form/check.php"
          id="guideform"
        >
          <div className="form_box">
            <input type="hidden" id="form_type" name="form_type" value="reservation" />
            <input type="hidden" id="live_date" name="live_date" value={schedule} />
            <input type="hidden" id="live_state" name="live_state" value={place} />
            <input type="hidden" id="live_time" name="live_time" value={time} />
            <input type="hidden" id="live_drink" name="live_drink" value={drink} />
            <input type="hidden" id="live_fee" name="live_fee" value={fee} />
            <input
              type="hidden"
              id="map_link"
              name="map_link"
              value={metaString(meta, "地図リンク｜LIVE")}
            />

            <div className="form_group">
              <div className="label required">枚数</div>
              <div className="input">
                <select name="ticket" className="slct-entryPlan_kit" defaultValue="">
                  <option value="">-</option>
                  {["１", "２", "３", "４", "５", "６", "７", "８", "９", "１０"].map(
                    (n, i) => (
                      <option key={n} value={n}>
                        {i + 1}
                      </option>
                    )
                  )}
                </select>
                <em>枚</em>
              </div>
            </div>

            <div className="form_group">
              <div className="label required">お名前</div>
              <div className="input">
                <input
                  type="text"
                  className="m"
                  id="name"
                  name="name"
                  placeholder="例）ごのかみ"
                />
              </div>
            </div>

            <div className="form_group">
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

            <div className="form_group">
              <div className="label required">確認用メールアドレス</div>
              <div className="input">
                <input
                  type="email"
                  className="m"
                  id="email2"
                  name="email2"
                  placeholder="間違い防止のためもう一度ご入力ください"
                />
              </div>
            </div>
          </div>

          <div className="form_group_check_submit">
            <div className="multiple">
              <button type="submit" className="admin_btn" value="予約する">
                予約する <i className="fa fa-angle-right" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
