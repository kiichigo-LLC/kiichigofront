# kiichigo — Next.js フロント

`llc/` と同階層。HTML は Next（`app/**/page.tsx`）、css/js/img は WP テーマ `themes/main/public/` 配下。

## 構成

| 場所 | 内容 |
|------|------|
| `app/page.tsx` など | 固定ページ |
| `app/category/koe/page.tsx` など | カテゴリ一覧 |
| `app/single/koe/page.tsx` など | 記事詳細（rewrite で `?slug=`） |
| `app/layout.tsx` | `<html>`・共通 CSS / GTM / jQuery・`Header` / `Footer`・`LayoutScripts` |
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

1. `app/category/○○/page.tsx` をコピー
2. `app/single/○○/page.tsx` をコピー
3. `next.config.ts` の `rewrites` に1行追加
4. ページ別 JS が要れば `hooks/usePageType.tsx` の `pageType()` に判定を追加

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

`NEXT_PUBLIC_THEME_URL` → 例: `http://localhost:18080/wp-content/themes/main/public`

`asset("css/style.css")` でテーマの CSS/JS/画像を読み込む。

### ローカルでフォント CORS

HTML は `:1234`、アセットは `:18080` のためフォントだけ CORS になることがある。

```bash
cd ../llc && docker compose up -d --force-recreate wordpress
```

## ローカル

```bash
cd ../llc && docker compose up -d
cd web && cp .env.local.example .env.local && npm run dev
```

http://localhost:1234
