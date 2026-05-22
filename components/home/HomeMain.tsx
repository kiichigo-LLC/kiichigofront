import type { HomeData } from "@/lib/wp";

type Props = {
  home: HomeData;
};

export function HomeMain({ home }: Props) {
  const message = home.message.replace(/（/g, "(").replace(/）/g, ")");

  return (
    <div className="main">
      <div className="main-inr">
        <div className="main-home">
          <div className="main-home-inr">
            <span>
              {message}<br />
              {home.last_generated ? (
                <>
                  <small>
                    <i>Log: {home.last_generated}</i>
                  </small><br />
                </>
              ) : null}
              <small>
                合同会社キイチゴ<br />
                🤖AI
              </small>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
