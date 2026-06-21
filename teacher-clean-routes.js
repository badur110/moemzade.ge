// Moemzade.ge — clean teacher profile URLs (/teacher/ID/)
(function () {
  'use strict';

  function cleanId(id) {
    id = String(id || '').trim();
    if (!id) return '';
    var old = id.match(/TCH-(\d+)/i);
    if (old) return String(Number(old[1]));
    return id.replace(/^row-/, '').trim();
  }

  function teacherUrl(id) {
    id = cleanId(id);
    return id ? '/teacher/' + encodeURIComponent(id) + '/' : '/teacher/';
  }

  function cardId(card) {
    return card && (card.getAttribute('data-teacher-id') || card.dataset.teacherId || '');
  }

  document.addEventListener('click', function (event) {
    var card = event.target.closest && event.target.closest('.teacher-card[data-teacher-id]');
    if (!card) return;

    var id = cardId(card);
    if (!id) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    location.href = teacherUrl(id);
  }, true);

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    var card = event.target.closest && event.target.closest('.teacher-card[data-teacher-id]');
    if (!card) return;
    event.preventDefault();
    location.href = teacherUrl(cardId(card));
  }, true);

  window.MZTeacherUrl = teacherUrl;
})();