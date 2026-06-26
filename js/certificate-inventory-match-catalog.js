/**
 * Shared trade match catalog for Certificate Inventory (Matching + Portfolio link).
 */
(function (global) {
  'use strict';

  var CI_MATCH_CATALOG_EXTRAS = [
    { trade: '88301', subleg: '88301', type: 'Buy', tech: 'Wind', desc: 'Panhandle Wind PPA · Apr-2024 delivery · open qty 48 MWh' },
    { trade: '88301', subleg: '88302', type: 'Buy', tech: 'Wind', desc: 'Panhandle Wind PPA · May-2024 delivery · open qty 51 MWh' },
    { trade: '88301', subleg: '88303', type: 'Buy', tech: 'Wind', desc: 'Panhandle Wind PPA · Jun-2024 delivery · open qty 51 MWh' },
    { trade: '88421', subleg: '88421', type: 'Buy', tech: 'Solar', desc: 'ERCOT Solar Block · Jan-2024 delivery · open qty 61 MWh' },
    { trade: '88450', subleg: '88450', type: 'Buy', tech: 'Solar', desc: 'ERCOT Solar Forecast · TX delivery · open qty 412 MWh' },
    { trade: '88477', subleg: '88477', type: 'Buy', tech: 'Solar', desc: 'PJM Solar PCC1 · Apr-2024 · open qty 30 MWh' },
    { trade: '88488', subleg: '88488', type: 'Buy', tech: 'Hydro', desc: 'SW Hydro REC · 2024 · open qty 8 MWh' },
    { trade: '88503', subleg: '88503', type: 'Sell', tech: 'Wind', desc: 'Brookfield IA Wind · May-2024 · open qty 40 MWh' },
    { trade: '88512', subleg: '88512', type: 'Buy', tech: 'Wind', desc: 'CAISO Wind · Feb-2025 · open qty 12 MWh' },
    { trade: '88520', subleg: '88520', type: 'Buy', tech: 'Biomass', desc: 'OK Biomass REC Strip · May-2024 delivery · open qty 35 MWh' },
    { trade: '88520', subleg: '88524', type: 'Buy', tech: 'Biomass', desc: 'OK Biomass REC Strip · Jun-2024 delivery · open qty 35 MWh' },
    { trade: '88521', subleg: '88521', type: 'Buy', tech: 'Biomass', desc: 'Central IA Biofuel · May-2024 delivery · open qty 18 MWh' }
  ];

  function ciMatchingParseMatchDesc(desc) {
    var parts = String(desc || '').split(' · ');
    return {
      name: parts[0] || '',
      delivery: parts[1] || '',
      openQty: (parts[2] || '').replace(/^open qty\s*/i, '') || ''
    };
  }

  function ciMatchingMatchToCandidate(match, fallbackTech) {
    var parsed = ciMatchingParseMatchDesc(match.desc);
    var subleg = match.subleg != null ? String(match.subleg) : String(match.trade);
    var id = match.subleg != null
      ? (match.trade + '|' + subleg)
      : (match.trade + '|' + parsed.delivery);
    return {
      id: id,
      trade: match.trade,
      subleg: subleg,
      type: match.type,
      tech: match.tech || fallbackTech || '',
      name: parsed.name,
      delivery: parsed.delivery,
      openQty: parsed.openQty,
      searchText: (match.trade + ' ' + subleg + ' ' + match.type + ' ' + match.desc).toLowerCase()
    };
  }

  function ciMatchingBuildMatchCatalog(items) {
    var seen = {};
    var catalog = [];

    function addCandidate(match, fallbackTech) {
      var candidate = ciMatchingMatchToCandidate(match, fallbackTech);
      if (seen[candidate.id]) return;
      seen[candidate.id] = true;
      catalog.push(candidate);
    }

    (items || []).forEach(function (item) {
      (item.matches || []).forEach(function (match) {
        addCandidate(match, item.tech);
      });
    });

    CI_MATCH_CATALOG_EXTRAS.forEach(function (match) {
      addCandidate(match, match.tech);
    });

    return catalog;
  }

  function ciMatchingDemoSearchTooltipAttr(catalog) {
    var ids = [];
    var seen = {};
    (catalog || []).forEach(function (candidate) {
      if (seen[candidate.trade]) return;
      seen[candidate.trade] = true;
      ids.push(candidate.trade);
    });
    ids.sort(function (a, b) { return Number(a) - Number(b); });
    return 'For demo only: try trade IDs like ' + ids.slice(0, 6).join(', ') + '…';
  }

  function ciGetPortfolioLinkTradeCatalog() {
    if (!global.CI_PORTFOLIO_LINK_TRADE_CATALOG) {
      global.CI_PORTFOLIO_LINK_TRADE_CATALOG = ciMatchingBuildMatchCatalog([]);
    }
    return global.CI_PORTFOLIO_LINK_TRADE_CATALOG;
  }

  window.ciMatchingBuildMatchCatalog = ciMatchingBuildMatchCatalog;
  window.ciMatchingDemoSearchTooltipAttr = ciMatchingDemoSearchTooltipAttr;
  window.ciGetPortfolioLinkTradeCatalog = ciGetPortfolioLinkTradeCatalog;
})(typeof window !== 'undefined' ? window : this);
