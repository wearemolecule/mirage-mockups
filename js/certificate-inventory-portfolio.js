const CI_SELECTION_ACTIONS = {
  individual: ['Retire', 'Transfer', 'Link to Trade'],
  grouped: ['Assign', 'Retire', 'Transfer']
};

const CI_CERTIFICATES = [
  { status: 'Available', serial: 'MRETS-2024-TX-SOL-004521', registry: 'M-RETS', vintage: 2024, technology: 'Solar', state: 'TX', volume: 1, costBasis: 4.2, mark: 4.85, linkedTrade: '88421', linkedSubleg: '88421' },
  { status: 'Available', serial: 'MRETS-2024-TX-SOL-004522', registry: 'M-RETS', vintage: 2024, technology: 'Solar', state: 'TX', volume: 1, costBasis: 4.2, mark: 4.85, linkedTrade: '88421', linkedSubleg: '88421' },
  { status: 'Forecast', serial: '(pending mint)', registry: '—', vintage: 2024, technology: 'Solar', state: 'TX', volume: 1, costBasis: null, mark: null, linkedTrade: '88450', linkedSubleg: '88450' },
  { status: 'Allocated', serial: 'MRETS-2024-TX-WIN-004118', registry: 'M-RETS', vintage: 2024, technology: 'Wind', state: 'TX', volume: 1, costBasis: 3.1, mark: 3.55, linkedTrade: '88301', linkedSubleg: '88301' },
  { status: 'Exception', serial: 'WREGIS-2024-CA-SOL-118903', registry: 'WREGIS', vintage: 2024, technology: 'Solar', state: 'CA', volume: 1, costBasis: 38, mark: 41.5, linkedTrade: null, linkedSubleg: null },
  { status: 'Available', serial: 'WREGIS-2025-CA-WIN-220145', registry: 'WREGIS', vintage: 2025, technology: 'Wind', state: 'CA', volume: 1, costBasis: 12.4, mark: 13.1, linkedTrade: '88512', linkedSubleg: '88512' },
  { status: 'Retired', serial: 'MRETS-2023-OK-WIN-009842', registry: 'M-RETS', vintage: 2023, technology: 'Wind', state: 'OK', volume: 1, costBasis: 2.05, mark: null, linkedTrade: '87990', linkedSubleg: '87990' },
  { status: 'Available', serial: 'PJMGATS-2024-PA-SOL-556210', registry: 'PJM-GATS', vintage: 2024, technology: 'Solar', state: 'PA', volume: 1, costBasis: 28, mark: 30.25, linkedTrade: '88477', linkedSubleg: '88477' },
  { status: 'Available', serial: 'PJMGATS-2024-PA-SOL-556211', registry: 'PJM-GATS', vintage: 2024, technology: 'Solar', state: 'PA', volume: 1, costBasis: 28, mark: 30.25, linkedTrade: '88477', linkedSubleg: '88477' },
  { status: 'Allocated', serial: 'NAR-2024-IA-WIN-771204', registry: 'NAR', vintage: 2024, technology: 'Wind', state: 'IA', volume: 1, costBasis: 2.8, mark: 3.05, linkedTrade: '88503', linkedSubleg: '88503' },
  { status: 'Available', serial: 'WREGIS-2024-NM-HYD-008201', registry: 'WREGIS', vintage: 2024, technology: 'Hydro', state: 'NM', volume: 1, costBasis: 18.5, mark: 19.2, linkedTrade: '88488', linkedSubleg: '88488' },
  { status: 'Available', serial: 'WREGIS-2024-NM-HYD-008202', registry: 'WREGIS', vintage: 2024, technology: 'Hydro', state: 'NM', volume: 1, costBasis: 18.5, mark: 19.2, linkedTrade: '88488', linkedSubleg: '88488' },
  { status: 'Available', serial: 'MRETS-2024-OK-BIO-003401', registry: 'M-RETS', vintage: 2024, technology: 'Biomass', state: 'OK', volume: 1, costBasis: 5.6, mark: 6.1, linkedTrade: '88520', linkedSubleg: '88520' },
  { status: 'Allocated', serial: 'MRETS-2024-IA-BIO-003402', registry: 'M-RETS', vintage: 2024, technology: 'Biomass', state: 'IA', volume: 1, costBasis: 5.4, mark: 5.9, linkedTrade: '88521', linkedSubleg: '88521' }
];

