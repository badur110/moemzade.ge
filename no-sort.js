// Moemzade.ge — remove teacher sorting UI and keep the listing simple.
(function () {
  'use strict';

  function removeSortControls() {
    document.querySelectorAll('#sortTeachers, .sort-control').forEach(function (el) {
      var wrapper = el.closest && el.closest('.sort-control');
      (wrapper || el).remove();
    });

    var url = new URL(window.location.href);
    if (url.searchParams.has('sort')) {
      url.searchParams.delete('sort');
      window.history.replaceState({}, '', url.pathname + (url.search ? url.search : '') + url.hash);
    }
  }

  removeSortControls();
  document.addEventListener('DOMContentLoaded', removeSortControls);
  window.addEventListener('load', removeSortControls);

  var observer = new MutationObserver(removeSortControls);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
