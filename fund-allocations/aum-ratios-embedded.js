/**
 * Client Accounts + Mapping Rules split-page behavior for settings.html.
 * Requires mapping-rules-app.js (BOOK_RULES, AUM_DATA, TICKER_LEV_DATA, LEVERAGE_DATA, AUM_BOOKS, COLORS, computeTickerSplit).
 */
(function initForm() {
  if (!document.getElementById('trade-date')) return;
  // Trade date → today
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  document.getElementById('trade-date').value = `${yyyy}-${mm}-${dd}`;

  // Contract start/end → current month
  const ym = `${yyyy}-${mm}`;
  document.getElementById('contract-start').value = ym;
  document.getElementById('contract-end').value = ym;
})();
function faAumDeepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
/** Snapshots taken at load; Reset restores per-book grid + LEVERAGE_DATA for that book. */
const FA_AUM_TICKER_LEV_BASELINE = faAumDeepClone(TICKER_LEV_DATA);
const FA_AUM_LEVERAGE_BASELINE = { ...LEVERAGE_DATA };

/** Lev inputs the user changed in-grid (yellow highlight). Persists across Use Default / Use All Defaults for those cells. */
const FA_AUM_LEV_USER_EDITED = new Set();

function faAumLevHighlightKey(bookKey, rowSym, acct) {
  return bookKey + '\x1e' + rowSym + '\x1e' + String(acct);
}

function faAumMarkLevUserEdited(bookKey, rowSym, acct) {
  FA_AUM_LEV_USER_EDITED.add(faAumLevHighlightKey(bookKey, rowSym, acct));
}

function faAumClearLevUserEditedForBook(bookKey) {
  const p = bookKey + '\x1e';
  Array.from(FA_AUM_LEV_USER_EDITED).forEach(function (k) {
    if (k.startsWith(p)) FA_AUM_LEV_USER_EDITED.delete(k);
  });
}

function faAumClearLevUserEditedForTicker(bookKey, sym) {
  const prefix = bookKey + '\x1e' + sym + '\x1e';
  Array.from(FA_AUM_LEV_USER_EDITED).forEach(function (k) {
    if (k.startsWith(prefix)) FA_AUM_LEV_USER_EDITED.delete(k);
  });
}

function faAumTickerRowHasLevUserEdits(bookKey, sym) {
  const prefix = bookKey + '\x1e' + sym + '\x1e';
  return Array.from(FA_AUM_LEV_USER_EDITED).some(function (k) {
    return k.startsWith(prefix);
  });
}

/** Copy user-edited lev cells from prev cfg onto baseline clone (Use All Defaults keeps adjusted numbers + yellow). */
function faAumMergeUserEditedLevsFromPrevIntoCfg(bookKey, destCfg, prevCfg) {
  if (!destCfg || !prevCfg || !prevCfg.tickers) return;
  const prefix = bookKey + '\x1e';
  Array.from(FA_AUM_LEV_USER_EDITED).forEach(function (k) {
    if (!k.startsWith(prefix)) return;
    const segs = k.split('\x1e');
    if (segs.length !== 3) return;
    const sym = segs[1];
    const acct = segs[2];
    const tPrev = prevCfg.tickers.find(function (x) {
      return x.symbol === sym;
    });
    const tDest = destCfg.tickers.find(function (x) {
      return x.symbol === sym;
    });
    if (!tPrev || !tDest || !tPrev.lev) return;
    if (!tDest.lev) tDest.lev = {};
    if (Object.prototype.hasOwnProperty.call(tPrev.lev, acct)) {
      tDest.lev[acct] = tPrev.lev[acct];
    }
  });
}

/** After “Use Default”, that book’s matrix is locked until New Ticker Leverage is opened. */
const FA_AUM_DERIVED_GRID_LOCKED = new Set();

function faAumDerivedGridIsLocked(bookKey) {
  return FA_AUM_DERIVED_GRID_LOCKED.has(bookKey);
}

function faAumDerivedGridLock(bookKey) {
  FA_AUM_DERIVED_GRID_LOCKED.add(bookKey);
}

function faAumDerivedGridUnlock(bookKey) {
  FA_AUM_DERIVED_GRID_LOCKED.delete(bookKey);
  faAumClearTickerRowBookLockExemptForBook(bookKey);
}

/** While book grid is locked, column-menu “Use Adjusted” marks this row editable (exempt from book lock). */
const FA_AUM_TICKER_ROW_BOOK_LOCK_EXEMPT = new Set();

function faAumTickerRowIsBookLockExempt(bookKey, sym) {
  return FA_AUM_TICKER_ROW_BOOK_LOCK_EXEMPT.has(faAumTickerRowDefaultLockKey(bookKey, sym));
}

function faAumTickerRowSetBookLockExempt(bookKey, sym, exempt) {
  const k = faAumTickerRowDefaultLockKey(bookKey, sym);
  if (exempt) FA_AUM_TICKER_ROW_BOOK_LOCK_EXEMPT.add(k);
  else FA_AUM_TICKER_ROW_BOOK_LOCK_EXEMPT.delete(k);
}

function faAumClearTickerRowBookLockExemptForBook(bookKey) {
  const p = bookKey + '\x1e';
  Array.from(FA_AUM_TICKER_ROW_BOOK_LOCK_EXEMPT).forEach(function (k) {
    if (k.startsWith(p)) FA_AUM_TICKER_ROW_BOOK_LOCK_EXEMPT.delete(k);
  });
}

/** Per–ticker row “Use Default”: lev pinned to baseline, inputs locked until “Use Adjusted” on that row. */
const FA_AUM_TICKER_ROW_DEFAULT_LOCKED = new Set();

function faAumTickerRowDefaultLockKey(bookKey, sym) {
  return bookKey + '\x1e' + sym;
}

function faAumTickerRowIsDefaultLocked(bookKey, sym) {
  return FA_AUM_TICKER_ROW_DEFAULT_LOCKED.has(faAumTickerRowDefaultLockKey(bookKey, sym));
}

function faAumTickerRowSetDefaultLocked(bookKey, sym, locked) {
  const k = faAumTickerRowDefaultLockKey(bookKey, sym);
  if (locked) FA_AUM_TICKER_ROW_DEFAULT_LOCKED.add(k);
  else FA_AUM_TICKER_ROW_DEFAULT_LOCKED.delete(k);
}

function faAumClearTickerRowDefaultLocksForBook(bookKey) {
  const p = bookKey + '\x1e';
  Array.from(FA_AUM_TICKER_ROW_DEFAULT_LOCKED).forEach(function (k) {
    if (k.startsWith(p)) FA_AUM_TICKER_ROW_DEFAULT_LOCKED.delete(k);
  });
}

/**
 * True when ticker rows disagree on default vs adjusted (column menu / book-lock exempt).
 * Requires at least two tickers; otherwise homogeneous.
 */
function faAumBookGridHasMixedDefaultAdjusted(bookKey) {
  const cfg = TICKER_LEV_DATA[bookKey];
  if (!cfg || !cfg.tickers || cfg.tickers.length < 2) return false;
  const gridLocked = faAumDerivedGridIsLocked(bookKey);
  let anyDefault = false;
  let anyAdjusted = false;
  for (let i = 0; i < cfg.tickers.length; i++) {
    const sym = cfg.tickers[i].symbol;
    if (gridLocked) {
      if (faAumTickerRowIsBookLockExempt(bookKey, sym)) anyAdjusted = true;
      else anyDefault = true;
    } else if (faAumTickerRowIsDefaultLocked(bookKey, sym)) {
      anyDefault = true;
    } else {
      anyAdjusted = true;
    }
  }
  return anyDefault && anyAdjusted;
}