const CI_RANGES = [
  {
    id: 'r1',
    range: 'MRETS-2024-TX-SOL-004521 → 004522',
    count: 2,
    registry: 'M-RETS',
    vintage: 2024,
    technology: 'Solar',
    state: 'TX',
    status: 'Available',
    costBasis: 4.2,
    mark: 4.85,
    linkedTrade: '88421',
    linkedSubleg: '88421',
    sampleSerials: ['MRETS-2024-TX-SOL-004521', 'MRETS-2024-TX-SOL-004522']
  },
  {
    id: 'r2',
    range: '(pending mint) · forecast batch',
    count: 1,
    registry: '—',
    vintage: 2024,
    technology: 'Solar',
    state: 'TX',
    status: 'Forecast',
    costBasis: null,
    mark: null,
    linkedTrade: '88450',
    linkedSubleg: '88450',
    sampleSerials: ['(pending mint)']
  },
  {
    id: 'r3',
    range: 'MRETS-2024-TX-WIN-004118',
    count: 1,
    registry: 'M-RETS',
    vintage: 2024,
    technology: 'Wind',
    state: 'TX',
    status: 'Allocated',
    costBasis: 3.1,
    mark: 3.55,
    linkedTrade: '88301',
    linkedSubleg: '88301',
    sampleSerials: ['MRETS-2024-TX-WIN-004118']
  },
  {
    id: 'r4',
    range: 'WREGIS-2024-CA-SOL-118903',
    count: 1,
    registry: 'WREGIS',
    vintage: 2024,
    technology: 'Solar',
    state: 'CA',
    status: 'Exception',
    costBasis: 38,
    mark: 41.5,
    linkedTrade: null,
    linkedSubleg: null,
    sampleSerials: ['WREGIS-2024-CA-SOL-118903']
  },
  {
    id: 'r5',
    range: 'WREGIS-2025-CA-WIN-220145',
    count: 1,
    registry: 'WREGIS',
    vintage: 2025,
    technology: 'Wind',
    state: 'CA',
    status: 'Available',
    costBasis: 12.4,
    mark: 13.1,
    linkedTrade: '88512',
    linkedSubleg: '88512',
    sampleSerials: ['WREGIS-2025-CA-WIN-220145']
  },
  {
    id: 'r6',
    range: 'MRETS-2023-OK-WIN-009842',
    count: 1,
    registry: 'M-RETS',
    vintage: 2023,
    technology: 'Wind',
    state: 'OK',
    status: 'Retired',
    costBasis: 2.05,
    mark: null,
    linkedTrade: '87990',
    linkedSubleg: '87990',
    sampleSerials: ['MRETS-2023-OK-WIN-009842']
  },
  {
    id: 'r7',
    range: 'PJMGATS-2024-PA-SOL-556210 → 556211',
    count: 2,
    registry: 'PJM-GATS',
    vintage: 2024,
    technology: 'Solar',
    state: 'PA',
    status: 'Available',
    costBasis: 28,
    mark: 30.25,
    linkedTrade: '88477',
    linkedSubleg: '88477',
    sampleSerials: ['PJMGATS-2024-PA-SOL-556210', 'PJMGATS-2024-PA-SOL-556211']
  },
  {
    id: 'r8',
    range: 'NAR-2024-IA-WIN-771204',
    count: 1,
    registry: 'NAR',
    vintage: 2024,
    technology: 'Wind',
    state: 'IA',
    status: 'Allocated',
    costBasis: 2.8,
    mark: 3.05,
    linkedTrade: '88503',
    linkedSubleg: '88503',
    sampleSerials: ['NAR-2024-IA-WIN-771204']
  },
  {
    id: 'r9',
    range: 'WREGIS-2024-NM-HYD-008201 → 008202',
    count: 2,
    registry: 'WREGIS',
    vintage: 2024,
    technology: 'Hydro',
    state: 'NM',
    status: 'Available',
    costBasis: 18.5,
    mark: 19.2,
    linkedTrade: '88488',
    linkedSubleg: '88488',
    sampleSerials: ['WREGIS-2024-NM-HYD-008201', 'WREGIS-2024-NM-HYD-008202']
  },
  {
    id: 'r10',
    range: 'MRETS-2024-OK-BIO-003401',
    count: 1,
    registry: 'M-RETS',
    vintage: 2024,
    technology: 'Biomass',
    state: 'OK',
    status: 'Available',
    costBasis: 5.6,
    mark: 6.1,
    linkedTrade: '88520',
    linkedSubleg: '88520',
    sampleSerials: ['MRETS-2024-OK-BIO-003401']
  },
  {
    id: 'r11',
    range: 'MRETS-2024-IA-BIO-003402',
    count: 1,
    registry: 'M-RETS',
    vintage: 2024,
    technology: 'Biomass',
    state: 'IA',
    status: 'Allocated',
    costBasis: 5.4,
    mark: 5.9,
    linkedTrade: '88521',
    linkedSubleg: '88521',
    sampleSerials: ['MRETS-2024-IA-BIO-003402']
  }
];

