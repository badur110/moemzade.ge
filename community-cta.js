// Moemzade.ge — Facebook group / community CTAs
(function () {
  'use strict';

  var GROUP_URL = 'https://www.facebook.com/groups/moemzade.ge';

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function addFooterGroupLink() {
    qsa('.site-footer').forEach(function (footer) {
      if (footer.querySelector('[data-mz-group-link]')) return;
      var contactCol = null;
      qsa('h3', footer).forEach(function (h) {
        if ((h.textContent || '').trim().includes('კონტაქტ')) contactCol = h.parentElement;
      });
      if (!contactCol) return;
      var a = document.createElement('a');
      a.href = GROUP_URL;
      a.target = '_blank';
      a.rel = 'noopener';
      a.className = 'footer-social footer-group-link';
      a.setAttribute('data-mz-group-link', '1');
      a.textContent = '👥 Facebook ჯგუფი';
      contactCol.appendChild(a);
    });
  }

  function addRegisterSuccessGroup() {
    var card = qs('#successCard');
    if (!card || card.querySelector('[data-mz-success-group]')) return;
    var box = document.createElement('div');
    box.className = 'success-community-box';
    box.setAttribute('data-mz-success-group', '1');
    box.innerHTML = '<div class="success-community-icon">👥</div>' +
      '<div class="success-community-copy"><strong>შემოუერთდი Moemzade ჯგუფს</strong>' +
      '<p>ჯგუფში შეგიძლია მიიღო შეკითხვები, იპოვო მოსწავლეები და ნახო ახალი მოთხოვნები.</p></div>' +
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
      '<h2>შეუერთდი მასწავლებლებისა და მოსწავლეების ჯგუფს</h2>' +
      '<p>Facebook ჯგუფში მარტივად იპოვი ახალ მოთხოვნებს, გაუზიარებ შენს პროფილს და უფრო მეტ ადამიანს მიაწვდენ ხმას.</p></div>' +
      '<a href="' + GROUP_URL + '" target="_blank" rel="noopener" class="btn btn-primary community-btn">👥 ჯგუფში გაწევრიანება</a>' +
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
    a.textContent = '👥 შეუერთდი Facebook ჯგუფს';
    hero.appendChild(a);
  }

  function init() {
    addFooterGroupLink();
    addRegisterSuccessGroup();
    addHomeCommunitySection();
    addFloatingGroupForRegister();
    setTimeout(addFooterGroupLink, 800);
    setTimeout(addRegisterSuccessGroup, 800);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
