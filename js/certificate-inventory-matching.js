var CI_MATCHING_ITEMS = [
  {
    id: 'i1',
    source: 'innovo',
    sourceLabel: 'Innovo Sync',
    n: 51,
    tech: 'Wind',
    state: 'TX',
    vin: 2024,
    reg: 'M-RETS',
    age: '2 hours ago',
    batch: 'INV-7741',
    rangeShort: '004100…004150',
    matches: [
      { trade: '88301', type: 'Buy', desc: 'Panhandle Wind PPA · Mar-2024 delivery · open qty 51 MWh' },
      { trade: '88409', type: 'Buy', desc: 'ERCOT Wind Block · Feb-2024 delivery · open qty 120 MWh' },
      { trade: '88398', type: 'Buy', desc: 'West TX Wind · Jan-2024 delivery · open qty 25 MWh' }
    ]
  },
  {
    id: 'i2',
    source: 'auto',
    sourceLabel: 'Auto-match',
    n: 100,
    tech: 'Wind',
    state: 'OK',
    vin: 2023,
    reg: 'M-RETS',
    age: '1 day ago',
    batch: 'AUT-3310',
    rangeShort: '009800…009899',
    matches: [
      { trade: '87990', type: 'Retire', desc: 'RPS Compliance 2023 · OK obligation · 100 MWh' },
      { trade: '87955', type: 'Buy', desc: 'SPP Wind Strip · Dec-2023 · open qty 60 MWh' }
    ]
  },
  {
    id: 'i3',
    source: 'manual',
    sourceLabel: 'Manual Upload',
    n: 23,
    tech: 'Solar',
    state: 'CA',
    vin: 2024,
    reg: 'WREGIS',
    age: '5 hours ago',
    batch: 'MAN-9920',
    rangeShort: '118900…118922',
    matches: [
      { trade: '88440', type: 'Buy', desc: 'CAISO Solar PCC1 · Apr-2024 · open qty 30 MWh' },
      { trade: '88461', type: 'Buy', desc: 'NorCal PV · Mar-2024 · open qty 12 MWh' }
    ]
  },
  {
    id: 'i4',
    source: 'innovo',
    sourceLabel: 'Innovo Sync',
    n: 12,
    tech: 'Solar',
    state: 'TX',
    vin: 2025,
    reg: 'ERCOT',
    age: '1 day ago',
    batch: 'INV-7755',
    rangeShort: 'PV-001…012',
    matches: [
      { trade: '88512', type: 'Buy', desc: 'ERCOT Solar 2025 · Feb-2025 · open qty 12 MWh' }
    ]
  },
  {
    id: 'i5',
    source: 'manual',
    sourceLabel: 'Manual Upload',
    n: 8,
    tech: 'Hydro',
    state: 'NM',
    vin: 2024,
    reg: 'WREGIS',
    age: '2 days ago',
    batch: 'MAN-9931',
    rangeShort: 'HY-200…207',
    matches: [
      { trade: '88488', type: 'Buy', desc: 'SW Hydro REC · 2024 · open qty 8 MWh' }
    ]
  },
  {
    id: 'i6',
    source: 'auto',
    sourceLabel: 'Auto-match',
    n: 40,
    tech: 'Wind',
    state: 'IA',
    vin: 2024,
    reg: 'NAR',
    age: '2 days ago',
    batch: 'AUT-3318',
    rangeShort: '771200…771239',
    matches: [
      { trade: '88503', type: 'Sell', desc: 'Brookfield IA Wind · May-2024 · open qty 40 MWh' }
    ]
  },
  {
    id: 'i7',
    source: 'innovo',
    sourceLabel: 'Innovo Sync',
    n: 35,
    tech: 'Biomass',
    state: 'OK',
    vin: 2024,
    reg: 'M-RETS',
    age: '3 hours ago',
    batch: 'INV-7762',
    rangeShort: 'BIO-310…344',
    matches: [
      { trade: '88520', type: 'Buy', desc: 'OK Biomass REC Strip · Apr-2024 delivery · open qty 35 MWh' },
      { trade: '88521', type: 'Buy', desc: 'Central OK Biofuel · Mar-2024 delivery · open qty 20 MWh' }
    ]
  },
  {
    id: 'i8',
    source: 'manual',
    sourceLabel: 'Manual Upload',
    n: 18,
    tech: 'Biomass',
    state: 'IA',
    vin: 2024,
    reg: 'M-RETS',
    age: '6 hours ago',
    batch: 'MAN-9940',
    rangeShort: 'BIO-880…897',
    matches: [
      { trade: '88522', type: 'Buy', desc: 'IA Biomass Block · May-2024 delivery · open qty 18 MWh' },
      { trade: '88523', type: 'Sell', desc: 'Midwest Bio REC · Jun-2024 delivery · open qty 30 MWh' }
    ]
  }
];