let ciSelectedRows = new Set();
let ciSelectedRanges = new Set();
let ciViewMode = 'individual';
let ciExpandedRanges = new Set();

function ciGetRangeById(rangeId) {
  for (var i = 0; i < CI_RANGES.length; i++) {
    if (CI_RANGES[i].id === rangeId) return CI_RANGES[i];
  }
  return null;
}

function ciSelectedCertificateCount() {
  var total = 0;
  ciSelectedRanges.forEach(function (rangeId) {
    var range = ciGetRangeById(rangeId);
    if (range) total += range.count;
  });
  return total;
}

function ciStatusHtml(status) {
  return ciStatusPillFromMap(status, window.CI_STATUS_TONE);
}

function ciTechIconCellHtml(technology) {
  return '<td class="ci-col-tech-icon">' + ciTechHtml(technology) + '</td>';
}

function ciTechLabelCellHtml(technology) {
  return '<td class="ci-col-tight ci-col-tech-label">' + (technology || '') + '</td>';
}

function ciEmptyTechIconCellHtml() {
  return '<td class="ci-col-tech-icon"></td>';
}

function ciEmptyTechLabelCellHtml() {
  return '<td class="ci-col-tight ci-col-tech-label"></td>';
}

function ciMoneyHtml(value) {
  if (value == null) return '<span class="ci-cell-empty">—</span>';
  return '$' + value.toFixed(2);
}

function ciSerialHtml(row) {
  var pending = row.serial.indexOf('(') === 0;
  var classes = 'ci-serial-cell';
  if (pending) classes += ' ci-serial-cell--pending';
  if (row.status === 'Retired') classes += ' ci-serial-cell--retired';
  return '<span class="' + classes + '">' + row.serial + '</span>';
}

function ciRegistryHtml(registry) {
  if (!registry || registry === '—') return '<span class="ci-cell-empty">—</span>';
  return registry;
}

function ciRowMenuHtml(menuItems) {
  var items = menuItems || ['View Certificate', 'View Audit', 'Edit', 'Link to Trade'];
  return ciRowMenuCellHtml(items.map(function (label) {
    var attrs = '';
    if (label === 'View Audit') attrs = 'data-ci-menu-action="view-audit"';
    else if (label === 'Edit') attrs = 'data-ci-menu-action="edit"';
    else if (label === 'Link to Trade') attrs = 'data-ci-menu-action="link-trade"';
    return { label: label, attrs: attrs };
  }));
}

function ciRangeMenuItems(range) {
  if (range.status === 'Exception') return ['Match'];
  if (range.status === 'Retired') return ['Export'];
  if (range.status === 'Forecast') return ['Assign'];
  return ['Assign', 'Retire', 'Transfer'];
}

function ciEmptyMenuCellHtml() {
  return '<td class="trades-col-menu"></td>';
}

function ciEmptyCheckboxCellHtml() {
  return '<td class="ci-col-checkbox"></td>';
}

function ciRangeExpandBtnHtml(rangeId, expanded) {
  return (
    '<button type="button" class="ci-range-expand" data-ci-range-id="' + rangeId + '" aria-label="' +
      (expanded ? 'Collapse range' : 'Expand range') + '" aria-expanded="' + (expanded ? 'true' : 'false') + '">' +
      '<svg class="ci-range-expand-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">' +
        '<path d="M9 18l6-6-6-6"/>' +
      '</svg>' +
    '</button>'
  );
}

function ciRangeExpandSpacerHtml() {
  return '<span class="ci-range-expand-spacer" aria-hidden="true"></span>';
}

function ciRangeSerialCellHtml(range, expanded, canExpand) {
  var leading = canExpand
    ? ciRangeExpandBtnHtml(range.id, expanded)
    : ciRangeExpandSpacerHtml();
  return (
    '<td class="ci-col-serial-range ci-col-tight">' +
      '<div class="ci-serial-range-cell">' +
        leading +
        ciRangeLabelHtml(range.range) +
      '</div>' +
    '</td>'
  );
}

