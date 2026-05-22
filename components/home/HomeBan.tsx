import { themeAsset } from "@/lib/config";

/** top/ban.php と同じ表示条件 */
export function HomeBan() {
  const deadline = new Date("2026-09-26T00:00:00+09:00");
  const now = new Date();
  if (now >= deadline) {
    return null;
  }

  return (
    <div className="ban landscape">
      <div className="ban-img landscape">
        <a
          href="https://network.mobile.rakuten.co.jp/area/campaign/corporation/?scid=mi_rmb_web_promojp_invi_bnr_RWPS005269&corpid=RWPS005269"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={themeAsset("img/out/rmobile_1200x628.png")}
            alt="楽天モバイル特別優待キャンペーン"
            loading="lazy"
          />
        </a>
      </div>
    </div>
  );
}
