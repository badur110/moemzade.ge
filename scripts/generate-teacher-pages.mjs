import fs from 'node:fs/promises';
import path from 'node:path';

const SHEET_ID = '1K7mQM7U-49gNkP0wb0wC8Y5ucvReOvoFIfivgj9FpVA';
const SHEET_NAME = 'teachers';
const SITE = 'https://moemzade.ge';
const DEFAULT_PHOTO = 'https://i.ibb.co/3y6km7Z9/711213407-122101682967350935-3629065519639735453-n.jpg';
const FB = 'https://www.facebook.com/MoemzadeE/';

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
  const href = `/teachers/?cat=${encodeURIComponent(current.category)}&reg=${encodeURIComponent(current.region)}`;
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
  <script src="community-cta.js?v=20260621-group2"></script>
</body>
</html>`;
}

async function main() {
  const teachers = await fetchTeachers();
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

  const staticUrls = ['/', '/teachers/', '/register/'];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticUrls.map(u => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}\n${teachers.map(t => `  <url><loc>${teacherUrl(t)}</loc></url>`).join('\n')}\n</urlset>\n`;
  await fs.writeFile(path.join(process.cwd(), 'sitemap.xml'), sitemap, 'utf8');
  console.log(`Generated ${teachers.length} teacher profile pages.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});