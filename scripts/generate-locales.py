#!/usr/bin/env python3
"""Generate locale JSON files from locales/en.json (batched translation)."""

from __future__ import annotations

import json
import re
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LOCALES = ROOT / 'locales'
BATCH_SIZE = 40

LANGUAGES = {
    'zh': 'zh-CN',
    'es': 'es',
    'hi': 'hi',
    'ar': 'ar',
    'pt': 'pt',
    'fr': 'fr',
    'ja': 'ja',
    'de': 'de',
    'ko': 'ko',
    'it': 'it',
    'tr': 'tr',
    'vi': 'vi',
    'pl': 'pl',
    'uk': 'uk',
    'nl': 'nl',
    'id': 'id',
    'th': 'th',
    'bn': 'bn',
}

SKIP = re.compile(
    r'^(legal@bendgamine\.com|supp0rt\.serg@yandex\.com|\[.*\]|1\.0)$',
    re.IGNORECASE,
)


def collect_strings(obj, path=()):
    items = []
    if isinstance(obj, str):
        items.append((path, obj))
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            items.extend(collect_strings(v, path + (i,)))
    elif isinstance(obj, dict):
        for k, v in obj.items():
            items.extend(collect_strings(v, path + (k,)))
    return items


def set_at_path(obj, path, value):
    cur = obj
    for key in path[:-1]:
        cur = cur[key]
    cur[path[-1]] = value


def should_skip(text: str) -> bool:
    if not text or not text.strip():
        return True
    if SKIP.match(text.strip()):
        return True
    if 'bendgamine.com' in text.lower():
        return True
    if text.strip() in ('1.0',):
        return True
    return False


def translate_batch(texts: list[str], google_code: str) -> list[str]:
    from deep_translator import GoogleTranslator

    translator = GoogleTranslator(source='en', target=google_code)
    out = []
    for i in range(0, len(texts), BATCH_SIZE):
        chunk = texts[i : i + BATCH_SIZE]
        try:
            out.extend(translator.translate_batch(chunk))
        except Exception:
            for t in chunk:
                try:
                    out.append(translator.translate(t))
                except Exception:
                    out.append(t)
                time.sleep(0.05)
        time.sleep(0.2)
    return out


def build_locale(en: dict, code: str, google_code: str) -> dict:
    data = json.loads(json.dumps(en))
    entries = collect_strings(data)
    to_translate = []
    indices = []

    for idx, (path, text) in enumerate(entries):
        if should_skip(text):
            continue
        to_translate.append(text)
        indices.append(idx)

    if to_translate:
        translated = translate_batch(to_translate, google_code)
        for i, tr in zip(indices, translated):
            path, _ = entries[i]
            set_at_path(data, path, tr)

    return data


def main() -> None:
    try:
        from deep_translator import GoogleTranslator  # noqa: F401
    except ImportError:
        raise SystemExit('Install: pip install deep-translator') from None

    en = json.loads((LOCALES / 'en.json').read_text(encoding='utf-8'))

    for code, google_code in LANGUAGES.items():
        out = LOCALES / f'{code}.json'
        if out.exists() and out.stat().st_size > 8000:
            print(f'skip {code}')
            continue
        print(f'{code}...', flush=True)
        locale = build_locale(en, code, google_code)
        out.write_text(json.dumps(locale, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

    print('done')


if __name__ == '__main__':
    main()
