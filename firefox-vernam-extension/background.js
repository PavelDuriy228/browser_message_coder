/**
 * Background script — creates context menu items and dispatches messages
 * to the content script with the stored key.
 */

// ── Context menu setup ────────────────────────────────────────────────────────

browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: 'vernam-encrypt',
    title: '🔒 Encrypt with Vernam',
    contexts: ['selection'],
  });

  browser.contextMenus.create({
    id: 'vernam-decrypt',
    title: '🔓 Decrypt with Vernam',
    contexts: ['selection'],
  });
});

// ── Context menu click handler ────────────────────────────────────────────────

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!['vernam-encrypt', 'vernam-decrypt'].includes(info.menuItemId)) return;

  const action = info.menuItemId === 'vernam-encrypt' ? 'encrypt' : 'decrypt';

  const { vernamKey } = await browser.storage.local.get('vernamKey');

  if (!vernamKey) {
    await browser.tabs.sendMessage(tab.id, { action: 'noKey' });
    return;
  }

  await browser.tabs.sendMessage(tab.id, { action, key: vernamKey });
});
