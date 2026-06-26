/**
 * Trade Edit page — reads ?id= from URL for title; Legs tab is default.
 */
(function () {
    'use strict';

    var TRADES = {
        '83273': {
            friendlyId: '83273',
            mId: '9205695',
            direction: 'Buy',
            quantity: '150 MWh',
            productShort: 'M.XH2P',
            productLong: 'PJM ATSI Zone Day Ahead On Peak Hourly Forward',
            counterpartyShort: 'DIRECT',
            counterpartyLong: 'Direct Energy',
            narrativeDate: '05/28/2026',
            tradeDate: '05/28/2026',
            book: '#Demo',
            locked: true
        },
        '82732': {
            friendlyId: '82732',
            mId: '8806755',
            direction: 'Buy',
            quantity: '150 MWh',
            productShort: 'N.XH2P',
            productLong: 'PJM ATSI Zone Day Ahead On Peak',
            counterpartyShort: 'DIRECT',
            counterpartyLong: 'Direct Energy',
            narrativeDate: '03/16/2026',
            tradeDate: '03/16/2026',
            book: '#Demo',
            locked: true
        }
    };

    function getTradeId() {
        var params = new URLSearchParams(window.location.search);
        return params.get('id') || '83273';
    }

    function setText(id, value) {
        var el = document.getElementById(id);
        if (el && value != null) el.textContent = value;
    }

    function syncTradeBook(book) {
        if (!book) return;

        var tags = document.querySelectorAll('.trade-edit-quick-view__type-tag');
        for (var i = 0; i < tags.length; i++) {
            var text = String(tags[i].textContent || '').trim();
            if (text.charAt(0) === '#') {
                tags[i].textContent = book;
                break;
            }
        }

        setText('te-transfer-current-book', book);
    }

    function init() {
        var id = getTradeId();
        var trade = TRADES[id] || Object.assign({}, TRADES['83273'], { friendlyId: id });

        setText('te-trade-id', trade.friendlyId);
        setText('te-meta-mid', trade.mId);
        setText('te-narrative-direction', trade.direction);
        setText('te-narrative-quantity', trade.quantity);
        setText('te-product-short', trade.productShort);
        setText('te-product-long', trade.productLong);
        setText('te-counterparty-short', trade.counterpartyShort);
        setText('te-counterparty-long', trade.counterpartyLong);
        setText('te-narrative-date', trade.narrativeDate);
        setText('te-trade-date', trade.tradeDate);
        syncTradeBook(trade.book);

        var lockEl = document.querySelector('.trade-edit-quick-view__narrative-lock-icon');
        if (lockEl) lockEl.hidden = !trade.locked;

        document.title = 'Trade ' + trade.friendlyId;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