/** Copy baseline lev for symbol from FA_AUM_TICKER_LEV_BASELINE, or cfg.default if user-added ticker. */
function faAumApplyBaselineLevForTicker(bookKey, sym) {
  const cfg = TICKER_LEV_DATA[bookKey];
  if (!cfg) return;
  const t = cfg.tickers.find(function (x) {
    return x.symbol === sym;
  });
  if (!t) return;
  const baseBook = FA_AUM_TICKER_LEV_BASELINE[bookKey];
  const baseT = baseBook.tickers.find(function (x) {
    return x.symbol === sym;
  });
  t.lev = faAumDeepClone(baseT ? baseT.lev : baseBook.default);
}

/** Apply column-menu “Use Default” for one ticker row. */
function faAumApplyTickerRowUseDefault(bookKey, sym) {
  const cfg = TICKER_LEV_DATA[bookKey];
  if (!cfg || !cfg.tickers.some(function (x) { return x.symbol === sym; })) return;
  if (!faAumTickerRowHasLevUserEdits(bookKey, sym)) {
    faAumApplyBaselineLevForTicker(bookKey, sym);
    faAumClearLevUserEditedForTicker(bookKey, sym);
  }
  faAumTickerRowSetDefaultLocked(bookKey, sym, true);
  faAumTickerRowSetBookLockExempt(bookKey, sym, false);
  renderTickerMatrix(bookKey);
}

/** Column menu: toggle Use Default / Use Adjusted for this ticker row only. */
function faAumTickerRowMenuToggleDefault(btn) {
  faAumTickerRowMenuAfterSelect(btn);
  const wrap = btn.closest('.fa-aum-ticker-menu-wrap');
  if (!wrap) return;
  const bookKey = wrap.getAttribute('data-aum-book');
  const sym = wrap.getAttribute('data-aum-symbol');
  if (!bookKey || sym == null || sym === '') return;
  if (faAumTickerRowIsDefaultLocked(bookKey, sym)) {
    faAumTickerRowSetDefaultLocked(bookKey, sym, false);
    if (faAumDerivedGridIsLocked(bookKey)) {
      faAumTickerRowSetBookLockExempt(bookKey, sym, true);
    }
    renderTickerMatrix(bookKey);
    return;
  }
  if (
    faAumDerivedGridIsLocked(bookKey) &&
    !faAumTickerRowIsBookLockExempt(bookKey, sym)
  ) {
    faAumTickerRowSetBookLockExempt(bookKey, sym, true);
    renderTickerMatrix(bookKey);
    return;
  }
  faAumApplyTickerRowUseDefault(bookKey, sym);
}

/** settings.html — Mapping Rules nested book cards (#fa-settings-mapping-books-root). */
function faRefreshMappingRulesBooksExpandCollapseButtons() {
  const root = document.getElementById('fa-settings-mapping-books-root');
  const expandBtn = document.getElementById('fa-settings-mapping-books-expand-all');
  const collapseBtn = document.getElementById('fa-settings-mapping-books-collapse-all');
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

function faSettingsMappingBooksExpandAll() {
  const root = document.getElementById('fa-settings-mapping-books-root');
  if (root && typeof faExpandAllBookCardsIn === 'function') faExpandAllBookCardsIn(root);
  faRefreshMappingRulesBooksExpandCollapseButtons();
}

function faSettingsMappingBooksCollapseAll() {
  const root = document.getElementById('fa-settings-mapping-books-root');
  if (root && typeof faCollapseAllBookCardsIn === 'function') faCollapseAllBookCardsIn(root);
  faRefreshMappingRulesBooksExpandCollapseButtons();
}

/** Client Accounts card — open read-only Default Leverage modal */
function faSettingsViewDefaultLeverage() {
  const modal = document.getElementById('modal-fa-aum-view-default-leverage');
  if (!modal) return;
  renderFaAumViewDefaultLeverageModal();
  modal.style.display = 'flex';
}

function closeFaAumViewDefaultLeverageModal() {
  faAumViewDefaultLevTipHide();
  const modal = document.getElementById('modal-fa-aum-view-default-leverage');
  if (modal) modal.style.display = 'none';
}

function faSettingsDownloadLeverageTemplate() {
  console.log('[Fund Allocations settings] Download leverage template (mock)');
}

function faSettingsUploadLeverage() {
  console.log('[Fund Allocations settings] Upload leverage (mock)');
}

function renderAumTables() {
  renderAumAccounts();
  renderTickerMatrix('energy');
  renderTickerMatrix('gas');
  renderTickerMatrix('crude');
  faRefreshMappingRulesBooksExpandCollapseButtons();
}

function faAumCiFromAcctNum(acctNum) {
  let h = 0;
  const s = String(acctNum);
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 4;
}

/** Accounts from active mapping rules, plus any-only-in-AUM_DATA rows (e.g. newly added). */
function getAumAccountRows() {
  const byAcct = new Map();
  Object.values(BOOK_RULES).forEach(rules =>
    rules.filter(r => r.status === 'active').forEach(r => {
      if (!byAcct.has(r.acctNum)) byAcct.set(r.acctNum, r);
    })
  );
  Object.keys(AUM_DATA).forEach(acctNum => {
    if (!byAcct.has(acctNum)) {
      const d = AUM_DATA[acctNum];
      byAcct.set(acctNum, {
        acctNum,
        fcm: d.fcm || '—',
        ci: faAumCiFromAcctNum(acctNum),
        status: 'active',
      });
    }
  });
  return Array.from(byAcct.values());
}

/** Tickers configured across all books (union by symbol; display name from first occurrence). */
function faAumCollectTickerColumnsForView() {
  const map = new Map();
  Object.keys(AUM_BOOKS).forEach(bookKey => {
    const tickers = TICKER_LEV_DATA[bookKey]?.tickers || [];
    tickers.forEach(t => {
      if (!map.has(t.symbol)) map.set(t.symbol, { symbol: t.symbol, name: t.name || t.symbol });
    });
  });
  return Array.from(map.values()).sort((a, b) => a.symbol.localeCompare(b.symbol));
}

/**
 * Default leverage for one account × ticker: first book (energy → gas → crude) where the account
 * is active and that ticker row exists.
 */
function faAumDefaultLeverageCell(acctNum, symbol) {
  for (const bookKey of ['energy', 'gas', 'crude']) {
    const cfg = TICKER_LEV_DATA[bookKey];
    if (!cfg) continue;
    const book = AUM_BOOKS[bookKey];
    const rules = (BOOK_RULES[book.bookName] || []).filter(r => r.status === 'active');
    if (!rules.some(r => r.acctNum === acctNum)) continue;
    const t = cfg.tickers.find(x => x.symbol === symbol);
    if (!t) continue;
    const v = t.lev[acctNum];
    return v != null && v !== '' ? Number(v) : 1;
  }
  return null;
}

function faAumViewDefaultLevEnsureTipEl() {
  let tip = document.getElementById('fa-aum-view-default-lev-fixed-tip');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'fa-aum-view-default-lev-fixed-tip';
    tip.className = 'fa-aum-view-default-lev-fixed-tooltip';
    tip.setAttribute('role', 'tooltip');
    tip.style.display = 'none';
    document.body.appendChild(tip);
  }
  return tip;
}

function faAumViewDefaultLevTipHide() {
  const tip = document.getElementById('fa-aum-view-default-lev-fixed-tip');
  if (tip) tip.style.display = 'none';
}

