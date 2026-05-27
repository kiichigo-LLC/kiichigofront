(function () {
  "use strict";

  var wrap = document.querySelector(".elm-box-wrap");
  var iframeBox = document.querySelector(".elm-box-iframe");
  if (!wrap || !iframeBox) return;

  var scheduled = false;

  function update() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    if (vh <= 0) return;
    var top = wrap.getBoundingClientRect().top;
    var opacity = Math.max(0, Math.min(1, top / vh));
    iframeBox.style.opacity = String(opacity);
    iframeBox.style.pointerEvents = opacity < 0.02 ? "none" : "";
  }

  function onScrollOrResize() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      update();
    });
  }

  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", onScrollOrResize);
    window.visualViewport.addEventListener("scroll", onScrollOrResize);
  }
  update();
})();
