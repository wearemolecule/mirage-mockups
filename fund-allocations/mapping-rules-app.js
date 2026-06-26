// ─── Mapping rules data ───────────────────────────────────────────────────────
const COLORS = ['var(--c0)','var(--c1)','var(--c2)','var(--c3)'];

const BOOK_RULES = {
  '#GH5600': [
    { fcm:'Morgan Stanley', acctNum:'MS-5758778',  target:.30, ci:0, status:'active',  effectiveFrom:'Jan 1, 2026' },
    { fcm:'JP Morgan',      acctNum:'JPM-568767',  target:.30, ci:1, status:'active',  effectiveFrom:'Jan 1, 2026' },
    { fcm:'Goldman Sachs',  acctNum:'GS-456456',   target:.40, ci:2, status:'active',  effectiveFrom:'Jan 1, 2026' },
    { fcm:'Morgan Stanley', acctNum:'MS-5758778',  target:.25, ci:0, status:'retired', effectiveFrom:'Jul 1, 2025', effectiveTo:'Dec 31, 2025' },
  ],
  '#GH5601': [
    { fcm:'Morgan Stanley', acctNum:'MS-5758778',  target:.50, ci:0, status:'active', effectiveFrom:'Jan 1, 2026' },
    { fcm:'Goldman Sachs',  acctNum:'GS-456456',   target:.50, ci:2, status:'active', effectiveFrom:'Jan 1, 2026' },
  ],
  '#GH5603': [
    { fcm:'Citadel Securities', acctNum:'CIT-88234',  target:.45, ci:0, status:'active', effectiveFrom:'Jan 1, 2026' },
    { fcm:'Barclays',           acctNum:'BAR-44512',  target:.35, ci:1, status:'active', effectiveFrom:'Jan 1, 2026' },
    { fcm:'Morgan Stanley',     acctNum:'MS-5758778', target:.20, ci:2, status:'active', effectiveFrom:'Jan 1, 2026' },
  ],
};

// Read-only AUM / ticker leverage (drives NAV-weighted cards; edit on Allocation settings → AUM & Ratios tab)
const AUM_DATA = {
  'MS-5758778': { client: 'Apex Capital Management',  fcm: 'Morgan Stanley', aum: 450, asOf: 'Mar 1, 2026', updatedBy: 'J. Smith' },
  'JPM-568767': { client: 'Meridian Asset Partners',  fcm: 'JP Morgan',      aum: 360, asOf: 'Mar 1, 2026', updatedBy: 'J. Smith' },
  'GS-456456':  { client: 'Clearwater Fund Ltd.',     fcm: 'Goldman Sachs',  aum: 600, asOf: 'Mar 1, 2026', updatedBy: 'A. Chen'  },
  'CIT-88234':  { client: 'Bravo Alpha Capital LLC',  fcm: 'Citadel Securities', aum: 520, asOf: 'Mar 1, 2026', updatedBy: 'R. Gupta' },
  'BAR-44512':  { client: 'Thornfield Asset Mgmt',    fcm: 'Barclays',       aum: 380, asOf: 'Mar 1, 2026', updatedBy: 'R. Gupta' },
};

const AUM_BOOKS = {
  energy: { bookName: '#GH5600', bodyId: 'aum-body-energy', totalAumId: 'aum-total-aum-energy', totalWtdId: 'aum-total-wtd-energy' },
  gas:    { bookName: '#GH5601', bodyId: 'aum-body-gas', totalAumId: 'aum-total-aum-gas', totalWtdId: 'aum-total-wtd-gas' },
  crude:  { bookName: '#GH5603', bodyId: 'aum-body-crude', totalAumId: 'aum-total-aum-crude', totalWtdId: 'aum-total-wtd-crude' },
};

const TICKER_LEV_DATA = {
  energy: {
    tickers: [
      { symbol:'NG',  name:'Natural Gas',   lev:{ 'MS-5758778':1.2, 'JPM-568767':1.0, 'GS-456456':1.5 } },
      { symbol:'WTI', name:'WTI Crude Oil', lev:{ 'MS-5758778':1.0, 'JPM-568767':1.2, 'GS-456456':1.0 } },
      { symbol:'BRENT', name:'Brent Crude', lev:{ 'MS-5758778':1.1, 'JPM-568767':1.05, 'GS-456456':1.15 } },
      { symbol:'RB',  name:'RBOB Gasoline', lev:{ 'MS-5758778':1.0, 'JPM-568767':1.0, 'GS-456456':1.1 } },
      { symbol:'HO',  name:'Heating Oil',   lev:{ 'MS-5758778':0.95, 'JPM-568767':1.0, 'GS-456456':1.0 } },
      { symbol:'ETH', name:'Ethanol',       lev:{ 'MS-5758778':1.0, 'JPM-568767':1.0, 'GS-456456':1.0 } },
      { symbol:'PROP', name:'Propane',      lev:{ 'MS-5758778':1.2, 'JPM-568767':1.0, 'GS-456456':1.0 } },
    ],
    default: { 'MS-5758778':1.0, 'JPM-568767':1.0, 'GS-456456':1.0 },
  },
  gas: {
    tickers: [
      { symbol:'HH',  name:'Henry Hub',     lev:{ 'MS-5758778':1.5, 'GS-456456':1.0 } },
      { symbol:'NGW', name:'NG Weeklies',   lev:{ 'MS-5758778':1.0, 'GS-456456':1.1 } },
      { symbol:'TTF', name:'TTF Nat Gas',   lev:{ 'MS-5758778':0.9, 'GS-456456':1.2 } },
    ],
    default: { 'MS-5758778':1.0, 'GS-456456':1.0 },
  },
  crude: {
    tickers: [
      { symbol:'WTI', name:'WTI Crude Oil', lev:{ 'CIT-88234':1.2, 'BAR-44512':1.0, 'MS-5758778':0.8 } },
      { symbol:'CL',  name:'Crude Light',   lev:{ 'CIT-88234':1.0, 'BAR-44512':1.0, 'MS-5758778':1.0 } },
      { symbol:'DUB', name:'Dubai Swap',    lev:{ 'CIT-88234':1.1, 'BAR-44512':1.0, 'MS-5758778':0.95 } },
      { symbol:'ARA', name:'ARA Gasoil',    lev:{ 'CIT-88234':1.0, 'BAR-44512':1.05, 'MS-5758778':1.0 } },
      { symbol:'BRN', name:'Brent Cash',    lev:{ 'CIT-88234':1.15, 'BAR-44512':1.0, 'MS-5758778':1.0 } },
    ],
    default: { 'CIT-88234':1.0, 'BAR-44512':1.0, 'MS-5758778':1.0 },
  },
};

