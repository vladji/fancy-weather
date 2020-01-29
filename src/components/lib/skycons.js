/* eslint-disable brace-style */
/* eslint-disable no-self-assign */
/* eslint-disable curly */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable one-var */
/* eslint-disable no-underscore-dangle */
/* eslint-disable quotes */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-multi-assign */
/* eslint-disable no-use-before-define */
/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable func-names */
export default function icon(global) {
  /* Set up a RequestAnimationFrame shim so we can animate efficiently FOR
   * GREAT JUSTICE. */
  let requestInterval;
  let cancelInterval;

  (function () {
    const raf = global.requestAnimationFrame
      || global.webkitRequestAnimationFrame
      || global.mozRequestAnimationFrame
      || global.oRequestAnimationFrame
      || global.msRequestAnimationFrame;
    let caf = global.cancelAnimationFrame
      || global.webkitCancelAnimationFrame
      || global.mozCancelAnimationFrame
      || global.oCancelAnimationFrame
      || global.msCancelAnimationFrame;

    if (raf && caf) {
      requestInterval = function (fn, delay) {
        const handle = { value: null };

        function loop() {
          handle.value = raf(loop);
          fn();
        }

        loop();
        return handle;
      };

      cancelInterval = function (handle) {
        caf(handle.value);
      };
    } else {
      requestInterval = setInterval;
      cancelInterval = clearInterval;
    }
  }());

  const KEYFRAME = 500;
  let STROKE = 0.1;
  let TAU = 2.0 * Math.PI;
  let TWO_OVER_SQRT_2 = 2.0 / Math.sqrt(2);

  function circle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU, false);
    ctx.fill();
  }

  function line(ctx, ax, ay, bx, by) {
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }

  function puff(ctx, t, cx, cy, rx, ry, rmin, rmax) {
    const c = Math.cos(t * TAU);
    let s = Math.sin(t * TAU);

    rmax -= rmin;

    circle(
      ctx,
      cx - s * rx,
      cy + c * ry + rmax * 0.5,
      rmin + (1 - c * 0.5) * rmax,
    );
  }

  function puffs(ctx, t, cx, cy, rx, ry, rmin, rmax) {
    let i;

    for (i = 5; i--;) { puff(ctx, t + i / 5, cx, cy, rx, ry, rmin, rmax); }
  }

  function cloud(ctx, t, cx, cy, cw, s, color) {
    t /= 30000;

    const a = cw * 0.21;
    let b = cw * 0.12;
    let c = cw * 0.24;
    let d = cw * 0.28;

    ctx.fillStyle = color;
    puffs(ctx, t, cx, cy, a, b, c, d);

    ctx.globalCompositeOperation = 'destination-out';
    puffs(ctx, t, cx, cy, a, b, c - s, d - s);
    ctx.globalCompositeOperation = 'source-over';
  }

  function sun(ctx, t, cx, cy, cw, s, color) {
    t /= 120000;

    const a = cw * 0.25 - s * 0.5;
    let b = cw * 0.32 + s * 0.5;
    let c = cw * 0.50 - s * 0.5;
    let i; let p; let cos; let
      sin;

    ctx.strokeStyle = color;
    ctx.lineWidth = s;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.arc(cx, cy, a, 0, TAU, false);
    ctx.stroke();

    for (i = 8; i--;) {
      p = (t + i / 8) * TAU;
      cos = Math.cos(p);
      sin = Math.sin(p);
      line(ctx, cx + cos * b, cy + sin * b, cx + cos * c, cy + sin * c);
    }
  }

  function moon(ctx, t, cx, cy, cw, s, color) {
    t /= 15000;

    const a = cw * 0.29 - s * 0.5;
    let b = cw * 0.05;
    let c = Math.cos(t * TAU);
    let p = c * TAU / -16;

    ctx.strokeStyle = color;
    ctx.lineWidth = s;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    cx += c * b;

    ctx.beginPath();
    ctx.arc(cx, cy, a, p + TAU / 8, p + TAU * 7 / 8, false);
    ctx.arc(cx + Math.cos(p) * a * TWO_OVER_SQRT_2, cy + Math.sin(p) * a * TWO_OVER_SQRT_2, a, p + TAU * 5 / 8, p + TAU * 3 / 8, true);
    ctx.closePath();
    ctx.stroke();
  }

  function rain(ctx, t, cx, cy, cw, s, color) {
    t /= 1350;

    const a = cw * 0.16;
    let b = TAU * 11 / 12;
    let c = TAU * 7 / 12;
    let i; let p; let x; let
      y;

    ctx.fillStyle = color;

    for (i = 4; i--;) {
      p = (t + i / 4) % 1;
      x = cx + ((i - 1.5) / 1.5) * (i === 1 || i === 2 ? -1 : 1) * a;
      y = cy + p * p * cw;
      ctx.beginPath();
      ctx.moveTo(x, y - s * 1.5);
      ctx.arc(x, y, s * 0.75, b, c, false);
      ctx.fill();
    }
  }

  function sleet(ctx, t, cx, cy, cw, s, color) {
    t /= 750;

    const a = cw * 0.1875;
    let b = TAU * 11 / 12;
    let c = TAU * 7 / 12;
    let i; let p; let x; let
      y;

    ctx.strokeStyle = color;
    ctx.lineWidth = s * 0.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (i = 4; i--;) {
      p = (t + i / 4) % 1;
      x = Math.floor(cx + ((i - 1.5) / 1.5) * (i === 1 || i === 2 ? -1 : 1) * a) + 0.5;
      y = cy + p * cw;
      line(ctx, x, y - s * 1.5, x, y + s * 1.5);
    }
  }

  function snow(ctx, t, cx, cy, cw, s, color) {
    t /= 3000;

    const a = cw * 0.16;
    let b = s * 0.75;
    let u = t * TAU * 0.7;
    let ux = Math.cos(u) * b;
    let uy = Math.sin(u) * b;
    let v = u + TAU / 3;
    let vx = Math.cos(v) * b;
    let vy = Math.sin(v) * b;
    let w = u + TAU * 2 / 3;
    let wx = Math.cos(w) * b;
    let wy = Math.sin(w) * b;
    let i; let p; let x; let
      y;

    ctx.strokeStyle = color;
    ctx.lineWidth = s * 0.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (i = 4; i--;) {
      p = (t + i / 4) % 1;
      x = cx + Math.sin((p + i / 4) * TAU) * a;
      y = cy + p * cw;

      line(ctx, x - ux, y - uy, x + ux, y + uy);
      line(ctx, x - vx, y - vy, x + vx, y + vy);
      line(ctx, x - wx, y - wy, x + wx, y + wy);
    }
  }

  function fogbank(ctx, t, cx, cy, cw, s, color) {
    t /= 30000;

    const a = cw * 0.21;
    let b = cw * 0.06;
    let c = cw * 0.21;
    let d = cw * 0.28;

    ctx.fillStyle = color;
    puffs(ctx, t, cx, cy, a, b, c, d);

    ctx.globalCompositeOperation = 'destination-out';
    puffs(ctx, t, cx, cy, a, b, c - s, d - s);
    ctx.globalCompositeOperation = 'source-over';
  }

  function foglines(ctx, t, cw, ch, s, k, color) {
    t /= 5000;

    const a = Math.cos((t) * TAU) * s * 0.02;
    let b = Math.cos((t + 0.25) * TAU) * s * 0.02;
    let c = Math.cos((t + 0.50) * TAU) * s * 0.02;
    let d = Math.cos((t + 0.75) * TAU) * s * 0.02;
    let n = ch * 0.936;
    let e = Math.floor(n - k * 0.5) + 0.5;
    let f = Math.floor(n - k * 2.5) + 0.5;

    ctx.strokeStyle = color;
    ctx.lineWidth = k;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    line(ctx, a + cw * 0.2 + k * 0.5, e, b + cw * 0.8 - k * 0.5, e);
    line(ctx, c + cw * 0.2 + k * 0.5, f, d + cw * 0.8 - k * 0.5, f);
  }

  const WIND_PATHS = [
    [
      -0.7500, -0.1800, -0.7219, -0.1527, -0.6971, -0.1225,
      -0.6739, -0.0910, -0.6516, -0.0588, -0.6298, -0.0262,
      -0.6083, 0.0065, -0.5868, 0.0396, -0.5643, 0.0731,
      -0.5372, 0.1041, -0.5033, 0.1259, -0.4662, 0.1406,
      -0.4275, 0.1493, -0.3881, 0.1530, -0.3487, 0.1526,
      -0.3095, 0.1488, -0.2708, 0.1421, -0.2319, 0.1342,
      -0.1943, 0.1217, -0.1600, 0.1025, -0.1290, 0.0785,
      -0.1012, 0.0509, -0.0764, 0.0206, -0.0547, -0.0120,
      -0.0378, -0.0472, -0.0324, -0.0857, -0.0389, -0.1241,
      -0.0546, -0.1599, -0.0814, -0.1876, -0.1193, -0.1964,
      -0.1582, -0.1935, -0.1931, -0.1769, -0.2157, -0.1453,
      -0.2290, -0.1085, -0.2327, -0.0697, -0.2240, -0.0317,
      -0.2064, 0.0033, -0.1853, 0.0362, -0.1613, 0.0672,
      -0.1350, 0.0961, -0.1051, 0.1213, -0.0706, 0.1397,
      -0.0332, 0.1512, 0.0053, 0.1580, 0.0442, 0.1624,
      0.0833, 0.1636, 0.1224, 0.1615, 0.1613, 0.1565,
      0.1999, 0.1500, 0.2378, 0.1402, 0.2749, 0.1279,
      0.3118, 0.1147, 0.3487, 0.1015, 0.3858, 0.0892,
      0.4236, 0.0787, 0.4621, 0.0715, 0.5012, 0.0702,
      0.5398, 0.0766, 0.5768, 0.0890, 0.6123, 0.1055,
      0.6466, 0.1244, 0.6805, 0.1440, 0.7147, 0.1630,
      0.7500, 0.1800,
    ],
    [
      -0.7500, 0.0000, -0.7033, 0.0195, -0.6569, 0.0399,
      -0.6104, 0.0600, -0.5634, 0.0789, -0.5155, 0.0954,
      -0.4667, 0.1089, -0.4174, 0.1206, -0.3676, 0.1299,
      -0.3174, 0.1365, -0.2669, 0.1398, -0.2162, 0.1391,
      -0.1658, 0.1347, -0.1157, 0.1271, -0.0661, 0.1169,
      -0.0170, 0.1046, 0.0316, 0.0903, 0.0791, 0.0728,
      0.1259, 0.0534, 0.1723, 0.0331, 0.2188, 0.0129,
      0.2656, -0.0064, 0.3122, -0.0263, 0.3586, -0.0466,
      0.4052, -0.0665, 0.4525, -0.0847, 0.5007, -0.1002,
      0.5497, -0.1130, 0.5991, -0.1240, 0.6491, -0.1325,
      0.6994, -0.1380, 0.7500, -0.1400,
    ],
  ];
  let WIND_OFFSETS = [
    { start: 0.36, end: 0.11 },
    { start: 0.56, end: 0.16 },
  ];

  function leaf(ctx, t, x, y, cw, s, color) {
    const a = cw / 8;
    let b = a / 3;
    let c = 2 * b;
    let d = (t % 1) * TAU;
    let e = Math.cos(d);
    let f = Math.sin(d);

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = s;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.arc(x, y, a, d, d + Math.PI, false);
    ctx.arc(x - b * e, y - b * f, c, d + Math.PI, d, false);
    ctx.arc(x + c * e, y + c * f, b, d + Math.PI, d, true);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.stroke();
  }

  function swoosh(ctx, t, cx, cy, cw, s, index, total, color, leafcolor) {
    t /= 2500;

    const path = WIND_PATHS[index];
    let a = (t + index - WIND_OFFSETS[index].start) % total;
    let c = (t + index - WIND_OFFSETS[index].end) % total;
    let e = (t + index) % total;
    let b; let d; let f; let
      i;

    ctx.strokeStyle = color;
    ctx.lineWidth = s;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (a < 1) {
      ctx.beginPath();

      a *= path.length / 2 - 1;
      b = Math.floor(a);
      a -= b;
      b *= 2;
      b += 2;

      ctx.moveTo(
        cx + (path[b - 2] * (1 - a) + path[b] * a) * cw,
        cy + (path[b - 1] * (1 - a) + path[b + 1] * a) * cw,
      );

      if (c < 1) {
        c *= path.length / 2 - 1;
        d = Math.floor(c);
        c -= d;
        d *= 2;
        d += 2;

        for (i = b; i !== d; i += 2) { ctx.lineTo(cx + path[i] * cw, cy + path[i + 1] * cw); }

        ctx.lineTo(
          cx + (path[d - 2] * (1 - c) + path[d] * c) * cw,
          cy + (path[d - 1] * (1 - c) + path[d + 1] * c) * cw,
        );
      } else {
        for (i = b; i !== path.length; i += 2) { ctx.lineTo(cx + path[i] * cw, cy + path[i + 1] * cw); }
      }

      ctx.stroke();
    } else if (c < 1) {
      ctx.beginPath();

      c *= path.length / 2 - 1;
      d = Math.floor(c);
      c -= d;
      d *= 2;
      d += 2;

      ctx.moveTo(cx + path[0] * cw, cy + path[1] * cw);

      for (i = 2; i !== d; i += 2) { ctx.lineTo(cx + path[i] * cw, cy + path[i + 1] * cw); }

      ctx.lineTo(
        cx + (path[d - 2] * (1 - c) + path[d] * c) * cw,
        cy + (path[d - 1] * (1 - c) + path[d + 1] * c) * cw,
      );

      ctx.stroke();
    }

    if (e < 1) {
      e *= path.length / 2 - 1;
      f = Math.floor(e);
      e -= f;
      f *= 2;
      f += 2;

      leaf(
        ctx,
        t,
        cx + (path[f - 2] * (1 - e) + path[f] * e) * cw,
        cy + (path[f - 1] * (1 - e) + path[f + 1] * e) * cw,
        cw,
        s,
        leafcolor,
      );
    }
  }

  function thunderbolts(ctx, t, cx, cy, cw, color) {
    t /= 1000;

    let alpha = 1 - t % 1;
    let a = cw / 25;
    let b = Math.floor(t % 4);
    var x = x = cx + ((b - 1.5) / 1.5) * (b === 1 || b === 2 ? -1 : 1) * cw * 0.16;
    let y = cy;

    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;

    ctx.beginPath();
    ctx.moveTo(x - a, y - a * 5);
    ctx.lineTo(x - a * 3, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x - a * 2, y + a * 5);
    ctx.lineTo(x + a * 3, y - a);
    ctx.lineTo(x, y - a);
    ctx.lineTo(x + a * 2, y - a * 5);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 1;
  }

  function hail(ctx, t, cx, cy, cw, s, color) {
    t /= 900;

    const a = cw * 0.16;
    let i; let p; let x; let
      y;

    ctx.fillStyle = color;

    for (i = 8; i--;) {
      p = (t + i / 8) % 1;
      x = cx + ((i - 3) / 3) * (i === 1 || i === 3 || i === 4 || i === 6 ? -1 : 1) * a;
      y = cy + p * p * cw;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, s * 0.4, 0, 2 * Math.PI, false);
      ctx.fill();
    }
  }

  var Skycons = function (opts) {
    opts = opts || {};
    this.list = [];
    this.interval = null;
    this.monochrome = typeof (opts.monochrome) === "undefined" ? true : opts.monochrome;
    opts.colors = opts.colors || {};
    this.colors = {
      main: opts.colors.main || "#111",
      moon: opts.colors.moon || "#353545",
      fog: opts.colors.fog || "#CCC",
      fogbank: opts.colors.fogbank || "#AAA",
      light_cloud: opts.colors.light_cloud || "#888",
      cloud: opts.colors.cloud || "#666",
      dark_cloud: opts.colors.dark_cloud || "#444",
      thunder: opts.colors.thunder || "#FF0",
      snow: opts.colors.snow || "#C2EEFF",
      hail: opts.colors.hail || "#CCF",
      sleet: opts.colors.sleet || "#C2EEFF",
      wind: opts.colors.wind || "#777",
      leaf: opts.colors.leaf || "#2C5228",
      rain: opts.colors.rain || "#7FDBFF",
      sun: opts.colors.sun || "#FFDC00",
    };

    if (this.monochrome) {
      this.color = opts.color || this.colors.main;
    } else {
      this.color = this.colors;
    }
    this.resizeClear = !!(opts && opts.resizeClear);
  };

  Skycons.CLEAR_DAY = function (ctx, t, color) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      s = Math.min(w, h);

    sun(ctx, t, w * 0.5, h * 0.5, s, s * STROKE, color.sun || color);
  };

  Skycons.CLEAR_NIGHT = function (ctx, t, color) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      s = Math.min(w, h);

    moon(ctx, t, w * 0.5, h * 0.5, s, s * STROKE, color.moon || color);
  };

  Skycons.PARTLY_CLOUDY_DAY = function (ctx, t, color) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      s = Math.min(w, h);

    sun(ctx, t, w * 0.625, h * 0.375, s * 0.75, s * STROKE * 0.9, color.sun || color);
    cloud(ctx, t, w * 0.375, h * 0.625, s * 0.75, s * STROKE * 0.9, color.light_cloud || color);
  };

  Skycons.PARTLY_CLOUDY_NIGHT = function (ctx, t, color) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      s = Math.min(w, h);

    moon(ctx, t, w * 0.667, h * 0.375, s * 0.75, s * STROKE * 0.9, color.moon || color);
    cloud(ctx, t, w * 0.375, h * 0.625, s * 0.75, s * STROKE * 0.9, color.light_cloud || color);
  };

  Skycons.CLOUDY = function (ctx, t, color) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      s = Math.min(w, h);

    cloud(ctx, t, w * 0.5, h * 0.5, s, s * STROKE, color.light_cloud || color || color);
  };

  Skycons.RAIN = function (ctx, t, color) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      s = Math.min(w, h);

    rain(ctx, t, w * 0.5, h * 0.37, s * 0.9, s * STROKE, color.rain || color);
    cloud(ctx, t, w * 0.5, h * 0.37, s * 0.9, s * STROKE, color.cloud || color);
  };

  Skycons.SHOWERS_DAY = function (ctx, t, color) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      s = Math.min(w, h);


    sun(ctx, t, w * 0.625, h * 0.325, s * 0.65, s * STROKE * 0.8, color.sun || color);
    rain(ctx, t, w * 0.375, h * 0.5, s * 0.7, s * STROKE * 0.9, color.rain || color);
    cloud(ctx, t, w * 0.375, h * 0.5, s * 0.7, s * STROKE * 0.9, color.cloud || color);
  };

  Skycons.SHOWERS_NIGHT = function (ctx, t, color) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      s = Math.min(w, h);

    moon(ctx, t, w * 0.667, h * 0.325, s * 0.75, s * STROKE * 0.8, color.moon || color);
    rain(ctx, t, w * 0.375, h * 0.5, s * 0.7, s * STROKE * 0.9, color.rain || color);
    cloud(ctx, t, w * 0.375, h * 0.5, s * 0.7, s * STROKE * 0.9, color.cloud || color);
  };

  Skycons.SLEET = function (ctx, t, color) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      s = Math.min(w, h);

    sleet(ctx, t, w * 0.5, h * 0.37, s * 0.9, s * STROKE, color.sleet || color);
    cloud(ctx, t, w * 0.5, h * 0.37, s * 0.9, s * STROKE, color.cloud || color);
  };

  Skycons.RAIN_SNOW = function (ctx, t, color) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      s = Math.min(w, h);

    rain(ctx, t, w * 0.5, h * 0.37, s * 0.9, s * STROKE, color.rain || color);
    snow(ctx, t, w * 0.5, h * 0.37, s * 0.9, s * STROKE, color.snow || color);
    cloud(ctx, t, w * 0.5, h * 0.37, s * 0.9, s * STROKE, color.cloud || color);
  };

  Skycons.RAIN_SNOW_SHOWERS_DAY = function (ctx, t, color) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      s = Math.min(w, h);

    sun(ctx, t, w * 0.625, h * 0.325, s * 0.65, s * STROKE * 0.8, color.sun || color);
    snow(ctx, t, w * 0.375, h * 0.5, s * 0.7, s * STROKE * 0.9, color.snow || color);
    rain(ctx, t, w * 0.375, h * 0.5, s * 0.7, s * STROKE * 0.9, color.rain || color);
    cloud(ctx, t, w * 0.375, h * 0.5, s * 0.7, s * STROKE * 0.9, color.cloud || color);
  };

  Skycons.RAIN_SNOW_SHOWERS_NIGHT = function (ctx, t, color) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      s = Math.min(w, h);

    moon(ctx, t, w * 0.667, h * 0.325, s * 0.75, s * STROKE * 0.8, color.moon || color);
    snow(ctx, t, w * 0.375, h * 0.5, s * 0.7, s * STROKE * 0.9, color.snow || color);
    rain(ctx, t, w * 0.375, h * 0.5, s * 0.7, s * STROKE * 0.9, color.rain || color);
    cloud(ctx, t, w * 0.375, h * 0.5, s * 0.7, s * STROKE * 0.9, color.cloud || color);
  };

  Skycons.SNOW = function (ctx, t, color) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      s = Math.min(w, h);

    snow(ctx, t, w * 0.5, h * 0.37, s * 0.9, s * STROKE, color.snow || color);
    cloud(ctx, t, w * 0.5, h * 0.37, s * 0.9, s * STROKE, color.cloud || color);
  };

  Skycons.SNOW_SHOWERS_DAY = function (ctx, t, color) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      s = Math.min(w, h);

    sun(ctx, t, w * 0.625, h * 0.325, s * 0.65, s * STROKE * 0.8, color.sun || color);
    snow(ctx, t, w * 0.375, h * 0.5, s * 0.7, s * STROKE * 0.9, color.snow || color);
    cloud(ctx, t, w * 0.375, h * 0.5, s * 0.7, s * STROKE * 0.9, color.cloud || color);
  };

  Skycons.SNOW_SHOWERS_NIGHT = function (ctx, t, color) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      s = Math.min(w, h);

    moon(ctx, t, w * 0.667, h * 0.325, s * 0.75, s * STROKE * 0.8, color.moon || color);
    snow(ctx, t, w * 0.375, h * 0.5, s * 0.7, s * STROKE * 0.9, color.snow || color);
    cloud(ctx, t, w * 0.375, h * 0.5, s * 0.7, s * STROKE * 0.9, color.cloud || color);
  };

  Skycons.WIND = function (ctx, t, color) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      s = Math.min(w, h);

    swoosh(ctx, t, w * 0.5, h * 0.5, s, s * STROKE, 0, 2, color.wind || color, color.leaf || color);
    swoosh(ctx, t, w * 0.5, h * 0.5, s, s * STROKE, 1, 2, color.wind || color, color.leaf || color);
  };

  Skycons.FOG = function (ctx, t, color) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      s = Math.min(w, h),
      k = s * STROKE;

    fogbank(ctx, t, w * 0.5, h * 0.32, s * 0.75, k * 0.9, color.light_cloud || color);
    foglines(ctx, t, w, h, s, k, color.fog || color);
  };

  Skycons.THUNDER = function (ctx, t, color) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      s = Math.min(w, h);

    thunderbolts(ctx, t, w * 0.5, h * 0.825, s * 0.9, color.thunder || color);
    cloud(ctx, t, w * 0.5, h * 0.37, s * 0.9, s * STROKE, color.dark_cloud || color);
  };

  Skycons.THUNDER_RAIN = function (ctx, t, color) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      s = Math.min(w, h);

    rain(ctx, t, w * 0.5, h * 0.5, s * 0.9, s * STROKE, color.rain || color);
    thunderbolts(ctx, t, w * 0.5, h * 0.825, s * 0.9, color.thunder || color);
    cloud(ctx, t, w * 0.5, h * 0.37, s * 0.9, s * STROKE, color.dark_cloud || color);
  };

  Skycons.THUNDER_SHOWERS_DAY = function (ctx, t, color) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      s = Math.min(w, h);

    thunderbolts(ctx, t, w * 0.375, h * 0.85, s * 0.7, color.thunder || color);
    sun(ctx, t, w * 0.625, h * 0.325, s * 0.65, s * STROKE * 0.8, color.sun || color);
    rain(ctx, t, w * 0.375, h * 0.5, s * 0.7, s * STROKE * 0.9, color.rain || color);
    cloud(ctx, t, w * 0.375, h * 0.5, s * 0.7, s * STROKE * 0.9, color.dark_cloud || color);
  };

  Skycons.THUNDER_SHOWERS_NIGHT = function (ctx, t, color) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      s = Math.min(w, h);

    thunderbolts(ctx, t, w * 0.375, h * 0.85, s * 0.7, color.thunder || color);
    moon(ctx, t, w * 0.667, h * 0.325, s * 0.75, s * STROKE * 0.8, color.moon || color);
    rain(ctx, t, w * 0.375, h * 0.5, s * 0.7, s * STROKE * 0.9, color.rain || color);
    cloud(ctx, t, w * 0.375, h * 0.5, s * 0.7, s * STROKE * 0.9, color.dark_cloud || color);
  };

  Skycons.HAIL = function (ctx, t, color) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      s = Math.min(w, h);

    hail(ctx, t, w * 0.5, h * 0.37, s * 0.9, s * STROKE, color.hail || color);
    cloud(ctx, t, w * 0.5, h * 0.37, s * 0.9, s * STROKE, color.cloud || color);
  };

  Skycons.prototype = {
    _determineDrawingFunction(draw) {
      if (typeof draw === 'string') { draw = Skycons[draw.toUpperCase().replace(/-/g, "_")] || null; }

      return draw;
    },
    add(el, draw) {
      let obj;

      if (typeof el === 'string') { el = document.getElementById(el); }

      // Does nothing if canvas name doesn't exists
      if (el === null || el === undefined) { return; }

      draw = this._determineDrawingFunction(draw);

      // Does nothing if the draw function isn't actually a function
      if (typeof draw !== 'function') { return; }

      obj = {
        element: el,
        context: el.getContext('2d'),
        drawing: draw,
      };

      this.list.push(obj);
      this.draw(obj, KEYFRAME);
    },
    set(el, draw) {
      let i;

      if (typeof el === 'string') { el = document.getElementById(el); }

      for (i = this.list.length; i--;) {
        if (this.list[i].element === el) {
          this.list[i].drawing = this._determineDrawingFunction(draw);
          this.draw(this.list[i], KEYFRAME);
          return;
        }
      }

      this.add(el, draw);
    },
    remove(el) {
      let i;

      if (typeof el === 'string') { el = document.getElementById(el); }

      for (i = this.list.length; i--;) {
        if (this.list[i].element === el) {
          this.list.splice(i, 1);
          return;
        }
      }
    },
    draw(obj, time) {
      let { canvas } = obj.context;

      if (this.resizeClear) { canvas.width = canvas.width; }

      else { obj.context.clearRect(0, 0, canvas.width, canvas.height); }

      obj.drawing(obj.context, time, this.color);
    },
    play() {
      let self = this;

      this.pause();
      this.interval = requestInterval(() => {
        var now = Date.now(),
          i;

        for (i = self.list.length; i--;)
          self.draw(self.list[i], now);
      }, 1000 / 60);
    },
    pause() {
      let i;

      if (this.interval) {
        cancelInterval(this.interval);
        this.interval = null;
      }
    },
  };
  const icons = new Skycons({ color: '#fff' });
  // global.Skycons = Skycons;
  return { icons, Skycons };
}
