/**
 * public/scss → public/css、*.js → *.min.js
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as sass from "sass";
import { minify } from "terser";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const jsDir = join(root, "public/js");
const scssEntry = join(root, "public/scss/style.scss");
const cssOut = join(root, "public/css/style.css");

/** layout 等が参照する min 版の元ファイル */
const JS_MIN_SOURCES = ["script", "check", "player", "toploading"];

export function buildCss() {
  const result = sass.compile(scssEntry, {
    style: "compressed",
    sourceMap: true,
    loadPaths: [join(root, "public/scss")],
  });
  writeFileSync(cssOut, result.css);
  if (result.sourceMap) {
    writeFileSync(`${cssOut}.map`, JSON.stringify(result.sourceMap));
  }
  console.log("css: public/css/style.css");
}

export async function buildJs() {
  for (const name of JS_MIN_SOURCES) {
    const src = join(jsDir, `${name}.js`);
    const dest = join(jsDir, `${name}.min.js`);
    const code = readFileSync(src, "utf8");
    const result = await minify(code, {
      compress: true,
      mangle: true,
      format: { comments: false },
    });
    if (!result.code) {
      throw new Error(`terser: ${name}.js`);
    }
    writeFileSync(dest, result.code);
    console.log(`js: ${name}.js → ${name}.min.js`);
  }
}

export async function buildAssets() {
  buildCss();
  await buildJs();
}

const isMain =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  const cmd = process.argv[2];
  if (cmd === "css") {
    buildCss();
  } else if (cmd === "js") {
    await buildJs();
  } else {
    await buildAssets();
  }
}
