# Bendgamine — Terms of Service (GitHub Pages)

Static multilingual Terms of Service site (English / Russian) for linking from the Bendgamine app.

**Live site:** https://addeo.github.io/bendjamin-terms/

## Local preview

```bash
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080).

## Deploy (gh-pages branch)

GitHub Pages serves the **`gh-pages`** branch (root folder). Development happens on **`main`**.

After editing files on `main`, deploy:

```bash
chmod +x scripts/deploy-gh-pages.sh
./scripts/deploy-gh-pages.sh
```

One-time setup on GitHub: **Settings → Pages → Build and deployment → Deploy from a branch** → branch **`gh-pages`**, folder **`/ (root)`**.

## Link from your app

| Purpose | URL |
|--------|-----|
| English (default) | https://addeo.github.io/bendjamin-terms/ |
| Russian | https://addeo.github.io/bendjamin-terms/?lang=ru |
| English (explicit) | https://addeo.github.io/bendjamin-terms/?lang=en |

Language choice is saved in `localStorage` and restored on the next visit.

## Customize placeholders

Edit `i18n.js` on `main`, then run `./scripts/deploy-gh-pages.sh`.

- `effectiveDate` / `lastUpdated`
- `contact.address` (company address)
- Section 13 governing law (`[Jurisdiction — TBD]`)

## Files

| File | Role |
|------|------|
| `index.html` | Page shell |
| `styles.css` | Layout and typography |
| `i18n.js` | EN/RU content |
| `app.js` | Language switcher and rendering |
