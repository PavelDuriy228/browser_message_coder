/**
 * Popup script — manages key input, generation, saving, and display.
 */

const keyInput   = document.getElementById('keyInput');
const toggleShow = document.getElementById('toggleShow');
const keyLength  = document.getElementById('keyLength');
const keyWarning = document.getElementById('keyWarning');
const genSize    = document.getElementById('genSize');
const generateBtn = document.getElementById('generateBtn');
const copyBtn    = document.getElementById('copyBtn');
const saveBtn    = document.getElementById('saveBtn');
const saveStatus = document.getElementById('saveStatus');

const SHORT_KEY_THRESHOLD = 32;

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Generate a cryptographically secure random ASCII-printable key.
 * Characters are drawn from the printable ASCII range (32–126).
 * @param {number} length
 * @returns {string}
 */
function generateKey(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?';
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  return Array.from(values, v => chars[v % chars.length]).join('');
}

/** Update key-length indicator and short-key warning. */
function updateMeta() {
  const len = keyInput.value.length;
  keyLength.textContent = `Length: ${len} chars`;
  keyWarning.classList.toggle('hidden', len === 0 || len >= SHORT_KEY_THRESHOLD);
}

/** Flash the save-status confirmation label. */
function flashSaved() {
  saveStatus.classList.remove('hidden');
  setTimeout(() => saveStatus.classList.add('hidden'), 2000);
}

// ── Load stored key on open ───────────────────────────────────────────────────

(async () => {
  const { vernamKey } = await browser.storage.local.get('vernamKey');
  if (vernamKey) {
    keyInput.value = vernamKey;
    updateMeta();
  }
})();

// ── Event listeners ───────────────────────────────────────────────────────────

keyInput.addEventListener('input', updateMeta);

toggleShow.addEventListener('click', () => {
  const isHidden = keyInput.type === 'password';
  keyInput.type = isHidden ? 'text' : 'password';
  toggleShow.textContent = isHidden ? '🙈' : '👁';
});

generateBtn.addEventListener('click', () => {
  const size = Math.max(16, Math.min(4096, parseInt(genSize.value, 10) || 256));
  keyInput.value = generateKey(size);
  keyInput.type = 'text';
  toggleShow.textContent = '🙈';
  updateMeta();
});

copyBtn.addEventListener('click', async () => {
  if (!keyInput.value) return;
  await navigator.clipboard.writeText(keyInput.value);
  copyBtn.textContent = '✔ Copied';
  setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 1500);
});

saveBtn.addEventListener('click', async () => {
  const key = keyInput.value.trim();
  if (!key) return;
  await browser.storage.local.set({ vernamKey: key });
  flashSaved();
});
