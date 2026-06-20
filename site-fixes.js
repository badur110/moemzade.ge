// Moemzade.ge runtime polish — stable routing, filters, profile rendering, similar teachers, remote region
(function () {
  'use strict';

  var DEF = 'https://i.ibb.co/3y6km7Z9/711213407-122101682967350935-3629065519639735453-n.jpg';
  var FB = 'https://www.facebook.com/MoemzadeE/';
  var SHEET = '1weL4w0BzXGrYPIczj0kKYFdvE615OIMKSzIpt9Q1Yu0';
  var APPS = 'https://script.google.com/macros/s/AKfycbxVMDPiywAB_J7dT5foF_Fja1K4blC_XHRHK9pWuGnZU0neLVp2h3D8lGBXXX9GR4JRJw/exec';
  var PAGE_SIZE = 28;
  var sheetPromise = null;

  var state = { teachers: [], page: 1, cat: '', reg: '', settlement: '', fmt: '', q: '', active: '', temp: '', step: 1 };

  var CATEGORY_DATA = {
    'მუსიკა':['გიტარა','ფორტეპიანო / კლავიში','ვოკალი','სკრიპკა','დრამი','ბასი','უკულელე','DJ','მუსიკის თეორია','ხალხური ინსტრუმენტები','სხვა'],
    'ცეკვა':['ქართული ცეკვა','ბალეტი','ჰიპ-ჰოპი','ლათინო','სალსა','ბაჩატა','თანამედროვე ცეკვა','საბავშვო ცეკვა','წყვილური ცეკვა','სხვა'],
    'სილამაზე':['მაკიაჟი','ნეილ არტი','მანიკური','პედიკური','წარბები','წამწამები','თმის შეჭრა','თმის შეღებვა','კოსმეტოლოგია','მასაჟი','სხვა'],
    'სასკოლო საგნები':['მათემატიკა','ქართული ენა და ლიტერატურა','ინგლისური','რუსული','გერმანული','ფრანგული','ფიზიკა','ქიმია','ბიოლოგია','ისტორია','გეოგრაფია','სამოქალაქო განათლება','დაწყებითი კლასები','აბიტურიენტები','ეროვნული გამოცდები','სხვა'],
    'ტექნოლოგია':['პროგრამირება','ვებ-დეველოპმენტი','Python','JavaScript','HTML/CSS','React','WordPress','Excel','Google Sheets','Photoshop','Illustrator','Canva','UI/UX დიზაინი','კომპიუტერის საბაზისო სწავლება','სხვა'],
    'შემოქმედება':['ხატვა','ფერწერა','ფოტოგრაფია','ვიდეოგრაფია','მონტაჟი','მსახიობობა','ხელნაკეთი ნივთები','კერამიკა','დიზაინი','სხვა'],
    'ენები':['ინგლისური','რუსული','გერმანული','ფრანგული','იტალიური','ესპანური','თურქული','ჩინური','ქართული უცხოელებისთვის','სხვა'],
    'ხელსაქმე':['კერვა','ქარგვა','ქსოვა','ხელნაკეთი ნივთები','ავეჯის რესტავრაცია','ელექტროობა','სანტექნიკა','სხვა'],
    'სპორტი და ჯანმრთელობა':['ფიტნესი','იოგა','პილატესი','კრივი','ფეხბურთი','კალათბურთი','ცურვა','ჭადრაკი','რეაბილიტაცია','პერსონალური ტრენერი','სხვა'],
    'კულინარია':['კულინარია','საკონდიტრო','ტორტები','ქართული სამზარეულო','უცხოური სამზარეულო','ყავის მომზადება','სხვა'],
    'თეატრი და მედია':['მსახიობობა','სცენური მეტყველება','ტელე/რადიო წამყვანი','ვიდეო ბლოგინგი','სხვა'],
    'მართვა':['ავტომობილის მართვა','თეორია','პრაქტიკა','მოტო','სხვა'],
    'ბიზნესი და ფინანსები':['ბუღალტერია','მარკეტინგი','გაყიდვები','SMM','ბიზნესის დაწყება','ფინანსური განათლება','სხვა'],
    'სხვა':['სხვა']
  };

  var ICONS = {'მუსიკა':'🎵','ცეკვა':'💃','სილამაზე':'💅','სასკოლო საგნები':'🎓','ტექნოლოგია':'💻','შემოქმედება':'🎨','ენები':'🌍','ხელსაქმე':'🔧','სპორტი და ჯანმრთელობა':'🏋️','კულინარია':'🍳','თეატრი და მედია':'🎭','მართვა':'🚗','ბიზნესი და ფინანსები':'💼','სხვა':'📦'};
  var REGIONS = ['', 'დისტანციური','თბილისი','კახეთი','შიდა ქართლი','ქვემო ქართლი','მცხეთა-მთიანეთი','სამცხე-ჯავახეთი','იმერეთი','რაჭა-ლეჩხუმი და ქვემო სვანეთი','გურია','სამეგრელო-ზემო სვანეთი','აჭარა','აფხაზეთი'];
  var REGION_SETTLEMENTS = {
    'დისტანციური':['დისტანციური'],
    'თბილისი':['თბილისი'],
    'კახეთი':['თელავი','გურჯაანი','ყვარელი','სიღნაღი','ლაგოდეხი','ახმეტა','დედოფლისწყარო','საგარეჯო','წნორი','სხვა'],
    'შიდა ქართლი':['გორი','ხაშური','ქარელი','კასპი','სურამი','სხვა'],
    'ქვემო ქართლი':['რუსთავი','მარნეული','ბოლნისი','გარდაბანი','დმანისი','თეთრიწყარო','წალკა','კაზრეთი','სხვა'],
    'მცხეთა-მთიანეთი':['მცხეთა','დუშეთი','თიანეთი','სტეფანწმინდა','სხვა'],
    'სამცხე-ჯავახეთი':['ახალციხე','ბორჯომი','ახალქალაქი','ნინოწმინდა','ბაკურიანი','სხვა'],
    'იმერეთი':['ქუთაისი','ზესტაფონი','სამტრედია','წყალტუბო','ჭიათურა','საჩხერე','ხონი','ვანი','სხვა'],
    'რაჭა-ლეჩხუმი და ქვემო სვანეთი':['ამბროლაური','ონი','ცაგერი','ლენტეხი','სხვა'],
    'გურია':['ოზურგეთი','ლანჩხუთი','ჩოხატაური','ურეკი','სხვა'],
    'სამეგრელო-ზემო სვანეთი':['ზუგდიდი','ფოთი','სენაკი','მარტვილი','ხობი','წალენჯიხა','მესტია','სხვა'],
    'აჭარა':['ბათუმი','ქობულეთი','ხელვაჩაური','ქედა','შუახევი','ხულო','სარფი','გონიო','მახინჯაური','სხვა'],
    'აფხაზეთი':['სოხუმი','გაგრა','გუდაუთა','ოჩამჩირე','გალი','სხვა']
  };
  var FORMATS = ['', 'პირადად','ონლაინ','ორივე'];
  var FORMAT_LABELS = ['ნებისმიერი','პირადად','ონლაინ','ორივე'];

  function q(id) { return document.getElementById(id); }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (ch) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]; }); }
  function attr(v) { return esc(v); }
  function norm(v) { return String(v == null ? '' : v).toLowerCase().replace(/\s+/g, ' ').trim(); }
  function approved(v) { return ['კი','yes','true','1'].indexOf(norm(v)) !== -1; }
  function numericId(v) { var m = String(v || '').match(/(\d+)/); return m ? Number(m[1]) : 0; }
  function isOnline(format) { return ['კი','ონლაინ','ორივე','დისტანციური'].indexOf(norm(format)) !== -1; }
  function isOffline(format) { var f = norm(format); return ['პირადად','ორივე',''].indexOf(f) !== -1 || ['კი','ონლაინ','დისტანციური'].indexOf(f) === -1; }
  function formatLabel(format) { var on = isOnline(format), off = isOffline(format); if (on && off) return 'ორივე'; if (on) return 'ონლაინ'; return 'პირადად'; }
  function formatPrice(p, t) { if (!p || t === 'შეთანხმებით') return 'შეთანხმებით'; return p + '₾/' + ({'საათში':'სთ','თვეში':'თვე','კურსი':'კურსი'}[t] || 'სთ'); }
  function getPlace(t) { return norm(t.region) === 'დისტანციური' || norm(t.settlement) === 'დისტანციური' ? 'დისტანციური' : (t.settlement || t.region || 'საქართველო'); }
  function cleanPhoto(src) { src = String(src || '').trim(); return src ? src : DEF; }
  function remoteSelected() { return norm(q('region') && q('region').value) === 'დისტანციური' || norm((document.querySelector('input[name="format"]:checked') || {}).value) === 'ონლაინ'; }

  function injectCss() {
    if (q('mzRuntimeCss')) return;
    var s = document.createElement('style');
    s.id = 'mzRuntimeCss';
    s.textContent = '.dd-opt{position:relative;padding-left:16px}.dd-opt::before{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;background:#1D9E75;margin-right:10px;vertical-align:middle;opacity:.75}.dd-opt:first-child::before{background:#D7E8E1}.fp-chip{display:flex;align-items:center;gap:8px}.fp-chip::before{content:"";width:8px;height:8px;border-radius:50%;background:#1D9E75;opacity:.75}.fp-chip:first-child::before{background:#D7E8E1}.remote-help{margin-top:8px;font-size:12px;color:#0F6E56;background:#E8F8F3;border:1px solid #BFEADF;border-radius:12px;padding:9px 11px}.field.is-hidden{display:none!important}.tc-place,.similar-mini-body em{font-style:normal}.tc-place::before{content:"";display:inline-block;width:6px;height:6px;border-radius:50%;background:#1D9E75;margin-right:6px;vertical-align:middle}.tc-place{white-space:nowrap}.similar-mini-body em::before{content:"";display:inline-block;width:5px;height:5px;border-radius:50%;background:#1D9E75;margin-right:5px;vertical-align:middle}';
    document.head.appendChild(s);
  }

  function readSheet(force) {
    if (force) sheetPromise = null;
    if (sheetPromise) return sheetPromise;
    var url = 'https://docs.google.com/spreadsheets/d/' + SHEET + '/gviz/tq?tqx=out:json&sheet=teachers&t=' + Date.now();
    sheetPromise = fetch(url, { cache: 'no-store' }).then(function (r) { return r.text(); }).then(function (text) {
      var json = JSON.parse(text.substring(47).slice(0, -2));
      return (json.table.rows || []).map(function (row, idx) {
        var c = row.c || [];
        var t = { id: c[0] && c[0].v || '', name: c[1] && c[1].v || '', category: c[2] && c[2].v || '', subcat: c[3] && c[3].v || '', region: c[4] && c[4].v || '', settlement: c[5] && c[5].v || '', price: c[6] && c[6].v || '', priceType: c[7] && c[7].v || 'საათში', phone: c[8] && c[8].v || '', desc: c[11] && c[11].v || '', online: c[12] && c[12].v || '', photo: c[13] && c[13].v || '', date: c[14] && c[14].v || '', approved: c[15] && c[15].v || '' };
        t.id = String(t.id || (idx + 1)).trim(); t.sheetRow = idx + 2; t.rowIndex = idx; t.numId = numericId(t.id); return t;
      }).filter(function (t) { return t.name && approved(t.approved); });
    }).catch(function (e) { console.error('Sheet read failed', e); return []; });
    return sheetPromise;
  }

  function teacherUrl(t) { return '/teacher/?id=' + encodeURIComponent(t.id || '') + (t.sheetRow ? '&row=' + encodeURIComponent(t.sheetRow) : ''); }
  function renderCard(t) {
    return '<article class="teacher-card" data-teacher-id="' + attr(t.id) + '" data-sheet-row="' + attr(t.sheetRow || '') + '" tabindex="0" role="button" aria-label="' + attr(t.name) + ' პროფილის ნახვა">' +
      '<div class="tc-img"><img src="' + attr(cleanPhoto(t.photo)) + '" alt="' + attr(t.name) + '" loading="lazy" onerror="this.onerror=null;this.src=\'' + DEF + '\'"></div>' +
      '<div class="tc-body"><h3 class="tc-name">' + esc(t.name) + '</h3><p class="tc-sub">' + esc(t.subcat || t.category || 'მასწავლებელი') + '</p><div class="tc-meta-row"><span class="tc-place">' + esc(getPlace(t)) + '</span><span class="tc-format">' + esc(formatLabel(t.online)) + '</span></div><div class="tc-footer"><span class="tc-price">' + esc(formatPrice(t.price, t.priceType)) + '</span><span class="tc-open">ნახვა</span></div></div></article>';
  }
  function renderMiniCard(t) {
    return '<a class="similar-mini-card" href="' + attr(teacherUrl(t)) + '" aria-label="' + attr(t.name) + ' პროფილის ნახვა"><span class="similar-mini-img"><img src="' + attr(cleanPhoto(t.photo)) + '" alt="' + attr(t.name) + '" loading="lazy" onerror="this.onerror=null;this.src=\'' + DEF + '\'"></span><span class="similar-mini-body"><strong>' + esc(t.name) + '</strong><small>' + esc(t.subcat || t.category || 'მასწავლებელი') + '</small><em>' + esc(getPlace(t)) + '</em><b>' + esc(formatPrice(t.price, t.priceType)) + '</b></span></a>';
  }

  function setFooter() {
    var html = '<footer class="site-footer"><div class="container footer-grid"><div><a href="/" class="footer-brand"><span class="footer-brand-mark"></span><span class="footer-brand-name">Moemzade</span><span class="footer-brand-dot">.ge</span></a><p>საქართველოს მასწავლებლების, კურსებისა და ტრენერების უფასო საძიებო პლატფორმა.</p></div><div><h3>გვერდები</h3><a href="/">მთავარი</a><a href="/teachers/">მასწავლებლები</a><a href="/register/">პროფილის დამატება</a></div><div><h3>კონტაქტი</h3><a href="' + FB + '" target="_blank" rel="noopener" class="footer-social">Facebook გვერდი</a></div></div><div class="container footer-bottom"><span>© 2026 Moemzade.ge</span><span>Made in Georgia</span></div></footer>';
    var old = document.querySelector('.site-footer'); if (old) old.outerHTML = html; else document.body.insertAdjacentHTML('beforeend', html);
  }
  function removePopularSeoLinks() { document.querySelectorAll('#popularSeoLinks,.seo-links-section').forEach(function (el) { el.remove(); }); }
  function removeSortControls() { document.querySelectorAll('#sortTeachers,.sort-control').forEach(function (el) { var w = el.closest && el.closest('.sort-control'); (w || el).remove(); }); }
  function showImage(img, src, alt) { if (!img) return; img.hidden = false; img.removeAttribute('hidden'); img.style.display = 'block'; img.alt = alt || 'Moemzade.ge'; img.onerror = function () { this.onerror = null; this.src = DEF; }; img.src = cleanPhoto(src); }
  function hideSocials() { document.querySelectorAll('#instRow,#fbRow,.contact-btn-sec,.contact-btns-row').forEach(function (el) { el.remove(); }); }
  function hideRegisterSocials() { if (document.body.dataset.page !== 'register') return; ['instagram','facebook'].forEach(function (id) { var input = q(id); var field = input && input.closest('.field,.fg,.form-group,.input-group,label'); if (field) field.remove(); }); }

  function installCardClickGuard() {
    document.addEventListener('click', function (event) { var card = event.target.closest && event.target.closest('.teacher-card'); if (!card) return; event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation(); var id = card.getAttribute('data-teacher-id') || ''; var row = card.getAttribute('data-sheet-row') || ''; if (row || id) location.href = '/teacher/?id=' + encodeURIComponent(id) + (row ? '&row=' + encodeURIComponent(row) : ''); }, true);
    document.addEventListener('keydown', function (event) { if (event.key !== 'Enter' && event.key !== ' ') return; var card = event.target.closest && event.target.closest('.teacher-card'); if (!card) return; event.preventDefault(); card.click(); }, true);
  }

  function settlementOptions() {
    if (state.reg === 'დისტანციური') return ['', 'დისტანციური'];
    var base = state.reg ? (REGION_SETTLEMENTS[state.reg] || []) : Object.keys(REGION_SETTLEMENTS).filter(function (k) { return k !== 'დისტანციური'; }).reduce(function (arr, key) { return arr.concat(REGION_SETTLEMENTS[key]); }, []);
    var sheet = state.teachers.map(function (t) { return t.settlement; }).filter(function (v) { return v && norm(v) !== 'დისტანციური'; });
    return [''].concat(Array.from(new Set(base.concat(sheet))).filter(Boolean).sort(function (a, b) { return a.localeCompare(b, 'ka'); }));
  }
  function matchCat(t, cat) { if (!cat) return true; cat = norm(cat); return norm(t.category).indexOf(cat) !== -1 || norm(t.subcat).indexOf(cat) !== -1; }
  function matchRegion(t, reg) { if (!reg) return true; if (reg === 'დისტანციური') return norm(t.region) === 'დისტანციური' || isOnline(t.online); return norm(t.region).indexOf(norm(reg)) !== -1; }
  function filteredTeachers() {
    var query = norm(state.q);
    var list = state.teachers.filter(function (t) {
      var fmtOk = !state.fmt || (state.fmt === 'ონლაინ' ? isOnline(t.online) : state.fmt === 'პირადად' ? isOffline(t.online) && !isOnline(t.online) : state.fmt === 'ორივე' ? norm(t.online) === 'ორივე' : true);
      var settlementOk = !state.settlement || state.settlement === 'დისტანციური' || norm(t.settlement).indexOf(norm(state.settlement)) !== -1;
      return matchCat(t, state.cat) && matchRegion(t, state.reg) && settlementOk && fmtOk && (!query || [t.name,t.category,t.subcat,t.region,t.settlement,t.desc].some(function (v) { return norm(v).indexOf(query) !== -1; }));
    });
    return list.sort(function (a, b) { return (b.numId || b.sheetRow || 0) - (a.numId || a.sheetRow || 0); });
  }
  function updateFilterLabels() {
    var set = function (id, text) { var el = q(id); if (el) el.textContent = text; };
    set('pillCatLabel', state.cat || 'ყველა სფერო'); set('pillRegLabel', state.reg || 'ყველა რეგიონი'); set('pillSettlementLabel', state.reg === 'დისტანციური' ? 'არ სჭირდება ქალაქი' : (state.settlement || 'ქალაქი/სოფელი'));
    var fi = FORMATS.indexOf(state.fmt); set('pillFmtLabel', state.fmt ? (FORMAT_LABELS[fi] || state.fmt) : 'ნებისმიერი');
    [['pillCat', state.cat], ['pillReg', state.reg], ['pillSettlement', state.settlement || state.reg === 'დისტანციური'], ['pillFmt', state.fmt]].forEach(function (x) { var el = q(x[0]); if (el) el.classList.toggle('active', !!x[1]); });
  }
  function renderTeachersList() {
    var list = q('teachersList'), count = q('resultsCount'), pag = q('pagination'); if (!list) return;
    var f = filteredTeachers(); if (count) count.textContent = f.length + ' მასწავლებელი';
    if (!f.length) { list.innerHTML = '<div class="empty-state">ამ მონაცემებით მასწავლებელი ვერ მოიძებნა.</div>'; if (pag) pag.innerHTML = ''; return; }
    var total = Math.ceil(f.length / PAGE_SIZE); if (state.page > total) state.page = 1; var start = (state.page - 1) * PAGE_SIZE;
    list.innerHTML = f.slice(start, start + PAGE_SIZE).map(renderCard).join('');
    if (pag) { if (total <= 1) pag.innerHTML = ''; else { var html = '<button class="page-btn" type="button" onclick="changePage(' + (state.page - 1) + ')" ' + (state.page === 1 ? 'disabled' : '') + '>←</button>'; for (var i = 1; i <= total; i++) html += '<button class="page-btn' + (i === state.page ? ' active' : '') + '" type="button" onclick="changePage(' + i + ')">' + i + '</button>'; html += '<button class="page-btn" type="button" onclick="changePage(' + (state.page + 1) + ')" ' + (state.page === total ? 'disabled' : '') + '>→</button>'; pag.innerHTML = html; } }
    fixImages();
  }
  function openFilter(type) {
    state.active = type; state.temp = type === 'cat' ? state.cat : type === 'reg' ? state.reg : type === 'settlement' ? state.settlement : state.fmt;
    var o = q('filterOverlay'), title = q('fpTitle'), content = q('fpContent'); if (!o || !title || !content) return;
    var items = [];
    if (type === 'cat') { title.textContent = 'სფერო'; items = [''].concat(Object.keys(CATEGORY_DATA)); }
    else if (type === 'reg') { title.textContent = 'რეგიონი / დისტანციური'; items = REGIONS; }
    else if (type === 'settlement') { title.textContent = state.reg === 'დისტანციური' ? 'დისტანციური სწავლება' : 'ქალაქი / სოფელი'; items = settlementOptions(); }
    else { title.textContent = 'ფორმატი'; items = FORMATS; }
    content.innerHTML = '<div class="fp-chips">' + items.map(function (v, i) { var label = type === 'cat' ? (v ? (ICONS[v] || '') + ' ' + v : 'ყველა სფერო') : type === 'reg' ? (v || 'ყველა რეგიონი') : type === 'settlement' ? (v || (state.reg === 'დისტანციური' ? 'ყველა დისტანციური' : 'ყველა ქალაქი/სოფელი')) : (FORMAT_LABELS[i] || v); return '<div class="fp-chip' + ((v === state.temp) || (!v && !state.temp) ? ' sel' : '') + '" onclick="selectChip(this,\'' + attr(v) + '\')">' + esc(label) + '</div>'; }).join('') + '</div>';
    o.classList.add('open'); o.setAttribute('aria-hidden', 'false');
  }
  function closeFilter() { var o = q('filterOverlay'); if (o) { o.classList.remove('open'); o.setAttribute('aria-hidden', 'true'); } }
  function selectChip(el, v) { document.querySelectorAll('.fp-chip').forEach(function (c) { c.classList.remove('sel'); }); el.classList.add('sel'); state.temp = v; }
  function clearFilter() { state.temp = ''; document.querySelectorAll('.fp-chip').forEach(function (c) { c.classList.remove('sel'); }); var first = document.querySelector('.fp-chip'); if (first) first.classList.add('sel'); }
  function applyFilter() { if (state.active === 'cat') state.cat = state.temp; if (state.active === 'reg') { state.reg = state.temp; state.settlement = state.reg === 'დისტანციური' ? 'დისტანციური' : ''; } if (state.active === 'settlement') state.settlement = state.temp; if (state.active === 'fmt') state.fmt = state.temp; state.page = 1; updateFilterLabels(); closeFilter(); renderTeachersList(); }
  function changePage(n) { if (n < 1) return; state.page = n; renderTeachersList(); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  function initTeachersUpgrade() {
    if (document.body.dataset.page !== 'teachers') return;
    removeSortControls(); removePopularSeoLinks(); var params = new URLSearchParams(location.search), seo = window.MZ_SEO || {};
    state.cat = seo.cat || params.get('cat') || ''; state.reg = seo.reg || params.get('reg') || ''; state.settlement = seo.settlement || params.get('settlement') || ''; state.fmt = seo.fmt || params.get('fmt') || '';
    var search = q('teacherSearch'); if (search && !search.__mzSearch) { search.__mzSearch = true; search.addEventListener('input', function (e) { state.q = e.target.value.trim(); state.page = 1; renderTeachersList(); }); }
    readSheet(true).then(function (list) { state.teachers = list; updateFilterLabels(); renderTeachersList(); removeSortControls(); removePopularSeoLinks(); });
  }

  function renderProfile(t) {
    if (!t) return; document.title = t.name + ' — Moemzade.ge'; var set = function (id, v) { var el = q(id); if (el) el.textContent = v || '—'; };
    showImage(q('profPhoto'), t.photo, t.name); var ini = q('profInitials'); if (ini) ini.hidden = true;
    set('profName', t.name); set('profSubtitle', (t.subcat || t.category || 'მასწავლებელი') + (getPlace(t) ? ' · ' + getPlace(t) : ''));
    set('profCat', (t.subcat ? t.subcat + ' / ' : '') + (t.category || '')); set('profRegion', t.region); set('profSettlement', norm(t.region) === 'დისტანციური' ? 'არ საჭიროებს ქალაქს' : t.settlement); set('profPrice', formatPrice(t.price, t.priceType)); set('profPhone', t.phone); set('profDesc', t.desc); hideSocials();
    var badges = q('profBadges'); if (badges) badges.innerHTML = (isOnline(t.online) ? '<span class="profile-badge online">🌐 ონლაინ</span>' : '') + (isOffline(t.online) ? '<span class="profile-badge">🏠 პირადად</span>' : '') + (formatLabel(t.online) === 'ორივე' ? '<span class="profile-badge">✓ ორივე ფორმატი</span>' : '');
    var box = q('contactBtns'); if (box) { var ph = String(t.phone || '').replace(/[^0-9+]/g, ''); var geo = ph.replace(/^\+?995/, '').replace(/^0/, ''); box.innerHTML = t.phone ? '<a href="tel:' + attr(ph) + '" class="contact-btn-main">📞 დარეკვა — ' + esc(t.phone) + '</a><a href="https://wa.me/995' + attr(geo) + '" target="_blank" rel="noopener" class="contact-btn-main whatsapp">💬 WhatsApp-ზე მიწერა</a>' : '<div class="empty-state">საკონტაქტო ინფორმაცია არ არის მითითებული.</div>'; }
  }
  function findCurrent(list) { var p = new URLSearchParams(location.search), id = p.get('id') || '', row = p.get('row') || ''; var t = null; if (row) t = list.find(function (x) { return String(x.sheetRow) === String(row) || String(x.rowIndex) === String(row); }); if (!t && id) t = list.find(function (x) { return String(x.id) === String(id); }); if (!t && /^\d+$/.test(id)) t = list.find(function (x) { return String(x.numId) === String(id); }); return t; }
  function renderSimilar(current, list) {
    var old = q('similarTeachersSection'); if (old) old.remove(); if (!current) return;
    var similar = list.filter(function (t) { return String(t.sheetRow) !== String(current.sheetRow) && String(t.id) !== String(current.id) && norm(t.region) === norm(current.region) && norm(t.category) === norm(current.category); }).sort(function (a, b) { return (b.numId || 0) - (a.numId || 0); }).slice(0, 5);
    if (!similar.length) return;
    var href = '/teachers/?cat=' + encodeURIComponent(current.category || '') + '&reg=' + encodeURIComponent(current.region || '');
    var sec = document.createElement('section'); sec.className = 'similar-section container'; sec.id = 'similarTeachersSection'; sec.innerHTML = '<div class="section-head similar-head"><div><span class="section-kicker">შერჩეული პროფილები</span><h2>მსგავსი მასწავლებლები</h2><p>იგივე რეგიონსა და კატეგორიაში დამატებული პროფილები.</p></div><a href="' + href + '" class="text-link">ყველას ნახვა →</a></div><div class="similar-mini-grid">' + similar.map(renderMiniCard).join('') + '</div>';
    var body = document.querySelector('.profile-body'); if (body) body.after(sec); else { var foot = document.querySelector('.site-footer'); if (foot) foot.before(sec); } fixImages();
  }
  function initProfileUpgrade() { if (document.body.dataset.page !== 'profile') return; hideSocials(); readSheet(true).then(function (list) { var current = findCurrent(list); if (current) { renderProfile(current); renderSimilar(current, list); } else { var name = q('profName'); if (name) name.textContent = 'პროფილი ვერ მოიძებნა'; var desc = q('profDesc'); if (desc) desc.textContent = 'მასწავლებლის პროფილი ვერ მოიძებნა ან ჯერ დამტკიცებული არ არის.'; fixImages(); } }); }

  function fillSelect(select, values, placeholder, keep) {
    if (!select) return; var old = keep || select.value || ''; select.innerHTML = '<option value="">' + esc(placeholder) + '</option>' + values.map(function (v) { return '<option value="' + attr(v) + '">' + esc(v) + '</option>'; }).join(''); if (old && values.indexOf(old) !== -1) select.value = old;
  }
  function updateRegisterSettlement() {
    var region = q('region'), settlement = q('settlement'); if (!region || !settlement) return;
    var remote = remoteSelected(); var field = settlement.closest('.field'); var label = field && field.querySelector('label');
    if (remote) { region.value = 'დისტანციური'; fillSelect(settlement, ['დისტანციური'], 'დისტანციური სწავლება', 'დისტანციური'); settlement.value = 'დისტანციური'; settlement.disabled = true; if (field) field.classList.add('is-hidden'); var msg = q('remoteHelp'); if (!msg && region.closest('.field')) region.closest('.field').insertAdjacentHTML('beforeend', '<div id="remoteHelp" class="remote-help">ონლაინ ფორმატისთვის ქალაქის მითითება საჭირო არ არის.</div>'); }
    else { settlement.disabled = false; if (field) field.classList.remove('is-hidden'); var help = q('remoteHelp'); if (help) help.remove(); var opts = REGION_SETTLEMENTS[region.value] || []; fillSelect(settlement, opts.length ? opts : ['სხვა'], region.value ? 'აირჩიე ქალაქი/სოფელი' : 'ჯერ აირჩიე რეგიონი'); }
    if (label) label.innerHTML = remote ? 'ქალაქი / სოფელი' : 'ქალაქი / სოფელი <span>*</span>'; var err = q('err-settlement'); if (err && remote) err.style.display = 'none';
  }
  function validateRegStep(step) {
    var ok = true; function need(id, cond) { var el = q(id), er = q('err-' + id); var good = cond == null ? !!(el && String(el.value || '').trim()) : !!cond; if (el) el.classList.toggle('error', !good); if (er) er.style.display = good ? 'none' : 'block'; ok = good && ok; }
    if (step === 1) { need('name'); need('region'); updateRegisterSettlement(); if (!remoteSelected()) need('settlement'); else need('settlement', true); var priceOk = (q('priceType') && q('priceType').value === 'შეთანხმებით') || (q('price') && q('price').value); need('price', priceOk); var fmt = !!document.querySelector('input[name="format"]:checked'); var ferr = q('err-format'); if (ferr) ferr.style.display = fmt ? 'none' : 'block'; ok = fmt && ok; }
    if (step === 2) { need('category'); need('desc', q('desc') && q('desc').value.trim().length >= 30); }
    if (step === 3) need('phone'); return ok;
  }
  function setRegStep(next) {
    if (next > state.step && !validateRegStep(state.step)) return; var current = q('step' + state.step); if (current) current.classList.remove('active'); state.step = next; var panel = q('step' + state.step); if (panel) panel.classList.add('active');
    [1,2,3].forEach(function (i) { var dot = q('sn' + i); if (!dot) return; dot.classList.remove('active','done'); dot.textContent = i < state.step ? '✓' : i; if (i < state.step) dot.classList.add('done'); if (i === state.step) dot.classList.add('active'); }); var prog = q('progress'); if (prog) prog.style.width = (state.step * 33.333) + '%'; window.scrollTo({top:0, behavior:'smooth'});
  }
  function submitRegisterForm() {
    if (!validateRegStep(3)) return; updateRegisterSettlement(); var btn = q('submitBtn'); var subcat = (q('subcat') && q('subcat').value === 'სხვა') ? (q('customSubcat') && q('customSubcat').value.trim()) : (q('subcat') && q('subcat').value.trim()); var remote = remoteSelected();
    var data = { name: q('name') && q('name').value.trim(), category: q('category') && q('category').value.trim(), subcat: subcat || '', region: remote ? 'დისტანციური' : (q('region') && q('region').value.trim()), settlement: remote ? 'დისტანციური' : (q('settlement') && q('settlement').value === 'სხვა' ? (q('customSettlement') && q('customSettlement').value.trim()) : (q('settlement') && q('settlement').value.trim())), price: q('price') && q('price').value.trim(), priceType: q('priceType') && q('priceType').value.trim() || 'საათში', phone: q('phone') && q('phone').value.trim(), instagram: '', facebook: '', desc: q('desc') && q('desc').value.trim(), format: document.querySelector('input[name="format"]:checked') && document.querySelector('input[name="format"]:checked').value || '', online: document.querySelector('input[name="format"]:checked') && document.querySelector('input[name="format"]:checked').value || '', photo: q('photoUrl') && q('photoUrl').value.trim(), date: new Date().toLocaleString('ka-GE'), approved: 'არა' };
    if (btn) { btn.disabled = true; btn.textContent = 'იგზავნება...'; }
    fetch(APPS, { method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain;charset=utf-8'}, body: JSON.stringify(data) }).then(function () { var card = q('formCard'); if (card) card.hidden = true; var success = q('successCard'); if (success) success.hidden = false; window.scrollTo({top:0, behavior:'smooth'}); }).catch(function (e) { console.error(e); alert('გაგზავნა ვერ მოხერხდა. სცადე თავიდან.'); }).finally(function () { if (btn) { btn.disabled = false; btn.textContent = 'პროფილის გაგზავნა ✓'; } });
  }
  function initRegister() {
    if (document.body.dataset.page !== 'register') return; hideRegisterSocials(); state.step = document.querySelector('.step-panel.active') ? Number((document.querySelector('.step-panel.active').id || 'step1').replace('step','')) || 1 : 1;
    fillSelect(q('region'), REGIONS.slice(1), 'აირჩიე რეგიონი'); if (q('priceType') && !q('priceType').value) q('priceType').value = 'საათში'; updateRegisterSettlement();
    var region = q('region'); if (region && !region.__mzRemote) { region.__mzRemote = true; region.addEventListener('change', updateRegisterSettlement); }
    document.querySelectorAll('input[name="format"]').forEach(function (r) { if (!r.__mzRemote) { r.__mzRemote = true; r.addEventListener('change', updateRegisterSettlement); } });
    var img = q('photoImg'); if (img && !img.src) img.style.display = 'none'; window.goStep = setRegStep; window.submitForm = submitRegisterForm;
  }

  function polishHomeDropdowns() {
    var dd = q('ddReg'); if (dd) dd.innerHTML = REGIONS.map(function (r, i) { return '<div class="dd-opt' + (i === 0 ? ' active' : '') + '" data-val="' + attr(r) + '" onclick="pickOption(\'selReg\',\'ddReg\',\'reg\',this,event)">' + esc(r || 'ყველა რეგიონი') + '</div>'; }).join('');
    var sel = q('selReg'); if (sel && /📍/.test(sel.textContent || '')) sel.textContent = sel.textContent.replace(/📍\s*/g, '');
  }
  function fixImages() {
    document.querySelectorAll('.teacher-card .tc-img').forEach(function (box) { var img = box.querySelector('img'); if (!img) { box.innerHTML = '<img src="' + DEF + '" alt="Moemzade.ge" loading="lazy">'; img = box.querySelector('img'); } img.onerror = function () { this.onerror = null; this.src = DEF; }; if (!String(img.getAttribute('src') || '').trim()) img.src = DEF; });
    document.querySelectorAll('.similar-mini-img img').forEach(function (img) { img.onerror = function () { this.onerror = null; this.src = DEF; }; if (!String(img.getAttribute('src') || '').trim()) img.src = DEF; }); var p = q('profPhoto'); if (p && (!String(p.getAttribute('src') || '').trim() || p.hidden || p.style.display === 'none')) showImage(p, DEF, 'Moemzade.ge');
  }
  function init() {
    injectCss(); setFooter(); removePopularSeoLinks(); removeSortControls(); hideRegisterSocials(); installCardClickGuard(); initRegister(); initTeachersUpgrade(); initProfileUpgrade(); polishHomeDropdowns(); fixImages();
    window.openFilter = openFilter; window.closeFilter = closeFilter; window.selectChip = selectChip; window.clearFilter = clearFilter; window.applyFilter = applyFilter; window.changePage = changePage; window.openProfile = function (id) { if (id) location.href = '/teacher/?id=' + encodeURIComponent(id); };
    setTimeout(function () { removePopularSeoLinks(); removeSortControls(); hideRegisterSocials(); hideSocials(); initRegister(); polishHomeDropdowns(); fixImages(); }, 700);
    setTimeout(function () { removePopularSeoLinks(); removeSortControls(); hideRegisterSocials(); hideSocials(); initRegister(); polishHomeDropdowns(); fixImages(); }, 1600);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
