# Bendgamine — Terms of Service (GitHub Pages)

Static multilingual Terms of Service site (English / Russian) for linking from the Bendgamine app.

## Local preview

```bash
cd bendjamin-terms
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080).

## Deploy to GitHub Pages

1. Create a repository on GitHub (e.g. `bendjamin-terms`).
2. Push this folder:

```bash
git init
git add .
git commit -m "Add multilingual Terms of Service site"
git branch -M main
git remote add origin git@github.com:YOUR_USER/bendjamin-terms.git
git push -u origin main
```

3. On GitHub: **Settings → Pages → Build and deployment → Source**: deploy from branch **main**, folder **/ (root)**.
4. After a minute, the site is live at:

`https://YOUR_USER.github.io/bendjamin-terms/`

## Link from your app

| Purpose | URL |
|--------|-----|
| English (default) | `https://YOUR_USER.github.io/bendjamin-terms/` |
| Russian | `https://YOUR_USER.github.io/bendjamin-terms/?lang=ru` |
| English (explicit) | `https://YOUR_USER.github.io/bendjamin-terms/?lang=en` |

Language choice is saved in `localStorage` and restored on the next visit.

## Customize placeholders

Edit `i18n.js` and update:

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
