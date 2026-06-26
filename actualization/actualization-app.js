/**
 * Actualization mockup interactions.
 */
(function () {
  'use strict';

var MAP_PDF = 'NGPL_FERC_Web_Map.pdf?v=2';

var MAP_CONFIGS = {
  ngpl: {
    ferc:     { src: MAP_PDF, title: 'NGPL — FERC System Map' },
    receipt:  { src: MAP_PDF, title: 'NGPL — Receipt Points' },
    delivery: { src: MAP_PDF, title: 'NGPL — Delivery Points' }
  }
};

window.updateMap = function updateMap() {
  var pipeline = document.getElementById('map-pipeline-select').value;
  var mapType  = document.getElementById('map-type-select').value;
  var openBtn = document.getElementById('map-open-btn');
  var cfg = MAP_CONFIGS[pipeline] && MAP_CONFIGS[pipeline][mapType];
  if(!cfg) {
    document.getElementById('map-iframe').src = '';
    document.getElementById('map-card-title').textContent = pipeline.toUpperCase() + ' — Map not yet configured';
    if (openBtn) {
      openBtn.disabled = true;
      openBtn.dataset.pdfSrc = '';
    }
    return;
  }
  document.getElementById('map-iframe').src = cfg.src;
  document.getElementById('map-card-title').textContent = cfg.title;
  if (openBtn) {
    openBtn.disabled = false;
    openBtn.dataset.pdfSrc = cfg.src;
  }
};

window.openMapPdf = function openMapPdf() {
  var openBtn = document.getElementById('map-open-btn');
  var src = openBtn && openBtn.dataset.pdfSrc;
  if (src) window.open(src, '_blank', 'noopener,noreferrer');
};

function actNomExpandChevronPath(expanded) {
  return expanded ? 'M6 9l6 6 6-6' : 'M9 18l6-6-6-6';
}

window.toggleLoc = function toggleLoc(id) {
  var detail = document.getElementById('detail-' + id);
  var toggle = document.getElementById('icon-' + id);
  if (!detail || !toggle) return;
  var row = toggle.closest('tr');
  var expanded = detail.hidden;
  detail.hidden = !expanded;
  if (row) row.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  var path = toggle.querySelector('.act-nom-expand-chevron path');
  if (path) path.setAttribute('d', actNomExpandChevronPath(expanded));
}

window.toggleAlloc = function toggleAlloc(id) {
  var detail = document.getElementById('adetail-' + id);
  var toggle = document.getElementById('aicon-' + id);
  if (!detail || !toggle) return;
  var row = toggle.closest('tr');
  var expanded = detail.hidden;
  detail.hidden = !expanded;
  if (row) row.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  var path = toggle.querySelector('.act-nom-expand-chevron path');
  if (path) path.setAttribute('d', actNomExpandChevronPath(expanded));
}

window.runAllocation = function runAllocation() {
  var btn = document.getElementById('run-alloc-btn');
  btn.textContent = '⟳ Running…';
  btn.disabled = true;
  setTimeout(function() {
    btn.textContent = '✓ Allocated';
    btn.style.background = 'var(--green)';
    document.getElementById('alloc-callout').style.display = 'block';
  }, 1200);
}

var chatOpen = false;
var YAML_CHAT_MIN_YAML = 280;
var YAML_CHAT_MIN_CHAT = 320;
var YAML_CHAT_HANDLE_WIDTH = 24;
var YAML_CHAT_DEFAULT_YAML_PCT = 60;

window.toggleChat = function toggleChat() {
  chatOpen = !chatOpen;
  var panel = document.getElementById('chat-panel');
  var body = document.querySelector('.act-yaml-card-body');
  var yamlView = document.getElementById('act-yaml-view');
  var resizeHandle = document.getElementById('act-yaml-chat-resize-handle');
  var openBtn = document.getElementById('open-chat-btn');
  if (!panel || !body) return;

  if (chatOpen) {
    body.classList.add('chat-open');
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    if (yamlView) yamlView.style.flex = '0 0 ' + YAML_CHAT_DEFAULT_YAML_PCT + '%';
    if (panel) panel.style.flex = '1 1 0';
    if (resizeHandle) {
      resizeHandle.classList.add('is-visible');
      resizeHandle.setAttribute('aria-hidden', 'false');
    }
    if (openBtn) {
      openBtn.setAttribute('aria-pressed', 'true');
      openBtn.disabled = true;
    }
    setTimeout(function() {
      var msgs = document.getElementById('chat-messages');
      if (msgs) msgs.scrollTop = msgs.scrollHeight;
    }, 60);
    return;
  }

  body.classList.remove('chat-open');
  panel.classList.remove('is-open');
  panel.setAttribute('aria-hidden', 'true');
  if (yamlView) yamlView.style.flex = '';
  if (panel) panel.style.flex = '';
  if (resizeHandle) {
    resizeHandle.classList.remove('is-visible');
    resizeHandle.setAttribute('aria-hidden', 'true');
  }
  if (openBtn) {
    openBtn.setAttribute('aria-pressed', 'false');
    openBtn.disabled = false;
  }
};

function initYamlChatResize() {
  var resizeHandle = document.getElementById('act-yaml-chat-resize-handle');
  if (!resizeHandle) return;

  var isResizing = false;
  var startX = 0;
  var startYamlWidth = 0;
  var startChatWidth = 0;
  var yamlView = null;
  var chatPanel = null;
  var container = null;

  resizeHandle.addEventListener('mousedown', function (e) {
    if (!document.querySelector('.act-yaml-card-body.chat-open')) return;
    isResizing = true;
    resizeHandle.classList.add('resizing');
    startX = e.clientX;
    yamlView = document.getElementById('act-yaml-view');
    chatPanel = document.getElementById('chat-panel');
    container = document.querySelector('.act-yaml-card-split');
    if (container) container.classList.add('is-resizing');
    if (yamlView) startYamlWidth = yamlView.getBoundingClientRect().width;
    if (chatPanel) startChatWidth = chatPanel.getBoundingClientRect().width;
    e.preventDefault();
  });

  document.addEventListener('mousemove', function (e) {
    if (!isResizing || !yamlView || !chatPanel || !container) return;
    var containerWidth = container.getBoundingClientRect().width - YAML_CHAT_HANDLE_WIDTH;
    var deltaX = e.clientX - startX;
    var newYamlWidth = startYamlWidth + deltaX;
    var newChatWidth = startChatWidth - deltaX;
    if (newYamlWidth >= YAML_CHAT_MIN_YAML &&
        newChatWidth >= YAML_CHAT_MIN_CHAT &&
        newYamlWidth + newChatWidth <= containerWidth) {
      yamlView.style.flex = '0 0 ' + ((newYamlWidth / containerWidth) * 100) + '%';
      chatPanel.style.flex = '1 1 0';
    }
  });

  document.addEventListener('mouseup', function () {
    if (!isResizing) return;
    isResizing = false;
    resizeHandle.classList.remove('resizing');
    if (container) container.classList.remove('is-resizing');
  });
}

window.acceptAmendment = function acceptAmendment() {
  // Update allocation table row for Mountain Pool West (loc-F)
  var el;
  el = document.getElementById('alloc-locF-alloc');
  if (el) { el.textContent = '11,200'; el.style.color = 'var(--amber-text)'; el.style.fontWeight = '600'; }

  el = document.getElementById('alloc-locF-var');
  if (el) { el.textContent = '–23,800'; el.style.color = 'var(--amber-text)'; el.style.fontWeight = '600'; }

  el = document.getElementById('alloc-locF-configs');
  if (el) { el.textContent = '2'; el.style.color = 'var(--gray-700)'; }

  el = document.getElementById('alloc-locF-method');
  if (el) {
    el.innerHTML = '<span class="act-alloc-method" style="color:var(--amber-text)">Manual Override</span>'
      + '<span class="act-alloc-method-sub">23,800 Dth still unallocated (4 paths)</span>';
  }

  el = document.getElementById('alloc-locF-status');
  if (el) { el.innerHTML = '<span class="badge badge-warning">Partial</span>'; }

  // Update summary stats
  el = document.getElementById('stat-allocated');
  if (el) { el.textContent = '472,039'; }

  el = document.getElementById('stat-unallocated');
  if (el) { el.textContent = '31,425'; }

  // Disable accept/reject buttons
  var acceptBtn = document.getElementById('accept-btn');
  var rejectBtn = document.getElementById('reject-btn');
  if (acceptBtn) {
    acceptBtn.textContent = 'Applied';
    acceptBtn.disabled = true;
  }
  if (rejectBtn) {
    rejectBtn.disabled = true;
  }

  // Add confirmation message to chat
  var msgs = document.getElementById('chat-messages');
  if (msgs) {
    var div = document.createElement('div');
    div.className = 'chat-msg chat-assistant';
    div.innerHTML =
      '<div class="chat-avatar-row"><span class="chat-claude-icon" aria-hidden="true">✦</span><span class="chat-name">Claude</span></div>' +
      '<div class="chat-bubble chat-bubble-assistant chat-bubble--success">' +
      '<p><strong>✓ Amendment applied.</strong> T-0070010 is now allocated <strong>11,200 Dth</strong> via <code>MANUAL_HUB_OVERRIDE</code> using settlement config SC-2985-WBI-R.</p>' +
      '<p>The Allocations tab has been updated. The remaining 23,800 Dth at Mountain Pool West (Marketing Co Beta, Marketing Co Gamma, Utility Co North, Marketing Co Delta) has the same hub mismatch.</p>' +
      '<p class="chat-note">Tip: Once you add <code>MOUNTAIN POOL WEST</code> as a location alias for <code>NGPL-WY</code> in Molecule Settings → Pipeline Locations, the next run will auto-match all five paths.</p>' +
      '</div>';
    msgs.appendChild(div);
    setTimeout(function() { msgs.scrollTop = msgs.scrollHeight; }, 30);
  }
}

window.rejectAmendment = function rejectAmendment() {
  var panel = document.getElementById('amendment-panel');
  if (panel) panel.style.display = 'none';

  var msgs = document.getElementById('chat-messages');
  if (msgs) {
    var div = document.createElement('div');
    div.className = 'chat-msg chat-assistant';
    div.innerHTML =
      '<div class="chat-avatar-row"><span class="chat-claude-icon" aria-hidden="true">✦</span><span class="chat-name">Claude</span></div>' +
      '<div class="chat-bubble chat-bubble-assistant">' +
      '<p>Amendment rejected — no changes made. Let me know how you\'d like to proceed. I can help you draft a new settlement config for NGPL-Mainline, or explore a different counterparty to override.</p>' +
      '</div>';
    msgs.appendChild(div);
    setTimeout(function() { msgs.scrollTop = msgs.scrollHeight; }, 30);
  }
}

// ── YAML content + syntax highlighter ──
var ALLOC_YAML = [
'# Molecule Actualization — Allocation Run',
'# Gas Day: 2026-04-09  ·  Cycle: Timely',
'# Pipeline: NGPL        ·  Run ID: alloc-20260409-1042',
'# Status: PARTIAL      ·  5 of 6 locations matched',
'# Generated: 2026-04-09T10:42:31Z  ·  Engine: actualization v2.4.1',
'',
'meta:',
'  gas_day: "2026-04-09"',
'  cycle: Timely',
'  pipeline: NGPL',
'  run_id: "alloc-20260409-1042"',
'  run_at: "2026-04-09T10:42:31Z"',
'  engine_version: "2.4.1"',
'  status: PARTIAL',
'  locations_total: 6',
'  locations_matched: 5',
'  locations_unmatched: 1',
'  total_scheduled_dth: 503464',
'  total_allocated_dth: 460839',
'  total_unallocated_dth: 42625',
'  variance_pct: 8.47',
'',
'locations:',
'',
'  # ─── LOC A: COMPRESSION POOL EAST ──────────────────────────────────────────',
'  - id: loc-A',
'    name: "COMPRESSION POOL EAST"',
'    pipeline: NGPL',
'    hub: "Compression Pool East"',
'    loc_number: "44120"',
'    scheduled_dth: 43739',
'    allocated_dth: 43739',
'    variance_dth: 0',
'    variance_pct: 0.0',
'    status: PARTIAL',
'    allocation_method: PBL_PRORATA',
'    settlement_configs_used: 4',
'    note: "Total receipts (68,639 Dth) exceeded pipeline scheduled (33,639 Dth). Prorated below."',
'',
'    paths:',
'      receipts:',
'        - trade_id: T-0088422',
'          counterparty: "Midstream Co Alpha"',
'          hub_product: "Compression Pool East · ZAF.IF"',
'          trade_qty_dth: 20000',
'          scheduled_qty_dth: 20000',
'          allocated_qty_dth: 20000',
'          variance_dth: 0',
'          settlement_config: SC-4412-DCP-R',
'          method: EXACT_MATCH',
'          status: MATCHED',
'          confidence_pct: 100',
'',
'        - trade_id: T-0088423',
'          counterparty: "Midstream Co Alpha"',
'          hub_product: "Compression Pool East · ZAF.IF"',
'          trade_qty_dth: 5000',
'          scheduled_qty_dth: 5000',
'          allocated_qty_dth: 5000',
'          variance_dth: 0',
'          settlement_config: SC-4412-DCP-R',
'          method: EXACT_MATCH',
'          status: MATCHED',
'          confidence_pct: 100',
'',
'        - trade_id: T-0088430',
'          counterparty: "Midstream Co Alpha"',
'          hub_product: "Compression Pool East · ZAF.IF"',
'          trade_qty_dth: 10000',
'          scheduled_qty_dth: 10000',
'          allocated_qty_dth: 10000',
'          variance_dth: 0',
'          settlement_config: SC-4412-DCP-R',
'          method: EXACT_MATCH',
'          status: MATCHED',
'          confidence_pct: 100',
'',
'        - trade_id: T-0088431',
'          counterparty: "Midstream Co Alpha"',
'          hub_product: "Compression Pool East · ZAF.IF"',
'          trade_qty_dth: 33639',
'          scheduled_qty_dth: 33639',
'          allocated_qty_dth: 8739',
'          variance_dth: -24900',
'          settlement_config: SC-4412-DCP-R',
'          method: PBL_PRORATA',
'          prorate_factor: 0.2598',
'          prorate_basis: "33639 / 68639 = 0.4902 remaining after fills"',
'          status: PARTIAL',
'          confidence_pct: 94',
'',
'      deliveries:',
'        - trade_id: T-0020110',
'          counterparty: "Marketing Co Beta"',
'          hub_product: "Compression Pool East · ZAF.IF"',
'          trade_qty_dth: -43739',
'          scheduled_qty_dth: -43739',
'          allocated_qty_dth: -43739',
'          variance_dth: 0',
'          settlement_config: SC-4412-TNK-D',
'          method: EXACT_MATCH',
'          status: MATCHED',
'          confidence_pct: 100',
'',
'  # ─── LOC B: NGPL SOUTH POOL ─────────────────────────────────────────────────',
'  - id: loc-B',
'    name: "NGPL SOUTH POOL"',
'    pipeline: NGPL',
'    hub: NGPL-South',
'    loc_number: "61200"',
'    scheduled_dth: 85000',
'    allocated_dth: 85000',
'    variance_dth: 0',
'    variance_pct: 0.0',
'    status: MATCHED',
'    allocation_method: EXACT_MATCH',
'    settlement_configs_used: 2',
'',
'    paths:',
'      receipts:',
'        - trade_id: T-0042234',
'          counterparty: "Pipeline Co Beta"',
'          hub_product: "NGPL-South · Inside"',
'          trade_qty_dth: 50000',
'          scheduled_qty_dth: 50000',
'          allocated_qty_dth: 50000',
'          variance_dth: 0',
'          settlement_config: SC-6120-QST-R',
'          method: EXACT_MATCH',
'          status: MATCHED',
'          confidence_pct: 100',
'',
'        - trade_id: T-0055010',
'          counterparty: "Pipeline Co Beta"',
'          hub_product: "NGPL-South · Inside"',
'          trade_qty_dth: 35000',
'          scheduled_qty_dth: 35000',
'          allocated_qty_dth: 35000',
'          variance_dth: 0',
'          settlement_config: SC-6120-QST-R',
'          method: EXACT_MATCH',
'          status: MATCHED',
'          confidence_pct: 100',
'',
'      deliveries:',
'        - trade_id: T-0042235',
'          counterparty: "Trading Co Theta"',
'          hub_product: "NGPL-South · Inside"',
'          trade_qty_dth: -85000',
'          scheduled_qty_dth: -85000',
'          allocated_qty_dth: -85000',
'          variance_dth: 0',
'          settlement_config: SC-6120-MAC-D',
'          method: EXACT_MATCH',
'          status: MATCHED',
'          confidence_pct: 100',
'',
'  # ─── LOC C: NGPL MIDCON POOL ──────────────────────────────────',
'  - id: loc-C',
'    name: "NGPL MIDCON POOL"',
'    pipeline: NGPL',
'    hub: NGPL-MidCon',
'    loc_number: "38950"',
'    scheduled_dth: 120000',
'    allocated_dth: 120000',
'    variance_dth: 0',
'    variance_pct: 0.0',
'    status: MATCHED',
'    allocation_method: PBA_PRORATA',
'    settlement_configs_used: 3',
'',
'    paths:',
'      receipts:',
'        - trade_id: T-0032001',
'          counterparty: "Pipeline Co Gamma"',
'          hub_product: "NGPL-MidCon · ET"',
'          trade_qty_dth: 60000',
'          scheduled_qty_dth: 60000',
'          allocated_qty_dth: 60000',
'          variance_dth: 0',
'          settlement_config: SC-3895-PHD-R',
'          method: EXACT_MATCH',
'          status: MATCHED',
'          confidence_pct: 100',
'',
'        - trade_id: T-0032002',
'          counterparty: "Pipeline Co Gamma"',
'          hub_product: "NGPL-MidCon · ET"',
'          trade_qty_dth: 30000',
'          scheduled_qty_dth: 30000',
'          allocated_qty_dth: 30000',
'          variance_dth: 0',
'          settlement_config: SC-3895-PHD-R',
'          method: EXACT_MATCH',
'          status: MATCHED',
'          confidence_pct: 100',
'',
'        - trade_id: T-0032003',
'          counterparty: "Pipeline Co Gamma"',
'          hub_product: "NGPL-MidCon · ET"',
'          trade_qty_dth: 40000',
'          scheduled_qty_dth: 30000',
'          allocated_qty_dth: 30000',
'          variance_dth: 0',
'          settlement_config: SC-3895-PHD-R',
'          method: PBA_PRORATA',
'          prorate_factor: 0.75',
'          status: MATCHED',
'          confidence_pct: 97',
'',
'      deliveries:',
'        - trade_id: T-0032010',
'          counterparty: "Trading Co Beta"',
'          hub_product: "NGPL-MidCon · ET"',
'          trade_qty_dth: -70000',
'          scheduled_qty_dth: -70000',
'          allocated_qty_dth: -70000',
'          variance_dth: 0',
'          settlement_config: SC-3895-SHL-D',
'          method: EXACT_MATCH',
'          status: MATCHED',
'          confidence_pct: 100',
'',
'        - trade_id: T-0032011',
'          counterparty: "Trading Co Iota"',
'          hub_product: "NGPL-MidCon · ET"',
'          trade_qty_dth: -50000',
'          scheduled_qty_dth: -50000',
'          allocated_qty_dth: -50000',
'          variance_dth: 0',
'          settlement_config: SC-3895-VTL-D',
'          method: EXACT_MATCH',
'          status: MATCHED',
'          confidence_pct: 100',
'',
'  # ─── LOC D: NGPL NORTH POOL ─────────────────────────────────────────────────',
'  - id: loc-D',
'    name: "NGPL NORTH POOL"',
'    pipeline: NGPL',
'    hub: NGPL-North',
'    loc_number: "22100"',
'    scheduled_dth: 60000',
'    allocated_dth: 60000',
'    variance_dth: 0',
'    variance_pct: 0.0',
'    status: MATCHED',
'    allocation_method: EBB_AGMT_MATCH',
'    settlement_configs_used: 2',
'    ebb_agreement_ids: [K-44001, K-44002]',
'',
'    paths:',
'      receipts:',
'        - trade_id: T-0044001',
'          counterparty: "Pipeline Co Delta"',
'          hub_product: "NGPL-North"',
'          ebb_agreement: K-44001',
'          trade_qty_dth: 40000',
'          scheduled_qty_dth: 40000',
'          allocated_qty_dth: 40000',
'          variance_dth: 0',
'          settlement_config: SC-2210-ANR-R',
'          method: EBB_AGMT_MATCH',
'          status: MATCHED',
'          confidence_pct: 100',
'',
'        - trade_id: T-0044002',
'          counterparty: "Pipeline Co Delta"',
'          hub_product: "NGPL-North"',
'          ebb_agreement: K-44002',
'          trade_qty_dth: 20000',
'          scheduled_qty_dth: 20000',
'          allocated_qty_dth: 20000',
'          variance_dth: 0',
'          settlement_config: SC-2210-ANR-R',
'          method: EBB_AGMT_MATCH',
'          status: MATCHED',
'          confidence_pct: 100',
'',
'      deliveries:',
'        - trade_id: T-0044010',
'          counterparty: "Trading Co Alpha"',
'          hub_product: "NGPL-North"',
'          trade_qty_dth: -60000',
'          scheduled_qty_dth: -60000',
'          allocated_qty_dth: -60000',
'          variance_dth: 0',
'          settlement_config: SC-2210-CNS-D',
'          method: EBB_AGMT_MATCH',
'          status: MATCHED',
'          confidence_pct: 100',
'',
'  # ─── LOC E: NGPL MIDCONTINENT POOL ───────────────────────────────────────────',
'  - id: loc-E',
'    name: "NGPL MIDCONTINENT POOL"',
'    pipeline: NGPL',
'    hub: NGPL-MidCon',
'    loc_number: "51450"',
'    scheduled_dth: 79100',
'    allocated_dth: 79100',
'    variance_dth: 0',
'    variance_pct: 0.0',
'    status: MATCHED',
'    allocation_method: EXACT_MATCH',
'    settlement_configs_used: 2',
'    fuel_adjustment_applied: true',
'',
'    paths:',
'      receipts:',
'        - trade_id: T-0070011',
'          counterparty: "Pipeline Co Alpha"',
'          hub_product: "NGPL-MidCon"',
'          trade_qty_dth: 50000',
'          scheduled_qty_dth: 50000',
'          allocated_qty_dth: 50000',
'          variance_dth: 0',
'          settlement_config: SC-5145-NGL-R',
'          method: EXACT_MATCH',
'          status: MATCHED',
'          confidence_pct: 100',
'',
'        - trade_id: T-0070012',
'          counterparty: "Pipeline Co Alpha"',
'          hub_product: "NGPL-MidCon"',
'          trade_qty_dth: 29100',
'          scheduled_qty_dth: 29100',
'          allocated_qty_dth: 29100',
'          variance_dth: 0',
'          settlement_config: SC-5145-NGL-R',
'          fuel_adjustment_dth: -724',
'          fuel_rate: 0.0249',
'          method: EXACT_MATCH',
'          status: MATCHED',
'          confidence_pct: 100',
'          note: "Fuel retainage: -724 Dth @ 0.0249 MMBtu/MMBtu per tariff"',
'',
'      deliveries:',
'        - trade_id: T-0044001',
'          counterparty: "Pipeline Co Alpha"',
'          hub_product: "NGPL-MidCon"',
'          trade_qty_dth: -80000',
'          scheduled_qty_dth: -79376',
'          allocated_qty_dth: -79376',
'          variance_dth: 624',
'          settlement_config: SC-4441-NGL-D',
'          fuel_adjustment_applied: true',
'          fuel_adjustment_dth: -724',
'          method: EXACT_MATCH',
'          status: MATCHED',
'          confidence_pct: 99',
'',
'  # ─── LOC F: MOUNTAIN POOL WEST ── ⚠ UNMATCHED ─────────────────────────',
'  - id: loc-F',
'    name: "MOUNTAIN POOL WEST"',
'    pipeline: WGP',
'    hub: NGPL-Mainline',
'    loc_number: "29850"',
'    scheduled_dth: 35000',
'    allocated_dth: 0',
'    variance_dth: -35000',
'    variance_pct: -100.0',
'    status: UNMATCHED',
'    allocation_method: null',
'    settlement_configs_used: 0',
'    error_code: NO_SETTLEMENT_CONFIG',
'    error_message: >',
'      No settlement config found in Molecule for hub=NGPL-Mainline.',
'      5 counterparty paths affected. 35,000 Dth unallocated.',
'',
'    paths:',
'      receipts:',
'        - trade_id: T-0070010',
'          counterparty: "Transmission Co Alpha"',
'          hub_product: "NGPL-Mainline · Z45"',
'          trade_qty_dth: 25000',
'          scheduled_qty_dth: 11200',
'          allocated_qty_dth: 0',
'          variance_dth: -11200',
'          settlement_config: null',
'          method: null',
'          status: UNMATCHED',
'          error: "No settlement config: Transmission Co Alpha / NGPL-Mainline"',
'',
'        - trade_id: T-0070013',
'          counterparty: "Marketing Co Beta"',
'          hub_product: "NGPL-Mainline · Z45"',
'          trade_qty_dth: 5000',
'          scheduled_qty_dth: 5000',
'          allocated_qty_dth: 0',
'          variance_dth: -5000',
'          settlement_config: null',
'          method: null',
'          status: UNMATCHED',
'          error: "No settlement config: Marketing Co Beta / NGPL-Mainline"',
'',
'        - trade_id: T-0070014',
'          counterparty: "Marketing Co Gamma"',
'          hub_product: "NGPL-Mainline · Z45"',
'          trade_qty_dth: 4000',
'          scheduled_qty_dth: 4000',
'          allocated_qty_dth: 0',
'          variance_dth: -4000',
'          settlement_config: null',
'          method: null',
'          status: UNMATCHED',
'          error: "No settlement config: Marketing Co Gamma / NGPL-Mainline"',
'',
'        - trade_id: T-0070015',
'          counterparty: "Utility Co North"',
'          hub_product: "NGPL-Mainline · Z45"',
'          trade_qty_dth: 8000',
'          scheduled_qty_dth: 8000',
'          allocated_qty_dth: 0',
'          variance_dth: -8000',
'          settlement_config: null',
'          method: null',
'          status: UNMATCHED',
'          error: "No settlement config: Utility Co North / NGPL-Mainline"',
'',
'        - trade_id: T-0070016',
'          counterparty: "Marketing Co Delta"',
'          hub_product: "NGPL-Mainline · Z45"',
'          trade_qty_dth: 6800',
'          scheduled_qty_dth: 6800',
'          allocated_qty_dth: 0',
'          variance_dth: -6800',
'          settlement_config: null',
'          method: null',
'          status: UNMATCHED',
'          error: "No settlement config: Marketing Co Delta / NGPL-Mainline"'
].join('\n');

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function colorizeYaml(raw) {
  var lines = raw.split('\n');
  var html = lines.map(function(line) {
    // Full-line comment
    if (/^\s*#/.test(line)) {
      return '<span class="y-comment">' + escHtml(line) + '</span>';
    }
    // List item that is just a scalar (- value, not - key: value)
    var listScalar = line.match(/^(\s*-\s+)([A-Z][\w-]*)$/);
    if (listScalar) {
      return escHtml(listScalar[1]) + '<span class="y-bool">' + escHtml(listScalar[2]) + '</span>';
    }
    // Key: value
    var kv = line.match(/^(\s*)([\w_-]+)(:\s*)(.*)$/);
    if (kv) {
      var indent = escHtml(kv[1]);
      var key = '<span class="y-key">' + escHtml(kv[2]) + '</span>';
      var colon = escHtml(kv[3]);
      var rawVal = kv[4];
      var val;
      if (rawVal === '') {
        val = '';
      } else if (rawVal === 'null' || rawVal === 'NULL') {
        val = '<span class="y-null">' + escHtml(rawVal) + '</span>';
      } else if (rawVal === 'true' || rawVal === 'false') {
        val = '<span class="y-bool">' + escHtml(rawVal) + '</span>';
      } else if (/^(MATCHED|PARTIAL|EXACT_MATCH|EBB_AGMT_MATCH|PBL_PRORATA|PBA_PRORATA)$/.test(rawVal)) {
        val = '<span class="y-status-ok">' + escHtml(rawVal) + '</span>';
      } else if (/^(UNMATCHED|NO_SETTLEMENT_CONFIG)$/.test(rawVal)) {
        val = '<span class="y-status-err">' + escHtml(rawVal) + '</span>';
      } else if (/^(MANUAL_OVERRIDE|MANUAL_HUB_OVERRIDE)$/.test(rawVal)) {
        val = '<span class="y-status-warn">' + escHtml(rawVal) + '</span>';
      } else if (/^-?[\d][\d_]*(\.\d+)?$/.test(rawVal)) {
        val = '<span class="y-num">' + escHtml(rawVal) + '</span>';
      } else if (/^"/.test(rawVal) || /^'/.test(rawVal)) {
        val = '<span class="y-str">' + escHtml(rawVal) + '</span>';
      } else if (/^>/.test(rawVal)) {
        val = '<span class="y-comment">' + escHtml(rawVal) + '</span>';
      } else {
        val = escHtml(rawVal);
      }
      return indent + key + colon + val;
    }
    // List item with dash (- trade_id: ...)
    var li = line.match(/^(\s*-\s+)(.*)$/);
    if (li) {
      return escHtml(li[1]) + escHtml(li[2]);
    }
    return escHtml(line);
  });
  return html.join('\n');
}

window.addEventListener('load', function() {
  if (document.getElementById('yaml-content')) {
    document.getElementById('yaml-content').innerHTML = colorizeYaml(ALLOC_YAML);
    initYamlChatResize();
    initAiReviewPage();
  }
  if (document.getElementById('map-iframe')) {
    initPipelineMapPage();
  }
});

function initPipelineMapPage() {
  var pipelineSelect = document.getElementById('map-pipeline-select');
  var typeSelect = document.getElementById('map-type-select');
  var openBtn = document.getElementById('map-open-btn');

  if (pipelineSelect) pipelineSelect.addEventListener('change', updateMap);
  if (typeSelect) typeSelect.addEventListener('change', updateMap);
  if (openBtn) openBtn.addEventListener('click', openMapPdf);

  updateMap();
}

function initAiReviewPage() {
  var downloadBtn = document.getElementById('yaml-download-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function () {
      var blob = new Blob([ALLOC_YAML], { type: 'text/yaml;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = 'alloc-20260409-1042.yaml';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });
  }

  var openChatBtn = document.getElementById('open-chat-btn');
  if (openChatBtn) openChatBtn.addEventListener('click', toggleChat);

  var closeChatBtn = document.querySelector('.act-chat-close');
  if (closeChatBtn) closeChatBtn.addEventListener('click', toggleChat);

  var acceptBtn = document.getElementById('accept-btn');
  if (acceptBtn) acceptBtn.addEventListener('click', acceptAmendment);

  var rejectBtn = document.getElementById('reject-btn');
  if (rejectBtn) rejectBtn.addEventListener('click', rejectAmendment);
}
})();
