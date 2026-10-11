(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };

  if (typeof THREE === 'undefined') {
    $('overlay').innerHTML = '<div class="panel"><h1>Blokland</h1><p class="lead">Pustaka 3D gagal dimuat. Periksa koneksi internet lalu muat ulang halaman.</p></div>';
    return;
  }

  /* ---------- Dunia ---------- */
  var W = 64, D = 64, H = 40, CH = 16, NC = W / CH;
  var AIR = 0, GRASS = 1, DIRT = 2, STONE = 3, SAND = 4, LOG = 5, LEAVES = 6, PLANKS = 7, GLASS = 8;
  var BLOCKS = {
    1: { name: 'Rumput', top: 0, side: 1, bottom: 2 },
    2: { name: 'Tanah', top: 2, side: 2, bottom: 2 },
    3: { name: 'Batu', top: 3, side: 3, bottom: 3 },
    4: { name: 'Pasir', top: 4, side: 4, bottom: 4 },
    5: { name: 'Kayu', top: 6, side: 5, bottom: 6 },
    6: { name: 'Daun', top: 7, side: 7, bottom: 7 },
    7: { name: 'Papan', top: 8, side: 8, bottom: 8 },
    8: { name: 'Kaca', top: 9, side: 9, bottom: 9 }
  };
  var TRANS = [true, false, false, false, false, false, true, false, true];
  var world = new Uint8Array(W * D * H);
  var IDX = function (x, y, z) { return (y * D + z) * W + x; };
  var inB = function (x, y, z) { return x >= 0 && x < W && y >= 0 && y < H && z >= 0 && z < D; };

  function rngFrom(s) {
    var a = s >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash2(x, y, s) {
    var h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(s, 1013904223)) | 0;