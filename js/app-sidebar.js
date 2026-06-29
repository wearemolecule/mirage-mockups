/**
 * Reusable app sidebar: installs shell, renders nav, corrects paths for site root vs subfolders (fund-allocations/, actualization/).
 * Opt-in: add class app-sidebar-enabled on <body>.
 * Optional: window.__APP_SIDEBAR = { hide: ['trades', …] }; — item ids include acct-* placeholders under Account Settings.
 *
 * Header chrome: add <div class="app-header-mount"></div> as the first child of <body> (before .main).
 * Loaded via js/app-header.js (see that file for __APP_HEADER.accountName / __APP_HEADER_REGION).
 *
 * Script order: app-path.js, app-header.js, certificate-inventory-badges.js (optional), then this file.
 */
(function () {
  'use strict';

  var P = typeof window !== 'undefined' && window.__APP_PATH;
  if (!P || typeof P.pathSegments !== 'function' || typeof P.rootPrefix !== 'function') {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('app-sidebar.js: load js/app-path.js before this script.');
    }
    return;
  }

  function pathSegments() {
    return P.pathSegments();
  }

  function isUnderFundAllocationsFolder() {
    return P.isUnderFundAllocationsFolder();
  }

  function isUnderActualizationFolder() {
    return P.isUnderActualizationFolder();
  }

  function isUnderTradesFolder() {
    return P.isUnderTradesFolder();
  }

  function isUnderCertificateInventoryFolder() {
    return P.isUnderCertificateInventoryFolder();
  }

  function rootPrefix() {
    return P.rootPrefix();
  }

  function groupStorageKey(groupId) {
    return 'app-sidebar-group-' + groupId;
  }

  var NAV = [
    { id: 'trades', label: 'Trades', file: 'trades.html', icon: 'fa-right-left', inTrades: true },
    { id: 'market-data', label: 'Market Data', file: 'market-data.html', icon: 'fa-chart-line' },
    { id: 'invoicing', label: 'Invoicing', file: 'invoicing.html', icon: 'fa-file-invoice-dollar' },
    {
      id: 'fund-allocations',
      label: 'Fund Allocations',
      file: 'fund-allocations.html',
      icon: 'fa-layer-group',
      inFundAllocations: true
    },
    {
      id: 'certificate-inventory',
      label: 'Inventory',
      icon: 'fa-certificate',
      children: [
        {
          id: 'ci-portfolio',
          label: 'Portfolio',
          file: 'portfolio.html',
          inCertificateInventory: true
        },
        {
          id: 'ci-matching',
          label: 'Allocation',
          file: 'matching.html',
          inCertificateInventory: true,
          badgeId: 'app-sidebar-badge-ci-matching'
        },
        {
          id: 'ci-registry-activity',
          label: 'Registry Activity',
          file: 'registry-activity.html',
          inCertificateInventory: true
        }
      ]
    },
    {
      id: 'actualization',
      label: 'Actualization',
      icon: 'fa-route',
      children: [
        {
          id: 'act-nominations',
          label: 'Nominations',
          file: 'nominations.html',
          inActualization: true
        },
        {
          id: 'act-allocations',
          label: 'Allocations',
          file: 'allocations.html',
          inActualization: true
        },
        {
          id: 'act-pipeline-map',
          label: 'Pipeline Maps',
          file: 'pipeline-map.html',
          inActualization: true
        },
        {
          id: 'act-ai-review',
          label: 'AI Review',
          file: 'ai-review.html',
          inActualization: true
        }
      ]
    },
    {
      id: 'account-settings',
      label: 'Account Settings',
      icon: 'fa-gear',
      children: [
        { id: 'acct-books', label: 'Books' },
        { id: 'acct-cme', label: 'CME' },
        { id: 'acct-compliance', label: 'Compliance' },
        { id: 'acct-copy-forward', label: 'Copy-Forward' },
        { id: 'acct-curve-builder', label: 'Curve Builder' },
        { id: 'acct-custom-fields', label: 'Custom Fields' },
        { id: 'acct-fees', label: 'Fees' },
        {
          id: 'fa-settings',
          label: 'Fund Allocations',
          file: 'settings.html',
          inFundAllocations: true
        },
        { id: 'acct-ice', label: 'ICE' },
        { id: 'acct-inventory', label: 'Inventory' },
        { id: 'acct-products', label: 'Products' },
        { id: 'acct-risk-limits', label: 'Risk Limits' },
        { id: 'acct-access-control', label: 'Access Control' },
        { id: 'acct-user-settings', label: 'User Settings' },
        { id: 'acct-workflows', label: 'Workflows' }
      ]
    }
  ];

  function hrefForFile(file, inFundAllocations, inActualization, inTrades, inCertificateInventory) {
    var r = rootPrefix();
    if (inFundAllocations) {
      return isUnderFundAllocationsFolder() ? file : r + 'fund-allocations/' + file;
    }
    if (inActualization) {
      return isUnderActualizationFolder() ? file : r + 'actualization/' + file;
    }
    if (inTrades) {
      return isUnderTradesFolder() ? file : r + 'trades/' + file;
    }
    if (inCertificateInventory) {
      return isUnderCertificateInventoryFolder() ? file : r + 'certificate-inventory/' + file;
    }
    return r + file;
  }

  function logoSrc() {
    return rootPrefix() + 'images/logo-molecule.svg';
  }

  function currentFile() {
    var segs = pathSegments();
    if (!segs.length) return '';
    var last = segs[segs.length - 1];
    try {
      last = decodeURIComponent(last);
    } catch (e) { /* keep raw */ }
    var q = last.indexOf('?');
    if (q !== -1) last = last.slice(0, q);
    var h = last.indexOf('#');
    if (h !== -1) last = last.slice(0, h);
    return last;
  }

  function hideSet() {
    var cfg = window.__APP_SIDEBAR || {};
    var hide = cfg.hide;
    if (!hide || !hide.length) return new Set();
    return new Set(hide);
  }

  function filterNav(items, hidden) {
    var out = [];
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (hidden.has(it.id)) continue;
      if (it.children) {
        var kids = filterNav(it.children, hidden);
        if (!kids.length) continue;
        var copy = {};
        for (var k in it) if (Object.prototype.hasOwnProperty.call(it, k) && k !== 'children') copy[k] = it[k];
        copy.children = kids;
        out.push(copy);
      } else {
        out.push(it);
      }
    }
    return out;
  }

  function installShell() {
    var body = document.body;
    body.classList.add('app-with-sidebar');
    var aside = document.createElement('aside');
    aside.className = 'app-sidebar';
    aside.setAttribute('aria-label', 'Primary navigation');

    var wrap = document.createElement('div');
    wrap.className = 'app-main';
    var firstEl = body.firstElementChild;
    if (firstEl) {
      body.insertBefore(aside, firstEl);
    } else {
      body.appendChild(aside);
    }
    var el = aside.nextElementSibling;
    while (el) {
      var next = el.nextElementSibling;
      wrap.appendChild(el);
      el = next;
    }
    while (aside.nextSibling) {
      body.removeChild(aside.nextSibling);
    }
    body.appendChild(wrap);
    return aside;
  }

  function groupStartsOpen(item, activeFile) {
    var childActive = false;
    for (var j = 0; j < item.children.length; j++) {
      var cj = item.children[j];
      if (cj.file && cj.file === activeFile) childActive = true;
    }
    var open = childActive;
    try {
      var st = sessionStorage.getItem(groupStorageKey(item.id));
      if (st === '1') open = true;
      if (st === '0' && !childActive) open = false;
    } catch (e) { /* ignore */ }
    return open;
  }

  function renderSidebar(aside) {
    var hidden = hideSet();
    var items = filterNav(NAV, hidden);
    var file = currentFile();

    var brand = document.createElement('div');
    brand.className = 'app-sidebar__brand';
    var logoA = document.createElement('a');
    logoA.href = rootPrefix() + 'index.html';
    logoA.setAttribute('aria-label', 'Molecule — Mirage mockups home');
    var img = document.createElement('img');
    img.src = logoSrc();
    img.alt = 'Molecule';
    img.width = 200;
    img.height = 57;
    logoA.appendChild(img);
    brand.appendChild(logoA);

    var nav = document.createElement('nav');
    nav.className = 'app-sidebar__nav';
    nav.setAttribute('aria-label', 'Screens');

    for (var n = 0; n < items.length; n++) {
      nav.appendChild(buildItemEl(items[n], file));
    }

    aside.appendChild(brand);
    aside.appendChild(nav);
  }

  function buildItemEl(item, activeFile) {
    if (item.children) {
      return buildGroupEl(item, activeFile, groupStartsOpen(item, activeFile));
    }
    var a = document.createElement('a');
    a.className = 'app-sidebar__link' + (item.file === activeFile ? ' app-sidebar__link--active' : '');
    a.href = hrefForFile(
      item.file,
      item.inFundAllocations,
      item.inActualization,
      item.inTrades,
      item.inCertificateInventory
    );
    a.innerHTML =
      '<span class="app-sidebar__icon"><i class="fas ' +
      item.icon +
      '" aria-hidden="true"></i></span><span>' +
      escapeHtml(item.label) +
      '</span>';
    return a;
  }

  function buildGroupEl(item, activeFile, open) {
    var wrap = document.createElement('div');
    wrap.className = 'app-sidebar__group';
    var id = 'app-sidebar-sub-' + item.id;
    var childActive = false;
    for (var i = 0; i < item.children.length; i++) {
      var ci = item.children[i];
      if (ci.file && ci.file === activeFile) childActive = true;
    }
    if (open) wrap.classList.add('app-sidebar__group--open');

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className =
      'app-sidebar__group-toggle' + (childActive ? ' app-sidebar__group-toggle--active' : '');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-controls', id);
    btn.innerHTML =
      '<span class="app-sidebar__icon"><i class="fas ' +
      item.icon +
      '" aria-hidden="true"></i></span><span>' +
      escapeHtml(item.label) +
      '</span><span class="app-sidebar__chev" aria-hidden="true"><i class="fas fa-chevron-down"></i></span>';

    var sub = document.createElement('ul');
    sub.className = 'app-sidebar__sub';
    sub.id = id;
    sub.hidden = !open;

    for (var j = 0; j < item.children.length; j++) {
      var ch = item.children[j];
      var li = document.createElement('li');
      var isLink = Boolean(ch.file);
      var row = isLink ? document.createElement('a') : document.createElement('span');
      row.className =
        'app-sidebar__sub-link' +
        (isLink && ch.file === activeFile ? ' app-sidebar__sub-link--active' : '') +
        (!isLink ? ' app-sidebar__sub-link--placeholder' : '');
      if (isLink) {
        row.href = hrefForFile(
          ch.file,
          ch.inFundAllocations,
          ch.inActualization,
          ch.inTrades,
          ch.inCertificateInventory
        );
      } else {
        row.setAttribute('aria-disabled', 'true');
      }
      row.innerHTML =
        '<span class="app-sidebar__sub-dash" aria-hidden="true">-</span>' +
        '<span class="app-sidebar__sub-label-row">' +
          '<span class="app-sidebar__sub-label">' +
          escapeHtml(ch.label) +
          '</span>' +
          (ch.badgeId
            ? '<span class="app-count-badge app-sidebar__count-badge" id="' +
              escapeHtml(ch.badgeId) +
              '" hidden aria-live="polite"></span>'
            : '') +
        '</span>';
      li.appendChild(row);
      sub.appendChild(li);
    }

    btn.addEventListener('click', function () {
      var isOpen = wrap.classList.toggle('app-sidebar__group--open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      sub.hidden = !isOpen;
      try {
        sessionStorage.setItem(groupStorageKey(item.id), isOpen ? '1' : '0');
      } catch (e) { /* ignore */ }
    });

    wrap.appendChild(btn);
    wrap.appendChild(sub);
    return wrap;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  if (!document.body || !document.body.classList.contains('app-sidebar-enabled')) return;

  var aside = installShell();
  renderSidebar(aside);
  if (typeof window.refreshMatchingSidebarBadge === 'function') {
    window.refreshMatchingSidebarBadge();
  }
  if (typeof window.mountAppHeader === 'function') {
    window.mountAppHeader();
  }
})();
