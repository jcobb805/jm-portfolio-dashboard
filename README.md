# Scarlet Portfolio Dashboard (Private)

Password-gated, AES-encrypted dashboard hosted via GitHub Pages.

- `index.html` — public password gate (loads CryptoJS, prompts for password, decrypts and renders)
- `dashboard.html.enc` — AES-256-CBC encrypted dashboard HTML (OpenSSL/CryptoJS-compatible)
- `encrypt.js` — Node script that re-encrypts from the source build

## Update workflow

1. Edit + rebuild dashboard in `../jm-portfolio-analysis/`
2. From this directory: `node encrypt.js`
3. `git add -A && git commit -m "update" && git push`
