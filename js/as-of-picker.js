/**
 * Mirage as-of date picker — page-header date strip + calendar popover.
 */
(function (global) {
  'use strict';

  var DOWS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  var instances = [];

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function formatAsOfLabel(date) {
    var month = date.toLocaleString('en-US', { month: 'long' }).toUpperCase();
    return month + ' ' + pad2(date.getDate()) + ', ' + date.getFullYear();
  }

  function positionPopover(instance) {
    var pop = instance.popoverEl;
    var trig = instance.triggerEl;
    if (!pop || !trig || pop.hidden) return;
    var r = trig.getBoundingClientRect();
    var gap = 8;
    var edge = 8;
    pop.style.top = r.bottom + gap + 'px';
    var w = pop.offsetWidth;
    var left = r.right - w;
    if (left < edge) left = edge;
    if (left + w > global.innerWidth - edge) {
      left = Math.max(edge, global.innerWidth - w - edge);
    }
    pop.style.left = left + 'px';
  }

  function syncLabel(instance) {
    if (!instance.labelEl) return;
    instance.labelEl.textContent = formatAsOfLabel(instance.selectedDate);
  }

  function defaultRenderCalendar(instance) {
    if (!instance.gridEl) return;
    var view = instance.viewDate;
    var year = view.getFullYear();
    var month = view.getMonth();
    var firstDow = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var selected = instance.selectedDate;
    var today = startOfDay(new Date());

    var html = DOWS.map(function (d) {
      return '<div class="as-of-picker__cal-dow">' + d + '</div>';
    }).join('');

    for (var i = 0; i < firstDow; i++) html += '<div></div>';

    for (var day = 1; day <= daysInMonth; day++) {
      var cellDate = new Date(year, month, day);
      var isToday = cellDate.getTime() === today.getTime();
      var isSelected = cellDate.getTime() === startOfDay(selected).getTime();
      var cls = ['as-of-picker__cal-day'];
      if (isToday) cls.push('is-today');
      if (isSelected) cls.push('is-selected');
      html += '<button type="button" class="' + cls.join(' ') + '" data-as-of-day="' + day + '">' + day + '</button>';
    }

    instance.gridEl.innerHTML = html;
    if (instance.monthLabelEl) {
      instance.monthLabelEl.textContent = view.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    }
  }

  function renderCalendar(instance) {
    if (typeof instance.renderCalendar === 'function') {
      instance.renderCalendar(instance);
      return;
    }
    defaultRenderCalendar(instance);
  }

  function closePopover(instance) {
    if (!instance.popoverEl) return;
    instance.popoverEl.hidden = true;
    instance.popoverEl.style.display = 'none';
    if (instance.triggerEl) {
      instance.triggerEl.classList.remove('is-open');
      instance.triggerEl.setAttribute('aria-expanded', 'false');
    }
  }

  function openPopover(instance) {
    if (!instance.popoverEl || !instance.triggerEl) return;
    instance.viewDate = new Date(instance.selectedDate.getFullYear(), instance.selectedDate.getMonth(), 1);
    renderCalendar(instance);
    instance.popoverEl.hidden = false;
    instance.popoverEl.style.display = 'block';
    instance.triggerEl.classList.add('is-open');
    instance.triggerEl.setAttribute('aria-expanded', 'true');
    positionPopover(instance);
  }

  function togglePopover(instance, event) {
    if (event) event.stopPropagation();
    if (!instance.popoverEl) return;
    if (!instance.popoverEl.hidden && instance.popoverEl.style.display !== 'none') {
      closePopover(instance);
      return;
    }
    openPopover(instance);
  }

  function setSelectedDate(instance, date) {
    instance.selectedDate = startOfDay(date);
    instance.viewDate = new Date(instance.selectedDate.getFullYear(), instance.selectedDate.getMonth(), 1);
    syncLabel(instance);
    if (instance.onChange) instance.onChange(instance.selectedDate, instance);
  }

  function shiftDay(instance, delta) {
    var next = new Date(instance.selectedDate);
    next.setDate(next.getDate() + delta);
    setSelectedDate(instance, next);
  }

  function bindInstance(instance) {
    if (instance.triggerEl) {
      instance.triggerEl.addEventListener('click', function (event) {
        togglePopover(instance, event);
      });
    }
    if (instance.prevEl) {
      instance.prevEl.addEventListener('click', function (event) {
        event.stopPropagation();
        shiftDay(instance, -1);
      });
    }
    if (instance.nextEl) {
      instance.nextEl.addEventListener('click', function (event) {
        event.stopPropagation();
        shiftDay(instance, 1);
      });
    }
    if (instance.monthPrevEl) {
      instance.monthPrevEl.addEventListener('click', function (event) {
        event.stopPropagation();
        instance.viewDate = new Date(instance.viewDate.getFullYear(), instance.viewDate.getMonth() - 1, 1);
        renderCalendar(instance);
      });
    }
    if (instance.monthNextEl) {
      instance.monthNextEl.addEventListener('click', function (event) {
        event.stopPropagation();
        instance.viewDate = new Date(instance.viewDate.getFullYear(), instance.viewDate.getMonth() + 1, 1);
        renderCalendar(instance);
      });
    }
    if (instance.gridEl) {
      instance.gridEl.addEventListener('click', function (event) {
        var btn = event.target.closest('[data-as-of-day]');
        if (!btn) return;
        var day = parseInt(btn.getAttribute('data-as-of-day'), 10);
        if (isNaN(day)) return;
        setSelectedDate(instance, new Date(instance.viewDate.getFullYear(), instance.viewDate.getMonth(), day));
        closePopover(instance);
      });
    }
  }

  function initAsOfPicker(options) {
    options = options || {};
    var triggerEl = document.getElementById(options.triggerId);
    if (!triggerEl) return null;

    var instance = {
      triggerEl: triggerEl,
      labelEl: triggerEl.querySelector('.as-of-picker__label') || document.getElementById(options.labelId),
      popoverEl: document.getElementById(options.popoverId),
      gridEl: document.getElementById(options.gridId),
      monthLabelEl: options.monthLabelId ? document.getElementById(options.monthLabelId) : null,
      prevEl: options.prevId ? document.getElementById(options.prevId) : null,
      nextEl: options.nextId ? document.getElementById(options.nextId) : null,
      monthPrevEl: options.monthPrevId ? document.getElementById(options.monthPrevId) : null,
      monthNextEl: options.monthNextId ? document.getElementById(options.monthNextId) : null,
      selectedDate: startOfDay(options.initialDate ? new Date(options.initialDate) : new Date()),
      viewDate: null,
      onChange: options.onChange || null,
      renderCalendar: options.renderCalendar || null
    };

    instance.viewDate = new Date(instance.selectedDate.getFullYear(), instance.selectedDate.getMonth(), 1);
    syncLabel(instance);
    bindInstance(instance);
    instances.push(instance);
    return instance;
  }

  document.addEventListener('click', function (event) {
    instances.forEach(function (instance) {
      if (!instance.popoverEl || instance.popoverEl.hidden) return;
      if (instance.triggerEl && instance.triggerEl.contains(event.target)) return;
      if (instance.popoverEl.contains(event.target)) return;
      if (instance.prevEl && instance.prevEl.contains(event.target)) return;
      if (instance.nextEl && instance.nextEl.contains(event.target)) return;
      closePopover(instance);
    });
  });

  global.addEventListener('resize', function () {
    instances.forEach(function (instance) {
      if (instance.popoverEl && !instance.popoverEl.hidden) positionPopover(instance);
    });
  });

  global.initAsOfPicker = initAsOfPicker;
  global.formatAsOfLabel = formatAsOfLabel;
})(window);
