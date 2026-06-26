/**
 * App chrome header: replaces each .app-header-mount with account name and region + user.
 * Optional window.__APP_HEADER = { accountName }; body[data-app-header-account] overrides.
 * Defaults by path: fund-allocations/* → Pegasus Partners; actualization/* → Buffalo; site root → Big Data Energy.
 * Region/user: window.__APP_HEADER_REGION = { userName, userInitial, regionCode, regionTitle }.
 * Requires js/app-path.js first (window.__APP_PATH).
 */
(function () {
  'use strict';

  function isFA() {
    var P = typeof window !== 'undefined' && window.__APP_PATH;
    return P && typeof P.isUnderFundAllocationsFolder === 'function' && P.isUnderFundAllocationsFolder();
  }

  function isActualization() {
    var P = typeof window !== 'undefined' && window.__APP_PATH;
    return P && typeof P.isUnderActualizationFolder === 'function' && P.isUnderActualizationFolder();
  }

  function headerAccountName() {
    var d = isFA() ? 'Pegasus Partners' : isActualization() ? 'Buffalo' : 'Big Data Energy';
    var ds = document.body && document.body.dataset ? document.body.dataset : {};
    var w = typeof window !== 'undefined' && window.__APP_HEADER ? window.__APP_HEADER : {};
    if (w.accountName != null) return String(w.accountName);
    if (ds.appHeaderAccount != null) return String(ds.appHeaderAccount);
    return d;
  }

  function headerRegionConfig() {
    var c = typeof window !== 'undefined' && window.__APP_HEADER_REGION ? window.__APP_HEADER_REGION : {};
    return {
      userName: c.userName != null ? String(c.userName) : 'Jane Doe',
      userInitial: c.userInitial != null ? String(c.userInitial) : 'J',
      regionCode: c.regionCode != null ? String(c.regionCode) : 'NA',
      regionTitle: c.regionTitle != null ? String(c.regionTitle) : 'North America'
    };
  }

  function createHeaderRegionUserEl() {
    var cfg = headerRegionConfig();
    var wrap = document.createElement('div');
    wrap.className = 'header-region-user';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Region and account');

    var pill = document.createElement('span');
    pill.className = 'header-region-pill';
    pill.title = cfg.regionTitle;
    var locIcon = document.createElement('i');
    locIcon.className = 'fas fa-location-dot header-region-pill__icon';
    locIcon.setAttribute('aria-hidden', 'true');
    var code = document.createElement('span');
    code.className = 'header-region-pill__code';
    code.textContent = cfg.regionCode;
    pill.appendChild(locIcon);
    pill.appendChild(code);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'header-user-trigger';
    btn.setAttribute('aria-haspopup', 'menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Account menu, ' + cfg.userName);
    var av = document.createElement('span');
    av.className = 'header-user-avatar';
    av.setAttribute('aria-hidden', 'true');
    av.textContent = cfg.userInitial;
    var nm = document.createElement('span');
    nm.className = 'header-user-name';
    nm.textContent = cfg.userName;
    var ch = document.createElement('i');
    ch.className = 'fas fa-chevron-down header-user-chevron';
    ch.setAttribute('aria-hidden', 'true');
    btn.appendChild(av);
    btn.appendChild(nm);
    btn.appendChild(ch);

    wrap.appendChild(pill);
    wrap.appendChild(btn);
    return wrap;
  }

  function createAppHeaderEl() {
    var header = document.createElement('header');
    header.className = 'header';

    var left = document.createElement('div');
    left.className = 'header-left';
    var account = document.createElement('span');
    account.className = 'account-name';
    account.textContent = headerAccountName();
    left.appendChild(account);

    var right = document.createElement('div');
    right.className = 'header-right';
    right.appendChild(createHeaderRegionUserEl());

    header.appendChild(left);
    header.appendChild(right);
    return header;
  }

  function mountAppHeader() {
    var mounts = document.querySelectorAll('.app-header-mount');
    for (var i = 0; i < mounts.length; i++) {
      var m = mounts[i];
      if (!m.parentNode) continue;
      var hdr = createAppHeaderEl();
      m.parentNode.replaceChild(hdr, m);
    }
  }

  if (typeof window !== 'undefined') {
    window.mountAppHeader = mountAppHeader;
  }
})();
