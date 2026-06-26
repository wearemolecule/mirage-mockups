/**
 * Certificate Inventory — Allocation backlog badges (sidebar + queue card).
 * Load before app-sidebar.js on any page that uses the app sidebar.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'ci-matching-batch-count';
  var CLEARED_KEY = 'ci-matching-queue-cleared';
  var DEFAULT_COUNT = 8;

  function batchCountLabel(count) {
    return count + (count === 1 ? ' Item in Certificate Queue' : ' Items in Certificate Queue');
  }

  function syncCountBadge(el, count) {
    if (!el) return;
    if (!count) {
      el.hidden = true;
      el.textContent = '';
      el.removeAttribute('aria-label');
    } else {
      el.hidden = false;
      el.textContent = String(count);
      el.setAttribute('aria-label', batchCountLabel(count));
    }
  }

  function readMatchingBatchCount() {
    if (window.__CI_NAV && window.__CI_NAV.matchingBatchCount != null) {
      return window.__CI_NAV.matchingBatchCount;
    }
    try {
      if (sessionStorage.getItem(CLEARED_KEY) === '1') return 0;
      var stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored == null) return DEFAULT_COUNT;
      var n = parseInt(stored, 10);
      if (isNaN(n) || n <= 0) return DEFAULT_COUNT;
      return n;
    } catch (e) { /* ignore */ }
    return DEFAULT_COUNT;
  }

  function refreshMatchingSidebarBadge() {
    syncCountBadge(
      document.getElementById('app-sidebar-badge-ci-matching'),
      readMatchingBatchCount()
    );
  }

  function setMatchingBatchCount(count) {
    window.__CI_NAV = window.__CI_NAV || {};
    window.__CI_NAV.matchingBatchCount = count;
    try {
      sessionStorage.setItem(STORAGE_KEY, String(count));
      if (count === 0) sessionStorage.setItem(CLEARED_KEY, '1');
      else sessionStorage.removeItem(CLEARED_KEY);
    } catch (e) { /* ignore */ }
    refreshMatchingSidebarBadge();
  }

  function syncMatchingQueueBadge(count) {
    syncCountBadge(document.getElementById('ci-matching-queue-count'), count);
  }

  window.ciSetMatchingBatchCount = setMatchingBatchCount;
  window.ciSyncMatchingQueueBadge = syncMatchingQueueBadge;
  window.refreshMatchingSidebarBadge = refreshMatchingSidebarBadge;

  window.addEventListener('pageshow', refreshMatchingSidebarBadge);
})();
