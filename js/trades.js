/**
 * Trades page scripts. Load after alerts.js, book-card-collapse.js, and filters-card.js.
 */

(function initTradesPage() {
    if (!document.body.classList.contains('trades-page')) return;

    initTradeDateFilter();
    initTradesFiltersCard();

    window.toggleViewDeletedTrades = function (btn) {
        btn.classList.toggle('active');
    };
    window.toggleViewGroupTrades = function (btn) {
        btn.classList.toggle('active');
    };

    function initTradesFiltersCard() {
        var card = document.querySelector('.filters-card');
        if (!card) return;

        initTradesMultiSelectFilters(card);
    }

    function initTradesMultiSelectFilters(card) {
        var instrumentFilter = document.getElementById('filter-instrument');
        var subtypeGroup = document.getElementById('filter-instrument-subtype-group');
        var subtypeFilter = document.getElementById('filter-instrument-subtype');

        var MOCK_OPTIONS = [
            'Multi-select 1', 'Multi-select 2', 'Multi-select 3', 'Multi-select 4', 'Multi-select 5',
            'Multi-select 6', 'Multi-select 7', 'Multi-select 8', 'Multi-select 9', 'Multi-select 10'
        ];

        function triggerHtml(placeholder) {
            return (
                '<span class="filter-multi-select__placeholder">' + placeholder + '</span>' +
                '<i class="fas fa-caret-down filter-multi-select__caret" aria-hidden="true"></i>'
            );
        }

        function closeMenus(exceptWrap) {
            card.querySelectorAll('.filter-multi-select-wrap.is-open').forEach(function (wrap) {
                if (wrap === exceptWrap) return;
                wrap.classList.remove('is-open');
                var btn = wrap.querySelector('.filter-multi-select');
                var menu = wrap.querySelector('.filter-multi-select__menu');
                if (btn) btn.setAttribute('aria-expanded', 'false');
                if (menu) menu.hidden = true;
            });
        }

        function syncGroupState(wrap) {
            var btn = wrap.querySelector('.filter-multi-select');
            var menu = wrap.querySelector('.filter-multi-select__menu');
            var group = wrap.closest('.filter-group');
            if (!btn || !menu || !group) return;
            var hasSelection = menu.querySelectorAll('.filter-multi-select__option.is-selected').length > 0;
            btn.classList.toggle('filter-multi-select--has-value', hasSelection);
            group.classList.toggle('filter-group--active', hasSelection);
        }

        function resetWrap(wrap, placeholder) {
            var btn = wrap.querySelector('.filter-multi-select');
            var menu = wrap.querySelector('.filter-multi-select__menu');
            wrap.classList.remove('is-open');
            if (btn) {
                btn.setAttribute('aria-expanded', 'false');
                btn.classList.remove('filter-multi-select--has-value');
                var ph = btn.querySelector('.filter-multi-select__placeholder');
                if (ph) ph.textContent = placeholder;
            }
            if (menu) {
                menu.hidden = true;
                menu.querySelectorAll('.filter-multi-select__option.is-selected').forEach(function (opt) {
                    opt.classList.remove('is-selected');
                    opt.setAttribute('aria-selected', 'false');
                });
            }
            syncGroupState(wrap);
        }

        function setInstrumentSubtypeEnabled(enabled) {
            if (!subtypeGroup || !subtypeFilter) return;
            var subtypeWrap = subtypeFilter.closest('.filter-multi-select-wrap');
            subtypeGroup.classList.toggle('filter-group--disabled', !enabled);
            subtypeFilter.classList.toggle('filter-multi-select--disabled', !enabled);
            subtypeFilter.disabled = !enabled;
            if (subtypeWrap) {
                resetWrap(subtypeWrap, enabled ? 'Select...' : 'Select instrument first');
            }
        }

        function resetInstrumentSubtypeFilter() {
            if (instrumentFilter) {
                var instrumentWrap = instrumentFilter.closest('.filter-multi-select-wrap');
                if (instrumentWrap) resetWrap(instrumentWrap, 'Select...');
            }
            setInstrumentSubtypeEnabled(false);
        }

        function buildMenu(wrap, btn) {
            var menu = document.createElement('div');
            menu.className = 'filter-multi-select__menu';
            menu.hidden = true;
            menu.setAttribute('role', 'listbox');
            menu.setAttribute('aria-multiselectable', 'true');

            MOCK_OPTIONS.forEach(function (label) {
                var option = document.createElement('button');
                option.type = 'button';
                option.className = 'filter-multi-select__option';
                option.setAttribute('role', 'option');
                option.setAttribute('aria-selected', 'false');
                option.textContent = label;
                option.addEventListener('click', function (e) {
                    e.stopPropagation();
                    option.classList.toggle('is-selected');
                    option.setAttribute('aria-selected', option.classList.contains('is-selected') ? 'true' : 'false');
                    syncGroupState(wrap);
                    if (btn.id === 'filter-instrument') {
                        setInstrumentSubtypeEnabled(
                            menu.querySelectorAll('.filter-multi-select__option.is-selected').length > 0
                        );
                    }
                });
                menu.appendChild(option);
            });

            wrap.appendChild(menu);

            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                if (btn.disabled) return;
                var willOpen = menu.hidden;
                closeMenus(wrap);
                menu.hidden = !willOpen;
                wrap.classList.toggle('is-open', willOpen);
                btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
            });

            menu.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }

        card.querySelectorAll('.filter-multi-select-wrap').forEach(function (wrap) {
            var btn = wrap.querySelector('.filter-multi-select');
            if (!btn) return;
            btn.innerHTML = triggerHtml(btn.disabled ? 'Select instrument first' : 'Select...');
            buildMenu(wrap, btn);
        });

        function resetFilterUI() {
            card.querySelectorAll('.filter-row .checkbox-group input[type="checkbox"]').forEach(function (cb) {
                cb.checked = false;
            });
            card.querySelectorAll('.filter-multi-select-wrap').forEach(function (wrap) {
                var btn = wrap.querySelector('.filter-multi-select');
                if (!btn || btn.id === 'filter-instrument-subtype') return;
                resetWrap(wrap, 'Select...');
            });
            closeMenus();
            resetInstrumentSubtypeFilter();
            syncTradeDateActiveState();
        }

        document.addEventListener('click', function () {
            closeMenus();
        });

        var originalClearFilters = window.clearFilters;
        if (typeof originalClearFilters === 'function') {
            window.clearFilters = function () {
                originalClearFilters.apply(this, arguments);
                resetFilterUI();
            };
        }

        resetInstrumentSubtypeFilter();
    }
})();

