import fs from 'node:fs/promises';
import path from 'node:path';

const SHEET_ID = '1K7mQM7U-49gNkP0wb0wC8Y5ucvReOvoFIfivgj9FpVA';
const SHEET_NAME = 'teachers';
const SITE = 'https://moemzade.ge';
const DEFAULT_PHOTO = 'https://i.ibb.co/3y6km7Z9/711213407-122101682967350935-3629065519639735453-n.jpg';
const FB = 'https://www.facebook.com/MoemzadeE/';
const PREVIEW = `${SITE}/preview.png`;

const STATIC_URLS = ['/', '/teachers/', '/register/', '/faq/', '/rules/'];

function esc(value = '') {
  return String(value ?? '').replace(/[&<>'"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[ch]));
}
function attr(value = '') { return esc(value); }
function norm(value = '') { return String(value ?? '').trim().toLowerCase(); }
function approved(value = '') { return ['კი','yes','true','1','approved'].includes(norm(value)); }
function cleanId(value = '') {
  const text = String(value ?? '').trim();
  const old = text.match(/TCH-(\d+)/i);
  return old ? String(Number(old[1])) : text.replace(/^row-/, '');
}
function cleanPhoto(src = '') {
  src = String(src ?? '').trim();
  if (!src) return DEFAULT_PHOTO;
  if (src.includes('drive.google.com')) {
    const match = src.match(/\/d\/([^/]+)/) || src.match(/[?&]id=([^&]+)/);
    if (match?.[1]) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return src;
}
function formatPrice(price, type) {
  if (!price || type === 'შეთანხმებით') return 'შეთანხმებით';
  return `${price}₾/${({ 'საათში':'სთ', 'თვეში':'თვე', 'კურსი':'კურსი' }[type] || 'სთ')}`;
}
function place(t) { return t.settlement || t.region || '—'; }
function subject(t) { return t.subcat || t.category || 'მასწავლებელი'; }
function teacherUrl(t) { return `${SITE}/teacher/${encodeURIComponent(cleanId(t.id))}/`; }
function localTeacherHref(t) { return `/teacher/${encodeURIComponent(cleanId(t.id))}/`; }
function waPhone(phone) { return String(phone || '').replace(/[^0-9+]/g, '').replace(/^\+?995/, '').replace(/^0/, ''); }
function shortDesc(t) {
  const parts = [subject(t), place(t), formatPrice(t.price, t.priceType)].filter(Boolean);
  return `${t.name} — ${parts.join(' · ')}. ნახე პროფილი Moemzade.ge-ზე.`;
}

const KA_TO_LAT = {
  'ა':'a','ბ':'b','გ':'g','დ':'d','ე':'e','ვ':'v','ზ':'z','თ':'t','ი':'i','კ':'k','ლ':'l','მ':'m','ნ':'n','ო':'o','პ':'p','ჟ':'zh','რ':'r','ს':'s','ტ':'t','უ':'u','ფ':'f','ქ':'q','ღ':'gh','ყ':'y','შ':'sh','ჩ':'ch','ც':'ts','ძ':'dz','წ':'ts','ჭ':'ch','ხ':'kh','ჯ':'j','ჰ':'h'
};
const CATEGORY_SLUGS = {
  'მუსიკა':'musika',
  'ცეკვა':'cekva',
  'სილამაზე':'silamaze',
  'სასკოლო საგნები':'saskolo-sagnebi',
  'ტექნოლოგია':'teqnologia',
  'შემოქმედება':'shemoqmedeba',
  'ენები':'enebi',
  'ხელსაქმე':'khelsakme',
  'სპორტი და ჯანმრთელობა':'sporti-da-janmrteloba',
  'კულინარია':'kulinaria',
  'თეატრი და მედია':'teatri-da-media',
  'მართვა':'martva',
  'ბიზნესი და ფინანსები':'biznesi-da-finansebi',
  'სხვა':'sxva'
};
const LOCATION_SLUGS = {
  'თბილისი':'tbilisi','ბათუმი':'batumi','ქუთაისი':'kutaisi','რუსთავი':'rustavi','ზუგდიდი':'zugdidi','ფოთი':'poti','გორი':'gori','თელავი':'telavi','ქობულეთი':'qobuleti','ბორჯომი':'borjomi','ახალციხე':'akhaltsikhe','მცხეთა':'mtskheta','ოზურგეთი':'ozurgeti','სამტრედია':'samtredia','ზესტაფონი':'zestafoni','სენაკი':'senaki','მარნეული':'marneuli','დისტანციური':'online',
  'აჭარა':'achara','იმერეთი':'imereti','კახეთი':'kakheti','შიდა ქართლი':'shida-qartli','ქვემო ქართლი':'qvemo-qartli','სამეგრელო-ზემო სვანეთი':'samegrelo-zemo-svaneti','გურია':'guria','სამცხე-ჯავახეთი':'samtskhe-javakheti','მცხეთა-მთიანეთი':'mtskheta-mtianeti','რაჭა-ლეჩხუმი და ქვემო სვანეთი':'racha-lechkhumi-qvemo-svaneti','აფხაზეთი':'afkhazeti'
};
function slugify(value = '') {
  const known = LOCATION_SLUGS[value] || CATEGORY_SLUGS[value];
  if (known) return known;
  const raw = String(value ?? '').trim().toLowerCase();
  const translit = Array.from(raw).map(ch => KA_TO_LAT[ch] || ch).join('');
  return translit.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-') || 'page';
}
function locationLabel(t) {
  const settlement = String(t.settlement || '').trim();
  if (settlement && norm(settlement) !== 'დისტანციური') return settlement;
  return t.region || 'დისტანციური';
}
function seoUrl(group) { return `${SITE}/teachers/${group.locationSlug}/${group.categorySlug}/`; }
function localSeoHref(group) { return `/teachers/${group.locationSlug}/${group.categorySlug}/`; }

async function fetchTeachers() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}&t=${Date.now()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google Sheet fetch failed: ${res.status}`);
  const text = await res.text();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  const json = JSON.parse(text.slice(start, end + 1));
  return (json.table.rows || []).map((row, index) => {
    const c = row.c || [];
    const t = {
      id: c[0]?.v || '',
      name: c[1]?.v || '',
      category: c[2]?.v || '',
      subcat: c[3]?.v || '',
      region: c[4]?.v || '',
      settlement: c[5]?.v || '',
      price: c[6]?.v || '',
      priceType: c[7]?.v || 'საათში',
      phone: c[8]?.v || '',
      desc: c[11]?.v || '',
      online: c[12]?.v || '',
      photo: c[13]?.v || '',
      date: c[14]?.v || '',
      approved: c[15]?.v || ''
    };
    t.id = cleanId(t.id || String(index + 1));
    t.sheetRow = index + 2;
    return t;
  }).filter(t => t.id && t.name && approved(t.approved));
}

function miniCard(t) {
  return `<a class="similar-mini-card" href="${attr(localTeacherHref(t))}" aria-label="${attr(t.name)} პროფილის ნახვა">
    <span class="similar-mini-img"><img src="${attr(cleanPhoto(t.photo))}" alt="${attr(t.name)}" loading="lazy" onerror="this.onerror=null;this.src='${DEFAULT_PHOTO}'"></span>
    <span class="similar-mini-body"><strong>${esc(t.name)}</strong><small>${esc(subject(t))}</small><em>${esc(place(t))}</em><b>${esc(formatPrice(t.price, t.priceType))}</b></span>
  </a>`;
}

function similarSection(current, all) {
  const similar = all
    .filter(t => String(t.id) !== String(current.id) && norm(t.region) === norm(current.region) && norm(t.category) === norm(current.category))
    .slice(0, 5);
  if (!similar.length) return '';
  const group = { locationSlug: slugify(current.region || current.settlement || 'დისტანციური'), categorySlug: slugify(current.category) };
  const href = localSeoHref(group);
  return `<section class="similar-section container" id="similarTeachersSection">
    <div class="section-head similar-head">
      <div><span class="section-kicker">შერჩეული პროფილები</span><h2>მსგავსი მასწავლებლები</h2><p>იგივე რეგიონსა და კატეგორიაში დამატებული მასწავლებლები.</p></div>
      <a href="${attr(href)}" class="text-link">ყველას ნახვა →</a>
    </div>
    <div class="similar-mini-grid">${similar.map(miniCard).join('')}</div>
  </section>`;
}

function pageHtml(t, all) {
  const url = teacherUrl(t);
  const photo = cleanPhoto(t.photo);
  const title = `${t.name} — ${subject(t)} | Moemzade.ge`;
  const desc = shortDesc(t);
  const geo = waPhone(t.phone);
  const contact = t.phone ? `<a href="tel:${attr(String(t.phone).replace(/[^0-9+]/g, ''))}" class="contact-btn-main">📞 დარეკვა — ${esc(t.phone)}</a><a href="https://wa.me/995${attr(geo)}" target="_blank" rel="noopener" class="contact-btn-main whatsapp">💬 WhatsApp-ზე მიწერა</a>` : '<div class="empty-state">საკონტაქტო ინფორმაცია არ არის მითითებული.</div>';
  return `<!DOCTYPE html>
<html lang="ka">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <base href="/">
  <title>${esc(title)}</title>
  <meta name="description" content="${attr(desc)}">
  <meta name="theme-color" content="#0F6E56">
  <link rel="canonical" href="${attr(url)}">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <meta property="og:type" content="profile">
  <meta property="og:url" content="${attr(url)}">
  <meta property="og:title" content="${attr(title)}">
  <meta property="og:description" content="${attr(desc)}">
  <meta property="og:image" content="${attr(photo)}">
  <meta property="og:image:alt" content="${attr(t.name)} — Moemzade.ge">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${attr(title)}">
  <meta name="twitter:description" content="${attr(desc)}">
  <meta name="twitter:image" content="${attr(photo)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="site-fixes.css">
  <link rel="stylesheet" href="teacher-share.css">
  <link rel="stylesheet" href="photo-lightbox.css?v=20260621-zoom">
  <link rel="stylesheet" href="mobile-responsive.css?v=20260621-mobile">
</head>
<body data-page="profile">
  <nav class="nav" aria-label="მთავარი ნავიგაცია"><div class="nav-inner"><a href="/" class="brand"><img src="logo.svg" alt="Moemzade.ge" class="brand-img"></a><div class="nav-links"><a href="/teachers/">← მასწავლებლები</a><a href="/register/" class="btn btn-primary btn-small">+ პროფილის დამატება</a></div></div></nav>
  <header class="profile-hero"><div class="container"><a href="/teachers/" class="back-link">← უკან დაბრუნება</a><div class="profile-top"><div class="profile-photo" id="profPhotoWrap"><img id="profPhoto" src="${attr(photo)}" alt="${attr(t.name)}" onerror="this.onerror=null;this.src='${DEFAULT_PHOTO}'"></div><div class="profile-title"><h1 id="profName">${esc(t.name)}</h1><p id="profSubtitle">${esc(subject(t))}${place(t) ? ' · ' + esc(place(t)) : ''}</p><div class="profile-badges" id="profBadges"><span class="profile-badge">${esc(t.online || 'პირადად')}</span></div></div></div></div></header>
  <main class="profile-body container"><aside class="profile-card info-card"><div class="info-row"><span>სფერო</span><strong id="profCat">${esc(t.subcat ? t.subcat + ' / ' + t.category : t.category)}</strong></div><div class="info-row"><span>რეგიონი</span><strong id="profRegion">${esc(t.region)}</strong></div><div class="info-row"><span>ქალაქი / სოფელი</span><strong id="profSettlement">${esc(t.settlement || '—')}</strong></div><div class="info-row"><span>ფასი</span><strong id="profPrice" class="green">${esc(formatPrice(t.price, t.priceType))}</strong></div><div class="info-row"><span>ტელეფონი</span><strong id="profPhone">${esc(t.phone)}</strong></div></aside><section class="profile-main"><div class="profile-card profile-desc-card"><span class="section-kicker">აღწერა</span><p id="profDesc">${esc(t.desc || '—')}</p></div><div class="profile-card profile-contact" id="contactBtns">${contact}</div></section></main>
  ${similarSection(t, all)}
  <footer class="site-footer"><div class="container footer-grid"><div><img src="logo.svg" alt="Moemzade.ge" class="footer-logo"><p>საქართველოს მასწავლებლების, კურსებისა და ტრენერების უფასო საძიებო პლატფორმა.</p></div><div><h3>გვერდები</h3><a href="/">მთავარი</a><a href="/teachers/">მასწავლებლები</a><a href="/register/">პროფილის დამატება</a></div><div><h3>კონტაქტი</h3><a href="${FB}" target="_blank" rel="noopener" class="footer-social">Facebook გვერდი</a></div></div><div class="container footer-bottom"><span>© 2026 Moemzade.ge</span><span>Made in Georgia</span></div></footer>
  <script>window.MZ_PROFILE=${JSON.stringify({ id: t.id, name: t.name, subtitle: subject(t) + (place(t) ? ' · ' + place(t) : ''), photo })};</script>
  <script src="profile-share.js?v=20260621-fb-direct"></script>
  <script src="photo-lightbox.js?v=20260621-zoom"></script>
  <script src="community-cta.js?v=20260621-group2"></script>
</body>
</html>`;
}

function buildSeoGroups(teachers) {
  const groups = new Map();
  for (const t of teachers) {
    if (!t.category) continue;
    const location = locationLabel(t);
    const locationSlug = slugify(location);
    const categorySlug = slugify(t.category);
    const key = `${locationSlug}/${categorySlug}`;
    if (!groups.has(key)) groups.set(key, { location, locationSlug, category: t.category, categorySlug, teachers: [] });
    groups.get(key).teachers.push(t);
  }
  return Array.from(groups.values()).sort((a, b) => (a.location + a.category).localeCompare(b.location + b.category, 'ka'));
}

function seoTeacherCard(t) {
  return `<a class="seo-teacher-card" href="${attr(localTeacherHref(t))}">
    <span class="seo-card-photo"><img src="${attr(cleanPhoto(t.photo))}" alt="${attr(t.name)}" loading="lazy" onerror="this.onerror=null;this.src='${DEFAULT_PHOTO}'"></span>
    <span class="seo-card-body"><strong>${esc(t.name)}</strong><small>${esc(subject(t))}</small><em>${esc(place(t))}</em><b>${esc(formatPrice(t.price, t.priceType))}</b></span>
  </a>`;
}

function seoJsonLd(group) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${group.category} მასწავლებლები — ${group.location}`,
    itemListElement: group.teachers.slice(0, 20).map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: teacherUrl(t),
      name: `${t.name} — ${subject(t)}`
    }))
  }).replace(/</g, '\\u003c');
}

