"use client";

/** single-web.php: タグ 49（ポートフォリオ）記事のナビ */
export function PortfolioCloseNav() {
  return (
    <div className="pagenav">
      <div className="pagenav-inr">
        <div className="pagenav-center">
          <button
            type="button"
            className="admin_btn"
            onClick={() => window.close()}
          >
            閉じる <i className="fa fa-times" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
