/** jQuery Colorbox 代替（既存 #colorbox / #cbox* の SCSS をそのまま利用） */

import { resolvePublicMediaUrl } from "@/lib/media-url";

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|svg|avif)(\?|#|$)/i;

type Slide =
  | { type: "image"; src: string; title: string }
  | { type: "iframe"; src: string; title: string };

let slides: Slide[] = [];
let index = 0;
let mounted = false;

let overlay: HTMLDivElement | null = null;
let box: HTMLDivElement | null = null;
let content: HTMLDivElement | null = null;
let loaded: HTMLDivElement | null = null;
let btnPrev: HTMLButtonElement | null = null;
let btnNext: HTMLButtonElement | null = null;
let btnClose: HTMLButtonElement | null = null;

const CLICK_SELECTOR = [
  "a.one",
  "a.group",
  "a.gallery",
  "a.popup",
  "a.ifpopup",
  "a.ilpopup",
  "a.inline",
  "a.iframe",
  "a.callbacks",
  "a.ajax",
].join(", ");

function isImageLink(a: HTMLAnchorElement): boolean {
  const href = a.getAttribute("href");
  if (!href || href === "#") return false;
  if (IMAGE_EXT.test(href)) return true;
  return Boolean(a.querySelector("img"));
}

function isIframeLink(a: HTMLAnchorElement): boolean {
  return (
    a.classList.contains("ifpopup") ||
    a.classList.contains("iframe") ||
    a.classList.contains("callbacks")
  );
}

function gallerySelector(a: HTMLAnchorElement): string | null {
  if (a.classList.contains("gallery")) return "a.gallery";
  if (a.classList.contains("group")) return "a.group";
  return null;
}

function collectSlides(anchor: HTMLAnchorElement): Slide[] {
  const sel = gallerySelector(anchor);
  const anchors = sel
    ? (Array.from(document.querySelectorAll(sel)) as HTMLAnchorElement[])
    : [anchor];

  const slidesOut: Slide[] = [];
  for (const a of anchors) {
    const href = a.href;
    if (!href) continue;
    if (isIframeLink(a)) {
      slidesOut.push({ type: "iframe", src: href, title: a.title || "" });
    } else if (isImageLink(a)) {
      slidesOut.push({
        type: "image",
        src: resolvePublicMediaUrl(href),
        title: a.title || "",
      });
    }
  }
  return slidesOut;
}

function ensureDom() {
  if (mounted) return;

  overlay = document.createElement("div");
  overlay.id = "cboxOverlay";
  overlay.setAttribute("role", "presentation");
  overlay.style.display = "none";

  box = document.createElement("div");
  box.id = "colorbox";
  box.style.display = "none";

  const wrapper = document.createElement("div");
  wrapper.id = "cboxWrapper";

  content = document.createElement("div");
  content.id = "cboxContent";

  btnClose = document.createElement("button");
  btnClose.type = "button";
  btnClose.id = "cboxClose";
  btnClose.setAttribute("aria-label", "閉じる");

  btnPrev = document.createElement("button");
  btnPrev.type = "button";
  btnPrev.id = "cboxPrevious";
  btnPrev.setAttribute("aria-label", "前へ");

  btnNext = document.createElement("button");
  btnNext.type = "button";
  btnNext.id = "cboxNext";
  btnNext.setAttribute("aria-label", "次へ");

  loaded = document.createElement("div");
  loaded.id = "cboxLoadedContent";

  content.append(btnClose, btnPrev, btnNext, loaded);
  wrapper.append(content);
  box.append(wrapper);

  overlay.addEventListener("click", () => closeLightbox());
  btnClose.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeLightbox();
  });
  btnPrev.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    step(-1);
  });
  btnNext.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    step(1);
  });

  document.body.append(overlay, box);
  document.addEventListener("keydown", onKeydown);

  mounted = true;
}

function onKeydown(e: KeyboardEvent) {
  if (!document.body.classList.contains("cbox-open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
}

function setOpen(open: boolean) {
  if (!overlay || !box) return;
  if (open) {
    document.body.classList.add("cbox-open");
    overlay.style.display = "block";
    box.style.display = "block";
  } else {
    document.body.classList.remove("cbox-open");
    overlay.style.display = "none";
    box.style.display = "none";
  }
}

function render() {
  if (!overlay || !box || !loaded || !btnPrev || !btnNext) return;

  const slide = slides[index];
  if (!slide) return;

  loaded.innerHTML = "";
  if (slide.type === "image") {
    const img = document.createElement("img");
    img.className = "cboxPhoto";
    img.src = slide.src;
    img.alt = slide.title;
    loaded.append(img);
  } else {
    const iframe = document.createElement("iframe");
    iframe.className = "cboxIframe";
    iframe.src = slide.src;
    iframe.title = slide.title || "content";
    loaded.append(iframe);
  }

  const multi = slides.length > 1;
  btnPrev.hidden = !multi;
  btnNext.hidden = !multi;

  setOpen(true);
}

function step(delta: number) {
  if (slides.length <= 1) return;
  index = (index + delta + slides.length) % slides.length;
  render();
}

export function closeLightbox() {
  setOpen(false);
}

function openAt(anchor: HTMLAnchorElement) {
  const list = collectSlides(anchor);
  if (!list.length) return;

  const startHref = resolvePublicMediaUrl(anchor.href);
  let start = list.findIndex((s) => s.src === startHref);
  if (start < 0) start = 0;

  slides = list;
  index = start;
  ensureDom();
  render();
}

function onDocumentClick(e: MouseEvent) {
  const target = e.target;
  if (!(target instanceof Element)) return;
  const anchor = target.closest(CLICK_SELECTOR);
  if (!(anchor instanceof HTMLAnchorElement)) return;
  if (!anchor.href || anchor.href === "#") return;

  if (isIframeLink(anchor) || isImageLink(anchor) || anchor.classList.contains("ajax")) {
    e.preventDefault();
    openAt(anchor);
  }
}

/** .popup は旧 colorbox 同様、表示時に自動オープン */
function autoOpenPopups(root: ParentNode) {
  root.querySelectorAll("a.popup").forEach((node) => {
    if (node instanceof HTMLAnchorElement) {
      openAt(node);
    }
  });
}

let bound = false;

export function bindLightbox() {
  if (typeof document === "undefined") return () => {};
  if (!bound) {
    document.addEventListener("click", onDocumentClick);
    bound = true;
  }
  autoOpenPopups(document);
  return () => {
    document.removeEventListener("click", onDocumentClick);
    closeLightbox();
    bound = false;
  };
}
