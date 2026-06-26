/**
 * Trade Edit — Audit tab: version cards styled like Mirage Audit History modal.
 */
(function () {
    'use strict';

    var STEPWISE_EVENT = 'Created by Stepwise Logic';
    var IGNORED_FIELDS = {
        id: true,
        account_id: true,
        created_at: true,
        updated_at: true,
        last_modified_at: true,
        last_modified_by_id: true
    };
    var SENSITIVE_FIELD = /password|token|secret/i;

    var USERS = {
        jane: { id: '9618530', name: 'Jane Doe' }
    };

    var TRADE_HISTORY = [
        {
            event: 'create',
            created_at: '2026-05-21T04:15:18.979-05:00',
            whodunnit: null,
            changes: {
                extended_price_2: [0.0, 55.58],
                formula_price_id: [null, 3404202],
                marking_product_id: [null, 365061]
            }
        },
        {
            event: STEPWISE_EVENT,
            created_at: '2026-05-21T04:15:19.003-05:00',
            whodunnit: null,
            stepwise: true,
            changes: {
                account_id: [null, 305],
                aggregatable: [true, false],
                book: [null, '#demo'],
                business_day_convention: [null, 'Modified Following'],
                counterparty_id: [null, 1067],
                created_by: [null, 'Jane Doe'],
                deal_type: [null, 'swap'],
                extended_price_2: [0.0, 55.58],
                fixed_day_count_fraction: [null, 'Actual/360'],
                float_day_count_fraction: [null, 'Actual/360'],
                formula_price_id: [null, 3404202],
                frequency: [null, 'monthly'],
                friendly_id: [null, '83273'],
                initial_rate: [null, '0.0'],
                last_modified_at: [null, '2026-02-18T09:19:04.285Z'],
                last_modified_by_id: [null, 9618530],
                marking_product_id: [null, 365061],
                normalized_quantity_type: [null, 'MW per hour'],
                origin: [null, 'Experimental Energy'],
                origin_entity_id: [null, 1352],
                owner_id: [null, 799],
                pricing_type: ['static', 'formula'],
                product_id: [null, 178073],
                product_short_name: [null, 'M.AESO.HRT7X24.F'],
                quantity: [null, '150.0'],
                quantity_type: ['contract', 'unit'],
                tas_adjustment: ['0.0', null],
                trade_date: [null, '2026-05-28'],
                tenor_end: [null, '2026-06-30'],
                tenor_start: [null, '2026-06-01'],
                workflow_status_name: ['', 'New']
            }
        },
        {
            event: 'create',
            created_at: '2026-06-04T08:27:46.293-05:00',
            whodunnit: USERS.jane.id,
            changes: {
                account_id: [null, 305],
                aggregatable: [true, false],
                book: [null, '#demo'],
                business_day_convention: [null, 'Modified Following'],
                call_put: ['none', 'call'],
                counterparty_id: [null, 1067],
                created_by: [null, 'Jane Doe'],
                deal_type: [null, 'swap'],
                extended_price_2: [null, '0.0'],
                fixed_day_count_fraction: [null, 'Actual/360'],
                float_day_count_fraction: [null, 'Actual/360'],
                formula_price_id: [null, 3404202],
                frequency: [null, 'monthly'],
                friendly_id: [null, '83273'],
                initial_rate: [null, '0.0'],
                last_modified_at: [null, '2026-06-04T13:27:46.293Z'],
                last_modified_by_id: [null, 9618530],
                locked_at: [null, '2026-06-04T13:27:46.000Z'],
                marking_product_id: [null, 365061],
                normalized_quantity: [null, '6.25'],
                normalized_quantity_type: [null, 'MW per hour'],
                origin: [null, 'Experimental Energy'],
                origin_entity_id: [null, 1352],
                owner_id: [null, 799],
                pricing_type: ['static', 'formula'],
                product_id: [null, 178073],
                product_short_name: [null, 'M.XH2P'],
                quantity: [null, '150.0'],
                quantity_type: ['contract', 'unit'],
                tas_adjustment: ['0.0', null],
                tenor_end_at: [null, '2026-06-04T04:00:00.000Z'],
                trade_date: [null, '2026-06-04'],
                workflow_status_name: ['', 'New']
            }
        },
        {
            event: 'update',
            created_at: '2026-06-04T08:27:58.679-05:00',
            whodunnit: USERS.jane.id,
            changes: {
                last_modified_at: ['2026-06-04T13:27:46.293Z', '2026-06-04T13:27:58.679Z'],
                trade_date: ['2026-06-04', '2026-06-02']
            }
        },
        {
            event: 'update',
            created_at: '2026-06-04T08:28:22.104-05:00',
            whodunnit: USERS.jane.id,
            changes: {
                extended_price_2: ['0.0', '0.5'],
                last_modified_at: ['2026-06-04T13:27:58.679Z', '2026-06-04T13:28:22.104Z']
            }
        }
    ];

    var MOLECULE_LOGO_SRC = (function () {
        var P = typeof window !== 'undefined' && window.__APP_PATH;
        var prefix = P && typeof P.rootPrefix === 'function' ? P.rootPrefix() : '../';
        return prefix + 'images/mol-methane-red-RGB.svg';
    })();

    var EMPTY_STATE_HTML = '<p class="te-audit-empty">No version history found for this trade.</p>';

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function fieldLabel(key) {
        return key.split('_').map(function (part) {
            if (!part) return part;
            return part.charAt(0).toUpperCase() + part.slice(1);
        }).join(' ');
    }

    function eventLabel(event) {
        if (event === 'create') return 'Created';
        if (event === 'update') return 'Updated';
        if (event === 'destroy') return 'Destroyed';
        return event;
    }

    function ignoreChange(field) {
        return IGNORED_FIELDS[field] || SENSITIVE_FIELD.test(field);
    }

    function isIsoDate(value) {
        return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
    }

    function isIsoDateTime(value) {
        return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value);
    }

    function formatAuditTimestamp(iso) {
        if (!iso) return '';
        var d = new Date(iso);
        if (isNaN(d.getTime())) return String(iso);
        return d.toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    function formatDisplayValue(field, value) {
        if (value == null || value === '') return '';
        var text = String(value);

        if (field.slice(-3) === '_at' || isIsoDateTime(text)) {
            return formatAuditTimestamp(text) || text;
        }

        if (isIsoDate(text)) {
            var d = new Date(text + 'T12:00:00');
            if (!isNaN(d.getTime())) {
                return d.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
            }
        }

        return text;
    }

    function isEmptyChangeValue(value) {
        return value == null || value === '' || (typeof value === 'string' && value.trim() === '');
    }

    function flattenCustomFieldChanges(changes) {
        var pairs = changes.custom_field_values;
        if (!pairs || !pairs.length) return [];

        var old = pairs[0] || {};
        var cur = pairs[1] || pairs[0] || {};
        var keys = Object.keys(cur);
        var rows = [];

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (old[key] != cur[key]) {
                rows.push({ field: key, values: [old[key], cur[key]] });
            }
        }
        return rows;
    }

    function sortedChangeRows(changes) {
        var copy = Object.assign({}, changes || {});
        var customRows = flattenCustomFieldChanges(copy);
        delete copy.custom_field_values;

        var rows = [];
        var keys = Object.keys(copy).sort();

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (!ignoreChange(key)) {
                rows.push({ field: key, values: copy[key] });
            }
        }

        rows = rows.concat(customRows);
        rows.sort(function (a, b) {
            return fieldLabel(a.field).localeCompare(fieldLabel(b.field));
        });
        return rows;
    }

    function resolveUser(whodunnitId) {
        if (!whodunnitId) return null;
        if (whodunnitId === USERS.jane.id) return USERS.jane;
        return { id: whodunnitId, name: 'User ' + whodunnitId };
    }

    function isStepwise(entry) {
        return entry.stepwise || entry.event === STEPWISE_EVENT;
    }

    function isMoleculeActor(entry, user) {
        return isStepwise(entry) || !user || !user.name;
    }

    function renderValueSpan(className, rawValue, field) {
        if (isEmptyChangeValue(rawValue)) {
            if (className === 'te-audit-old') {
                return '<span class="te-audit-old te-audit-old--empty" aria-hidden="true">—</span>';
            }
            return '<span class="' + className + '"></span>';
        }

        var raw = String(rawValue);
        var display = formatDisplayValue(field, rawValue);
        return '<span class="' + className + '" title="' + escapeHtml(raw) + '">' + escapeHtml(display) + '</span>';
    }

    function renderChangeRow(row) {
        return '<tr>'
            + '<td class="te-audit-field">' + escapeHtml(fieldLabel(row.field)) + '</td>'
            + '<td class="te-audit-values">'
            + '<div class="te-audit-values-inner">'
            + renderValueSpan('te-audit-old', row.values[0], row.field)
            + '<span class="te-audit-change-arrow" aria-hidden="true"><i class="fa fa-arrow-right"></i></span>'
            + renderValueSpan('te-audit-new', row.values[1], row.field)
            + '</div>'
            + '</td>'
            + '</tr>';
    }

    function renderCardIcon(entry, user) {
        if (isMoleculeActor(entry, user)) {
            return '<img class="te-audit-icon te-audit-icon--molecule" src="' + escapeHtml(MOLECULE_LOGO_SRC) + '" alt="" width="18" height="18" aria-hidden="true">';
        }
        return '<i class="fa fa-circle-user te-audit-icon" aria-hidden="true"></i>';
    }

    function renderActorName(entry, user) {
        if (isStepwise(entry)) {
            return 'Molecule <em>via Stepwise</em>';
        }
        return escapeHtml(user && user.name ? user.name : 'Molecule');
    }

    function renderCard(entry, rows) {
        var user = resolveUser(entry.whodunnit);
        var createdAt = entry.created_at;

        return '<div class="content-card te-audit-card">'
            + '<div class="card-header te-audit-card-header">'
            + '<div class="card-title te-audit-card-title">'
            + renderCardIcon(entry, user)
            + '<span class="te-audit-user-name">' + renderActorName(entry, user) + '</span>'
            + '</div>'
            + '<div class="te-audit-meta">'
            + '<span class="te-audit-action">' + escapeHtml(eventLabel(entry.event)) + '</span> '
            + '<time class="te-audit-timestamp" datetime="' + escapeHtml(createdAt) + '" title="' + escapeHtml(createdAt) + '">'
            + escapeHtml(formatAuditTimestamp(createdAt))
            + '</time>'
            + '</div>'
            + '</div>'
            + '<div class="card-body te-audit-card-body">'
            + '<table class="data-table te-audit-table">'
            + '<colgroup><col class="te-audit-col-field"><col class="te-audit-col-values"></colgroup>'
            + '<tbody>' + rows.map(renderChangeRow).join('') + '</tbody>'
            + '</table>'
            + '</div>'
            + '</div>';
    }

    function renderThread(histories) {
        if (!histories.length) return EMPTY_STATE_HTML;

        var html = '';
        for (var i = histories.length - 1; i >= 0; i--) {
            var entry = histories[i];
            var rows = sortedChangeRows(entry.changes);
            if (!rows.length) continue;
            html += renderCard(entry, rows);
        }

        return html || EMPTY_STATE_HTML;
    }

    function init() {
        var root = document.getElementById('te-audit-thread');
        if (!root) return;
        root.innerHTML = renderThread(TRADE_HISTORY);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
