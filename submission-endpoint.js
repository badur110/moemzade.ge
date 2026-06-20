// Moemzade.ge — live Apps Script endpoint override
(function () {
  'use strict';

  var APPS_URL = 'https://script.google.com/macros/s/AKfycbxadtLaS2G5o70zTdIKjk6e9HxcTJ6qZDcDcgI0QD8gnKhH8pjK7K0hxriH7CIKH2KvUQ/exec';

  function q(id) { return document.getElementById(id); }
  function val(id) { var el = q(id); return el ? String(el.value || '').trim() : ''; }
  function checked(name) {
    var el = document.querySelector('input[name="' + name + '"]:checked');
    return el ? String(el.value || '').trim() : '';
  }
  function showErr(id, show) {
    var el = q(id);
    var err = q('err-' + id);
    if (el) el.classList.toggle('error', !!show);
    if (err) err.style.display = show ? 'block' : 'none';
  }
  function remoteSelected() {
    var format = checked('format');
    return format === 'ონლაინ' || val('region') === 'დისტანციური';
  }
  function validateAll() {
    var ok = true;
    function need(id, condition) {
      var good = condition == null ? !!val(id) : !!condition;
      showErr(id, !good);
      ok = good && ok;
    }

    need('name');
    if (!remoteSelected()) {
      need('region');
      need('settlement');
    } else {
      showErr('region', false);
      showErr('settlement', false);
    }

    var priceType = val('priceType') || 'საათში';
    need('price', priceType === 'შეთანხმებით' || !!val('price'));
    need('category');
    need('desc', val('desc').length >= 30);
    need('phone');

    var fmtOk = !!checked('format');
    var fmtErr = q('err-format');
    if (fmtErr) fmtErr.style.display = fmtOk ? 'none' : 'block';
    ok = fmtOk && ok;

    return ok;
  }

  function showSuccess() {
    var card = q('formCard');
    var success = q('successCard');
    if (card) card.hidden = true;
    if (success) success.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function postByHiddenForm(data) {
    var frameName = 'mz_submit_frame_' + Date.now();
    var iframe = document.createElement('iframe');
    iframe.name = frameName;
    iframe.style.display = 'none';
    iframe.setAttribute('aria-hidden', 'true');

    var form = document.createElement('form');
    form.method = 'POST';
    form.action = APPS_URL;
    form.target = frameName;
    form.style.display = 'none';

    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'payload';
    input.value = JSON.stringify(data);
    form.appendChild(input);

    document.body.appendChild(iframe);
    document.body.appendChild(form);
    form.submit();

    setTimeout(function () {
      if (form.parentNode) form.parentNode.removeChild(form);
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    }, 20000);
  }

  function postByFetch(data) {
    try {
      fetch(APPS_URL, {
        method: 'POST',
        mode: 'no-cors',
        keepalive: true,
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
      }).catch(function () {});
    } catch (e) {}
  }

  function postByBeacon(data) {
    try {
      if (!navigator.sendBeacon) return;
      var blob = new Blob([JSON.stringify(data)], { type: 'text/plain;charset=utf-8' });
      navigator.sendBeacon(APPS_URL, blob);
    } catch (e) {}
  }

  function postByImageGet(data) {
    try {
      var img = new Image();
      img.style.display = 'none';
      img.alt = '';
      img.src = APPS_URL + '?payload=' + encodeURIComponent(JSON.stringify(data)) + '&t=' + Date.now();
      document.body.appendChild(img);
      setTimeout(function () { if (img.parentNode) img.parentNode.removeChild(img); }, 20000);
    } catch (e) {}
  }

  function submitToAppsScript(data) {
    // Multiple transport methods are used because Apps Script + static hosting can be
    // inconsistent across browsers. The Apps Script code de-duplicates by submissionId.
    postByHiddenForm(data);
    postByFetch(data);
    postByBeacon(data);
    postByImageGet(data);
  }

  window.submitForm = function submitFormToLiveEndpoint() {
    if (!validateAll()) return;

    var uploadStatus = q('uploadStatus');
    if (uploadStatus && uploadStatus.classList.contains('uploading')) {
      uploadStatus.textContent = '⏳ გთხოვთ დაიცადოთ, ფოტო იტვირთება...';
      return;
    }

    var btn = q('submitBtn');
    var format = checked('format');
    var isRemote = remoteSelected();
    var subcat = val('subcat') === 'სხვა' ? val('customSubcat') : val('subcat');
    var settlement = val('settlement') === 'სხვა' ? val('customSettlement') : val('settlement');

    var data = {
      action: 'registerTeacher',
      submissionId: 'mz_' + Date.now() + '_' + Math.random().toString(36).slice(2),
      name: val('name'),
      category: val('category'),
      subcat: subcat || '',
      region: isRemote ? 'დისტანციური' : val('region'),
      settlement: isRemote ? 'დისტანციური' : settlement,
      price: val('price'),
      priceType: val('priceType') || 'საათში',
      phone: val('phone'),
      instagram: '',
      facebook: '',
      desc: val('desc'),
      format: format,
      online: format,
      photo: val('photoUrl'),
      date: new Date().toLocaleString('ka-GE'),
      approved: 'არა'
    };

    if (btn) { btn.disabled = true; btn.textContent = 'იგზავნება...'; }

    try {
      submitToAppsScript(data);
      setTimeout(showSuccess, 1400);
    } catch (err) {
      console.error(err);
      alert('გაგზავნა ვერ მოხერხდა. სცადე თავიდან.');
    } finally {
      setTimeout(function () {
        if (btn) { btn.disabled = false; btn.textContent = 'პროფილის გაგზავნა ✓'; }
      }, 1800);
    }
  };
})();