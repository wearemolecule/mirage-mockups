/**
 * Certificate Inventory — Portfolio New Certificate modal.
 * Serial number entry mirrors Mirage Inventory Tickets (generate range → list → append/replace).
 * Depends on: certificate-inventory-shared.js (ciShowToast)
 */
(function () {
  'use strict';

  var CI_ADD_CERT_OVERLAY_SEL = '#ci-add-cert-modal';
  var CI_ADD_CERT_RANGE_ERROR = 'Serial range is not a recognized pattern';
  var CI_ADD_CERT_RANGE_SEP =
    '(?:to\\b|-|–|—|→|\\/|\\.\\.(?:\\.)?)';
  var CI_ADD_CERT_RANGE_FULL_RE =
    new RegExp('(\\d+)\\s*' + CI_ADD_CERT_RANGE_SEP + '\\s*(\\d+)', 'i');
  var CI_ADD_CERT_RANGE_BRACKET_RE =
    new RegExp('^\\[\\s*(\\d+)\\s*' + CI_ADD_CERT_RANGE_SEP + '\\s*(\\d+)\\s*\\]$', 'i');
  var CI_ADD_CERT_RANGE_PARTIAL_RE =
    new RegExp('^(?:\\[\\s*)?\\d+\\s*' + CI_ADD_CERT_RANGE_SEP + '\\s*\\d*\\]?$', 'i');
  var ciAddCertMode = 'add';
  var ciAddCertEditOriginalSerial = '';
  var ciAddCertEditLink = null;
  var ciAddCertReplaceConfirmCallback = null;

  function ciAddCertUpdateLinksField() {
    var field = document.getElementById('ci-add-cert-links-field');
    var tradeEl = document.getElementById('ci-add-cert-link-trade');
    var sublegEl = document.getElementById('ci-add-cert-link-subleg');
    if (!field || !tradeEl || !sublegEl) return;

    if (ciAddCertMode !== 'edit' || !ciAddCertEditLink) {
      field.hidden = true;
      tradeEl.textContent = '';
      sublegEl.textContent = '';
      return;
    }

    field.hidden = false;
    tradeEl.textContent = '#' + ciAddCertEditLink.trade;
    sublegEl.textContent = ciAddCertEditLink.subleg ? '#' + ciAddCertEditLink.subleg : '—';
  }

  function ciAddCertUpdateTitle() {
    var label = document.getElementById('ci-add-cert-title-label');
    var serial = document.getElementById('ci-add-cert-title-serial');
    if (!label || !serial) return;

    if (ciAddCertMode === 'edit') {
      label.textContent = 'Edit Certificate';
      if (ciAddCertEditOriginalSerial) {
        serial.textContent = ciAddCertEditOriginalSerial;
        serial.hidden = false;
      } else {
        serial.textContent = '';
        serial.hidden = true;
      }
    } else {
      label.textContent = 'New Certificate';
      serial.textContent = '';
      serial.hidden = true;
    }
  }

  function ciAddCertSetMode(mode) {
    ciAddCertMode = mode === 'edit' ? 'edit' : 'add';
    var modal = document.getElementById('ci-add-cert-modal-dialog');
    var serialsCard = document.getElementById('ci-add-cert-serials-card');

    if (modal) modal.classList.toggle('is-edit-mode', ciAddCertMode === 'edit');
    if (serialsCard) serialsCard.hidden = ciAddCertMode === 'edit';
    if (ciAddCertMode === 'add') {
      ciAddCertEditOriginalSerial = '';
      ciAddCertEditLink = null;
    }
    ciAddCertUpdateTitle();
    ciAddCertUpdateLinksField();
    ciAddCertRefreshSerialUI();
  }

  function ciAddCertSetFieldValue(id, value) {
    var el = document.getElementById(id);
    if (!el || value == null || value === '' || value === '—') return;
    el.value = String(value);
  }

  function ciAddCertSetSelectValue(id, value) {
    var el = document.getElementById(id);
    if (!el || value == null || value === '' || value === '—') return;
    var str = String(value);
    for (var i = 0; i < el.options.length; i++) {
      if (el.options[i].value === str) {
        el.selectedIndex = i;
        return;
      }
    }
  }

  function ciAddCertPopulateFromCert(cert) {
    if (!cert) return;
    ciAddCertEditOriginalSerial = cert.serial || '';
    ciAddCertEditLink = cert.linkedTrade
      ? { trade: cert.linkedTrade, subleg: cert.linkedSubleg }
      : null;
    ciAddCertUpdateTitle();
    ciAddCertUpdateLinksField();
    ciAddCertSetFieldValue('ci-add-cert-edit-serial', cert.serial);
    ciAddCertSetSelectValue('ci-add-cert-registry', cert.registry);
    ciAddCertSetSelectValue('ci-add-cert-vintage', cert.vintage);
    ciAddCertSetSelectValue('ci-add-cert-technology', cert.technology);
    ciAddCertSetSelectValue('ci-add-cert-state', cert.state);
    ciAddCertSetFieldValue('ci-add-cert-volume', cert.volume != null ? cert.volume.toFixed(2) : '');
    ciAddCertSetFieldValue('ci-add-cert-cost', cert.costBasis != null ? String(cert.costBasis) : '');
  }

  function ciAddCertMolHasValue(el) {
    if (!el) return false;
    if (el.tagName === 'SELECT') {
      return el.value != null && String(el.value).length > 0;
    }
    return String(el.value ?? '').trim().length > 0;
  }

  function ciAddCertParseSerialList(str) {
    return String(str || '')
      .split(',')
      .map(function (part) { return part.trim(); })
      .filter(function (part) { return part.length > 0; });
  }

  function ciAddCertUniqueSerials(list) {
    var seen = {};
    var out = [];
    list.forEach(function (serial) {
      if (seen[serial]) return;
      seen[serial] = true;
      out.push(serial);
    });
    return out;
  }

  function ciAddCertSerialNumbersEl() {
    return document.getElementById('ci-add-cert-serial-numbers');
  }

  function ciAddCertCommittedSerialList() {
    var serialNumbers = ciAddCertSerialNumbersEl();
    return ciAddCertParseSerialList(serialNumbers && serialNumbers.value);
  }

  function ciAddCertCommittedSerialCount() {
    return ciAddCertCommittedSerialList().length;
  }

  function ciAddCertHasSerialList() {
    return ciAddCertCommittedSerialCount() > 0;
  }

  function ciAddCertParseRangeBounds(str) {
    var text = String(str || '').trim();
    if (!text) return null;

    var bracketed = text.match(CI_ADD_CERT_RANGE_BRACKET_RE);
    if (bracketed) {
      return {
        startStr: bracketed[1],
        endStr: bracketed[2],
        prefix: ''
      };
    }

    var nums = text.match(CI_ADD_CERT_RANGE_FULL_RE);
    if (!nums) return null;

    var startStr = nums[1];
    var matchIndex = text.indexOf(nums[0]);
    var prefix = text.slice(0, matchIndex + nums[0].indexOf(startStr));

    return {
      startStr: startStr,
      endStr: nums[2],
      prefix: prefix
    };
  }

  function ciAddCertExpandSerialRange(str) {
    var text = String(str || '').trim();
    if (!text) {
      return { error: CI_ADD_CERT_RANGE_ERROR, serials: null };
    }

    var bounds = ciAddCertParseRangeBounds(text);
    if (!bounds) {
      return { error: CI_ADD_CERT_RANGE_ERROR, serials: null };
    }

    var startStr = bounds.startStr;
    var endStr = bounds.endStr;
    var start = +startStr;
    var end = +endStr;

    if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
      return { error: CI_ADD_CERT_RANGE_ERROR, serials: null };
    }
    if (end - start >= 100000) {
      return { error: 'Serial range is too large', serials: null };
    }

    var padLen = Math.max(startStr.length, endStr.length);
    var serials = [];
    var prefix = bounds.prefix;

    for (var n = start; n <= end; n += 1) {
      serials.push(prefix + String(n).padStart(padLen, '0'));
    }

    return { error: null, serials: serials };
  }

  var CI_ADD_CERT_GENERATE_TITLE =
    'Generate serial numbers from the range';
  var CI_ADD_CERT_APPEND_TITLE =
    'Generate from the range and add to the serial list';
  var CI_ADD_CERT_APPEND_SINGLE_TITLE =
    'Add this serial number to the end of the list';
  var CI_ADD_CERT_ADD_TITLE =
    'Add serial number to Serial Range';
  var CI_ADD_CERT_REPLACE_RANGE_TITLE =
    'Generate from the range and replace the serial list';
  var CI_ADD_CERT_REPLACE_SINGLE_TITLE =
    'Replace the serial list with this serial number';
  var CI_ADD_CERT_RANGE_ACTION_TITLE_DISABLED =
    'Enter a start and end (e.g. 10000001-10001000)';

  function ciAddCertSourceRangeEl() {
    return document.getElementById('ci-add-cert-source-range');
  }

  function ciAddCertSourceRangeValue() {
    var sourceRange = ciAddCertSourceRangeEl();
    return String(sourceRange && sourceRange.value || '').trim();
  }

  function ciAddCertSerialCountLabel(count) {
    return count + ' serial number' + (count === 1 ? '' : 's');
  }

  function ciAddCertFinishSourceCommit(focusSerialList) {
    var sourceRange = ciAddCertSourceRangeEl();
    if (sourceRange) sourceRange.value = '';
    ciAddCertShowSourceRangeError('');
    ciAddCertRefreshSerialUI();
    if (focusSerialList) {
      var serialNumbers = ciAddCertSerialNumbersEl();
      if (serialNumbers) serialNumbers.focus();
    } else if (sourceRange) {
      sourceRange.focus();
    }
  }

  function ciAddCertHasExpandableRange(str) {
    var text = str != null ? String(str).trim() : ciAddCertSourceRangeValue();
    return Boolean(ciAddCertParseRangeBounds(text));
  }

  function ciAddCertLooksLikeRangeInput(str) {
    var text = str != null ? String(str).trim() : ciAddCertSourceRangeValue();
    if (!text) return false;
    if (ciAddCertHasExpandableRange(text)) return true;
    return CI_ADD_CERT_RANGE_PARTIAL_RE.test(text);
  }

  function ciAddCertUpdateRangeActionState() {
    var actions = document.getElementById('ci-add-cert-range-actions');
    var appendBtn = document.getElementById('ci-add-cert-range-append');
    var replaceBtn = document.getElementById('ci-add-cert-range-replace');
    var sourceText = ciAddCertSourceRangeValue();
    var looksLikeRange = ciAddCertLooksLikeRangeInput(sourceText);
    var hasRange = ciAddCertHasExpandableRange(sourceText);
    var hasList = ciAddCertHasSerialList();
    var hasSinglePending = Boolean(sourceText) && !looksLikeRange;
    var showActions = looksLikeRange || hasSinglePending;

    if (actions) actions.hidden = !showActions;

    if (appendBtn) {
      appendBtn.hidden = !showActions;
      if (looksLikeRange) {
        appendBtn.textContent = hasList ? 'Append' : 'Generate';
        appendBtn.disabled = !hasRange;
        appendBtn.dataset.ciAddCertRangeAction = 'range';
        appendBtn.title = hasRange
          ? (hasList ? CI_ADD_CERT_APPEND_TITLE : CI_ADD_CERT_GENERATE_TITLE)
          : CI_ADD_CERT_RANGE_ACTION_TITLE_DISABLED;
      } else if (hasSinglePending) {
        appendBtn.textContent = hasList ? 'Append' : 'Add to Range';
        appendBtn.disabled = !sourceText;
        appendBtn.dataset.ciAddCertRangeAction = 'single';
        appendBtn.title = hasList ? CI_ADD_CERT_APPEND_SINGLE_TITLE : CI_ADD_CERT_ADD_TITLE;
      }
    }

    if (replaceBtn) {
      replaceBtn.hidden = !hasList || !(looksLikeRange || hasSinglePending);
      replaceBtn.disabled = looksLikeRange ? !hasRange : !sourceText;
      if (replaceBtn.disabled) {
        replaceBtn.title = looksLikeRange
          ? CI_ADD_CERT_RANGE_ACTION_TITLE_DISABLED
          : CI_ADD_CERT_REPLACE_SINGLE_TITLE;
      } else {
        replaceBtn.title = looksLikeRange
          ? CI_ADD_CERT_REPLACE_RANGE_TITLE
          : CI_ADD_CERT_REPLACE_SINGLE_TITLE;
      }
    }
  }

  function ciAddCertAppendSerialsToList(serials, options) {
    options = options || {};
    var serialNumbers = ciAddCertSerialNumbersEl();
    if (!serialNumbers || !serials || !serials.length) return false;

    var nextList = options.replace
      ? serials.slice()
      : ciAddCertUniqueSerials(ciAddCertCommittedSerialList().concat(serials));

    serialNumbers.value = nextList.join(', ');
    return true;
  }

  function ciAddCertAddSingleSerialFromInput() {
    if (!ciAddCertSourceRangeEl()) return false;

    var text = ciAddCertSourceRangeValue();
    if (!text || ciAddCertHasExpandableRange(text)) return false;

    if (!ciAddCertAppendSerialsToList([text])) return false;

    ciAddCertFinishSourceCommit(false);
    return true;
  }

  function ciAddCertPendingSerialCount() {
    var listCount = ciAddCertCommittedSerialCount();
    var pending = ciAddCertSourceRangeValue();
    var pendingSingle = pending && !ciAddCertLooksLikeRangeInput(pending) ? 1 : 0;

    return listCount + pendingSingle;
  }

  function ciAddCertOpenReplaceConfirm(mode, onConfirm) {
    var overlay = document.getElementById('ci-add-cert-replace-confirm');
    var messageEl = document.getElementById('ci-add-cert-replace-confirm-message');
    var okBtn = document.getElementById('ci-add-cert-replace-confirm-ok');
    var addOverlay = document.querySelector(CI_ADD_CERT_OVERLAY_SEL);
    if (!overlay || !messageEl) return;

    var count = ciAddCertCommittedSerialCount();
    var countLabel = ciAddCertSerialCountLabel(count);

    if (mode === 'single') {
      messageEl.textContent =
        'Replace will discard the ' + countLabel +
        ' in the list and use the serial number in the input instead.';
    } else {
      messageEl.textContent =
        'Replace will discard the ' + countLabel +
        ' in the list and generate new ones from the range.';
    }

    ciAddCertReplaceConfirmCallback = onConfirm;
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    if (addOverlay) addOverlay.classList.add('is-replace-confirm-open');
    if (okBtn) okBtn.focus();
  }

  function ciAddCertRunReplaceConfirmed(mode, sourceText) {
    if (mode === 'range') {
      return ciAddCertGenerateFromRangeText(sourceText, 'replace');
    }
    return ciAddCertReplaceSingleFromInput(sourceText);
  }

  function ciAddCertCloseReplaceConfirm(didConfirm) {
    var overlay = document.getElementById('ci-add-cert-replace-confirm');
    var addOverlay = document.querySelector(CI_ADD_CERT_OVERLAY_SEL);
    if (overlay) {
      overlay.hidden = true;
      overlay.setAttribute('aria-hidden', 'true');
    }
    if (addOverlay) addOverlay.classList.remove('is-replace-confirm-open');
    var callback = ciAddCertReplaceConfirmCallback;
    ciAddCertReplaceConfirmCallback = null;
    if (didConfirm && typeof callback === 'function') callback();
  }

  function ciAddCertReplaceSingleFromInput(sourceText) {
    if (!ciAddCertSourceRangeEl() || !ciAddCertSerialNumbersEl()) return false;

    var text = sourceText != null ? String(sourceText).trim() : ciAddCertSourceRangeValue();
    if (!text || ciAddCertHasExpandableRange(text)) return false;

    if (!ciAddCertAppendSerialsToList([text], { replace: true })) return false;

    ciAddCertFinishSourceCommit(true);
    return true;
  }

  function ciAddCertGenerateFromRangeText(text, mode) {
    if (!ciAddCertSourceRangeEl() || !ciAddCertSerialNumbersEl()) return false;

    var result = ciAddCertExpandSerialRange(text);
    if (result.error) {
      ciAddCertShowSourceRangeError(result.error);
      return false;
    }

    if (!ciAddCertAppendSerialsToList(result.serials || [], { replace: mode === 'replace' })) {
      return false;
    }

    ciAddCertFinishSourceCommit(true);
    return true;
  }

  function ciAddCertGenerateFromRange(mode) {
    var sourceRange = ciAddCertSourceRangeEl();
    if (!sourceRange) return false;
    return ciAddCertGenerateFromRangeText(sourceRange.value, mode);
  }

  function ciAddCertShowSourceRangeError(message) {
    var errorEl = document.getElementById('ci-add-cert-source-range-error');
    var input = ciAddCertSourceRangeEl();
    var wrap = input && input.closest('.ci-add-cert-source-range-group');
    if (!errorEl) return;

    if (message) {
      errorEl.textContent = message;
      errorEl.hidden = false;
      if (wrap) wrap.classList.add('is-invalid');
    } else {
      errorEl.textContent = '';
      errorEl.hidden = true;
      if (wrap) wrap.classList.remove('is-invalid');
    }
  }

  function ciAddCertSyncMolValidation(el) {
    if (!el) return;
    var wrap = el.closest('.mol-validation');
    if (!wrap && !(el.classList && el.classList.contains('mol-validation'))) return;
    var target = wrap || el;
    var isValid = ciAddCertMolHasValue(el);
    target.classList.toggle('mol-validation--valid', isValid);
  }

  function ciAddCertClearMolValidation() {
    var overlay = document.querySelector(CI_ADD_CERT_OVERLAY_SEL);
    if (!overlay) return;
    overlay.querySelectorAll('.mol-validation').forEach(function (el) {
      el.classList.remove('mol-validation--valid');
    });
  }

  function ciAddCertUpdateSerialCountFooter() {
    var countEl = document.getElementById('ci-add-cert-serial-count');
    if (!countEl) return;

    var count = ciAddCertCommittedSerialCount();
    if (count > 0) {
      countEl.classList.remove('is-empty');
      countEl.textContent = ciAddCertSerialCountLabel(count);
    } else {
      countEl.classList.add('is-empty');
      countEl.textContent = '0 serial numbers';
    }
  }

  function ciAddCertSubmitReady() {
    return ciAddCertPendingSerialCount() > 0;
  }

  function ciAddCertRegistryValid() {
    var registry = document.getElementById('ci-add-cert-registry');
    return ciAddCertMolHasValue(registry);
  }

  function ciAddCertEditFieldsValid() {
    var editSerial = document.getElementById('ci-add-cert-edit-serial');
    return ciAddCertRegistryValid() && ciAddCertMolHasValue(editSerial);
  }

  function ciAddCertUpdateSubmitButton() {
    var submit = document.getElementById('ci-add-cert-submit');
    if (!submit) return;

    if (ciAddCertMode === 'edit') {
      submit.textContent = 'Save Certificate';
      submit.disabled = !ciAddCertEditFieldsValid();
      return;
    }

    var pendingCount = ciAddCertPendingSerialCount();
    submit.textContent = pendingCount > 1
      ? 'Create ' + pendingCount + ' Certificates'
      : 'Create Certificate';
    submit.disabled = !ciAddCertSubmitReady();
  }

  function ciAddCertSyncSourceRangeValidation() {
    var sourceRange = ciAddCertSourceRangeEl();
    if (!sourceRange || ciAddCertMode === 'edit') return;
    var wrap = sourceRange.closest('.mol-validation');
    if (!wrap) return;

    var hasSourceValue = ciAddCertMolHasValue(sourceRange);
    var hasList = ciAddCertHasSerialList();
    var satisfiedViaSerialRangeOnly = hasList && !hasSourceValue;

    /* Serial Range filled directly → Serial Number(s) goes grey (optional), not red/green */
    wrap.classList.toggle('mol-validation--optional', satisfiedViaSerialRangeOnly);
    wrap.classList.toggle('mol-validation--required', !satisfiedViaSerialRangeOnly);
    wrap.classList.toggle('mol-validation--valid', hasSourceValue);
  }

  function ciAddCertSyncSerialRangeValidation() {
    var serialNumbers = ciAddCertSerialNumbersEl();
    if (!serialNumbers || ciAddCertMode === 'edit') return;
    var wrap = serialNumbers.closest('.mol-validation');
    if (!wrap) return;
    wrap.classList.toggle('mol-validation--valid', ciAddCertHasSerialList());
  }

  function ciAddCertRefreshSerialUI() {
    ciAddCertUpdateSerialCountFooter();
    ciAddCertUpdateSubmitButton();
    ciAddCertSyncSourceRangeValidation();
    ciAddCertSyncSerialRangeValidation();
    ciAddCertUpdateRangeActionState();
  }

  function ciAddCertOnFormFieldChanged(el) {
    ciAddCertSyncMolValidation(el);
    ciAddCertUpdateSubmitButton();
  }

  function ciAddCertResetForm() {
    var overlay = document.querySelector(CI_ADD_CERT_OVERLAY_SEL);
    if (!overlay) return;

    overlay.querySelectorAll('input[type="text"], textarea').forEach(function (el) {
      el.value = '';
    });

    overlay.querySelectorAll('select').forEach(function (el) {
      el.selectedIndex = 0;
    });

    ciAddCertShowSourceRangeError('');
    ciAddCertClearMolValidation();
    ciAddCertSetMode('add');
  }

  function ciAddCertClose() {
    var overlay = document.querySelector(CI_ADD_CERT_OVERLAY_SEL);
    if (!overlay) return;
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function ciAddCertOpen() {
    var overlay = document.querySelector(CI_ADD_CERT_OVERLAY_SEL);
    if (!overlay) return;
    ciAddCertResetForm();
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    var sourceRange = ciAddCertSourceRangeEl();
    if (sourceRange) sourceRange.focus();
  }

  function ciAddCertOpenForEdit(cert) {
    var overlay = document.querySelector(CI_ADD_CERT_OVERLAY_SEL);
    if (!overlay || !cert) return;
    ciAddCertResetForm();
    ciAddCertSetMode('edit');
    ciAddCertPopulateFromCert(cert);
    var editSerial = document.getElementById('ci-add-cert-edit-serial');
    var registry = document.getElementById('ci-add-cert-registry');
    if (editSerial) ciAddCertSyncMolValidation(editSerial);
    if (registry) ciAddCertSyncMolValidation(registry);
    ciAddCertRefreshSerialUI();
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (editSerial) editSerial.focus();
  }

  function ciAddCertSubmit() {
    if (ciAddCertMode === 'edit') {
      if (!ciAddCertEditFieldsValid()) return;
    } else {
      if (!ciAddCertSubmitReady()) return;

      if (!ciAddCertRegistryValid()) {
        var registry = document.getElementById('ci-add-cert-registry');
        if (registry) {
          ciAddCertSyncMolValidation(registry);
          registry.focus();
        }
        if (typeof window.ciShowToast === 'function') {
          window.ciShowToast('Select a registry');
        }
        return;
      }

      ciAddCertAddSingleSerialFromInput();
    }

    var count = ciAddCertCommittedSerialCount();

    ciAddCertClose();
    if (typeof window.ciShowToast === 'function') {
      if (ciAddCertMode === 'edit') {
        window.ciShowToast('Certificate updated');
      } else if (count > 1) {
        window.ciShowToast(count + ' certificates added to inventory');
      } else {
        window.ciShowToast('Certificate saved');
      }
    }
  }

  function initCiAddCertModal() {
    var overlay = document.querySelector(CI_ADD_CERT_OVERLAY_SEL);
    if (!overlay) return;

    var openBtn = document.getElementById('ci-add-cert-btn');
    if (openBtn) {
      openBtn.addEventListener('click', ciAddCertOpen);
    }

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) ciAddCertClose();
    });

    overlay.querySelectorAll('[data-ci-add-close]').forEach(function (btn) {
      btn.addEventListener('click', ciAddCertClose);
    });

    var appendBtn = document.getElementById('ci-add-cert-range-append');
    if (appendBtn) {
      appendBtn.addEventListener('click', function () {
        if (appendBtn.dataset.ciAddCertRangeAction === 'single') {
          ciAddCertAddSingleSerialFromInput();
          return;
        }
        ciAddCertGenerateFromRange('append');
      });
    }

    var replaceBtn = document.getElementById('ci-add-cert-range-replace');
    if (replaceBtn) {
      replaceBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var sourceText = ciAddCertSourceRangeValue();
        var mode = ciAddCertHasExpandableRange(sourceText) ? 'range' : 'single';
        ciAddCertOpenReplaceConfirm(mode, function () {
          ciAddCertRunReplaceConfirmed(mode, sourceText);
        });
      });
    }

    var replaceConfirmOverlay = document.getElementById('ci-add-cert-replace-confirm');
    var replaceConfirmCancel = document.getElementById('ci-add-cert-replace-confirm-cancel');
    var replaceConfirmOk = document.getElementById('ci-add-cert-replace-confirm-ok');

    if (replaceConfirmOverlay) {
      replaceConfirmOverlay.addEventListener('click', function (e) {
        if (e.target !== replaceConfirmOverlay) return;
        ciAddCertCloseReplaceConfirm(false);
      });
    }
    if (replaceConfirmCancel) {
      replaceConfirmCancel.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        ciAddCertCloseReplaceConfirm(false);
      });
    }
    if (replaceConfirmOk) {
      replaceConfirmOk.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        ciAddCertCloseReplaceConfirm(true);
      });
    }

    var sourceRange = ciAddCertSourceRangeEl();
    if (sourceRange) {
      sourceRange.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        if (ciAddCertHasExpandableRange()) {
          if (appendBtn && !appendBtn.disabled && appendBtn.dataset.ciAddCertRangeAction === 'range') {
            ciAddCertGenerateFromRange('append');
          }
          return;
        }
        ciAddCertAddSingleSerialFromInput();
      });
    }

    var submit = document.getElementById('ci-add-cert-submit');
    if (submit) submit.addEventListener('click', ciAddCertSubmit);

    overlay.addEventListener('input', function (e) {
      var t = e.target;
      if (!(t instanceof HTMLInputElement || t instanceof HTMLSelectElement || t instanceof HTMLTextAreaElement)) return;
      if (t.id === 'ci-add-cert-source-range') {
        ciAddCertShowSourceRangeError('');
        ciAddCertRefreshSerialUI();
        return;
      }
      if (t.id === 'ci-add-cert-serial-numbers') {
        ciAddCertRefreshSerialUI();
        return;
      }
      if (!t.closest('.mol-validation') && !t.classList.contains('mol-validation')) return;
      ciAddCertOnFormFieldChanged(t);
    });

    overlay.addEventListener('change', function (e) {
      var t = e.target;
      if (!(t instanceof HTMLInputElement || t instanceof HTMLSelectElement || t instanceof HTMLTextAreaElement)) return;
      if (t.id === 'ci-add-cert-serial-numbers') {
        ciAddCertRefreshSerialUI();
        return;
      }
      if (!t.closest('.mol-validation') && !t.classList.contains('mol-validation')) return;
      ciAddCertOnFormFieldChanged(t);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var replaceConfirm = document.getElementById('ci-add-cert-replace-confirm');
      if (replaceConfirm && !replaceConfirm.hidden) {
        ciAddCertCloseReplaceConfirm(false);
        return;
      }
      if (overlay && !overlay.hidden) ciAddCertClose();
    });

    ciAddCertRefreshSerialUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCiAddCertModal);
  } else {
    initCiAddCertModal();
  }

  window.ciAddCertOpenForEdit = ciAddCertOpenForEdit;
})();
