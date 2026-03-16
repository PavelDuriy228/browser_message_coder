/**
 * Vernam Cipher (XOR / One-Time Pad) implementation.
 * Uses UTF-8 encoding and Base64 output for safe DOM storage.
 */

/**
 * XOR-encrypts plaintext with key, cycling the key if shorter than text.
 * @param {string} text - Plaintext to encrypt
 * @param {string} key  - Encryption key
 * @returns {string} Base64-encoded ciphertext
 */
function encrypt(text, key) {
  const encoder = new TextEncoder();
  const textBytes = encoder.encode(text);
  const keyBytes = encoder.encode(key);

  if (keyBytes.length === 0) throw new Error('Key must not be empty.');

  const cipher = new Uint8Array(textBytes.length);
  for (let i = 0; i < textBytes.length; i++) {
    cipher[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
  }

  // Convert to Base64
  let binary = '';
  for (let i = 0; i < cipher.length; i++) {
    binary += String.fromCharCode(cipher[i]);
  }
  return btoa(binary);
}

/**
 * XOR-decrypts a Base64-encoded ciphertext with the given key.
 * @param {string} base64 - Base64-encoded ciphertext
 * @param {string} key    - Decryption key (must match encryption key)
 * @returns {string} Decrypted plaintext
 */
function decrypt(base64, key) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const keyBytes = encoder.encode(key);

  if (keyBytes.length === 0) throw new Error('Key must not be empty.');

  let binary;
  try {
    binary = atob(base64);
  } catch {
    throw new Error('Invalid Base64 input — selected text may not be ciphertext.');
  }

  const cipherBytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    cipherBytes[i] = binary.charCodeAt(i);
  }

  const plain = new Uint8Array(cipherBytes.length);
  for (let i = 0; i < cipherBytes.length; i++) {
    plain[i] = cipherBytes[i] ^ keyBytes[i % keyBytes.length];
  }

  return decoder.decode(plain);
}
