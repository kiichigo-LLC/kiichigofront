import { watch } from "chokidar";
import { buildJs } from "./build-assets.mjs";

const sources = [
  "public/js/script.js",
  "public/js/check.js",
  "public/js/player.js",
  "public/js/toploading.js",
];

await buildJs();

watch(sources, { ignoreInitial: true }).on("change", async (path) => {
  console.log(`[watch:js] ${path}`);
  await buildJs();
});

console.log("[watch:js] watching", sources.join(", "));
