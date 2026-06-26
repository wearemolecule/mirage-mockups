/**
 * Shared filters card — collapsible header, More expand, init for all screens.
 * Requires book-card-collapse.js when using data-fa-book-card.
 */
(function (global) {
  'use strict';

  function syncFiltersMoreToggle(serverFilters, moreBtn) {
    if (!serverFilters || !moreBtn) return;
    var isExpanded = serverFilters.classList.contains('expanded');
    var chevron = moreBtn.querySelector('.filters-card-more-toggle__chevron');
    if (chevron) {
      chevron.classList.toggle('fa-chevron-down', !isExpanded);
      chevron.classList.toggle('fa-chevron-up', isExpanded);
    }
    moreBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  }

  function initFiltersCards() {
    document.querySelectorAll('.filters-card[data-fa-book-card]').forEach(function (card) {
      if (typeof global.faSyncAllBookCardCollapse === 'function') {
        global.faSyncAllBookCardCollapse(card);
      }
    });

    var serverFilters = document.getElementById('server-filters');
    var moreBtn = document.getElementById('more-btn');
    if (serverFilters && moreBtn) {
      syncFiltersMoreToggle(serverFilters, moreBtn);
    }
  }

  function toggleServerFilters() {
    var serverFilters = document.getElementById('server-filters');
    var moreBtn = document.getElementById('more-btn');
    if (!serverFilters || !moreBtn) return;
    serverFilters.classList.toggle('expanded');
    syncFiltersMoreToggle(serverFilters, moreBtn);
  }

  function expandServerFilters() {
    var serverFilters = document.getElementById('server-filters');
    var moreBtn = document.getElementById('more-btn');
    if (!serverFilters || !moreBtn) return;
    if (!serverFilters.classList.contains('expanded')) {
      serverFilters.classList.add('expanded');
      syncFiltersMoreToggle(serverFilters, moreBtn);
    }
  }

  global.initFiltersCards = initFiltersCards;
  global.toggleServerFilters = toggleServerFilters;
  global.expandServerFilters = expandServerFilters;
  global.syncFiltersMoreToggle = syncFiltersMoreToggle;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFiltersCards);
  } else {
    initFiltersCards();
  }
})(typeof window !== 'undefined' ? window : this);