/** Fixed to viewport — escapes scroll/modal overflow; prefers above anchor, below if needed. */
function faAumViewDefaultLevTipShow(wrap) {
  const text = wrap && wrap.getAttribute('data-tooltip');
  if (!text) return;
  const tip = faAumViewDefaultLevEnsureTipEl();
  tip.textContent = text;
  tip.style.display = 'block';
  tip.style.visibility = 'hidden';
  const rect = wrap.getBoundingClientRect();
  const gap = 8;
  const edge = 8;
  const tw = tip.offsetWidth;
  const th = tip.offsetHeight;
  tip.style.visibility = 'visible';
  let left = rect.left + rect.width / 2 - tw / 2;
  left = Math.max(edge, Math.min(left, window.innerWidth - tw - edge));
  let top = rect.top - th - gap;
  if (top < edge) top = rect.bottom + gap;
  tip.style.left = left + 'px';
  tip.style.top = top + 'px';
}

function faAumViewDefaultLevBindTickerHeadTooltips() {
  const thead = document.getElementById('fa-aum-view-default-lev-thead');
  const modal = document.getElementById('modal-fa-aum-view-default-leverage');
  const scroll = modal && modal.querySelector('.fa-aum-view-default-lev-scroll');
  if (!thead) return;

  function onEnter(e) {
    faAumViewDefaultLevTipShow(e.currentTarget);
  }
  function onLeave() {
    faAumViewDefaultLevTipHide();
  }

  thead.querySelectorAll('.fa-tooltip-wrap--portal').forEach(function (wrap) {
    wrap.addEventListener('mouseenter', onEnter);
    wrap.addEventListener('mouseleave', onLeave);
    wrap.addEventListener('focus', onEnter);
    wrap.addEventListener('blur', onLeave);
  });

  if (scroll && !scroll.dataset.faAumLevTipScrollBound) {
    scroll.dataset.faAumLevTipScrollBound = '1';
    scroll.addEventListener('scroll', faAumViewDefaultLevTipHide, { passive: true });
  }
}

function renderFaAumViewDefaultLeverageModal() {
  const thead = document.getElementById('fa-aum-view-default-lev-thead');
  const tbody = document.getElementById('fa-aum-view-default-lev-body');
  if (!thead || !tbody) return;

  const tickers = faAumCollectTickerColumnsForView();
  const accounts = getAumAccountRows();

  let headHtml =
    '<tr>' +
    '<th>Client Name</th>' +
    '<th>Account #</th>' +
    '<th>FCM / Custodian</th>' +
    '<th class="r">AUM ($M)</th>';
  tickers.forEach(t => {
    headHtml +=
      '<th class="fa-aum-view-default-lev-ticker-head r" scope="col">' +
      '<span class="fa-tooltip-wrap fa-tooltip-wrap--portal" tabindex="0" data-tooltip="' +
      faAumEscHtml(t.name) +
      '">' +
      faAumEscHtml(t.symbol) +
      '</span>' +
      '</th>';
  });
  headHtml += '</tr>';
  thead.innerHTML = headHtml;

  tbody.innerHTML = accounts
    .map(r => {
      const d = AUM_DATA[r.acctNum] || { client: r.fcm, fcm: r.fcm, aum: 0 };
      let row =
        '<tr>' +
        '<td class="fa-aum-ca-cell-client">' +
        faAumEscHtml(d.client) +
        '</td>' +
        '<td class="fa-aum-ca-cell-acct">' +
        faAumEscHtml(r.acctNum) +
        '</td>' +
        '<td class="fa-aum-ca-cell-fcm"><div class="fund-chip"><div class="fund-dot" style="background:' +
        COLORS[r.ci] +
        '"></div><span>' +
        faAumEscHtml(d.fcm) +
        '</span></div></td>' +
        '<td class="r fa-aum-ca-cell-aum">' +
        (d.aum != null && d.aum !== '' ? Number(d.aum).toLocaleString() : '—') +
        '</td>';
      tickers.forEach(t => {
        const lev = faAumDefaultLeverageCell(r.acctNum, t.symbol);
        row += '<td class="r">' + (lev != null ? lev.toFixed(2) + '×' : '—') + '</td>';
      });
      row += '</tr>';
      return row;
    })
    .join('');

  faAumViewDefaultLevBindTickerHeadTooltips();
}

function renderAumAccounts() {
  const body = document.getElementById('aum-accounts-body');
  if (!body) return;
  const accounts = getAumAccountRows();
  body.innerHTML = accounts.map(r => {
    const d = AUM_DATA[r.acctNum] || { client: r.fcm, fcm: r.fcm, aum: 0, asOf: '—', updatedBy: '—' };
    return '<tr>' +
      '<td class="fa-aum-ca-cell-client">' + d.client + '</td>' +
      '<td class="fa-aum-ca-cell-acct">' + r.acctNum + '</td>' +
      '<td class="fa-aum-ca-cell-fcm"><div class="fund-chip"><div class="fund-dot" style="background:' + COLORS[r.ci] + '"></div><span>' + d.fcm + '</span></div></td>' +
      '<td class="fa-aum-ca-cell-aum r">' +
        (d.aum != null && d.aum !== '' ? Number(d.aum).toLocaleString() : '—') +
      '</td>' +
      '<td class="fa-aum-ca-cell-asof r">' + d.asOf + '</td>' +
      '<td class="fa-aum-ca-col-updated">' + d.updatedBy + '</td>' +
      '</tr>';
  }).join('');
}

/** Book cards: restore mock defaults for entire book immediately. */
function faAumUseAllDefaultsClick(bookKey) {
  if (
    faAumDerivedGridIsLocked(bookKey) &&
    !faAumBookGridHasMixedDefaultAdjusted(bookKey)
  ) {
    return;
  }
  resetAumDerivedApply(bookKey);
}

/** Book cards: entire book uses adjusted leverage (unlock; clear per-row “Use Default” pins). */
function faAumUseAllAdjustedClick(bookKey) {
  const locked = faAumDerivedGridIsLocked(bookKey);
  const mixed = faAumBookGridHasMixedDefaultAdjusted(bookKey);
  if (!locked && !mixed) return;
  if (locked) {
    faAumDerivedGridUnlock(bookKey);
  }
  faAumClearTickerRowDefaultLocksForBook(bookKey);
  renderTickerMatrix(bookKey);
}

/** Legacy single control; forwards to the paired book buttons. */
function resetAumDerived(bookKey) {
  if (faAumDerivedGridIsLocked(bookKey)) faAumUseAllAdjustedClick(bookKey);
  else faAumUseAllDefaultsClick(bookKey);
}

/** Card actions: mutual disable unless per-row modes differ — then both actions stay available. */
function faAumRefreshBookModeButtons() {
  Object.keys(AUM_BOOKS).forEach(function (bk) {
    const locked = faAumDerivedGridIsLocked(bk);
    const mixed = faAumBookGridHasMixedDefaultAdjusted(bk);
    const btnDef = document.getElementById('fa-aum-use-all-defaults-' + bk);
    const btnAdj = document.getElementById('fa-aum-use-all-adjusted-' + bk);
    if (!btnDef || !btnAdj) return;
    if (mixed) {
      btnDef.disabled = false;
      btnAdj.disabled = false;
      btnDef.title =
        'Apply mock defaults for this entire book (overrides mixed per-row choices).';
      btnAdj.title =
        'Use adjusted leverage for this entire book — unlock if needed and clear per-row default pins.';
    } else {
      btnDef.disabled = !!locked;
      btnAdj.disabled = !locked;
      btnDef.title = locked
        ? 'Book is using mock defaults for this grid. Choose Use All Adjusted to edit leverage and tickers.'
        : 'Restore this book’s ticker grid and per-account leverage to the original mock defaults.';
      btnAdj.title = locked
        ? 'Unlock this book’s ticker grid so you can edit leverage and manage tickers.'
        : 'Grid is already unlocked (using adjusted values). Choose Use All Defaults to restore mock defaults.';
    }
  });
}

