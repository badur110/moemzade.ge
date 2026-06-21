// Moemzade.ge — teacher profile sharing
(function () {
  'use strict';

  var DEFAULT_PHOTO = 'https://i.ibb.co/3y6km7Z9/711213407-122101682967350935-3629065519639735453-n.jpg';

  function q(id) { return document.getElementById(id); }
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>'"]/g, function (ch) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[ch];
    });
  }
  function attr(v) { return esc(v); }
  function cleanId(id) {
    id = String(id || '').trim();
    var old = id.match(/TCH-(\d+)/i);
    if (old) return String(Number(old[1]));
    return id.replace(/^row-/, '');
  }
  function pathId() {
    var match = location.pathname.match(/\/teacher\/([^/]+)\/?$/);
    return match ? decodeURIComponent(match[1]) : '';
  }
  function queryId() { return new URLSearchParams(location.search).get('id') || ''; }
  function profileData() {
    var data = window.MZ_PROFILE || {};
    var name = data.name || (q('profName') && q('profName').textContent.trim()) || 'მასწავლებლის პროფილი';
    var subtitle = data.subtitle || data.subject || (q('profSubtitle') && q('profSubtitle').textContent.trim()) || 'Moemzade.ge';
    var photo = data.photo || (q('profPhoto') && q('profPhoto').getAttribute('src')) || DEFAULT_PHOTO;
    var id = cleanId(data.id || queryId() || pathId());
    var url = id ? location.origin + '/teacher/' + encodeURIComponent(id) + '/' : location.href.split('#')[0];
    return { id: id, name: name, subtitle: subtitle, photo: photo || DEFAULT_PHOTO, url: url };
  }
  function shareText(data) {
    return 'ნახე ეს მასწავლებელი Moemzade.ge-ზე — ' + data.name + ', ' + data.subtitle;
  }
  async function copyLink(data) {
    try {
      await navigator.clipboard.writeText(data.url);
      var done = q('shareCopyDone');
      if (done) { done.classList.add('show'); setTimeout(function () { done.classList.remove('show'); }, 2200); }
    } catch (e) {
      window.prompt('დააკოპირე ლინკი:', data.url);
    }
  }
  function openPanel(data) {
    var old = q('sharePanelBackdrop');
    if (old) old.remove();
    var encodedUrl = encodeURIComponent(data.url);
    var encodedText = encodeURIComponent(shareText(data));
    var div = document.createElement('div');
    div.className = 'share-panel-backdrop open';
    div.id = 'sharePanelBackdrop';
    div.innerHTML = '<div class="share-panel" role="dialog" aria-modal="true" aria-labelledby="shareTitle">' +
      '<div class="share-panel-head"><h3 id="shareTitle">გააზიარე პროფილი</h3><button class="share-panel-close" type="button" aria-label="დახურვა">×</button></div>' +
      '<div class="share-panel-body">' +
        '<div class="share-preview-card"><img src="' + attr(data.photo) + '" alt="' + attr(data.name) + '" onerror="this.onerror=null;this.src=\'' + DEFAULT_PHOTO + '\'"><div><strong>' + esc(data.name) + '</strong><span>' + esc(data.subtitle) + '</span></div></div>' +
        '<div class="share-actions">' +
          '<button class="share-action primary" type="button" id="shareCopyBtn">📋 ლინკის კოპირება</button>' +
          '<a class="share-action whatsapp" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodedText + '%20' + encodedUrl + '">💬 WhatsApp</a>' +
          '<a class="share-action" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl + '">📘 Facebook</a>' +
          '<a class="share-action" target="_blank" rel="noopener" href="https://www.messenger.com/t/?link=' + encodedUrl + '">📩 Messenger</a>' +
        '</div><div class="share-copy-done" id="shareCopyDone">ლინკი დაკოპირდა ✓</div>' +
      '</div></div>';
    document.body.appendChild(div);
    div.querySelector('.share-panel-close').addEventListener('click', function () { div.remove(); });
    div.addEventListener('click', function (e) { if (e.target === div) div.remove(); });
    q('shareCopyBtn').addEventListener('click', function () { copyLink(data); });
  }
  async function shareProfile() {
    var data = profileData();
    var payload = { title: data.name + ' — Moemzade.ge', text: shareText(data), url: data.url };
    if (navigator.share) {
      try { await navigator.share(payload); return; } catch (e) {}
    }
    openPanel(data);
  }
  function addShareButton() {
    if (q('shareProfileBtn')) return;
    var box = q('contactBtns') || document.querySelector('.profile-contact');
    if (!box) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'shareProfileBtn';
    btn.className = 'share-profile-btn';
    btn.textContent = '🔗 პროფილის გაზიარება';
    btn.addEventListener('click', shareProfile);
    box.appendChild(btn);
  }
  function init() {
    addShareButton();
    setTimeout(addShareButton, 700);
    setTimeout(addShareButton, 1600);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();