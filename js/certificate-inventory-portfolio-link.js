/**
 * Certificate Inventory — Portfolio Link to Trade modal.
 */
(function () {
  'use strict';

  var CI_LINK_TRADE_OVERLAY_SEL = '#ci-link-trade-modal';
  var ciLinkTradeCertIndex = null;

  function ciLinkTradeRenderContext(cert) {
    var contextEl = document.getElementById('ci-link-trade-context');
    if (!contextEl || !cert) return;

    contextEl.innerHTML =
      '<div class="ci-link-trade-certificate-header">' +
        '<div class="ci-link-trade-certificate-header-icon">' + window.ciTechHtml(cert.technology) + '</div>' +
        '<div class="ci-link-trade-certificate-header-text">' +
          '<div class="ci-link-trade-certificate-eyebrow">Certificate</div>' +
          '<h2 class="ci-link-trade-certificate-title">' + window.ciEscapeHtml(cert.serial) + '</h2>' +
        '</div>' +
      '</div>' +
      '<div class="ci-matching-batch-attrs">' +
        window.ciCertAttrGridHtml(cert, { includeLinked: true }) +
      '</div>';
  }

  function ciLinkTradeRenderStrips() {
    var cert = ciLinkTradeCertIndex != null && window.CI_CERTIFICATES
      ? window.CI_CERTIFICATES[ciLinkTradeCertIndex]
      : null;

    window.ciRenderMatchSearchStrips({
      stripsId: 'ci-link-trade-match-strips',
      emptyId: 'ci-link-trade-match-empty',
      searchId: 'ci-link-trade-match-search',
      panelId: 'ci-link-trade-match-panel',
      catalog: window.ciGetPortfolioLinkTradeCatalog(),
      emptyIdleText: 'Search for a trade to link',
      emptyNoResultsText: 'No trades found',
      mapStrip: function (candidate) {
        var isLinked = cert && window.ciCandidateMatchesLink(candidate, cert.linkedTrade, cert.linkedSubleg);
        return window.ciMatchingResultStripHtml(candidate, {
          buttonLabel: isLinked ? 'Linked' : 'Link',
          buttonAriaLabel: isLinked
            ? ('Already linked to subleg #' + candidate.subleg)
            : ('Link to trade #' + candidate.trade + ', subleg #' + candidate.subleg),
          added: isLinked,
          buttonAttrs: 'data-ci-link-trade-match="' + window.ciEscapeHtml(candidate.id) + '"'
        });
      }
    });
  }

  function ciLinkTradeResetSearch() {
    var searchEl = document.getElementById('ci-link-trade-match-search');
    if (searchEl) searchEl.value = '';
    ciLinkTradeRenderStrips();
  }

  function ciLinkTradeClose() {
    var overlay = document.querySelector(CI_LINK_TRADE_OVERLAY_SEL);
    if (!overlay) return;
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    ciLinkTradeCertIndex = null;
    ciLinkTradeResetSearch();
  }

  function ciLinkTradeOpen(certIndex) {
    var overlay = document.querySelector(CI_LINK_TRADE_OVERLAY_SEL);
    var cert = window.CI_CERTIFICATES && window.CI_CERTIFICATES[certIndex];
    if (!overlay || !cert) return;

    ciLinkTradeCertIndex = certIndex;
    ciLinkTradeRenderContext(cert);
    ciLinkTradeResetSearch();

    var tooltipEl = document.getElementById('ci-link-trade-search-tooltip');
    if (tooltipEl && typeof window.ciMatchingDemoSearchTooltipAttr === 'function') {
      tooltipEl.setAttribute('data-tooltip', window.ciMatchingDemoSearchTooltipAttr(window.ciGetPortfolioLinkTradeCatalog()));
    }

    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');

    var searchEl = document.getElementById('ci-link-trade-match-search');
    if (searchEl) searchEl.focus();
  }

  function ciLinkTradeApply(candidateId) {
    var catalog = window.ciGetPortfolioLinkTradeCatalog();
    var candidate = catalog.find(function (item) { return item.id === candidateId; });
    if (!candidate || ciLinkTradeCertIndex == null || !window.CI_CERTIFICATES) return;

    var cert = window.CI_CERTIFICATES[ciLinkTradeCertIndex];
    if (!cert) return;

    cert.linkedTrade = candidate.trade;
    cert.linkedSubleg = candidate.subleg;

    if (typeof window.renderCiPortfolioGrid === 'function') {
      window.renderCiPortfolioGrid();
    }

    window.ciShowToast('Linked to #' + candidate.trade + ' · subleg #' + candidate.subleg);
    ciLinkTradeClose();
  }

  function initCiLinkTradeModal() {
    var overlay = document.querySelector(CI_LINK_TRADE_OVERLAY_SEL);
    if (!overlay || overlay.dataset.ciLinkTradeBound === '1') return;
    overlay.dataset.ciLinkTradeBound = '1';

    var dialog = overlay.querySelector('.ci-link-trade-modal');

    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) ciLinkTradeClose();
    });

    if (dialog) {
      dialog.addEventListener('input', function (event) {
        if (event.target.id === 'ci-link-trade-match-search') {
          ciLinkTradeRenderStrips();
        }
      });

      dialog.addEventListener('click', function (event) {
        if (event.target.closest('[data-ci-link-trade-close]')) {
          event.preventDefault();
          ciLinkTradeClose();
          return;
        }

        var linkBtn = event.target.closest('[data-ci-link-trade-match]');
        if (linkBtn && !linkBtn.disabled) {
          event.preventDefault();
          ciLinkTradeApply(linkBtn.getAttribute('data-ci-link-trade-match'));
        }
      });
    }

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      var modal = document.querySelector(CI_LINK_TRADE_OVERLAY_SEL);
      if (modal && !modal.hidden) ciLinkTradeClose();
    });
  }

  window.ciLinkTradeOpen = ciLinkTradeOpen;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCiLinkTradeModal);
  } else {
    initCiLinkTradeModal();
  }
})();
