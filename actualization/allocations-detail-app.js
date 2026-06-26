/**
 * Allocations (detail panel) — row click opens path table in side panel.
 */
(function () {
  'use strict';

  var MIN_PANEL_WIDTH = 300;
  var RESIZE_HANDLE_WIDTH = 24;

  var ALLOC_DETAIL_MESSAGES = {
    locF: '<strong>Allocation failed</strong> — no settlement config in Molecule for NGPL-Mainline + Transmission Co Alpha / Retail Co Alpha. 35,000 Dth scheduled remains unallocated; add a config or apply a manual override.'
  };

  var ALLOC_DETAIL_NOTES = {
    locA: 'Receipt agmts K-88422, K-88423, K-88430, K-88431 (Midstream Co Alpha). Pipeline cut –6,261 Dth prorated across delivery paths by operational rank.',
    locB: 'Receipt agmts K-42234, K-42235, K-42240 (Trading Co Alpha, Trading Co Beta, Trading Co Gamma). Fuel –975 Dth deducted before delivery to Utility Co East.',
    locC: 'Receipt agmt K-55010 (Marketing Co Alpha). Fuel –1,151 Dth deducted on Utility Co Central delivery split.',
    locD: 'PBA cut –10,000 applied pro-rata across Field Services Co Alpha and Producer Co Alpha receipt paths. Delivery agmts K-32001, K-32002 (Utility Co West).',
    locE: 'PAL 962099 · Receipt agmt K-44001 (Marketing Co Alpha). Fuel adj –624 Dth applied on Pipeline Co Alpha delivery.'
  };

  function getEls() {
    return {
      panel: document.getElementById('act-alloc-detail-panel'),
      title: document.getElementById('act-alloc-detail-title'),
      summary: document.getElementById('act-alloc-detail-summary'),
      message: document.getElementById('act-alloc-detail-message'),
      host: document.getElementById('act-alloc-detail-path-host'),
      mainRefineInput: document.getElementById('act-alloc-main-refine-input'),
      refineInput: document.getElementById('act-alloc-detail-refine-input'),
      tableWrapper: document.querySelector('.act-alloc-detail-layout .table-wrapper'),
      contentBottom: document.querySelector('.act-alloc-detail-layout'),
      resizeHandle: document.getElementById('act-alloc-panel-resize-handle'),
      filterPanel: document.querySelector('.act-alloc-detail-filters'),
      tbody: document.getElementById('act-alloc-loc-table-body')
    };
  }

  function populateAllocDetailSummary(row, summaryEl) {
    if (!row || !summaryEl) return;

    var cells = row.querySelectorAll('td');
    var parts = [];
    var locCodeEl = row.querySelector('.act-loc-code');
    var locCode = locCodeEl ? locCodeEl.textContent.trim() : '';

    if (locCode) parts.push(locCode);

    var badge = cells[9] && cells[9].querySelector('.badge');
    if (badge) parts.push(badge.outerHTML);

    var pipeline = cells[2] ? cells[2].textContent.trim() : '';
    if (pipeline) parts.push(pipeline);

    var schQty = cells[3] ? cells[3].textContent.trim() : '';
    if (schQty) parts.push(schQty + ' sch');

    var allocated = cells[5] ? cells[5].textContent.trim() : '';
    if (allocated) parts.push(allocated + ' alloc');

    var variance = cells[6] ? cells[6].textContent.trim() : '';
    if (variance && variance !== '0' && variance !== '—') {
      parts.push('<span class="act-alloc-summary-variance">' + variance + ' var</span>');
    }

    var configs = cells[7] ? cells[7].textContent.trim() : '';
    if (configs) parts.push(configs + ' configs');

    var methodEl = cells[8] && cells[8].querySelector('.act-alloc-method');
    if (methodEl) parts.push(methodEl.textContent.trim());

    summaryEl.innerHTML = parts.join(' • ');
  }

  function populateAllocDetailMessage(locId, messageEl) {
    if (!messageEl) return;

    var html = ALLOC_DETAIL_MESSAGES[locId] || '';
    var note = ALLOC_DETAIL_NOTES[locId] || '';

    if (html) {
      messageEl.innerHTML = html;
      messageEl.className = 'act-alloc-detail-message act-alloc-detail-message--error';
      messageEl.hidden = false;
      return;
    }

    if (note) {
      messageEl.textContent = note;
      messageEl.className = 'act-alloc-detail-message act-alloc-detail-message--info';
      messageEl.hidden = false;
      return;
    }

    messageEl.innerHTML = '';
    messageEl.className = 'act-alloc-detail-message';
    messageEl.hidden = true;
  }

  function countVisibleRows(root, selector) {
    if (!root) return 0;
    var count = 0;
    root.querySelectorAll(selector).forEach(function (row) {
      if (!row.hidden) count++;
    });
    return count;
  }

  function updatePaginationBar(total, pageIndex, pageSize, countEl, pageEl, btnIds) {
    var from = total === 0 ? 0 : pageIndex * pageSize + 1;
    var to = Math.min(total, (pageIndex + 1) * pageSize);
    var maxPage = Math.max(0, Math.ceil(total / pageSize) - 1);
    var numPages = total === 0 ? 1 : maxPage + 1;
    var disableFirst = pageIndex <= 0 || total === 0;
    var disableLast = pageIndex >= maxPage || total === 0;

    if (countEl) countEl.textContent = from + ' to ' + to + ' of ' + total;
    if (pageEl) pageEl.textContent = 'Page ' + (total === 0 ? 1 : pageIndex + 1) + ' of ' + numPages;

    if (btnIds) {
      var first = document.getElementById(btnIds.first);
      var prev = document.getElementById(btnIds.prev);
      var next = document.getElementById(btnIds.next);
      var last = document.getElementById(btnIds.last);
      if (first) first.disabled = disableFirst;
      if (prev) prev.disabled = disableFirst;
      if (next) next.disabled = disableLast;
      if (last) last.disabled = disableLast;
    }
  }

  function updateAllocMainPagination() {
    var els = getEls();
    var total = countVisibleRows(els.tbody, '.loc-row');
    updatePaginationBar(
      total,
      0,
      Math.max(total, 1),
      document.getElementById('act-alloc-main-pagination-text'),
      document.getElementById('act-alloc-main-pagination-page'),
      {
        first: 'act-alloc-main-page-first',
        prev: 'act-alloc-main-page-prev',
        next: 'act-alloc-main-page-next',
        last: 'act-alloc-main-page-last'
      }
    );
  }

  function updateAllocDetailPagination() {
    var els = getEls();
    var total = countVisibleRows(els.host, 'tbody tr');
    updatePaginationBar(
      total,
      0,
      Math.max(total, 1),
      document.getElementById('act-alloc-detail-pagination-text'),
      document.getElementById('act-alloc-detail-pagination-page'),
      {
        first: 'act-alloc-detail-page-first',
        prev: 'act-alloc-detail-page-prev',
        next: 'act-alloc-detail-page-next',
        last: 'act-alloc-detail-page-last'
      }
    );
  }

  function applyAllocMainRefine() {
    var els = getEls();
    if (!els.tbody) return;

    var q = els.mainRefineInput ? els.mainRefineInput.value.toLowerCase().trim() : '';
    els.tbody.querySelectorAll('.loc-row').forEach(function (tr) {
      tr.hidden = !!(q && tr.textContent.toLowerCase().indexOf(q) === -1);
    });
    updateAllocMainPagination();
  }

  function resetAllocMainRefine() {
    var els = getEls();
    if (els.mainRefineInput) els.mainRefineInput.value = '';
    applyAllocMainRefine();
  }

  function applyAllocDetailRefine() {
    var els = getEls();
    if (!els.host) return;

    var q = els.refineInput ? els.refineInput.value.toLowerCase().trim() : '';
    els.host.querySelectorAll('tbody tr').forEach(function (tr) {
      tr.hidden = !!(q && tr.textContent.toLowerCase().indexOf(q) === -1);
    });
    updateAllocDetailPagination();
  }

  function resetAllocDetailRefine() {
    var els = getEls();
    if (els.refineInput) els.refineInput.value = '';
    applyAllocDetailRefine();
  }

  function clearLocSelection() {
    document.querySelectorAll('#act-alloc-loc-table-body .loc-row').forEach(function (r) {
      r.classList.remove('selected');
      r.removeAttribute('aria-current');
    });
  }

  function openAllocDetailPanel(locId) {
    var els = getEls();
    if (!els.panel || !els.host || !locId) return;

    var row = document.querySelector('.loc-row[data-alloc-loc="' + locId + '"]');
    if (!row) return;

    var template = document.getElementById('alloc-path-' + locId);
    var locName = row.getAttribute('data-alloc-loc-name');
    if (!locName) {
      var nameEl = row.querySelector('.act-nom-loc-name');
      locName = nameEl ? nameEl.textContent.trim() : '';
    }

    if (els.title) els.title.textContent = locName;
    populateAllocDetailSummary(row, els.summary);
    populateAllocDetailMessage(locId, els.message);
    els.host.innerHTML = '';

    if (template) {
      var table = template.querySelector('table');
      if (table) els.host.appendChild(table.cloneNode(true));
    }

    resetAllocDetailRefine();
    updateAllocDetailPagination();

    clearLocSelection();
    row.classList.add('selected');
    row.setAttribute('aria-current', 'true');

    if (els.filterPanel) els.filterPanel.classList.add('hidden');

    if (els.panel) {
      els.panel.classList.remove('hidden');
      els.panel.setAttribute('aria-hidden', 'false');
      els.panel.style.width = '';
    }
    if (els.contentBottom) els.contentBottom.classList.add('panel-visible');
    if (els.tableWrapper) {
      els.tableWrapper.style.flex = '0 0 25%';
      els.tableWrapper.style.width = '';
    }
    if (els.resizeHandle) {
      els.resizeHandle.classList.add('is-visible');
      els.resizeHandle.setAttribute('aria-hidden', 'false');
    }
  }

  function closeAllocDetailPanel() {
    var els = getEls();
    if (!els.panel) return;

    clearLocSelection();

    els.panel.classList.add('hidden');
    els.panel.setAttribute('aria-hidden', 'true');
    if (els.host) els.host.innerHTML = '';
    if (els.title) els.title.textContent = '';
    if (els.summary) els.summary.innerHTML = '';
    if (els.message) {
      els.message.innerHTML = '';
      els.message.hidden = true;
    }
    resetAllocDetailRefine();
    updateAllocDetailPagination();

    if (els.tableWrapper) {
      els.tableWrapper.style.width = '';
      els.tableWrapper.style.flex = '';
      els.tableWrapper.style.maxWidth = '';
    }
    if (els.panel) els.panel.style.width = '';

    if (els.resizeHandle) {
      els.resizeHandle.classList.remove('is-visible');
      els.resizeHandle.setAttribute('aria-hidden', 'true');
    }
    if (els.contentBottom) els.contentBottom.classList.remove('panel-visible');
    if (els.filterPanel) els.filterPanel.classList.remove('hidden');
  }

  window.closeAllocDetailPanel = closeAllocDetailPanel;

  function initPanelResize() {
    var panelResizeHandle = document.getElementById('act-alloc-panel-resize-handle');
    if (!panelResizeHandle) return;

    var isResizing = false;
    var startX = 0;
    var startTableWidth = 0;
    var startPanelWidth = 0;
    var tableWrapper = null;
    var container = null;

    panelResizeHandle.addEventListener('mousedown', function (e) {
      isResizing = true;
      panelResizeHandle.classList.add('resizing');
      startX = e.clientX;

      tableWrapper = document.querySelector('.act-alloc-detail-layout .table-wrapper');
      container = document.querySelector('.act-alloc-detail-layout');

      if (container) container.classList.add('is-resizing');
      if (tableWrapper && container) {
        startTableWidth = tableWrapper.getBoundingClientRect().width;
        startPanelWidth = container.getBoundingClientRect().width - startTableWidth - RESIZE_HANDLE_WIDTH;
      }

      e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
      if (!isResizing || !tableWrapper || !container) return;

      var containerWidth = container.getBoundingClientRect().width;
      var deltaX = e.clientX - startX;
      var newTableWidth = startTableWidth + deltaX;
      var newPanelWidth = startPanelWidth - deltaX;
      var maxTableWidth = containerWidth - RESIZE_HANDLE_WIDTH - MIN_PANEL_WIDTH;

      if (newTableWidth >= MIN_PANEL_WIDTH && newTableWidth <= maxTableWidth &&
          newPanelWidth >= MIN_PANEL_WIDTH) {
        tableWrapper.style.flex = '0 0 ' + ((newTableWidth / containerWidth) * 100) + '%';
      }
    });

    document.addEventListener('mouseup', function () {
      if (!isResizing) return;
      isResizing = false;
      panelResizeHandle.classList.remove('resizing');
      if (container) container.classList.remove('is-resizing');
    });
  }

  function initAllocDetailPanel() {
    var els = getEls();
    if (!els.tbody || !els.panel) return;

    els.tbody.addEventListener('click', function (e) {
      var row = e.target.closest('.loc-row');
      if (!row || !els.tbody.contains(row)) return;
      var locId = row.getAttribute('data-alloc-loc');
      if (locId) openAllocDetailPanel(locId);
    });

    var closeBtn = document.getElementById('act-alloc-detail-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        closeAllocDetailPanel();
      });
    }

    if (els.mainRefineInput) els.mainRefineInput.addEventListener('input', applyAllocMainRefine);

    var mainRefreshBtn = document.getElementById('act-alloc-main-refresh');
    if (mainRefreshBtn) {
      mainRefreshBtn.addEventListener('click', function (e) {
        e.preventDefault();
        resetAllocMainRefine();
      });
    }

    if (els.refineInput) els.refineInput.addEventListener('input', applyAllocDetailRefine);

    var refreshBtn = document.getElementById('act-alloc-detail-refresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', function (e) {
        e.preventDefault();
        resetAllocDetailRefine();
      });
    }
  }

  function init() {
    initAllocDetailPanel();
    initPanelResize();
    updateAllocMainPagination();
    updateAllocDetailPagination();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