function resetAumDerivedApply(bookKey) {
  const cfgBook = AUM_BOOKS[bookKey];
  const baseTicker = FA_AUM_TICKER_LEV_BASELINE[bookKey];
  if (!cfgBook || !baseTicker || !TICKER_LEV_DATA[bookKey]) return;
  const prevCfg = TICKER_LEV_DATA[bookKey];
  const merged = faAumDeepClone(baseTicker);
  faAumMergeUserEditedLevsFromPrevIntoCfg(bookKey, merged, prevCfg);
  faAumClearTickerRowDefaultLocksForBook(bookKey);
  faAumClearTickerRowBookLockExemptForBook(bookKey);
  TICKER_LEV_DATA[bookKey] = merged;
  const rules = (BOOK_RULES[cfgBook.bookName] || []).filter(r => r.status === 'active');
  rules.forEach(r => {
    const lk = r.acctNum + '|' + bookKey;
    LEVERAGE_DATA[lk] = Object.prototype.hasOwnProperty.call(FA_AUM_LEVERAGE_BASELINE, lk)
      ? FA_AUM_LEVERAGE_BASELINE[lk]
      : 1;
  });
  faAumDerivedGridLock(bookKey);
  renderTickerMatrix(bookKey);
}

// ─── Ticker-leverage matrix renderer (generic) ───────────────────────────────

function faAumEscHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** AUM label for book-grid color key (millions → $450M, or em dash). */
function faAumKeyAumLabel(acctNum) {
  const m = AUM_DATA[acctNum]?.aum;
  if (m == null || m === '' || Number.isNaN(Number(m))) return '—';
  return '$' + m + 'M';
}

/**
 * Color key above ticker matrix: Name • acct# • $450M (acct + $ muted); Lev/Wtd headers stay minimal.
 */
function faAumBookFcmKeyHtml(bookKey) {
  const book = AUM_BOOKS[bookKey];
  if (!book) return '';
  const rules = (BOOK_RULES[book.bookName] || []).filter(r => r.status === 'active');
  if (!rules.length) return '';
  const items = rules.map((rule) => {
    const c = COLORS[rule.ci];
    const d = AUM_DATA[rule.acctNum] || { client: rule.fcm, aum: 0 };
    const client = faAumEscHtml(d.client || rule.fcm || '');
    const acct = faAumEscHtml(rule.acctNum);
    const aum = faAumEscHtml(faAumKeyAumLabel(rule.acctNum));
    const bullet = '<span class="fa-aum-fcm-key-sep" aria-hidden="true"> • </span>';
    return (
      `<span class="alloc-strip-fcm-key-item" style="--fa-fcm-accent:${c}">` +
      '<span class="alloc-strip-fcm-key-dot" aria-hidden="true"></span>' +
      '<span class="alloc-strip-fcm-key-text">' +
      `<span class="alloc-strip-fcm-band-name">${client}</span>` +
      bullet +
      `<span class="fa-fcm-key-muted">${acct}</span>` +
      bullet +
      `<span class="fa-fcm-key-muted">${aum}</span>` +
      '</span></span>'
    );
  });
  return `<div class="alloc-strip-fcm-key fa-aum-book-fcm-key" role="note">${items.join('')}</div>`;
}

/** Live AUM + mapping rules → key above grid; accent top border on Lev/Wtd pair per account. */
function refreshFaAumBookFcmKeyAndThead(bookKey) {
  const host = document.getElementById('fa-aum-fcm-key-' + bookKey);
  if (host) host.innerHTML = faAumBookFcmKeyHtml(bookKey);

  const table = document.getElementById('aum-table-' + bookKey);
  if (!table) return;
  const rules = (BOOK_RULES[AUM_BOOKS[bookKey].bookName] || []).filter(r => r.status === 'active');
  const row = table.querySelector('thead tr.fa-aum-grid-subhead');
  if (!row) return;
  const cells = row.querySelectorAll('th');
  const lastIdx = cells.length - 1;
  cells.forEach(function (th) {
    th.classList.remove('fa-aum-th-accent-top');
    th.style.removeProperty('--fa-fcm-accent');
    th.style.removeProperty('color');
  });
  const n = rules.length;
  cells.forEach(function (th, idx) {
    if (idx <= 2 || idx === lastIdx) {
      return;
    }
    const pairSlot = idx - 3;
    const ruleIdx = Math.floor(pairSlot / 2);
    if (ruleIdx >= 0 && ruleIdx < n) {
      th.classList.add('fa-aum-th-accent-top');
      th.style.setProperty('--fa-fcm-accent', COLORS[rules[ruleIdx].ci]);
      th.style.setProperty('color', COLORS[rules[ruleIdx].ci]);
    }
  });
}

