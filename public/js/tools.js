/* Veloce Tools shared helpers — loaded on every page as window.VT */
(function () {
  var VT = (window.VT = {});

  VT.toast = function (msg) {
    var t = document.getElementById('vt-toast');
    if (!t) { t = document.createElement('div'); t.id = 'vt-toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(VT._t); VT._t = setTimeout(function () { t.classList.remove('show'); }, 1700);
  };

  VT.copy = function (text, msg) {
    var done = function () { VT.toast(msg || 'Copied to clipboard'); };
    var fallback = function () {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { VT.toast('Copy failed'); }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  };

  VT.download = function (data, name, mime) {
    var b = data instanceof Blob ? data : new Blob([data], { type: mime || 'text/plain' });
    var u = URL.createObjectURL(b), a = document.createElement('a');
    a.href = u; a.download = name; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(u); }, 2000);
  };

  VT.bytes = function (n) { return n < 1024 ? n + ' B' : n < 1048576 ? (n / 1024).toFixed(1) + ' KB' : (n / 1048576).toFixed(2) + ' MB'; };
  VT.debounce = function (f, ms) { var t; return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { f.apply(c, a); }, ms || 150); }; };
  VT.esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };

  /* drag-drop + file input + paste wiring */
  VT.drop = function (zone, cb, opts) {
    var inp = zone.querySelector('input[type=file]');
    inp.addEventListener('change', function () { if (inp.files.length) cb(Array.from(inp.files)); inp.value = ''; });
    ['dragenter', 'dragover'].forEach(function (ev) { zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add('is-dragover'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.remove('is-dragover'); }); });
    zone.addEventListener('drop', function (e) { var f = Array.from(e.dataTransfer.files); if (f.length) cb(f); });
    if (opts && opts.paste) {
      document.addEventListener('paste', function (e) {
        var items = (e.clipboardData && e.clipboardData.files) || [];
        var f = Array.from(items).filter(function (x) { return !opts.accept || x.type.indexOf(opts.accept) === 0; });
        if (f.length) cb(f);
      });
    }
  };

  /* image pipeline shared by compressor + converter */
  VT.EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' };
  VT.loadImage = function (file) {
    return new Promise(function (res, rej) {
      var u = URL.createObjectURL(file), i = new Image();
      i.onload = function () { res({ img: i, url: u }); };
      i.onerror = function () { URL.revokeObjectURL(u); rej(new Error('Cannot read ' + file.name)); };
      i.src = u;
    });
  };
  VT.processImage = function (img, o) {
    var w = img.naturalWidth || 1024, h = img.naturalHeight || 1024;
    var s = o.scale || 1;
    if (o.max && Math.max(w, h) * s > o.max) s = o.max / Math.max(w, h);
    var tw = Math.max(1, Math.round(w * s)), th = Math.max(1, Math.round(h * s));
    var rot = (o.rotate || 0) % 360, swap = rot === 90 || rot === 270;
    var c = document.createElement('canvas');
    c.width = swap ? th : tw; c.height = swap ? tw : th;
    var x = c.getContext('2d');
    if (o.fmt === 'image/jpeg' || o.fill) { x.fillStyle = o.bg || '#ffffff'; x.fillRect(0, 0, c.width, c.height); }
    x.save(); x.translate(c.width / 2, c.height / 2); x.rotate(rot * Math.PI / 180);
    x.scale(o.flipH ? -1 : 1, o.flipV ? -1 : 1); x.imageSmoothingQuality = 'high';
    x.drawImage(img, -tw / 2, -th / 2, tw, th); x.restore();
    return new Promise(function (res) { c.toBlob(function (b) { res({ blob: b, w: c.width, h: c.height }); }, o.fmt, o.q); });
  };

  /* store-only ZIP builder */
  VT.crc32 = function (buf) {
    var t = VT._ct;
    if (!t) { t = VT._ct = []; for (var n = 0; n < 256; n++) { var c0 = n; for (var k = 0; k < 8; k++) c0 = c0 & 1 ? 0xEDB88320 ^ (c0 >>> 1) : c0 >>> 1; t[n] = c0 >>> 0; } }
    var c = 0xFFFFFFFF; for (var i = 0; i < buf.length; i++) c = t[(c ^ buf[i]) & 255] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  };
  VT.zip = function (files) {
    var enc = new TextEncoder(), parts = [], cd = [], off = 0;
    files.forEach(function (f) {
      var name = enc.encode(f.name), crc = VT.crc32(f.data), sz = f.data.length;
      var h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true);
      h.setUint16(12, 0x21, true); h.setUint32(14, crc, true); h.setUint32(18, sz, true); h.setUint32(22, sz, true);
      h.setUint16(26, name.length, true);
      parts.push(h.buffer, name, f.data);
      var c = new DataView(new ArrayBuffer(46));
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true);
      c.setUint16(14, 0x21, true); c.setUint32(16, crc, true); c.setUint32(20, sz, true); c.setUint32(24, sz, true);
      c.setUint16(28, name.length, true); c.setUint32(42, off, true);
      cd.push(c.buffer, name); off += 30 + name.length + sz;
    });
    var cdSize = 0; cd.forEach(function (p) { cdSize += p.byteLength; });
    var e = new DataView(new ArrayBuffer(22));
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true);
    e.setUint32(12, cdSize, true); e.setUint32(16, off, true);
    return new Blob(parts.concat(cd, [e.buffer]), { type: 'application/zip' });
  };
  VT.zipBlobs = function (items) {
    return Promise.all(items.map(function (it) { return it.blob.arrayBuffer().then(function (b) { return { name: it.name, data: new Uint8Array(b) }; }); })).then(VT.zip);
  };

  /* QR code helpers (uses self-hosted /js/qrcode.js; UTF-8 safe, no byte-order mark) */
  VT.qrMatrix = function (text, level) {
    if (typeof qrcode === 'undefined') throw new Error('QR library not loaded');
    qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
    var q = qrcode(0, level || 'M'); q.addData(text, 'Byte'); q.make(); return q;
  };
  VT.qrDraw = function (canvas, q, size, pad, fg, bg) {
    var n = q.getModuleCount(), m = Math.max(1, Math.floor(size / n)), real = m * n, off = Math.floor(pad + (size - real) / 2);
    canvas.width = canvas.height = size + pad * 2;
    var x = canvas.getContext('2d'); x.fillStyle = bg; x.fillRect(0, 0, canvas.width, canvas.height); x.fillStyle = fg;
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (q.isDark(r, c)) x.fillRect(off + c * m, off + r * m, m, m);
  };

  /* tabs helper: buttons[data-t] toggles panes[data-pane] */
  VT.tabs = function (bar, panesRoot, onChange) {
    var btns = bar.querySelectorAll('button');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.classList.toggle('active', x === b); });
        var t = b.getAttribute('data-t');
        panesRoot.querySelectorAll('[data-pane]').forEach(function (p) { p.classList.toggle('hidden', p.getAttribute('data-pane') !== t); });
        if (onChange) onChange(t);
      });
    });
  };

  /* delegated copy buttons: <button data-copy="#id"> */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]'); if (!b) return;
    var el = document.querySelector(b.getAttribute('data-copy')); if (!el) return;
    var v = (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') ? el.value : (el.getAttribute('data-raw') || el.textContent);
    VT.copy(v);
  });
})();
