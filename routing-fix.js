// Robust teacher card routing for Moemzade.ge
// Kept as a small fallback. Main routing is handled by site-fixes.js.
(function(){
  'use strict';
  var SHEET = '1weL4w0BzXGrYPIczj0kKYFdvE615OIMKSzIpt9Q1Yu0';
  var cache = null;

  function norm(v){ return String(v || '').toLowerCase().replace(/\s+/g,' ').trim(); }
  function compact(v){ return norm(v).replace(/[\s₾\/\-—]+/g,''); }
  function ok(v){ return ['კი','yes','true','1'].indexOf(String(v || '').toLowerCase().trim()) !== -1; }
  function price(p,t){ if(!p || t === 'შეთანხმებით') return 'შეთანხმებით'; return p + '₾/' + ({'საათში':'სთ','თვეში':'თვე','კურსი':'კურსი'}[t] || 'სთ'); }

  function readSheet(){
    if(cache) return cache;
    cache = fetch('https://docs.google.com/spreadsheets/d/'+SHEET+'/gviz/tq?tqx=out:json&sheet=teachers&t='+Date.now(), {cache:'no-store'})
      .then(function(r){ return r.text(); })
      .then(function(text){
        var json = JSON.parse(text.substring(47).slice(0,-2));
        return (json.table.rows || []).map(function(row, idx){
          var c = row.c || [];
          var t = {
            id: (c[0] && c[0].v) || '',
            name: (c[1] && c[1].v) || '',
            category: (c[2] && c[2].v) || '',
            subcat: (c[3] && c[3].v) || '',
            price: (c[6] && c[6].v) || '',
            priceType: (c[7] && c[7].v) || 'საათში',
            approved: (c[15] && c[15].v) || ''
          };
          t.sheetRow = idx + 2;
          t.id = String(t.id || ('row-'+t.sheetRow)).trim();
          t.nameKey = norm(t.name);
          t.subKey = norm(t.subcat || t.category);
          t.priceKey = compact(price(t.price, t.priceType));
          return t;
        }).filter(function(t){ return t.name && ok(t.approved); });
      });
    return cache;
  }

  function cardInfo(card){
    return {
      id: String(card.getAttribute('data-teacher-id') || '').trim(),
      row: String(card.getAttribute('data-sheet-row') || '').trim(),
      name: norm((card.querySelector('.tc-name') || {}).textContent || ''),
      sub: norm((card.querySelector('.tc-sub') || {}).textContent || ''),
      price: compact((card.querySelector('.tc-price') || {}).textContent || '')
    };
  }

  function resolve(card, list){
    var c = cardInfo(card);
    if(c.row){
      var byRow = list.find(function(t){ return String(t.sheetRow) === c.row; });
      if(byRow) return byRow;
    }
    var byName = list.filter(function(t){ return t.nameKey === c.name; });
    if(byName.length === 1) return byName[0];
    var bySub = byName.filter(function(t){ return !c.sub || t.subKey === c.sub; });
    if(bySub.length === 1) return bySub[0];
    var byPrice = bySub.filter(function(t){ return !c.price || t.priceKey === c.price; });
    if(byPrice.length) return byPrice[0];
    return list.find(function(t){ return String(t.id) === c.id; }) || null;
  }

  function url(t){
    var id = t && t.id ? t.id : 'row-'+(t && t.sheetRow ? t.sheetRow : '');
    return '/teacher/?id=' + encodeURIComponent(id) + (t && t.sheetRow ? '&row=' + encodeURIComponent(t.sheetRow) : '');
  }

  document.addEventListener('click', function(e){
    var card = e.target.closest && e.target.closest('.teacher-card');
    if(!card || card.__mzHandled) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    card.__mzHandled = true;
    readSheet().then(function(list){
      var t = resolve(card, list);
      if(t) location.href = url(t);
      else {
        var fallback = card.getAttribute('data-teacher-id');
        if(fallback) location.href = '/teacher/?id=' + encodeURIComponent(fallback);
      }
    }).catch(function(){ card.__mzHandled = false; });
  }, true);
})();
