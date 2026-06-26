const INV_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending review', tone: 'b-gray' },
  { value: 'created', label: 'Line item created', tone: 'b-purple' },
  { value: 'finalized', label: 'Finalized', tone: 'b-green' },
  { value: 'erp-submitted', label: 'ERP submitted', tone: 'b-green' },
  { value: 'erp-failed', label: 'ERP failed', tone: 'b-red' },
  { value: 'ready-erp', label: 'Ready for ERP', tone: 'b-amber' },
  { value: 'ready-invoicing', label: 'Ready for invoicing', tone: 'b-blue' },
];

const INV_SUBLEGS = [
  { sublegId: '88421', tradeId: 'M.10482', agreement: 'Hulk-PT-Wind-2024', counterparty: '[EDPR] EDP Renováveis', product: '[N.PT-WIND] PT Wind PPA', period: '2026-04-01', settlementDate: '2026-05-15', qty: '1,240.500 MWh', status: 'pending' },
  { sublegId: '88422', tradeId: 'M.10483', agreement: 'Hulk-PT-Wind-2024', counterparty: '[EDPR] EDP Renováveis', product: '[N.PT-WIND] PT Wind PPA', period: '2026-04-01', settlementDate: '2026-05-15', qty: '987.250 MWh', status: 'created' },
  { sublegId: '88423', tradeId: 'M.10484', agreement: 'Hulk-Hydro-2023', counterparty: '[IBE] Iberdrola SA', product: '[N.ES-HYDRO] ES Hydro Baseload', period: '2026-04-01', settlementDate: '2026-05-20', qty: '2,100.000 MWh', status: 'finalized', iliAmount: '€ 41,800.00', iliDate: '2026-05-02' },
  { sublegId: '88424', tradeId: 'M.10485', agreement: 'Hulk-PT-Wind-2024', counterparty: '[EDPR] EDP Renováveis', product: '[N.PT-WIND] PT Wind PPA', period: '2026-04-01', settlementDate: '2026-05-15', qty: '856.000 MWh', status: 'erp-submitted', iliAmount: '€ 482,150.00', iliDate: '2026-05-02', erpRef: 'S0-190003008' },
  { sublegId: '88425', tradeId: 'M.10486', agreement: 'Hulk-Hydro-2023', counterparty: '[IBE] Iberdrola SA', product: '[N.ES-HYDRO] ES Hydro Baseload', period: '2026-04-01', settlementDate: '2026-05-20', qty: '1,550.750 MWh', status: 'erp-failed', iliAmount: '€ 198,400.00', iliDate: '2026-05-03' },
  { sublegId: '88426', tradeId: 'M.10487', agreement: 'Hulk-PT-Wind-2024', counterparty: '[EDPR] EDP Renováveis', product: '[N.PT-WIND] PT Wind PPA', period: '2026-04-01', settlementDate: '2026-05-15', qty: '723.100 MWh', status: 'ready-erp', iliAmount: '€ 112,300.00', iliDate: '2026-05-04' },
  { sublegId: '88427', tradeId: 'M.10488', agreement: 'Hulk-Hydro-2023', counterparty: '[IBE] Iberdrola SA', product: '[N.ES-HYDRO] ES Hydro Baseload', period: '2026-04-01', settlementDate: '2026-05-20', qty: '1,890.000 MWh', status: 'ready-invoicing', iliAmount: '€ 134,900.00', iliDate: '2026-05-04' },
  { sublegId: '88428', tradeId: 'M.10489', agreement: 'Hulk-PT-Wind-2024', counterparty: '[EDPR] EDP Renováveis', product: '[N.PT-WIND] PT Wind PPA', period: '2026-04-01', settlementDate: '2026-05-15', qty: '1,105.500 MWh', status: 'finalized', iliAmount: '€ 78,250.00', iliDate: '2026-05-05' },
  { sublegId: '88429', tradeId: 'M.10490', agreement: 'Hulk-PT-Wind-2024', counterparty: '[EDPR] EDP Renováveis', product: '[N.PT-WIND] PT Wind PPA', period: '2026-04-01', settlementDate: '2026-05-15', qty: '945.000 MWh', status: 'pending' },
  { sublegId: '88430', tradeId: 'M.10491', agreement: 'Hulk-Hydro-2023', counterparty: '[IBE] Iberdrola SA', product: '[N.ES-HYDRO] ES Hydro Baseload', period: '2026-04-01', settlementDate: '2026-05-20', qty: '1,678.250 MWh', status: 'created' },
];

