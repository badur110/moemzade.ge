// Strict similar teachers for profile pages: same region + same category only
(function () {
  'use strict';

  var DEF = 'https://i.ibb.co/3y6km7Z9/711213407-122101682967350935-3629065519639735453-n.jpg';
  var SHEET = '1weL4w0BzXGrYPIczj0kKYFdvE615OIMKSzIpt9Q1Yu0';
  var sheetPromise = null;

  function q(id) { return document.getElementById(id); }
  function norm(v) { return String(v || '').trim().toLowerCase(); }
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>'"]/g, function (ch) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[ch];
    });
  }
  function attr(v) { return esc(v); }
  function approved(v) {
    var s = norm(v);
    return s === 'კი' || s === 'yes' || s === 'true' || s === '1' || s === 'approved';
  }
  function numericId(v) {
    var s = String(v || '').trim();
    var m = s.match(/TCH-(\d+)/i);
    if (m) return Number(m[1]);
    var n = Number(s);
    return isNaN(n) ? 0 : n;
  }
  function cleanPhoto(src) {
    src = String(src || '').trim();
    if (!src) return DEF;
    if (src.indexOf('drive.google.com') !== -1) {
      var m = src.match(/\/d\/([^/]+)/) || src.match(/[?&]id=([^&]+)/);
      if (m && m[1]) return 'https://drive.google.com/uc?export=view&id=' + m[1];
    }
    return src;
  }
  function formatPrice(price, type) {
    if (!price || type === 'შეთანხმებით') return 'შეთ.';
    return String(price) + '₾/' + ({ 'საათში':'სთ', 'თვეში':'თვე', 'კურსი':'კურსი' }[type] || 'სთ');
  }
  function getPlace(t) { return t.settlement || t.region || '—'; }
  function teacherUrl(t) {
    return '/teacher/?id=' + encodeURIComponent(t.id || '') + (t.sheetRow ? '&row=' + encodeURIComponent(t.sheetRow) : '');
  }
  function renderMiniCard(t) {
    return '<a class="similar-mini-card" href="' + attr(teacherUrl(t)) + '" aria-label="' + attr(t.name) + ' პროფილის ნახვა">' +
      '<span class="similar-mini-img"><img src="' + attr(cleanPhoto(t.photo)) + '" alt="' + attr(t.name) + '" loading="lazy" onerror="this.onerror=null;this.src=\'' + DEF + '\'"></span>' +
      '<span class="similar-mini-body"><strong>' + esc(t.name) + '</strong><small>' + esc(t.subcat || t.category || 'მასწავლებელი') + '</small><em>📍 ' + esc(getPlace(t)) + '</em><b>' + esc(formatPrice(t.price, t.priceType)) + '</b></span>' +
      '</a>';
  }

  function readSheet() {
    if (sheetPromise) return sheetPromise;
    var url = 'https://docs.google.com/spreadsheets/d/' + SHEET + '/gviz/tq?tqx=out:json&sheet=teachers&t=' + Date.now();
    sheetPromise = fetch(url)
      .then(function (r) { return r.text(); })
      .then(function (txt) {
        var json = JSON.parse(txt.substring(47).slice(0, -2));
        return (json.table.rows || []).map(function (row, idx) {
          var c = row.c || [];
          var t = {
            id: c[0] && c[0].v || '',
            name: c[1] && c[1].v || '',
            category: c[2] && c[2].v || '',
            subcat: c[3] && c[3].v || '',
            region: c[4] && c[4].v || '',
            settlement: c[5] && c[5].v || '',
            price: c[6] && c[6].v || '',
            priceType: c[7] && c[7].v || 'საათში',
            phone: c[8] && c[8].v || '',
            desc: c[11] && c[11].v || '',
            online: c[12] && c[12].v || '',
            photo: c[13] && c[13].v || '',
            date: c[14] && c[14].v || '',
            approved: c[15] && c[15].v || ''
          };
          t.id = String(t.id || (idx + 1)).trim();
          t.sheetRow = idx + 2;
          t.rowIndex = idx;
          t.numId = numericId(t.id);
          return t;
        }).filter(function (t) { return t.name && approved(t.approved); });
      })
      .catch(function (e) { console.error('Strict similar read failed', e); return []; });
    return sheetPromise;
  }

  function findCurrent(list) {
    var p = new URLSearchParams(location.search);
    var id = p.get('id') || '';
    var row = p.get('row') || '';
    var t = null;
    if (row) t = list.find(function (x) { return String(x.sheetRow) === String(row) || String(x.rowIndex) === String(row); });
    if (!t && id) t = list.find(function (x) { return String(x.id) === String(id); });
    if (!t && /^\d+$/.test(id)) t = list.find(function (x) { return String(x.numId) === String(id); });
    return t;
  }

  function renderStrictSimilar() {
    if (document.body && document.body.dataset.page !== 'profile') return;
    readSheet().then(function (list) {
      var current = findCurrent(list);
      var old = q('similarTeachersSection');
      if (old) old.remove();
      if (!current || !current.region || !current.category) return;

      var similar = list.filter(function (t) {
        var notSame = String(t.sheetRow) !== String(current.sheetRow) && String(t.id) !== String(current.id);
        return notSame && norm(t.region) === norm(current.region) && norm(t.category) === norm(current.category);
      }).sort(function (a, b) {
        var aSettlement = norm(a.settlement) === norm(current.settlement) ? 1 : 0;
        var bSettlement = norm(b.settlement) === norm(current.settlement) ? 1 : 0;
        var aSub = norm(a.subcat) === norm(current.subcat) ? 1 : 0;
        var bSub = norm(b.subcat) === norm(current.subcat) ? 1 : 0;
        return (bSettlement - aSettlement) || (bSub - aSub) || ((b.numId || b.sheetRow || 0) - (a.numId || a.sheetRow || 0));
      }).slice(0, 5);

      if (!similar.length) return;

      var href = '/teachers/?cat=' + encodeURIComponent(current.category) + '&reg=' + encodeURIComponent(current.region);
      var sec = document.createElement('section');
      sec.className = 'similar-section container';
      sec.id = 'similarTeachersSection';
      sec.innerHTML = '<div class="section-head similar-head"><div><span class="section-kicker">შერჩეული პროფილები</span><h2>მსგავსი მასწავლებლები</h2><p>იგივე რეგიონსა და კატეგორიაში დამატებული მასწავლებლები.</p></div><a href="' + attr(href) + '" class="text-link">ყველას ნახვა →</a></div><div class="similar-mini-grid">' + similar.map(renderMiniCard).join('') + '</div>';

      var body = document.querySelector('.profile-body');
      if (body) body.after(sec);
      else {
        var foot = document.querySelector('.site-footer');
        if (foot) foot.before(sec);
      }
    });
  }

  function start() {
    renderStrictSimilar();
    setTimeout(renderStrictSimilar, 700);
    setTimeout(renderStrictSimilar, 1600);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
