/**
 * Certificate Inventory — Split allocation UI on Allocation batch detail.
 * Depends on: certificate-inventory-shared.js, certificate-inventory-matching.js
 *   (CI_MATCH_CATALOG, ciMatchingResultStripHtml, ciMatchingGetSelectedItem, ciMatchingRemoveCurrentBatch)
 */
(function () {
  'use strict';

  var CI_MATCH_SPLIT_SEL = '#ci-matching-detail .ci-matching-split-section';

  var ciMatchingSplitState = null;
  var ciMatchingSplitSuppressStripClick = false;

  function ciMatchingBuildSplitState(item) {
    return {
      batch: item.batch,
      total: item.n,
      targets: [],
      search: '',
      selectedSearchIds: []
    };
  }

  function ciMatchingGetSplitAllocatedSum(state) {
    return state.targets.reduce(function (sum, target) {
      return sum + target.amount;
    }, 0);
  }

  function ciMatchingGetSplitUnassigned(state) {
    return state.total - ciMatchingGetSplitAllocatedSum(state);
  }

  function ciMatchingSplitSearchResults(state) {
    return ciMatchingFilterCatalog(CI_MATCH_CATALOG, state.search);
  }

  function ciMatchingSplitTargetExists(state, key) {
    return state.targets.some(function (target) { return target.key === key; });
  }

  function ciMatchingSplitZeroTargetCount(state) {
    return state.targets.filter(function (target) { return target.amount === 0; }).length;
  }

  function ciMatchingTargetFromCandidate(candidate) {
    return {
      key: candidate.id,
      tech: candidate.tech,
      trade: candidate.trade,
      name: candidate.name,
      delivery: candidate.delivery,
      openQty: candidate.openQty,
      amount: 0
    };
  }

  function ciMatchingAddSplitTargetsFromCandidateIds(state, candidateIds) {
    var addedAny = false;
    var lastAddedId = null;
    candidateIds.forEach(function (candidateId) {
      var candidate = CI_MATCH_CATALOG.find(function (c) { return c.id === candidateId; });
      if (!candidate || ciMatchingSplitTargetExists(state, candidate.id)) return;
      state.targets.push(ciMatchingTargetFromCandidate(candidate));
      lastAddedId = candidate.id;
      addedAny = true;
    });
    if (lastAddedId) state.focusTargetKey = lastAddedId;
    return addedAny;
  }

  function ciMatchingPruneSplitSearchSelection(state) {
    var visibleIds = ciMatchingSplitSearchResults(state).map(function (c) { return c.id; });
    state.selectedSearchIds = state.selectedSearchIds.filter(function (id) {
      return visibleIds.indexOf(id) !== -1 && !ciMatchingSplitTargetExists(state, id);
    });
  }

  function ciMatchingToggleSplitSearchSelection(candidateId) {
    if (!ciMatchingSplitState || ciMatchingSplitTargetExists(ciMatchingSplitState, candidateId)) return;
    var selected = ciMatchingSplitState.selectedSearchIds;
    var index = selected.indexOf(candidateId);
    if (index === -1) selected.push(candidateId);
    else selected.splice(index, 1);
    ciMatchingUpdateSplitSearchSelectionUi();
  }

  function ciMatchingUpdateSplitSearchSelectionUi() {
    var state = ciMatchingSplitState;
    if (!state) return;
    document.querySelectorAll(
      CI_MATCH_SPLIT_SEL + ' .ci-split-search-strips .ci-matching-result-strip[data-ci-split-candidate-id]'
    ).forEach(function (strip) {
      var id = strip.getAttribute('data-ci-split-candidate-id');
      var isSelected = state.selectedSearchIds.indexOf(id) !== -1;
      strip.classList.toggle('is-selected', isSelected);
      strip.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });
  }

  function ciMatchingGetSplitDragCandidateIds(strip) {
    var state = ciMatchingSplitState;
    if (!state || !strip) return [];
    var id = strip.getAttribute('data-ci-split-candidate-id');
    if (!id) return [];
    if (state.selectedSearchIds.indexOf(id) !== -1) {
      return state.selectedSearchIds.filter(function (selectedId) {
        return !ciMatchingSplitTargetExists(state, selectedId);
      });
    }
    return ciMatchingSplitTargetExists(state, id) ? [] : [id];
  }

  function ciMatchingSplitSearchStripHtml(candidate, state) {
    var added = ciMatchingSplitTargetExists(state, candidate.id);
    var selected = !added && state.selectedSearchIds.indexOf(candidate.id) !== -1;
    var stripAttrs =
      'data-ci-split-candidate-id="' + ciEscapeHtml(candidate.id) + '"' +
      (added
        ? ''
        : ' draggable="true" role="option" aria-selected="' + (selected ? 'true' : 'false') + '"');
    return ciMatchingResultStripHtml(candidate, {
      added: added,
      buttonLabel: added ? 'Added' : 'Add target',
      buttonIcon: added ? 'fa-check' : 'fa-arrow-right',
      buttonAttrs:
        'data-ci-split-action="add-target" data-ci-split-candidate-id="' + ciEscapeHtml(candidate.id) + '"',
      stripExtraClass: selected ? ' is-selected' : '',
      stripAttrs: stripAttrs
    });
  }

  function ciMatchingGetSplitTargetMaxAmount(state, targetKey) {
    var target = state.targets.find(function (t) { return t.key === targetKey; });
    if (!target) return 0;
    return ciMatchingGetSplitUnassigned(state) + target.amount;
  }

  function ciMatchingSplitToolbarCanEvenly(state) {
    return state.targets.length >= 2;
  }

  function ciMatchingSplitToolbarCanFill(state) {
    if (ciMatchingGetSplitUnassigned(state) <= 0) return false;

    var zeroCount = ciMatchingSplitZeroTargetCount(state);
    if (!zeroCount) return false;

    if (zeroCount === state.targets.length) {
      return state.targets.length === 1;
    }

    return true;
  }

  function ciMatchingSplitToolbarCanClear(state) {
    return state.targets.some(function (target) { return target.amount > 0; });
  }

  function ciMatchingSplitToolbarState(state) {
    var zeroCount = ciMatchingSplitZeroTargetCount(state);
    var canFill = ciMatchingSplitToolbarCanFill(state);
    var verb = zeroCount === 1 ? 'Fill' : (zeroCount > 1 ? 'Split' : 'Fill');
    var fillLabel = canFill
      ? verb + ' Remaining (' + ciMatchingGetSplitUnassigned(state) + ')'
      : verb + ' Remaining';
    var fillTitle;

    if (zeroCount === 1) {
      fillTitle = 'Add all unassigned certificates to the empty target';
    } else if (zeroCount > 1) {
      fillTitle = 'Split unassigned certificates evenly across empty targets';
    } else {
      fillTitle = 'Add targets with no allocation to use this action';
    }

    return {
      canEvenly: ciMatchingSplitToolbarCanEvenly(state),
      canFill: canFill,
      canClear: ciMatchingSplitToolbarCanClear(state),
      fillLabel: fillLabel,
      fillTitle: fillTitle
    };
  }

  function ciMatchingUpdateSplitToolbarUi(state) {
    var toolbar = document.querySelector(CI_MATCH_SPLIT_SEL + ' .ci-split-target-toolbar');
    if (!toolbar) return;

    var toolbarState = ciMatchingSplitToolbarState(state);
    var evenlyBtn = toolbar.querySelector('[data-ci-split-action="split-evenly"]');
    var fillBtn = toolbar.querySelector('[data-ci-split-action="fill-remaining"]');
    var clearBtn = toolbar.querySelector('[data-ci-split-action="clear-amounts"]');

    if (evenlyBtn) evenlyBtn.disabled = !toolbarState.canEvenly;
    if (fillBtn) {
      fillBtn.disabled = !toolbarState.canFill;
      fillBtn.textContent = toolbarState.fillLabel;
      fillBtn.title = toolbarState.fillTitle;
    }
    if (clearBtn) clearBtn.disabled = !toolbarState.canClear;
  }

  function ciMatchingSyncSplitAmountInputsFromDom() {
    if (!ciMatchingSplitState) return;
    document.querySelectorAll(CI_MATCH_SPLIT_SEL + ' [data-ci-split-target-amount]').forEach(function (input) {
      var key = input.getAttribute('data-ci-split-target-amount');
      if (!key) return;
      var target = ciMatchingSplitState.targets.find(function (t) { return t.key === key; });
      if (!target) return;
      var maxAmount = ciMatchingGetSplitTargetMaxAmount(ciMatchingSplitState, key);
      var amount = ciMatchingParseSplitAmount(input.value, maxAmount);
      if (amount !== null) target.amount = amount;
    });
  }

  function ciMatchingUpdateSplitAllocationUi() {
    var state = ciMatchingSplitState;
    if (!state) return;

    var unassigned = ciMatchingGetSplitUnassigned(state);
    var fullyAllocated = unassigned === 0 && state.targets.length > 0;
    var band = document.querySelector(CI_MATCH_SPLIT_SEL + ' .ci-split-allocation-band');
    if (band) {
      band.outerHTML = ciMatchingRenderSplitAllocationBand(state, unassigned, fullyAllocated);
    }

    var applyBtn = document.querySelector(CI_MATCH_SPLIT_SEL + ' [data-ci-split-action="apply"]');
    if (applyBtn) applyBtn.disabled = !fullyAllocated;

    ciMatchingUpdateSplitToolbarUi(state);

    state.targets.forEach(function (target) {
      var input = document.querySelector(
        CI_MATCH_SPLIT_SEL + ' [data-ci-split-target-amount="' + target.key + '"]'
      );
      if (!input) return;
      input.max = ciMatchingGetSplitTargetMaxAmount(state, target.key);
      if (document.activeElement !== input) {
        input.value = target.amount;
      }
    });
  }

  function ciMatchingSetSplitTargetAmount(targetKey, rawValue, inputEl) {
    if (!ciMatchingSplitState) return;
    var target = ciMatchingSplitState.targets.find(function (t) { return t.key === targetKey; });
    if (!target) return;

    var maxAmount = ciMatchingGetSplitTargetMaxAmount(ciMatchingSplitState, targetKey);
    var amount = ciMatchingParseSplitAmount(rawValue, maxAmount);
    if (amount === null) return;

    target.amount = amount;
    if (inputEl && String(target.amount) !== String(rawValue).trim()) {
      inputEl.value = target.amount;
    }
    ciMatchingUpdateSplitAllocationUi();
  }

  function ciMatchingCommitSplitTargetAmount(targetKey, inputEl) {
    if (!ciMatchingSplitState || !inputEl) return;
    ciMatchingSetSplitTargetAmount(targetKey, inputEl.value, inputEl);
    var target = ciMatchingSplitState.targets.find(function (t) { return t.key === targetKey; });
    if (target) inputEl.value = target.amount;
  }

  function ciMatchingSplitEvenly(state) {
    var count = state.targets.length;
    if (count < 2) return;
    var base = Math.floor(state.total / count);
    var remainder = state.total % count;
    state.targets.forEach(function (target, index) {
      target.amount = base + (index === count - 1 ? remainder : 0);
    });
  }

  function ciMatchingSplitFillRemaining(state) {
    var unassigned = ciMatchingGetSplitUnassigned(state);
    if (unassigned <= 0) return;

    var zeroTargets = state.targets.filter(function (target) { return target.amount === 0; });
    if (!zeroTargets.length) return;

    var count = zeroTargets.length;
    var base = Math.floor(unassigned / count);
    var remainder = unassigned % count;

    zeroTargets.forEach(function (target, index) {
      target.amount = base + (index === count - 1 ? remainder : 0);
    });
  }

  function ciMatchingSplitClearAmounts(state) {
    state.targets.forEach(function (target) {
      target.amount = 0;
    });
  }

  function ciMatchingApplySplitBulkAction(action) {
    if (!ciMatchingSplitState) return;
    ciMatchingSyncSplitAmountInputsFromDom();
    if (action === 'split-evenly') {
      if (!ciMatchingSplitToolbarCanEvenly(ciMatchingSplitState)) return;
      ciMatchingSplitEvenly(ciMatchingSplitState);
    } else if (action === 'fill-remaining') {
      if (!ciMatchingSplitToolbarCanFill(ciMatchingSplitState)) return;
      ciMatchingSplitFillRemaining(ciMatchingSplitState);
    } else if (action === 'clear-amounts') {
      if (!ciMatchingSplitToolbarCanClear(ciMatchingSplitState)) return;
      ciMatchingSplitClearAmounts(ciMatchingSplitState);
    } else {
      return;
    }
    ciMatchingRenderMatchCardBody();
  }

  function ciMatchingRenderSplitTargetToolbar(state) {
    if (!state.targets.length) return '';

    var toolbarState = ciMatchingSplitToolbarState(state);

    return (
      '<div class="ci-split-target-toolbar">' +
        '<button type="button" class="action-btn action-btn-sm ci-split-target-toolbar-btn"' +
          ' data-ci-split-action="split-evenly"' + (toolbarState.canEvenly ? '' : ' disabled') + '>Split Evenly</button>' +
        '<button type="button" class="action-btn action-btn-sm ci-split-target-toolbar-btn"' +
          ' data-ci-split-action="fill-remaining"' + (toolbarState.canFill ? '' : ' disabled') +
          ' title="' + ciEscapeHtml(toolbarState.fillTitle) + '">' + toolbarState.fillLabel + '</button>' +
        '<button type="button" class="action-btn action-btn-sm ci-split-target-toolbar-btn"' +
          ' data-ci-split-action="clear-amounts"' + (toolbarState.canClear ? '' : ' disabled') + '>Clear Amounts</button>' +
      '</div>'
    );
  }

  function ciMatchingRenderSplitTargetRow(target, state) {
    var maxAmount = ciMatchingGetSplitTargetMaxAmount(state, target.key);
    return (
      '<div class="ci-matching-result-strip ci-split-target">' +
        '<div class="ci-matching-result-strip-icon">' + ciTechHtml(target.tech) + '</div>' +
        '<div class="ci-matching-result-strip-main">' +
          ciMatchingStripMainHtml(target) +
        '</div>' +
        '<input type="number" class="ci-split-target-amount filter-input" min="0" max="' + maxAmount + '" value="' + target.amount + '"' +
          ' data-ci-split-target-amount="' + ciEscapeHtml(target.key) + '"' +
          ' aria-label="Certificates for #' + ciEscapeHtml(target.trade) + '">' +
        '<button type="button" class="ci-split-target-remove" data-ci-split-action="remove-target" data-ci-split-target-key="' + ciEscapeHtml(target.key) + '" aria-label="Remove target">' +
          '<i class="fas fa-times" aria-hidden="true"></i>' +
        '</button>' +
      '</div>'
    );
  }

  function ciMatchingSplitEmptyPanelHtml(title, detail) {
    return (
      '<div class="ci-split-panel-empty">' +
        '<div class="ci-split-panel-empty-title">' + title + '</div>' +
        '<div class="ci-split-panel-empty-detail">' + detail + '</div>' +
      '</div>'
    );
  }

  function ciMatchingRenderSplitSearchPanel(state) {
    var query = String(state.search || '').trim();
    ciMatchingPruneSplitSearchSelection(state);
    var results = ciMatchingSplitSearchResults(state);
    var hasResults = results.length > 0;

    var stripsHtml = hasResults
      ? results.map(function (candidate) {
          return ciMatchingSplitSearchStripHtml(candidate, state);
        }).join('')
      : '';

    var emptyHtml = !query
      ? ciMatchingSplitEmptyPanelHtml(
          'Search for a trade',
          'Type a trade ID or counterparty, then click → or drag the result to Targets.'
        )
      : ciMatchingSplitEmptyPanelHtml(
          'No matching trades',
          'Try another ID, counterparty, or delivery month.'
        );

    var panelHtml = hasResults
      ? (
        '<div class="ci-split-search-panel ci-split-search-panel--has-results">' +
          '<div class="ci-split-search-strips">' + stripsHtml + '</div>' +
        '</div>'
      )
      : (
        '<div class="ci-split-search-panel">' +
          emptyHtml +
        '</div>'
      );

    return (
      '<div class="ci-split-search-section">' +
        '<div class="search-input-wrapper ci-split-search">' +
          '<i class="fas fa-magnifying-glass" aria-hidden="true"></i>' +
          '<input type="text" class="filter-input search-input" id="ci-split-search" value="' + ciEscapeHtml(state.search) + '" placeholder="Search trades — ID, counterparty, delivery month…" aria-label="Search trades">' +
        '</div>' +
        panelHtml +
      '</div>'
    );
  }

  function ciMatchingRenderSplitAllocationBand(state, unassigned, fullyAllocated) {
    var allocated = state.total - unassigned;
    var pct = state.total > 0 ? Math.round((allocated / state.total) * 100) : 0;
    var statusHtml;

    if (fullyAllocated) {
      statusHtml =
        '<div class="ci-split-allocation-status">' +
          '<i class="fas fa-check" aria-hidden="true"></i> Ready to apply' +
        '</div>';
    } else {
      statusHtml =
        '<div class="ci-split-allocation-status is-pending">' +
          allocated + ' allocated' +
        '</div>';
    }

    return (
      '<div class="ci-split-allocation-band">' +
        '<div class="ci-split-allocation-band-main">' +
          '<span class="ci-split-allocation-fraction">' +
            '<span class="ci-split-unassigned-value' + (fullyAllocated ? ' is-zero' : '') + '">' + unassigned + '</span>' +
            '<span class="ci-split-allocation-fraction-denom">/ ' + state.total + '</span>' +
            '<span class="ci-split-allocation-meta">unassigned</span>' +
          '</span>' +
        '</div>' +
        '<div class="ci-split-allocation-progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + state.total + '"' +
          ' aria-valuenow="' + allocated + '" aria-label="Allocation progress">' +
          '<div class="ci-split-allocation-progress-track">' +
            '<div class="ci-split-allocation-progress-fill' + (fullyAllocated ? ' is-complete' : '') + '" style="width:' + pct + '%"></div>' +
          '</div>' +
        '</div>' +
        statusHtml +
      '</div>'
    );
  }

  function ciMatchingRenderMatchCardBody() {
    var bodyEl = document.getElementById('ci-matching-split-body');
    var state = ciMatchingSplitState;
    if (!bodyEl || !state) return;

    var unassigned = ciMatchingGetSplitUnassigned(state);
    var fullyAllocated = unassigned === 0 && state.targets.length > 0;
    var targetsHtml = state.targets.length
      ? state.targets.map(function (target) {
          return ciMatchingRenderSplitTargetRow(target, state);
        }).join('')
      : (
        '<div class="ci-split-targets-empty">' +
          ciMatchingSplitEmptyPanelHtml(
            'Add allocation targets',
            'Drag trades from Search or click → on a result, then assign certificate amounts.'
          ) +
        '</div>'
      );
    var toolbarHtml = ciMatchingRenderSplitTargetToolbar(state);
    var dropHint = state.targets.length
      ? ''
      : '<div class="ci-split-target-drop-hint">Drop selected trades here</div>';

    bodyEl.innerHTML =
      ciMatchingRenderSplitAllocationBand(state, unassigned, fullyAllocated) +
      '<div class="ci-split-modal-cols">' +
        '<div class="ci-split-modal-col">' +
          '<div class="ci-split-modal-col-content ci-split-modal-col-content--search">' +
            ciMatchingRenderSplitSearchPanel(state) +
          '</div>' +
        '</div>' +
        '<div class="ci-split-modal-col">' +
          '<div class="ci-split-modal-col-content ci-split-modal-col-content--targets ci-split-target-drop-zone" data-ci-split-drop-zone>' +
            toolbarHtml +
            dropHint +
            '<div class="ci-split-target-list">' + targetsHtml + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    var applyBtn = document.querySelector(CI_MATCH_SPLIT_SEL + ' [data-ci-split-action="apply"]');
    if (applyBtn) applyBtn.disabled = !fullyAllocated;

    var focusTargetKey = state.focusTargetKey;
    if (focusTargetKey) {
      state.focusTargetKey = null;
      var amountInput = document.querySelector(
        CI_MATCH_SPLIT_SEL + ' [data-ci-split-target-amount="' + focusTargetKey + '"]'
      );
      if (amountInput) {
        amountInput.focus();
        amountInput.select();
      }
    }
  }

  function ciMatchingInitMatchCard(item) {
    if (!item) {
      ciMatchingSplitState = null;
      return;
    }
    ciMatchingSplitState = ciMatchingBuildSplitState(item);
    ciMatchingRenderMatchCardBody();
  }

  function ciMatchingClearMatchForm() {
    var item = ciMatchingGetSelectedItem();
    if (!item) return;
    ciMatchingSplitState = ciMatchingBuildSplitState(item);
    ciMatchingRenderMatchCardBody();
  }

  function ciMatchingRemoveSplitTarget(targetKey) {
    if (!ciMatchingSplitState) return;
    ciMatchingSplitState.targets = ciMatchingSplitState.targets.filter(function (t) { return t.key !== targetKey; });
    ciMatchingRenderMatchCardBody();
  }

  function ciMatchingApplySplit() {
    if (!ciMatchingSplitState) return;
    var unassigned = ciMatchingGetSplitUnassigned(ciMatchingSplitState);
    if (unassigned !== 0 || !ciMatchingSplitState.targets.length) return;
    var targetCount = ciMatchingSplitState.targets.length;
    ciMatchingSplitState = null;
    ciMatchingRemoveCurrentBatch();
    ciShowToast(
      'Split applied across ' + targetCount + ' target' + (targetCount === 1 ? '' : 's')
    );
  }

  function initCiMatchingMatchCardEvents() {
    var detailEl = document.getElementById('ci-matching-detail');
    if (!detailEl || detailEl.dataset.ciMatchCardBound === '1') return;
    detailEl.dataset.ciMatchCardBound = '1';

    detailEl.addEventListener('click', function (event) {
      if (ciMatchingSplitState) {
        var strip = event.target.closest('.ci-split-search-strips .ci-matching-result-strip[data-ci-split-candidate-id]');
        if (strip && !strip.classList.contains('is-added') && !event.target.closest('[data-ci-split-action]')) {
          if (!ciMatchingSplitSuppressStripClick) {
            ciMatchingToggleSplitSearchSelection(strip.getAttribute('data-ci-split-candidate-id'));
          }
          return;
        }
      }

      var actionEl = event.target.closest('[data-ci-split-action]');
      if (!actionEl) return;

      var action = actionEl.getAttribute('data-ci-split-action');
      if (action === 'clear-form') {
        ciMatchingClearMatchForm();
        return;
      }
      if (!ciMatchingSplitState) return;

      if (action === 'add-target') {
        var candidateId = actionEl.getAttribute('data-ci-split-candidate-id');
        if (ciMatchingAddSplitTargetsFromCandidateIds(ciMatchingSplitState, [candidateId])) {
          var selIdx = ciMatchingSplitState.selectedSearchIds.indexOf(candidateId);
          if (selIdx !== -1) ciMatchingSplitState.selectedSearchIds.splice(selIdx, 1);
        }
        ciMatchingRenderMatchCardBody();
      } else if (action === 'remove-target') {
        ciMatchingRemoveSplitTarget(actionEl.getAttribute('data-ci-split-target-key'));
      } else if (action === 'split-evenly' || action === 'fill-remaining' || action === 'clear-amounts') {
        ciMatchingApplySplitBulkAction(action);
      } else if (action === 'apply') {
        ciMatchingApplySplit();
      }
    });

    detailEl.addEventListener('input', function (event) {
      if (!ciMatchingSplitState) return;

      var amountKey = event.target.getAttribute('data-ci-split-target-amount');
      if (amountKey) {
        ciMatchingSetSplitTargetAmount(amountKey, event.target.value, event.target);
        return;
      }

      if (event.target.id !== 'ci-split-search') return;
      ciMatchingSplitState.search = event.target.value;
      ciMatchingRenderMatchCardBody();
      var searchEl = document.getElementById('ci-split-search');
      if (searchEl) {
        var pos = searchEl.value.length;
        searchEl.focus();
        searchEl.setSelectionRange(pos, pos);
      }
    });

    detailEl.addEventListener('change', function (event) {
      if (!ciMatchingSplitState) return;
      var amountKey = event.target.getAttribute('data-ci-split-target-amount');
      if (amountKey) ciMatchingCommitSplitTargetAmount(amountKey, event.target);
    });

    detailEl.addEventListener('dragstart', function (event) {
      if (!ciMatchingSplitState) return;
      var strip = event.target.closest('.ci-split-search-strips .ci-matching-result-strip[draggable]');
      if (!strip) return;

      var candidateIds = ciMatchingGetSplitDragCandidateIds(strip);
      if (!candidateIds.length) {
        event.preventDefault();
        return;
      }

      ciMatchingSplitSuppressStripClick = true;
      strip.classList.add('is-dragging');
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setData('text/plain', candidateIds.join(','));
    });

    detailEl.addEventListener('dragend', function (event) {
      var strip = event.target.closest('.ci-split-search-strips .ci-matching-result-strip');
      if (strip) strip.classList.remove('is-dragging');
      document.querySelectorAll(CI_MATCH_SPLIT_SEL + ' .ci-split-target-drop-zone.is-drag-over').forEach(function (zone) {
        zone.classList.remove('is-drag-over');
      });
      window.setTimeout(function () {
        ciMatchingSplitSuppressStripClick = false;
      }, 0);
    });

    detailEl.addEventListener('dragover', function (event) {
      if (!ciMatchingSplitState) return;
      var dropZone = event.target.closest('[data-ci-split-drop-zone]');
      if (!dropZone) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
      dropZone.classList.add('is-drag-over');
    });

    detailEl.addEventListener('dragleave', function (event) {
      var dropZone = event.target.closest('[data-ci-split-drop-zone]');
      if (!dropZone) return;
      var related = event.relatedTarget;
      if (related && dropZone.contains(related)) return;
      dropZone.classList.remove('is-drag-over');
    });

    detailEl.addEventListener('drop', function (event) {
      if (!ciMatchingSplitState) return;
      var dropZone = event.target.closest('[data-ci-split-drop-zone]');
      if (!dropZone) return;
      event.preventDefault();
      dropZone.classList.remove('is-drag-over');

      var raw = event.dataTransfer.getData('text/plain');
      if (!raw) return;
      var candidateIds = raw.split(',').filter(Boolean);
      if (!candidateIds.length) return;

      if (ciMatchingAddSplitTargetsFromCandidateIds(ciMatchingSplitState, candidateIds)) {
        ciMatchingSplitState.selectedSearchIds = [];
        ciMatchingRenderMatchCardBody();
      }
    });
  }

  window.ciMatchingInitMatchCard = ciMatchingInitMatchCard;

  document.addEventListener('DOMContentLoaded', initCiMatchingMatchCardEvents);
})();
