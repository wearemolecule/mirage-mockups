/**
 * Nominations — gas-day strip and cycle tab stat subtitle sync.
 */
(function () {
  'use strict';

  var MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  var CYCLE_LABELS = {
    timely: 'Timely',
    evening: 'Evening',
    id1: 'ID1',
    id2: 'ID2',
    id3: 'ID3'
  };

  function formatGasDayDisplay(isoDate) {
    if (!isoDate) return '';
    var parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate;
    var month = MONTHS[parseInt(parts[1], 10) - 1];
    var day = parseInt(parts[2], 10);
    var year = parts[0];
    if (!month || isNaN(day)) return isoDate;
    return month + ' ' + day + ', ' + year;
  }

  function addDays(isoDate, delta) {
    var d = new Date(isoDate + 'T12:00:00');
    if (isNaN(d.getTime())) return isoDate;
    d.setDate(d.getDate() + delta);
    return d.toISOString().slice(0, 10);
  }

  function initGasDayStrip() {
    var input = document.getElementById('act-nom-gas-day');
    var display = document.getElementById('act-nom-date-display');
    var prevBtn = document.getElementById('act-nom-date-prev');
    var nextBtn = document.getElementById('act-nom-date-next');
    if (!input || !display) return;

    function syncDisplay() {
      display.textContent = formatGasDayDisplay(input.value);
    }

    input.addEventListener('change', syncDisplay);
    input.addEventListener('input', syncDisplay);

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        input.value = addDays(input.value, -1);
        syncDisplay();
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        input.value = addDays(input.value, 1);
        syncDisplay();
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }

    syncDisplay();
  }

  function initCycleTabs() {
    var stack = document.querySelector('.act-nominations-tabs[data-tabs-stack]');
    var statSub = document.getElementById('act-nom-stat-cycle-sub');
    if (!stack) return;

    function syncStatSub(panelKey) {
      if (!statSub || !CYCLE_LABELS[panelKey]) return;
      statSub.textContent = 'MMBtu · ' + CYCLE_LABELS[panelKey];
    }

    stack.addEventListener('click', function (e) {
      var tab = e.target.closest('.tabs-stack__tab');
      if (!tab || !stack.contains(tab)) return;
      syncStatSub(tab.getAttribute('data-tab-panel'));
    });

    var initial = stack.querySelector('.tabs-stack__tab.active');
    syncStatSub(initial ? initial.getAttribute('data-tab-panel') : 'timely');
  }

  function init() {
    initGasDayStrip();
    initCycleTabs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