let selectedRows = new Set();

function invFormatShortNameBrackets(str) {
  if (!str) return '';
  const match = String(str).match(/^\[([^\]]+)\](.*)$/);
  if (match) {
    return (
      '<span class="bracket">[</span>' +
      '<span class="short-name">' + match[1] + '</span>' +
      '<span class="bracket">]</span>' +
      match[2]
    );
  }
  return str;
}

function invStatusTone(value) {
  const option = INV_STATUS_OPTIONS.find(function (opt) { return opt.value === value; });
  return option ? option.tone : 'b-gray';
}

function invStatusSelectHtml(selectedValue) {
  const tone = invStatusTone(selectedValue);
  const optionsHtml = INV_STATUS_OPTIONS.map(function (opt) {
    return '<option value="' + opt.value + '"' + (opt.value === selectedValue ? ' selected' : '') + '>' + opt.label + '</option>';
  }).join('');

  return (
    '<label class="inv-status-select-wrap ' + tone + '">' +
      '<span class="b-dot" aria-hidden="true"></span>' +
      '<select class="inv-status-select" aria-label="Invoice status">' + optionsHtml + '</select>' +
    '</label>'
  );
}

function invRowMenuHtml() {
  return (
    '<td class="trades-col-menu">' +
      '<div class="te-row-menu-wrap">' +
        '<button type="button" class="trades-row-menu-btn" aria-label="Row actions" aria-expanded="false" aria-haspopup="true">' +
          '<i class="fas fa-ellipsis-vertical" aria-hidden="true"></i>' +
        '</button>' +
        '<div class="te-row-menu-dropdown" role="menu">' +
          '<button type="button" role="menuitem" class="te-row-menu-item" data-inv-action="ready-invoicing">Mark Ready for Invoicing</button>' +
          '<button type="button" role="menuitem" class="te-row-menu-item" data-inv-action="finalized">Mark Finalized</button>' +
        '</div>' +
      '</div>' +
    '</td>'
  );
}

