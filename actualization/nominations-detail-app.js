/**
 * Nominations (detail panel) — row click opens path table in side panel.
 * Shell, animation, and resize behavior aligned with Market Data detail panels.
 */
(function () {
  'use strict';

  var MIN_PANEL_WIDTH = 300;
  var RESIZE_HANDLE_WIDTH = 24;

  function getEls() {
    return {
      panel: document.getElementById('act-nom-detail-panel'),
      title: document.getElementById('act-nom-detail-title'),
      summary: document.getElementById('act-nom-detail-summary'),
      host: document.getElementById('act-nom-detail-path-host'),
      mainRefineInput: document.getElementById('act-nom-main-refine-input'),
      refineInput: document.getElementById('act-nom-detail-refine-input'),
      tableWrapper: document.querySelector('.act-nom-detail-layout .table-wrapper'),
      contentBottom: document.querySelector('.act-nom-detail-layout'),
      resizeHandle: document.getElementById('act-nom-panel-resize-handle'),
      filterPanel: document.querySelector('.act-nom-detail-filters'),
      tbody: document.getElementById('act-nom-loc-table-body')
    };
  }

  function isMissingQty(text) {
    return !text || text === '—' || text === '–' || text === '-';
  }

  function parseQty(text) {
    if (isMissingQty(text)) return 0;
    var n = parseFloat(String(text).replace(/,/g, '').replace(/[−–]/g, '-'));
    return isNaN(n) ? 0 : n;
  }

  function populateNomDetailSummary(row, summaryEl) {
    if (!row || !summaryEl) return;

    var cells = row.querySelectorAll('td');
    var parts = [];
    var locCodeEl = row.querySelector('.act-loc-code');
    var locCode = locCodeEl ? locCodeEl.textContent.trim() : '';

    if (locCode) parts.push(locCode);

    var badge = cells[9] && cells[9].querySelector('.badge');
    if (badge) parts.push(badge.outerHTML);

    var recSch = cells[3] ? cells[3].textContent.trim() : '';
    var delSch = cells[5] ? cells[5].textContent.trim() : '';
    if (!isMissingQty(recSch)) parts.push('← ' + recSch + ' sch');
    if (!isMissingQty(delSch)) parts.push('→ ' + delSch + ' sch');

    var cutText = cells[6] ? cells[6].textContent.trim() : '';
    if (!isMissingQty(cutText) && parseQty(cutText) !== 0) {
      parts.push('<span class="act-nom-summary-cut">Cut ' + cutText + '</span>');
    }

    var fuelText = cells[7] ? cells[7].textContent.trim() : '';
    if (!isMissingQty(fuelText)) parts.push('Fuel ' + fuelText);

    var pathCount = cells[8] ? cells[8].textContent.trim() : '';
    if (pathCount) parts.push(pathCount + (pathCount === '1' ? ' path' : ' paths'));

    summaryEl.innerHTML = parts.join(' • ');
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

  function updateNomMainPagination() {
    var els = getEls();
    var total = countVisibleRows(els.tbody, '.loc-row');
    updatePaginationBar(
      total,
      0,
      Math.max(total, 1),
      document.getElementById('act-nom-main-pagination-text'),
      document.getElementById('act-nom-main-pagination-page'),
      {
        first: 'act-nom-main-page-first',
        prev: 'act-nom-main-page-prev',
        next: 'act-nom-main-page-next',
        last: 'act-nom-main-page-last'
      }
    );
  }

  function updateNomDetailPagination() {
    var els = getEls();
    var total = countVisibleRows(els.host, 'tbody tr');
    updatePaginationBar(
      total,
      0,
      Math.max(total, 1),
      document.getElementById('act-nom-detail-pagination-text'),
      document.getElementById('act-nom-detail-pagination-page'),
      {
        first: 'act-nom-detail-page-first',
        prev: 'act-nom-detail-page-prev',
        next: 'act-nom-detail-page-next',
        last: 'act-nom-detail-page-last'
      }
    );
  }

  function applyNomMainRefine() {
    var els = getEls();
    if (!els.tbody) return;

    var q = els.mainRefineInput ? els.mainRefineInput.value.toLowerCase().trim() : '';
    els.tbody.querySelectorAll('.loc-row').forEach(function (tr) {
      tr.hidden = !!(q && tr.textContent.toLowerCase().indexOf(q) === -1);
    });
    updateNomMainPagination();
  }

  function resetNomMainRefine() {
    var els = getEls();
    if (els.mainRefineInput) els.mainRefineInput.value = '';
    applyNomMainRefine();
  }

  function applyNomDetailRefine() {
    var els = getEls();
    if (!els.host) return;

    var q = els.refineInput ? els.refineInput.value.toLowerCase().trim() : '';
    els.host.querySelectorAll('tbody tr').forEach(function (tr) {
      tr.hidden = !!(q && tr.textContent.toLowerCase().indexOf(q) === -1);
    });
    updateNomDetailPagination();
  }

  function resetNomDetailRefine() {
    var els = getEls();
    if (els.refineInput) els.refineInput.value = '';
    applyNomDetailRefine();
  }

  function clearLocSelection() {
    document.querySelectorAll('#act-nom-loc-table-body .loc-row').forEach(function (r) {
      r.classList.remove('selected');
      r.removeAttribute('aria-current');
    });
  }

  function openNomDetailPanel(locId) {
    var els = getEls();
    if (!els.panel || !els.host || !locId) return;

    var row = document.querySelector('.loc-row[data-nom-loc="' + locId + '"]');
    if (!row) return;

    var template = document.getElementById('nom-path-' + locId);
    var locName = row.getAttribute('data-nom-loc-name');
    if (!locName) {
      var nameEl = row.querySelector('.act-nom-loc-name');
      locName = nameEl ? nameEl.textContent.trim() : '';
    }

    if (els.title) els.title.textContent = locName;
    populateNomDetailSummary(row, els.summary);
    els.host.innerHTML = '';

    if (template) {
      var table = template.querySelector('table');
      if (table) els.host.appendChild(table.cloneNode(true));
    }
    resetNomDetailRefine();
    updateNomDetailPagination();

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

  function closeNomDetailPanel() {
    var els = getEls();
    if (!els.panel) return;

    clearLocSelection();

    els.panel.classList.add('hidden');
    els.panel.setAttribute('aria-hidden', 'true');
    if (els.host) els.host.innerHTML = '';
    if (els.title) els.title.textContent = '';
    if (els.summary) els.summary.innerHTML = '';
    resetNomDetailRefine();
    updateNomDetailPagination();

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

  window.closeNomDetailPanel = closeNomDetailPanel;

  function initPanelResize() {
    var panelResizeHandle = document.getElementById('act-nom-panel-resize-handle');
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

      tableWrapper = document.querySelector('.act-nom-detail-layout .table-wrapper');
      container = document.querySelector('.act-nom-detail-layout');

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

  function initNomDetailPanel() {
    var els = getEls();
    if (!els.tbody || !els.panel) return;

    els.tbody.addEventListener('click', function (e) {
      var row = e.target.closest('.loc-row');
      if (!row || !els.tbody.contains(row)) return;
      var locId = row.getAttribute('data-nom-loc');
      if (locId) openNomDetailPanel(locId);
    });

    var closeBtn = document.getElementById('act-nom-detail-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        closeNomDetailPanel();
      });
    }

    if (els.mainRefineInput) els.mainRefineInput.addEventListener('input', applyNomMainRefine);

    var mainRefreshBtn = document.getElementById('act-nom-main-refresh');
    if (mainRefreshBtn) {
      mainRefreshBtn.addEventListener('click', function (e) {
        e.preventDefault();
        resetNomMainRefine();
      });
    }

    if (els.refineInput) els.refineInput.addEventListener('input', applyNomDetailRefine);

    var refreshBtn = document.getElementById('act-nom-detail-refresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', function (e) {
        e.preventDefault();
        resetNomDetailRefine();
      });
    }
  }

  function init() {
    initNomDetailPanel();
    initPanelResize();
    updateNomMainPagination();
    updateNomDetailPagination();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
