/**
 * Shared path helpers for mockup pages (site root vs fund-allocations/ vs actualization/).
 * Load before app-header.js and app-sidebar.js.
 */
(function (global) {
  'use strict';

  function pathSegments() {
    var p = (typeof location !== 'undefined' && location.pathname) || '';
    return p.split('/').filter(function (s) {
      return s.length > 0;
    });
  }

  function isUnderNamedFolder(name) {
    var segs = pathSegments();
    var target = String(name || '').toLowerCase();
    for (var i = 0; i < segs.length; i++) {
      try {
        if (decodeURIComponent(segs[i]).toLowerCase() === target) return true;
      } catch (e) {
        if (segs[i].toLowerCase() === target) return true;
      }
    }
    return false;
  }

  /** True when this page is served from the fund-allocations directory (any path depth). */
  function isUnderFundAllocationsFolder() {
    return isUnderNamedFolder('fund-allocations');
  }

  /** True when this page is served from the actualization directory (any path depth). */
  function isUnderActualizationFolder() {
    return isUnderNamedFolder('actualization');
  }

  /** True when this page is served from the trades directory (any path depth). */
  function isUnderTradesFolder() {
    return isUnderNamedFolder('trades');
  }

  /** True when this page is served from the certificate-inventory directory (any path depth). */
  function isUnderCertificateInventoryFolder() {
    return isUnderNamedFolder('certificate-inventory');
  }

  function rootPrefix() {
    return isUnderFundAllocationsFolder() ||
      isUnderActualizationFolder() ||
      isUnderTradesFolder() ||
      isUnderCertificateInventoryFolder()
      ? '../'
      : '';
  }

  global.__APP_PATH = {
    pathSegments: pathSegments,
    isUnderNamedFolder: isUnderNamedFolder,
    isUnderFundAllocationsFolder: isUnderFundAllocationsFolder,
    isUnderActualizationFolder: isUnderActualizationFolder,
    isUnderTradesFolder: isUnderTradesFolder,
    isUnderCertificateInventoryFolder: isUnderCertificateInventoryFolder,
    rootPrefix: rootPrefix
  };
})(typeof window !== 'undefined' ? window : this);