var CI_MATCH_CATALOG = ciMatchingBuildMatchCatalog(CI_MATCHING_ITEMS);

var ciMatchingState = {
  selectedId: 'i1',
  appliedFilters: {
    source: 'All',
    registry: 'All'
  }
};

function ciMatchingQueueSummaryHtml(item) {
  return (
    '<span class="ci-matching-queue-summary-count">' + item.n + '</span>' +
    '<span class="ci-matching-queue-summary-noun">certificates</span>' +
    '<span class="ci-matching-queue-summary-sep" aria-hidden="true"></span>' +
    '<span class="ci-matching-queue-summary-meta">' + item.tech + ', ' + item.state + ', Vintage ' + item.vin + ', ' + item.reg + '</span>'
  );
}

function ciMatchingSelectValue(id) {
  var el = document.getElementById(id);
  return el ? el.value : 'All';
}

function ciMatchingReadQueueFilterValues() {
  return {
    source: ciMatchingSelectValue('ci-matching-queue-filter-source'),
    registry: ciMatchingSelectValue('ci-matching-queue-filter-registry')
  };
}

function ciMatchingGetFilteredItems() {
  var filters = ciMatchingState.appliedFilters;

  return CI_MATCHING_ITEMS.filter(function (item) {
    if (filters.source !== 'All' && item.sourceLabel !== filters.source) return false;
    if (filters.registry !== 'All' && item.reg !== filters.registry) return false;
    return true;
  });
}

function ciMatchingGetSelectedItem(items) {
  var list = items || ciMatchingGetFilteredItems();
  if (!list.length) return null;
  var selected = list.find(function (item) { return item.id === ciMatchingState.selectedId; });
  return selected || list[0];
}

function ciMatchingBatchMetaHtml(item) {
  return (
    '<div class="ci-matching-batch-header-meta">' +
      'batch #' + item.batch +
    '</div>'
  );
}

function ciMatchingSplitSectionShellHtml() {
  return (
    '<div class="ci-matching-split-section">' +
      '<div class="ci-matching-split-body" id="ci-matching-split-body"></div>' +
      '<div class="ci-matching-split-footer">' +
        '<button type="button" class="action-btn" data-ci-split-action="clear-form">Reset</button>' +
        '<button type="button" class="action-btn action-btn-primary" data-ci-split-action="apply" disabled>Apply</button>' +
      '</div>' +
    '</div>'
  );
}

function ciMatchingRemoveCurrentBatch() {
  var id = ciMatchingState.selectedId;
  var index = -1;
  for (var i = 0; i < CI_MATCHING_ITEMS.length; i++) {
    if (CI_MATCHING_ITEMS[i].id === id) {
      index = i;
      break;
    }
  }
  if (index === -1) return;

  CI_MATCHING_ITEMS.splice(index, 1);
  var items = ciMatchingGetFilteredItems();
  ciMatchingState.selectedId = items.length ? items[0].id : null;
  renderCiMatchingQueue();
}


