# はてブ・ミュート (Hatebu Mute Extension)

Web版のはてなブックマークで特定のドメインを含む記事を非表示にするFirefox向けの拡張機能（Manifest V3対応）

## 概要

はてなブックマーク（`https://b.hatena.ne.jp/*`）で、指定したドメインを含む記事を自動的に非表示にします。
- Firefox Manifest V3 完全対応
- リアルタイムフィルタリング（ページリロード不要）
- シンプルで使いやすいUI

## 機能

- ✅ NGドメインリストの管理（追加・削除・クリア）
- ✅ `browser.storage.local` による永続化
- ✅ リアルタイム反映（保存時に開いているタブへ即座に適用）
- ✅ `li.js-keyboard-selectable-item` 要素の自動フィルタリング

## ファイル構成

```
hatebu-mute-extension/
├── manifest.json       # 拡張機能の設定ファイル
├── content.js          # フィルタリングロジック（コンテンツスクリプト）
├── popup.html          # ポップアップUI
├── popup.js            # ポップアップロジック
├── icon48.png          # アイコン（48x48）
└── README.md           # このファイル
```

## インストール方法（Firefox）

### 方法1: 一時的なインストール（開発・テスト用）

1. Firefoxで `about:debugging` を開く
2. 左メニューから「This Firefox」を選択
3. 「Load Temporary Add-on...」ボタンをクリック
4. このフォルダ内の `manifest.json` を選択

**注意**: この方法でインストールした拡張機能は、Firefoxを再起動すると削除されます。

### 方法2: 署名付きインストール（本番用）

Firefox Add-ons（AMO）で公開するか、自己署名する必要があります。
詳細: https://extensionworkshop.com/documentation/publish/

## 使い方

1. **拡張機能をインストール**
   - 上記の手順でインストールしてください

2. **NGドメインを追加**
   - Firefoxのツールバーにある拡張機能アイコンをクリック
   - テキストエリアにNGドメインを1行ごとに入力（例: `qiita.com`）
   - 「保存」ボタンをクリック

3. **はてなブックマークを閲覧**
   - `https://b.hatena.ne.jp/` にアクセス
   - NGドメインを含む記事が自動的に非表示になります

4. **即時反映**
   - NGリストを変更して保存すると、開いているタブに即座に反映されます
   - ページのリロードは不要です

## 技術仕様

### Manifest V3対応
- `manifest_version: 3`
- `browser_specific_settings` による Firefox 固有設定
- `gecko.id`: `hatebu-mute-extension@example.com`

### 権限
- `storage`: NGリストの保存
- `activeTab`: アクティブなタブへのアクセス
- `host_permissions`: `https://b.hatena.ne.jp/*`

### フィルタリングロジック
```javascript
// content.js のコアロジック
articles.forEach((article) => {
  const innerHTML = article.innerHTML;
  const shouldRemove = ngDomains.some((domain) => {
    return innerHTML.includes(domain);
  });
  if (shouldRemove) {
    article.remove();
  }
});
```

## 開発情報

### コンテンツスクリプト (`content.js`)
- `document_idle` で実行
- `browser.storage.local` からNGリストを取得
- `li.js-keyboard-selectable-item` を抽出してフィルタリング
- `browser.runtime.onMessage` でリアルタイム更新に対応

### ポップアップ (`popup.html` / `popup.js`)
- シンプルなテキストエリア形式のUI
- 保存時に `browser.tabs.query` で対象タブを検索
- `browser.tabs.sendMessage` でメッセージ送信

## ライセンス

MIT License - 詳細は LICENSE ファイルを参照してください。

## トラブルシューティング

### 拡張機能が動作しない
- `about:debugging` で拡張機能が有効になっているか確認
- ブラウザコンソール（F12）でエラーがないか確認
- Firefox のバージョンが 109.0 以上であることを確認

### フィルタリングが効かない
- NGドメインが正しく入力されているか確認（http:// などは不要）
- はてなブックマークのページ構造が変更されていないか確認
- ブラウザコンソールで `[Hatebu Mute]` のログを確認

### 保存が反映されない
- ストレージの権限が有効になっているか確認
- ポップアップのステータスメッセージを確認
- ブラウザを再起動してみる

## 貢献

バグ報告や機能追加のリクエストは、GitHubのIssuesまでお願いします。
