/**
 * Trade Edit — Legs tab grid, refine, row menu, leg edit modal.
 */
(function () {
    'use strict';

    var PAGE_SIZE = 10;
    var TOTAL_LEGS = 96;

    var legsData = [];
    var activeLegId = null;
    var pendingMatch = null;
    var activeMatchTrade = null;

    var MATCH_TRADES = {
        '83310': {
            qty: '10',
            productHtml: '<span class="short-name">M.AESO.HRT7X24.F</span> AESO Alberta RT ATC Hourly',
            settlement: 'Financial',
            price: 'C$55.58',
            legs: [
                { legId: '83347', contractMonth: 'June 13 2026 IE undefined', realizationDate: 'June 13 2026' },
                { legId: '83348', contractMonth: 'June 13 2026 IE undefined', realizationDate: 'June 13 2026' },
                { legId: '83349', contractMonth: 'June 13 2026 IE undefined', realizationDate: 'June 13 2026' },
                { legId: '83350', contractMonth: 'June 13 2026 IE undefined', realizationDate: 'June 13 2026' },
                { legId: '83351', contractMonth: 'June 13 2026 IE undefined', realizationDate: 'June 13 2026' }
            ]
        },
        '82901': {
            qty: '50',
            productHtml: '<span class="short-name">M.XH2P</span> PJM ATSI Zone Day Ahead On Peak Hourly Forward',
            settlement: 'Physical',
            price: '$52.10',
            legs: [
                { legId: '82901', contractMonth: 'June 2 2026 IE 1400', realizationDate: 'June 2 2026' }
            ]
        }
    };

    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    function $(id) {
        return document.getElementById(id);
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function padHour(h) {
        return String(h).padStart(2, '0') + '00';
    }

    function displayDateToIso(display) {
        var parts = String(display || '').trim().split(/\s+/);
        if (parts.length < 3) return '';
        var monthIndex = MONTHS.indexOf(parts[0]);
        if (monthIndex < 0) return '';
        var day = parseInt(parts[1], 10);
        var year = parseInt(parts[2], 10);
        if (isNaN(day) || isNaN(year)) return '';
        return year + '-' + String(monthIndex + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    }

    function isoDateToDisplay(iso) {
        if (!iso) return '';
        var bits = iso.split('-');
        if (bits.length !== 3) return iso;
        var monthIndex = parseInt(bits[1], 10) - 1;
        if (monthIndex < 0 || monthIndex > 11) return iso;
        return MONTHS[monthIndex] + ' ' + parseInt(bits[2], 10) + ' ' + bits[0];
    }

    function matchLabel(contractMonth, legId) {
        return contractMonth + ' — ' + legId;
    }

    function buildLegsData() {
        var rows = [];
        for (var i = 0; i < TOTAL_LEGS; i++) {
            var hour = 3 + (i % 24);
            var dayOffset = Math.floor(i / 24);
            rows.push({
                id: i,
                period: 'June ' + (1 + dayOffset) + ' 2026 IE ' + padHour(hour),
                settlementDate: 'June ' + (1 + dayOffset) + ' 2026',
                match: null,
                matchLabel: null,
                qty: '10 (10)',
                settlementPrice: '',
                notes: ''
            });
        }
        rows[0].match = {
            id: '83347',
            tradeId: '83310',
            contractMonth: 'June 13 2026 IE undefined',
            realizationDate: 'June 13 2026'
        };
        rows[0].matchLabel = matchLabel(rows[0].match.contractMonth, rows[0].match.id);
        rows[0].notes = 'Matched to offset position.';
        rows[5].match = {
            id: '82901',
            tradeId: '82901',
            contractMonth: 'June 2 2026 IE 1400',
            realizationDate: 'June 2 2026'
        };
        rows[5].matchLabel = matchLabel(rows[5].match.contractMonth, rows[5].match.id);
        return rows;
    }

    function getLegById(id) {
        for (var i = 0; i < legsData.length; i++) {
            if (legsData[i].id === id) return legsData[i];
        }
        return null;
    }

    function getRefineQuery() {
        var input = $('te-legs-refine-input');
        return input ? input.value.trim().toLowerCase() : '';
    }

    function filteredLegs() {
        var q = getRefineQuery();
        if (!q) return legsData.slice(0, PAGE_SIZE);
        return legsData.filter(function (leg) {
            return leg.period.toLowerCase().indexOf(q) !== -1
                || leg.settlementDate.toLowerCase().indexOf(q) !== -1
                || (leg.matchLabel && leg.matchLabel.toLowerCase().indexOf(q) !== -1)
                || (leg.notes && leg.notes.toLowerCase().indexOf(q) !== -1);
        }).slice(0, PAGE_SIZE);
    }

    function renderMatchCell(leg) {
        if (leg.matchLabel) {
            return '<span class="te-legs-match-value">' + escapeHtml(leg.matchLabel) + '</span>';
        }
        return '<span class="te-legs-match-empty">No match selected</span>';
    }

    function renderLegsGrid() {
        var tbody = $('te-legs-grid-body');
        if (!tbody) return;

        var rows = filteredLegs();
        tbody.innerHTML = rows.map(function (leg) {
            return (
                '<tr data-leg-id="' + leg.id + '">' +
                    '<td class="trades-col-menu">' +
                        '<div class="te-row-menu-wrap">' +
                            '<button type="button" class="trades-row-menu-btn" aria-label="Row actions" aria-expanded="false" aria-haspopup="true">' +
                                '<i class="fas fa-ellipsis-vertical"></i>' +
                            '</button>' +
                            '<div class="te-row-menu-dropdown" role="menu">' +
                                '<button type="button" role="menuitem" class="action-btn" data-leg-id="' + leg.id + '">Edit Leg</button>' +
                            '</div>' +
                        '</div>' +
                    '</td>' +
                    '<td class="te-legs-col-period">' + escapeHtml(leg.period) + '</td>' +
                    '<td class="te-legs-col-date trades-col-date">' + escapeHtml(leg.settlementDate) + '</td>' +
                    '<td class="te-legs-col-match">' + renderMatchCell(leg) + '</td>' +
                    '<td class="te-legs-col-qty trades-col-num">' + escapeHtml(leg.qty) + '</td>' +
                    '<td class="te-legs-col-price trades-col-num">' + escapeHtml(leg.settlementPrice) + '</td>' +
                    '<td class="te-legs-col-notes">' + escapeHtml(leg.notes) + '</td>' +
                '</tr>'
            );
        }).join('');

        var countEl = $('te-legs-pagination-text');
        if (countEl) {
            var total = getRefineQuery() ? rows.length : TOTAL_LEGS;
            countEl.textContent = rows.length ? ('1 to ' + rows.length + ' of ' + total) : '0 to 0 of 0';
        }
    }

    function pendingMatchFromStored(match) {
        if (!match || !match.id) return null;
        return {
            legId: match.id,
            tradeId: match.tradeId || '',
            contractMonth: match.contractMonth || '',
            realizationDate: match.realizationDate || ''
        };
    }

    function pendingMatchFromTradeLeg(tradeId, leg) {
        return {
            legId: leg.legId,
            tradeId: tradeId,
            contractMonth: leg.contractMonth,
            realizationDate: leg.realizationDate
        };
    }

    function getMatchSearchQuery() {
        var input = $('te-leg-match-search');
        return input ? input.value.trim() : '';
    }

    function setMatchResultsVisible(show) {
        var placeholder = $('te-leg-match-placeholder');
        var results = $('te-leg-match-results');
        if (placeholder) placeholder.hidden = show;
        if (results) results.hidden = !show;
    }

    function renderMatchSummary(trade) {
        var summaryEl = $('te-leg-match-summary');
        if (!summaryEl || !trade) return;

        summaryEl.innerHTML =
            escapeHtml(trade.qty) + ' ' + trade.productHtml +
            '<span class="te-leg-match-summary-sep"> | </span>' +
            escapeHtml(trade.settlement) +
            '<span class="te-leg-match-summary-sep"> | </span>' +
            escapeHtml(trade.price);
    }

    function renderMatchTableBody(trade, selectedLegId) {
        var tbody = $('te-leg-match-table-body');
        if (!tbody || !trade) return;

        if (!trade.legs.length) {
            tbody.innerHTML = '<tr class="te-leg-match-empty-row"><td colspan="3">No legs available</td></tr>';
            return;
        }

        tbody.innerHTML = trade.legs.map(function (leg) {
            var selected = selectedLegId && leg.legId === selectedLegId;
            return (
                '<tr class="te-leg-match-result-row' + (selected ? ' selected' : '') + '">' +
                    '<td class="te-leg-match-radio-col">' +
                        '<input type="radio" name="te-leg-match-choice" value="' + escapeHtml(leg.legId) + '"' +
                        (selected ? ' checked' : '') +
                        ' aria-label="Select ' + escapeHtml(leg.contractMonth) + '">' +
                    '</td>' +
                    '<td>' + escapeHtml(leg.contractMonth) + '</td>' +
                    '<td class="trades-col-date">' + escapeHtml(leg.realizationDate) + '</td>' +
                '</tr>'
            );
        }).join('');
    }

    function runMatchSearch() {
        var query = getMatchSearchQuery();
        activeMatchTrade = query ? MATCH_TRADES[query] || null : null;

        if (!activeMatchTrade) {
            pendingMatch = null;
            setMatchResultsVisible(false);
            return;
        }

        setMatchResultsVisible(true);
        renderMatchSummary(activeMatchTrade);
        renderMatchTableBody(activeMatchTrade, pendingMatch ? pendingMatch.legId : null);
    }

    function selectMatchLeg(legId) {
        if (!activeMatchTrade) return;

        var leg = null;
        for (var i = 0; i < activeMatchTrade.legs.length; i++) {
            if (activeMatchTrade.legs[i].legId === legId) {
                leg = activeMatchTrade.legs[i];
                break;
            }
        }
        if (!leg) return;

        pendingMatch = pendingMatchFromTradeLeg(getMatchSearchQuery(), leg);
        renderMatchTableBody(activeMatchTrade, leg.legId);
    }

    function resetMatchUI() {
        var searchEl = $('te-leg-match-search');
        if (searchEl) searchEl.value = '';
        pendingMatch = null;
        activeMatchTrade = null;
        setMatchResultsVisible(false);
    }

    function populateModal(leg) {
        var titleEl = $('te-leg-edit-modal-title');
        var dateEl = $('te-leg-settlement-date');
        var notesEl = $('te-leg-notes');
        var searchEl = $('te-leg-match-search');

        if (titleEl) titleEl.textContent = leg ? leg.period : '';
        if (dateEl) dateEl.value = leg ? displayDateToIso(leg.settlementDate) : '';
        if (notesEl) notesEl.value = leg ? (leg.notes || '') : '';

        pendingMatch = leg ? pendingMatchFromStored(leg.match) : null;
        if (searchEl) {
            searchEl.value = pendingMatch && pendingMatch.tradeId ? pendingMatch.tradeId : '';
        }
        runMatchSearch();
    }

    function closeRowMenus() {
        document.querySelectorAll('.te-row-menu-wrap.is-open').forEach(function (wrap) {
            wrap.classList.remove('is-open');
            var btn = wrap.querySelector('.trades-row-menu-btn');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        });
    }

    function toggleRowMenu(btn) {
        var wrap = btn.closest('.te-row-menu-wrap');
        if (!wrap) return;
        var wasOpen = wrap.classList.contains('is-open');
        closeRowMenus();
        if (!wasOpen) {
            wrap.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
        }
    }

    function openLegEdit(legId) {
        closeRowMenus();
        activeLegId = legId;
        populateModal(getLegById(legId));

        var modal = $('te-leg-edit-modal');
        if (modal) {
            modal.removeAttribute('hidden');
            modal.classList.add('visible');
        }
    }

    function closeLegEdit() {
        activeLegId = null;
        resetMatchUI();
        var modal = $('te-leg-edit-modal');
        if (modal) {
            modal.setAttribute('hidden', '');
            modal.classList.remove('visible');
        }
    }

    function saveLegEdit() {
        if (activeLegId == null) return;
        var leg = getLegById(activeLegId);
        if (!leg) return;

        var dateEl = $('te-leg-settlement-date');
        var notesEl = $('te-leg-notes');

        if (dateEl && dateEl.value) {
            leg.settlementDate = isoDateToDisplay(dateEl.value);
        }
        leg.match = pendingMatch ? {
            id: pendingMatch.legId,
            tradeId: pendingMatch.tradeId,
            contractMonth: pendingMatch.contractMonth,
            realizationDate: pendingMatch.realizationDate
        } : null;
        leg.matchLabel = leg.match ? matchLabel(leg.match.contractMonth, leg.match.id) : null;
        leg.notes = notesEl ? notesEl.value.trim() : '';

        renderLegsGrid();
        closeLegEdit();
    }

    function parseLegQtyDisplay(qtyStr) {
        var match = String(qtyStr || '').match(/^(\d+(?:\.\d+)?)\s*\((\d+(?:\.\d+)?)\)/);
        if (!match) return null;
        return {
            contract: parseFloat(match[1]),
            unit: parseFloat(match[2])
        };
    }

    function getTransferBreakdownTemplate() {
        if (!legsData.length) return [];

        var byDay = {};
        var order = [];

        legsData.forEach(function (leg) {
            var day = leg.settlementDate;
            if (!day) return;
            if (!byDay[day]) {
                byDay[day] = {
                    contractDay: day,
                    baseContractQty: 0,
                    baseUnitQty: 0
                };
                order.push(day);
            }
            var parsed = parseLegQtyDisplay(leg.qty);
            if (parsed) {
                byDay[day].baseContractQty += parsed.contract;
                byDay[day].baseUnitQty += parsed.unit;
            }
        });

        return order.map(function (day) {
            return byDay[day];
        });
    }

    function init() {
        if (!$('te-legs-panel')) return;

        legsData = buildLegsData();
        window.TradeEditLegs = {
            getTransferBreakdownTemplate: getTransferBreakdownTemplate
        };
        renderLegsGrid();

        var refineInput = $('te-legs-refine-input');
        if (refineInput) refineInput.addEventListener('input', renderLegsGrid);

        var gridBody = $('te-legs-grid-body');
        if (gridBody) {
            gridBody.addEventListener('click', function (e) {
                var menuBtn = e.target.closest('.trades-row-menu-btn');
                if (menuBtn) {
                    e.stopPropagation();
                    toggleRowMenu(menuBtn);
                    return;
                }
                var editBtn = e.target.closest('.te-row-menu-dropdown .action-btn[data-leg-id]');
                if (editBtn) {
                    openLegEdit(parseInt(editBtn.getAttribute('data-leg-id'), 10));
                }
            });
        }

        document.addEventListener('click', function (e) {
            if (!e.target.closest('.te-row-menu-wrap')) closeRowMenus();
        });

        var cancelBtn = $('te-leg-edit-cancel');
        if (cancelBtn) cancelBtn.addEventListener('click', closeLegEdit);

        var saveBtn = $('te-leg-edit-save');
        if (saveBtn) saveBtn.addEventListener('click', saveLegEdit);

        var searchInput = $('te-leg-match-search');
        if (searchInput) searchInput.addEventListener('input', runMatchSearch);

        var matchTableWrap = document.querySelector('.te-leg-match-table-wrap');
        if (matchTableWrap) {
            matchTableWrap.addEventListener('change', function (e) {
                if (e.target.name === 'te-leg-match-choice') {
                    selectMatchLeg(e.target.value);
                }
            });
        }

        var modal = $('te-leg-edit-modal');
        if (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === modal) closeLegEdit();
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
