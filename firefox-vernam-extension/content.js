/**
 * Content script — handles in-page text replacement for encrypt/decrypt actions.
 * Loaded after crypto/vernam.js so encrypt() / decrypt() are available.
 */

/**
 * Show a brief non-intrusive toast notification on the page.
 * @param {string} message
 * @param {'info'|'error'} type
 */
function showToast(message, type = 'info') {
  const existing = document.getElementById('vernam-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'vernam-toast';
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: '2147483647',
    padding: '10px 18px',
    borderRadius: '6px',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '14px',
    color: '#fff',
    background: type === 'error' ? '#c0392b' : '#2c3e50',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    transition: 'opacity 0.4s',
    opacity: '1',
    maxWidth: '360px',
    wordBreak: 'break-word',
  });

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/**
 * Replace the currently selected text in the DOM with newText.
 * Handles: plain nodes, contenteditable, input, textarea.
 * @param {string} newText
 * @returns {boolean} success
 */
function replaceSelection(newText) {
  const active = document.activeElement;
  const tag = active ? active.tagName : '';

  // Input / textarea: use execCommand for undo support
  if (tag === 'INPUT' || tag === 'TEXTAREA') {
    const start = active.selectionStart;
    const end = active.selectionEnd;
    if (start === end) return false;
    active.setRangeText(newText, start, end, 'end');
    active.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  }

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return false;

  const range = sel.getRangeAt(0);

  // Contenteditable: execCommand keeps undo history
  if (active && active.isContentEditable) {
    sel.removeAllRanges();
    sel.addRange(range);
    document.execCommand('insertText', false, newText);
    return true;
  }

  // Plain DOM
  range.deleteContents();
  range.insertNode(document.createTextNode(newText));
  sel.removeAllRanges();
  return true;
}

/**
 * Get currently selected text.
 * @returns {string}
 */
function getSelectedText() {
  const active = document.activeElement;
  const tag = active ? active.tagName : '';

  if (tag === 'INPUT' || tag === 'TEXTAREA') {
    return active.value.slice(active.selectionStart, active.selectionEnd);
  }

  return window.getSelection()?.toString() ?? '';
}

// ── Message listener ──────────────────────────────────────────────────────────

browser.runtime.onMessage.addListener((message) => {
  const { action, key } = message;

  if (action === 'noKey') {
    showToast('⚠️ No key set. Open the Vernam Cipher popup to add a key.', 'error');
    return;
  }

  const selected = getSelectedText();

  if (!selected) {
    showToast('No text selected.', 'error');
    return;
  }

  try {
    if (action === 'encrypt') {
      // Warn if key is shorter than selected text bytes
      const textLen = new TextEncoder().encode(selected).length;
      const keyLen = new TextEncoder().encode(key).length;
      const result = encrypt(selected, key);
      replaceSelection(result);
      if (keyLen < textLen) {
        showToast('⚠️ Key shorter than message — key was cycled, weakening security.');
      } else {
        showToast('🔒 Text encrypted.');
      }
    } else if (action === 'decrypt') {
      const result = decrypt(selected, key);
      replaceSelection(result);
      showToast('🔓 Text decrypted.');
    }
  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  }
});
