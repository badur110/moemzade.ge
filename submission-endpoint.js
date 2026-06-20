// Moemzade.ge — live Apps Script endpoint override
(function () {
  'use strict';

  var APPS_URL = 'https://script.google.com/macros/s/AKfycbwVV-aapV1FHplhUN619LxUKtiBAzu3PAVMgv4OuYasSrOotFFi6NAvmCGTmZ5OZRmMpg/exec';

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

    fetch(APPS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data)
    }).then(function () {
      var card = q('formCard');
      var success = q('successCard');
      if (card) card.hidden = true;
      if (success) success.hidden = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }).catch(function (err) {
      console.error(err);
      alert('გაგზავნა ვერ მოხერხდა. სცადე თავიდან.');
    }).finally(function () {
      if (btn) { btn.disabled = false; btn.textContent = 'პროფილის გაგზავნა ✓'; }
    });
  };
})();
