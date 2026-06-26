/**
 * Title-integrated trade date filter (Trades + Certificate Inventory Registry Activity).
 */
(function () {
  'use strict';

  var TRADE_DATE_PRESETS = {
    '5': 'THE LAST 5 DAYS',
    '10': 'THE LAST 10 DAYS',
    '30': 'THE LAST 30 DAYS',
    '60': 'THE LAST 60 DAYS',
    all: 'ALL'
  };

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function formatDate(date) {
    return pad2(date.getMonth() + 1) + '/' + pad2(date.getDate()) + '/' + date.getFullYear();
  }

  function rangeForDays(days) {
    var end = new Date();
    var start = new Date();
    start.setDate(start.getDate() - days);
    return formatDate(start) + ' - ' + formatDate(end);
  }

  function initTradeDateFilter(options) {
    options = options || {};
    var defaultPreset = options.defaultPreset || '5';
    var wrap = document.getElementById(options.wrapId || 'trade-date-filter');
    var trigger = document.getElementById(options.triggerId || 'trade-date-filter-trigger');
    var popover = document.getElementById(options.popoverId || 'trade-date-filter-popover');
    var labelEl = document.getElementById(options.labelId || 'trade-date-filter-label');
    var customInput = document.getElementById(options.customRangeId || 'trade-date-custom-range');
    var okBtn = document.getElementById(options.okBtnId || 'trade-date-custom-ok');
    if (!wrap || !trigger || !popover || !labelEl || !customInput || !okBtn) return;

    var presetBtns = wrap.querySelectorAll('.trade-date-filter__preset');
    var state = { mode: 'preset', preset: defaultPreset, customRange: '' };

    function syncActiveState() {
      var isDefault = state.mode === 'preset' && state.preset === defaultPreset;
      trigger.classList.toggle('trade-date-filter__trigger--active', !isDefault);
    }

    function setPresetActive(preset) {
      presetBtns.forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.preset === preset);
      });
    }

    function updateTitle() {
      if (state.mode === 'preset') {
        labelEl.textContent = TRADE_DATE_PRESETS[state.preset] || TRADE_DATE_PRESETS[defaultPreset];
      } else {
        labelEl.textContent = state.customRange.replace(/\s*-\s*/, ' \u2014 ');
      }
      syncActiveState();
      if (typeof options.onChange === 'function') options.onChange(state);
    }

    function openPopover() {
      wrap.classList.add('is-open');
      popover.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      if (state.mode === 'custom' && state.customRange) {
        customInput.value = state.customRange;
      } else if (!customInput.value.trim()) {
        customInput.value = rangeForDays(parseInt(state.preset, 10) || 5);
      }
    }

    function closePopover() {
      wrap.classList.remove('is-open');
      popover.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    }

    function selectPreset(preset) {
      state.mode = 'preset';
      state.preset = preset;
      setPresetActive(preset);
      if (preset !== 'all') {
        customInput.value = rangeForDays(parseInt(preset, 10) || 5);
      } else {
        customInput.value = '';
      }
      updateTitle();
      closePopover();
    }

    function applyCustomRange() {
      var value = customInput.value.trim();
      if (!value) return;
      state.mode = 'custom';
      state.customRange = value;
      presetBtns.forEach(function (btn) {
        btn.classList.remove('active');
      });
      updateTitle();
      closePopover();
    }

    trigger.addEventListener('click', function (event) {
      event.stopPropagation();
      if (wrap.classList.contains('is-open')) closePopover();
      else openPopover();
    });

    presetBtns.forEach(function (btn) {
      btn.addEventListener('click', function (event) {
        event.stopPropagation();
        selectPreset(btn.dataset.preset);
      });
    });

    okBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      applyCustomRange();
    });

    customInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        applyCustomRange();
      }
    });

    document.addEventListener('click', function (event) {
      if (!wrap.contains(event.target)) closePopover();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closePopover();
    });

    customInput.value = rangeForDays(parseInt(defaultPreset, 10) || 5);
    updateTitle();
  }

  window.initTradeDateFilter = initTradeDateFilter;
  window.TRADE_DATE_PRESETS = TRADE_DATE_PRESETS;
})();
