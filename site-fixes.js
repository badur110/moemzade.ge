// Moemzade targeted runtime fixes
(function(){
  'use strict';

  var DEF = 'https://i.ibb.co/3y6km7Z9/711213407-122101682967350935-3629065519639735453-n.jpg';
  var FB = 'https://www.facebook.com/MoemzadeE/';
  var SHEET = '1weL4w0BzXGrYPIczj0kKYFdvE615OIMKSzIpt9Q1Yu0';
  var sheetPromise = null;
  var refreshTimer = null;

  function q(id){ return document.getElementById(id); }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function norm(s){ return String(s || '').toLowerCase().replace(/\s+/g,' ').trim(); }
  function compact(s){ return norm(s).replace(/[\s₾\/\-—]+/g,''); }
  function cleanPhoto(src){ src = String(src || '').trim(); return src || DEF; }
  function price(p,t){ if(!p || t === 'შეთანხმებით') return 'შეთანხმებით'; return p + '₾/' + ({'საათში':'სთ','თვეში':'თვე','კურსი':'კურსი'}[t] || 'სთ'); }
  function approved(v){ return ['კი','yes','true','1'].indexOf(String(v || '').toLowerCase().trim()) > -1; }

  function setFooter(){
    var html = '<footer class="site-footer"><div class="container footer-grid"><div><a href="index.html" class="footer-brand"><span class="footer-brand-mark">მ</span><span class="footer-brand-name">moemzade</span><span class="footer-brand-dot">.ge</span></a><p>საქართველოს მასწავლებლების, კურსებისა და ტრენერების უფასო საძიებო პლატფორმა.</p></div><div><h3>გვერდები</h3><a href="index.html">მთავარი</a><a href="teachers.html">მასწავლებლები</a><a href="register.html">პროფილის დამატება</a></div><div><h3>კონტაქტი</h3><a href="'+FB+'" target="_blank" rel="noopener" class="footer-social">📘 Facebook გვერდი</a></div></div><div class="container footer-bottom"><span>© 2026 Moemzade.ge</span><span>Made in Georgia</span></div></footer>';
    var old = document.querySelector('.site-footer');
    if(old) old.outerHTML = html;
    else document.body.insertAdjacentHTML('beforeend', html);
  }

  function showImage(img, src, alt){
    if(!img) return;
    img.hidden = false;
    img.removeAttribute('hidden');
    img.style.display = 'block';
    img.alt = alt || 'Moemzade.ge';
    img.onerror = function(){ this.onerror = null; this.src = DEF; };
    img.src = cleanPhoto(src);
  }

  function hideProfileSocials(){
    var instRow = q('instRow');
    var fbRow = q('fbRow');
    if(instRow) instRow.remove();
    if(fbRow) fbRow.remove();
    document.querySelectorAll('.contact-btn-sec, .contact-btns-row').forEach(function(el){ el.remove(); });
  }

  function hideRegisterSocials(){
    if(document.body.getAttribute('data-page') !== 'register' && !document.body.classList.contains('reg-page')) return;
    ['instagram','facebook'].forEach(function(id){
      var input = q(id);
      if(!input) return;
      var field = input.closest('.field,.fg,.form-group,.input-group');
      if(field) field.remove();
    });
    document.querySelectorAll('label').forEach(function(label){
      if(/instagram|facebook/i.test(label.textContent || '')){
        var field = label.closest('.field,.fg,.form-group,.input-group');
        if(field) field.remove();
      }
    });
  }

  function fixImages(){
    document.querySelectorAll('.teacher-card .tc-img').forEach(function(box){
      var img = box.querySelector('img');
      if(!img){
        box.innerHTML = '<img src="'+DEF+'" alt="Moemzade.ge" loading="lazy">';
        img = box.querySelector('img');
      }
      if(img){
        img.onerror = function(){ this.onerror = null; this.src = DEF; };
        if(!String(img.getAttribute('src') || '').trim()) img.src = DEF;
      }
    });

    var profileImg = q('profPhoto');
    var initials = q('profInitials');
    if(profileImg && (!String(profileImg.getAttribute('src') || '').trim() || profileImg.hidden || profileImg.style.display === 'none')){
      showImage(profileImg, DEF, 'Moemzade.ge');
      if(initials) initials.hidden = true;
    }
  }

  function readSheet(){
    if(sheetPromise) return sheetPromise;
    sheetPromise = fetch('https://docs.google.com/spreadsheets/d/'+SHEET+'/gviz/tq?tqx=out:json&sheet=teachers&t='+Date.now(), {cache:'no-store'})
      .then(function(r){ return r.text(); })
      .then(function(t){
        var j = JSON.parse(t.substring(47).slice(0,-2));
        return (j.table.rows || []).map(function(row, idx){
          var c = row.c || [], n = c.length >= 16;
          var x = n ? {
            id:c[0]?.v || '', name:c[1]?.v || '', cat:c[2]?.v || '', sub:c[3]?.v || '', reg:c[4]?.v || '', set:c[5]?.v || '', price:c[6]?.v || '', pt:c[7]?.v || 'საათში', phone:c[8]?.v || '', inst:c[9]?.v || '', fb:c[10]?.v || '', desc:c[11]?.v || '', fmt:c[12]?.v || '', photo:c[13]?.v || '', ok:c[15]?.v || ''
          } : {
            id:c[0]?.v || '', name:c[1]?.v || '', cat:c[2]?.v || '', sub:c[3]?.v || '', reg:c[4]?.v || '', set:'', price:c[5]?.v || '', pt:'საათში', phone:c[6]?.v || '', inst:c[7]?.v || '', fb:c[8]?.v || '', desc:c[9]?.v || '', fmt:c[10]?.v || '', photo:c[11]?.v || '', ok:c[13]?.v || ''
          };
          x.row = idx;
          x.sheetRow = idx + 2;
          x.id = String(x.id || ('row-'+x.sheetRow)).trim();
          x.nameKey = norm(x.name);
          x.subKey = norm(x.sub || x.cat);
          x.priceKey = compact(price(x.price, x.pt));
          return x;
        }).filter(function(x){ return x.name && approved(x.ok); });
      });
    return sheetPromise;
  }

  function cardData(card){
    return {
      id: String(card.getAttribute('data-teacher-id') || '').trim(),
      name: norm(card.querySelector('.tc-name')?.textContent || ''),
      sub: norm(card.querySelector('.tc-sub')?.textContent || ''),
      price: compact(card.querySelector('.tc-price')?.textContent || '')
    };
  }

  function resolveCard(card, list){
    var c = cardData(card);
    if(!c.name) return null;
    var exact = list.find(function(x){ return String(x.id) === c.id; });
    if(exact && exact.nameKey === c.name) return exact;

    var byName = list.filter(function(x){ return x.nameKey === c.name; });
    if(byName.length === 1) return byName[0];
    var byNameSub = byName.filter(function(x){ return !c.sub || x.subKey === c.sub; });
    if(byNameSub.length === 1) return byNameSub[0];
    var byFull = byNameSub.filter(function(x){ return !c.price || x.priceKey === c.price; });
    if(byFull.length) return byFull[0];
    return exact || null;
  }

  function applyCardRoutes(){
    var cards = Array.from(document.querySelectorAll('.teacher-card'));
    if(!cards.length) return;
    readSheet().then(function(list){
      cards.forEach(function(card){
        var x = resolveCard(card, list);
        if(!x) return;
        card.setAttribute('data-teacher-id', x.id);
        card.setAttribute('data-fixed-id', x.id);
        card.setAttribute('data-fixed-row', String(x.sheetRow));
        card.setAttribute('aria-label', x.name + ' პროფილის ნახვა');
      });
    }).catch(function(){});
  }

  function scheduleCardRoutes(){
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function(){ fixImages(); applyCardRoutes(); }, 80);
  }

  function installCardClickGuard(){
    document.addEventListener('click', function(event){
      var card = event.target.closest && event.target.closest('.teacher-card[data-fixed-id]');
      if(!card) return;
      var id = card.getAttribute('data-fixed-id');
      if(!id) return;
      var row = card.getAttribute('data-fixed-row') || '';
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      var url = 'teacher.html?id=' + encodeURIComponent(id);
      if(row) url += '&row=' + encodeURIComponent(row);
      location.href = url;
    }, true);
  }

  function watchCardContainers(){
    ['featuredTeachers','teachersList'].forEach(function(id){
      var el = q(id);
      if(!el || el.__moemzadeObserved) return;
      el.__moemzadeObserved = true;
      new MutationObserver(scheduleCardRoutes).observe(el, {childList:true, subtree:true});
    });
  }

  function renderProfile(x){
    if(!x) return;
    document.title = x.name + ' — Moemzade.ge';
    var set = function(id,v){ var el = q(id); if(el) el.textContent = v || '—'; };

    var img = q('profPhoto');
    var ini = q('profInitials');
    showImage(img, x.photo, x.name);
    if(ini) ini.hidden = true;

    set('profName', x.name);
    set('profSubtitle', (x.sub || x.cat || 'მასწავლებელი') + (x.set ? ' · ' + x.set : ''));
    set('profCat', (x.sub ? x.sub + ' / ' : '') + (x.cat || ''));
    set('profRegion', x.reg);
    set('profSettlement', x.set);
    set('profPrice', price(x.price, x.pt));
    set('profPhone', x.phone);
    set('profDesc', x.desc);
    hideProfileSocials();

    var badges = q('profBadges');
    if(badges){
      var fmt = String(x.fmt || '').toLowerCase();
      var online = ['კი','ონლაინ','ორივე'].indexOf(fmt) > -1;
      var offline = ['პირადად','ორივე',''].indexOf(fmt) > -1 || ['კი','ონლაინ'].indexOf(fmt) === -1;
      badges.innerHTML = (online ? '<span class="profile-badge online">🌐 ონლაინ</span>' : '') + (offline ? '<span class="profile-badge">🏠 პირადად</span>' : '') + (online && offline ? '<span class="profile-badge">✓ ორივე ფორმატი</span>' : '');
    }

    var box = q('contactBtns');
    if(box){
      var ph = String(x.phone || '').replace(/[^0-9+]/g,''), geo = ph.replace(/^\+?995/,'').replace(/^0/,'');
      var h = '';
      if(x.phone){
        h += '<a href="tel:'+esc(ph)+'" class="contact-btn-main">📞 დარეკვა — '+esc(x.phone)+'</a>';
        h += '<a href="https://wa.me/995'+esc(geo)+'" target="_blank" rel="noopener" class="contact-btn-main whatsapp">💬 WhatsApp-ზე მიწერა</a>';
      }
      box.innerHTML = h || '<div class="empty-state">საკონტაქტო ინფორმაცია არ არის მითითებული.</div>';
    }
  }

  function profileFix(){
    if(document.body.getAttribute('data-page') !== 'profile') return;
    hideProfileSocials();
    var params = new URLSearchParams(location.search);
    var requestedId = params.get('id') || '';
    var requestedRow = params.get('row') || '';
    if(!requestedId && !requestedRow) return;

    readSheet().then(function(list){
      var found = null;
      if(requestedRow){
        found = list.find(function(x){ return String(x.sheetRow) === String(requestedRow) || String(x.row) === String(requestedRow); });
      }
      if(!found && requestedId){
        found = list.find(function(x){ return String(x.id) === String(requestedId); });
      }
      if(!found && /^\d+$/.test(requestedId || '')){
        found = list.find(function(x){ return String(x.sheetRow) === String(Number(requestedId)) || String(x.row) === String(Number(requestedId)); });
      }
      if(found) renderProfile(found);
    }).catch(function(){ fixImages(); hideProfileSocials(); });
  }

  function init(){
    setFooter();
    hideRegisterSocials();
    installCardClickGuard();
    watchCardContainers();
    fixImages();
    applyCardRoutes();
    profileFix();
    setTimeout(function(){ hideRegisterSocials(); fixImages(); applyCardRoutes(); }, 700);
    setTimeout(function(){ hideRegisterSocials(); fixImages(); applyCardRoutes(); hideProfileSocials(); }, 1600);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();