function ciRangeChildSerialCellHtml(serial) {
  return (
    '<td class="ci-col-serial-range ci-col-tight">' +
      '<div class="ci-serial-range-cell">' +
        ciRangeExpandSpacerHtml() +
        '<span class="ci-serial-child">' + serial + '</span>' +
      '</div>' +
    '</td>'
  );
}

function ciIndividualHeadHtml() {
  return (
    '<tr>' +
      '<th class="trades-col-menu" aria-label="Actions"></th>' +
      '<th class="ci-col-checkbox">' +
        '<input type="checkbox" id="ci-select-all-checkbox" aria-label="Select all rows">' +
      '</th>' +
      '<th class="ci-col-tech-icon" aria-hidden="true"></th>' +
      '<th class="inv-col-status ci-col-tight">Status</th>' +
      '<th class="ci-col-serial ci-col-tight">Serial Number</th>' +
      '<th class="ci-col-tight">Registry</th>' +
      '<th class="ci-col-tight">Vintage</th>' +
      '<th class="ci-col-tight ci-col-tech-label">Technology</th>' +
      '<th class="ci-col-tight ci-col-state">State</th>' +
      '<th class="ci-col-num ci-col-tight">Volume (MWh)</th>' +
      '<th class="ci-col-num ci-col-tight">Cost Basis</th>' +
      '<th class="ci-col-num ci-col-tight">Mark</th>' +
      '<th class="ci-col-tight">Linked Trade</th>' +
      '<th>Linked Subleg</th>' +
    '</tr>'
  );
}

function ciFindCertBySerial(serial) {
  for (var i = 0; i < CI_CERTIFICATES.length; i++) {
    if (CI_CERTIFICATES[i].serial === serial) return CI_CERTIFICATES[i];
  }
  return null;
}

function ciCertIndex(cert) {
  if (!cert) return -1;
  for (var i = 0; i < CI_CERTIFICATES.length; i++) {
    if (CI_CERTIFICATES[i].serial === cert.serial) return i;
  }
  return -1;
}

function ciGroupedHeadHtml() {
  return (
    '<tr>' +
      '<th class="trades-col-menu" aria-label="Actions"></th>' +
      '<th class="ci-col-checkbox">' +
        '<input type="checkbox" id="ci-select-all-checkbox" aria-label="Select all ranges">' +
      '</th>' +
      '<th class="ci-col-tech-icon" aria-hidden="true"></th>' +
      '<th class="inv-col-status ci-col-tight">Status</th>' +
      '<th class="ci-col-serial ci-col-tight">Serial Number</th>' +
      '<th class="ci-col-tight">Registry</th>' +
      '<th class="ci-col-tight">Vintage</th>' +
      '<th class="ci-col-tight ci-col-tech-label">Technology</th>' +
      '<th class="ci-col-tight ci-col-state">State</th>' +
      '<th class="ci-col-num ci-col-tight">Certs</th>' +
      '<th class="ci-col-num ci-col-tight">Cost Basis</th>' +
      '<th class="ci-col-num ci-col-tight">Mark</th>' +
      '<th class="ci-col-tight">Linked Trade</th>' +
      '<th>Linked Subleg</th>' +
    '</tr>'
  );
}

function ciGroupedRangeCellsHtml(range, expanded, canExpand) {
  return (
    ciTechIconCellHtml(range.technology) +
    '<td class="inv-status-cell ci-col-tight">' + ciStatusHtml(range.status) + '</td>' +
    ciRangeSerialCellHtml(range, expanded, canExpand) +
    '<td class="ci-col-tight">' + ciRegistryHtml(range.registry) + '</td>' +
    '<td class="ci-col-tight">' + range.vintage + '</td>' +
    ciTechLabelCellHtml(range.technology) +
    '<td class="ci-col-tight ci-col-state">' + range.state + '</td>' +
    '<td class="ci-col-num ci-col-tight">' + range.count + '</td>' +
    '<td class="ci-col-num ci-col-tight">' + ciMoneyHtml(range.costBasis) + '</td>' +
    '<td class="ci-col-num ci-col-tight">' + ciMoneyHtml(range.mark) + '</td>' +
    '<td class="ci-col-tight">' + ciLinkedTradeLinkHtml(range.linkedTrade, { unlinked: true }) + '</td>' +
    '<td>' + ciLinkedTradeLinkHtml(range.linkedSubleg, { unlinked: true }) + '</td>'
  );
}

