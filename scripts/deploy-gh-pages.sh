#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SITE_FILES=(index.html styles.css app.js .nojekyll)
SITE_DIRS=(locales)
MAIN_BRANCH="$(git branch --show-current)"

git fetch origin

if git show-ref --verify --quiet refs/heads/gh-pages; then
  git checkout gh-pages
  git rm -rf . 2>/dev/null || true
else
  git checkout --orphan gh-pages
  git rm -rf . 2>/dev/null || true
fi

for file in "${SITE_FILES[@]}"; do
  git checkout "$MAIN_BRANCH" -- "$file"
done

for dir in "${SITE_DIRS[@]}"; do
  git checkout "$MAIN_BRANCH" -- "$dir"
done

git add "${SITE_FILES[@]}" "${SITE_DIRS[@]}"
git diff --staged --quiet && echo 'No changes to deploy.' || git commit -m "Deploy static site ($(date -u +%Y-%m-%dT%H:%M:%SZ))"

git -c core.hooksPath=/dev/null push -f origin gh-pages
git checkout "$MAIN_BRANCH"

echo 'Deployed to gh-pages branch.'