/** Book-level leverage multipliers (AUM page summary tables); keys acctNum + '|' + bookKey */
const LEVERAGE_DATA = {
  'MS-5758778|energy': 0.80,
  'JPM-568767|energy': 1.00,
  'GS-456456|energy': 0.80,
  'MS-5758778|gas': 0.500,
  'GS-456456|gas': 0.375,
};

const BOOK_LEV_KEY = { '#GH5600':'energy', '#GH5601':'gas', '#GH5603':'crude' };

/** Per-account lev from a row object; 0 is valid (avoid `|| 1`). */
function faAumLevAt(levRow, acct) {
  if (!levRow) return 1;
  const raw = levRow[acct];
  if (raw != null && raw !== '') {
    const n = Number(raw);
    if (Number.isFinite(n)) return n;
  }
  return 1;
}

/** Scope line next to book title — same labels as Main / AUM */
const BOOK_SCOPE_SUBTITLE = {
  '#GH5600': 'Natural Gas / WTI',
  '#GH5601': 'Henry Hub',
  '#GH5603': 'WTI Crude Oil',
};

function computeTickerSplit(bookKey, tickerSym) {
  const cfg  = TICKER_LEV_DATA[bookKey];
  const book = AUM_BOOKS[bookKey];
  if (!cfg || !book) return null;
  const rules = (BOOK_RULES[book.bookName] || []).filter(r => r.status === 'active');
  const levRow = cfg.tickers.find(t => t.symbol === tickerSym)?.lev ?? cfg.default;
  const total  = rules.reduce((s, r) => s + (AUM_DATA[r.acctNum]?.aum || 0) * faAumLevAt(levRow, r.acctNum), 0);
  if (!total) return null;
  const out = {};
  rules.forEach(r => { out[r.acctNum] = (AUM_DATA[r.acctNum]?.aum || 0) * faAumLevAt(levRow, r.acctNum) / total; });
  return out;
}

let nextBookRef = 5604;

function faBookCardDisplayTitle(name) {
  return String(name ?? '').trim().replace(/^\(+/, '').replace(/\)+$/, '');
}

// ─── Filters ──────────────────────────────────────────────────────────────────
function syncMappingBookFilterOptions() {
  const sel = document.getElementById('mapping-book-filter');
  if (!sel) return;
  const prev = sel.value;
  const names = Object.keys(BOOK_RULES).sort();
  sel.innerHTML = '<option value="">All Books</option>' +
    names.map(name =>
      `<option value="${name.replace(/"/g, '&quot;')}">${name}</option>`
    ).join('');
  if (prev && Object.prototype.hasOwnProperty.call(BOOK_RULES, prev)) sel.value = prev;
}

function getMappingFilterState() {
  const bookVal = document.getElementById('mapping-book-filter')?.value || '';
  const includeRetired = document.getElementById('mapping-history-filter')?.value === 'all';
  return { bookVal, includeRetired };
}

function bindMappingFilters() {
  document.getElementById('mapping-book-filter')?.addEventListener('change', renderAllBookCards);
  document.getElementById('mapping-history-filter')?.addEventListener('change', renderAllBookCards);
}

