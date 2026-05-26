"use client";

import Script from "next/script";
import { asset } from "utils/config";
import usePageType from "@hooks/usePageType";

export function HomeLoading() {
  const { isHome } = usePageType();
  if (!isHome) return null;

  return (
    <>
      <div id="loading_mask">
        <div className="loading_mask-title">
          <div className="loading_mask-title-top">
            <p className="logo">
              <img src={asset("img/logo.svg")} alt="" />
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
      <Script id="home-loading" strategy="afterInteractive">{`
          (function(){
            function start(){
              var mask=document.getElementById("loading_mask");
              if(!mask)return;
              setTimeout(function(){mask.classList.add("out");
                setTimeout(function(){mask.style.display="none";
                  setTimeout(function(){document.querySelector(".main-inr")&&document.querySelector(".main-inr").classList.add("ignition");},1000);
                },2000);
              },3000);
            }
            if(document.readyState==="complete")start();else window.addEventListener("load",start,{once:true});
          })();
        `}</Script>
    </>
  );
}