function renderCiMatchingDetail() {
  var detailEl = document.getElementById('ci-matching-detail');
  if (!detailEl) return;

  var items = ciMatchingGetFilteredItems();
  var item = ciMatchingGetSelectedItem(items);

  if (!item) {
    var filteredEmpty = ciMatchingHasActiveQueueFilters();
    detailEl.className = 'content-card ci-matching-batch-panel ci-matching-batch-panel--empty';
    detailEl.innerHTML =
      '<div class="ci-matching-batch-panel-body">' +
        '<div class="ci-matching-empty">' +
          '<div class="ci-matching-empty-title">' +
            (filteredEmpty ? 'No batch selected' : 'No batches in queue') +
          '</div>' +
          '<div class="ci-matching-empty-text">' +
            (filteredEmpty ? 'Adjust filters or select a batch from the queue.' : 'Every certificate batch has been matched.') +
          '</div>' +
        '</div>' +
      '</div>';
    if (typeof window.ciMatchingInitMatchCard === 'function') {
      window.ciMatchingInitMatchCard(null);
    }
    return;
  }

  detailEl.className = 'content-card ci-matching-batch-panel';
  detailEl.innerHTML =
    '<div class="card-header ci-matching-batch-panel-header">' +
      '<div class="ci-matching-batch-header-main">' +
        '<div class="ci-matching-batch-header-icon">' + ciTechHtml(item.tech) + '</div>' +
        '<div class="ci-matching-batch-header-text">' +
          '<h2 class="ci-matching-batch-title">' + ciMatchingQueueSummaryHtml(item) + '</h2>' +
        '</div>' +
      '</div>' +
      ciMatchingBatchMetaHtml(item) +
    '</div>' +
    '<div class="ci-matching-batch-panel-body">' +
      '<div class="ci-matching-batch-attrs">' +
        ciMatchingBatchAttrHtml('Registry', item.reg) +
        ciMatchingBatchAttrHtml('Vintage', String(item.vin)) +
        ciMatchingBatchAttrHtml('Technology', item.tech) +
        ciMatchingBatchAttrHtml('Geography', item.state) +
        ciMatchingBatchAttrHtml('Volume', item.n + '.00 MWh') +
        ciMatchingBatchAttrHtml('Serial Range', ciRangeLabelHtml(item.rangeShort), 'ci-matching-batch-attr-value--serial') +
      '</div>' +
      ciMatchingSplitSectionShellHtml() +
    '</div>';

  if (typeof window.ciMatchingInitMatchCard === 'function') {
    window.ciMatchingInitMatchCard(item);
  }
}

function ciMatchingHasActiveQueueFilters() {
  var filters = ciMatchingState.appliedFilters;
  return filters.source !== 'All' || filters.registry !== 'All';
}

function ciMatchingClearFilters() {
  ciResetSelectFilters('.ci-matching-queue-filters');
  ciMatchingState.appliedFilters = { source: 'All', registry: 'All' };
  renderCiMatchingQueue();
}

function ciMatchingApplyFilters() {
  ciMatchingState.appliedFilters = ciMatchingReadQueueFilterValues();
  renderCiMatchingQueue();
}