function toggleFaAumTickerRowMenu(e, btn) {
  e.stopPropagation();
  const wrap = btn.closest('.fa-aum-ticker-menu-wrap');
  const dd = wrap && wrap.querySelector('.fa-aum-ticker-menu-dropdown');
  if (!dd) return;
  const wasOpen = dd.classList.contains('open');
  document.querySelectorAll('.fa-aum-ticker-menu-dropdown.open').forEach(el => {
    el.classList.remove('open');
    el.closest('.fa-aum-ticker-menu-wrap')?.querySelector('.fa-aum-ticker-menu-btn')?.setAttribute('aria-expanded', 'false');
  });
  if (!wasOpen) {
    dd.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}

function faAumTickerRowMenuAfterSelect(fromEl) {
  const wrap = fromEl.closest('.fa-aum-ticker-menu-wrap');
  if (!wrap) return;
  wrap.querySelector('.fa-aum-ticker-menu-dropdown')?.classList.remove('open');
  wrap.querySelector('.fa-aum-ticker-menu-btn')?.setAttribute('aria-expanded', 'false');
}

function faAumTickerRowMenuDelete(btn) {
  const wrap = btn.closest('.fa-aum-ticker-menu-wrap');
  if (!wrap) return;
  faAumTickerRowMenuAfterSelect(btn);
  const book = wrap.getAttribute('data-aum-book');
  const sym = wrap.getAttribute('data-aum-symbol');
  if (book != null && sym != null && sym !== '') deleteTicker(book, sym);
}

document.addEventListener('click', function (e) {
  if (e.target.closest('.fa-aum-ticker-menu-wrap')) return;
  document.querySelectorAll('.fa-aum-ticker-menu-dropdown.open').forEach(el => {
    el.classList.remove('open');
    el.closest('.fa-aum-ticker-menu-wrap')?.querySelector('.fa-aum-ticker-menu-btn')?.setAttribute('aria-expanded', 'false');
  });
});

function faAumLevInputId(bk, rowSym, acctNum) {
  const row =
    rowSym === '__default__'
      ? 'default'
      : String(rowSym).replace(/[^a-zA-Z0-9]/g, '-');
  const ac = String(acctNum).replace(/[^a-zA-Z0-9]/g, '-');
  return 'fa-aum-lev-' + bk + '-' + row + '-' + ac;
}

function faAumCssAttrQuote(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function faAumWtdExpForLevRow(levRow, acct) {
  const raw = levRow[acct];
  let l = 1;
  if (raw != null && raw !== '') {
    const n = Number(raw);
    if (Number.isFinite(n)) l = n;
  }
  return (AUM_DATA[acct]?.aum || 0) * l;
}

function faAumFormatSplitChips(bookKey, pcts) {
  const book = AUM_BOOKS[bookKey];
  if (!book) return '';
  const rules = (BOOK_RULES[book.bookName] || []).filter(r => r.status === 'active');
  return pcts
    .map(function (p, i) {
      const col = COLORS[rules[i]?.ci ?? i];
      return (
        '<span class="fa-aum-split-chip" style="color:' + col + '">' + Math.round(p * 100) + '%</span>'
      );
    })
    .join('<span class="fa-aum-split-chip-sep">·</span>');
}

/** Recompute Effective Split + Wtd for one row from live input values (no full matrix re-render). */
function faAumDerivedLevLiveRefreshRowFromDom(bookKey, sym) {
  const cfg = TICKER_LEV_DATA[bookKey];
  const book = AUM_BOOKS[bookKey];
  if (!cfg || !book) return;
  const body = document.getElementById(book.bodyId);
  if (!body) return;
  const row = body.querySelector(
    'tr[data-fa-aum-ticker-row="' + faAumCssAttrQuote(sym) + '"]'
  );
  if (!row) return;
  const t = cfg.tickers.find(function (x) {
    return x.symbol === sym;
  });
  if (!t) return;
  const rules = (BOOK_RULES[book.bookName] || []).filter(r => r.status === 'active');
  const accts = rules.map(r => r.acctNum);
  const lev = {};
  accts.forEach(function (acct) {
    const el = row.querySelector(
      'input.fa-aum-lev-input[data-fa-aum-lev-acct="' + faAumCssAttrQuote(acct) + '"]'
    );
    if (!el) return;
    const raw = String(el.value ?? '').trim();
    let v = parseFloat(raw);
    if (!Number.isFinite(v)) {
      const prev = t.lev && t.lev[acct];
      v =
        prev != null && prev !== '' && Number.isFinite(Number(prev))
          ? Number(prev)
          : 1;
    }
    if (v < 0) v = 0;
    lev[acct] = v;
  });
  const total = accts.reduce(function (s, a) {
    return s + faAumWtdExpForLevRow(lev, a);
  }, 0);
  const pcts = accts.map(function (a) {
    return total > 0 ? faAumWtdExpForLevRow(lev, a) / total : 0;
  });
  const splitCol = row.querySelector('.fa-aum-split-col');
  if (splitCol) splitCol.innerHTML = faAumFormatSplitChips(bookKey, pcts);
  const wtdCells = row.querySelectorAll('td.fa-aum-wtd-col');
  accts.forEach(function (acct, i) {
    const td = wtdCells[i];
    if (!td) return;
    const w = faAumWtdExpForLevRow(lev, acct);
    td.textContent = '$' + w.toFixed(0) + 'M';
  });
}

/** While typing: refresh split + Wtd only — do not replace inputs (native caret/selection). */
function faAumDerivedLevInput(inp) {
  if (!(inp instanceof HTMLInputElement)) return;
  const bookKey = inp.getAttribute('data-fa-aum-lev-book');
  const sym = inp.getAttribute('data-fa-aum-lev-symbol');
  const acct = inp.getAttribute('data-fa-aum-lev-acct');
  if (!bookKey || sym == null || sym === '' || !acct) return;
  if (faAumDerivedGridIsLocked(bookKey) && !faAumTickerRowIsBookLockExempt(bookKey, sym)) return;
  if (faAumTickerRowIsDefaultLocked(bookKey, sym)) return;
  faAumDerivedLevLiveRefreshRowFromDom(bookKey, sym);
}

/** Commit lev on blur; full grid render for highlights / disabled chrome. `type="text"` avoids number-input quirks. */
function faAumDerivedLevBlur(inp) {
  if (!(inp instanceof HTMLInputElement)) return;
  const bookKey = inp.getAttribute('data-fa-aum-lev-book');
  const sym = inp.getAttribute('data-fa-aum-lev-symbol');
  const acct = inp.getAttribute('data-fa-aum-lev-acct');
  if (!bookKey || sym == null || sym === '' || !acct) return;
  if (faAumDerivedGridIsLocked(bookKey) && !faAumTickerRowIsBookLockExempt(bookKey, sym)) return;
  if (faAumTickerRowIsDefaultLocked(bookKey, sym)) return;
  const raw = String(inp.value ?? '').trim();
  let v;
  if (raw === '') {
    v = 1;
  } else {
    v = parseFloat(raw);
    if (!Number.isFinite(v)) v = 1;
  }
  if (v < 0) v = 0;
  const cfg = TICKER_LEV_DATA[bookKey];
  if (!cfg) return;
  const t = cfg.tickers.find(function (x) {
    return x.symbol === sym;
  });
  if (!t) return;
  if (!t.lev) t.lev = {};
  t.lev[acct] = v;
  faAumMarkLevUserEdited(bookKey, sym, acct);
  renderTickerMatrix(bookKey);
}

function renderTickerMatrix(bookKey) {
  const cfg   = TICKER_LEV_DATA[bookKey];
  const book  = AUM_BOOKS[bookKey];
  if (!cfg || !book) return;
  const body = document.getElementById(book.bodyId);
  if (!body) return;

  const rules = (BOOK_RULES[book.bookName] || []).filter(r => r.status === 'active');
  const accts = rules.map(r => r.acctNum);
  const stripAcctsEl = document.querySelector(
    '.fa-aum-book-card[data-aum-book="' + bookKey + '"] .fa-strip-card-accts'
  );
  if (stripAcctsEl) stripAcctsEl.textContent = accts.join(' · ');
  const gridLocked = faAumDerivedGridIsLocked(bookKey);

  function wtdExp(levRow, acct) {
    return faAumWtdExpForLevRow(levRow, acct);
  }
  function splitPct(levRow) {
    const total = accts.reduce((s, a) => s + faAumWtdExpForLevRow(levRow, a), 0);
    return accts.map(a => total > 0 ? faAumWtdExpForLevRow(levRow, a) / total : 0);
  }
  function splitChips(pcts) {
    return faAumFormatSplitChips(bookKey, pcts);
  }
  /** Ticker rows: highlight Lev cells that differ from cfg.default (All other tickers row). */
  function levOverridesDefault(acct, levVal) {
    const cur = parseFloat(levVal);
    const base = parseFloat(cfg.default[acct] ?? 1);
    const c = Number.isFinite(cur) ? cur : 1;
    const d = Number.isFinite(base) ? base : 1;
    return Math.abs(c - d) > 1e-6;
  }

  function levCell(acct, val, differsFromDefault, rowSym) {
    const userEdited = FA_AUM_LEV_USER_EDITED.has(faAumLevHighlightKey(bookKey, rowSym, acct));
    const showYellow = differsFromDefault || userEdited;
    const overrideCls = showYellow ? ' fa-aum-lev-col--override' : '';
    let overrideTitle = '';
    if (showYellow) {
      overrideTitle = differsFromDefault
        ? ' title="Leverage differs from All other tickers row for this account"'
        : ' title="Leverage edited"';
    }
    const num = parseFloat(val);
    const ci = rules.find(r => r.acctNum === acct)?.ci ?? 0;
    const col = COLORS[ci];
    const tdAccentStyle = showYellow ? '--fa-aum-fcm-accent:' + col + ';' : '';

    if (rowSym === '__default__') {
      const txt = Number.isFinite(num) ? Math.max(0, num).toFixed(2) + '×' : '—';
      return (
        '<td class="fa-aum-lev-col r' + overrideCls + '"' +
        overrideTitle +
        ' style="' +
        tdAccentStyle +
        'color:' +
        col +
        '">' +
        txt +
        '</td>'
      );
    }

    const v = Number.isFinite(num) ? Math.max(0, num) : 1;
    const inputId = faAumLevInputId(bookKey, rowSym, acct);
    const symAttr = faAumEscHtml(rowSym);
    const bookAttr = faAumEscHtml(bookKey);
    const acctAttr = faAumEscHtml(acct);
    const ariaRow = faAumEscHtml(String(rowSym));
    const ariaLabel = 'Leverage (' + ariaRow + '), account ' + acctAttr;
    const tickerRowPinned =
      rowSym !== '__default__' && faAumTickerRowIsDefaultLocked(bookKey, rowSym);
    const rowBookExempt =
      rowSym !== '__default__' && faAumTickerRowIsBookLockExempt(bookKey, rowSym);
    const bookLocksLev = gridLocked && !rowBookExempt;
    const levLockedForRow = bookLocksLev || tickerRowPinned;
    const disAttr = levLockedForRow ? ' disabled' : '';
    /* Match Wtd column: account / FCM accent per mapping rule ci */
    const inpStyle =
      ' style="color:' +
      col +
      ';-webkit-text-fill-color:' +
      col +
      '"';
    return (
      '<td class="fa-aum-lev-col r' + overrideCls + '"' +
      overrideTitle +
      (showYellow ? ' style="' + tdAccentStyle + '"' : '') +
      '>' +
      '<input type="text" class="fa-aum-lev-input fa-aum-lev-input--plain"' +
      inpStyle +
      ' id="' +
      inputId +
      '" data-fa-aum-lev-book="' +
      bookAttr +
      '" data-fa-aum-lev-symbol="' +
      symAttr +
      '" data-fa-aum-lev-acct="' +
      acctAttr +
      '" value="' +
      v +
      '" inputmode="decimal" autocomplete="off" spellcheck="false" aria-label="' +
      ariaLabel +
      '"' +
      disAttr +
      (levLockedForRow ? '' : ' oninput="faAumDerivedLevInput(this)" onblur="faAumDerivedLevBlur(this)"') +
      ' />' +
      '</td>'
    );
  }
  function wtdCell(levRow, acct, isDefaultRow, tickerRowPinned, rowBookExempt) {
    const w = wtdExp(levRow, acct);
    const ci = rules.find(r => r.acctNum === acct)?.ci ?? 0;
    const accCol = COLORS[ci];
    const bookMutes =
      !isDefaultRow && gridLocked && !rowBookExempt;
    const lockedMuted =
      !isDefaultRow && (bookMutes || !!tickerRowPinned);
    const cls =
      'fa-aum-wtd-col r' + (lockedMuted ? ' fa-aum-wtd-col--derived-locked' : '');
    const colStyle = lockedMuted ? '' : ' style="color:' + accCol + '"';
    return '<td class="' + cls + '"' + colStyle + '>$' + w.toFixed(0) + 'M</td>';
  }

  function faAumTickerMenuCell(symRaw) {
    const symAttr = faAumEscHtml(symRaw);
    const pin = faAumTickerRowIsDefaultLocked(bookKey, symRaw);
    const bookExempt = faAumTickerRowIsBookLockExempt(bookKey, symRaw);
    const lockedByBook = gridLocked && !bookExempt;
    const toggleLabel =
      pin || lockedByBook ? 'Use Adjusted' : 'Use Default';
    return '<td class="trades-col-menu">' +
      '<div class="fa-aum-ticker-menu-wrap" data-aum-book="' + faAumEscHtml(bookKey) + '" data-aum-symbol="' + symAttr + '">' +
      '<button type="button" class="trades-row-menu-btn fa-aum-ticker-menu-btn" aria-label="Row actions" aria-expanded="false" aria-haspopup="true" onclick="toggleFaAumTickerRowMenu(event,this)">' +
      '<i class="fas fa-ellipsis-vertical" aria-hidden="true"></i></button>' +
      '<div class="fa-aum-ticker-menu-dropdown" role="menu">' +
      '<button type="button" role="menuitem" class="fa-aum-ticker-menu-item" onclick="faAumTickerRowMenuToggleDefault(this)">' +
      toggleLabel +
      '</button>' +
      '<button type="button" role="menuitem" class="fa-aum-ticker-menu-item fa-aum-ticker-menu-item--delete" onclick="faAumTickerRowMenuDelete(this)">Delete</button>' +
      '</div></div></td>';
  }

  const faAumTickerMenuEmpty = '<td class="trades-col-menu"></td>';

  const tickerRows = cfg.tickers.map(t => {
    const pcts = splitPct(t.lev);
    const sym = faAumEscHtml(t.symbol);
    const nm = faAumEscHtml(t.name);
    const pin = faAumTickerRowIsDefaultLocked(bookKey, t.symbol);
    const bookExempt = faAumTickerRowIsBookLockExempt(bookKey, t.symbol);
    const rowLockedCls =
      (gridLocked && !bookExempt ? ' fa-aum-matrix-row--locked' : '') +
      (pin && !gridLocked ? ' fa-aum-matrix-row--ticker-default-locked' : '');
    return (
      '<tr class="fa-aum-matrix-row' +
      rowLockedCls +
      '" data-fa-aum-ticker-row="' +
      faAumEscHtml(t.symbol) +
      '">' +
      faAumTickerMenuCell(t.symbol) +
      '<td class="fa-aum-ticker-cell">' +
        '<span class="product-label fa-aum-ticker-product-label">' +
          '<span class="bracket">[</span><span class="short-name">' + sym + '</span><span class="bracket">]</span> ' + nm +
        '</span>' +
      '</td>' +
      '<td class="fa-aum-split-col">' + splitChips(pcts) + '</td>' +
      accts
        .map(a =>
          levCell(a, t.lev[a] ?? 1, levOverridesDefault(a, t.lev[a] ?? 1), t.symbol) +
          wtdCell(t.lev, a, false, pin, bookExempt)
        )
        .join('') +
      '<td class="fa-aum-spacer-cell" aria-hidden="true"></td>' +
      '</tr>'
    );
  }).join('');

  const defPcts = splitPct(cfg.default);
  const defaultRow =
    '<tr class="fa-aum-matrix-row fa-aum-matrix-row--default" style="background:#f8fafc;border-top:2px solid var(--border)">' +
    faAumTickerMenuEmpty +
    '<td class="fa-aum-ticker-cell"><span class="fa-mapping-nav-default-ticker">All other tickers</span></td>' +
    '<td class="fa-aum-split-col">' + splitChips(defPcts) + '</td>' +
    accts.map(a => levCell(a, cfg.default[a] ?? 1, false, '__default__') + wtdCell(cfg.default, a, true, false, false)).join('') +
    '<td class="fa-aum-spacer-cell" aria-hidden="true"></td>' +
    '</tr>';

  body.innerHTML = tickerRows + defaultRow;
  refreshFaAumBookFcmKeyAndThead(bookKey);
  faAumRefreshBookModeButtons();
}

function deleteTicker(bookKey, sym) {
  const cfg = TICKER_LEV_DATA[bookKey];
  if (!cfg) return;
  faAumClearLevUserEditedForTicker(bookKey, sym);
  faAumTickerRowSetDefaultLocked(bookKey, sym, false);
  faAumTickerRowSetBookLockExempt(bookKey, sym, false);
  cfg.tickers = cfg.tickers.filter(t => t.symbol !== sym);
  renderTickerMatrix(bookKey);
}

function faAumNtUpdateWtdForLine(inp) {
  const line = inp && inp.closest('.fa-aum-nt-account-line');
  if (!line) return;
  const acct = line.getAttribute('data-acct-num');
  const wtdEl = line.querySelector('[data-aum-nt-wtd]');
  if (!acct || !wtdEl) return;
  const aum = AUM_DATA[acct]?.aum || 0;
  const lv = parseFloat(inp.value);
  const lev = Number.isFinite(lv) ? Math.max(0, lv) : 0;
  wtdEl.textContent = '$' + (aum * lev).toFixed(0) + 'M';
}

function openFaAumNewTickerModal(bookKey) {
  const overlay = document.getElementById('modal-fa-aum-new-ticker');
  const book = AUM_BOOKS[bookKey];
  if (!overlay || !book) return;
  faAumDerivedGridUnlock(bookKey);
  renderTickerMatrix(bookKey);
  const bkHidden = document.getElementById('fa-aum-nt-book-key');
  if (bkHidden) bkHidden.value = bookKey;
  const titleEl = document.getElementById('fa-aum-nt-title');
  if (titleEl) titleEl.textContent = 'New Ticker Leverage for ' + book.bookName;
  const symInp = document.getElementById('fa-aum-nt-symbol');
  const nameInp = document.getElementById('fa-aum-nt-name');
  if (symInp) symInp.value = '';
  if (nameInp) nameInp.value = '';
  const scroll = document.getElementById('fa-aum-nt-accounts-scroll');
  if (!scroll) return;
  const rules = (BOOK_RULES[book.bookName] || []).filter(r => r.status === 'active');
  scroll.innerHTML = rules
    .map(r => {
      const d = AUM_DATA[r.acctNum] || { client: r.fcm, aum: 0 };
      const client = faAumEscHtml(d.client || r.fcm || '');
      const acctAttr = faAumEscHtml(r.acctNum);
      const aum = d.aum || 0;
      const lev = 1;
      const wtd = aum * lev;
      const accCol = COLORS[r.ci ?? 0];
      const levTitle = '1.0× matches AUM-weighted baseline for this account; other values tilt exposure for this ticker.';
      return (
        '<div class="fa-aum-nt-account-line" data-acct-num="' +
        acctAttr +
        '" style="--fa-aum-nt-accent:' + accCol + '">' +
        '<span class="fa-aum-nt-account-line__client-wrap">' +
        '<span class="fa-aum-nt-account-dot" aria-hidden="true"></span>' +
        '<span class="fa-aum-nt-account-line__client" title="' +
        client +
        '">' +
        client +
        '</span></span>' +
        '<input type="number" class="form-input fa-aum-nt-lev-input" min="0" step="0.1" value="' +
        lev +
        '" title="' +
        faAumEscHtml(levTitle) +
        '" oninput="faAumNtUpdateWtdForLine(this)">' +
        '<span class="fa-aum-nt-wtd-display" data-aum-nt-wtd>$' +
        wtd.toFixed(0) +
        'M</span>' +
        '</div>'
      );
    })
    .join('');
  overlay.style.display = 'flex';
  if (symInp) symInp.focus();
}

function closeFaAumNewTickerModal() {
  const overlay = document.getElementById('modal-fa-aum-new-ticker');
  if (overlay) overlay.style.display = 'none';
}

function submitFaAumNewTickerModal() {
  const bookKey = (document.getElementById('fa-aum-nt-book-key')?.value || '').trim();
  if (!bookKey || !TICKER_LEV_DATA[bookKey]) return;
  const sym = (document.getElementById('fa-aum-nt-symbol')?.value || '').trim().toUpperCase();
  const name = (document.getElementById('fa-aum-nt-name')?.value || '').trim();
  if (!sym) {
    alert('Symbol is required');
    return;
  }
  const cfg = TICKER_LEV_DATA[bookKey];
  if (cfg.tickers.find(t => t.symbol === sym)) {
    alert(sym + ' already exists');
    return;
  }
  const scroll = document.getElementById('fa-aum-nt-accounts-scroll');
  if (!scroll) return;
  const lev = {};
  scroll.querySelectorAll('.fa-aum-nt-account-line').forEach(line => {
    const acct = line.getAttribute('data-acct-num');
    if (!acct) return;
    const inp = line.querySelector('.fa-aum-nt-lev-input');
    const parsed = inp ? parseFloat(inp.value) : NaN;
    lev[acct] = Number.isFinite(parsed) ? Math.max(0, parsed) : 1;
  });
  cfg.tickers.push({ symbol: sym, name: name || sym, lev });
  closeFaAumNewTickerModal();
  renderTickerMatrix(bookKey);
}

function applyAumToMapping(key, bookName) {
  const rules = (BOOK_RULES[bookName] || []).filter(r => r.status === 'active');
  // Use “All other tickers” (cfg.default) leverage as the baseline ratio
  const defLev = (TICKER_LEV_DATA[key] || {}).default || {};
  const totalWtd = rules.reduce((s, r) => {
    return s + (AUM_DATA[r.acctNum]?.aum || 0) * (defLev[r.acctNum] || 1);
  }, 0);
  if (totalWtd === 0) return;

  const lines = rules.map(r => {
    const wtd = (AUM_DATA[r.acctNum]?.aum || 0) * (defLev[r.acctNum] || 1);
    return r.fcm + ': ' + (wtd / totalWtd * 100).toFixed(1) + '%';
  }).join(', ');

  if (!confirm('Apply derived ratios to Mapping Rules for ' + bookName + '?\n\n' + lines + '\n\nThis will update the active target percentages.')) return;

  rules.forEach(r => {
    const wtd = (AUM_DATA[r.acctNum]?.aum || 0) * (defLev[r.acctNum] || 1);
    r.target  = parseFloat((wtd / totalWtd).toFixed(4));
  });

  renderTickerMatrix(key);
  if (typeof renderAllBookCards === 'function') renderAllBookCards();
}

/** Bump when default ratio changes so users get the new default. */
const FA_AUM_SPLIT_STORAGE = 'fa-aum-split-client-px-v3';
const FA_AUM_SPLIT_MIN_TOP = 120;
const FA_AUM_SPLIT_MIN_BOTTOM = 160;

function initSettingsPageSplit() {
  const wrap = document.getElementById('fa-settings-page-split');
  const topPane = document.getElementById('fa-settings-split-pane-accounts');
  const resizer = document.getElementById('fa-settings-split-resizer');
  if (!wrap || !topPane || !resizer) return;

  function clampTopHeight(px) {
    const total = wrap.getBoundingClientRect().height;
    const grip = resizer.offsetHeight || 10;
    const maxTop = total - FA_AUM_SPLIT_MIN_BOTTOM - grip;
    if (!Number.isFinite(maxTop) || maxTop < FA_AUM_SPLIT_MIN_TOP) return FA_AUM_SPLIT_MIN_TOP;
    return Math.max(FA_AUM_SPLIT_MIN_TOP, Math.min(px, maxTop));
  }

  function applyTopHeight(px) {
    const h = clampTopHeight(px);
    topPane.style.flex = 'none';
    topPane.style.height = h + 'px';
    // Avoid locking in fallback px when split height was 0 on first paint.
    const total = wrap.getBoundingClientRect().height;
    if (total <= 0) return;
    try {
      localStorage.setItem(FA_AUM_SPLIT_STORAGE, String(Math.round(h)));
    } catch (_) {}
  }

  function defaultTopHeight() {
    const total = wrap.getBoundingClientRect().height;
    if (total > 0) return clampTopHeight(total * 0.3);
    return 255;
  }

  function restoreOrDefault() {
    let h = NaN;
    try {
      h = parseInt(localStorage.getItem(FA_AUM_SPLIT_STORAGE) || '', 10);
    } catch (_) {}
    if (Number.isFinite(h) && h > 0) {
      applyTopHeight(h);
    } else {
      applyTopHeight(defaultTopHeight());
    }
  }

  let dragStartY = 0;
  let dragStartH = 0;

  function onPointerMove(e) {
    applyTopHeight(dragStartH + (e.clientY - dragStartY));
  }

  function onPointerUp() {
    document.removeEventListener('mousemove', onPointerMove);
    document.removeEventListener('mouseup', onPointerUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  resizer.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return;
    e.preventDefault();
    dragStartY = e.clientY;
    dragStartH = topPane.getBoundingClientRect().height;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);
  });

  resizer.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    dragStartY = e.touches[0].clientY;
    dragStartH = topPane.getBoundingClientRect().height;
    function onTouchMove(te) {
      if (te.touches.length !== 1) return;
      te.preventDefault();
      applyTopHeight(dragStartH + (te.touches[0].clientY - dragStartY));
    }
    function onTouchEnd() {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchcancel', onTouchEnd);
    }
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
    document.addEventListener('touchcancel', onTouchEnd);
  }, { passive: false });

  resizer.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    const step = e.shiftKey ? 48 : 16;
    const delta = e.key === 'ArrowUp' ? -step : step;
    applyTopHeight(topPane.getBoundingClientRect().height + delta);
  });

  window.addEventListener('resize', function () {
    applyTopHeight(topPane.getBoundingClientRect().height);
  });

  restoreOrDefault();
  requestAnimationFrame(restoreOrDefault);
}