// ─── Book card chrome ─────────────────────────────────────────────────────────
function toggleFaMappingBookMenu(e, btn) {
  e.stopPropagation();
  const wrap = btn.closest('.fa-mapping-book-menu-wrap');
  const dd = wrap && wrap.querySelector('.fa-mapping-book-menu-dropdown');
  if (!dd) return;
  const wasOpen = dd.classList.contains('open');
  document.querySelectorAll('.fa-mapping-book-menu-dropdown.open').forEach(el => {
    el.classList.remove('open');
    el.closest('.fa-mapping-book-menu-wrap')?.querySelector('.fa-mapping-book-menu-btn')?.setAttribute('aria-expanded', 'false');
  });
  if (!wasOpen) {
    dd.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}

function faMappingBookMenuAfterSelect(fromEl) {
  const wrap = fromEl.closest('.fa-mapping-book-menu-wrap');
  if (!wrap) return;
  wrap.querySelector('.fa-mapping-book-menu-dropdown')?.classList.remove('open');
  wrap.querySelector('.fa-mapping-book-menu-btn')?.setAttribute('aria-expanded', 'false');
}

function faNotifyAumEmbeddedRefresh() {
  if (typeof window.faRefreshAumEmbeddedAfterMappingChange === 'function') {
    window.faRefreshAumEmbeddedAfterMappingChange();
  }
}

function faMappingRulesNavigateAum() {
  try {
    var panel = document.getElementById('fa-settings-page-anchor') || document.getElementById('fa-settings-page-split');
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
  } catch (e) {
    /* ignore */
  }
  window.location.href = 'settings.html#aum';
}

document.addEventListener('click', function (e) {
  if (e.target.closest('.fa-mapping-book-menu-wrap')) return;
  document.querySelectorAll('.fa-mapping-book-menu-dropdown.open').forEach(el => {
    el.classList.remove('open');
    el.closest('.fa-mapping-book-menu-wrap')?.querySelector('.fa-mapping-book-menu-btn')?.setAttribute('aria-expanded', 'false');
  });
});

function faMappingBookCardMenuHtml(items) {
  const rows = items.map(
    it => `<button type="button" role="menuitem" class="fa-mapping-book-menu-item" onclick="faMappingBookMenuAfterSelect(this)${it.action || ''}">${it.label}</button>`
  ).join('');
  return `<div class="fa-mapping-book-menu-wrap">
    <button type="button" class="icon-btn fa-mapping-book-menu-btn" aria-label="Book actions" aria-expanded="false" aria-haspopup="true" onclick="toggleFaMappingBookMenu(event,this)"><i class="fas fa-ellipsis-vertical" aria-hidden="true"></i></button>
    <div class="fa-mapping-book-menu-dropdown" role="menu">${rows}</div>
  </div>`;
}

function faMappingEscapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Band row AUM (same scale as Main strip / AUM_DATA). */
function faMappingAumBandLabel(acctNum) {
  const m = AUM_DATA[acctNum]?.aum;
  if (m == null || m === '' || Number.isNaN(Number(m))) return '—';
  return '$' + m + 'M';
}

/** Text nodes inside band spans (same as Main allocStripEscapeHtml). */
function faMappingBandTextHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** One-line FCM color key above grids: Name • acct# • $AUM (matches AUM book cards). */
function faMappingFcmKeyHtml(activeRules) {
  if (!activeRules || !activeRules.length) return '';
  const items = activeRules.map((rule) => {
    const c = COLORS[rule.ci];
    const d = AUM_DATA[rule.acctNum] || { client: rule.fcm, aum: 0 };
    const client = faMappingBandTextHtml(d.client || rule.fcm || '');
    const acct = faMappingBandTextHtml(rule.acctNum);
    const aum = faMappingBandTextHtml(faMappingAumBandLabel(rule.acctNum));
    const bullet = '<span class="fa-aum-fcm-key-sep" aria-hidden="true"> • </span>';
    return (
      `<span class="alloc-strip-fcm-key-item" style="--fa-fcm-accent:${c}">` +
      `<span class="alloc-strip-fcm-key-dot" aria-hidden="true"></span>` +
      `<span class="alloc-strip-fcm-key-text">` +
      `<span class="alloc-strip-fcm-band-name">${client}</span>` +
      bullet +
      `<span class="fa-fcm-key-muted">${acct}</span>` +
      bullet +
      `<span class="fa-fcm-key-muted">${aum}</span>` +
      `</span></span>`
    );
  });
  return `<div class="alloc-strip-fcm-key" role="note">${items.join('')}</div>`;
}

function buildBookCardHTML(name, ref, rules) {
  const master = BOOK_RULES[name] || [];
  const bookKey = BOOK_LEV_KEY[name];
  if (bookKey && TICKER_LEV_DATA[bookKey]) return buildNavWeightedCardHTML(name, ref, rules);

  const activeRules = rules.filter(r => r.status !== 'retired');
  const total = activeRules.reduce((s, r) => s + r.target, 0);
  const valid = Math.abs(total - 1) < 0.001;
  const pct = Math.round(total * 100);
  const inc = !valid;
  const barFg = inc ? '#ef4444' : '#22c55e';
  const barBg = inc ? '#fee2e2' : '#dbeafe';
  const totalColor = inc ? '#dc2626' : '#15803d';
  const ratioLabelColor = inc ? '#dc2626' : '#3b82f6';
  const subtitle = inc
    ? '· ratios incomplete — auto-split disabled'
    : '· fixed ratio';
  const badge = inc
    ? `<span class="badge b-red" style="font-size:.6rem"><span class="b-dot"></span>Incomplete</span>`
    : `<span class="badge b-green" style="font-size:.6rem"><span class="b-dot"></span>Valid</span>`;
  const bookAttr = name.replace(/'/g, "\\'");
  const menuHtml = faMappingBookCardMenuHtml([
    { label: 'History' },
    { label: '+ Add SMA Line' },
  ]);

  const rows = rules.map(r => {
    const ruleIdx = master.indexOf(r);
    const barW = Math.round(r.target * 100);
    const pctStr = (r.target * 100).toFixed(1) + '%';
    if (r.status === 'retired') {
      const dateRange = r.effectiveTo ? `${r.effectiveFrom} → ${r.effectiveTo}` : r.effectiveFrom;
      return `<tr style="opacity:.42" data-rule-idx="${ruleIdx}">
        <td><div class="fund-chip"><div class="fund-dot" style="background:${COLORS[r.ci]}"></div><span>${r.fcm}</span></div></td>
        <td style="font-size:.72rem;color:var(--muted)">${r.acctNum}</td>
        <td style="text-align:center"><span class="ratio-pill" style="background:#f1f5f9;color:#94a3b8">${pctStr}</span></td>
        <td style="color:var(--muted)">${dateRange}</td>
        <td><span class="badge b-gray"><span class="b-dot"></span>Retired</span></td>
        <td><button type="button" class="btn btn-ghost btn-xs">View</button></td>
      </tr>`;
    }
    const rowBadge = inc
      ? `<span class="badge b-amber"><span class="b-dot"></span>Incomplete</span>`
      : `<span class="badge b-green"><span class="b-dot"></span>Active</span>`;
    return `<tr data-rule-idx="${ruleIdx}">
      <td><div class="fund-chip"><div class="fund-dot" style="background:${COLORS[r.ci]}"></div><span style="font-weight:500">${r.fcm}</span></div></td>
      <td style="font-size:.72rem;color:var(--muted)">${r.acctNum}</td>
      <td style="text-align:center">
        <div style="display:flex;align-items:center;justify-content:center;gap:6px">
          <div style="width:40px;height:4px;background:#e5e7eb;border-radius:2px;overflow:hidden"><div style="width:${barW}%;height:100%;background:${COLORS[r.ci]};border-radius:2px"></div></div>
          <span class="ratio-pill${inc ? ' warn' : ''}">${pctStr}</span>
        </div>
      </td>
      <td style="color:var(--muted)">${r.effectiveFrom || 'Today'}</td>
      <td>${rowBadge}</td>
      <td>
        <button type="button" class="btn btn-ghost btn-xs" onclick="editSMALine('${bookAttr}',this)">Edit</button>
        <button type="button" class="btn btn-ghost btn-xs" onclick="retireSMALine('${bookAttr}',this)">Retire</button>
      </td>
    </tr>`;
  }).join('');

  const warnRow = inc ? `<tr>
    <td colspan="6" class="fa-mapping-ratio-warn-cell">
      ⚠ ${100 - pct}% unassigned — ratios must total 100% to enable auto-split.
    </td></tr>` : '';

  const faCardId = 'mapping|' + name;
  const bodyId = 'fa-mapping-book-body-' + (name.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '') || 'book');
  const bookCollapsed = typeof faBookCardIsCollapsed === 'function' && faBookCardIsCollapsed(faCardId);
  const cardMod = inc ? ' fa-mapping-book-card--invalid' : '';
  return `<section class="content-card content-card--flush-body fa-mapping-book-card${cardMod}${bookCollapsed ? ' fa-book-card--collapsed' : ''}" data-book="${name.replace(/"/g, '&quot;')}" data-fa-book-card="${faMappingEscapeHtml(faCardId)}">
    <div class="card-header">
      <button type="button" class="fa-book-card-toggle" onclick="toggleFaBookCardFromEl(this)" aria-expanded="${!bookCollapsed}" aria-controls="${bodyId}" aria-label="${faMappingEscapeHtml('Show or hide ' + faBookCardDisplayTitle(name) + ' rules')}">
        <div class="card-title fa-mapping-book-card-title">
          <span class="fa-card-title-text">${faBookCardDisplayTitle(name)}</span>
          <i class="fas fa-chevron-down fa-book-card-caret" aria-hidden="true"></i>
          <span class="fa-mapping-book-mode">${subtitle}</span>
        </div>
      </button>
      <div class="card-actions action-toolbar">
        <div class="fa-mapping-book-header-meta">
          <span class="fa-mapping-book-ratio-label" style="color:${ratioLabelColor}">Ratio total</span>
          <div class="fa-mapping-book-ratio-bar" style="background:${barBg}"><div class="fa-mapping-book-ratio-bar-fill" style="width:${pct}%;background:${barFg}"></div></div>
          <span class="fa-mapping-book-ratio-pct" style="color:${totalColor}">${pct}%</span>
          ${badge}
        </div>
        <span class="action-separator" aria-hidden="true"></span>
        <button type="button" class="action-btn fa-mapping-edit-book-btn" onclick="openEditBookRuleModal('${bookAttr}')">Edit Book Rule</button>
        ${menuHtml}
      </div>
    </div>
    <div class="card-body" id="${bodyId}" ${bookCollapsed ? 'hidden' : ''}>
      ${faMappingFcmKeyHtml(activeRules)}
      <table class="data-table">
        <thead>
        <tr class="alloc-strip-thead-labels">
          <th style="width:160px">SMA</th>
          <th style="width:110px">Account #</th>
          <th style="width:90px;text-align:center">Fixed Ratio</th>
          <th style="width:110px">Effective From</th>
          <th style="width:75px">Status</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>${rows}${warnRow}</tbody>
      </table>
    </div>
  </section>`;
}

function buildNavWeightedCardHTML(name, ref, rules) {
  const activeRules = rules.filter(r => r.status !== 'retired');
  const tlCfg = TICKER_LEV_DATA[BOOK_LEV_KEY[name]] || { tickers:[], default:{} };
  const accts = activeRules.map(r => r.acctNum);
  const acctsTrail = accts.join(' · ');
  const scopeSub = BOOK_SCOPE_SUBTITLE[name] || '';
  const scopeHtml = scopeSub ? `<span class="fa-aum-book-sub">${scopeSub}</span>` : '';

  function wtdExp(levRow, acct) { return (AUM_DATA[acct]?.aum || 0) * faAumLevAt(levRow, acct); }
  function splitPct(levRow) {
    const t = accts.reduce((s, a) => s + wtdExp(levRow, a), 0);
    return accts.map(a => t > 0 ? wtdExp(levRow, a) / t : 0);
  }

  const acctHeaders = activeRules.map(r => {
    const c = COLORS[r.ci] != null ? COLORS[r.ci] : 'var(--muted)';
    return `<th class="r alloc-strip-col-rsep fa-fcm-acct-th fa-fcm-acct-th--strip alloc-strip-fcm-col fa-fcm-acct-th--accent-var" style="--fa-fcm-accent:${c}">${r.acctNum}</th>`;
  }).join('');

  const navColgroup = `<colgroup>
    <col class="fa-mapping-nav-col-ticker" />
    ${activeRules.map(() => '<col class="fa-mapping-nav-col-acct" />').join('')}
    <col class="fa-mapping-nav-col-spacer" />
  </colgroup>`;

  const tickerRows = [...tlCfg.tickers, { symbol:'—', name:'All other tickers', lev: tlCfg.default, isDefault:true }].map(t => {
    const pcts = splitPct(t.lev);
    const isDefault = !!t.isDefault;
    const pctCells = pcts.map((p, i) =>
      `<td class="r alloc-strip-col-rsep" style="font-size:.73rem;font-weight:${p > 0.4 ? '700' : '500'};color:${COLORS[activeRules[i]?.ci ?? i]};opacity:${isDefault ? '.6' : '1'}">${Math.round(p*100)}%</td>`
    ).join('');
    const sym = faMappingEscapeHtml(t.symbol);
    const nm = faMappingEscapeHtml(t.name);
    const tickerCell = isDefault
      ? `<span class="fa-mapping-nav-default-ticker">${nm}</span>`
      : `<span class="product-label"><span class="bracket">[</span><span class="short-name">${sym}</span><span class="bracket">]</span> ${nm}</span>`;
    return `<tr style="${isDefault ? 'background:#f8fafc;font-style:italic;' : ''}border-top:${isDefault ? '2px solid var(--border)' : 'none'}">
      <td class="fa-mapping-nav-ticker-cell">
        ${tickerCell}
      </td>
      ${pctCells}
      <td class="fa-mapping-nav-spacer-cell" aria-hidden="true"></td>
    </tr>`;
  }).join('');

  const safeName = name.replace(/"/g, '&quot;');
  const bookJs = name.replace(/'/g, "\\'");
  const faCardId = 'mapping|' + name;
  const bodyId = 'fa-mapping-book-body-' + (name.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '') || 'book');
  const bookCollapsed = typeof faBookCardIsCollapsed === 'function' && faBookCardIsCollapsed(faCardId);
  return `<section class="content-card content-card--flush-body fa-mapping-book-card fa-mapping-book-card--nav${bookCollapsed ? ' fa-book-card--collapsed' : ''}" data-book="${safeName}" data-fa-book-card="${faMappingEscapeHtml(faCardId)}">
    <div class="card-header">
      <button type="button" class="fa-book-card-toggle" onclick="toggleFaBookCardFromEl(this)" aria-expanded="${!bookCollapsed}" aria-controls="${bodyId}" aria-label="${faMappingEscapeHtml('Show or hide ' + faBookCardDisplayTitle(name) + ' rules')}">
        <div class="card-title fa-mapping-book-card-title alloc-strip-card-title-row">
          <span class="fa-card-title-text">${faBookCardDisplayTitle(name)}<i class="fas fa-chevron-down fa-book-card-caret" aria-hidden="true"></i><span class="fa-strip-card-accts">${acctsTrail}</span>${scopeHtml}</span>
        </div>
      </button>
      <div class="card-actions action-toolbar">
        <button type="button" class="action-btn fa-mapping-edit-book-btn" onclick="openEditBookRuleModal('${bookJs}')">Edit Book Rule</button>
        <button type="button" class="action-btn" onclick="faMappingRulesNavigateAum()">Configure in AUM &amp; Ratios</button>
      </div>
    </div>
    <div class="card-body" id="${bodyId}" ${bookCollapsed ? 'hidden' : ''}>
      ${faMappingFcmKeyHtml(activeRules)}
      <table class="data-table fa-mapping-nav-table" style="width:100%;font-size:.78rem">
        ${navColgroup}
        <thead>
        <tr class="alloc-strip-thead-labels">
          <th class="fa-mapping-nav-ticker-th" style="text-align:left">Ticker</th>
          ${acctHeaders}
          <th class="fa-mapping-nav-spacer-th" aria-hidden="true"></th>
        </tr>
        </thead>
        <tbody>${tickerRows}</tbody>
      </table>
    </div>
  </section>`;
}

/** Legacy Mapping tab (#fa-mapping-body): expand/collapse toolbar; no-ops if controls or body missing. */
function faRefreshSettingsMappingExpandCollapseButtons() {
  const root = document.getElementById('fa-mapping-body');
  const expandBtn = document.getElementById('fa-settings-mapping-expand-all');
  const collapseBtn = document.getElementById('fa-settings-mapping-collapse-all');
  if (!expandBtn || !collapseBtn) return;
  if (!root) {
    expandBtn.disabled = true;
    collapseBtn.disabled = true;
    return;
  }
  const sections = root.querySelectorAll('[data-fa-book-card]');
  const n = sections.length;
  if (n === 0) {
    expandBtn.disabled = true;
    collapseBtn.disabled = true;
    return;
  }
  let collapsedCount = 0;
  sections.forEach(sec => {
    const id = sec.getAttribute('data-fa-book-card');
    if (id && typeof faBookCardIsCollapsed === 'function' && faBookCardIsCollapsed(id)) collapsedCount++;
  });
  expandBtn.disabled = collapsedCount === 0;
  collapseBtn.disabled = collapsedCount === n;
}

function faSettingsMappingExpandAll() {
  const root = document.getElementById('fa-mapping-body');
  if (root && typeof faExpandAllBookCardsIn === 'function') faExpandAllBookCardsIn(root);
  faRefreshSettingsMappingExpandCollapseButtons();
}

function faSettingsMappingCollapseAll() {
  const root = document.getElementById('fa-mapping-body');
  if (root && typeof faCollapseAllBookCardsIn === 'function') faCollapseAllBookCardsIn(root);
  faRefreshSettingsMappingExpandCollapseButtons();
}

function renderAllBookCards() {
  const body = document.getElementById('fa-mapping-body');
  if (!body) return;
  body.querySelectorAll('.fa-mapping-book-card, .fa-mapping-books-empty').forEach(el => el.remove());
  const errEl = document.getElementById('fa-mapping-load-err');
  const { bookVal, includeRetired } = getMappingFilterState();
  const names = Object.keys(BOOK_RULES).sort().filter(n => !bookVal || n === bookVal);
  const parts = [];
  for (const name of names) {
    let rules = [...(BOOK_RULES[name] || [])];
    if (!includeRetired) rules = rules.filter(r => r.status !== 'retired');
    if (!rules.length) continue;
    parts.push(buildBookCardHTML(name, name, rules));
  }
  const html = parts.length
    ? parts.join('')
    : '<div class="fa-mapping-books-empty" role="status">No books match the current filters.</div>';
  if (errEl) {
    errEl.insertAdjacentHTML('beforebegin', html);
  } else {
    body.insertAdjacentHTML('beforeend', html);
  }
  if (typeof faSyncAllBookCardCollapse === 'function') faSyncAllBookCardCollapse(body);
  faRefreshSettingsMappingExpandCollapseButtons();
}

// ─── Mol validation (wide left edge on .mol-validation wrappers / controls) ───
function molValidationHasValue(el) {
  if (!el) return false;
  if (el.tagName === 'SELECT') {
    return el.value != null && String(el.value).length > 0;
  }
  let raw = String(el.value ?? '').trim();
  if (el.id === 'nb-ref') raw = raw.replace(/^#?\s*/, '');
  return raw.length > 0;
}

function syncMolValidationForInput(el) {
  if (!el) return;
  const wrap = el.closest('.mol-validation');
  if (!wrap && !(el.classList && el.classList.contains('mol-validation'))) return;
  const target = wrap || el;
  target.classList.toggle('mol-validation--valid', molValidationHasValue(el));
}

function refreshNewBookTopMolValidation() {
  syncMolValidationForInput(document.getElementById('nb-ref'));
}

function bindNewBookMolValidation() {
  const modal = document.getElementById('modal-new-book');
  if (!modal) return;
  const onField = e => {
    const t = e.target;
    if (!(t instanceof HTMLInputElement || t instanceof HTMLSelectElement || t instanceof HTMLTextAreaElement)) return;
    const type = t.type;
    if (type === 'checkbox' || type === 'radio' || type === 'hidden' || type === 'file') return;
    if (!t.closest('.mol-validation')) return;
    syncMolValidationForInput(t);
  };
  modal.addEventListener('input', onField);
  modal.addEventListener('change', onField);
}

// ─── New book modal: SMA selects (directory = AUM_DATA) ───────────────────────
function faMappingNbUniqueFcms() {
  const s = new Set();
  Object.values(AUM_DATA).forEach(d => {
    if (d && d.fcm) s.add(d.fcm);
  });
  return [...s].sort((a, b) => a.localeCompare(b));
}

function faMappingNbFcmOptionsHtml(selectedFcm) {
  const list = faMappingNbUniqueFcms();
  if (selectedFcm && !list.includes(selectedFcm)) {
    list.push(selectedFcm);
    list.sort((a, b) => a.localeCompare(b));
  }
  let html = '<option value="">Select FCM…</option>';
  list.forEach(f => {
    const sel = f === selectedFcm ? ' selected' : '';
    html += '<option value="' + faMappingEscapeHtml(f) + '"' + sel + '>' + faMappingEscapeHtml(f) + '</option>';
  });
  return html;
}

function faMappingNbAcctOptionsHtml(fcm, selectedAcct) {
  let html = '<option value="">Select account…</option>';
  if (!fcm) return html;
  const rows = Object.entries(AUM_DATA)
    .filter(([, d]) => d.fcm === fcm)
    .sort(([a], [b]) => a.localeCompare(b));
  let foundSelected = false;
  rows.forEach(([acct, d]) => {
    const sel = acct === selectedAcct ? ' selected' : '';
    if (acct === selectedAcct) foundSelected = true;
    const label = d.client + ' · ' + acct;
    html += '<option value="' + faMappingEscapeHtml(acct) + '"' + sel + '>' + faMappingEscapeHtml(label) + '</option>';
  });
  if (selectedAcct && !foundSelected) {
    const d = AUM_DATA[selectedAcct];
    const label = d ? (d.client + ' · ' + selectedAcct) : selectedAcct + ' (legacy)';
    html += '<option value="' + faMappingEscapeHtml(selectedAcct) + '" selected>' + faMappingEscapeHtml(label) + '</option>';
  }
  return html;
}

function faMappingNbOnFcmChange(sel) {
  const line = sel.closest('.nb-line');
  if (!line) return;
  const acctSel = line.querySelector('.fa-nb-sel-acct');
  if (!acctSel) return;
  const prevAcct = acctSel.value;
  const fcm = sel.value;
  acctSel.innerHTML = faMappingNbAcctOptionsHtml(fcm, '');
  acctSel.disabled = !fcm;
  if (fcm && prevAcct && AUM_DATA[prevAcct] && AUM_DATA[prevAcct].fcm === fcm) {
    acctSel.value = prevAcct;
  }
}

function faMappingNbReadLine(line) {
  const fcmSel = line.querySelector('.fa-nb-sel-fcm');
  const acctSel = line.querySelector('.fa-nb-sel-acct');
  const fcm = (fcmSel && fcmSel.value ? String(fcmSel.value) : '').trim();
  const acctNum = (acctSel && acctSel.value ? String(acctSel.value) : '').trim();
  return { fcm, acctNum };
}

// ─── New / edit book modal (shared) ───────────────────────────────────────────
let _nbModalEditBook = null;

function openNewBookModal() {
  _nbModalEditBook = null;
  const refEl = document.getElementById('nb-ref');
  refEl.value = '';
  refEl.readOnly = false;
  document.getElementById('nb-modal-title').textContent = 'New Book Mapping';
  document.getElementById('nb-modal-submit').textContent = 'Create Book';
  document.getElementById('nb-lines').innerHTML = '';
  addNBLine();
  document.getElementById('modal-new-book').style.display = 'flex';
  refreshNewBookTopMolValidation();
}

/** Populate new-book modal for an existing book (active SMA lines only; retired rows stay on save). */
function openEditBookRuleModal(bookName) {
  const master = BOOK_RULES[bookName];
  if (!master) return;
  _nbModalEditBook = bookName;
  const refEl = document.getElementById('nb-ref');
  refEl.value = String(bookName).replace(/^#+\s*/i, '').trim();
  refEl.readOnly = true;
  document.getElementById('nb-modal-title').textContent = bookName + ' Book Rule';
  document.getElementById('nb-modal-submit').textContent = 'Save Book Rule';
  const linesRoot = document.getElementById('nb-lines');
  linesRoot.innerHTML = '';
  const active = master.filter(r => r.status === 'active');
  if (active.length === 0) {
    addNBLine();
  } else {
    active.forEach(r => addNBLineWithValues(r.fcm, r.acctNum));
  }
  document.getElementById('modal-new-book').style.display = 'flex';
  refreshNewBookTopMolValidation();
}

function closeNewBookModal() {
  document.getElementById('modal-new-book').style.display = 'none';
  _nbModalEditBook = null;
  const refEl = document.getElementById('nb-ref');
  if (refEl) refEl.readOnly = false;
}

function addNBLineWithValues(fcm, acctNum) {
  const div = document.createElement('div');
  div.className = 'nb-line';
  const fcmVal = fcm || '';
  const acctDisabled = !fcmVal;
  div.innerHTML =
    '<select class="form-select fa-nb-sel-fcm" onchange="faMappingNbOnFcmChange(this)">' +
    faMappingNbFcmOptionsHtml(fcmVal) +
    '</select>' +
    '<select class="form-select fa-nb-sel-acct"' + (acctDisabled ? ' disabled' : '') + '>' +
    faMappingNbAcctOptionsHtml(fcmVal, acctNum) +
    '</select>' +
    '<button type="button" class="nb-remove" onclick="removeNBLine(this)" title="Remove line" aria-label="Remove line">✕</button>';
  document.getElementById('nb-lines').appendChild(div);
}

function submitNewBookModal() {
  if (_nbModalEditBook) saveEditedBookRule();
  else createBook();
}

function addNBLine() {
  const div = document.createElement('div');
  div.className = 'nb-line';
  div.innerHTML =
    '<select class="form-select fa-nb-sel-fcm" onchange="faMappingNbOnFcmChange(this)">' +
    faMappingNbFcmOptionsHtml('') +
    '</select>' +
    '<select class="form-select fa-nb-sel-acct" disabled>' +
    '<option value="">Select account…</option>' +
    '</select>' +
    '<button type="button" class="nb-remove" onclick="removeNBLine(this)" title="Remove line" aria-label="Remove line">✕</button>';
  document.getElementById('nb-lines').appendChild(div);
}

function removeNBLine(btn) {
  btn.closest('.nb-line').remove();
}

function normalizeBookRefKey(s) {
  return '#' + String(s ?? '').trim().replace(/^#+\s*/, '').toUpperCase();
}

function saveEditedBookRule() {
  const bookName = _nbModalEditBook;
  if (!bookName || !BOOK_RULES[bookName]) return;

  const lineEls = document.querySelectorAll('#nb-lines .nb-line');
  if (lineEls.length === 0) { alert('Add at least one SMA line.'); return; }

  const oldActive = BOOK_RULES[bookName].filter(r => r.status === 'active');
  const retired = BOOK_RULES[bookName].filter(r => r.status === 'retired');
  const seenAcct = new Set();
  const parsed = [];
  for (let i = 0; i < lineEls.length; i++) {
    const { fcm, acctNum } = faMappingNbReadLine(lineEls[i]);
    if (!fcm || !acctNum) {
      alert('Please select SMA / FCM and account for each line.');
      return;
    }
    if (seenAcct.has(acctNum)) {
      alert('Each account can only appear once per book.');
      return;
    }
    seenAcct.add(acctNum);
    const d = AUM_DATA[acctNum];
    if (d && d.fcm !== fcm) {
      alert('FCM does not match the selected account (' + acctNum + ').');
      return;
    }
    parsed.push({ fcmOut: d ? d.fcm : fcm, acctNum });
  }

  const n = parsed.length;
  const tgtEach = 1 / n;
  const newActive = parsed.map((p, i) => {
    const prev = oldActive.find(r => r.acctNum === p.acctNum);
    return {
      fcm: p.fcmOut,
      acctNum: p.acctNum,
      target: tgtEach,
      ci: prev ? prev.ci : i % 4,
      status: 'active',
      effectiveFrom: prev && prev.effectiveFrom ? prev.effectiveFrom : 'Today',
    };
  });

  BOOK_RULES[bookName] = newActive.concat(retired);
  syncMappingBookFilterOptions();
  renderAllBookCards();
  faNotifyAumEmbeddedRefresh();
  closeNewBookModal();
}

function createBook() {
  const refRaw = document.getElementById('nb-ref').value.trim().replace(/^#?\s*/, '');
  if (!refRaw) { alert('Reference number is required.'); return; }
  const name = normalizeBookRefKey(refRaw);
  if (BOOK_RULES[name]) { alert('A book with that reference already exists.'); return; }

  const lineEls = document.querySelectorAll('#nb-lines .nb-line');
  if (lineEls.length === 0) { alert('Add at least one SMA line.'); return; }

  const seenAcct = new Set();
  const parsed = [];
  for (let i = 0; i < lineEls.length; i++) {
    const { fcm, acctNum } = faMappingNbReadLine(lineEls[i]);
    if (!fcm || !acctNum) {
      alert('Please select SMA / FCM and account for each line.');
      return;
    }
    if (seenAcct.has(acctNum)) {
      alert('Each account can only appear once per book.');
      return;
    }
    seenAcct.add(acctNum);
    const d = AUM_DATA[acctNum];
    if (d && d.fcm !== fcm) {
      alert('FCM does not match the selected account (' + acctNum + ').');
      return;
    }
    parsed.push({ fcmOut: d ? d.fcm : fcm, acctNum });
  }

  const n = parsed.length;
  const tgtEach = 1 / n;
  const rules = parsed.map((p, i) => ({
    fcm: p.fcmOut,
    acctNum: p.acctNum,
    target: tgtEach,
    ci: i % 4,
    status: 'active',
    effectiveFrom: 'Today',
  }));

  BOOK_RULES[name] = rules;
  nextBookRef++;

  syncMappingBookFilterOptions();
  renderAllBookCards();
  faNotifyAumEmbeddedRefresh();
  closeNewBookModal();
}

// ─── Edit / retire SMA (fixed-ratio books only) ───────────────────────────────
let _editBook = null, _editRuleIdx = null;

function editSMALine(bookName, btn) {
  const tr = btn.closest('tr');
  const idxStr = tr?.dataset?.ruleIdx;
  if (idxStr == null || idxStr === '') return;
  const ruleIdx = parseInt(idxStr, 10);
  const rule = BOOK_RULES[bookName]?.[ruleIdx];
  if (!rule || rule.status === 'retired') return;

  _editBook = bookName;
  _editRuleIdx = ruleIdx;

  document.getElementById('es-fcm').value = rule.fcm;
  document.getElementById('es-acct').value = rule.acctNum;
  document.getElementById('es-ratio').value = (rule.target * 100).toFixed(1);
  document.getElementById('es-from').value = rule.effectiveFrom || '';
  document.getElementById('modal-edit-sma').style.display = 'flex';
}

function saveEditedSMALine() {
  const fcm   = document.getElementById('es-fcm').value.trim();
  const acct  = document.getElementById('es-acct').value.trim();
  const ratio = parseFloat(document.getElementById('es-ratio').value);
  const from  = document.getElementById('es-from').value.trim();
  if (!fcm || !acct || isNaN(ratio) || ratio <= 0) {
    alert('Please fill in all fields.'); return;
  }
  const rule = BOOK_RULES[_editBook][_editRuleIdx];
  rule.fcm = fcm;
  rule.acctNum = acct;
  rule.target = ratio / 100;
  if (from) rule.effectiveFrom = from;
  renderAllBookCards();
  faNotifyAumEmbeddedRefresh();
  closeEditSMAModal();
}

function closeEditSMAModal() {
  document.getElementById('modal-edit-sma').style.display = 'none';
  _editBook = null;
  _editRuleIdx = null;
}

function retireSMALine(bookName, btn) {
  const tr = btn.closest('tr');
  const idxStr = tr?.dataset?.ruleIdx;
  if (idxStr == null || idxStr === '') return;
  const rule = BOOK_RULES[bookName]?.[parseInt(idxStr, 10)];
  if (!rule || rule.status === 'retired') return;

  const confirmMsg = `Retire ${rule.fcm} (${rule.acctNum}) from ${bookName}?\n\nThis line will no longer be used for new allocation trades. Existing finalized trades are unaffected.`;
  if (!confirm(confirmMsg)) return;

  const today = new Date();
  rule.status = 'retired';
  rule.effectiveTo = today.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  renderAllBookCards();
  faNotifyAumEmbeddedRefresh();
}

function initFaMappingRulesPage() {
  try {
    if (
      document.getElementById('fa-mapping-body') &&
      document.getElementById('fa-settings-mapping-expand-all')
    ) {
      window.faOnBookCardCollapseChanged = faRefreshSettingsMappingExpandCollapseButtons;
    }
    syncMappingBookFilterOptions();
    bindMappingFilters();
    bindNewBookMolValidation();
    renderAllBookCards();
  } catch (err) {
    const errEl = document.getElementById('fa-mapping-load-err');
    if (errEl) {
      errEl.hidden = false;
      errEl.textContent = 'Could not load mapping rules: ' + (err && err.message ? err.message : String(err));
    }
    console.error(err);
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFaMappingRulesPage);
} else {
  initFaMappingRulesPage();
}
