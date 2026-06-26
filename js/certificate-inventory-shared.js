/**
 * Shared Certificate Inventory UI helpers (Portfolio, Matching, Registry Activity).
 */
(function () {
  'use strict';

  var CI_STATUS_TONE = {
    Available: 'b-green',
    Forecast: 'b-amber',
    Allocated: 'b-blue',
    Exception: 'b-red',
    Retired: 'b-gray'
  };

  function ciEscapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /** Trades-style grid footer: "1 to 10 of 10" (single-page mock defaults). */
  function ciGridPaginationCountText(total, pageIndex, pageSize) {
    pageIndex = pageIndex || 0;
    pageSize = pageSize || total || 0;
    if (!total) return '0 to 0 of 0';
    var from = pageIndex * pageSize + 1;
    var to = Math.min(total, (pageIndex + 1) * pageSize);
    return from + ' to ' + to + ' of ' + total;
  }

  function ciStatusPillFromMap(status, toneMap, labelMap) {
    var label = labelMap ? (labelMap[status] || status) : status;
    return ciInvStatusPillHtml(toneMap[status] || 'b-gray', label);
  }

  function ciSetPaginationCount(elementId, total, pageIndex, pageSize) {
    var el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = ciGridPaginationCountText(total, pageIndex, pageSize);
  }

  function ciResetSelectFilters(containerSelector) {
    document.querySelectorAll(containerSelector + ' select.filter-input').forEach(function (el) {
      el.selectedIndex = 0;
    });
  }

  /** Shared as-of picker wiring for CI pages (`ci-portfolio`, `ci-registry`, …). */
  function ciInitPageAsOfPicker(prefix) {
    if (typeof initAsOfPicker !== 'function') return;
    initAsOfPicker({
      triggerId: prefix + '-as-of-trigger',
      popoverId: prefix + '-as-of-popover',
      gridId: prefix + '-as-of-grid',
      monthLabelId: prefix + '-as-of-month-label',
      prevId: prefix + '-as-of-prev',
      nextId: prefix + '-as-of-next',
      monthPrevId: prefix + '-as-of-month-prev',
      monthNextId: prefix + '-as-of-month-next'
    });
  }

  function ciInvStatusPillHtml(tone, label) {
    return (
      '<span class="inv-status-select-wrap inv-status-select-wrap--read-only ' + tone + '">' +
        '<span class="b-dot" aria-hidden="true"></span>' +
        '<span class="inv-status-label">' + ciEscapeHtml(label) + '</span>' +
      '</span>'
    );
  }

  function ciRowMenuCellHtml(items) {
    var menuHtml = (items || []).map(function (item) {
      var label = typeof item === 'string' ? item : item.label;
      var attrs = typeof item === 'object' && item.attrs ? ' ' + item.attrs : '';
      return '<button type="button" role="menuitem" class="te-row-menu-item"' + attrs + '>' + ciEscapeHtml(label) + '</button>';
    }).join('');

    return (
      '<td class="trades-col-menu">' +
        '<div class="te-row-menu-wrap">' +
          '<button type="button" class="trades-row-menu-btn" aria-label="Row actions" aria-expanded="false" aria-haspopup="true">' +
            '<i class="fas fa-ellipsis-vertical" aria-hidden="true"></i>' +
          '</button>' +
          '<div class="te-row-menu-dropdown" role="menu">' + menuHtml + '</div>' +
        '</div>' +
      '</td>'
    );
  }

  function ciCloseGridRowMenus(gridSelector) {
    document.querySelectorAll(gridSelector + ' .te-row-menu-wrap.is-open').forEach(function (wrap) {
      wrap.classList.remove('is-open');
      var btn = wrap.querySelector('.trades-row-menu-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function ciToggleGridRowMenu(event, btn, gridSelector) {
    event.stopPropagation();
    var wrap = btn.closest('.te-row-menu-wrap');
    if (!wrap) return;
    var isOpen = wrap.classList.contains('is-open');
    ciCloseGridRowMenus(gridSelector);
    if (!isOpen) {
      wrap.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
    }
  }

  function ciBindGridRowMenuDismiss(gridSelector) {
    document.addEventListener('click', function (event) {
      if (!event.target.closest(gridSelector + ' .te-row-menu-wrap')) {
        ciCloseGridRowMenus(gridSelector);
      }
    });
  }

  function ciLinkedTradeLinkHtml(tradeId, options) {
    options = options || {};
    if (tradeId == null || tradeId === '') {
      if (options.unlinked) return '<span class="ci-cell-empty">unlinked</span>';
      return '<span class="ci-cell-empty">—</span>';
    }
    return '<a href="#" class="ci-grid-link">' + ciLinkedIdLabelHtml(tradeId) + '</a>';
  }

  function ciTechHtml(technology) {
    var slug = String(technology || '').toLowerCase();
    var iconHtml;

    if (slug === 'solar') {
      iconHtml = '<i class="fas fa-sun ci-tech-icon ci-tech-icon--solar" aria-hidden="true"></i>';
    } else if (slug === 'wind') {
      iconHtml = '<i class="fas fa-wind ci-tech-icon ci-tech-icon--wind" aria-hidden="true"></i>';
    } else if (slug === 'hydro') {
      iconHtml = '<i class="fas fa-water ci-tech-icon ci-tech-icon--hydro" aria-hidden="true"></i>';
    } else if (slug === 'biomass') {
      iconHtml = '<i class="fas fa-seedling ci-tech-icon ci-tech-icon--biomass" aria-hidden="true"></i>';
    } else {
      iconHtml = '<span class="ci-tech-dot ci-tech-dot--' + slug + '" aria-hidden="true"></span>';
    }

    return '<span class="ci-tech" aria-hidden="true">' + iconHtml + '</span>';
  }

  function ciMatchingStripMainHtml(item) {
    var qtyLabel = item.openQty ? 'open ' + item.openQty : '';
    var nameTitle = item.name ? ' title="' + ciEscapeHtml(item.name) + '"' : '';
    var deliveryTitle = item.delivery ? ' title="' + ciEscapeHtml(item.delivery) + '"' : '';
    var qtyTitle = qtyLabel ? ' title="' + ciEscapeHtml(qtyLabel) + '"' : '';
    return (
      '<span class="ci-matching-result-strip-id">#' + ciEscapeHtml(item.trade) + '</span>' +
      '<span class="ci-matching-result-strip-name"' + nameTitle + '>' + ciEscapeHtml(item.name) + '</span>' +
      (item.delivery
        ? '<span class="ci-matching-result-strip-sep" aria-hidden="true">|</span><span class="ci-matching-result-strip-delivery"' + deliveryTitle + '>' + ciEscapeHtml(item.delivery) + '</span>'
        : '') +
      (qtyLabel
        ? '<span class="ci-matching-result-strip-qty"' + qtyTitle + '>' + ciEscapeHtml(qtyLabel) + '</span>'
        : '')
    );
  }

  function ciMatchingFilterCatalog(catalog, query) {
    var normalized = String(query || '').trim().toLowerCase();
    if (!normalized) return [];
    return catalog.filter(function (candidate) {
      return candidate.searchText.indexOf(normalized) !== -1;
    });
  }

  function ciMatchingParseSplitAmount(rawValue, maxAmount) {
    var trimmed = String(rawValue).trim();
    if (trimmed === '') return 0;
    var parsed = parseInt(trimmed, 10);
    if (isNaN(parsed)) return null;
    return Math.max(0, Math.min(maxAmount, parsed));
  }

  function ciEnsureToastStack() {
    var stack = document.getElementById('ci-toast-stack');
    if (stack) return stack;
    stack = document.createElement('div');
    stack.id = 'ci-toast-stack';
    stack.className = 'ci-toast-stack';
    stack.setAttribute('aria-live', 'polite');
    stack.setAttribute('aria-relevant', 'additions');
    document.body.appendChild(stack);
    return stack;
  }

  function ciShowToast(message, options) {
    options = options || {};
    var stack = ciEnsureToastStack();
    var toast = document.createElement('div');
    toast.className = 'ci-toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML =
      '<i class="fas fa-check ci-toast-icon" aria-hidden="true"></i>' +
      '<span class="ci-toast-message">' + ciEscapeHtml(message) + '</span>';
    stack.appendChild(toast);
    window.requestAnimationFrame(function () {
      toast.classList.add('is-visible');
    });
    var duration = options.duration != null ? options.duration : 3200;
    window.setTimeout(function () {
      toast.classList.remove('is-visible');
      toast.classList.add('is-leaving');
      window.setTimeout(function () {
        toast.remove();
        if (!stack.childElementCount) stack.remove();
      }, 220);
    }, duration);
  }

  function ciMatchingBatchAttrHtml(label, value, valueClass) {
    return (
      '<div class="ci-matching-batch-attr">' +
        '<div class="ci-matching-batch-attr-label">' + label + '</div>' +
        '<div class="ci-matching-batch-attr-value' + (valueClass ? ' ' + valueClass : '') + '">' + value + '</div>' +
      '</div>'
    );
  }

  function ciMatchingResultStripHtml(candidate, options) {
    options = options || {};
    var added = !!options.added;
    var buttonLabel = options.buttonLabel || (added ? 'Added' : 'Match');
    var buttonAttrs = options.buttonAttrs || ('data-ci-matching-strip-match="' + ciEscapeHtml(candidate.id) + '"');
    var buttonClass = options.buttonClass || 'action-btn action-btn-primary ci-matching-result-strip-match';
    if (added) buttonClass = 'action-btn ci-matching-result-strip-match';
    if (options.buttonIcon) buttonClass += ' ci-matching-result-strip-match--icon';

    var buttonContent = options.buttonIcon
      ? '<i class="fas ' + options.buttonIcon + '" aria-hidden="true"></i>'
      : ciEscapeHtml(buttonLabel);
    var ariaLabel = options.buttonAriaLabel || buttonLabel;

    var stripExtraClass = options.stripExtraClass || '';
    var stripAttrs = options.stripAttrs || '';

    return (
      '<div class="ci-matching-result-strip' + (added ? ' is-added' : '') + stripExtraClass + '"' +
        (stripAttrs ? ' ' + stripAttrs : '') + '>' +
        '<div class="ci-matching-result-strip-icon">' + ciTechHtml(candidate.tech) + '</div>' +
        '<div class="ci-matching-result-strip-main">' +
          ciMatchingStripMainHtml(candidate) +
        '</div>' +
        '<button type="button" class="' + buttonClass + '" ' + buttonAttrs +
          ' aria-label="' + ciEscapeHtml(ariaLabel) + '"' + (added ? ' disabled' : '') + '>' +
          buttonContent +
        '</button>' +
      '</div>'
    );
  }

  function ciMatchingSyncMatchPanelState(panelElOrId, hasResults) {
    var panelEl = typeof panelElOrId === 'string'
      ? document.getElementById(panelElOrId)
      : panelElOrId;
    if (panelEl) {
      panelEl.classList.toggle('ci-matching-match-panel--has-results', !!hasResults);
    }
  }

  function ciRenderMatchSearchStrips(options) {
    options = options || {};
    var stripsEl = options.stripsEl || (options.stripsId ? document.getElementById(options.stripsId) : null);
    var emptyEl = options.emptyEl || (options.emptyId ? document.getElementById(options.emptyId) : null);
    var panelEl = options.panelEl || (options.panelId ? document.getElementById(options.panelId) : null);
    if (!stripsEl) return { hasResults: false };

    var query = options.query;
    if (query == null) {
      var searchEl = options.searchEl || (options.searchId ? document.getElementById(options.searchId) : null);
      query = searchEl ? searchEl.value.trim().toLowerCase() : '';
    }

    var idleText = options.emptyIdleText || 'Search trades to find a match';
    var noResultsText = options.emptyNoResultsText || 'No matching trades';

    if (!query) {
      stripsEl.innerHTML = '';
      stripsEl.hidden = true;
      if (emptyEl) {
        emptyEl.hidden = false;
        emptyEl.textContent = idleText;
      }
      ciMatchingSyncMatchPanelState(panelEl, false);
      return { hasResults: false, query: '', candidates: [] };
    }

    var candidates = ciMatchingFilterCatalog(options.catalog || [], query);

    if (!candidates.length) {
      stripsEl.innerHTML = '';
      stripsEl.hidden = true;
      if (emptyEl) {
        emptyEl.hidden = false;
        emptyEl.textContent = noResultsText;
      }
      ciMatchingSyncMatchPanelState(panelEl, false);
      return { hasResults: false, query: query, candidates: [] };
    }

    stripsEl.hidden = false;
    if (emptyEl) emptyEl.hidden = true;
    var mapStrip = options.mapStrip || ciMatchingResultStripHtml;
    stripsEl.innerHTML = candidates.map(mapStrip).join('');
    ciMatchingSyncMatchPanelState(panelEl, true);
    return { hasResults: true, query: query, candidates: candidates };
  }

  function ciCertStatusBadgeHtml(status) {
    var tone = CI_STATUS_TONE[status] || 'b-gray';
    return '<span class="badge ' + tone + '">' + ciEscapeHtml(status) + '</span>';
  }

  function ciCertVolumeLabel(volume) {
    return volume != null ? Number(volume).toFixed(2) + ' MWh' : '—';
  }

  function ciCertAttrGridHtml(cert, options) {
    options = options || {};
    var html =
      ciMatchingBatchAttrHtml('Registry', ciEscapeHtml(cert.registry || '—')) +
      ciMatchingBatchAttrHtml('Vintage', cert.vintage != null ? String(cert.vintage) : '—') +
      ciMatchingBatchAttrHtml('Technology', ciEscapeHtml(cert.technology || '—')) +
      ciMatchingBatchAttrHtml('Geography', ciEscapeHtml(cert.state || '—')) +
      ciMatchingBatchAttrHtml('Volume', ciCertVolumeLabel(cert.volume)) +
      ciMatchingBatchAttrHtml('Status', ciCertStatusBadgeHtml(cert.status));

    if (options.includeLinked && cert.linkedTrade) {
      html +=
        ciMatchingBatchAttrHtml('Linked Trade', ciLinkedIdLabelHtml(cert.linkedTrade)) +
        ciMatchingBatchAttrHtml('Linked Subleg', ciLinkedIdLabelHtml(cert.linkedSubleg));
    }

    return html;
  }

  function ciLinkedIdLabelHtml(id) {
    if (id == null || id === '') return '—';
    return '#' + ciEscapeHtml(String(id));
  }

  function ciCandidateMatchesLink(candidate, linkedTrade, linkedSubleg) {
    return linkedSubleg != null &&
      String(candidate.subleg) === String(linkedSubleg) &&
      (!linkedTrade || String(candidate.trade) === String(linkedTrade));
  }

  function ciRangeLabelHtml(text) {
    var value = String(text || '');
    var classes = 'ci-range-label';
    var html = value;

    if (value.indexOf('(') === 0) classes += ' ci-range-label--pending';

    if (value.indexOf('…') !== -1) {
      var ellipsisParts = value.split('…');
      classes += ' ci-range-label--multi';
      html = ellipsisParts[0] + '<span class="ci-range-label-arrow" aria-hidden="true">→</span>' + ellipsisParts[1];
    } else if (value.indexOf('→') !== -1) {
      var arrowParts = value.split('→');
      classes += ' ci-range-label--multi';
      html = arrowParts[0] + '<span class="ci-range-label-arrow" aria-hidden="true">→</span>' + arrowParts[1];
    }

    return '<span class="' + classes + '">' + html + '</span>';
  }

  window.ciEscapeHtml = ciEscapeHtml;
  window.ciGridPaginationCountText = ciGridPaginationCountText;
  window.ciSetPaginationCount = ciSetPaginationCount;
  window.ciResetSelectFilters = ciResetSelectFilters;
  window.ciInitPageAsOfPicker = ciInitPageAsOfPicker;
  window.ciInvStatusPillHtml = ciInvStatusPillHtml;
  window.ciStatusPillFromMap = ciStatusPillFromMap;
  window.ciRowMenuCellHtml = ciRowMenuCellHtml;
  window.ciCloseGridRowMenus = ciCloseGridRowMenus;
  window.ciToggleGridRowMenu = ciToggleGridRowMenu;
  window.ciBindGridRowMenuDismiss = ciBindGridRowMenuDismiss;
  window.ciLinkedTradeLinkHtml = ciLinkedTradeLinkHtml;
  window.ciTechHtml = ciTechHtml;
  window.ciMatchingBatchAttrHtml = ciMatchingBatchAttrHtml;
  window.ciMatchingResultStripHtml = ciMatchingResultStripHtml;
  window.ciMatchingStripMainHtml = ciMatchingStripMainHtml;
  window.ciMatchingFilterCatalog = ciMatchingFilterCatalog;
  window.ciMatchingParseSplitAmount = ciMatchingParseSplitAmount;
  window.ciRenderMatchSearchStrips = ciRenderMatchSearchStrips;
  window.ciCertAttrGridHtml = ciCertAttrGridHtml;
  window.ciCandidateMatchesLink = ciCandidateMatchesLink;
  window.CI_STATUS_TONE = CI_STATUS_TONE;
  window.ciShowToast = ciShowToast;
  window.ciRangeLabelHtml = ciRangeLabelHtml;
})();
