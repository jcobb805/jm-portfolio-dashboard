// Encrypt the source dashboard HTML with AES-256-CBC, OpenSSL/CryptoJS-compatible.
// Output is a base64 string that CryptoJS.AES.decrypt(enc, password) can decode.
//
// Run: node encrypt.js
//
// Reads:  ../OneDrive/Organizational/BSA/Franchise/JM/Scarlet Portfolio Dashboard.html
// Writes: ./dashboard.html.enc
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PASSWORD = 'JM2026!';
const SRC = path.join(
  process.env.USERPROFILE || process.env.HOME,
  'OneDrive', 'Organizational', 'BSA', 'Franchise', 'JM',
  'Scarlet Portfolio Dashboard.html'
);
const OUT = path.join(__dirname, 'dashboard.html.enc');

function encrypt(plaintext, password) {
  const salt = crypto.randomBytes(8);
  // OpenSSL EVP_BytesToKey with MD5 — matches CryptoJS.AES default
  let keyIv = Buffer.alloc(0);
  let prev = Buffer.alloc(0);
  while (keyIv.length < 48) {
    prev = crypto
      .createHash('md5')
      .update(Buffer.concat([prev, Buffer.from(password, 'utf8'), salt]))
      .digest();
    keyIv = Buffer.concat([keyIv, prev]);
  }
  const key = keyIv.slice(0, 32);
  const iv = keyIv.slice(32, 48);

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  // Output: base64("Salted__" + salt + ciphertext)
  return Buffer.concat([Buffer.from('Salted__'), salt, ct]).toString('base64');
}

const html = fs.readFileSync(SRC, 'utf8');
const enc = encrypt(html, PASSWORD);
fs.writeFileSync(OUT, enc);
console.log(`Encrypted ${(html.length / 1024).toFixed(1)} KB → ${(enc.length / 1024).toFixed(1)} KB`);
console.log(`Output: ${OUT}`);
