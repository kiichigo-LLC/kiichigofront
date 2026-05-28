# kiichigo — Next.js フロント

`llc/` と同階層。HTML の型（レイアウト・ヘッダー等）は Next、**記事・一覧の中身はブラウザが WP REST API から取得**（jsrender 的な動き）。css/js/img は WP テーマ `themes/main/public/` 配下。

## 構成

| 場所 | 内容 |
|------|------|
| `app/page.tsx` など | 固定ページ（ビルド時に HTML 化） |
| `app/koe/page.tsx` など | カテゴリ一覧（クライアントで JSON 取得） |
| `app/koe/entry/page.tsx` など | 記事詳細の枠（`/koe/スラッグ` は entry + `.htaccess`） |
| `components/wp/*-views.tsx` | 一覧・記事の描画（`fetch` → WP） |
| `lib/wp-client.ts` | ブラウザ用 API |
| `public/.htaccess` | 本番: 記事 URL を `entry.html` へ（ロリポップ等） |

`tsconfig` の `paths`: `@components/*` `@hooks/*` `utils/*`

### カテゴリを増やすとき

1. `components/wp/○○-views.tsx`（一覧・entry 用ビュー）
2. `app/○○/page.tsx` と `app/○○/entry/page.tsx`
3. `next.config.ts` の `rewrites` と `public/.htaccess` にルール追加
4. `hooks/usePageType.tsx` に判定を追加

## データ

| 用途 | API |
|------|-----|
| 投稿・タグ等 | `GET /wp-json/wp/v2/...`（**閲覧時にブラウザから**） |
| カスタムフィールド | `meta`（`kiichigo-headless` プラグイン） |
| CORS | 同プラグイン（`kiichigo.work` / localhost） |

`.env.local` の例:

- `NEXT_PUBLIC_WP_API_URL` … 投稿 JSON（ローカルなら `http://localhost:18080/wp-json/wp/v2`）
- `NEXT_PUBLIC_WP_MEDIA_FALLBACK_URL` … **アイキャッチ用**（`https://wp.kiichigo.work`）
- ローカル `npm run dev` では `/wp-media-proxy` 経由で本番メディアを取得（CORS 回避。`next.config.ts` の rewrite）

ブラウザからは `WP_API_URL` だけでは読めません（`NEXT_PUBLIC_` 必須）。

本番（`kiichigo.work` → `wp.kiichigo.work`）は WP 側 CORS（`kiichigo-headless` プラグイン）が必要です。

## 静的ファイル

`NEXT_PUBLIC_THEME_URL` → 例: `http://localhost:18080/wp-content/themes/main/public`

## ビルド・本番

```bash
cd web
npm run build   # → out/（記事の中身は含まない。枠だけ）
```

サブディレクトリ公開（例: `https://utageda.main.jp/kiichigofront`）では `.env` に `NEXT_PUBLIC_BASE_PATH=/kiichigofront` を設定。

本番ビルドは `.env.local` を一時無効化するため、次を推奨:

```bash
npm run build:prod
```

`out/` をドキュメントルートへアップロード。**WP で記事を直しただけなら再ビルド不要**（JSON が変われば画面が変わる）。

- フロントの TSX / デザイン変更時だけ再 `build` + アップロード
- `public/.htaccess` が `out/` にコピーされる（記事 URL 用）
- タグ 2 ページ目以降: `/tag/スラッグ/page/2`

```bash
npm run start   # out/ を :1235 で確認
```

## ローカル開発

```bash
cd ../llc && docker compose up -d
cd web && npm run dev
```

http://localhost:1234 — 記事 URL は `next.config.ts` の `rewrites` で entry に渡す。
