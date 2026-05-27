# kiichigo — Next.js フロント

`llc/` と同階層。HTML は Next（`app/**/page.tsx`）、css/js/img は **`web/public/`**（旧 WP テーマ `themes/main/public/` から移行）。

## 構成

| 場所 | 内容 |
|------|------|
| `app/page.tsx` など | 固定ページ |
| `app/koe/page.tsx` など | カテゴリ一覧（`/koe`） |
| `app/koe/[slug]/page.tsx` など | 記事詳細（`/koe/記事スラッグ`） |
| `app/tag/page.tsx` | タグ一覧（`/tag`） |
| `app/tag/[slug]/page.tsx` | タグ別投稿一覧（`/tag/スラッグ`） |
| `app/layout.tsx` | `<html>`・共通 CSS / GTM / jQuery・`Header` / `Footer`・`LayoutScripts` |
| `public/css` `public/js` `public/img` `public/scss` | 静的アセット・SCSS ソース（icomoon フォント含む） |
| `components/header.tsx` | Client。`usePageType` でナビ active |
| `components/layout-scripts.tsx` | Client。`usePageType` で読み込む追加 JS |
| `components/home-loading.tsx` | Client。トップの loading マスク |
| `components/footer.tsx` `nav.tsx` | フッター・ナビ |
| `components/page-parts.tsx` `site-json-ld.tsx` | 記事周り・構造化データ（トップ/about） |
| `lib/seo.ts` | description 文言・`pageMeta` / `metaForArticle`（旧 header.php 相当） |
| `utils/config.ts` | env・`path` / `asset` / `canonical`（ibt の `utils/config` と同じ役割） |
| `hooks/usePageType.tsx` | **pathname 判定はここだけ**（Nav・追加 JS 共通） |
| `lib/wp.ts` | WP API 用（`strip`・`featuredImg` など） |

`tsconfig` の `paths`: `@components/*` `@hooks/*` `utils/*`（ibt と同様の import が可能）

### カテゴリを増やすとき

1. `app/○○/page.tsx`（一覧）をコピー
2. `app/○○/[slug]/page.tsx`（記事）をコピー
3. ページ別 JS が要れば `hooks/usePageType.tsx` の `pageType()` に判定を追加

## データ

| 用途 | API |
|------|-----|
| 投稿 | `GET /wp-json/wp/v2/posts?...` |
| 固定ページ | `GET /wp-json/wp/v2/pages?slug=...` |
| カテゴリ・タグ | `categories` / `tags` |
| カスタムフィールド | `meta`（`kiichigo-headless` プラグイン） |
| トップ AI 文言 | `.env` の `NEXT_PUBLIC_HOME_MESSAGE` |

アイキャッチは `featured_image_url` / `_embed`。ローカルにメディアが無いときは `WP_MEDIA_FALLBACK_URL`（本番）へフォールバック。

## 静的ファイル

`asset("css/style.css")` → `/css/style.css`（Next の `public/` を同一オリジンで配信。WP テーマ URL は不要）。

| コマンド | 内容 |
|----------|------|
| `npm run build:assets` | SCSS → `public/css/style.css`、主要 JS → `*.min.js` |
| `npm run dev` | 上記ビルド後、SCSS/JS を watch しながら Next（`:1234`） |
| `npm run build` | アセットビルド → `next build` |
| `npm run sync-assets` | `llc` から `img` / `scss` のみ取り込み（任意） |

編集するのは `public/scss/` と `public/js/{script,check,player,toploading}.js`（本番参照は `*.min.js`）。

## ローカル

```bash
cd ../llc && docker compose up -d
cd web && cp .env.local.example .env.local && npm run dev
```

http://localhost:1234