function invCloseRowMenus() {
  document.querySelectorAll('.inv-sublegs-grid .te-row-menu-wrap.is-open').forEach(function (wrap) {
    wrap.classList.remove('is-open');
    const btn = wrap.querySelector('.trades-row-menu-btn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
}

function invRowMenuToggle(event, btn) {
  event.stopPropagation();
  const wrap = btn.closest('.te-row-menu-wrap');
  if (!wrap) return;
  const wasOpen = wrap.classList.contains('is-open');
  invCloseRowMenus();
  if (!wasOpen) {
    wrap.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
  }
}

function invApplyRowStatus(row, statusValue) {
  const select = row.querySelector('.inv-status-select');
  const wrap = row.querySelector('.inv-status-select-wrap');
  if (select) select.value = statusValue;
  if (wrap) wrap.className = 'inv-status-select-wrap ' + invStatusTone(statusValue);
}

function invCell(value, extraClass) {
  const classes = extraClass ? [extraClass] : [];
  if (value == null || value === '') {
    classes.push('inv-cell-empty');
    value = '-';
  }
  const classAttr = classes.length ? ' class="' + classes.join(' ') + '"' : '';
  return '<td' + classAttr + '>' + value + '</td>';
}

function renderInvoicingGrid() {
  const tbody = document.querySelector('.inv-sublegs-grid tbody');
  if (!tbody) return;

  tbody.innerHTML = INV_SUBLEGS.map(function (row, index) {
    return (
      '<tr data-index="' + index + '">' +
        invRowMenuHtml() +
        '<td class="inv-col-checkbox"><input type="checkbox" class="row-checkbox" aria-label="Select row"></td>' +
        '<td><a href="#" class="inv-grid-link">' + row.sublegId + '</a></td>' +
        '<td><a href="#" class="inv-grid-link">' + row.tradeId + '</a></td>' +
        '<td>' + row.agreement + '</td>' +
        '<td>' + invFormatShortNameBrackets(row.counterparty) + '</td>' +
        '<td>' + invFormatShortNameBrackets(row.product) + '</td>' +
        '<td>' + row.period + '</td>' +
        '<td>' + row.settlementDate + '</td>' +
        '<td class="inv-col-num">' + row.qty + '</td>' +
        '<td class="inv-status-cell">' + invStatusSelectHtml(row.status) + '</td>' +
        invCell(row.iliAmount, 'inv-col-num') +
        invCell(row.iliDate) +
        invCell(row.erpRef) +
      '</tr>'
    );
  }).join('');
}

function setRowSelected(index, checked) {
  const row = document.querySelector('.inv-sublegs-grid tbody tr[data-index="' + index + '"]');
  if (!row) return;

  const checkbox = row.querySelector('.row-checkbox');
  if (checkbox) checkbox.checked = checked;

  if (checked) {
    selectedRows.add(index);
    row.classList.add('selected');
  } else {
    selectedRows.delete(index);
    row.classList.remove('selected');
  }
}

function toggleRowSelection(index, checked) {
  setRowSelected(index, checked);
  updateSelectionBar();
  updateSelectAllCheckbox();
}

function toggleSelectAll(checked) {
  document.querySelectorAll('.inv-sublegs-grid tbody tr').forEach(function (row) {
    setRowSelected(parseInt(row.dataset.index, 10), checked);
  });
  updateSelectionBar();
  updateSelectAllCheckbox();
}

function updateSelectAllCheckbox() {
  const selectAllCheckbox = document.getElementById('select-all-checkbox');
  if (!selectAllCheckbox) return;

  const totalRows = INV_SUBLEGS.length;
  const checkedRows = selectedRows.size;

  selectAllCheckbox.checked = checkedRows === totalRows && totalRows > 0;
  selectAllCheckbox.indeterminate = checkedRows > 0 && checkedRows < totalRows;
}

function updateSelectionBar() {
  const bar = document.getElementById('selection-bar');
  const count = document.getElementById('selection-count');
  const tableWrapper = document.querySelector('body.invoicing-page .table-wrapper');
  if (!bar || !count) return;

  if (selectedRows.size > 0) {
    if (tableWrapper && bar.parentElement !== tableWrapper) {
      tableWrapper.appendChild(bar);
    }
    const noun = selectedRows.size === 1 ? 'subleg' : 'sublegs';
    count.parentElement.innerHTML =
      '<span id="selection-count">' + selectedRows.size + '</span> ' + noun + ' selected';
    bar.classList.add('visible');
  } else {
    bar.classList.remove('visible');
  }
}

function clearSelection() {
  selectedRows.clear();
  document.querySelectorAll('.inv-sublegs-grid tbody tr').forEach(function (row) {
    setRowSelected(parseInt(row.dataset.index, 10), false);
  });
  updateSelectionBar();
  updateSelectAllCheckbox();
}

function initInvoicingGridEvents() {
  const tbody = document.querySelector('.inv-sublegs-grid tbody');
  if (!tbody) return;

  tbody.addEventListener('click', function (e) {
    const menuBtn = e.target.closest('.trades-row-menu-btn');
    if (menuBtn) {
      invRowMenuToggle(e, menuBtn);
      return;
    }
    const menuAction = e.target.closest('[data-inv-action]');
    if (menuAction) {
      e.stopPropagation();
      const row = menuAction.closest('tr');
      if (row) invApplyRowStatus(row, menuAction.getAttribute('data-inv-action'));
      invCloseRowMenus();
      return;
    }
    if (e.target.closest('.te-row-menu-wrap')) {
      e.stopPropagation();
    }
  });

  tbody.addEventListener('change', function (e) {
    if (e.target.matches('.row-checkbox')) {
      const row = e.target.closest('tr');
      toggleRowSelection(parseInt(row.dataset.index, 10), e.target.checked);
      return;
    }
    if (e.target.matches('.inv-status-select')) {
      const wrap = e.target.closest('.inv-status-select-wrap');
      if (wrap) wrap.className = 'inv-status-select-wrap ' + invStatusTone(e.target.value);
    }
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.te-row-menu-wrap')) {
      invCloseRowMenus();
    }
  });
}

function initInvoicingStatusFilter() {
  const select = document.querySelector('#inv-content select[aria-label="Invoice status"]');
  if (!select) return;
  select.innerHTML =
    '<option>All</option>' +
    INV_STATUS_OPTIONS.map(function (opt) {
      return '<option>' + opt.label + '</option>';
    }).join('');
}

function initInvoicingPage() {
  initInvoicingStatusFilter();
  renderInvoicingGrid();
  initInvoicingGridEvents();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInvoicingPage);
} else {
  initInvoicingPage();
}