function ciGroupedCertCellsHtml(cert, serialText) {
  var serial = serialText != null ? serialText : cert.serial;
  return (
    ciTechIconCellHtml(cert.technology) +
    '<td class="inv-status-cell ci-col-tight">' + ciStatusHtml(cert.status) + '</td>' +
    ciRangeChildSerialCellHtml(serial) +
    '<td class="ci-col-tight">' + ciRegistryHtml(cert.registry) + '</td>' +
    '<td class="ci-col-tight">' + cert.vintage + '</td>' +
    ciTechLabelCellHtml(cert.technology) +
    '<td class="ci-col-tight ci-col-state">' + cert.state + '</td>' +
    '<td class="ci-col-num ci-col-tight">1</td>' +
    '<td class="ci-col-num ci-col-tight">' + ciMoneyHtml(cert.costBasis) + '</td>' +
    '<td class="ci-col-num ci-col-tight">' + ciMoneyHtml(cert.mark) + '</td>' +
    '<td class="ci-col-tight">' + ciLinkedTradeLinkHtml(cert.linkedTrade, { unlinked: true }) + '</td>' +
    '<td>' + ciLinkedTradeLinkHtml(cert.linkedSubleg, { unlinked: true }) + '</td>'
  );
}

function ciRangeExpStripeClass(index) {
  return index % 2 === 0 ? 'ci-range-exp-base' : 'ci-range-exp-alt';
}

function renderCiIndividualGrid() {
  var table = document.querySelector('.ci-certificates-grid');
  var thead = document.querySelector('.ci-certificates-grid thead');
  var tbody = document.querySelector('.ci-certificates-grid tbody');
  if (!table || !thead || !tbody) return;

  table.classList.remove('ci-certificates-grid--grouped');
  thead.innerHTML = ciIndividualHeadHtml();

  tbody.innerHTML = CI_CERTIFICATES.map(function (row, index) {
    return (
      '<tr data-index="' + index + '">' +
        ciRowMenuHtml() +
        '<td class="ci-col-checkbox">' +
          '<input type="checkbox" class="row-checkbox" aria-label="Select row">' +
        '</td>' +
        ciTechIconCellHtml(row.technology) +
        '<td class="inv-status-cell ci-col-tight">' + ciStatusHtml(row.status) + '</td>' +
        '<td class="ci-col-serial ci-col-tight">' + ciSerialHtml(row) + '</td>' +
        '<td class="ci-col-tight">' + ciRegistryHtml(row.registry) + '</td>' +
        '<td class="ci-col-tight">' + row.vintage + '</td>' +
        ciTechLabelCellHtml(row.technology) +
        '<td class="ci-col-tight ci-col-state">' + row.state + '</td>' +
        '<td class="ci-col-num ci-col-tight">' + row.volume.toFixed(2) + '</td>' +
        '<td class="ci-col-num ci-col-tight">' + ciMoneyHtml(row.costBasis) + '</td>' +
        '<td class="ci-col-num ci-col-tight">' + ciMoneyHtml(row.mark) + '</td>' +
        '<td class="ci-col-tight">' + ciLinkedTradeLinkHtml(row.linkedTrade, { unlinked: true }) + '</td>' +
        '<td>' + ciLinkedTradeLinkHtml(row.linkedSubleg, { unlinked: true }) + '</td>' +
      '</tr>'
    );
  }).join('');

  bindCiSelectAllCheckbox();
  restoreCiRowSelection();
}