function renderCiMatchingQueue() {
  var queueEl = document.getElementById('ci-matching-queue-list');
  if (!queueEl) return;

  var items = ciMatchingGetFilteredItems();

  ciSetMatchingBatchCount(CI_MATCHING_ITEMS.length);
  ciSyncMatchingQueueBadge(items.length);

  if (!items.length) {
    var filteredEmpty = ciMatchingHasActiveQueueFilters();
    queueEl.innerHTML =
      '<div class="ci-matching-queue-empty">' +
        '<i class="fas fa-' + (filteredEmpty ? 'filter' : 'check-circle') + ' ci-matching-queue-empty-icon" aria-hidden="true"></i>' +
        '<div class="ci-matching-queue-empty-title">' + (filteredEmpty ? 'No matching batches' : 'Queue zero') + '</div>' +
        '<div class="ci-matching-queue-empty-text">' +
          (filteredEmpty ? 'Try changing your filters.' : 'Every certificate batch has been matched.') +
        '</div>' +
      '</div>';
    renderCiMatchingDetail();
    return;
  }

  if (!items.some(function (item) { return item.id === ciMatchingState.selectedId; })) {
    ciMatchingState.selectedId = items[0].id;
  }

  queueEl.innerHTML = items.map(function (item) {
    var isSelected = item.id === ciMatchingState.selectedId;
    return (
      '<div class="ci-matching-queue-item' + (isSelected ? ' is-selected' : '') + '"' +
        ' data-queue-id="' + item.id + '">' +
        '<div class="ci-matching-queue-item-icon">' + ciTechHtml(item.tech) + '</div>' +
        '<div class="ci-matching-queue-item-main">' +
          '<div class="ci-matching-queue-item-top">' +
            '<span class="ci-matching-source">' + item.sourceLabel + '</span>' +
            '<span class="ci-matching-queue-age">' + item.age + '</span>' +
          '</div>' +
          '<div class="ci-matching-queue-summary">' + ciMatchingQueueSummaryHtml(item) + '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');

  renderCiMatchingDetail();
}

function initCiMatchingQueueEvents() {
  var queueEl = document.getElementById('ci-matching-queue-list');
  if (!queueEl || queueEl.dataset.ciMatchingQueueBound === '1') return;
  queueEl.dataset.ciMatchingQueueBound = '1';

  queueEl.addEventListener('click', function (event) {
    var itemEl = event.target.closest('.ci-matching-queue-item[data-queue-id]');
    if (!itemEl) return;
    ciMatchingState.selectedId = itemEl.getAttribute('data-queue-id');
    renderCiMatchingQueue();
  });
}

function initCiMatchingSplitResize() {
  var split = document.querySelector('.ci-matching-split');
  var leftPane = document.querySelector('.ci-matching-split-left');
  var rightPane = document.querySelector('.ci-matching-split-right');
  var handle = document.getElementById('ci-matching-resize-handle');
  if (!split || !leftPane || !rightPane || !handle) return;

  var isResizing = false;
  var startX = 0;
  var startLeftWidth = 0;
  var minLeft = 220;
  var minRight = 280;

  function onMove(event) {
    if (!isResizing) return;
    var splitWidth = split.getBoundingClientRect().width;
    var handleWidth = handle.getBoundingClientRect().width;
    var maxLeft = Math.max(minLeft, splitWidth - handleWidth - minRight);
    var next = Math.max(minLeft, Math.min(maxLeft, startLeftWidth + (event.clientX - startX)));
    leftPane.style.width = next + 'px';
    leftPane.style.flex = '0 0 ' + next + 'px';
    rightPane.style.flex = '1 1 auto';
    event.preventDefault();
  }

  function onUp() {
    if (!isResizing) return;
    isResizing = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    split.classList.remove('is-resizing');
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  }

  function startResize(clientX) {
    isResizing = true;
    startX = clientX;
    startLeftWidth = leftPane.getBoundingClientRect().width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    split.classList.add('is-resizing');
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  handle.addEventListener('mousedown', function (event) {
    startResize(event.clientX);
    event.preventDefault();
  });

  handle.addEventListener('keydown', function (event) {
    var splitWidth = split.getBoundingClientRect().width;
    var handleWidth = handle.getBoundingClientRect().width;
    var maxLeft = Math.max(minLeft, splitWidth - handleWidth - minRight);
    var current = leftPane.getBoundingClientRect().width;
    var step = event.shiftKey ? 48 : 16;
    var next = current;

    if (event.key === 'ArrowLeft') next = current - step;
    else if (event.key === 'ArrowRight') next = current + step;
    else return;

    next = Math.max(minLeft, Math.min(maxLeft, next));
    leftPane.style.width = next + 'px';
    leftPane.style.flex = '0 0 ' + next + 'px';
    rightPane.style.flex = '1 1 auto';
    event.preventDefault();
  });
}

function initCiMatchingPage() {
  renderCiMatchingQueue();
  initCiMatchingQueueEvents();
  initCiMatchingSplitResize();
}

document.addEventListener('DOMContentLoaded', initCiMatchingPage);

window.ciMatchingClearFilters = ciMatchingClearFilters;
window.ciMatchingApplyFilters = ciMatchingApplyFilters;
