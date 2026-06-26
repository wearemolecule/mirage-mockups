/**
 * Tab behavior for [data-tabs-stack] using .tabs-stack__tab and .tabs-stack__panel.
 *
 * Optional URL sync: add data-tabs-stack-sync-hash on the stack.
 * Default tab (omitted from URL): data-tabs-stack-default="legs"
 * Examples: trades/trade-edit.html?id=83273#transfer  or  ?tab=transfer
 */
(function () {
  'use strict';

  function getStack(el) {
    return el && el.closest && el.closest('[data-tabs-stack]');
  }

  function getDefaultPanelKey(stack) {
    var attr = stack.getAttribute('data-tabs-stack-default');
    if (attr) return attr;
    var initial = stack.querySelector('.tabs-stack__tab.active');
    return initial ? initial.getAttribute('data-tab-panel') : '';
  }

  function isValidPanelKey(stack, panelKey) {
    if (!panelKey) return false;
    var tabs = stack.querySelectorAll('.tabs-stack__tab');
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].getAttribute('data-tab-panel') === panelKey) return true;
    }
    return false;
  }

  function resolvePanelKeyFromUrl(stack) {
    var hash = (location.hash || '').replace(/^#/, '');
    if (hash) {
      hash = hash.toLowerCase();
      if (isValidPanelKey(stack, hash)) return hash;
    }
    try {
      var tab = new URLSearchParams(location.search).get('tab');
      if (tab) {
        tab = tab.toLowerCase();
        if (isValidPanelKey(stack, tab)) return tab;
      }
    } catch (e) { /* ignore */ }
    return null;
  }

  function syncHashFromPanel(stack, panelKey) {
    if (!stack.hasAttribute('data-tabs-stack-sync-hash')) return;
    var defaultKey = getDefaultPanelKey(stack);
    var url = new URL(location.href);
    if (panelKey && panelKey !== defaultKey) {
      url.hash = panelKey;
    } else {
      url.hash = '';
    }
    var next = url.pathname + url.search + url.hash;
    var current = location.pathname + location.search + location.hash;
    if (current !== next) {
      history.replaceState(null, '', next);
    }
  }

  function activate(stack, panelKey) {
    if (!stack || panelKey == null || panelKey === '') return;

    var tabs = stack.querySelectorAll('.tabs-stack__tab');
    var panels = stack.querySelectorAll('.tabs-stack__panel');

    var targetTab = null;
    tabs.forEach(function (t) {
      if (t.getAttribute('data-tab-panel') === panelKey) targetTab = t;
    });
    if (targetTab && targetTab.classList.contains('disabled')) return;

    tabs.forEach(function (tab) {
      var key = tab.getAttribute('data-tab-panel');
      var on = key === panelKey;
      tab.classList.toggle('active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    panels.forEach(function (panel) {
      var key = panel.getAttribute('data-tab-panel');
      var on = key === panelKey;
      panel.classList.toggle('active', on);
      if (on) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
    });

    var actionGroups = stack.querySelectorAll('.tabs-stack__actions[data-tab-panel]');
    if (actionGroups.length) {
      actionGroups.forEach(function (group) {
        var key = group.getAttribute('data-tab-panel');
        var on = key === panelKey;
        if (on) group.removeAttribute('hidden');
        else group.setAttribute('hidden', '');
      });
    }

    syncHashFromPanel(stack, panelKey);
  }

  function onStackClick(e) {
    var tab = e.target.closest('.tabs-stack__tab');
    if (!tab || !getStack(tab)) return;
    if (tab.classList.contains('disabled')) return;
    var key = tab.getAttribute('data-tab-panel');
    if (key == null) return;
    activate(getStack(tab), key);
  }

  function applyUrlToStack(stack) {
    var key = resolvePanelKeyFromUrl(stack);
    if (key) activate(stack, key);
  }

  function initStack(stack) {
    if (stack._tabsStackBound) return;
    stack._tabsStackBound = true;
    stack.addEventListener('click', onStackClick);

    var urlKey = resolvePanelKeyFromUrl(stack);
    if (urlKey) {
      activate(stack, urlKey);
    } else {
      var initial = stack.querySelector('.tabs-stack__tab.active');
      if (initial && !initial.classList.contains('disabled')) {
        activate(stack, initial.getAttribute('data-tab-panel'));
      }
    }

    if (stack.hasAttribute('data-tabs-stack-sync-hash') && !stack._tabsStackHashBound) {
      stack._tabsStackHashBound = true;
      window.addEventListener('hashchange', function () {
        applyUrlToStack(stack);
      });
    }
  }

  function initAll() {
    document.querySelectorAll('[data-tabs-stack]').forEach(initStack);
  }

  /**
   * Activate a tab panel programmatically (e.g. deep link or “Configure in AUM” from Mapping Rules).
   * @param {string} panelKey — value of data-tab-panel on the tab button
   * @param {Element|null} stackRoot — optional [data-tabs-stack] element; defaults to document’s first stack
   */
  window.activateTabsStackPanel = function (panelKey, stackRoot) {
    var stack = stackRoot || document.querySelector('[data-tabs-stack]');
    activate(stack, panelKey);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