(function initTradesGrid() {
    const tbody = document.getElementById('data-table-body');
    const table = tbody && tbody.closest('table');
    if (!table || !table.classList.contains('trades-grid')) return;

    function formatShortNameBrackets(str) {
        if (!str) return '';
        const match = String(str).match(/^\[([^\]]+)\](.*)$/);
        if (match) {
            return `<span class="bracket">[</span><span class="short-name">${match[1]}</span><span class="bracket">]</span>${match[2]}`;
        }
        return str;
    }

    const tradesData = [
        { mId: '8806755', friendlyId: '82732', product: '[N.XH2P] PJM ATSI Zone Day Ahead On Peak', price: 55.58, quantity: 150, tenorStart: '03/16/2026', tenorEnd: '03/16/2026', tradeDate: '03/16/2026', book: '#demo', normalizedQty: 150, counterparty: '[DIRECT] Direct Energy', direction: 'Buy', trader: 'Kyle McRoberts', uom: 'MWh', status: 'locked', instrument: 'forward', tags: '#demo' },
        { mId: '8776349', friendlyId: '82650', product: '[N.AESO.HRT7X24.F] AESO Alberta RT 7x24', price: 50.00, quantity: 10, tenorStart: '03/14/2026', tenorEnd: '03/14/2026', tradeDate: '03/14/2026', book: '#demo', normalizedQty: 10, counterparty: '[TESTCP1] testcp1', direction: 'Buy', trader: 'Sameer Soleja', uom: 'MWh', status: 'locked', instrument: 'swap', tags: '#demo' },
        { mId: '6784767', friendlyId: '42678', product: '[ERCOT-N] ERCOT North Hub DA', price: 48.25, quantity: 50, tenorStart: '04/01/2026', tenorEnd: '04/30/2026', tradeDate: '03/15/2026', book: '#demo', normalizedQty: 50, counterparty: '[NYMEX] NYMEX (CME Group)', direction: 'Buy', trader: 'Manvendra Singh', uom: 'MWh', status: 'locked', instrument: 'swap', tags: '#demo' },
        { mId: '8804887', friendlyId: '82501', product: '[PJM-W] PJM Western Hub DA', price: 52.10, quantity: 100, tenorStart: '03/17/2026', tenorEnd: '03/17/2026', tradeDate: '03/16/2026', book: '#demo', normalizedQty: 100, counterparty: '[DIRECT] Direct Energy', direction: 'Sell', trader: 'Kyle McRoberts', uom: 'MWh', status: 'locked', instrument: 'forward', tags: '#demo' },
        { mId: '8643809', friendlyId: '81902', product: '[CAISO-SP15] CAISO SP15', price: '', quantity: 25, tenorStart: '05/01/2026', tenorEnd: '05/31/2026', tradeDate: '03/14/2026', book: '#demo', normalizedQty: 25, counterparty: '[TESTCP1] testcp1', direction: 'Buy', trader: 'Sameer Soleja', uom: 'MW', status: 'locked', instrument: 'swap', tags: '#demo' },
        { mId: '8623420', friendlyId: '81765', product: '[MISO-IN] MISO Indiana Hub', price: 45.75, quantity: 75, tenorStart: '03/20/2026', tenorEnd: '03/20/2026', tradeDate: '03/15/2026', book: '#demo', normalizedQty: 75, counterparty: '[DIRECT] Direct Energy', direction: 'Buy', trader: 'Manvendra Singh', uom: 'MWh', status: 'locked', instrument: 'forward', tags: '#demo' },
        { mId: '6784172', friendlyId: '42500', product: '[NYISO-Z-A] NYISO Zone A DA', price: 58.00, quantity: 200, tenorStart: '06/01/2026', tenorEnd: '06/30/2026', tradeDate: '03/16/2026', book: '#demo', normalizedQty: 200, counterparty: '[NYMEX] NYMEX (CME Group)', direction: 'Buy', trader: 'Kyle McRoberts', uom: 'MWh', status: 'locked', instrument: 'swap', tags: '#demo' },
        { mId: '8551234', friendlyId: '81000', product: '[ERCOT-S] ERCOT South Hub DA', price: 42.30, quantity: 30, tenorStart: '03/18/2026', tenorEnd: '03/18/2026', tradeDate: '03/14/2026', book: '#demo', normalizedQty: 30, counterparty: '[TESTCP1] testcp1', direction: 'Sell', trader: 'Sameer Soleja', uom: 'MWh', status: 'locked', instrument: 'forward', tags: '#demo' },
        { mId: '8489012', friendlyId: '80234', product: '[SPP-NORTH] SPP North Hub', price: 38.90, quantity: 80, tenorStart: '04/15/2026', tenorEnd: '04/15/2026', tradeDate: '03/15/2026', book: '#demo', normalizedQty: 80, counterparty: '[DIRECT] Direct Energy', direction: 'Buy', trader: 'Manvendra Singh', uom: 'MWh', status: 'locked', instrument: 'swap', tags: '#demo' },
        { mId: '8415678', friendlyId: '79500', product: '[ISONE-MA] ISO-NE Mass Hub DA', price: 62.15, quantity: 40, tenorStart: '03/19/2026', tenorEnd: '03/19/2026', tradeDate: '03/16/2026', book: '#demo', normalizedQty: 40, counterparty: '[NYMEX] NYMEX (CME Group)', direction: 'Buy', trader: 'Kyle McRoberts', uom: 'MWh', status: 'locked', instrument: 'forward', tags: '#demo' },
    ];

    function populateTradeSummary(trade) {
        const summaryMeta = document.getElementById('trade-summary-meta');
        if (!summaryMeta) return;
        const parts = [];
        if (trade.price !== '' && trade.price != null) parts.push('Price ' + trade.price);
        if (trade.quantity != null) parts.push('Qty ' + trade.quantity);
        if (trade.tenorStart) parts.push(trade.tenorStart + ' – ' + (trade.tenorEnd || ''));
        if (trade.counterparty) parts.push(trade.counterparty);
        if (trade.direction) parts.push(trade.direction);
        if (trade.trader) parts.push(trade.trader);
        if (trade.uom) parts.push(trade.uom);
        if (trade.status) parts.push(trade.status);
        if (trade.instrument) parts.push(trade.instrument);
        if (trade.book) parts.push(trade.book);
        summaryMeta.innerHTML = parts.join(' • ');
    }

    const originalShowProductDetail = window.showProductDetail;
    if (typeof originalShowProductDetail === 'function') {
        window.showProductDetail = function (index, needsAttention) {
            if (!document.body.classList.contains('trades-page')) {
                originalShowProductDetail(index, needsAttention);
                return;
            }
            const trade = tradesData[index % tradesData.length];
            const panel = document.getElementById('detail-panel');
            const titleEl = document.getElementById('detail-panel-title');
            const tableWrapper = document.querySelector('.table-wrapper');
            if (typeof clearSelection === 'function') clearSelection();
            const filterPanelToHide = document.querySelector('.filter-panel');
            if (filterPanelToHide) filterPanelToHide.classList.add('hidden');
            document.querySelectorAll('#data-table-body tr').forEach(tr => tr.classList.remove('selected'));
            const selectedRow = document.querySelector(`#data-table-body tr[data-index="${index}"]`);
            if (selectedRow) selectedRow.classList.add('selected');
            if (titleEl && trade) titleEl.innerHTML = formatShortNameBrackets(trade.product);
            if (trade) populateTradeSummary(trade);
            setTimeout(function () {
                if (panel) panel.classList.remove('hidden');
                if (tableWrapper) tableWrapper.style.width = '25%';
                const panelResizeHandle = document.getElementById('panel-resize-handle');
                if (panelResizeHandle) panelResizeHandle.style.display = 'flex';
                const contentBottom = document.querySelector('.content-bottom');
                if (contentBottom) contentBottom.classList.add('panel-visible');
            }, 100);
        };
    }

    const originalPopulateTable = window.populateTable;
    if (typeof originalPopulateTable !== 'function') return;

    window.populateTable = function () {
        const tbodyEl = document.getElementById('data-table-body');
        if (!tbodyEl) return;
        tbodyEl.innerHTML = '';

        const rowCount = 100;
        for (let i = 0; i < rowCount; i++) {
            const dataIndex = i % tradesData.length;
            const row = tradesData[dataIndex];
            const tr = document.createElement('tr');
            tr.dataset.index = i;

            const priceCell = row.price === '' ? '' : String(row.price);
            tr.innerHTML = `
                <td class="trades-col-menu" onclick="event.stopPropagation()">
                    <div class="te-row-menu-wrap">
                        <button type="button" class="trades-row-menu-btn" aria-label="Row actions" aria-expanded="false" aria-haspopup="true" onclick="teRowMenuToggle(event, this)"><i class="fas fa-ellipsis-vertical"></i></button>
                        <div class="te-row-menu-dropdown" role="menu">
                            <a role="menuitem" class="action-btn" href="trade-edit.html?id=${row.friendlyId}">Edit</a>
                        </div>
                    </div>
                </td>
                <td class="trades-col-checkbox">
                    <input type="checkbox" class="row-checkbox" onchange="toggleRowSelection(${i}, this.checked)">
                </td>
                <td class="trades-cell-id">${row.mId}</td>
                <td class="trades-cell-id">${row.friendlyId}</td>
                <td><span class="product-link">${formatShortNameBrackets(row.product)}</span></td>
                <td class="trades-col-num">${priceCell}</td>
                <td class="trades-col-num">${row.quantity}</td>
                <td class="trades-col-date">${row.tenorStart}</td>
                <td class="trades-col-date">${row.tenorEnd}</td>
                <td class="trades-col-date">${row.tradeDate}</td>
                <td>${row.book}</td>
                <td class="trades-col-num">${row.normalizedQty}</td>
                <td>${formatShortNameBrackets(row.counterparty)}</td>
                <td>${row.direction}</td>
                <td>${row.trader}</td>
                <td>${row.uom}</td>
                <td>${row.status}</td>
                <td>${row.instrument}</td>
                <td>${row.tags}</td>
            `;

            tr.addEventListener('click', function (e) {
                if (e.target.closest('.te-row-menu-wrap') || e.target.closest('.trades-row-menu-btn') || e.target.type === 'checkbox' || e.target.closest('.row-checkbox')) return;
                if (typeof showProductDetail === 'function') showProductDetail(i);
            });

            tbodyEl.appendChild(tr);
        }

        if (typeof updateSelectAllCheckbox === 'function') updateSelectAllCheckbox();
    };

    populateTable();
})();

function teRowMenuToggle(event, btn) {
    event.stopPropagation();
    var wrap = btn.closest('.te-row-menu-wrap');
    if (!wrap) return;
    var wasOpen = wrap.classList.contains('is-open');
    document.querySelectorAll('.te-row-menu-wrap.is-open').forEach(function (w) {
        w.classList.remove('is-open');
        var b = w.querySelector('.trades-row-menu-btn');
        if (b) b.setAttribute('aria-expanded', 'false');
    });
    if (!wasOpen) {
        wrap.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
    }
}

document.addEventListener('click', function (e) {
    if (e.target.closest('.te-row-menu-wrap')) return;
    document.querySelectorAll('.te-row-menu-wrap.is-open').forEach(function (w) {
        w.classList.remove('is-open');
        var b = w.querySelector('.trades-row-menu-btn');
        if (b) b.setAttribute('aria-expanded', 'false');
    });
});
