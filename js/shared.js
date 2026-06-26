/**
 * Shared JavaScript utilities for Market Data screens.
 * Use this file in any screen that needs dropdown/panel/modal behavior.
 */
(function () {
    'use strict';

    window.MarketDataUI = window.MarketDataUI || {};

    /**
     * Register close-on-outside-click for a panel or dropdown.
     * @param {string} containerSelector - CSS selector for the panel/dropdown container (or trigger + panel).
     * @param {string} [triggerSelector] - Optional CSS selector for the trigger element (clicking it won't close).
     * @param {function} onClose - Callback when user clicks outside (e.g. to remove 'open' class).
     */
    function closeOnOutsideClick(containerSelector, triggerSelector, onClose) {
        if (typeof triggerSelector === 'function') {
            onClose = triggerSelector;
            triggerSelector = null;
        }
        document.addEventListener('click', function (e) {
            var container = document.querySelector(containerSelector);
            var trigger = triggerSelector ? document.querySelector(triggerSelector) : null;
            if (!container) return;
            var inside = container.contains(e.target) || (trigger && trigger.contains(e.target));
            if (!inside) onClose();
        });
    }

    /**
     * Show a modal by id (adds .visible to overlay).
     * @param {string} modalId - id of the modal overlay element.
     */
    function showModal(modalId) {
        var el = document.getElementById(modalId);
        if (el) el.classList.add('visible');
    }

    /**
     * Hide a modal by id (removes .visible from overlay).
     * @param {string} modalId - id of the modal overlay element.
     */
    function closeModal(modalId) {
        var el = document.getElementById(modalId);
        if (el) el.classList.remove('visible');
    }

    MarketDataUI.closeOnOutsideClick = closeOnOutsideClick;
    MarketDataUI.showModal = showModal;
    MarketDataUI.closeModal = closeModal;
})();
