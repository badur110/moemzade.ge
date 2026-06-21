(function(){
  var FALLBACK='https://i.ibb.co/3y6km7Z9/711213407-122101682967350935-3629065519639735453-n.jpg';
  function byId(id){return document.getElementById(id)}
  function text(v){return String(v||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function profileName(){return (window.MZ_PROFILE&&window.MZ_PROFILE.name)||(byId('profName')&&byId('profName').textContent.trim())||'პროფილის ფოტო'}
  function profileSub(){return (window.MZ_PROFILE&&window.MZ_PROFILE.subtitle)||(byId('profSubtitle')&&byId('profSubtitle').textContent.trim())||'Moemzade.ge'}
  function photoUrl(){var img=byId('profPhoto');return (img&&img.getAttribute('src'))||(window.MZ_PROFILE&&window.MZ_PROFILE.photo)||FALLBACK}
  function closeModal(){var old=byId('mzPhotoModal');if(old)old.remove();document.body.classList.remove('mz-modal-open')}
  function openModal(){
    var url=photoUrl();
    var modal=document.createElement('div');
    modal.id='mzPhotoModal';
    modal.className='mz-photo-modal';
    modal.innerHTML='<div class="mz-photo-box"><div class="mz-photo-head"><div><strong>'+text(profileName())+'</strong><span>'+text(profileSub())+'</span></div><button type="button" class="mz-photo-close" aria-label="დახურვა">×</button></div><div class="mz-photo-stage"><img src="'+text(url)+'" alt="'+text(profileName())+'" onerror="this.onerror=null;this.src=\''+FALLBACK+'\'"></div></div>';
    document.body.appendChild(modal);document.body.classList.add('mz-modal-open');
    modal.querySelector('.mz-photo-close').addEventListener('click',closeModal);
    modal.addEventListener('click',function(e){if(e.target===modal)closeModal()});
    document.addEventListener('keydown',function escClose(e){if(e.key==='Escape'){closeModal();document.removeEventListener('keydown',escClose)}});
  }
  function init(){
    var wrap=byId('profPhotoWrap');var img=byId('profPhoto');
    if(!wrap||!img||wrap.dataset.photoZoom==='1')return;
    if(!img.getAttribute('src')&&!window.MZ_PROFILE){setTimeout(init,600);return}
    wrap.dataset.photoZoom='1';
    wrap.classList.add('mz-photo-zoomable');
    wrap.setAttribute('role','button');
    wrap.setAttribute('tabindex','0');
    wrap.setAttribute('aria-label','ფოტოს გადიდება');
    var label=document.createElement('span');label.className='mz-photo-label';label.textContent='გადიდება';wrap.appendChild(label);
    wrap.addEventListener('click',openModal);
    wrap.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openModal()}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  setTimeout(init,1000);setTimeout(init,2500);
})();