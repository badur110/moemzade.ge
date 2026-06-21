// Moemzade.ge — homepage latest teachers 6x3 showcase
(function () {
  'use strict';

  var GRID_ID = 'featuredTeachers';
  var SHEET_ID = (window.MOEMZADE_DATA_SOURCE && window.MOEMZADE_DATA_SOURCE.sheetId) || '1K7mQM7U-49gNkP0wb0wC8Y5ucvReOvoFIfivgj9FpVA';
  var SHEET_NAME = 'teachers';
  var DEFAULT_PHOTO = 'https://i.ibb.co/3y6km7Z9/711213407-122101682967350935-3629065519639735453-n.jpg';

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
    });
  }

  function attr(value) {
    return esc(value).replace(/`/g, '&#96;');
  }

  function normalize(value) {
    return String(value || '').trim();
  }

  function approved(value) {
    var v = normalize(value).toLowerCase();
    return v === 'კი' || v === 'yes' || v === 'true' || v === 'approved';
  }

  function priceText(price, type) {
    var p = normalize(price);
    var t = normalize(type) || 'საათში';
    if (!p || t === 'შეთანხმებით') return 'შეთ.';
    var short = t === 'საათში' ? 'სთ' : t === 'თვეში' ? 'თვე' : t === 'კურსი' ? 'კურსი' : t;
    return p + '₾/' + short;
  }

  function formatText(format) {
    var f = normalize(format).toLowerCase();
    if (f === 'ონლაინ' || f === 'კი') return 'ონლაინ';
    if (f === 'ორივე') return 'ორივე';
    return 'პირადად';
  }

  function placeText(t) {
    return t.settlement || t.region || '—';
  }

  function profileUrl(t) {
    var id = encodeURIComponent(t.id || '');
    return id ? ('/teacher/' + id + '/') : '/teachers/';
  }

  function parseTeachers(json) {
    var rows = (((json || {}).table || {}).rows || []);
    return rows.map(function (row, index) {
      var c = row.c || [];
      return {
        row: index + 2,
        id: normalize(c[0] && c[0].v),
        name: normalize(c[1] && c[1].v),
        category: normalize(c[2] && c[2].v),
        subcat: normalize(c[3] && c[3].v),
        region: normalize(c[4] && c[4].v),
        settlement: normalize(c[5] && c[5].v),
        price: normalize(c[6] && c[6].v),
        priceType: normalize(c[7] && c[7].v) || 'საათში',
        phone: normalize(c[8] && c[8].v),
        desc: normalize(c[11] && c[11].v),
        format: normalize(c[12] && c[12].v),
        photo: normalize(c[13] && c[13].v),
        date: normalize(c[14] && c[14].v),
        approved: normalize(c[15] && c[15].v)
      };
    }).filter(function (t) { return t.name && approved(t.approved); });
  }

  function fetchTeachers() {
    var url = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?tqx=out:json&sheet=' + encodeURIComponent(SHEET_NAME) + '&t=' + Date.now();
    return fetch(url)
      .then(function (res) { return res.text(); })
      .then(function (text) {
        var jsonText = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
        return parseTeachers(JSON.parse(jsonText));
      });
  }

  function card(t) {
    var img = t.photo || DEFAULT_PHOTO;
    return '<a class="latest-card" href="' + attr(profileUrl(t)) + '" aria-label="' + attr(t.name) + ' პროფილის ნახვა">' +
      '<span class="latest-img"><img src="' + attr(img) + '" alt="' + attr(t.name) + '" loading="lazy" onerror="this.onerror=null;this.src=\'' + DEFAULT_PHOTO + '\'"></span>' +
      '<span class="latest-body">' +
        '<strong>' + esc(t.name) + '</strong>' +
        '<small>' + esc(t.subcat || t.category || 'მასწავლებელი') + '</small>' +
        '<span class="latest-meta"><em>' + esc(placeText(t)) + '</em><b>' + esc(formatText(t.format)) + '</b></span>' +
        '<span class="latest-price">' + esc(priceText(t.price, t.priceType)) + '</span>' +
      '</span>' +
    '</a>';
  }

  function injectStyle() {
    if (document.getElementById('latestShowcaseStyle')) return;
    var css = '' +
      '.featured-grid{grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:12px!important}' +
      '.latest-card{display:flex;flex-direction:column;min-width:0;overflow:hidden;background:#fff;border:1px solid rgba(15,45,38,.08);border-radius:18px;box-shadow:0 14px 34px rgba(15,45,38,.055);transition:.18s ease;color:#10231F;text-decoration:none!important}' +
      '.latest-card:hover{transform:translateY(-3px);border-color:rgba(15,126,96,.22);box-shadow:0 22px 46px rgba(15,45,38,.10)}' +
      '.latest-img{display:block;width:100%;aspect-ratio:1/1;background:#E8F8F3;overflow:hidden}' +
      '.latest-img img{width:100%;height:100%;object-fit:cover;object-position:center top}' +
      '.latest-body{display:flex;flex-direction:column;gap:4px;padding:10px 10px 11px;min-width:0}' +
      '.latest-body strong{font-size:12.5px;line-height:1.25;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.latest-body small{font-size:10.8px;color:#6F7B75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.latest-meta{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-top:4px}' +
      '.latest-meta em,.latest-meta b{font-style:normal;font-size:9.6px;font-weight:850;border-radius:999px;padding:4px 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.latest-meta em{background:#F4F6F1;color:#6D7771;min-width:0}' +
      '.latest-meta b{background:#E8F8F3;color:#0F6E56;flex:0 0 auto}' +
      '.latest-price{margin-top:4px;font-size:11.5px;font-weight:950;color:#0F7B61}' +
      '@media(max-width:1180px){.featured-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important}}' +
      '@media(max-width:860px){.featured-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}}' +
      '@media(max-width:560px){.featured-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}.latest-body{padding:9px}.latest-img{aspect-ratio:1/1}}';
    var style = document.createElement('style');
    style.id = 'latestShowcaseStyle';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function render() {
    var grid = document.getElementById(GRID_ID);
    if (!grid) return;
    injectStyle();
    fetchTeachers().then(function (teachers) {
      var latest = teachers.slice(-18).reverse();
      grid.innerHTML = latest.length ? latest.map(card).join('') : '<div class="empty-state">ჯერ დამატებული მასწავლებლები არ არის.</div>';
    }).catch(function () {
      // Keep the default script output if this enhancement cannot load.
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(render, 250); });
  } else {
    setTimeout(render, 250);
  }
})();
