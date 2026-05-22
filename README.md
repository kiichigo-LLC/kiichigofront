# kiichigo — Next.js フロント

`llc/` と同階層。HTML は Next、css/js/img は WP テーマ上のまま。

## データの取り方（標準 REST 中心）

| 用途 | API |
|------|-----|
| 投稿一覧・詳細 | `GET /wp-json/wp/v2/posts?...` |
| 固定ページ | `GET /wp-json/wp/v2/pages?slug=...` |
| カテゴリ・タグ | `GET /wp-json/wp/v2/categories` / `tags` |
| カスタムフィールド | レスポンスの `meta`（mu-plugin で公開） |
| トップ AI 文言のみ | `GET /wp-json/kiichigo/v1/home` |

カテゴリページごとの専用 API は作らない。Next の `lib/wp.ts` が同じ `getCategoryArchive('koe')` などで呼ぶ。

### mu-plugin（テーマは触らない）

- `wp-content/mu-plugins/kiichigo-headless-loader.php`
- `wp-content/plugins/kiichigo-headless/` … meta 登録 + `/home` のみ

新しい meta をテーマで使ったら、`kiichigo-headless.php` の `KIICHIGO_REST_META_KEYS` に1行足す。

ACF を入れた場合は ACF 側の REST 設定を使えばよく、このリストと併用できる。

アイキャッチは `featured_image_url` + `_embed` で取得。ローカル DB に **attachment が 0 件** のときは `.env.local` の `WP_MEDIA_FALLBACK_URL=https://kiichigo.work` から本番の画像 URL を借りる（`dev` 再起動必須）。

## ローカル

```bash
cd ../llc && docker compose up -d
cd web && cp .env.local.example .env.local && npm run dev
```

http://localhost:1234
