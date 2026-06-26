/**
 * Trade Edit — Source tab: trade capture message history (mock).
 * Vapor only shows this for exchange-sourced trades; mockup always renders for #Demo review.
 */
(function () {
    'use strict';

    var COPY_FEEDBACK_MS = 2500;
    var FULL_PAYLOAD_TAG = 'Full Payload';

    var SECTIONS = [
        { title: 'Capture Reports', messageKey: 'message', expandFirst: true },
        {
            title: 'Full Payload',
            messageKey: 'fullHistoryMessage',
            tag: FULL_PAYLOAD_TAG,
            include: function (item) { return item.fullHistoryMessage; }
        }
    ];

    var MESSAGE_HISTORIES = [
        {
            id: 88421,
            message: {
                fillId: 88421,
                source: 'ISO-NE',
                messageType: 'TradeCaptureReport',
                symbol: 'M.XH2P',
                side: 'Buy',
                quantity: 150,
                unit: 'MWh',
                price: 42.5,
                book: '#demo',
                tradeDate: '2026-05-28',
                counterparty: 'DIRECT',
                tenorStart: '2026-06-01',
                tenorEnd: '2026-06-30'
            },
            fullHistoryMessage: {
                fillId: 88421,
                source: 'ISO-NE',
                messageType: 'TradeCaptureReport',
                receivedAt: '2026-05-28T08:14:02.331-04:00',
                routingKey: 'capture.iso-ne.day-ahead',
                headers: {
                    account: 'DEMO-ACCT',
                    session: 'RTH-20260528'
                },
                payload: {
                    symbol: 'M.XH2P',
                    side: 'Buy',
                    quantity: 150,
                    unit: 'MWh',
                    price: 42.5,
                    book: '#demo',
                    tradeDate: '2026-05-28',
                    counterparty: 'DIRECT',
                    tenorStart: '2026-06-01',
                    tenorEnd: '2026-06-30',
                    legs: [
                        { contractDay: '2026-06-01', quantity: 5.0 },
                        { contractDay: '2026-06-02', quantity: 5.0 }
                    ]
                }
            }
        },
        {
            id: 88422,
            message: {
                fillId: 88422,
                source: 'ISO-NE',
                messageType: 'TradeCaptureReportAmend',
                symbol: 'M.XH2P',
                side: 'Buy',
                quantity: 150,
                unit: 'MWh',
                price: 42.5,
                book: '#demo',
                amendReason: 'Counterparty confirm'
            }
        }
    ];

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function prettyJson(value) {
        try {
            return JSON.stringify(value, null, 2);
        } catch (e) {
            return String(value);
        }
    }

    function highlightJson(value) {
        var code = prettyJson(value);

        if (window.hljs) {
            try {
                return window.hljs.highlight(code, { language: 'json' }).value;
            } catch (e) { /* fall through */ }
        }

        return escapeHtml(code);
    }

    function renderCodeBlock(value) {
        return '<pre class="te-source-code"><code class="language-json">' + highlightJson(value) + '</code></pre>';
    }

    function renderPanelTitle(item, tag) {
        var tagHtml = tag ? ' <span class="te-source-panel-tag">' + escapeHtml(tag) + '</span>' : '';
        return '<span class="te-source-panel-label">Fill ID:</span> ' + escapeHtml(item.id) + tagHtml;
    }

    function renderPanel(item, section, index) {
        var messageKey = section.messageKey;
        var panelId = 'te-source-panel-' + messageKey + '-' + item.id;
        var expanded = !!(section.expandFirst && index === 0);
        var collapsed = expanded ? '' : ' te-source-panel-card--collapsed';

        return ''
            + '<div class="content-card te-source-panel-card' + collapsed + '">'
            + '<div class="card-header te-source-panel-header">'
            + '<button type="button" class="te-source-panel-toggle" aria-expanded="' + expanded + '" aria-controls="' + panelId + '">'
            + '<i class="fas fa-chevron-down te-source-panel-chevron" aria-hidden="true"></i>'
            + '</button>'
            + '<div class="card-title te-source-panel-title">' + renderPanelTitle(item, section.tag) + '</div>'
            + '<div class="card-actions action-toolbar te-source-panel-actions">'
            + '<button type="button" class="action-btn te-source-copy-btn" aria-label="Copy to clipboard">Copy</button>'
            + '</div>'
            + '</div>'
            + '<div class="card-body te-source-panel-body" id="' + panelId + '">'
            + renderCodeBlock(item[messageKey])
            + '</div>'
            + '</div>';
    }

    function sectionItems(section) {
        return section.include
            ? MESSAGE_HISTORIES.filter(section.include)
            : MESSAGE_HISTORIES;
    }

    function renderSection(section) {
        var items = sectionItems(section);
        if (!items.length) return '';

        return ''
            + '<section class="te-source-section">'
            + '<h2 class="te-source-section-title">' + escapeHtml(section.title) + '</h2>'
            + '<div class="te-source-panels">'
            + items.map(function (item, index) { return renderPanel(item, section, index); }).join('')
            + '</div>'
            + '</section>';
    }

    function renderSource() {
        return SECTIONS.map(renderSection).join('');
    }

    function togglePanel(card) {
        var toggle = card.querySelector('.te-source-panel-toggle');
        var collapsed = card.classList.toggle('te-source-panel-card--collapsed');
        if (toggle) toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    }

    function showCopyFeedback(btn) {
        if (btn.classList.contains('te-source-copy-btn--copied')) return;

        btn.classList.add('te-source-copy-btn--copied');
        btn.textContent = 'Copied';
        btn.setAttribute('aria-label', 'Copied to clipboard');

        window.setTimeout(function () {
            btn.classList.remove('te-source-copy-btn--copied');
            btn.textContent = 'Copy';
            btn.setAttribute('aria-label', 'Copy to clipboard');
        }, COPY_FEEDBACK_MS);
    }

    function legacyCopy(text, btn) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.cssText = 'position:absolute;left:-9999px';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            if (document.execCommand('copy')) showCopyFeedback(btn);
        } catch (e) { /* ignore */ }

        document.body.removeChild(textarea);
    }

    function copyPanelCode(btn) {
        var codeEl = btn.closest('.te-source-panel-card').querySelector('.te-source-code code');
        var text = codeEl ? codeEl.textContent : '';
        if (!text) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
                showCopyFeedback(btn);
            }).catch(function () {
                legacyCopy(text, btn);
            });
            return;
        }

        legacyCopy(text, btn);
    }

    function bindInteractions(root) {
        root.addEventListener('click', function (event) {
            var toggle = event.target.closest('.te-source-panel-toggle');
            if (toggle) {
                var card = toggle.closest('.te-source-panel-card');
                if (card) togglePanel(card);
                return;
            }

            var copyBtn = event.target.closest('.te-source-copy-btn');
            if (copyBtn) copyPanelCode(copyBtn);
        });
    }

    function init() {
        var root = document.getElementById('te-source-root');
        if (!root) return;
        root.innerHTML = renderSource();
        bindInteractions(root);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
