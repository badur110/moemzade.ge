// ===================== MOEMZADE.GE — clean frontend =====================
(() => {
  'use strict';

  const SHEET_ID = '1weL4w0BzXGrYPIczj0kKYFdvE615OIMKSzIpt9Q1Yu0';
  const SHEET_NAME = 'teachers';
  const PAGE_SIZE = 28;
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxVMDPiywAB_J7dT5foF_Fja1K4blC_XHRHK9pWuGnZU0neLVp2h3D8lGBXXX9GR4JRJw/exec';
  const IMGBB_KEY = '9bae22f8073c39773f9ce6190ef54fe2';
  const ROUTES = { home: 'index.html', teachers: 'teachers.html', teacher: 'teacher.html', register: 'register.html' };

  const CATEGORY_DATA = {
    'მუსიკა': ['გიტარა','ფორტეპიანო / კლავიში','ვოკალი','სკრიპკა','დრამი','ბასი','უკულელე','DJ','მუსიკის თეორია','ხალხური ინსტრუმენტები','სხვა'],
    'ცეკვა': ['ქართული ცეკვა','ბალეტი','ჰიპ-ჰოპი','ლათინო','სალსა','ბაჩატა','თანამედროვე ცეკვა','საბავშვო ცეკვა','წყვილური ცეკვა','სხვა'],
    'სილამაზე': ['მაკიაჟი','ნეილ არტი','მანიკური','პედიკური','წარბები','წამწამები','თმის შეჭრა','თმის შეღებვა','კოსმეტოლოგია','მასაჟი','სხვა'],
    'სასკოლო საგნები': ['მათემატიკა','ქართული ენა და ლიტერატურა','ინგლისური','რუსული','გერმანული','ფრანგული','ფიზიკა','ქიმია','ბიოლოგია','ისტორია','გეოგრაფია','სამოქალაქო განათლება','დაწყებითი კლასები','აბიტურიენტები','ეროვნული გამოცდები','სხვა'],
    'ტექნოლოგია': ['პროგრამირება','ვებ-დეველოპმენტი','Python','JavaScript','HTML/CSS','React','WordPress','Excel','Google Sheets','Photoshop','Illustrator','Canva','UI/UX დიზაინი','კომპიუტერის საბაზისო სწავლება','სხვა'],
    'შემოქმედება': ['ხატვა','ფერწერა','ფოტოგრაფია','ვიდეოგრაფია','მონტაჟი','მსახიობობა','ხელნაკეთი ნივთები','კერამიკა','დიზაინი','სხვა'],
    'ენები': ['ინგლისური','რუსული','გერმანული','ფრანგული','იტალიური','ესპანური','თურქული','ჩინური','ქართული უცხოელებისთვის','სხვა'],
    'ხელსაქმე': ['კერვა','ქარგვა','ქსოვა','ხელნაკეთი ნივთები','ავეჯის რესტავრაცია','ელექტროობა','სანტექნიკა','სხვა'],
    'სპორტი და ჯანმრთელობა': ['ფიტნესი','იოგა','პილატესი','კრივი','ფეხბურთი','კალათბურთი','ცურვა','ჭადრაკი','რეაბილიტაცია','პერსონალური ტრენერი','სხვა'],
    'კულინარია': ['კულინარია','საკონდიტრო','ტორტები','ქართული სამზარეულო','უცხოური სამზარეულო','ყავის მომზადება','სხვა'],
    'თეატრი და მედია': ['მსახიობობა','სცენური მეტყველება','ტელე/რადიო წამყვანი','ვიდეო ბლოგინგი','სხვა'],
    'მართვა': ['ავტომობილის მართვა','თეორია','პრაქტიკა','მოტო','სხვა'],
    'ბიზნესი და ფინანსები': ['ბუღალტერია','მარკეტინგი','გაყიდვები','SMM','ბიზნესის დაწყება','ფინანსური განათლება','სხვა'],
    'სხვა': ['სხვა']
  };

  const ICONS = {'მუსიკა':'🎵','ცეკვა':'💃','სილამაზე':'💅','სასკოლო საგნები':'🎓','ტექნოლოგია':'💻','შემოქმედება':'🎨','ენები':'🌍','ხელსაქმე':'🔧','სპორტი და ჯანმრთელობა':'🏋️','კულინარია':'🍳','თეატრი და მედია':'🎭','მართვა':'🚗','ბიზნესი და ფინანსები':'💼','სხვა':'📦'};
  const REGIONS = ['', 'თბილისი','კახეთი','შიდა ქართლი','ქვემო ქართლი','მცხეთა-მთიანეთი','სამცხე-ჯავახეთი','იმერეთი','რაჭა-ლეჩხუმი და ქვემო სვანეთი','გურია','სამეგრელო-ზემო სვანეთი','აჭარა','აფხაზეთი'];
  const REGION_SETTLEMENTS = {
    'თბილისი': ['თბილისი'],
    'კახეთი': ['თელავი','გურჯაანი','ყვარელი','სიღნაღი','ლაგოდეხი','ახმეტა','დედოფლისწყარო','საგარეჯო','წნორი','სხვა'],
    'შიდა ქართლი': ['გორი','ხაშური','ქარელი','კასპი','სურამი','სხვა'],
    'ქვემო ქართლი': ['რუსთავი','მარნეული','ბოლნისი','გარდაბანი','დმანისი','თეთრიწყარო','წალკა','კაზრეთი','სხვა'],
    'მცხეთა-მთიანეთი': ['მცხეთა','დუშეთი','თიანეთი','სტეფანწმინდა','სხვა'],
    'სამცხე-ჯავახეთი': ['ახალციხე','ბორჯომი','ახალქალაქი','ნინოწმინდა','ბაკურიანი','სხვა'],
    'იმერეთი': ['ქუთაისი','ზესტაფონი','სამტრედია','წყალტუბო','ჭიათურა','საჩხერე','ხონი','ვანი','სხვა'],
    'რაჭა-ლეჩხუმი და ქვემო სვანეთი': ['ამბროლაური','ონი','ცაგერი','ლენტეხი','სხვა'],
    'გურია': ['ოზურგეთი','ლანჩხუთი','ჩოხატაური','ურეკი','სხვა'],
    'სამეგრელო-ზემო სვანეთი': ['ზუგდიდი','ფოთი','სენაკი','მარტვილი','ხობი','წალენჯიხა','მესტია','სხვა'],
    'აჭარა': ['ბათუმი','ქობულეთი','ხელვაჩაური','ქედა','შუახევი','ხულო','სარფი','გონიო','მახინჯაური','სხვა'],
    'აფხაზეთი': ['სოხუმი','გაგრა','გუდაუთა','ოჩამჩირე','გალი','სხვა']
  };
  const FORMATS = ['', 'პირადად', 'ონლაინ', 'ორივე'];
  const FORMAT_LABELS = ['ნებისმიერი', 'პირადად', 'ონლაინ', 'ორივე'];
  const PRICE_TYPES = ['საათში', 'თვეში', 'კურსი', 'შეთანხმებით'];
  const BG_COLORS = ['bg-teal','bg-amber','bg-pink','bg-blue','bg-purple','bg-green'];
  const AV_COLORS = ['av-teal','av-amber','av-pink','av-blue','av-purple','av-green'];

  const state = {
    allTeachers: [],
    selectedCat: '',
    selectedReg: '',
    selectedSettlement: '',
    selectedFmt: '',
    searchQuery: '',
    currentPage: 1,
    activeFilter: '',
    tempVal: '',
    currentStep: 1
  };

  const $ = (id) => document.getElementById(id);
  const esc = (v) => String(v ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  const attr = esc;
  const stripEmoji = (s) => String(s || '').replace(/^[^\wა-ჰ]+/, '').trim();
  const getInitials = (name) => String(name || '').trim().split(/\s+/).map(w => w[0]).join('').substring(0,2).toUpperCase() || 'M';
  const colorIndex = (name) => { let h = 0; for (const c of String(name || '')) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff; return Math.abs(h) % BG_COLORS.length; };
  const val = (id) => $(id)?.value?.trim() || '';
  const checked = (name) => document.querySelector(`input[name="${name}"]:checked`)?.value || '';

  function formatPrice(price, type) {
    if (!price || type === 'შეთანხმებით') return 'შეთანხმებით';
    const unit = {'საათში':'სთ','თვეში':'თვე','კურსი':'კურსი'}[type] || 'სთ';
    return `${price}₾/${unit}`;
  }

  function getPlace(t) { return t.settlement || t.region || '—'; }
  function isOnline(format) { return ['კი','ონლაინ','ორივე'].includes(String(format || '').toLowerCase()); }
  function isOffline(format) { const f = String(format || '').toLowerCase(); return ['პირადად','ორივე',''].includes(f) || (!['კი','ონლაინ'].includes(f)); }
  function formatLabel(format) {
    const online = isOnline(format), offline = isOffline(format);
    if (online && offline) return 'ორივე';
    if (online) return 'ონლაინ';
    return 'პირადად';
  }

  async function fetchTeachers() {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&t=${Date.now()}`;
    try {
      const res = await fetch(url, { cache: 'no-store' });
      const text = await res.text();
      const json = JSON.parse(text.substring(47).slice(0, -2));
      return (json.table.rows || []).map((row, index) => {
        const c = row.c || [];
        const newSchema = c.length >= 16;
        const data = newSchema ? {
          id: c[0]?.v || '', name: c[1]?.v || '', category: c[2]?.v || '', subcat: c[3]?.v || '', region: c[4]?.v || '', settlement: c[5]?.v || '', price: c[6]?.v || '', priceType: c[7]?.v || 'საათში', phone: c[8]?.v || '', instagram: c[9]?.v || '', facebook: c[10]?.v || '', desc: c[11]?.v || '', online: c[12]?.v || '', photo: c[13]?.v || '', date: c[14]?.v || '', approved: c[15]?.v || ''
        } : {
          id: c[0]?.v || '', name: c[1]?.v || '', category: c[2]?.v || '', subcat: c[3]?.v || '', region: c[4]?.v || '', settlement: '', price: c[5]?.v || '', priceType: 'საათში', phone: c[6]?.v || '', instagram: c[7]?.v || '', facebook: c[8]?.v || '', desc: c[9]?.v || '', online: c[10]?.v || '', photo: c[11]?.v || '', date: c[12]?.v || '', approved: c[13]?.v || ''
        };
        data.id = String(data.id || index).trim();
        data.settlement = String(data.settlement || '').trim();
        data.approved = String(data.approved || '').trim().toLowerCase();
        return data;
      }).filter(t => t.name && ['კი','yes','true','1'].includes(t.approved));
    } catch (error) {
      console.error('Teachers fetch failed:', error);
      return [];
    }
  }

  function renderCard(t) {
    const ci = colorIndex(t.name);
    const image = t.photo
      ? `<img src="${attr(t.photo)}" alt="${attr(t.name)}" loading="lazy">`
      : `<div class="tc-avatar ${AV_COLORS[ci]}">${esc(getInitials(t.name))}</div>`;
    return `
      <article class="teacher-card scroll-reveal" data-teacher-id="${attr(t.id)}" tabindex="0" role="button" aria-label="${attr(t.name)} პროფილის ნახვა">
        <div class="tc-img ${BG_COLORS[ci]}">${image}</div>
        <div class="tc-body">
          <h3 class="tc-name">${esc(t.name)}</h3>
          <p class="tc-sub">${esc(t.subcat || t.category || 'მასწავლებელი')}</p>
          <div class="tc-meta-row"><span class="tc-place">📍 ${esc(getPlace(t))}</span><span class="tc-format">${esc(formatLabel(t.online))}</span></div>
          <div class="tc-footer"><span class="tc-price">${esc(formatPrice(t.price, t.priceType))}</span><span class="tc-open">ნახვა</span></div>
        </div>
      </article>`;
  }

  function initCardClicks() {
    document.addEventListener('click', (event) => {
      const card = event.target.closest('.teacher-card[data-teacher-id]');
      if (card) openProfile(card.dataset.teacherId);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const card = event.target.closest?.('.teacher-card[data-teacher-id]');
      if (card) { event.preventDefault(); openProfile(card.dataset.teacherId); }
    });
  }

  function initScrollReveal() {
    const items = document.querySelectorAll('.scroll-reveal');
    if (!('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('revealed')); return; }
    const obs = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); obs.unobserve(entry.target); }
    }), { threshold: 0.08 });
    items.forEach(el => obs.observe(el));
  }

  function renderCategories() {
    const grid = $('categoriesGrid');
    if (!grid) return;
    grid.innerHTML = Object.keys(CATEGORY_DATA).map(cat => `
      <a class="cat-card scroll-reveal" href="teachers.html?cat=${encodeURIComponent(cat)}">
        <span class="cat-icon">${ICONS[cat] || '📦'}</span>
        <span class="cat-name">${esc(cat)}</span>
      </a>`).join('');
  }

  function buildDropdown(ddId, items, selectedId, key) {
    const dd = $(ddId);
    if (!dd) return;
    dd.innerHTML = items.map((item, index) => `<div class="dd-opt${index === 0 ? ' active' : ''}" data-val="${attr(item.value)}" onclick="pickOption('${selectedId}','${ddId}','${key}',this,event)">${esc(item.label)}</div>`).join('');
  }

  function initIndexDropdowns() {
    const cats = [{ value: '', label: 'ყველა კატეგორია' }, ...Object.keys(CATEGORY_DATA).map(cat => ({ value: cat, label: `${ICONS[cat]} ${cat}` }))];
    const regs = [{ value: '', label: 'ყველა რეგიონი' }, ...REGIONS.slice(1).map(reg => ({ value: reg, label: `📍 ${reg}` }))];
    const fmts = FORMATS.map((fmt, i) => ({ value: fmt, label: FORMAT_LABELS[i] }));
    buildDropdown('ddCat', cats, 'selCat', 'cat');
    buildDropdown('ddReg', regs, 'selReg', 'reg');
    buildDropdown('ddFmt', fmts, 'selFmt', 'fmt');
  }

  function animateCounter(el, target, suffix = '') {
    if (!el) return;
    let current = 0;
    const inc = Math.max(1, target / 50);
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current) + suffix;
    }, 18);
  }

  async function initIndex() {
    initIndexDropdowns();
    renderCategories();
    state.allTeachers = await fetchTeachers();
    animateCounter($('statCount'), state.allTeachers.length, '+');
    if ($('statCats')) $('statCats').textContent = Object.keys(CATEGORY_DATA).length;
    if ($('statRegions')) $('statRegions').textContent = REGIONS.length - 1;
    const grid = $('featuredTeachers');
    if (grid) {
      const featured = state.allTeachers.slice(-8).reverse();
      grid.innerHTML = featured.length ? featured.map(renderCard).join('') : '<div class="empty-state">ჯერ დამატებული მასწავლებლები არ არის.</div>';
      setTimeout(initScrollReveal, 50);
    }
  }

  function filterTeachers() {
    const q = state.searchQuery.toLowerCase();
    return state.allTeachers.filter(t => {
      const format = String(t.online || '').toLowerCase();
      const catOk = !state.selectedCat || String(t.category).includes(state.selectedCat) || String(t.subcat).includes(state.selectedCat);
      const regOk = !state.selectedReg || String(t.region).toLowerCase().includes(state.selectedReg.toLowerCase());
      const settlementOk = !state.selectedSettlement || String(t.settlement).toLowerCase().includes(state.selectedSettlement.toLowerCase());
      const fmtOk = !state.selectedFmt || (state.selectedFmt === 'ონლაინ' ? isOnline(format) : state.selectedFmt === 'პირადად' ? !isOnline(format) || format === 'პირადად' : state.selectedFmt === 'ორივე' ? format === 'ორივე' : true);
      const qOk = !q || [t.name,t.category,t.subcat,t.region,t.settlement,t.desc].some(v => String(v || '').toLowerCase().includes(q));
      return catOk && regOk && settlementOk && fmtOk && qOk;
    });
  }

  function updateFilterLabels() {
    const set = (id, text) => { const el = $(id); if (el) el.textContent = text; };
    set('pillCatLabel', state.selectedCat || 'ყველა სფერო');
    set('pillRegLabel', state.selectedReg || 'ყველა რეგიონი');
    set('pillSettlementLabel', state.selectedSettlement || 'ქალაქი/სოფელი');
    const fmtIndex = FORMATS.indexOf(state.selectedFmt);
    set('pillFmtLabel', state.selectedFmt ? (FORMAT_LABELS[fmtIndex] || state.selectedFmt) : 'ნებისმიერი');
    [['pillCat', state.selectedCat], ['pillReg', state.selectedReg], ['pillSettlement', state.selectedSettlement], ['pillFmt', state.selectedFmt]].forEach(([id, value]) => $(id)?.classList.toggle('active', !!value));
  }

  function renderTeachers() {
    const list = $('teachersList');
    const count = $('resultsCount');
    const pagination = $('pagination');
    if (!list) return;
    const filtered = filterTeachers();
    if (count) count.textContent = `${filtered.length} მასწავლებელი`;
    if (!filtered.length) {
      list.innerHTML = '<div class="empty-state">ამ მონაცემებით მასწავლებელი ვერ მოიძებნა.</div>';
      if (pagination) pagination.innerHTML = '';
      return;
    }
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    if (state.currentPage > totalPages) state.currentPage = 1;
    const start = (state.currentPage - 1) * PAGE_SIZE;
    list.innerHTML = filtered.slice(start, start + PAGE_SIZE).map(renderCard).join('');
    setTimeout(initScrollReveal, 40);
    if (!pagination) return;
    if (totalPages <= 1) { pagination.innerHTML = ''; return; }
    let html = `<button class="page-btn" type="button" onclick="changePage(${state.currentPage - 1})" ${state.currentPage === 1 ? 'disabled' : ''}>←</button>`;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    pages.forEach(page => { html += `<button class="page-btn${page === state.currentPage ? ' active' : ''}" type="button" onclick="changePage(${page})">${page}</button>`; });
    html += `<button class="page-btn" type="button" onclick="changePage(${state.currentPage + 1})" ${state.currentPage === totalPages ? 'disabled' : ''}>→</button>`;
    pagination.innerHTML = html;
  }

  async function initTeachers() {
    state.allTeachers = await fetchTeachers();
    const params = new URLSearchParams(location.search);
    state.selectedCat = params.get('cat') || '';
    state.selectedReg = params.get('reg') || '';
    state.selectedSettlement = params.get('settlement') || '';
    state.selectedFmt = params.get('fmt') || '';
    const search = $('teacherSearch');
    if (search) search.addEventListener('input', e => { state.searchQuery = e.target.value.trim(); state.currentPage = 1; renderTeachers(); });
    updateFilterLabels();
    renderTeachers();
  }

  function settlementOptions() {
    const base = state.selectedReg ? (REGION_SETTLEMENTS[state.selectedReg] || []) : Object.values(REGION_SETTLEMENTS).flat();
    const fromSheet = state.allTeachers.map(t => t.settlement).filter(Boolean);
    return ['', ...Array.from(new Set([...base, ...fromSheet])).filter(Boolean).sort((a,b) => a.localeCompare(b, 'ka'))];
  }

  function openFilter(type) {
    state.activeFilter = type;
    state.tempVal = type === 'cat' ? state.selectedCat : type === 'reg' ? state.selectedReg : type === 'settlement' ? state.selectedSettlement : state.selectedFmt;
    const overlay = $('filterOverlay'), title = $('fpTitle'), content = $('fpContent');
    if (!overlay || !title || !content) return;
    let items = [];
    if (type === 'cat') { title.textContent = 'სფერო'; items = ['', ...Object.keys(CATEGORY_DATA)]; }
    else if (type === 'reg') { title.textContent = 'რეგიონი'; items = REGIONS; }
    else if (type === 'settlement') { title.textContent = 'ქალაქი / სოფელი'; items = settlementOptions(); }
    else { title.textContent = 'ფორმატი'; items = FORMATS; }
    content.innerHTML = `<div class="fp-chips">${items.map((value, index) => {
      const label = type === 'cat' ? (value ? `${ICONS[value] || ''} ${value}` : 'ყველა სფერო') : type === 'reg' ? (value || 'ყველა რეგიონი') : type === 'settlement' ? (value || 'ყველა ქალაქი/სოფელი') : FORMAT_LABELS[index];
      const selected = value === state.tempVal || (!value && !state.tempVal);
      return `<div class="fp-chip${selected ? ' sel' : ''}" onclick="selectChip(this,'${attr(value)}')">${esc(label)}</div>`;
    }).join('')}</div>`;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
  }

  function closeFilter() { const o = $('filterOverlay'); if (o) { o.classList.remove('open'); o.setAttribute('aria-hidden', 'true'); } }
  function selectChip(el, value) { document.querySelectorAll('.fp-chip').forEach(c => c.classList.remove('sel')); el.classList.add('sel'); state.tempVal = value; }
  function clearFilter() { state.tempVal = ''; document.querySelectorAll('.fp-chip').forEach(c => c.classList.remove('sel')); document.querySelector('.fp-chip')?.classList.add('sel'); }
  function applyFilter() {
    if (state.activeFilter === 'cat') state.selectedCat = state.tempVal;
    if (state.activeFilter === 'reg') { state.selectedReg = state.tempVal; state.selectedSettlement = ''; }
    if (state.activeFilter === 'settlement') state.selectedSettlement = state.tempVal;
    if (state.activeFilter === 'fmt') state.selectedFmt = state.tempVal;
    state.currentPage = 1;
    updateFilterLabels(); closeFilter(); renderTeachers();
  }

  function changePage(page) { if (page < 1) return; state.currentPage = page; renderTeachers(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function openProfile(id) { if (!id) return; location.href = `${ROUTES.teacher}?id=${encodeURIComponent(id)}`; }

  async function initProfile() {
    const id = new URLSearchParams(location.search).get('id');
    const teachers = await fetchTeachers();
    let t = teachers.find(item => String(item.id) === String(id));
    if (!t && /^\d+$/.test(id || '')) t = teachers[Number(id)];
    if (!t) { location.href = ROUTES.teachers; return; }
    document.title = `${t.name} — Moemzade.ge`;
    const ci = colorIndex(t.name);
    const wrap = $('profPhotoWrap'), img = $('profPhoto'), initials = $('profInitials');
    if (wrap) wrap.className = `profile-photo ${BG_COLORS[ci]}`;
    if (t.photo && img && initials) { img.src = t.photo; img.hidden = false; initials.hidden = true; img.alt = t.name; }
    else if (initials) initials.textContent = getInitials(t.name);
    const setText = (id, value) => { const el = $(id); if (el) el.textContent = value || '—'; };
    setText('profName', t.name);
    setText('profSubtitle', `${t.subcat || t.category || 'მასწავლებელი'}${t.settlement ? ' · ' + t.settlement : ''}`);
    setText('profCat', `${t.subcat ? t.subcat + ' / ' : ''}${t.category || '—'}`);
    setText('profRegion', t.region);
    setText('profSettlement', t.settlement);
    setText('profPrice', formatPrice(t.price, t.priceType));
    setText('profPhone', t.phone);
    setText('profDesc', t.desc);
    if (t.instagram) { $('instRow')?.removeAttribute('hidden'); setText('profInsta', '@' + String(t.instagram).replace('@','')); }
    if (t.facebook) { $('fbRow')?.removeAttribute('hidden'); setText('profFb', t.facebook); }
    const badges = $('profBadges');
    if (badges) {
      const label = formatLabel(t.online);
      badges.innerHTML = `${isOnline(t.online) ? '<span class="profile-badge online">🌐 ონლაინ</span>' : ''}${isOffline(t.online) ? '<span class="profile-badge">🏠 პირადად</span>' : ''}${label === 'ორივე' ? '<span class="profile-badge">✓ ორივე ფორმატი</span>' : ''}`;
    }
    renderContactButtons(t);
  }

  function renderContactButtons(t) {
    const box = $('contactBtns');
    if (!box) return;
    const clean = String(t.phone || '').replace(/[^\d+]/g, '');
    const geo = clean.replace(/^\+?995/, '').replace(/^0/, '');
    let html = '';
    if (t.phone) {
      html += `<a href="tel:${attr(clean)}" class="contact-btn-main">📞 დარეკვა — ${esc(t.phone)}</a>`;
      html += `<a href="https://wa.me/995${attr(geo)}" target="_blank" rel="noopener" class="contact-btn-main whatsapp">💬 WhatsApp-ზე მიწერა</a>`;
    }
    let socials = '';
    if (t.instagram) socials += `<a href="https://instagram.com/${attr(String(t.instagram).replace('@',''))}" target="_blank" rel="noopener" class="contact-btn-sec">📸 Instagram</a>`;
    if (t.facebook) {
      const fb = String(t.facebook).startsWith('http') ? t.facebook : `https://facebook.com/${t.facebook}`;
      socials += `<a href="${attr(fb)}" target="_blank" rel="noopener" class="contact-btn-sec">📘 Facebook</a>`;
    }
    if (socials) html += `<div class="contact-btns-row">${socials}</div>`;
    box.innerHTML = html || '<div class="empty-state">საკონტაქტო ინფორმაცია არ არის მითითებული.</div>';
  }

  function fillSelect(id, options, placeholder) {
    const select = $(id); if (!select) return;
    select.innerHTML = `<option value="">${esc(placeholder)}</option>` + options.map(o => `<option value="${attr(o)}">${esc(o)}</option>`).join('');
  }

  function initRegister() {
    fillSelect('region', REGIONS.slice(1), 'აირჩიე რეგიონი');
    fillSelect('category', Object.keys(CATEGORY_DATA), 'აირჩიე კატეგორია');
    fillSelect('priceType', PRICE_TYPES, 'აირჩიე ტიპი');
    const priceType = $('priceType');
    if (priceType) priceType.value = 'საათში';
    $('region')?.addEventListener('change', updateSettlementOptions);
    $('settlement')?.addEventListener('change', checkCustomSettlement);
    $('priceType')?.addEventListener('change', syncPriceByType);
    updateSubcat(); updateSettlementOptions(); syncPriceByType();
  }

  function updateSubcat() {
    const cat = val('category');
    const sub = $('subcat');
    if (!sub) return;
    const options = CATEGORY_DATA[cat] || [];
    sub.innerHTML = '<option value="">აირჩიე ქვეკატეგორია</option>' + options.map(o => `<option value="${attr(o)}">${esc(o)}</option>`).join('');
    checkCustomSubcat();
  }

  function checkCustomSubcat() {
    const wrap = $('customSubcatWrap');
    if (wrap) wrap.hidden = val('subcat') !== 'სხვა';
  }

  function updateSettlementOptions() {
    const reg = val('region');
    const settlement = $('settlement');
    if (!settlement) return;
    const options = REGION_SETTLEMENTS[reg] || [];
    settlement.innerHTML = options.length ? '<option value="">აირჩიე ქალაქი/სოფელი</option>' + options.map(o => `<option value="${attr(o)}">${esc(o)}</option>`).join('') : '<option value="">ჯერ აირჩიე რეგიონი</option><option value="სხვა">სხვა</option>';
    checkCustomSettlement();
  }

  function checkCustomSettlement() {
    const wrap = $('customSettlementWrap');
    if (wrap) wrap.hidden = val('settlement') !== 'სხვა';
  }

  function syncPriceByType() {
    const price = $('price');
    if (!price) return;
    if (val('priceType') === 'შეთანხმებით') { price.value = ''; price.placeholder = 'ფასი შეთანხმებით'; price.disabled = true; price.classList.remove('error'); }
    else { price.disabled = false; price.placeholder = 'მაგ: 40'; }
  }

  function selectRadio(label, name) {
    const group = name ? document.querySelectorAll(`input[name="${name}"]`) : document.querySelectorAll('.radio-item input');
    group.forEach(input => input.closest('.radio-item')?.classList.remove('selected'));
    const input = label.querySelector('input[type="radio"]');
    if (input) input.checked = true;
    label.classList.add('selected');
  }

  function setErr(id, show) { const e = $(`err-${id}`); if (e) e.style.display = show ? 'block' : 'none'; $(id)?.classList.toggle('error', !!show); }
  function requireField(id) { const ok = !!val(id); setErr(id, !ok); return ok; }

  function validateStep(step) {
    let ok = true;
    if (step === 1) {
      ok = requireField('name') && ok;
      ok = requireField('region') && ok;
      const settlement = val('settlement') === 'სხვა' ? val('customSettlement') : val('settlement');
      const settlementOk = !!settlement;
      setErr('settlement', !settlementOk); ok = settlementOk && ok;
      const priceOk = val('priceType') === 'შეთანხმებით' || !!val('price');
      setErr('price', !priceOk); ok = priceOk && ok;
      const formatOk = !!checked('format');
      const err = $('err-format'); if (err) err.style.display = formatOk ? 'none' : 'block'; ok = formatOk && ok;
    }
    if (step === 2) {
      ok = requireField('category') && ok;
      const descOk = val('desc').length >= 30;
      setErr('desc', !descOk); ok = descOk && ok;
    }
    if (step === 3) ok = requireField('phone') && ok;
    return ok;
  }

  function goStep(next) {
    if (next > state.currentStep && !validateStep(state.currentStep)) return;
    $(`step${state.currentStep}`)?.classList.remove('active');
    state.currentStep = next;
    $(`step${state.currentStep}`)?.classList.add('active');
    [1,2,3].forEach(i => {
      const dot = $(`sn${i}`); if (!dot) return;
      dot.classList.remove('active','done');
      dot.textContent = i < state.currentStep ? '✓' : i;
      if (i < state.currentStep) dot.classList.add('done');
      if (i === state.currentStep) dot.classList.add('active');
    });
    const progress = $('progress'); if (progress) progress.style.width = `${state.currentStep * 33.333}%`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handlePhoto(input) {
    const file = input.files?.[0];
    if (!file) return;
    const img = $('photoImg'), placeholder = document.querySelector('.photo-placeholder'), wrap = $('photoUploadWrap');
    const reader = new FileReader();
    reader.onload = (event) => {
      if (img) { img.src = event.target.result; img.hidden = false; }
      if (placeholder) placeholder.hidden = true;
      wrap?.classList.add('has-photo');
    };
    reader.readAsDataURL(file);
    await uploadPhoto(file);
  }

  async function uploadPhoto(file) {
    const status = $('uploadStatus');
    if (status) { status.className = 'upload-status uploading'; status.textContent = '⏳ ფოტო იტვირთება...'; }
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: 'POST', body: fd });
      const data = await res.json();
      if (!data.success) throw new Error('Upload failed');
      const photoUrl = $('photoUrl'); if (photoUrl) photoUrl.value = data.data.url;
      if (status) { status.className = 'upload-status done'; status.textContent = '✓ ფოტო ატვირთულია'; }
    } catch (error) {
      console.error(error);
      if (status) { status.className = 'upload-status error'; status.textContent = '⚠️ ატვირთვა ვერ მოხერხდა — შეგიძლია ფოტო გარეშე გააგრძელო'; }
    }
  }

  async function submitForm() {
    if (!validateStep(3)) return;
    const uploadStatus = $('uploadStatus');
    if (uploadStatus?.classList.contains('uploading')) { uploadStatus.textContent = '⏳ გთხოვთ დაიცადოთ, ფოტო იტვირთება...'; return; }
    const btn = $('submitBtn');
    const subcat = val('subcat') === 'სხვა' ? val('customSubcat') : val('subcat');
    const settlement = val('settlement') === 'სხვა' ? val('customSettlement') : val('settlement');
    const data = {
      name: val('name'), category: val('category'), subcat, region: val('region'), settlement,
      price: val('price'), priceType: val('priceType') || 'საათში', phone: val('phone'),
      instagram: val('instagram'), facebook: val('facebook'), desc: val('desc'),
      format: checked('format'), online: checked('format'), photo: val('photoUrl'),
      date: new Date().toLocaleString('ka-GE'), approved: 'არა'
    };
    try {
      if (btn) { btn.disabled = true; btn.textContent = 'იგზავნება...'; }
      await fetch(APPS_SCRIPT_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(data) });
      $('formCard')?.setAttribute('hidden', '');
      $('successCard')?.removeAttribute('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert('გაგზავნა ვერ მოხერხდა. სცადე თავიდან.');
      console.error(error);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'პროფილის გაგზავნა ✓'; }
    }
  }

  function toggleMenu() { $('mobileMenu')?.classList.toggle('open'); }
  function toggleDropdown(id, event) {
    event?.stopPropagation();
    const target = $(id);
    document.querySelectorAll('.dropdown').forEach(dd => { if (dd !== target) dd.classList.remove('open'); });
    target?.classList.toggle('open');
  }
  function pickOption(selectedId, ddId, key, el, event) {
    event?.stopPropagation();
    const value = el.dataset.val || '';
    const selected = $(selectedId); if (selected) selected.textContent = el.textContent;
    document.querySelectorAll(`#${ddId} .dd-opt`).forEach(opt => opt.classList.remove('active'));
    el.classList.add('active'); $(ddId)?.classList.remove('open');
    if (key === 'cat') state.selectedCat = value;
    if (key === 'reg') state.selectedReg = value;
    if (key === 'fmt') state.selectedFmt = value;
  }
  function doSearch() {
    const params = new URLSearchParams();
    if (state.selectedCat) params.set('cat', state.selectedCat);
    if (state.selectedReg) params.set('reg', state.selectedReg);
    if (state.selectedFmt) params.set('fmt', state.selectedFmt);
    location.href = `${ROUTES.teachers}${params.toString() ? '?' + params.toString() : ''}`;
  }
  function goSearch(cat) { location.href = `${ROUTES.teachers}?cat=${encodeURIComponent(stripEmoji(cat))}`; }

  function initPage() {
    initCardClicks();
    document.addEventListener('click', () => document.querySelectorAll('.dropdown').forEach(dd => dd.classList.remove('open')));
    const page = document.body.dataset.page;
    if (page === 'index') initIndex();
    if (page === 'teachers') initTeachers();
    if (page === 'profile') initProfile();
    if (page === 'register') initRegister();
    setTimeout(initScrollReveal, 80);
  }

  window.toggleMenu = toggleMenu;
  window.toggleDropdown = toggleDropdown;
  window.pickOption = pickOption;
  window.doSearch = doSearch;
  window.goSearch = goSearch;
  window.openFilter = openFilter;
  window.closeFilter = closeFilter;
  window.selectChip = selectChip;
  window.clearFilter = clearFilter;
  window.applyFilter = applyFilter;
  window.changePage = changePage;
  window.openProfile = openProfile;
  window.goStep = goStep;
  window.selectRadio = selectRadio;
  window.updateSubcat = updateSubcat;
  window.checkCustomSubcat = checkCustomSubcat;
  window.updateSettlementOptions = updateSettlementOptions;
  window.checkCustomSettlement = checkCustomSettlement;
  window.handlePhoto = handlePhoto;
  window.submitForm = submitForm;

  document.addEventListener('DOMContentLoaded', initPage);
})();