function seoPageHtml(group) {
  const url = seoUrl(group);
  const title = `${group.category} მასწავლებლები — ${group.location} | Moemzade.ge`;
  const count = group.teachers.length;
  const desc = `${group.location} — ${group.category} მიმართულების ${count} მასწავლებელი Moemzade.ge-ზე. ნახე ფასი, ფორმატი, ქალაქი და დაუკავშირდი პირდაპირ.`;
  const filtersHref = `/teachers/?cat=${encodeURIComponent(group.category)}&reg=${encodeURIComponent(group.location)}`;
  return `<!DOCTYPE html>
<html lang="ka">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <base href="/">
  <title>${esc(title)}</title>
  <meta name="description" content="${attr(desc)}">
  <meta name="theme-color" content="#0F6E56">
  <link rel="canonical" href="${attr(url)}">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${attr(url)}">
  <meta property="og:title" content="${attr(title)}">
  <meta property="og:description" content="${attr(desc)}">
  <meta property="og:image" content="${attr(PREVIEW)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${attr(PREVIEW)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="site-fixes.css">
  <link rel="stylesheet" href="mobile-responsive.css?v=20260621-mobile">
  <style>
    .seo-hero{padding:88px 0 46px;background:linear-gradient(135deg,#f5fbf8,#e8f7f2);border-bottom:1px solid rgba(15,110,86,.08)}
    .seo-hero .container{max-width:1120px}.seo-eyebrow{display:inline-flex;align-items:center;gap:8px;background:#fff;color:#0F6E56;border:1px solid rgba(15,110,86,.12);box-shadow:0 12px 35px rgba(15,110,86,.08);border-radius:999px;padding:8px 13px;font-size:12px;font-weight:900;margin-bottom:16px}.seo-hero h1{font-size:clamp(30px,4vw,54px);line-height:1.08;margin:0 0 14px;color:#10221d;letter-spacing:-1.2px}.seo-hero p{max-width:720px;color:#5f6f68;font-size:17px;line-height:1.75;margin:0}.seo-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}.seo-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.seo-teacher-card{display:grid;grid-template-columns:72px 1fr;gap:12px;padding:12px;background:#fff;border:1px solid #edf2ef;border-radius:20px;text-decoration:none;color:inherit;box-shadow:0 16px 45px rgba(20,43,36,.06);transition:.18s ease}.seo-teacher-card:hover{transform:translateY(-2px);box-shadow:0 22px 60px rgba(20,43,36,.1)}.seo-card-photo{width:72px;height:72px;border-radius:16px;overflow:hidden;background:#edf8f3}.seo-card-photo img{width:100%;height:100%;object-fit:cover}.seo-card-body{min-width:0;display:flex;flex-direction:column;gap:3px}.seo-card-body strong{font-size:14px;color:#10221d;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.seo-card-body small,.seo-card-body em{font-size:12px;color:#6b7a74;font-style:normal;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.seo-card-body b{font-size:13px;color:#0F6E56;margin-top:auto}.seo-note{background:#0F2D26;color:#d8eee7;border-radius:26px;padding:24px;margin-top:26px}.seo-note h2{margin:0 0 8px;color:#fff;font-size:22px}.seo-note p{margin:0;color:rgba(255,255,255,.72);line-height:1.7}@media(max-width:1050px){.seo-grid{grid-template-columns:repeat(3,1fr)}}@media(max-width:760px){.seo-hero{padding:72px 0 34px}.seo-grid{grid-template-columns:1fr}.seo-teacher-card{grid-template-columns:64px 1fr}.seo-card-photo{width:64px;height:64px}.seo-actions .btn{width:100%;justify-content:center}}
  </style>
  <script type="application/ld+json">${seoJsonLd(group)}</script>
</head>
<body>
  <nav class="nav" aria-label="მთავარი ნავიგაცია"><div class="nav-inner"><a href="/" class="brand"><img src="logo.svg" alt="Moemzade.ge" class="brand-img"></a><div class="nav-links"><a href="/teachers/">მასწავლებლები</a><a href="/register/" class="btn btn-primary btn-small">+ პროფილის დამატება</a></div></div></nav>
  <header class="seo-hero"><div class="container"><span class="seo-eyebrow">SEO გვერდი · ${esc(group.location)}</span><h1>${esc(group.category)} მასწავლებლები — ${esc(group.location)}</h1><p>${esc(desc)}</p><div class="seo-actions"><a class="btn btn-primary" href="${attr(filtersHref)}">ფილტრით ნახვა</a><a class="btn btn-outline" href="/teachers/">ყველა მასწავლებელი</a></div></div></header>
  <main class="section"><div class="container"><div class="section-head"><div><span class="section-kicker">${count} პროფილი</span><h2>შერჩეული მასწავლებლები</h2></div></div><div class="seo-grid">${group.teachers.map(seoTeacherCard).join('')}</div><div class="seo-note"><h2>როგორ აირჩიო მასწავლებელი?</h2><p>გადახედე ფასს, ფორმატს, მდებარეობას და აღწერას. Moemzade.ge არ იღებს საკომისიოს — მოსწავლე და მასწავლებელი დეტალებს ერთმანეთს შორის ათანხმებენ.</p></div></div></main>
  <footer class="site-footer"><div class="container footer-grid"><div><img src="logo.svg" alt="Moemzade.ge" class="footer-logo"><p>საქართველოს მასწავლებლების, კურსებისა და ტრენერების უფასო საძიებო პლატფორმა.</p></div><div><h3>გვერდები</h3><a href="/">მთავარი</a><a href="/teachers/">მასწავლებლები</a><a href="/register/">პროფილის დამატება</a><a href="/faq/">FAQ</a><a href="/rules/">წესები</a></div><div><h3>კონტაქტი</h3><a href="${FB}" target="_blank" rel="noopener" class="footer-social">Facebook გვერდი</a></div></div><div class="container footer-bottom"><span>© 2026 Moemzade.ge</span><span>Made in Georgia</span></div></footer>
  <script src="community-cta.js?v=20260621-group2"></script>
</body>
</html>`;
}

