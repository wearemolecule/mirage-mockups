/**
 * Certificate Inventory — Registry Activity screen.
 */
(function () {
  'use strict';

  if (!document.body.classList.contains('ci-registry-page')) return;

  var GRID_SELECTOR = '.ci-registry-grid';
  var REGISTRY_COL_COUNT = 10;
  var SUMMARY_STATUSES = ['confirmed', 'submitted', 'pending'];

  var CI_REGISTRY_STATUS_TONE = {
    pending: 'b-amber',
    submitted: 'b-blue',
    confirmed: 'b-green',
    failed: 'b-red'
  };

  var CI_REGISTRY_STATUS_LABEL = {
    pending: 'Pending',
    submitted: 'Submitted',
    confirmed: 'Confirmed',
    failed: 'Failed'
  };

  var CI_REGISTRY_ITEMS = [
    { id: 'g1', status: 'confirmed', action: 'Retirement', count: 100, range: 'MRETS-2023-OK-WIN-009800…009899', counterparty: 'RPS Compliance 2023', registry: 'M-RETS', trade: '87990', submitted: 'May 12 · 09:14', confirmed: '2 min ago' },
    { id: 'g2', status: 'submitted', action: 'Transfer', count: 51, range: 'MRETS-2024-TX-WIN-004100…004150', counterparty: 'EDP Retail', registry: 'M-RETS', trade: '88301', submitted: 'May 12 · 11:02', confirmed: null },
    { id: 'g3', status: 'failed', action: 'Retirement', count: 25, range: 'WREGIS-2024-CA-SOL-118900…118924', counterparty: 'Voluntary Green-e', registry: 'WREGIS', trade: '88477', submitted: 'May 12 · 08:40', confirmed: null, error: 'Registry rejected: vintage mismatch' },
    { id: 'g4', status: 'confirmed', action: 'Transfer', count: 200, range: 'PJMGATS-2024-PA-SOL-556000…556199', counterparty: 'Constellation Energy', registry: 'PJM-GATS', trade: '88477', submitted: 'May 12 · 06:25', confirmed: '3 hrs ago' },
    { id: 'g5', status: 'pending', action: 'Retirement', count: 60, range: 'WREGIS-2025-CA-WIN-220100…220159', counterparty: 'CA RPS 2025', registry: 'WREGIS', trade: '88512', submitted: null, confirmed: null },
    { id: 'g6', status: 'submitted', action: 'Transfer', count: 40, range: 'NAR-2024-IA-WIN-771200…771239', counterparty: 'Brookfield Renewable', registry: 'NAR', trade: '88503', submitted: 'May 12 · 10:48', confirmed: null }
  ];

  var ciRegistryState = {
    appliedFilters: { action: 'All', status: 'All' }
  };

  function ciRegistryReadFilterValues() {
    var actionEl = document.getElementById('ci-registry-filter-action');
    var statusEl = document.getElementById('ci-registry-filter-status');
    return {
      action: actionEl ? actionEl.value : 'All',
      status: statusEl ? statusEl.value : 'All'
    };
  }

  function ciRegistryGetFilteredItems() {
    var filters = ciRegistryState.appliedFilters;
    return CI_REGISTRY_ITEMS.filter(function (item) {
      if (filters.action !== 'All' && item.action !== filters.action) return false;
      if (filters.status !== 'All' && item.status !== filters.status.toLowerCase()) return false;
      return true;
    });
  }

  function ciRegistryStatusHtml(status) {
    return ciStatusPillFromMap(status, CI_REGISTRY_STATUS_TONE, CI_REGISTRY_STATUS_LABEL);
  }

  function ciRegistryMenuItems(item) {
    if (item.status === 'failed') return ['Retry', 'Export'];
    if (item.status === 'pending') return ['Submit now', 'Export'];
    return ['Export'];
  }

  function ciRegistryRowMenuHtml(item) {
    return ciRowMenuCellHtml(ciRegistryMenuItems(item).map(function (label) {
      return {
        label: label,
        attrs: 'data-ci-registry-action="' + label.toLowerCase().replace(/\s+/g, '-') + '"'
      };
    }));
  }

  function ciRegistrySubmittedHtml(item) {
    if (item.submitted) return ciEscapeHtml(item.submitted);
    return '<span class="ci-cell-empty">queued</span>';
  }

  function ciRegistryConfirmedHtml(item) {
    if (item.status === 'confirmed' && item.confirmed) {
      return (
        '<span class="ci-registry-confirmed-ok">' +
          '<i class="fas fa-check" aria-hidden="true"></i>' + ciEscapeHtml(item.confirmed) +
        '</span>'
      );
    }
    if (item.status === 'failed' && item.error) {
      return (
        '<span class="ci-registry-confirmed-error" title="' + ciEscapeHtml(item.error) + '">' +
          '<i class="fas fa-triangle-exclamation" aria-hidden="true"></i> Vintage mismatch' +
        '</span>'
      );
    }
    if (item.status === 'pending') return '<span class="ci-cell-empty">—</span>';
    return '<span class="ci-cell-empty">pending…</span>';
  }

  function ciRegistryHeadHtml() {
    return (
      '<tr>' +
        '<th class="trades-col-menu" aria-label="Actions"></th>' +
        '<th class="inv-col-status ci-col-tight">Status</th>' +
        '<th class="ci-col-tight">Action</th>' +
        '<th class="ci-col-num ci-col-tight">Certs</th>' +
        '<th>Serial Range</th>' +
        '<th>Counterparty / Beneficiary</th>' +
        '<th class="ci-col-tight">Registry</th>' +
        '<th class="ci-col-tight">Trade</th>' +
        '<th class="ci-col-tight">Submitted</th>' +
        '<th>Confirmed</th>' +
      '</tr>'
    );
  }

  function ciRegistryRowHtml(item) {
    return (
      '<tr data-registry-id="' + ciEscapeHtml(item.id) + '">' +
        ciRegistryRowMenuHtml(item) +
        '<td class="inv-status-cell ci-col-tight">' + ciRegistryStatusHtml(item.status) + '</td>' +
        '<td class="ci-col-tight">' + ciEscapeHtml(item.action) + '</td>' +
        '<td class="ci-col-num ci-col-tight">' + item.count + '</td>' +
        '<td>' + ciEscapeHtml(item.range) + '</td>' +
        '<td>' + ciEscapeHtml(item.counterparty) + '</td>' +
        '<td class="ci-col-tight">' + ciEscapeHtml(item.registry) + '</td>' +
        '<td class="ci-col-tight">' + ciLinkedTradeLinkHtml(item.trade) + '</td>' +
        '<td class="ci-col-tight">' + ciRegistrySubmittedHtml(item) + '</td>' +
        '<td>' + ciRegistryConfirmedHtml(item) + '</td>' +
      '</tr>'
    );
  }

  function ciRegistrySummaryHtml(items) {
    var counts = { confirmed: 0, submitted: 0, pending: 0, failed: 0 };
    items.forEach(function (item) {
      if (counts[item.status] != null) counts[item.status] += 1;
    });

    var html = SUMMARY_STATUSES.map(function (status) {
      return (
        '<span class="ci-registry-summary-stat">' +
          '<span class="ci-registry-summary-dot ci-registry-summary-dot--' + status + '" aria-hidden="true"></span>' +
          '<strong>' + counts[status] + '</strong> ' + CI_REGISTRY_STATUS_LABEL[status] +
        '</span>'
      );
    }).join('');

    if (counts.failed) {
      html += '<span class="ci-registry-summary-attn"><strong>' + counts.failed + '</strong> ' +
        CI_REGISTRY_STATUS_LABEL.failed + ' — action required</span>';
    }

    return html;
  }

  function ciRegistryUpdatePagination(count) {
    ciSetPaginationCount('ci-registry-pagination-count', count);
  }

  function ciRegistryFindItem(id) {
    return CI_REGISTRY_ITEMS.filter(function (item) {
      return item.id === id;
    })[0] || null;
  }

  function ciRegistryHandleMenuAction(action, item) {
    if (!item) return;

    if (action === 'submit-now') {
      item.status = 'submitted';
      item.submitted = 'May 12 · just now';
      ciShowToast('Submitted to ' + item.registry);
      renderCiRegistryActivity();
      return;
    }

    if (action === 'retry') {
      item.status = 'submitted';
      item.submitted = 'May 12 · just now';
      item.error = null;
      ciShowToast('Resubmitted to ' + item.registry + '…');
      renderCiRegistryActivity();
      window.setTimeout(function () {
        item.status = 'confirmed';
        item.confirmed = 'just now';
        ciShowToast('Confirmed by ' + item.registry);
        renderCiRegistryActivity();
      }, 1800);
      return;
    }

    if (action === 'export') {
      ciShowToast('Export staged for ' + item.range);
    }
  }

  function renderCiRegistryActivity() {
    var table = document.querySelector(GRID_SELECTOR);
    var thead = table && table.querySelector('thead');
    var tbody = table && table.querySelector('tbody');
    var summaryEl = document.getElementById('ci-registry-card-summary');
    if (!table || !thead || !tbody) return;

    var items = ciRegistryGetFilteredItems();
    thead.innerHTML = ciRegistryHeadHtml();

    if (!items.length) {
      tbody.innerHTML =
        '<tr class="ci-registry-empty-row"><td colspan="' + REGISTRY_COL_COUNT + '">' +
          'No registry activity matches your filters.' +
        '</td></tr>';
    } else {
      tbody.innerHTML = items.map(ciRegistryRowHtml).join('');
    }

    if (summaryEl) summaryEl.innerHTML = ciRegistrySummaryHtml(items);
    ciRegistryUpdatePagination(items.length);
  }

  function ciRegistryClearFilters() {
    ciResetSelectFilters('#ci-registry-filters-collapse');
    ciRegistryState.appliedFilters = ciRegistryReadFilterValues();
    renderCiRegistryActivity();
  }

  function ciRegistryApplyFilters() {
    ciRegistryState.appliedFilters = ciRegistryReadFilterValues();
    renderCiRegistryActivity();
  }

  function initCiRegistryGridEvents() {
    var tbody = document.querySelector(GRID_SELECTOR + ' tbody');
    if (!tbody || tbody.dataset.ciRegistryGridBound === '1') return;
    tbody.dataset.ciRegistryGridBound = '1';

    tbody.addEventListener('click', function (event) {
      var menuBtn = event.target.closest('.trades-row-menu-btn');
      if (menuBtn) {
        ciToggleGridRowMenu(event, menuBtn, GRID_SELECTOR);
        return;
      }

      var menuItem = event.target.closest('[data-ci-registry-action]');
      if (menuItem) {
        event.preventDefault();
        event.stopPropagation();
        ciCloseGridRowMenus(GRID_SELECTOR);
        var row = menuItem.closest('tr[data-registry-id]');
        var item = row ? ciRegistryFindItem(row.getAttribute('data-registry-id')) : null;
        ciRegistryHandleMenuAction(menuItem.getAttribute('data-ci-registry-action'), item);
        return;
      }

      if (event.target.closest('.te-row-menu-wrap')) {
        event.stopPropagation();
      }
    });

    ciBindGridRowMenuDismiss(GRID_SELECTOR);
  }

  function initCiRegistryPage() {
    initTradeDateFilter({
      wrapId: 'ci-registry-date-filter',
      triggerId: 'ci-registry-date-filter-trigger',
      popoverId: 'ci-registry-date-filter-popover',
      labelId: 'ci-registry-date-filter-label',
      customRangeId: 'ci-registry-date-custom-range',
      okBtnId: 'ci-registry-date-custom-ok'
    });
    initCiRegistryGridEvents();
    ciRegistryState.appliedFilters = ciRegistryReadFilterValues();
    renderCiRegistryActivity();
  }

  window.ciRegistryClearFilters = ciRegistryClearFilters;
  window.ciRegistryApplyFilters = ciRegistryApplyFilters;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCiRegistryPage);
  } else {
    initCiRegistryPage();
  }
})();