function renderCiGroupedGrid() {
  var table = document.querySelector('.ci-certificates-grid');
  var thead = document.querySelector('.ci-certificates-grid thead');
  var tbody = document.querySelector('.ci-certificates-grid tbody');
  if (!table || !thead || !tbody) return;

  table.classList.add('ci-certificates-grid--grouped');
  thead.innerHTML = ciGroupedHeadHtml();

  var rowsHtml = '';
  CI_RANGES.forEach(function (range) {
    var expanded = ciExpandedRanges.has(range.id);
    var canExpand = range.count > 1;
    rowsHtml +=
      '<tr class="ci-range-row' + (expanded ? ' is-expanded' : '') + '" data-range-id="' + range.id + '"' +
        ' aria-expanded="' + (expanded ? 'true' : 'false') + '">' +
        ciRowMenuHtml(ciRangeMenuItems(range)) +
        '<td class="ci-col-checkbox">' +
          '<input type="checkbox" class="row-checkbox" aria-label="Select range ' + range.range + '">' +
        '</td>' +
        ciGroupedRangeCellsHtml(range, expanded, canExpand) +
      '</tr>';

    if (expanded && canExpand) {
      var hasMoreRow = range.count > range.sampleSerials.length;
      range.sampleSerials.forEach(function (serial, childIndex) {
        var cert = ciFindCertBySerial(serial);
        var certIndex = ciCertIndex(cert);
        var isLast = !hasMoreRow && childIndex === range.sampleSerials.length - 1;
        rowsHtml +=
          '<tr class="ci-range-child ' + ciRangeExpStripeClass(childIndex) + (isLast ? ' ci-range-child-last' : '') + '"' +
            (certIndex >= 0 ? ' data-index="' + certIndex + '"' : '') + '>' +
            ciRowMenuHtml(['View Certificate', 'View Audit', 'Edit', 'Link to Trade']) +
            ciEmptyCheckboxCellHtml() +
            (cert ? ciGroupedCertCellsHtml(cert) : ciGroupedCertCellsHtml({
              status: range.status,
              registry: range.registry,
              vintage: range.vintage,
              technology: range.technology,
              state: range.state,
              volume: 1,
              costBasis: range.costBasis,
              mark: range.mark,
              linkedTrade: range.linkedTrade,
              linkedSubleg: range.linkedSubleg
            }, serial)) +
          '</tr>';
      });
      if (hasMoreRow) {
        rowsHtml +=
          '<tr class="ci-range-child ci-range-child-last ' +
            ciRangeExpStripeClass(range.sampleSerials.length) + '">' +
            ciEmptyMenuCellHtml() +
            ciEmptyCheckboxCellHtml() +
            ciEmptyTechIconCellHtml() +
            '<td class="inv-status-cell"></td>' +
            '<td class="ci-col-serial-range ci-col-tight">' +
              '<div class="ci-serial-range-cell">' +
                ciRangeExpandSpacerHtml() +
                '<span class="ci-cell-empty">…and ' + (range.count - range.sampleSerials.length) + ' more in this range</span>' +
              '</div>' +
            '</td>' +
            '<td colspan="9"></td>' +
          '</tr>';
      }
    }
  });

  tbody.innerHTML = rowsHtml;
  bindCiSelectAllCheckbox();
  restoreCiRangeSelection();
}

function restoreCiRangeSelection() {
  if (ciViewMode !== 'grouped') return;
  ciSelectedRanges.forEach(function (rangeId) {
    ciSetRangeSelected(rangeId, true);
  });
  ciUpdateSelectAllCheckbox();
}

function bindCiSelectAllCheckbox() {
  var selectAllCheckbox = document.getElementById('ci-select-all-checkbox');
  if (!selectAllCheckbox) return;
  selectAllCheckbox.onchange = function (e) {
    ciToggleSelectAll(e.target.checked);
  };
}

function restoreCiRowSelection() {
  if (ciViewMode !== 'individual') return;
  ciSelectedRows.forEach(function (index) {
    ciSetRowSelected(index, true);
  });
  ciUpdateSelectAllCheckbox();
}

function renderCiPortfolioGrid() {
  if (ciViewMode === 'grouped') {
    renderCiGroupedGrid();
  } else {
    renderCiIndividualGrid();
  }
  updateCiPagination();
}

function setCiViewMode(mode) {
  if (mode !== 'individual' && mode !== 'grouped') return;
  ciViewMode = mode;
  ciExpandedRanges.clear();
  ciClearSelection(false);

  var viewSwitch = document.getElementById('ci-view-grouped');
  if (viewSwitch) {
    viewSwitch.checked = mode === 'grouped';
    viewSwitch.setAttribute('aria-checked', mode === 'grouped' ? 'true' : 'false');
  }

  renderCiPortfolioGrid();
  ciRenderSelectionActions();
  ciUpdateSelectionBar();
}

function toggleCiRangeExpand(rangeId) {
  if (ciExpandedRanges.has(rangeId)) {
    ciExpandedRanges.delete(rangeId);
  } else {
    ciExpandedRanges.add(rangeId);
  }
  renderCiGroupedGrid();
}

function updateCiPagination() {
  var countEl = document.querySelector('.ci-portfolio-page .pagination-count-text');
  if (!countEl) return;

  var total = ciViewMode === 'grouped' ? CI_RANGES.length : CI_CERTIFICATES.length;
  countEl.textContent = ciGridPaginationCountText(total);
}

