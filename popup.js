// popup.js - ポップアップUIのロジック

const ngDomainsTextarea = document.getElementById('ngDomains');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const statusDiv = document.getElementById('status');

/**
 * ステータスメッセージを表示
 */
function showStatus(message, isSuccess = true) {
  statusDiv.textContent = message;
  statusDiv.className = 'status ' + (isSuccess ? 'success' : 'error');
  statusDiv.style.display = 'block';
  
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 3000);
}

/**
 * NGリストをストレージから読み込む
 */
async function loadNgDomains() {
  try {
    const result = await browser.storage.local.get('ngDomains');
    const ngDomains = result.ngDomains || [];
    ngDomainsTextarea.value = ngDomains.join('\n');
  } catch (error) {
    console.error('NGリストの読み込みエラー:', error);
    showStatus('読み込みに失敗しました', false);
  }
}

/**
 * NGリストをストレージに保存
 */
async function saveNgDomains() {
  try {
    const text = ngDomainsTextarea.value;
    // 改行で分割し、空行を除去、トリミング
    const ngDomains = text
      .split('\n')
      .map(domain => domain.trim())
      .filter(domain => domain.length > 0);
    
    // browser.storage.localに保存
    await browser.storage.local.set({ ngDomains });
    
    console.log('NGリストを保存しました:', ngDomains);
    showStatus(`✓ 保存しました (${ngDomains.length}件のドメイン)`, true);
    
    // 開いているはてなブックマークのタブに再フィルタリングを指示
    await notifyTabs();
  } catch (error) {
    console.error('NGリストの保存エラー:', error);
    showStatus('保存に失敗しました', false);
  }
}

/**
 * NGリストをクリア
 */
async function clearNgDomains() {
  if (!confirm('NGリストをすべてクリアしてもよろしいですか？')) {
    return;
  }
  
  try {
    await browser.storage.local.set({ ngDomains: [] });
    ngDomainsTextarea.value = '';
    showStatus('✓ クリアしました', true);
    
    // 開いているタブに再フィルタリングを指示
    await notifyTabs();
  } catch (error) {
    console.error('NGリストのクリアエラー:', error);
    showStatus('クリアに失敗しました', false);
  }
}

/**
 * 開いているはてなブックマークのタブにメッセージを送信
 */
async function notifyTabs() {
  try {
    // すべてのタブを取得
    const tabs = await browser.tabs.query({
      url: 'https://b.hatena.ne.jp/*'
    });
    
    console.log(`${tabs.length}個のはてなブックマークタブに再フィルタリングを指示`);
    
    // 各タブにメッセージを送信
    for (const tab of tabs) {
      try {
        await browser.tabs.sendMessage(tab.id, { action: 'refilter' });
      } catch (error) {
        // タブがまだ読み込まれていない場合などはエラーを無視
        console.warn(`タブ ${tab.id} へのメッセージ送信失敗:`, error);
      }
    }
  } catch (error) {
    console.error('タブへの通知エラー:', error);
  }
}

// イベントリスナーの設定
saveBtn.addEventListener('click', saveNgDomains);
clearBtn.addEventListener('click', clearNgDomains);

// Ctrl+Enter または Cmd+Enter で保存
ngDomainsTextarea.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    saveNgDomains();
  }
});

// ポップアップ表示時にNGリストを読み込む
loadNgDomains();
