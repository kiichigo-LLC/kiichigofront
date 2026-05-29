/** SP バーガーメニュー用（_home.scss の $brake_sl と揃える） */
const MOBILE_NAV_MQ = "(max-width: 1024px)";

const NAV_ITEM_SELECTOR = ".header-nav-main-list ul li";

function isMobileNavViewport() {
  return typeof window !== "undefined" && window.matchMedia(MOBILE_NAV_MQ).matches;
}

function setNavItemsMoveIn(on: boolean) {
  document.querySelectorAll(NAV_ITEM_SELECTOR).forEach((el) => {
    el.classList.toggle("movein", on);
  });
}

/** public/js/script.js のバーガー閉じ処理と同じ（PC では close を付けない） */
export function closeMobileNav() {
  document.querySelector(".bgr")?.classList.remove("active");
  const headerNav = document.querySelector(".header-nav");
  if (!headerNav) return;
  headerNav.classList.remove("active");
  if (isMobileNavViewport()) {
    headerNav.classList.add("close");
  } else {
    headerNav.classList.remove("close");
  }
  setNavItemsMoveIn(false);
}

/** public/js/script.js のバーガー開処理と同じ */
export function openMobileNav() {
  document.querySelector(".bgr")?.classList.add("active");
  const headerNav = document.querySelector(".header-nav");
  if (!headerNav) return;
  headerNav.classList.add("active");
  headerNav.classList.remove("close");
  setNavItemsMoveIn(true);
}

/** .bgr クリックで開閉（旧 script.js clickActive） */
export function toggleMobileNav() {
  const bgr = document.querySelector(".bgr");
  if (bgr?.classList.contains("active")) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
}
