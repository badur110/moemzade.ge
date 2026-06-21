// Homepage latest teachers: keep one row of 6 cards and centered CTA
(function () {
  'use strict';

  function applyLatestLayout() {
    var grid = document.getElementById('featuredTeachers');
    if (!grid) return;

    grid.classList.add('featured-one-row');

    var section = grid.closest('.section');
    if (section) {
      section.classList.add('latest-one-row-section');
      var topLink = section.querySelector('.section-head .text-link');
      if (topLink) topLink.style.display = 'none';
    }

    var cards = Array.prototype.slice.call(grid.children).filter(function (el) {
      return el.classList && (el.classList.contains('latest-card') || el.classList.contains('teacher-card'));
    });
    cards.forEach(function (card, index) {
      if (index >= 6) card.remove();
    });

    if (!document.getElementById('latestAllTeachersCta')) {
      var cta = document.createElement('div');
      cta.id = 'latestAllTeachersCta';
      cta.className = 'latest-all-cta';
      cta.innerHTML = '<a href="/teachers/" class="latest-all-btn">ყველა მასწავლებლის ნახვა →</a>';
      grid.insertAdjacentElement('afterend', cta);
    }
  }

  function injectStyle() {
    if (document.getElementById('latestRowOverrideStyle')) return;
    var style = document.createElement('style');
    style.id = 'latestRowOverrideStyle';
    style.textContent = [
      '.featured-one-row{grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:12px!important}',
      '.latest-one-row-section .section-head{align-items:flex-start!important}',
      '.latest-all-cta{display:flex;justify-content:center;margin-top:24px}',
      '.latest-all-btn{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:0 30px;border-radius:999px;background:#0F6E56;color:#fff!important;text-decoration:none!important;font-size:14px;font-weight:950;box-shadow:0 18px 42px rgba(15,110,86,.22);transition:.18s ease}',
      '.latest-all-btn:hover{transform:translateY(-2px);background:#0B5C48;box-shadow:0 24px 52px rgba(15,110,86,.28)}',
      '@media(max-width:1180px){.featured-one-row{grid-template-columns:repeat(3,minmax(0,1fr))!important}}',
      '@media(max-width:760px){.featured-one-row{grid-template-columns:repeat(2,minmax(0,1fr))!important}.latest-all-cta{margin-top:18px}.latest-all-btn{width:100%;max-width:340px}}',
      '@media(max-width:360px){.featured-one-row{grid-template-columns:1fr!important}}'
    ].join('');
    document.head.appendChild(style);
  }

  function boot() {
    injectStyle();
    applyLatestLayout();
    setTimeout(applyLatestLayout, 400);
    setTimeout(applyLatestLayout, 1200);
    setTimeout(applyLatestLayout, 2500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();