async function writeTeacherPages(teachers) {
  const teacherDir = path.join(process.cwd(), 'teacher');
  await fs.mkdir(teacherDir, { recursive: true });

  const keep = new Set(['index.html']);
  for (const t of teachers) {
    const id = cleanId(t.id);
    keep.add(id);
    const dir = path.join(teacherDir, id);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, 'index.html'), pageHtml(t, teachers), 'utf8');
  }

  const entries = await fs.readdir(teacherDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && !keep.has(entry.name)) {
      await fs.rm(path.join(teacherDir, entry.name), { recursive: true, force: true });
    }
  }
}

async function writeSeoPages(groups) {
  const teachersDir = path.join(process.cwd(), 'teachers');
  await fs.mkdir(teachersDir, { recursive: true });

  const keepLocations = new Set(['index.html']);
  for (const group of groups) {
    keepLocations.add(group.locationSlug);
    const dir = path.join(teachersDir, group.locationSlug, group.categorySlug);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, 'index.html'), seoPageHtml(group), 'utf8');
  }

  const entries = await fs.readdir(teachersDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && !keepLocations.has(entry.name)) {
      await fs.rm(path.join(teachersDir, entry.name), { recursive: true, force: true });
    }
  }
}

async function writeSitemap(teachers, seoGroups) {
  const now = new Date().toISOString().slice(0, 10);
  const urls = [
    ...STATIC_URLS.map(u => `${SITE}${u}`),
    ...seoGroups.map(seoUrl),
    ...teachers.map(teacherUrl)
  ];
  const unique = Array.from(new Set(urls));
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${unique.map(u => `  <url><loc>${u}</loc><lastmod>${now}</lastmod></url>`).join('\n')}\n</urlset>\n`;
  await fs.writeFile(path.join(process.cwd(), 'sitemap.xml'), sitemap, 'utf8');
}

async function main() {
  const teachers = await fetchTeachers();
  const seoGroups = buildSeoGroups(teachers);
  await writeTeacherPages(teachers);
  await writeSeoPages(seoGroups);
  await writeSitemap(teachers, seoGroups);
  console.log(`Generated ${teachers.length} teacher profile pages and ${seoGroups.length} SEO pages.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
