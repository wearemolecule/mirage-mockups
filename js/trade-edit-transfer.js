/**
 * Trade Edit — Transfer tab: destination combobox, validation, breakdown grid.
 */
(function () {
    'use strict';

    var DESTINATIONS = ['#datacenter', '#east', '#mvmt', '#tiesto', '#west'];
    var PAGE_SIZE = 10;
    var QTY_DEBOUNCE_MS = 250;
    var FEEDBACK_HIDE_MS = 5000;
    var FALLBACK_TRADE_QTY = 150;

    var TRANSFER_ROWS = [];
    var legTemplateCache = [];

    function $(id) {
        return document.getElementById(id);
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function normalizeBook(value) {
        return String(value || '').trim().toLowerCase();
    }

    function parseQuantity(value) {
        if (value === '' || value == null) return NaN;
        return parseFloat(String(value));
    }

    function getTradeQuantity() {
        var el = $('te-narrative-quantity');
        if (!el) return FALLBACK_TRADE_QTY;
        var match = String(el.textContent || '').match(/[\d.]+/);
        return match ? parseFloat(match[0]) : FALLBACK_TRADE_QTY;
    }

    function getDefaultTransferQty() {
        return String(getTradeQuantity());
    }

    function isQuantityValid(value) {
        var qty = parseQuantity(value);
        if (isNaN(qty)) return false;
        return qty > 0 && qty <= getTradeQuantity();
    }

    function getCurrentBook() {
        var el = $('te-transfer-current-book');
        return el ? String(el.textContent || '').trim() : '';
    }

    function getAvailableDestinations() {
        var current = normalizeBook(getCurrentBook());
        return DESTINATIONS.filter(function (item) {
            return normalizeBook(item) !== current;
        });
    }

    function isSanctionedDestination(value) {
        var trimmed = String(value || '').trim();
        if (!trimmed) return false;
        var normalized = normalizeBook(trimmed);
        return getAvailableDestinations().some(function (item) {
            return normalizeBook(item) === normalized;
        });
    }

    function syncMolValidation(wrap, isValid) {
        if (!wrap) return;
        wrap.classList.toggle('mol-validation--valid', !!isValid);
    }

    function formatTransferQty(value) {
        var rounded = Math.round(value * 100) / 100;
        if (Math.round(rounded) === rounded) return String(rounded);
        return String(rounded);
    }

    function getTotalBaseUnitQty(rows) {
        return rows.reduce(function (sum, row) {
            return sum + (row.baseUnitQty || 0);
        }, 0);
    }

    function getTransferLegTemplate() {
        if (window.TradeEditLegs && typeof window.TradeEditLegs.getTransferBreakdownTemplate === 'function') {
            return window.TradeEditLegs.getTransferBreakdownTemplate();
        }
        return [];
    }

    function getRefineQuery() {
        var input = $('te-transfer-refine-input');
        return input ? input.value.trim().toLowerCase() : '';
    }

    function filteredTransferRows() {
        var q = getRefineQuery();
        if (!q) return TRANSFER_ROWS.slice();
        return TRANSFER_ROWS.filter(function (row) {
            return row.contractDay.toLowerCase().indexOf(q) !== -1
                || row.contractQty.toLowerCase().indexOf(q) !== -1
                || row.unitQty.toLowerCase().indexOf(q) !== -1;
        });
    }

    function rebuildTransferRows() {
        legTemplateCache = getTransferLegTemplate();
        TRANSFER_ROWS = legTemplateCache.map(function (item) {
            return {
                contractDay: item.contractDay,
                baseContractQty: item.baseContractQty,
                baseUnitQty: item.baseUnitQty,
                contractQty: '',
                unitQty: ''
            };
        });
    }

    function applyQuantityToRows(qtyValue) {
        var totalBase = getTotalBaseUnitQty(TRANSFER_ROWS);
        if (!TRANSFER_ROWS.length || !totalBase) return;

        if (!isQuantityValid(qtyValue)) {
            TRANSFER_ROWS.forEach(function (row) {
                row.contractQty = 'N/A';
                row.unitQty = 'N/A';
            });
            return;
        }

        var transferQty = parseQuantity(qtyValue);
        TRANSFER_ROWS.forEach(function (row) {
            var share = transferQty / totalBase;
            row.unitQty = formatTransferQty(row.baseUnitQty * share);
            row.contractQty = formatTransferQty(row.baseContractQty * share);
        });
    }

    function restoreTransferRows(qtyValue) {
        rebuildTransferRows();
        applyQuantityToRows(qtyValue != null ? qtyValue : getTradeQuantity());
    }

    function getTransferEmptyMessage() {
        if (!legTemplateCache.length) return 'No legs available for this trade.';
        return 'No matching contract days.';
    }

    function renderTransferGrid() {
        var tbody = $('te-transfer-grid-body');
        var emptyEl = $('te-transfer-grid-empty');
        var paginationEl = $('te-transfer-pagination');
        if (!tbody) return;

        var rows = filteredTransferRows();
        var isEmpty = rows.length === 0;

        tbody.innerHTML = isEmpty ? '' : rows.map(function (row) {
            return (
                '<tr>' +
                    '<td class="te-transfer-col-day trades-col-date">' + escapeHtml(row.contractDay) + '</td>' +
                    '<td class="te-transfer-col-contract-qty trades-col-num">' + escapeHtml(row.contractQty) + '</td>' +
                    '<td class="te-transfer-col-unit-qty trades-col-num">' + escapeHtml(row.unitQty) + '</td>' +
                    '<td class="te-transfer-col-spacer" aria-hidden="true"></td>' +
                '</tr>'
            );
        }).join('');

        if (emptyEl) {
            emptyEl.textContent = getTransferEmptyMessage();
            emptyEl.hidden = !isEmpty;
        }

        if (!paginationEl) return;

        var total = TRANSFER_ROWS.length;
        var countEl = $('te-transfer-pagination-text');
        var pageEl = $('te-transfer-pagination-page');
        var pageCount = total ? Math.ceil(total / PAGE_SIZE) : 0;

        if (countEl) {
            countEl.textContent = rows.length
                ? ('1 to ' + rows.length + ' of ' + (getRefineQuery() ? rows.length : total))
                : '0 to 0 of 0';
        }
        if (pageEl) {
            pageEl.textContent = rows.length
                ? ('Page 1 of ' + Math.max(1, pageCount))
                : 'Page 0 of 0';
        }
    }

    function initTransferTab() {
        var qtyInput = $('te-transfer-qty');
        var qtyWrap = $('te-transfer-qty-wrap');
        var destInput = $('te-transfer-destination');
        var destWrap = $('te-transfer-destination-wrap');
        var combobox = $('te-transfer-destination-combobox');
        var dropdown = $('te-transfer-destination-list');
        var resetBtn = $('te-transfer-reset');
        var applyBtn = $('te-transfer-apply');
        var refineInput = $('te-transfer-refine-input');
        var feedbackEl = $('te-transfer-feedback');
        var feedbackTimer = null;
        var qtyDebounceTimer = null;
        var highlightedIndex = -1;

        if (!qtyInput || !destInput || !dropdown) return;

        function hideFeedback() {
            if (feedbackTimer) {
                clearTimeout(feedbackTimer);
                feedbackTimer = null;
            }
            if (feedbackEl) {
                feedbackEl.hidden = true;
                feedbackEl.textContent = '';
            }
        }

        function showFeedback(message) {
            if (!feedbackEl) return;
            feedbackEl.textContent = message;
            feedbackEl.hidden = false;
            if (feedbackTimer) clearTimeout(feedbackTimer);
            feedbackTimer = setTimeout(hideFeedback, FEEDBACK_HIDE_MS);
        }

        function isFormDirty() {
            return String(qtyInput.value).trim() !== getDefaultTransferQty()
                || String(destInput.value).trim() !== ''
                || (refineInput && refineInput.value.trim() !== '');
        }

        function syncQuantityValidation() {
            syncMolValidation(qtyWrap, isQuantityValid(qtyInput.value));
        }

        function syncDestinationValidation() {
            syncMolValidation(destWrap, isSanctionedDestination(destInput.value));
        }

        function syncFormChrome() {
            if (applyBtn) {
                applyBtn.disabled = !isSanctionedDestination(destInput.value) || !isQuantityValid(qtyInput.value);
            }
            if (resetBtn) {
                resetBtn.disabled = !isFormDirty();
            }
        }

        function getDropdownOptions() {
            return Array.prototype.slice.call(dropdown.querySelectorAll('.te-transfer-combobox__option'));
        }

        function syncActiveDescendant() {
            if (highlightedIndex >= 0) {
                destInput.setAttribute('aria-activedescendant', 'te-transfer-destination-option-' + highlightedIndex);
            } else {
                destInput.removeAttribute('aria-activedescendant');
            }
        }

        function setHighlightedIndex(index) {
            var options = getDropdownOptions();
            highlightedIndex = options.length ? Math.max(0, Math.min(index, options.length - 1)) : -1;
            options.forEach(function (option, i) {
                option.classList.toggle('is-highlighted', i === highlightedIndex);
                if (i === highlightedIndex) {
                    option.scrollIntoView({ block: 'nearest' });
                }
            });
            syncActiveDescendant();
        }

        function filterOptions(query) {
            var q = String(query || '').trim().toLowerCase();
            var list = getAvailableDestinations();
            if (!q) return list;
            return list.filter(function (item) {
                return item.toLowerCase().indexOf(q) !== -1;
            });
        }

        function renderDropdown(query) {
            var matches = filterOptions(query);
            dropdown.innerHTML = '';
            highlightedIndex = -1;
            if (!matches.length) {
                dropdown.hidden = true;
                destInput.setAttribute('aria-expanded', 'false');
                destInput.removeAttribute('aria-activedescendant');
                return;
            }
            matches.forEach(function (value, index) {
                var option = document.createElement('button');
                option.type = 'button';
                option.className = 'te-transfer-combobox__option';
                option.id = 'te-transfer-destination-option-' + index;
                option.setAttribute('role', 'option');
                option.setAttribute('data-value', value);
                option.textContent = value;
                dropdown.appendChild(option);
            });
        }

        function openDropdown() {
            renderDropdown(destInput.value);
            if (!dropdown.children.length) return;
            dropdown.hidden = false;
            destInput.setAttribute('aria-expanded', 'true');
            setHighlightedIndex(0);
        }

        function closeDropdown() {
            dropdown.hidden = true;
            destInput.setAttribute('aria-expanded', 'false');
            destInput.removeAttribute('aria-activedescendant');
            highlightedIndex = -1;
        }

        function selectDestination(value) {
            destInput.value = value;
            syncDestinationValidation();
            syncFormChrome();
            closeDropdown();
        }

        function scheduleQuantityUpdate() {
            if (qtyDebounceTimer) clearTimeout(qtyDebounceTimer);
            qtyDebounceTimer = setTimeout(function () {
                applyQuantityToRows(qtyInput.value);
                renderTransferGrid();
            }, QTY_DEBOUNCE_MS);
        }

        function resetForm() {
            if (qtyDebounceTimer) {
                clearTimeout(qtyDebounceTimer);
                qtyDebounceTimer = null;
            }
            qtyInput.value = getDefaultTransferQty();
            destInput.value = '';
            if (refineInput) refineInput.value = '';
            restoreTransferRows(getTradeQuantity());
            syncQuantityValidation();
            syncDestinationValidation();
            syncFormChrome();
            hideFeedback();
            closeDropdown();
            renderTransferGrid();
        }

        qtyInput.addEventListener('input', function () {
            syncQuantityValidation();
            syncFormChrome();
            scheduleQuantityUpdate();
        });

        destInput.addEventListener('input', function () {
            syncDestinationValidation();
            syncFormChrome();
            hideFeedback();
            openDropdown();
        });

        destInput.addEventListener('blur', function () {
            syncDestinationValidation();
            syncFormChrome();
        });

        destInput.addEventListener('focus', openDropdown);
        destInput.addEventListener('click', openDropdown);

        destInput.addEventListener('keydown', function (e) {
            var options = getDropdownOptions();
            var isOpen = !dropdown.hidden && options.length > 0;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (!isOpen) openDropdown();
                else setHighlightedIndex(highlightedIndex < 0 ? 0 : highlightedIndex + 1);
                return;
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (!isOpen) openDropdown();
                else setHighlightedIndex(highlightedIndex < 0 ? options.length - 1 : highlightedIndex - 1);
                return;
            }

            if (e.key === 'Enter' && isOpen && highlightedIndex >= 0) {
                e.preventDefault();
                var selected = options[highlightedIndex];
                if (selected) {
                    selectDestination(selected.getAttribute('data-value') || selected.textContent);
                }
                return;
            }

            if (e.key === 'Escape') {
                closeDropdown();
                destInput.blur();
            }
        });

        dropdown.addEventListener('mousedown', function (e) {
            e.preventDefault();
        });

        dropdown.addEventListener('click', function (e) {
            var option = e.target.closest('.te-transfer-combobox__option');
            if (!option) return;
            selectDestination(option.getAttribute('data-value') || option.textContent);
        });

        document.addEventListener('click', function (e) {
            if (!combobox || combobox.contains(e.target)) return;
            closeDropdown();
        });

        if (refineInput) {
            refineInput.addEventListener('input', function () {
                renderTransferGrid();
                syncFormChrome();
            });
        }

        if (resetBtn) resetBtn.addEventListener('click', resetForm);

        if (applyBtn) {
            applyBtn.addEventListener('click', function () {
                if (applyBtn.disabled) return;
                showFeedback(
                    'Transferred ' + String(qtyInput.value).trim() + ' MWh to ' + String(destInput.value).trim() + '.'
                );
            });
        }

        qtyInput.value = getDefaultTransferQty();
        qtyInput.setAttribute('max', getDefaultTransferQty());
        restoreTransferRows(getTradeQuantity());
        syncQuantityValidation();
        syncDestinationValidation();
        syncFormChrome();
        renderTransferGrid();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTransferTab);
    } else {
        initTransferTab();
    }
})();
