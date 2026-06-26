/**
 * Shared collapsible book cards (caret + toggle body) for Fund Allocations screens.
 * Expects: section[data-fa-book-card="uniqueId"] with .fa-book-card-toggle (typically in .card-header)
 *          section > .card-body | .fa-book-card-collapse-target
 *
 * Toggle uses a slide-up / slide-down (max-height + opacity + padding) unless reduced motion or instant sync.
 */
(function (global) {
  'use strict';

  const collapsed = Object.create(null);
  /** Allocations strip cards (`strip|…`): once true, `faEnsureAllocStripBookCardDefaultCollapsed` stops changing state. */
  const allocStripDefaultCollapsedApplied = Object.create(null);
  const pendingTimers = new WeakMap();
  const pendingEndHandlers = new WeakMap();

  var DURATION_MS = 320;
  var EASE = 'ease-out';

  function prefersReducedMotion() {
    try {
      return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function clearBodyAnimation(body) {
    if (!body) return;
    var t = pendingTimers.get(body);
    if (t) {
      clearTimeout(t);
      pendingTimers.delete(body);
    }
    var fn = pendingEndHandlers.get(body);
    if (fn) {
      body.removeEventListener('transitionend', fn);
      pendingEndHandlers.delete(body);
    }
    body.style.removeProperty('transition');
    body.style.removeProperty('max-height');
    body.style.removeProperty('opacity');
    body.style.removeProperty('padding-top');
    body.style.removeProperty('padding-bottom');
    body.style.removeProperty('overflow');
  }

  function findBody(section) {
    if (!section || !section.children) return null;
    for (var i = 0; i < section.children.length; i++) {
      var el = section.children[i];
      if (el.classList && el.classList.contains('card-body')) return el;
    }
    for (var j = 0; j < section.children.length; j++) {
      var el2 = section.children[j];
      if (el2.classList && el2.classList.contains('fa-book-card-collapse-target')) return el2;
    }
    return null;
  }

  function finishCollapse(body) {
    body.hidden = true;
    clearBodyAnimation(body);
  }

function finishExpand(body) {
  body.hidden = false;
  clearBodyAnimation(body);
  var section = body && body.closest ? body.closest('[data-fa-book-card]') : null;
  notifyBookCardCollapseChanged({ phase: 'expanded', section: section });
}

  function runCollapseAnimation(body) {
    clearBodyAnimation(body);
    if (body.hidden) return;

    var cs0 = getComputedStyle(body);
    var padT = cs0.paddingTop;
    var padB = cs0.paddingBottom;
    var fullH = body.scrollHeight;

    body.removeAttribute('hidden');
    body.style.overflow = 'hidden';
    body.style.maxHeight = fullH + 'px';
    body.style.opacity = '1';
    body.style.paddingTop = padT;
    body.style.paddingBottom = padB;

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        body.style.transition =
          'max-height ' + DURATION_MS + 'ms ' + EASE + ', opacity 220ms ' + EASE + ', padding-top ' + DURATION_MS + 'ms ' + EASE + ', padding-bottom ' + DURATION_MS + 'ms ' + EASE;
        body.style.maxHeight = '0px';
        body.style.opacity = '0';
        body.style.paddingTop = '0';
        body.style.paddingBottom = '0';
      });
    });

    function onEnd(e) {
      if (e && e.propertyName && e.propertyName !== 'max-height') return;
      body.removeEventListener('transitionend', onEnd);
      pendingEndHandlers.delete(body);
      clearTimeout(pendingTimers.get(body));
      pendingTimers.delete(body);
      finishCollapse(body);
    }

    body.addEventListener('transitionend', onEnd);
    pendingEndHandlers.set(body, onEnd);
    pendingTimers.set(body, setTimeout(onEnd, DURATION_MS + 80));
  }

  function runExpandAnimation(body) {
    clearBodyAnimation(body);
    body.hidden = false;

    body.style.overflow = 'hidden';
    body.style.maxHeight = 'none';
    var fullH = body.scrollHeight;
    var cs = getComputedStyle(body);
    var padT = cs.paddingTop;
    var padB = cs.paddingBottom;

    body.style.maxHeight = '0px';
    body.style.opacity = '0';
    body.style.paddingTop = '0';
    body.style.paddingBottom = '0';

    void body.offsetHeight;

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        body.style.transition =
          'max-height ' + DURATION_MS + 'ms ' + EASE + ', opacity 220ms ' + EASE + ', padding-top ' + DURATION_MS + 'ms ' + EASE + ', padding-bottom ' + DURATION_MS + 'ms ' + EASE;
        body.style.maxHeight = fullH + 'px';
        body.style.opacity = '1';
        body.style.paddingTop = padT;
        body.style.paddingBottom = padB;
      });
    });

    function onEnd(e) {
      if (e && e.propertyName && e.propertyName !== 'max-height') return;
      body.removeEventListener('transitionend', onEnd);
      pendingEndHandlers.delete(body);
      clearTimeout(pendingTimers.get(body));
      pendingTimers.delete(body);
      finishExpand(body);
    }

    body.addEventListener('transitionend', onEnd);
    pendingEndHandlers.set(body, onEnd);
    pendingTimers.set(body, setTimeout(onEnd, DURATION_MS + 80));
  }

  function applyFaBookCardState(section, opts) {
    if (!section || !section.hasAttribute('data-fa-book-card')) return;
    var id = section.getAttribute('data-fa-book-card');
    var isCollapsed = !!collapsed[id];
    var instant = (opts && opts.instant) || prefersReducedMotion();
    var body = findBody(section);
    var btn = section.querySelector(':scope .fa-book-card-toggle');

    if (instant) {
      section.classList.toggle('fa-book-card--collapsed', isCollapsed);
      if (body) {
        clearBodyAnimation(body);
        body.hidden = isCollapsed;
      }
      if (btn) btn.setAttribute('aria-expanded', String(!isCollapsed));
      if (!isCollapsed && body) {
        notifyBookCardCollapseChanged({ phase: 'expanded', section: section });
      }
      return;
    }

    if (btn) btn.setAttribute('aria-expanded', String(!isCollapsed));
    section.classList.toggle('fa-book-card--collapsed', isCollapsed);

    if (!body) return;

    if (isCollapsed) {
      runCollapseAnimation(body);
    } else {
      runExpandAnimation(body);
    }
  }

  function notifyBookCardCollapseChanged() {
    try {
      var fn = global.faOnBookCardCollapseChanged;
      if (typeof fn === 'function') fn();
    } catch (e) {}
  }

  function toggleFaBookCardFromEl(btn) {
    var section = btn && btn.closest('[data-fa-book-card]');
    if (!section) return;
    var id = section.getAttribute('data-fa-book-card');
    collapsed[id] = !collapsed[id];
    applyFaBookCardState(section);
    notifyBookCardCollapseChanged();
  }

  function faSyncAllBookCardCollapse(root) {
    var scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll('[data-fa-book-card]').forEach(function (section) {
      applyFaBookCardState(section, { instant: true });
    });
  }

  function faBookCardIsCollapsed(id) {
    return !!collapsed[id];
  }

  /**
   * Allocations tab strip only: first time we see `strip|…`, default that card to collapsed.
   * Later toggles / expand-all / re-renders respect `collapsed`; expand-all clears keys without re-defaulting.
   */
  function faEnsureAllocStripBookCardDefaultCollapsed(cardId) {
    if (!cardId || cardId.indexOf('strip|') !== 0) return;
    if (allocStripDefaultCollapsedApplied[cardId]) return;
    allocStripDefaultCollapsedApplied[cardId] = true;
    collapsed[cardId] = true;
  }

  /** Expand every book card under `root` (e.g. `.fa-alloc-strip-scroll`). Does not affect other regions. */
  function faExpandAllBookCardsIn(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var reduced = prefersReducedMotion();
    scope.querySelectorAll('[data-fa-book-card]').forEach(function (section) {
      var id = section.getAttribute('data-fa-book-card');
      if (!id) return;
      var wasCollapsed = !!collapsed[id];
      delete collapsed[id];
      if (reduced || !wasCollapsed) {
        applyFaBookCardState(section, { instant: true });
      } else {
        applyFaBookCardState(section);
      }
    });
    notifyBookCardCollapseChanged();
  }

  /**
   * Set collapsed state for every `[data-fa-book-card]` under `root` without animation.
   * Use for default view (e.g. settings Mapping Rules nested books).
   */
  function faPresetBookCardsCollapsed(root, wantCollapsed) {
    var scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll('[data-fa-book-card]').forEach(function (section) {
      var id = section.getAttribute('data-fa-book-card');
      if (!id) return;
      if (wantCollapsed) collapsed[id] = true;
      else delete collapsed[id];
      applyFaBookCardState(section, { instant: true });
    });
    notifyBookCardCollapseChanged();
  }

  /** Collapse every book card under `root`. */
  function faCollapseAllBookCardsIn(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var reduced = prefersReducedMotion();
    scope.querySelectorAll('[data-fa-book-card]').forEach(function (section) {
      var id = section.getAttribute('data-fa-book-card');
      if (!id) return;
      var wasExpanded = !collapsed[id];
      collapsed[id] = true;
      if (reduced || !wasExpanded) {
        applyFaBookCardState(section, { instant: true });
      } else {
        applyFaBookCardState(section);
      }
    });
    notifyBookCardCollapseChanged();
  }

  global.toggleFaBookCardFromEl = toggleFaBookCardFromEl;
  global.faSyncAllBookCardCollapse = faSyncAllBookCardCollapse;
  global.faBookCardIsCollapsed = faBookCardIsCollapsed;
  global.faExpandAllBookCardsIn = faExpandAllBookCardsIn;
  global.faCollapseAllBookCardsIn = faCollapseAllBookCardsIn;
  global.faPresetBookCardsCollapsed = faPresetBookCardsCollapsed;
  global.faEnsureAllocStripBookCardDefaultCollapsed = faEnsureAllocStripBookCardDefaultCollapsed;
})(typeof window !== 'undefined' ? window : this);