// ─── Add Account modal (Client Accounts) ─────────────────────────────────────
/** ISO date string (YYYY-MM-DD) → display like existing AUM rows (e.g. Mar 1, 2026). */
function faAumFormatModalAsOf(isoYmd) {
  if (!isoYmd || typeof isoYmd !== 'string') return '—';
  const parts = isoYmd.trim().split('-');
  if (parts.length !== 3) return isoYmd.trim();
  const y = parseInt(parts[0], 10);
  const mo = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  const dt = new Date(y, mo, d);
  if (Number.isNaN(dt.getTime())) return isoYmd.trim();
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function molValidationHasValueFaAum(el) {
  if (!el) return false;
  const raw = String(el.value ?? '').trim();
  return raw.length > 0;
}

function syncMolValidationForInputFaAum(el) {
  if (!el) return;
  const wrap = el.closest('.mol-validation');
  if (!wrap && !(el.classList && el.classList.contains('mol-validation'))) return;
  const target = wrap || el;
  target.classList.toggle('mol-validation--valid', molValidationHasValueFaAum(el));
}

function refreshFaAumAddAccountMolValidation() {
  ['fa-aum-aa-client', 'fa-aum-aa-acct', 'fa-aum-aa-fcm', 'fa-aum-aa-aum', 'fa-aum-aa-asof'].forEach(id => {
    syncMolValidationForInputFaAum(document.getElementById(id));
  });
}

function bindFaAumAddAccountMolValidation() {
  const modal = document.getElementById('modal-fa-aum-add-account');
  if (!modal) return;
  const onField = e => {
    const t = e.target;
    if (!(t instanceof HTMLInputElement || t instanceof HTMLSelectElement || t instanceof HTMLTextAreaElement)) return;
    const type = t.type;
    if (type === 'checkbox' || type === 'radio' || type === 'hidden' || type === 'file') return;
    if (!t.classList.contains('mol-validation')) return;
    syncMolValidationForInputFaAum(t);
  };
  modal.addEventListener('input', onField);
  modal.addEventListener('change', onField);
}

function openFaAumAddAccountModal() {
  const modal = document.getElementById('modal-fa-aum-add-account');
  if (!modal) return;
  document.getElementById('fa-aum-aa-client').value = '';
  document.getElementById('fa-aum-aa-acct').value = '';
  document.getElementById('fa-aum-aa-fcm').value = '';
  document.getElementById('fa-aum-aa-aum').value = '';
  var asofEl = document.getElementById('fa-aum-aa-asof');
  if (asofEl) {
    var t = new Date();
    asofEl.value =
      t.getFullYear() +
      '-' +
      String(t.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(t.getDate()).padStart(2, '0');
  }
  modal.querySelectorAll('.mol-validation').forEach(el => el.classList.remove('mol-validation--valid'));
  modal.style.display = 'flex';
  refreshFaAumAddAccountMolValidation();
}

function closeFaAumAddAccountModal() {
  const modal = document.getElementById('modal-fa-aum-add-account');
  if (modal) modal.style.display = 'none';
}

function saveFaAumAddAccount() {
  const client = document.getElementById('fa-aum-aa-client').value.trim();
  const acct = document.getElementById('fa-aum-aa-acct').value.trim();
  const fcm = document.getElementById('fa-aum-aa-fcm').value.trim();
  const aumRaw = document.getElementById('fa-aum-aa-aum').value.trim();
  const asOfIso = document.getElementById('fa-aum-aa-asof').value.trim();
  refreshFaAumAddAccountMolValidation();
  if (!client || !acct || !fcm || !aumRaw || !asOfIso) {
    alert('Please fill in all required fields.');
    return;
  }
  const aumNum = parseFloat(aumRaw.replace(/,/g, ''));
  if (!Number.isFinite(aumNum) || aumNum < 0) {
    alert('Please enter a valid AUM ($M).');
    return;
  }
  if (AUM_DATA[acct]) {
    alert('An account with this number already exists.');
    return;
  }
  AUM_DATA[acct] = {
    client,
    fcm,
    aum: aumNum,
    asOf: faAumFormatModalAsOf(asOfIso),
    updatedBy: '—',
  };
  renderAumTables();
  if (typeof renderAllBookCards === 'function') renderAllBookCards();
  closeFaAumAddAccountModal();
}

/** settings.html — optional scroll target from URL hash (legacy #aum / #mapping-rules links). */
function faApplySettingsTabFromHash() {
  var h = (location.hash || '').replace(/^#/, '').toLowerCase();
  if (!h) return;
  try {
    var el = document.getElementById('fa-settings-page-anchor') || document.getElementById('fa-settings-page-split');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (e) {
    /* ignore */
  }
}

function initFaAumRatiosEmbedded() {
  try {
    bindFaAumAddAccountMolValidation();
    if (document.getElementById('fa-settings-mapping-books-expand-all')) {
      const prev = window.faOnBookCardCollapseChanged;
      window.faOnBookCardCollapseChanged = function faSettingsBookCardCollapseCombined() {
        if (typeof prev === 'function') prev();
        faRefreshMappingRulesBooksExpandCollapseButtons();
      };
    }
    function layoutSplit() {
      initSettingsPageSplit();
      renderAumTables();
    }
    layoutSplit();
    var aumBooksRoot = document.getElementById('fa-settings-mapping-books-root');
    if (aumBooksRoot && typeof window.faPresetBookCardsCollapsed === 'function') {
      window.faPresetBookCardsCollapsed(aumBooksRoot, true);
    }
    faApplySettingsTabFromHash();
  } catch (e) {
    console.error(e);
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFaAumRatiosEmbedded);
} else {
  initFaAumRatiosEmbedded();
}

/** Fallback after full load + in-page hash changes (primary apply is end of initFaAumRatiosEmbedded). */
(function faSettingsTabsFromHashOnLoad() {
  function deferred() {
    setTimeout(faApplySettingsTabFromHash, 0);
  }
  window.addEventListener('load', deferred, { once: true });
  window.addEventListener('hashchange', faApplySettingsTabFromHash);
})();

window.addEventListener(
  'resize',
  function () {
    faAumViewDefaultLevTipHide();
  },
  { passive: true }
);

/** settings.html — after Mapping Rules data changes (edit book, SMA row, etc.), refresh AUM grids + client table. */
window.faRefreshAumEmbeddedAfterMappingChange = renderAumTables;
