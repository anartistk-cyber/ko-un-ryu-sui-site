# FLOWCLOUD 旧ブログ（WP /cms/）期限切れキャンペーン記事の noindex（2026-11-01 実施・藤津さん承認）
- 対象：投稿タイトルに「キャンペーン|クーポン|限定|円|割引|OFF|お休み|休業|営業時間|臨時|移転|オープン|セール」を含む223本（全2,444本中）。
- 方法：AIOSEO REST（/wp-json/aioseo/v1/post）で各投稿の default=false / noindex=true。タイトル・説明文は変更なし。削除はしていない。
- 結果：投稿ページに meta robots noindex が出ること、post-sitemap.xml から除外されること（2,222件）を確認。他の投稿は index のまま。
- 戻す場合：AIOSEO の投稿設定「詳細設定」で「デフォルト設定を使用」に戻す（または同APIで noindex=false）。
- 今後：古い価格を含む記事を新たに見つけたら同じ手順。Search Consoleで表示回数が多い記事は noindex 前に確認する。
