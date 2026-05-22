import { themeAsset } from "@/lib/config";

export function LoadingMask() {
  return (
    <div id="loading_mask">
      <div className="loading_mask-title">
        <div className="loading_mask-title-top">
          <p className="logo">
            <img src={themeAsset("img/logo.svg")} alt="" />
          </p>
        </div>
      </div>
      <div className="loading_mask-cover">
        <div className="loading_mask-cover-inner">
          <p className="loading_mask-cover-l"></p>
          <p className="loading_mask-cover-r"></p>
        </div>
      </div>
    </div>
  );
}
