/** タッチ端末で :hover ルールを外し、sticky hover を防ぐ（旧 touch-hover-fix.js） */
export function stripTouchHoverStyles() {
  if (typeof window === "undefined") return;

  const touch =
    "ontouchstart" in document.documentElement ||
    navigator.maxTouchPoints > 0 ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((navigator as any).msMaxTouchPoints ?? 0) > 0;

  if (!touch) return;

  try {
    for (const sheet of Array.from(document.styleSheets)) {
      if (!sheet.rules) continue;
      for (let j = sheet.rules.length - 1; j >= 0; j--) {
        const rule = sheet.rules[j];
        if (rule.selectorText?.includes(":hover")) {
          sheet.deleteRule(j);
        }
      }
    }
  } catch {
    /* cross-origin stylesheets */
  }
}
