// Moemzade targeted runtime fixes
(function(){
  'use strict';

  var DEF = 'https://i.ibb.co/3y6km7Z9/711213407-122101682967350935-3629065519639735453-n.jpg';
  var FB = 'https://www.facebook.com/MoemzadeE/';
  var SHEET = '1weL4w0BzXGrYPIczj0kKYFdvE615OIMKSzIpt9Q1Yu0';
  var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxVMDPiywAB_J7dT5foF_Fja1K4blC_XHRHK9pWuGnZU0neLVp2h3D8lGBXXX9GR4JRJw/exec';
  var sheetPromise = null;
  var refreshTimer = null;

  function q(id){ return document.getElementById(id); }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function norm(s){ return String(s || '').toLowerCase().replace(/\s+/g,' ').trim(); }
  function compact(s){ return norm(s).replace(/[\s₾\/\-—]+/g,''); }
  function cleanPhoto(src){ src = String(src || '').trim(); return src || DEF; }
  function price(p,t){ if(!p || t === 'შეთანხმებით') return 'შეთანხმებით'; return p + '₾/' + ({'საათში':'სთ','თვეში':'თვე','კურსი':'კურსი'}[t] || 'სთ'); }
  function approved(v){ return ['კი','yes','true','1'].indexOf(String(v || '').toLowerCase().trim()) > -1; }
  function val(id){ return q(id)?.value?.trim() || ''; }
  function checked(name){ return document.querySelector('input[name="'+name+'"]:checked')?.value || ''; }
  function numericId(id){ var n = parseInt(String(id || '').replace(/[^0-9]/g,''), 10); return Number.isFinite(n) ? n : 0; }

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

  function readSheet(force){
    if(force) sheetPromise = null;
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
          x.id = String(x.id || '').trim();
          x.nameKey = norm(x.name);
          x.subKey = norm(x.sub || x.cat);
          x.priceKey = compact(price(x.price, x.pt));
          x.numId = numericId(x.id);
          return x;
        }).filter(function(x){ return x.name && approved(x.ok); });
      });
    return sheetPromise;
  }

  function nextId(list){
    var max = 0;
    (list || []).forEach(function(x){ if(x.numId > max) max = x.numId; });
    return String(max + 1);
  }

  function cardData(card){
    return {
      id: String(card.getAttribute('data-teacher-id') || card.getAttribute('data-fixed-id') || '').trim(),
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

  function teacherUrl(x){
    var id = x && x.id ? x.id : '';
    var url = 'teacher.html?id=' + encodeURIComponent(id);
    if(x && x.sheetRow) url += '&row=' + encodeURIComponent(x.sheetRow);
    return url;
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
      var card = event.target.closest && event.target.closest('.teacher-card');
      if(!card) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      var fixedId = card.getAttribute('data-fixed-id');
      var fixedRow = card.getAttribute('data-fixed-row');
      if(fixedId){
        location.href = 'teacher.html?id=' + encodeURIComponent(fixedId) + (fixedRow ? '&row=' + encodeURIComponent(fixedRow) : '');
        return;
      }

      readSheet(true).then(function(list){
        var x = resolveCard(card, list);
        if(x) location.href = teacherUrl(x);
        else {
          var fallback = card.getAttribute('data-teacher-id') || '';
          if(fallback) location.href = 'teacher.html?id=' + encodeURIComponent(fallback);
        }
      });
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

    readSheet(true).then(function(list){
      var found = null;
      if(requestedRow){
        found = list.find(function(x){ return String(x.sheetRow) === String(requestedRow) || String(x.row) === String(requestedRow); });
      }
      if(!found && requestedId){
        found = list.find(function(x){ return String(x.id) === String(requestedId); });
      }
      if(found) renderProfile(found);
    }).catch(function(){ fixImages(); hideProfileSocials(); });
  }

  function setErr(id, show){
    var el = q('err-' + id);
    var input = q(id);
    if(el) el.style.display = show ? 'block' : 'none';
    if(input) input.classList.toggle('error', !!show);
  }

  function validateRegister(){
    var ok = true;
    ['name','region','category','phone'].forEach(function(id){ var good = !!val(id); setErr(id, !good); ok = good && ok; });
    var settlement = val('settlement') === 'სხვა' ? val('customSettlement') : val('settlement');
    setErr('settlement', !settlement); ok = !!settlement && ok;
    var priceOk = val('priceType') === 'შეთანხმებით' || !!val('price');
    setErr('price', !priceOk); ok = priceOk && ok;
    var descOk = val('desc').length >= 30;
    setErr('desc', !descOk); ok = descOk && ok;
    var formatOk = !!checked('format');
    var err = q('err-format'); if(err) err.style.display = formatOk ? 'none' : 'block';
    ok = formatOk && ok;
    return ok;
  }

  async function submitNumericRegister(){
    if(!validateRegister()) return;
    var uploadStatus = q('uploadStatus');
    if(uploadStatus && uploadStatus.classList.contains('uploading')){
      uploadStatus.textContent = '⏳ გთხოვთ დაიცადოთ, ფოტო იტვირთება...';
      return;
    }
    var btn = q('submitBtn');
    var subcat = val('subcat') === 'სხვა' ? val('customSubcat') : val('subcat');
    var settlement = val('settlement') === 'სხვა' ? val('customSettlement') : val('settlement');
    try{
      if(btn){ btn.disabled = true; btn.textContent = 'იგზავნება...'; }
      var list = await readSheet(true).catch(function(){ return []; });
      var data = {
        id: nextId(list),
        name: val('name'), category: val('category'), subcat: subcat, region: val('region'), settlement: settlement,
        price: val('price'), priceType: val('priceType') || 'საათში', phone: val('phone'),
        instagram: '', facebook: '', desc: val('desc'),
        format: checked('format'), online: checked('format'), photo: val('photoUrl'),
        date: new Date().toLocaleString('ka-GE'), approved: 'არა'
      };
      await fetch(APPS_SCRIPT_URL, { method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain;charset=utf-8'}, body: JSON.stringify(data) });
      q('formCard')?.setAttribute('hidden','');
      q('successCard')?.removeAttribute('hidden');
      window.scrollTo({top:0, behavior:'smooth'});
    }catch(e){
      console.error(e);
      alert('გაგზავნა ვერ მოხერხდა. სცადე თავიდან.');
    }finally{
      if(btn){ btn.disabled = false; btn.textContent = 'პროფილის გაგზავნა ✓'; }
    }
  }

  function installRegisterSubmitGuard(){
    if(document.body.getAttribute('data-page') !== 'register') return;
    window.submitForm = submitNumericRegister;
    var btn = q('submitBtn');
    if(btn && !btn.__moemzadeSubmitGuard){
      btn.__moemzadeSubmitGuard = true;
      btn.addEventListener('click', function(event){
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        submitNumericRegister();
      }, true);
    }
  }

  function init(){
    setFooter();
    hideRegisterSocials();
    installRegisterSubmitGuard();
    installCardClickGuard();
    watchCardContainers();
    fixImages();
    applyCardRoutes();
    profileFix();
    setTimeout(function(){ hideRegisterSocials(); installRegisterSubmitGuard(); fixImages(); applyCardRoutes(); }, 700);
    setTimeout(function(){ hideRegisterSocials(); installRegisterSubmitGuard(); fixImages(); applyCardRoutes(); hideProfileSocials(); }, 1600);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();