// content.js - はてなブックマークでNGドメインを含む記事を非表示にする

/**
 * NGリストを取得してフィルタリングを実行
 */
async function filterArticles() {
  try {
    // browser.storage.localからNGリストを取得
    const result = await browser.storage.local.get('ngDomains');
    const ngDomains = result.ngDomains || [];
    
    if (ngDomains.length === 0) {
      console.log('[Hatebu Mute] NGリストが空です');
      return;
    }
    
    console.log('[Hatebu Mute] NGリスト:', ngDomains);
    
    // li.js-keyboard-selectable-item 要素をすべて抽出
    const articles = document.querySelectorAll('li.js-keyboard-selectable-item');
    console.log(`[Hatebu Mute] 記事数: ${articles.length}`);
    
    let removedCount = 0;
    
    // forEach と some を使った判定ロジック
    // Note: innerHTML.includes() を使用しているため、記事タイトルやコメント内にドメイン文字列が
    // 含まれる場合も削除される可能性があります。より正確なフィルタリングが必要な場合は、
    // article.querySelector('a.js-keyboard-openable')?.href などを使用してください。
    articles.forEach((article) => {
      const innerHTML = article.innerHTML;
      
      // NGリストの文字列が含まれているかチェック
      const shouldRemove = ngDomains.some((domain) => {
        return innerHTML.includes(domain);
      });
      
      if (shouldRemove) {
        article.remove();
        removedCount++;
      }
    });
    
    console.log(`[Hatebu Mute] ${removedCount}件の記事を非表示にしました`);
  } catch (error) {
    console.error('[Hatebu Mute] エラー:', error);
  }
}

// ページ読み込み時にフィルタリング実行
filterArticles();

// ポップアップからのメッセージを受信してフィルタリングを再実行
browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'refilter') {
    console.log('[Hatebu Mute] 再フィルタリング実行');
    filterArticles();
  }
});
