# Vernam Cipher — Firefox Extension

A Firefox extension for encrypting and decrypting selected text directly in the browser using the **Vernam cipher (One-Time Pad / XOR)**.

---

## English

### Installation

1. Open Firefox and navigate to `about:debugging`.
2. Click **"This Firefox"** in the left sidebar.
3. Click **"Load Temporary Add-on…"**.
4. Select the file `firefox-vernam-extension/manifest.json`.
5. The Vernam Cipher icon will appear in the Firefox toolbar.

> **Note:** Temporary add-ons are removed when Firefox is closed. For persistent installation, the extension must be signed by Mozilla or loaded via Firefox Developer Edition / Nightly with `xpinstall.signatures.required` set to `false` in `about:config`.

### Setting Up a Key

1. Click the **🔐 Vernam Cipher** icon in the toolbar to open the popup.
2. Either:
   - Type or paste your own key into the input field, or
   - Set the desired key length in the **"Key size"** field and click **⚡ Generate key** to create a cryptographically secure random key.
3. Click **💾 Save key**. The key is stored locally in browser storage.
4. Use **📋 Copy** to copy the key and share it with the person you are communicating with — they must use the **same key** to decrypt your messages.

### Encrypting Text

1. Select any text on a webpage (in a regular paragraph, a `contenteditable` field such as Telegram Web or Gmail, or a text input/textarea).
2. Right-click the selection.
3. Choose **🔒 Encrypt with Vernam**.
4. The selected text is immediately replaced with Base64-encoded ciphertext.

### Decrypting Text

1. Select the ciphertext on the page.
2. Right-click the selection.
3. Choose **🔓 Decrypt with Vernam**.
4. The ciphertext is replaced with the original plaintext.

### Security Notes

- The One-Time Pad is **perfectly secure** only when the key is:
  - Truly random,
  - Used **only once**,
  - At least as long as the message.
- If your key is shorter than the message, the key is cycled (repeated), which **weakens security**. The extension will warn you when this happens.
- Never reuse a key for multiple messages.
- Keep the key secret and share it only through a secure channel.

### Encrypt → Decrypt Roundtrip Test

1. Open any webpage (e.g., `about:newtab`).
2. Select a word or sentence on the page.
3. Right-click → **🔒 Encrypt with Vernam** — the text becomes Base64 ciphertext.
4. Select the ciphertext.
5. Right-click → **🔓 Decrypt with Vernam** — original text is restored.

---

## Русский

### Установка

1. Откройте Firefox и перейдите по адресу `about:debugging`.
2. В левой панели нажмите **«This Firefox»**.
3. Нажмите **«Load Temporary Add-on…»** («Загрузить временное дополнение…»).
4. Выберите файл `firefox-vernam-extension/manifest.json`.
5. Значок **Vernam Cipher** появится на панели инструментов Firefox.

> **Примечание:** Временные дополнения удаляются при закрытии Firefox. Для постоянной установки расширение должно быть подписано Mozilla, либо загружено через Firefox Developer Edition / Nightly с параметром `xpinstall.signatures.required = false` в `about:config`.

### Настройка ключа

1. Нажмите значок **🔐 Vernam Cipher** на панели инструментов, чтобы открыть попап.
2. Введите ключ вручную или:
   - Укажите желаемую длину ключа в поле **«Key size»** и нажмите **⚡ Generate key** — будет создан криптографически стойкий случайный ключ.
3. Нажмите **💾 Save key** — ключ сохранится в локальном хранилище браузера.
4. Нажмите **📋 Copy**, чтобы скопировать ключ и передать его собеседнику — для расшифровки необходимо использовать **тот же самый ключ**.

### Шифрование текста

1. Выделите любой текст на странице (в обычном абзаце, в поле `contenteditable` — например, в Telegram Web или Gmail, — или в поле ввода `<input>`/`<textarea>`).
2. Нажмите правую кнопку мыши.
3. Выберите **🔒 Encrypt with Vernam**.
4. Выделенный текст будет немедленно заменён зашифрованным текстом в кодировке Base64.

### Расшифрование текста

1. Выделите зашифрованный текст на странице.
2. Нажмите правую кнопку мыши.
3. Выберите **🔓 Decrypt with Vernam**.
4. Шифротекст будет заменён исходным текстом.

### Замечания по безопасности

- Шифр Вернама (One-Time Pad) является **абсолютно стойким** только при соблюдении трёх условий:
  - Ключ является **истинно случайным**,
  - Ключ используется **только один раз**,
  - Длина ключа **не меньше** длины сообщения.
- Если ключ короче сообщения, он циклически повторяется, что **снижает криптостойкость**. Расширение предупредит вас об этом.
- Никогда не используйте один и тот же ключ для нескольких сообщений.
- Храните ключ в тайне и передавайте его собеседнику только по защищённому каналу.

### Проверка шифрования и расшифрования

1. Откройте любую веб-страницу (например, `about:newtab`).
2. Выделите слово или предложение.
3. Правый клик → **🔒 Encrypt with Vernam** — текст превратится в Base64-шифротекст.
4. Выделите шифротекст.
5. Правый клик → **🔓 Decrypt with Vernam** — исходный текст восстановится.
