(function () {
  const STORAGE_KEY = 'bendgamine-terms-lang';
  const DEFAULT_LANG = 'en';
  const META_URL = 'locales/meta.json';
  const LOCALE_URL = (code) => `locales/${code}.json`;

  let meta = null;
  let supported = [];
  let langMap = new Map();
  let cache = new Map();
  let currentLang = DEFAULT_LANG;

  const termsEl = document.getElementById('terms');
  const loadingEl = document.getElementById('loading');
  const selectEl = document.getElementById('lang-select');

  function resolveLang(code) {
    if (!code) return null;
    const lower = code.toLowerCase();
    if (langMap.has(lower)) return lower;
    const base = lower.split('-')[0];
    if (langMap.has(base)) return base;
    return null;
  }

  function getInitialLang() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = resolveLang(params.get('lang'));
    if (fromQuery) return fromQuery;

    const stored = resolveLang(localStorage.getItem(STORAGE_KEY));
    if (stored) return stored;

    const browser = resolveLang(navigator.language);
    return browser || DEFAULT_LANG;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function renderList(items) {
    if (!items?.length) return '';
    return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
  }

  function renderBlock(block) {
    switch (block.type) {
      case 'p':
        return `<p>${block.html ? block.text : escapeHtml(block.text)}</p>`;
      case 'ul':
        return renderList(block.items);
      case 'h3':
        return `<h3>${escapeHtml(block.text)}</h3>`;
      case 'caps':
        return `<p class="caps">${escapeHtml(block.text)}</p>`;
      default:
        return '';
    }
  }

  function renderSection(section) {
    const blocks = (section.blocks || []).map(renderBlock).join('');
    return `
      <h2>${section.num}. ${escapeHtml(section.title)}</h2>
      ${blocks}
    `;
  }

  function renderTerms(t, lang) {
    const info = langMap.get(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = info?.dir || 'ltr';
    document.title = t.pageTitle;

    const contact = t.contact;
    const contactHtml = `
      <h2>${contact.num}. ${escapeHtml(contact.title)}</h2>
      <p>${escapeHtml(contact.intro)}</p>
      <ul>
        <li>${escapeHtml(contact.emailLabel)}: <a href="mailto:${contact.email}">${escapeHtml(contact.email)}</a></li>
        <li>${escapeHtml(contact.addressLabel)}: ${escapeHtml(contact.address)}</li>
        <li>${escapeHtml(contact.supportLabel)}: <a href="mailto:${contact.support}">${escapeHtml(contact.support)}</a></li>
      </ul>
    `;

    const ack = t.acknowledgment;
    const ackHtml = `
      <h2>${ack.num}. ${escapeHtml(ack.title)}</h2>
      <p>${escapeHtml(ack.intro)}</p>
      ${renderList(ack.items)}
    `;

    termsEl.innerHTML = `
      <h1>${escapeHtml(t.title)}</h1>
      <p class="meta">
        ${escapeHtml(t.effectiveDateLabel)}: ${escapeHtml(t.effectiveDate)}<br>
        ${escapeHtml(t.lastUpdatedLabel)}: ${escapeHtml(t.lastUpdated)}<br>
        ${escapeHtml(t.versionLabel)}: ${escapeHtml(t.version)}
      </p>
      ${t.sections.map(renderSection).join('')}
      ${contactHtml}
      ${ackHtml}
      <p class="disclaimer">${escapeHtml(t.legalNotice)}</p>
    `;

    document.getElementById('footer-copy').textContent = t.footer;
  }

  async function loadLocale(lang) {
    if (cache.has(lang)) return cache.get(lang);
    const res = await fetch(LOCALE_URL(lang));
    if (!res.ok) throw new Error(`Locale not found: ${lang}`);
    const data = await res.json();
    cache.set(lang, data);
    return data;
  }

  function populateSelect() {
    selectEl.innerHTML = meta.languages
      .map(
        (l) =>
          `<option value="${l.code}"${l.code === currentLang ? ' selected' : ''}>${escapeHtml(l.name)}</option>`,
      )
      .join('');
  }

  async function setLang(lang, { updateUrl = true } = {}) {
    if (!supported.includes(lang)) return;

    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    selectEl.value = lang;

    loadingEl.hidden = false;
    termsEl.hidden = true;

    try {
      let data;
      try {
        data = await loadLocale(lang);
      } catch {
        if (lang !== DEFAULT_LANG) {
          await setLang(DEFAULT_LANG);
          return;
        }
        throw new Error(`Locale not found: ${lang}`);
      }
      renderTerms(data, lang);
      if (updateUrl) {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url);
      }
    } catch (err) {
      termsEl.innerHTML = `<p class="error">${escapeHtml(err.message)}</p>`;
    } finally {
      loadingEl.hidden = true;
      termsEl.hidden = false;
    }
  }

  async function init() {
    const metaRes = await fetch(META_URL);
    if (!metaRes.ok) throw new Error('Failed to load languages');
    meta = await metaRes.json();
    supported = meta.languages.map((l) => l.code);
    langMap = new Map(meta.languages.map((l) => [l.code, l]));

    populateSelect();
    selectEl.addEventListener('change', () => setLang(selectEl.value));

    currentLang = getInitialLang();
    await setLang(currentLang, { updateUrl: false });
    const url = new URL(window.location.href);
    if (url.searchParams.get('lang') !== currentLang) {
      url.searchParams.set('lang', currentLang);
      window.history.replaceState({}, '', url);
    }
  }

  init().catch((err) => {
    termsEl.innerHTML = `<p class="error">${escapeHtml(err.message)}</p>`;
  });
})();
