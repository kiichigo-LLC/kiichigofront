import { watch } from "chokidar";
import { buildCss } from "./build-assets.mjs";

const sources = ["public/scss"];

buildCss();

watch(sources, { ignoreInitial: true }).on("change", (path) => {
  console.log(`[watch:css] ${path}`);
  buildCss();
});

console.log("[watch:css] watching", sources.join(", "));
