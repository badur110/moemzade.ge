// Moemzade targeted runtime fixes
(function(){
  'use strict';

  var DEF = 'https://i.ibb.co/3y6km7Z9/711213407-122101682967350935-3629065519639735453-n.jpg';
  var FB = 'https://www.facebook.com/MoemzadeE/';
  var SHEET = '1weL4w0BzXGrYPIczj0kKYFdvE615OIMKSzIpt9Q1Yu0';

  function q(id){ return document.getElementById(id); }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
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
    if(profileImg && (!String(profileImg.getAttribute('src') || '').trim() || profileImg.hidden)){
      showImage(profileImg, DEF, 'Moemzade.ge');
      if(initials) initials.hidden = true;
    }
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

    if(x.inst){ var ir = q('instRow'); if(ir) ir.removeAttribute('hidden'); set('profInsta','@' + String(x.inst).replace('@','')); }
    if(x.fb){ var fr = q('fbRow'); if(fr) fr.removeAttribute('hidden'); set('profFb', x.fb); }

    var box = q('contactBtns');
    if(box){
      var ph = String(x.phone || '').replace(/[^0-9+]/g,''), geo = ph.replace(/^\+?995/,'').replace(/^0/,'');
      var h = '';
      if(x.phone){
        h += '<a href="tel:'+esc(ph)+'" class="contact-btn-main">📞 დარეკვა — '+esc(x.phone)+'</a>';
        h += '<a href="https://wa.me/995'+esc(geo)+'" target="_blank" rel="noopener" class="contact-btn-main whatsapp">💬 WhatsApp-ზე მიწერა</a>';
      }
      var soc = '';
      if(x.inst) soc += '<a href="https://instagram.com/'+esc(String(x.inst).replace('@',''))+'" target="_blank" rel="noopener" class="contact-btn-sec">📸 Instagram</a>';
      if(x.fb){ var f = String(x.fb).indexOf('http') === 0 ? x.fb : 'https://facebook.com/' + x.fb; soc += '<a href="'+esc(f)+'" target="_blank" rel="noopener" class="contact-btn-sec">📘 Facebook</a>'; }
      box.innerHTML = h + (soc ? '<div class="contact-btns-row">'+soc+'</div>' : '');
    }
  }

  function profileFix(){
    if(document.body.getAttribute('data-page') !== 'profile') return;
    var requestedId = new URLSearchParams(location.search).get('id') || '';
    if(!requestedId) return;

    fetch('https://docs.google.com/spreadsheets/d/'+SHEET+'/gviz/tq?tqx=out:json&sheet=teachers&t='+Date.now(), {cache:'no-store'})
      .then(function(r){ return r.text(); })
      .then(function(t){
        var j = JSON.parse(t.substring(47).slice(0,-2));
        var list = (j.table.rows || []).map(function(row, idx){
          var c = row.c || [], n = c.length >= 16;
          var x = n ? {
            id:c[0]?.v || '', name:c[1]?.v || '', cat:c[2]?.v || '', sub:c[3]?.v || '', reg:c[4]?.v || '', set:c[5]?.v || '', price:c[6]?.v || '', pt:c[7]?.v || 'საათში', phone:c[8]?.v || '', inst:c[9]?.v || '', fb:c[10]?.v || '', desc:c[11]?.v || '', fmt:c[12]?.v || '', photo:c[13]?.v || '', ok:c[15]?.v || ''
          } : {
            id:c[0]?.v || '', name:c[1]?.v || '', cat:c[2]?.v || '', sub:c[3]?.v || '', reg:c[4]?.v || '', set:'', price:c[5]?.v || '', pt:'საათში', phone:c[6]?.v || '', inst:c[7]?.v || '', fb:c[8]?.v || '', desc:c[9]?.v || '', fmt:c[10]?.v || '', photo:c[11]?.v || '', ok:c[13]?.v || ''
          };
          x.row = idx;
          x.id = String(x.id || idx).trim();
          return x;
        }).filter(function(x){ return x.name && approved(x.ok); });

        // Important: exact profile ID wins first. Row-index fallback is only for older links.
        var found = list.find(function(x){ return String(x.id) === String(requestedId); });
        if(!found && /^\d+$/.test(requestedId)) found = list.find(function(x){ return String(x.row) === String(requestedId); });
        if(found) renderProfile(found);
      })
      .catch(function(){ fixImages(); });
  }

  function init(){
    setFooter();
    fixImages();
    profileFix();
    setTimeout(fixImages, 700);
    setTimeout(fixImages, 1600);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
