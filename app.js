(function () {
  const STORAGE_KEY = 'bendgamine-terms-lang';
  const DEFAULT_LANG = 'en';
  const SUPPORTED = ['en', 'ru'];

  function getInitialLang() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get('lang');
    if (fromQuery && SUPPORTED.includes(fromQuery)) {
      return fromQuery;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) {
      return stored;
    }
    const browser = (navigator.language || '').slice(0, 2).toLowerCase();
    return SUPPORTED.includes(browser) ? browser : DEFAULT_LANG;
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

  function renderTerms(lang) {
    const t = I18N[lang];
    if (!t) return;

    document.documentElement.lang = lang;
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

    document.getElementById('terms').innerHTML = `
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

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    localStorage.setItem(STORAGE_KEY, lang);
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    renderTerms(lang);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);
  }

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });

  setLang(getInitialLang());
})();
