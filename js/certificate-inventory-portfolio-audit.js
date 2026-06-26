/**
 * Certificate Inventory — Portfolio View Audit modal (Trade Edit audit tab pattern).
 */
(function () {
  'use strict';

  var STEPWISE_EVENT = 'Created by Stepwise Logic';
  var USERS = {
    jane: { id: '9618530', name: 'Jane Doe' },
    marco: { id: '8821044', name: 'Marco Reyes' }
  };

  var MOLECULE_LOGO_SRC = (function () {
    var P = typeof window !== 'undefined' && window.__APP_PATH;
    var prefix = P && typeof P.rootPrefix === 'function' ? P.rootPrefix() : '../';
    return prefix + 'images/mol-methane-red-RGB.svg';
  })();

  var EMPTY_STATE_HTML = '<p class="te-audit-empty">No version history found for this certificate.</p>';

  function fieldLabel(key) {
    var labels = {
      serial: 'Serial Number',
      registry: 'Registry',
      vintage: 'Vintage',
      technology: 'Technology',
      state: 'State',
      status: 'Status',
      volume: 'Volume (MWh)',
      cost_basis: 'Cost Basis ($/MWh)',
      mark: 'Mark ($/MWh)',
      linked_trade: 'Linked Trade',
      linked_subleg: 'Linked Subleg'
    };
    if (labels[key]) return labels[key];
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

  function isEmptyChangeValue(value) {
    return value == null || value === '' || (typeof value === 'string' && value.trim() === '');
  }

  function isStepwise(entry) {
    return entry.stepwise || entry.event === STEPWISE_EVENT;
  }

  function resolveUser(whodunnitId) {
    if (!whodunnitId) return null;
    if (whodunnitId === USERS.jane.id) return USERS.jane;
    if (whodunnitId === USERS.marco.id) return USERS.marco;
    return { id: whodunnitId, name: 'User ' + whodunnitId };
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
    return '<span class="' + className + '" title="' + ciEscapeHtml(raw) + '">' + ciEscapeHtml(raw) + '</span>';
  }

  function renderChangeRow(row) {
    return '<tr>'
      + '<td class="te-audit-field">' + ciEscapeHtml(fieldLabel(row.field)) + '</td>'
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
      return '<img class="te-audit-icon te-audit-icon--molecule" src="' + ciEscapeHtml(MOLECULE_LOGO_SRC) + '" alt="" width="18" height="18" aria-hidden="true">';
    }
    return '<i class="fa fa-circle-user te-audit-icon" aria-hidden="true"></i>';
  }

  function renderActorName(entry, user) {
    if (isStepwise(entry)) {
      return 'Molecule <em>via Innovo Sync</em>';
    }
    return ciEscapeHtml(user && user.name ? user.name : 'Molecule');
  }

  function sortedChangeRows(changes) {
    var rows = [];
    var keys = Object.keys(changes || {}).sort();
    keys.forEach(function (key) {
      var pair = changes[key];
      if (!pair || pair.length < 2) return;
      if (isEmptyChangeValue(pair[0]) && isEmptyChangeValue(pair[1])) return;
      rows.push({ field: key, values: pair });
    });
    rows.sort(function (a, b) {
      return fieldLabel(a.field).localeCompare(fieldLabel(b.field));
    });
    return rows;
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
      + '<span class="te-audit-action">' + ciEscapeHtml(eventLabel(entry.event)) + '</span> '
      + '<time class="te-audit-timestamp" datetime="' + ciEscapeHtml(createdAt) + '" title="' + ciEscapeHtml(createdAt) + '">'
      + ciEscapeHtml(formatAuditTimestamp(createdAt))
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

  function ciCertAuditHistoryFor(cert) {
    if (!cert) return [];

    var history = [
      {
        event: 'create',
        created_at: '2026-05-12T09:04:33.000-05:00',
        whodunnit: null,
        stepwise: true,
        changes: {
          serial: [null, cert.serial],
          registry: [null, cert.registry === '—' ? '—' : cert.registry],
          vintage: [null, cert.vintage],
          technology: [null, cert.technology],
          state: [null, cert.state],
          status: [null, 'Available'],
          volume: [null, cert.volume != null ? cert.volume.toFixed(2) : null],
          cost_basis: [null, cert.costBasis != null ? String(cert.costBasis) : null]
        }
      }
    ];

    if (cert.status === 'Exception') {
      history.unshift({
        event: 'update',
        created_at: '2026-05-19T11:18:02.000-05:00',
        whodunnit: USERS.marco.id,
        changes: {
          status: ['Available', 'Exception']
        }
      });
    } else if (cert.status === 'Allocated' && cert.linkedTrade) {
      history.unshift({
        event: 'update',
        created_at: '2026-05-18T14:22:10.000-05:00',
        whodunnit: USERS.jane.id,
        changes: {
          status: ['Available', 'Allocated'],
          linked_trade: [null, cert.linkedTrade],
          linked_subleg: [null, cert.linkedSubleg || cert.linkedTrade]
        }
      });
    } else if (cert.status === 'Retired') {
      history.unshift({
        event: 'update',
        created_at: '2026-04-02T16:45:00.000-05:00',
        whodunnit: USERS.jane.id,
        changes: {
          status: ['Allocated', 'Retired']
        }
      });
    } else if (cert.mark != null && cert.status === 'Available') {
      history.unshift({
        event: 'update',
        created_at: '2026-05-15T08:30:00.000-05:00',
        whodunnit: USERS.jane.id,
        changes: {
          mark: [null, String(cert.mark)]
        }
      });
    }

    return history;
  }

  function ciCertAuditClose() {
    var overlay = document.getElementById('ci-cert-audit-modal');
    if (!overlay) return;
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function ciCertAuditOpen(cert) {
    var overlay = document.getElementById('ci-cert-audit-modal');
    var thread = document.getElementById('ci-cert-audit-thread');
    var serialEl = document.getElementById('ci-cert-audit-serial');
    if (!overlay || !thread || !cert) return;

    if (serialEl) {
      if (cert.serial) {
        serialEl.textContent = cert.serial;
        serialEl.hidden = false;
      } else {
        serialEl.textContent = '';
        serialEl.hidden = true;
      }
    }

    thread.innerHTML = renderThread(ciCertAuditHistoryFor(cert));
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function initCiCertAuditModal() {
    var overlay = document.getElementById('ci-cert-audit-modal');
    if (!overlay) return;

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) ciCertAuditClose();
    });

    overlay.querySelectorAll('[data-ci-audit-close]').forEach(function (btn) {
      btn.addEventListener('click', ciCertAuditClose);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay && !overlay.hidden) ciCertAuditClose();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCiCertAuditModal);
  } else {
    initCiCertAuditModal();
  }

  window.ciCertAuditOpen = ciCertAuditOpen;
})();