function ciSetRangeSelected(rangeId, checked) {
  var row = document.querySelector('.ci-certificates-grid tbody tr.ci-range-row[data-range-id="' + rangeId + '"]');
  if (!row) return;

  var checkbox = row.querySelector('.row-checkbox');
  if (checkbox) checkbox.checked = checked;

  if (checked) {
    ciSelectedRanges.add(rangeId);
    row.classList.add('selected');
  } else {
    ciSelectedRanges.delete(rangeId);
    row.classList.remove('selected');
  }
}

function ciToggleRangeSelection(rangeId, checked) {
  if (ciViewMode !== 'grouped') return;
  ciSetRangeSelected(rangeId, checked);
  ciUpdateSelectionBar();
  ciUpdateSelectAllCheckbox();
}

function ciSetRowSelected(index, checked) {
  var row = document.querySelector('.ci-certificates-grid tbody tr[data-index="' + index + '"]');
  if (!row) return;

  var checkbox = row.querySelector('.row-checkbox');
  if (checkbox) checkbox.checked = checked;

  if (checked) {
    ciSelectedRows.add(index);
    row.classList.add('selected');
  } else {
    ciSelectedRows.delete(index);
    row.classList.remove('selected');
  }
}

function ciToggleRowSelection(index, checked) {
  if (ciViewMode !== 'individual') return;
  ciSetRowSelected(index, checked);
  ciUpdateSelectionBar();
  ciUpdateSelectAllCheckbox();
}

function ciToggleSelectAll(checked) {
  if (ciViewMode === 'grouped') {
    document.querySelectorAll('.ci-certificates-grid tbody tr.ci-range-row[data-range-id]').forEach(function (row) {
      ciSetRangeSelected(row.dataset.rangeId, checked);
    });
    ciUpdateSelectionBar();
    ciUpdateSelectAllCheckbox();
    return;
  }

  document.querySelectorAll('.ci-certificates-grid tbody tr[data-index]').forEach(function (row) {
    ciSetRowSelected(parseInt(row.dataset.index, 10), checked);
  });
  ciUpdateSelectionBar();
  ciUpdateSelectAllCheckbox();
}

function ciUpdateSelectAllCheckbox() {
  var selectAllCheckbox = document.getElementById('ci-select-all-checkbox');
  if (!selectAllCheckbox) return;

  if (ciViewMode === 'grouped') {
    var totalRanges = CI_RANGES.length;
    var checkedRanges = ciSelectedRanges.size;
    selectAllCheckbox.checked = checkedRanges === totalRanges && totalRanges > 0;
    selectAllCheckbox.indeterminate = checkedRanges > 0 && checkedRanges < totalRanges;
    return;
  }

  var totalRows = CI_CERTIFICATES.length;
  var checkedRows = ciSelectedRows.size;

  selectAllCheckbox.checked = checkedRows === totalRows && totalRows > 0;
  selectAllCheckbox.indeterminate = checkedRows > 0 && checkedRows < totalRows;
}

function ciRenderSelectionActions() {
  var container = document.getElementById('ci-selection-actions');
  if (!container) return;

  var actions = CI_SELECTION_ACTIONS[ciViewMode] || [];
  container.innerHTML = actions.map(function (label) {
    return '<button type="button" class="selection-btn secondary">' + label + '</button>';
  }).join('');
}

function ciUpdateSelectionBar() {
  var bar = document.getElementById('ci-selection-bar');
  var summary = document.getElementById('ci-selection-summary');
  var tableWrapper = document.querySelector('body.ci-portfolio-page .table-wrapper');
  if (!bar || !summary) return;

  var hasSelection = ciViewMode === 'grouped'
    ? ciSelectedRanges.size > 0
    : ciSelectedRows.size > 0;

  if (hasSelection) {
    if (tableWrapper && bar.parentElement !== tableWrapper) {
      tableWrapper.appendChild(bar);
    }

    if (ciViewMode === 'grouped') {
      var certCount = ciSelectedCertificateCount();
      var certNoun = certCount === 1 ? 'certificate' : 'certificates';
      summary.textContent = certCount + ' ' + certNoun + ' selected';
    } else {
      var noun = ciSelectedRows.size === 1 ? 'certificate' : 'certificates';
      summary.textContent = ciSelectedRows.size + ' ' + noun + ' selected';
    }

    bar.classList.add('visible');
    return;
  }

  bar.classList.remove('visible');
}

