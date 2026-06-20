// Moemzade.ge — data source override for the current Google Sheet / Apps Script
(function () {
  'use strict';

  var NEW_SHEET_ID = '1K7mQM7U-49gNkP0wb0wC8Y5ucvReOvoFIfivgj9FpVA';
  var NEW_APPS_URL = 'https://script.google.com/macros/s/AKfycbyRsQEsBM9ztnCQl9C_dyr51ugmF7MV9GY1hdL0HOQBDgc2PYAd-JvOXwpPQfkxXXzK/exec';

  var OLD_SHEET_IDS = [
    '1weL4w0BzXGrYPIczj0kKYFdvE615OIMKSzIpt9Q1Yu0'
  ];

  var OLD_APPS_URLS = [
    'https://script.google.com/macros/s/AKfycbxVMDPiywAB_J7dT5foF_Fja1K4blC_XHRHK9pWuGnZU0neLVp2h3D8lGBXXX9GR4JRJw/exec',
    'https://script.google.com/macros/s/AKfycbwVV-aapV1FHplhUN619LxUKtiBAzu3PAVMgv4OuYasSrOotFFi6NAvmCGTmZ5OZRmMpg/exec',
    'https://script.google.com/macros/s/AKfycbxadtLaS2G5o70zTdIKjk6e9HxcTJ6qZDcDcgI0QD8gnKhH8pjK7K0hxriH7CIKH2KvUQ/exec'
  ];

  function replaceAll(text, search, replacement) {
    return String(text).split(search).join(replacement);
  }

  function rewriteUrl(url) {
    var out = String(url || '');

    OLD_SHEET_IDS.forEach(function (oldId) {
      out = replaceAll(out, oldId, NEW_SHEET_ID);
    });

    OLD_APPS_URLS.forEach(function (oldUrl) {
      out = replaceAll(out, oldUrl, NEW_APPS_URL);
    });

    out = out.replace(/https:\/\/script\.google\.com\/macros\/s\/AK[^/]+\/exec/g, function (match) {
      return OLD_APPS_URLS.indexOf(match) >= 0 ? NEW_APPS_URL : match;
    });

    return out;
  }

  var nativeFetch = window.fetch;

  if (nativeFetch) {
    window.fetch = function (input, init) {
      try {
        if (typeof input === 'string') {
          return nativeFetch.call(this, rewriteUrl(input), init);
        }

        if (input && input.url && typeof Request !== 'undefined' && input instanceof Request) {
          return nativeFetch.call(this, new Request(rewriteUrl(input.url), input), init);
        }
      } catch (e) {}

      return nativeFetch.call(this, input, init);
    };
  }

  window.MOEMZADE_DATA_SOURCE = {
    sheetId: NEW_SHEET_ID,
    appsUrl: NEW_APPS_URL,
    rewriteUrl: rewriteUrl
  };
})();