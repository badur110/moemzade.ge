// Moemzade.ge — Facebook group / community CTAs + support links
(function () {
  'use strict';

  var GROUP_URL = 'https://www.facebook.com/groups/moemzade.ge';
  var PAGE_URL = 'https://www.facebook.com/MoemzadeE/';

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function findFooterColumn(footer, titlePart) {
    var found = null;
    qsa('h3', footer).forEach(function (h) {
      if ((h.textContent || '').trim().includes(titlePart)) found = h.parentElement;
    });
    return found;
  }

  function addFooterGroupLink() {
    qsa('.site-footer').forEach(function (footer) {
      if (footer.querySelector('[data-mz-footer-enhanced]')) return;
      footer.setAttribute('data-mz-footer-enhanced', '1');

      var pagesCol = findFooterColumn(footer, 'გვერდ');
      if (pagesCol) {
        if (!pagesCol.querySelector('a[href="/faq/"]')) {
          var faq = document.createElement('a');
          faq.href = '/faq/';
          faq.textContent = 'ხშირად დასმული კითხვები';
          pagesCol.appendChild(faq);
        }
        if (!pagesCol.querySelector('a[href="/rules/"]')) {
          var rules = document.createElement('a');
          rules.href = '/rules/';
          rules.textContent = 'წესები და კონფიდენციალურობა';
          pagesCol.appendChild(rules);
        }
      }

      var contactCol = findFooterColumn(footer, 'კონტაქტ');
      if (!contactCol) return;

      if (!contactCol.querySelector('[data-mz-page-link]')) {
        var page = document.createElement('a');
        page.href = PAGE_URL;
        page.target = '_blank';
        page.rel = 'noopener';
        page.className = 'footer-social';
        page.setAttribute('data-mz-page-link', '1');
        page.textContent = '📘 Facebook გვერდი';
        if (!qsa('a', contactCol).some(function(a){return a.href === PAGE_URL;})) contactCol.appendChild(page);
      }

      if (!contactCol.querySelector('[data-mz-group-link]')) {
        var a = document.createElement('a');
        a.href = GROUP_URL;
        a.target = '_blank';
        a.rel = 'noopener';
        a.className = 'footer-social footer-group-link';
        a.setAttribute('data-mz-group-link', '1');
        a.textContent = '👥 Moemzade ჯგუფი';
        contactCol.appendChild(a);
      }
    });
  }

  function addRegisterSuccessGroup() {
    var card = qs('#successCard');
    if (!card || card.querySelector('[data-mz-success-group]')) return;
    var box = document.createElement('div');
    box.className = 'success-community-box';
    box.setAttribute('data-mz-success-group', '1');
    box.innerHTML = '<div class="success-community-icon">👥</div>' +
      '<div class="success-community-copy"><strong>შემოუერთდი ჩვენს Facebook ჯგუფს</strong>' +
      '<p>ჯგუფში ხშირად შემოდიან მშობლები და მოსწავლეები, წერენ მოთხოვნებს და ეძებენ მასწავლებლებს. შეუერთდი, რომ მეტი ადამიანი გიპოვოს.</p></div>' +
      '<a class="btn btn-primary success-community-btn" target="_blank" rel="noopener" href="' + GROUP_URL + '">ჯგუფში გაწევრიანება →</a>';
    var back = card.querySelector('a.btn');
    if (back) card.insertBefore(box, back);
    else card.appendChild(box);
  }

  function addHomeCommunitySection() {
    if (document.body.dataset.page !== 'index') return;
    if (qs('[data-mz-home-community]')) return;
    var main = qs('main');
    if (!main) return;
    var dark = qs('.section-dark', main);
    var section = document.createElement('section');
    section.className = 'section community-section';
    section.setAttribute('data-mz-home-community', '1');
    section.innerHTML = '<div class="container community-card">' +
      '<div><span class="section-kicker">Moemzade საზოგადოება</span>' +
      '<h2>შემოდი ჯგუფში — აქ უფრო სწრაფად პოულობენ მასწავლებელს</h2>' +
      '<p>ჯგუფში შეგიძლია დაწერო რა გჭირდება, ნახო ახალი პროფილები, გაუზიარო მასწავლებელი მეგობარს და პირდაპირ იპოვო ადამიანი, ვინც რეალურად დაგეხმარება.</p></div>' +
      '<a href="' + GROUP_URL + '" target="_blank" rel="noopener" class="btn btn-primary community-btn">👥 Facebook ჯგუფში შესვლა</a>' +
      '</div>';
    if (dark) main.insertBefore(section, dark);
    else main.appendChild(section);
  }

  function addFloatingGroupForRegister() {
    if (document.body.dataset.page !== 'register') return;
    var hero = qs('.register-hero .container');
    if (!hero || hero.querySelector('[data-mz-register-group]')) return;
    var a = document.createElement('a');
    a.href = GROUP_URL;
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = 'register-group-pill';
    a.setAttribute('data-mz-register-group', '1');
    a.textContent = '👥 შემოდი ჯგუფში და იპოვე მოსწავლეები';
    hero.appendChild(a);
  }

  function init() {
    addFooterGroupLink();
    addRegisterSuccessGroup();
    addHomeCommunitySection();
    addFloatingGroupForRegister();
    setTimeout(addFooterGroupLink, 800);
    setTimeout(addRegisterSuccessGroup, 800);
    setTimeout(addHomeCommunitySection, 800);
    setTimeout(addFloatingGroupForRegister, 800);
    setTimeout(addRegisterSuccessGroup, 1800);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();