function ciClearSelection(updateBar) {
  if (updateBar !== false) updateBar = true;
  ciSelectedRows.clear();
  ciSelectedRanges.clear();
  document.querySelectorAll('.ci-certificates-grid tbody tr[data-index]').forEach(function (row) {
    ciSetRowSelected(parseInt(row.dataset.index, 10), false);
  });
  document.querySelectorAll('.ci-certificates-grid tbody tr.ci-range-row[data-range-id]').forEach(function (row) {
    ciSetRangeSelected(row.dataset.rangeId, false);
  });
  if (updateBar) {
    ciUpdateSelectionBar();
    ciUpdateSelectAllCheckbox();
  }
}

function initCiPortfolioGridEvents() {
  var tbody = document.querySelector('.ci-certificates-grid tbody');
  if (!tbody) return;

  tbody.addEventListener('click', function (e) {
    var expandBtn = e.target.closest('.ci-range-expand');
    if (expandBtn) {
      e.stopPropagation();
      toggleCiRangeExpand(expandBtn.dataset.ciRangeId);
      return;
    }

    var menuBtn = e.target.closest('.trades-row-menu-btn');
    if (menuBtn) {
      ciToggleGridRowMenu(e, menuBtn, '.ci-certificates-grid');
      return;
    }

    var auditItem = e.target.closest('.te-row-menu-item[data-ci-menu-action="view-audit"]');
    if (auditItem) {
      e.stopPropagation();
      ciCloseGridRowMenus('.ci-certificates-grid');
      var auditRow = auditItem.closest('tr');
      var auditIndex = auditRow && auditRow.dataset.index;
      if (auditIndex != null && typeof window.ciCertAuditOpen === 'function') {
        var auditCert = CI_CERTIFICATES[parseInt(auditIndex, 10)];
        if (auditCert) window.ciCertAuditOpen(auditCert);
      }
      return;
    }

    var menuItem = e.target.closest('.te-row-menu-item[data-ci-menu-action="edit"]');
    if (menuItem) {
      e.stopPropagation();
      ciCloseGridRowMenus('.ci-certificates-grid');
      var row = menuItem.closest('tr');
      var index = row && row.dataset.index;
      if (index != null && typeof window.ciAddCertOpenForEdit === 'function') {
        var cert = CI_CERTIFICATES[parseInt(index, 10)];
        if (cert) window.ciAddCertOpenForEdit(cert);
      }
      return;
    }

    var linkItem = e.target.closest('.te-row-menu-item[data-ci-menu-action="link-trade"]');
    if (linkItem) {
      e.stopPropagation();
      ciCloseGridRowMenus('.ci-certificates-grid');
      var linkRow = linkItem.closest('tr');
      var linkIndex = linkRow && linkRow.dataset.index;
      if (linkIndex != null && typeof window.ciLinkTradeOpen === 'function') {
        window.ciLinkTradeOpen(parseInt(linkIndex, 10));
      }
      return;
    }

    if (e.target.closest('.te-row-menu-wrap')) {
      e.stopPropagation();
    }
  });

  tbody.addEventListener('change', function (e) {
    if (!e.target.matches('.row-checkbox')) return;
    var row = e.target.closest('tr');
    if (!row) return;

    if (row.dataset.rangeId) {
      ciToggleRangeSelection(row.dataset.rangeId, e.target.checked);
      return;
    }

    if (row.dataset.index != null) {
      ciToggleRowSelection(parseInt(row.dataset.index, 10), e.target.checked);
    }
  });

  ciBindGridRowMenuDismiss('.ci-certificates-grid');
}

function initCiViewToggle() {
  var viewSwitch = document.getElementById('ci-view-grouped');
  if (!viewSwitch) return;

  viewSwitch.addEventListener('change', function () {
    setCiViewMode(viewSwitch.checked ? 'grouped' : 'individual');
  });
}

function ciClearFilters() {
  ciResetSelectFilters('#ci-portfolio-filters-collapse');
}

function ciApplyFilters() {
  renderCiPortfolioGrid();
}

function initCiPortfolioPage() {
  initCiViewToggle();
  ciInitPageAsOfPicker('ci-portfolio');
  ciRenderSelectionActions();
  renderCiPortfolioGrid();
  initCiPortfolioGridEvents();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCiPortfolioPage);
} else {
  initCiPortfolioPage();
}

// Exposed for inline handlers in portfolio.html
window.ciClearSelection = ciClearSelection;
window.ciClearFilters = ciClearFilters;
window.ciApplyFilters = ciApplyFilters;
window.renderCiPortfolioGrid = renderCiPortfolioGrid;
window.CI_CERTIFICATES = CI_CERTIFICATES;
