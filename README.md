# IKZL Quiz

Next.js (App Router) + Supabase で動く 10 問シングルプレイクイズのサンプル実装です。クイズ取得、スコア登録、ランキング取得を API Routes で提供し、クライアント側は shadcn/ui 風コンポーネントで構成しています。

## セットアップ

1. 環境変数を設定

```bash
cp env.d.ts .env.local # 例: 型の参考用
```

`.env.local` には少なくとも以下を定義してください。

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

2. 依存関係をインストール

```bash
npm install
```

3. 開発サーバー起動

```bash
npm run dev
```

## ディレクトリ概要

- `app/` — App Router ページと API Routes
  - `page.tsx` — トップページ
  - `quiz/page.tsx` — クイズ本編 (クライアントコンポーネント)
  - `result/page.tsx` — 結果表示・ランキング
  - `api/questions` — ランダム 10 問取得
  - `api/submit-score` — スコア登録
  - `api/leaderboard` — ランキング Top10
- `lib/` — 型定義と Supabase クライアント
- `components/` — UI・クイズ・ランキングのコンポーネント群
- `questions.sample.json` — questions テーブルへのシード例

## Supabase テーブル

- `questions`: 出題用マスタ (is_active=true の中から 10 件を抽選)
- `quiz_results`: スコア保存・ランキング用 (score desc, time asc, created_at desc)

テーブル定義はプロジェクト説明のサンプルスキーマを利用してください。
