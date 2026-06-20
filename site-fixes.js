// Moemzade runtime upgrades: routing, sorting, similar teachers, SEO landing pages
(function(){
  'use strict';

  var DEF='https://i.ibb.co/3y6km7Z9/711213407-122101682967350935-3629065519639735453-n.jpg';
  var FB='https://www.facebook.com/MoemzadeE/';
  var SHEET='1weL4w0BzXGrYPIczj0kKYFdvE615OIMKSzIpt9Q1Yu0';
  var API='https://script.google.com/macros/s/AKfycbxVMDPiywAB_J7dT5foF_Fja1K4blC_XHRHK9pWuGnZU0neLVp2h3D8lGBXXX9GR4JRJw/exec';
  var PAGE_SIZE=28;
  var sheetPromise=null;
  var state={teachers:[],page:1,cat:'',reg:'',settlement:'',fmt:'',q:'',sort:'newest',active:'',temp:''};

  var CATEGORY_DATA={
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
  var ICONS={'მუსიკა':'🎵','ცეკვა':'💃','სილამაზე':'💅','სასკოლო საგნები':'🎓','ტექნოლოგია':'💻','შემოქმედება':'🎨','ენები':'🌍','ხელსაქმე':'🔧','სპორტი და ჯანმრთელობა':'🏋️','კულინარია':'🍳','თეატრი და მედია':'🎭','მართვა':'🚗','ბიზნესი და ფინანსები':'💼','სხვა':'📦'};
  var REGIONS=['','თბილისი','კახეთი','შიდა ქართლი','ქვემო ქართლი','მცხეთა-მთიანეთი','სამცხე-ჯავახეთი','იმერეთი','რაჭა-ლეჩხუმი და ქვემო სვანეთი','გურია','სამეგრელო-ზემო სვანეთი','აჭარა','აფხაზეთი'];
  var REGION_SETTLEMENTS={
    'თბილისი':['თბილისი'],'კახეთი':['თელავი','გურჯაანი','ყვარელი','სიღნაღი','ლაგოდეხი','ახმეტა','დედოფლისწყარო','საგარეჯო','წნორი','სხვა'],
    'შიდა ქართლი':['გორი','ხაშური','ქარელი','კასპი','სურამი','სხვა'],'ქვემო ქართლი':['რუსთავი','მარნეული','ბოლნისი','გარდაბანი','დმანისი','თეთრიწყარო','წალკა','კაზრეთი','სხვა'],
    'მცხეთა-მთიანეთი':['მცხეთა','დუშეთი','თიანეთი','სტეფანწმინდა','სხვა'],'სამცხე-ჯავახეთი':['ახალციხე','ბორჯომი','ახალქალაქი','ნინოწმინდა','ბაკურიანი','სხვა'],
    'იმერეთი':['ქუთაისი','ზესტაფონი','სამტრედია','წყალტუბო','ჭიათურა','საჩხერე','ხონი','ვანი','სხვა'],'რაჭა-ლეჩხუმი და ქვემო სვანეთი':['ამბროლაური','ონი','ცაგერი','ლენტეხი','სხვა'],
    'გურია':['ოზურგეთი','ლანჩხუთი','ჩოხატაური','ურეკი','სხვა'],'სამეგრელო-ზემო სვანეთი':['ზუგდიდი','ფოთი','სენაკი','მარტვილი','ხობი','წალენჯიხა','მესტია','სხვა'],
    'აჭარა':['ბათუმი','ქობულეთი','ხელვაჩაური','ქედა','შუახევი','ხულო','სარფი','გონიო','მახინჯაური','სხვა'],'აფხაზეთი':['სოხუმი','გაგრა','გუდაუთა','ოჩამჩირე','გალი','სხვა']
  };
  var FORMATS=['','პირადად','ონლაინ','ორივე'], FORMAT_LABELS=['ნებისმიერი','პირადად','ონლაინ','ორივე'];
  var SEO_LINKS=[
    ['/teachers/tbilisi/inglisuri/','ინგლისურის მასწავლებლები თბილისში'],['/teachers/tbilisi/matematika/','მათემატიკის მასწავლებლები თბილისში'],['/teachers/tbilisi/programireba/','პროგრამირების მასწავლებლები თბილისში'],['/teachers/tbilisi/excel/','Excel-ის მასწავლებლები თბილისში'],['/teachers/tbilisi/martva/','მართვის მასწავლებლები თბილისში'],
    ['/teachers/batumi/inglisuri/','ინგლისურის მასწავლებლები ბათუმში'],['/teachers/batumi/matematika/','მათემატიკის მასწავლებლები ბათუმში'],['/teachers/batumi/cekva/','ცეკვის მასწავლებლები ბათუმში'],['/teachers/qutaisi/inglisuri/','ინგლისურის მასწავლებლები ქუთაისში'],['/teachers/qutaisi/matematika/','მათემატიკის მასწავლებლები ქუთაისში']
  ];

  function q(id){return document.getElementById(id)}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function attr(s){return esc(s)}
  function norm(s){return String(s||'').toLowerCase().replace(/\s+/g,' ').trim()}
  function cleanPhoto(s){s=String(s||'').trim();return s||DEF}
  function approved(v){return ['კი','yes','true','1'].indexOf(norm(v))>-1}
  function numericId(id){var n=parseInt(String(id||'').replace(/[^0-9]/g,''),10);return Number.isFinite(n)?n:0}
  function getPlace(t){return t.settlement||t.region||'—'}
  function priceNum(t){var n=parseFloat(String(t.price||'').replace(',', '.').replace(/[^0-9.]/g,''));return Number.isFinite(n)?n:null}
  function formatPrice(p,t){if(!p||t==='შეთანხმებით')return'შეთანხმებით';return p+'₾/'+({'საათში':'სთ','თვეში':'თვე','კურსი':'კურსი'}[t]||'სთ')}
  function isOnline(f){return ['კი','ონლაინ','ორივე'].indexOf(norm(f))>-1}
  function isOffline(f){f=norm(f);return ['პირადად','ორივე',''].indexOf(f)>-1||['კი','ონლაინ'].indexOf(f)===-1}
  function formatLabel(f){var on=isOnline(f),off=isOffline(f);return on&&off?'ორივე':on?'ონლაინ':'პირადად'}
  function val(id){return q(id)?.value?.trim()||''}
  function checked(name){return document.querySelector('input[name="'+name+'"]:checked')?.value||''}

  function readSheet(force){
    if(force) sheetPromise=null;
    if(sheetPromise) return sheetPromise;
    var url='https://docs.google.com/spreadsheets/d/'+SHEET+'/gviz/tq?tqx=out:json&sheet=teachers&t='+Date.now();
    sheetPromise=fetch(url,{cache:'no-store'}).then(function(r){return r.text()}).then(function(text){
      var json=JSON.parse(text.substring(47).slice(0,-2));
      return (json.table.rows||[]).map(function(row,idx){
        var c=row.c||[],n=c.length>=16;
        var t=n?{id:c[0]?.v||'',name:c[1]?.v||'',category:c[2]?.v||'',subcat:c[3]?.v||'',region:c[4]?.v||'',settlement:c[5]?.v||'',price:c[6]?.v||'',priceType:c[7]?.v||'საათში',phone:c[8]?.v||'',instagram:c[9]?.v||'',facebook:c[10]?.v||'',desc:c[11]?.v||'',online:c[12]?.v||'',photo:c[13]?.v||'',date:c[14]?.v||'',approved:c[15]?.v||''}:{id:c[0]?.v||'',name:c[1]?.v||'',category:c[2]?.v||'',subcat:c[3]?.v||'',region:c[4]?.v||'',settlement:'',price:c[5]?.v||'',priceType:'საათში',phone:c[6]?.v||'',instagram:c[7]?.v||'',facebook:c[8]?.v||'',desc:c[9]?.v||'',online:c[10]?.v||'',photo:c[11]?.v||'',date:c[12]?.v||'',approved:c[13]?.v||''};
        t.id=String(t.id||'').trim();t.sheetRow=idx+2;t.rowIndex=idx;t.numId=numericId(t.id);t.nameKey=norm(t.name);t.categoryKey=norm(t.category);t.subKey=norm(t.subcat||t.category);return t;
      }).filter(function(t){return t.name&&approved(t.approved)});
    }).catch(function(e){console.error('Sheet read failed',e);return[]});
    return sheetPromise;
  }

  function teacherUrl(t){return '/teacher/?id='+encodeURIComponent(t.id||'')+(t.sheetRow?'&row='+encodeURIComponent(t.sheetRow):'')}
  function renderCard(t){
    return '<article class="teacher-card scroll-reveal" data-teacher-id="'+attr(t.id)+'" data-sheet-row="'+attr(t.sheetRow||'')+'" tabindex="0" role="button" aria-label="'+attr(t.name)+' პროფილის ნახვა">'+
      '<div class="tc-img"><img src="'+attr(cleanPhoto(t.photo))+'" alt="'+attr(t.name)+'" loading="lazy" onerror="this.onerror=null;this.src=\''+DEF+'\'"></div>'+
      '<div class="tc-body"><h3 class="tc-name">'+esc(t.name)+'</h3><p class="tc-sub">'+esc(t.subcat||t.category||'მასწავლებელი')+'</p><div class="tc-meta-row"><span class="tc-place">📍 '+esc(getPlace(t))+'</span><span class="tc-format">'+esc(formatLabel(t.online))+'</span></div><div class="tc-footer"><span class="tc-price">'+esc(formatPrice(t.price,t.priceType))+'</span><span class="tc-open">ნახვა</span></div></div></article>';
  }

  function setFooter(){
    var html='<footer class="site-footer"><div class="container footer-grid"><div><a href="/" class="footer-brand"><span class="footer-brand-mark"></span><span class="footer-brand-name">Moemzade</span><span class="footer-brand-dot">.ge</span></a><p>საქართველოს მასწავლებლების, კურსებისა და ტრენერების უფასო საძიებო პლატფორმა.</p></div><div><h3>გვერდები</h3><a href="/">მთავარი</a><a href="/teachers/">მასწავლებლები</a><a href="/register/">პროფილის დამატება</a></div><div><h3>კონტაქტი</h3><a href="'+FB+'" target="_blank" rel="noopener" class="footer-social">📘 Facebook გვერდი</a></div></div><div class="container footer-bottom"><span>© 2026 Moemzade.ge</span><span>Made in Georgia</span></div></footer>';
    var old=document.querySelector('.site-footer');if(old)old.outerHTML=html;else document.body.insertAdjacentHTML('beforeend',html);
  }

  function showImage(img,src,alt){if(!img)return;img.hidden=false;img.removeAttribute('hidden');img.style.display='block';img.alt=alt||'Moemzade.ge';img.onerror=function(){this.onerror=null;this.src=DEF};img.src=cleanPhoto(src)}
  function hideSocials(){document.querySelectorAll('#instRow,#fbRow,.contact-btn-sec,.contact-btns-row').forEach(function(el){el.remove()})}
  function hideRegisterSocials(){if(document.body.dataset.page!=='register')return;['instagram','facebook'].forEach(function(id){var input=q(id);var field=input?.closest('.field,.fg,.form-group,.input-group');if(field)field.remove()});document.querySelectorAll('label').forEach(function(l){if(/instagram|facebook/i.test(l.textContent||'')){var f=l.closest('.field,.fg,.form-group,.input-group');if(f)f.remove()}})}

  function installCardClickGuard(){
    document.addEventListener('click',function(event){
      var card=event.target.closest&&event.target.closest('.teacher-card');if(!card)return;
      event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
      var id=card.dataset.teacherId||'',row=card.dataset.sheetRow||'';
      location.href='/teacher/?id='+encodeURIComponent(id)+(row?'&row='+encodeURIComponent(row):'');
    },true);
    document.addEventListener('keydown',function(event){
      if(event.key!=='Enter'&&event.key!==' ')return;var card=event.target.closest&&event.target.closest('.teacher-card');if(!card)return;event.preventDefault();card.click();
    },true);
  }

  function addSortControl(){
    var toolbar=document.querySelector('.toolbar');if(!toolbar||q('sortTeachers'))return;
    var div=document.createElement('label');div.className='sort-control';div.innerHTML='<span>დალაგება</span><select id="sortTeachers"><option value="newest">ახალი დამატებული</option><option value="priceAsc">ფასი: იაფიდან ძვირისკენ</option><option value="priceDesc">ფასი: ძვირიდან იაფისკენ</option><option value="nameAsc">სახელი: ა → ჰ</option><option value="nameDesc">სახელი: ჰ → ა</option></select>';
    toolbar.appendChild(div);
  }
  function settlementOptions(){var base=state.reg?(REGION_SETTLEMENTS[state.reg]||[]):Object.values(REGION_SETTLEMENTS).flat();var sheet=state.teachers.map(function(t){return t.settlement}).filter(Boolean);return ['',...Array.from(new Set(base.concat(sheet))).filter(Boolean).sort(function(a,b){return a.localeCompare(b,'ka')})]}
  function matchCat(t,cat){if(!cat)return true;cat=norm(cat);return norm(t.category).includes(cat)||norm(t.subcat).includes(cat)}
  function filteredTeachers(){var query=norm(state.q);return state.teachers.filter(function(t){return matchCat(t,state.cat)&&(!state.reg||norm(t.region).includes(norm(state.reg)))&&(!state.settlement||norm(t.settlement).includes(norm(state.settlement)))&&(!state.fmt||(state.fmt==='ონლაინ'?isOnline(t.online):state.fmt==='პირადად'?isOffline(t.online)&&!isOnline(t.online):state.fmt==='ორივე'?norm(t.online)==='ორივე':true))&&(!query||[t.name,t.category,t.subcat,t.region,t.settlement,t.desc].some(function(v){return norm(v).includes(query)}))})}
  function sortTeachers(list){var arr=list.slice(),s=state.sort;arr.sort(function(a,b){var pa=priceNum(a),pb=priceNum(b);if(s==='priceAsc')return (pa==null?999999:pa)-(pb==null?999999:pb)||a.name.localeCompare(b.name,'ka');if(s==='priceDesc')return (pb==null?-1:pb)-(pa==null?-1:pa)||a.name.localeCompare(b.name,'ka');if(s==='nameAsc')return a.name.localeCompare(b.name,'ka');if(s==='nameDesc')return b.name.localeCompare(a.name,'ka');return (b.numId||b.sheetRow||0)-(a.numId||a.sheetRow||0)});return arr}
  function updateFilterLabels(){var set=function(id,text){var el=q(id);if(el)el.textContent=text};set('pillCatLabel',state.cat||'ყველა სფერო');set('pillRegLabel',state.reg||'ყველა რეგიონი');set('pillSettlementLabel',state.settlement||'ქალაქი/სოფელი');var fi=FORMATS.indexOf(state.fmt);set('pillFmtLabel',state.fmt?(FORMAT_LABELS[fi]||state.fmt):'ნებისმიერი');[['pillCat',state.cat],['pillReg',state.reg],['pillSettlement',state.settlement],['pillFmt',state.fmt]].forEach(function(x){q(x[0])?.classList.toggle('active',!!x[1])});var sort=q('sortTeachers');if(sort)sort.value=state.sort}
  function renderTeachersList(){
    var list=q('teachersList'),count=q('resultsCount'),pag=q('pagination');if(!list)return;
    var f=sortTeachers(filteredTeachers());if(count)count.textContent=f.length+' მასწავლებელი';
    if(!f.length){list.innerHTML='<div class="empty-state">ამ მონაცემებით მასწავლებელი ვერ მოიძებნა.</div>';if(pag)pag.innerHTML='';return}
    var total=Math.ceil(f.length/PAGE_SIZE);if(state.page>total)state.page=1;var start=(state.page-1)*PAGE_SIZE;
    list.innerHTML=f.slice(start,start+PAGE_SIZE).map(renderCard).join('');
    if(pag){if(total<=1){pag.innerHTML=''}else{var html='<button class="page-btn" type="button" onclick="changePage('+(state.page-1)+')" '+(state.page===1?'disabled':'')+'>←</button>';for(var i=1;i<=total;i++)html+='<button class="page-btn'+(i===state.page?' active':'')+'" type="button" onclick="changePage('+i+')">'+i+'</button>';html+='<button class="page-btn" type="button" onclick="changePage('+(state.page+1)+')" '+(state.page===total?'disabled':'')+'>→</button>';pag.innerHTML=html}}
    fixImages();
  }
  function openFilter(type){state.active=type;state.temp=type==='cat'?state.cat:type==='reg'?state.reg:type==='settlement'?state.settlement:state.fmt;var o=q('filterOverlay'),title=q('fpTitle'),content=q('fpContent');if(!o||!title||!content)return;var items=[];if(type==='cat'){title.textContent='სფერო';items=[''].concat(Object.keys(CATEGORY_DATA))}else if(type==='reg'){title.textContent='რეგიონი';items=REGIONS}else if(type==='settlement'){title.textContent='ქალაქი / სოფელი';items=settlementOptions()}else{title.textContent='ფორმატი';items=FORMATS}content.innerHTML='<div class="fp-chips">'+items.map(function(v,i){var label=type==='cat'?(v?(ICONS[v]||'')+' '+v:'ყველა სფერო'):type==='reg'?(v||'ყველა რეგიონი'):type==='settlement'?(v||'ყველა ქალაქი/სოფელი'):(FORMAT_LABELS[i]||v);return '<div class="fp-chip'+((v===state.temp)||(!v&&!state.temp)?' sel':'')+'" onclick="selectChip(this,\''+attr(v)+'\')">'+esc(label)+'</div>'}).join('')+'</div>';o.classList.add('open');o.setAttribute('aria-hidden','false')}
  function closeFilter(){var o=q('filterOverlay');if(o){o.classList.remove('open');o.setAttribute('aria-hidden','true')}}
  function selectChip(el,v){document.querySelectorAll('.fp-chip').forEach(function(c){c.classList.remove('sel')});el.classList.add('sel');state.temp=v}
  function clearFilter(){state.temp='';document.querySelectorAll('.fp-chip').forEach(function(c){c.classList.remove('sel')});document.querySelector('.fp-chip')?.classList.add('sel')}
  function applyFilter(){if(state.active==='cat')state.cat=state.temp;if(state.active==='reg'){state.reg=state.temp;state.settlement=''}if(state.active==='settlement')state.settlement=state.temp;if(state.active==='fmt')state.fmt=state.temp;state.page=1;updateFilterLabels();closeFilter();renderTeachersList()}
  function changePage(n){if(n<1)return;state.page=n;renderTeachersList();window.scrollTo({top:0,behavior:'smooth'})}

  function initTeachersUpgrade(){
    if(document.body.dataset.page!=='teachers')return;
    addSortControl();var params=new URLSearchParams(location.search),seo=window.MZ_SEO||{};
    state.cat=seo.cat||params.get('cat')||'';state.reg=seo.reg||params.get('reg')||'';state.settlement=seo.settlement||params.get('settlement')||'';state.fmt=seo.fmt||params.get('fmt')||'';state.sort=params.get('sort')||'newest';
    var search=q('teacherSearch');if(search)search.addEventListener('input',function(e){state.q=e.target.value.trim();state.page=1;renderTeachersList()});
    q('sortTeachers')?.addEventListener('change',function(e){state.sort=e.target.value;state.page=1;renderTeachersList()});
    readSheet(true).then(function(list){state.teachers=list;updateFilterLabels();renderTeachersList()});
  }

  function renderProfile(t){
    if(!t)return;document.title=t.name+' — Moemzade.ge';
    var set=function(id,v){var el=q(id);if(el)el.textContent=v||'—'};showImage(q('profPhoto'),t.photo,t.name);var ini=q('profInitials');if(ini)ini.hidden=true;
    set('profName',t.name);set('profSubtitle',(t.subcat||t.category||'მასწავლებელი')+(t.settlement?' · '+t.settlement:''));set('profCat',(t.subcat?t.subcat+' / ':'')+(t.category||''));set('profRegion',t.region);set('profSettlement',t.settlement);set('profPrice',formatPrice(t.price,t.priceType));set('profPhone',t.phone);set('profDesc',t.desc);hideSocials();
    var badges=q('profBadges');if(badges)badges.innerHTML=(isOnline(t.online)?'<span class="profile-badge online">🌐 ონლაინ</span>':'')+(isOffline(t.online)?'<span class="profile-badge">🏠 პირადად</span>':'')+(formatLabel(t.online)==='ორივე'?'<span class="profile-badge">✓ ორივე ფორმატი</span>':'');
    var box=q('contactBtns');if(box){var ph=String(t.phone||'').replace(/[^0-9+]/g,''),geo=ph.replace(/^\+?995/,'').replace(/^0/,'');box.innerHTML=t.phone?'<a href="tel:'+attr(ph)+'" class="contact-btn-main">📞 დარეკვა — '+esc(t.phone)+'</a><a href="https://wa.me/995'+attr(geo)+'" target="_blank" rel="noopener" class="contact-btn-main whatsapp">💬 WhatsApp-ზე მიწერა</a>':'<div class="empty-state">საკონტაქტო ინფორმაცია არ არის მითითებული.</div>'}
  }
  function findCurrent(list){var p=new URLSearchParams(location.search),id=p.get('id')||'',row=p.get('row')||'';var t=null;if(row)t=list.find(function(x){return String(x.sheetRow)===String(row)||String(x.rowIndex)===String(row)});if(!t&&id)t=list.find(function(x){return String(x.id)===String(id)});return t}
  function renderSimilar(current,list){
    var old=q('similarTeachersSection');if(old)old.remove();if(!current)return;
    var scored=list.filter(function(t){return String(t.id)!==String(current.id)}).map(function(t){var score=0;if(current.settlement&&norm(t.settlement)===norm(current.settlement))score+=100;if(current.region&&norm(t.region)===norm(current.region))score+=30;if(current.subcat&&norm(t.subcat)===norm(current.subcat))score+=70;if(current.category&&norm(t.category)===norm(current.category))score+=45;return {t:t,score:score}}).filter(function(x){return x.score>=70}).sort(function(a,b){return b.score-a.score||b.t.numId-a.t.numId}).slice(0,4).map(function(x){return x.t});
    if(!scored.length)return;
    var sec=document.createElement('section');sec.className='similar-section container';sec.id='similarTeachersSection';sec.innerHTML='<div class="section-head"><div><span class="section-kicker">მსგავსი მასწავლებლები</span><h2>შესაძლოა ეს პროფილებიც მოგეწონოს</h2><p>ვაჩვენებთ იგივე ქალაქში ან მსგავს სფეროში დამატებულ მასწავლებლებს.</p></div><a href="/teachers/?cat='+encodeURIComponent(current.subcat||current.category||'')+'&settlement='+encodeURIComponent(current.settlement||'')+'" class="text-link">ყველას ნახვა →</a></div><div class="teachers-grid similar-grid">'+scored.map(renderCard).join('')+'</div>';
    var body=document.querySelector('.profile-body');if(body)body.after(sec);else document.querySelector('.site-footer')?.before(sec);fixImages();
  }
  function initProfileUpgrade(){if(document.body.dataset.page!=='profile')return;hideSocials();readSheet(true).then(function(list){var current=findCurrent(list);if(current){renderProfile(current);renderSimilar(current,list)}else fixImages()})}

  function setErr(id,show){var el=q('err-'+id),input=q(id);if(el)el.style.display=show?'block':'none';if(input)input.classList.toggle('error',!!show)}
  function validateRegister(){var ok=true;['name','region','category','phone'].forEach(function(id){var good=!!val(id);setErr(id,!good);ok=good&&ok});var settlement=val('settlement')==='სხვა'?val('customSettlement'):val('settlement');setErr('settlement',!settlement);ok=!!settlement&&ok;var priceOk=val('priceType')==='შეთანხმებით'||!!val('price');setErr('price',!priceOk);ok=priceOk&&ok;var descOk=val('desc').length>=30;setErr('desc',!descOk);ok=descOk&&ok;var formatOk=!!checked('format');var err=q('err-format');if(err)err.style.display=formatOk?'none':'block';ok=formatOk&&ok;return ok}
  async function submitRegister(){if(!validateRegister())return;var status=q('uploadStatus');if(status&&status.classList.contains('uploading')){status.textContent='⏳ გთხოვთ დაიცადოთ, ფოტო იტვირთება...';return}var btn=q('submitBtn'),subcat=val('subcat')==='სხვა'?val('customSubcat'):val('subcat'),settlement=val('settlement')==='სხვა'?val('customSettlement'):val('settlement');try{if(btn){btn.disabled=true;btn.textContent='იგზავნება...'}var data={name:val('name'),category:val('category'),subcat:subcat,region:val('region'),settlement:settlement,price:val('price'),priceType:val('priceType')||'საათში',phone:val('phone'),instagram:'',facebook:'',desc:val('desc'),format:checked('format'),online:checked('format'),photo:val('photoUrl'),date:new Date().toLocaleString('ka-GE'),approved:'არა'};await fetch(API,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(data)});q('formCard')?.setAttribute('hidden','');q('successCard')?.removeAttribute('hidden');window.scrollTo({top:0,behavior:'smooth'})}catch(e){console.error(e);alert('გაგზავნა ვერ მოხერხდა. სცადე თავიდან.')}finally{if(btn){btn.disabled=false;btn.textContent='პროფილის გაგზავნა ✓'}}}
  function initRegister(){if(document.body.dataset.page!=='register')return;hideRegisterSocials();window.submitForm=submitRegister;var btn=q('submitBtn');if(btn&&!btn.__mz){btn.__mz=true;btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();submitRegister()},true)}var img=q('photoImg');if(img&&!img.src)img.style.display='none'}

  function fixImages(){document.querySelectorAll('.teacher-card .tc-img').forEach(function(box){var img=box.querySelector('img');if(!img){box.innerHTML='<img src="'+DEF+'" alt="Moemzade.ge" loading="lazy">';img=box.querySelector('img')}img.onerror=function(){this.onerror=null;this.src=DEF};if(!String(img.getAttribute('src')||'').trim())img.src=DEF});var p=q('profPhoto');if(p&&(!String(p.getAttribute('src')||'').trim()||p.hidden||p.style.display==='none'))showImage(p,DEF,'Moemzade.ge')}

  function insertSeoLinks(){
    if(q('popularSeoLinks'))return;if(document.body.dataset.page!=='index'&&document.body.dataset.page!=='teachers')return;
    var sec=document.createElement('section');sec.className='section seo-links-section';sec.id='popularSeoLinks';sec.innerHTML='<div class="container"><div class="section-head"><div><span class="section-kicker">პოპულარული ძიებები</span><h2>მასწავლებლები ქალაქისა და სფეროს მიხედვით</h2></div></div><div class="seo-links-grid">'+SEO_LINKS.map(function(x){return '<a href="'+x[0]+'">'+esc(x[1])+' →</a>'}).join('')+'</div></div>';
    document.querySelector('.site-footer')?.before(sec);
  }

  function init(){
    setFooter();hideRegisterSocials();installCardClickGuard();initRegister();initTeachersUpgrade();initProfileUpgrade();insertSeoLinks();fixImages();
    window.openProfile=function(id){if(!id)return;location.href='/teacher/?id='+encodeURIComponent(id)};
    window.openFilter=openFilter;window.closeFilter=closeFilter;window.selectChip=selectChip;window.clearFilter=clearFilter;window.applyFilter=applyFilter;window.changePage=changePage;
    setTimeout(function(){hideRegisterSocials();fixImages();insertSeoLinks()},700);
    setTimeout(function(){hideRegisterSocials();fixImages();hideSocials()},1600);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();