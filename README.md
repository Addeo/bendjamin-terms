# Bendgamine — Terms of Service (GitHub Pages)

Static multilingual Terms of Service site for linking from the Bendgamine app.

**Live site:** https://addeo.github.io/bendjamin-terms/

## Languages (20)

English, 中文, Español, हिन्दी, العربية, Português, Français, Русский, 日本語, Deutsch, 한국어, Italiano, Türkçe, Tiếng Việt, Polski, Українська, Nederlands, Bahasa Indonesia, ไทย, বাংলা

Use `?lang=xx` in the URL (e.g. `?lang=ru`, `?lang=zh`, `?lang=ar`).

## Local preview

```bash
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080).

## Deploy (gh-pages branch)

Development on **`main`**, production on **`gh-pages`** (root folder only).

```bash
./scripts/deploy-gh-pages.sh
```

GitHub: **Settings → Pages → Deploy from a branch → `gh-pages` → `/ (root)`**.

## Edit content

1. Edit `locales/en.json` (source of truth).
2. Regenerate other languages:

```bash
pip install deep-translator
python3 scripts/generate-locales.py
```

3. Review `locales/ru.json` manually if needed (kept as human translation).
4. Deploy with `./scripts/deploy-gh-pages.sh`.

## App links

| Language | URL |
|----------|-----|
| English | https://addeo.github.io/bendjamin-terms/ |
| Russian | https://addeo.github.io/bendjamin-terms/?lang=ru |
| Chinese | https://addeo.github.io/bendjamin-terms/?lang=zh |
| Arabic | https://addeo.github.io/bendjamin-terms/?lang=ar |

## Structure

| Path | Role |
|------|------|
| `locales/en.json` | English content |
| `locales/*.json` | Translations |
| `locales/meta.json` | Language list and RTL flags |
| `app.js` | Language selector and rendering |
| `scripts/deploy-gh-pages.sh` | Publish to `gh-pages` |
