(() => {
  const canvas = document.getElementById("pad");
  const wrap = document.getElementById("pad-wrap");
  const form = document.getElementById("hi");
  const drawing = document.getElementById("drawing");
  const strokesEl = document.getElementById("strokes");
  const email = document.getElementById("email");
  const message = document.getElementById("message");
  const hint = document.getElementById("client-hint");
  const MIN = 140;
  if (!canvas || !wrap || !form || !drawing || !strokesEl || !email || !message || !hint) return;

  // A human rarely draws a perfectly straight line. Strokes with very few
  // points, or whose path length barely exceeds the straight-line distance
  // between their endpoints, are treated as "lines" rather than sketching.
  // The server re-checks this so the form can't be bypassed by POSTing raw
  // strokes data.
  const LINE_STRAIGHTNESS_RATIO = 0.985;
  const MIN_PATH_LENGTH = 4;

  const isLineStroke = (points) => {
    if (!points || points.length < 3) return true;
    let pathLen = 0;
    for (let i = 1; i < points.length; i++) {
      pathLen += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    }
    if (pathLen < MIN_PATH_LENGTH) return true;
    const first = points[0];
    const last = points[points.length - 1];
    const chordLen = Math.hypot(last.x - first.x, last.y - first.y);
    return chordLen / pathLen > LINE_STRAIGHTNESS_RATIO;
  };

  // Requires at least two curvy strokes, no matter how many straight ticks
  // (e.g. sprinklers, hatching) are also on the canvas. A single squiggle
  // isn't enough, and an all-lines drawing (like 2-point bot strokes) is
  // rejected.
  const looksHandDrawn = (strokeList) => {
    if (!strokeList || strokeList.length === 0) return false;
    let curvyCount = 0;
    for (const stroke of strokeList) {
      if (!isLineStroke((stroke && stroke.points) || [])) curvyCount += 1;
      if (curvyCount >= 2) return true;
    }
    return false;
  };

  const COLORS = ["#1c1814", "#c23b22", "#2f6fed", "#2f9e44", "#e6a700", "#f3eee4"];
  const PAPER = "#f3eee4";
  const INK = "#1c1814";
  let color = COLORS[0];
  let size = 5;
  let ink = 0;
  let drawingNow = false;
  let last = null;
  let startedAt = 0;
  let currentStroke = null;
  let strokes = [];
  let dpr = 1;
  let cssW = 0;
  let cssH = 0;
  let sent = false;

  const ctx = () => canvas.getContext("2d");

  const applyBrush = () => {
    const c = ctx();
    c.lineCap = "round";
    c.lineJoin = "round";
    c.strokeStyle = color;
    c.lineWidth = size;
  };

  const paint = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cssW = wrap.clientWidth;
    cssH = Math.max(320, Math.min(480, Math.round(cssW * 0.48)));
    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    const c = ctx();
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.fillStyle = PAPER;
    c.fillRect(0, 0, cssW, cssH);
    applyBrush();
    ink = 0;
    strokes = [];
    currentStroke = null;
    drawing.value = "";
    strokesEl.value = "";
  };

  const resetForm = () => {
    startedAt = 0;
    paint();
    email.value = "";
    message.value = "";
    hint.hidden = true;
  };

  const pos = (e) => {
    const r = canvas.getBoundingClientRect();
    return {
      x: e.clientX - r.left,
      y: e.clientY - r.top,
      t: performance.now() - startedAt,
    };
  };

  canvas.addEventListener("pointerdown", (e) => {
    if (sent) return;
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    if (!startedAt) startedAt = performance.now();
    drawingNow = true;
    last = pos(e);
    currentStroke = {
      color,
      width: size,
      points: [{ x: +last.x.toFixed(2), y: +last.y.toFixed(2), t: +last.t.toFixed(1) }],
    };
    hint.hidden = true;
    applyBrush();
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!drawingNow || !last || !currentStroke) return;
    const c = ctx();
    const p = pos(e);
    c.beginPath();
    c.moveTo(last.x, last.y);
    c.lineTo(p.x, p.y);
    c.stroke();
    ink += Math.hypot(p.x - last.x, p.y - last.y);
    currentStroke.points.push({
      x: +p.x.toFixed(2),
      y: +p.y.toFixed(2),
      t: +p.t.toFixed(1),
    });
    last = p;
  });

  const endStroke = () => {
    if (currentStroke && currentStroke.points.length > 1) strokes.push(currentStroke);
    currentStroke = null;
    drawingNow = false;
    last = null;
  };
  canvas.addEventListener("pointerup", endStroke);
  canvas.addEventListener("pointercancel", endStroke);

  document.querySelectorAll(".swatch").forEach((btn) => {
    btn.addEventListener("click", () => {
      color = btn.dataset.color;
      document.querySelectorAll(".swatch").forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      applyBrush();
    });
  });

  document.querySelectorAll(".size").forEach((btn) => {
    btn.addEventListener("click", () => {
      size = Number(btn.dataset.size);
      document.querySelectorAll(".size").forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      applyBrush();
    });
  });

  document.getElementById("clear").addEventListener("click", () => {
    resetForm();
    const result = document.getElementById("result");
    if (result) result.innerHTML = "";
  });

  // --- Success celebration -------------------------------------------------

  const reducedMotion = () =>
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  // "thanks" handwritten as one continuous cursive stroke plus the t crossbar,
  // authored in a 300x140 design space (baseline y=100, x-height y=60).
  const SCRIPT = {
    w: 300,
    h: 140,
    pen: 5,
    strokes: [
      "M 12 104" +
        " C 22 98 31 76 35 44" +
        " C 34 62 33 85 35 96" +
        " C 37 104 45 101 51 85" +
        " C 59 62 67 34 64 27" +
        " C 61 21 56 30 56 44" +
        " C 56 62 59 85 60 97" +
        " C 61 102 62 99 63 91" +
        " C 65 74 73 63 79 67" +
        " C 84 71 86 84 87 97" +
        " C 88 103 95 100 99 86" +
        " C 103 75 112 63 119 64" +
        " C 110 61 101 70 100 82" +
        " C 99 94 106 101 112 98" +
        " C 118 95 121 87 122 71" +
        " C 122 82 122 93 124 99" +
        " C 126 104 132 100 137 86" +
        " C 140 77 143 68 146 64" +
        " C 146 74 146 88 147 97" +
        " C 148 101 149 97 150 89" +
        " C 152 72 159 62 165 66" +
        " C 169 69 171 83 172 96" +
        " C 173 102 180 99 184 86" +
        " C 191 63 199 33 196 26" +
        " C 193 20 188 29 188 44" +
        " C 188 63 190 85 191 97" +
        " C 192 102 193 98 194 90" +
        " C 197 75 205 65 210 68" +
        " C 214 71 210 78 204 79" +
        " C 210 81 216 91 219 96" +
        " C 221 101 228 99 232 87" +
        " C 235 77 240 66 244 62" +
        " C 249 66 251 76 248 85" +
        " C 246 92 240 98 236 94" +
        " C 233 90 237 85 242 87" +
        " C 250 90 259 87 265 80",
      "M 22 55 C 30 50 42 50 50 53",
    ],
  };

  let scriptLengths = null;
  // getTotalLength needs the path to live in the document, so measure inside
  // a hidden SVG and cache the results.
  const strokeLengths = () => {
    if (scriptLengths) return scriptLengths;
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    const paths = SCRIPT.strokes.map((d) => {
      const p = document.createElementNS(ns, "path");
      p.setAttribute("d", d);
      svg.appendChild(p);
      return p;
    });
    document.body.appendChild(svg);
    scriptLengths = paths.map((p) => p.getTotalLength());
    svg.remove();
    return scriptLengths;
  };

  const scriptLayout = () => {
    const scale = Math.min((cssW * 0.7) / SCRIPT.w, (cssH * 0.62) / SCRIPT.h);
    return {
      scale,
      ox: (cssW - SCRIPT.w * scale) / 2,
      oy: (cssH - SCRIPT.h * scale) / 2,
    };
  };

  const strokeScript = (progressByStroke) => {
    const c = ctx();
    const { scale, ox, oy } = scriptLayout();
    c.save();
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.fillStyle = PAPER;
    c.fillRect(0, 0, cssW, cssH);
    c.translate(ox, oy);
    c.scale(scale, scale);
    c.strokeStyle = INK;
    c.lineWidth = SCRIPT.pen;
    c.lineCap = "round";
    c.lineJoin = "round";
    const lengths = strokeLengths();
    SCRIPT.strokes.forEach((d, i) => {
      const progress = progressByStroke[i];
      if (progress <= 0) return;
      const path = new Path2D(d);
      if (progress >= 1) {
        c.setLineDash([]);
      } else {
        const len = lengths[i];
        c.setLineDash([len, len]);
        c.lineDashOffset = len * (1 - progress);
      }
      c.stroke(path);
    });
    c.restore();
  };

  const wipeCanvas = (done) => {
    const dur = 520;
    const start = performance.now();
    const band = Math.max(48, cssW * 0.12);
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const e = easeInOutCubic(p);
      const edge = (cssW + band) * e;
      const c = ctx();
      c.save();
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.fillStyle = PAPER;
      c.fillRect(0, 0, Math.max(0, edge - band), cssH);
      const g = c.createLinearGradient(edge - band, 0, edge, 0);
      g.addColorStop(0, PAPER);
      g.addColorStop(1, PAPER + "00");
      c.fillStyle = g;
      c.fillRect(edge - band, 0, band, cssH);
      c.restore();
      if (p < 1) requestAnimationFrame(step);
      else done();
    };
    requestAnimationFrame(step);
  };

  const writeThanks = () => {
    const lengths = strokeLengths();
    // Pen speed tied to path length so the crossbar dashes off quickly.
    const durations = lengths.map((len) => Math.max(260, len * 2.2));
    const gap = 140;
    let strokeIdx = 0;
    let strokeStart = performance.now();
    const progress = SCRIPT.strokes.map(() => 0);
    const step = (now) => {
      const p = Math.min(1, Math.max(0, (now - strokeStart) / durations[strokeIdx]));
      progress[strokeIdx] = easeInOutCubic(p);
      strokeScript(progress);
      if (p < 1) {
        requestAnimationFrame(step);
      } else if (strokeIdx < SCRIPT.strokes.length - 1) {
        strokeIdx += 1;
        strokeStart = now + gap;
        setTimeout(() => requestAnimationFrame(step), gap);
      }
    };
    requestAnimationFrame(step);
  };

  const collapse = (el, delay) => {
    el.style.height = el.scrollHeight + "px";
    el.style.overflow = "hidden";
    void el.offsetHeight;
    const ease = "cubic-bezier(0.65, 0, 0.35, 1)";
    el.style.transition =
      `height 0.55s ${ease} ${delay}ms, margin 0.55s ${ease} ${delay}ms, ` +
      `opacity 0.4s ease ${delay}ms, transform 0.55s ${ease} ${delay}ms`;
    el.style.height = "0px";
    el.style.margin = "0px";
    el.style.opacity = "0";
    el.style.transform = "translateY(-8px)";
    setTimeout(() => {
      el.style.display = "none";
    }, delay + 600);
  };

  const celebrate = () => {
    if (sent) return;
    sent = true;
    drawingNow = false;
    currentStroke = null;
    canvas.style.pointerEvents = "none";
    canvas.style.cursor = "default";
    hint.hidden = true;
    const toolbar = form.querySelector(".toolbar");
    const fields = form.querySelector(".fields");
    if (reducedMotion()) {
      if (toolbar) toolbar.style.display = "none";
      if (fields) fields.style.display = "none";
      strokeScript(SCRIPT.strokes.map(() => 1));
      return;
    }
    if (fields) collapse(fields, 0);
    if (toolbar) collapse(toolbar, 120);
    setTimeout(() => wipeCanvas(writeThanks), 380);
  };

  // Watch #result directly instead of relying on htmx event names,
  // which changed across htmx major versions.
  const result = document.getElementById("result");
  if (result) {
    new MutationObserver(() => {
      if (result.querySelector(".stamp")) celebrate();
    }).observe(result, { childList: true, subtree: true });
  }

  form.addEventListener(
    "submit",
    (e) => {
      const mail = email.value.trim();
      if (!mail || !email.checkValidity()) {
        e.preventDefault();
        e.stopImmediatePropagation();
        hint.textContent = "Leave an email so I can write back.";
        hint.hidden = false;
        email.focus();
        return;
      }
      if (ink < MIN || strokes.length === 0) {
        e.preventDefault();
        e.stopImmediatePropagation();
        hint.textContent = "A scribble isn't a picture. Draw a little more.";
        hint.hidden = false;
        return;
      }
      if (!looksHandDrawn(strokes)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        hint.textContent = "Draw a bit more than one line.";
        hint.hidden = false;
        return;
      }
      drawing.value = canvas.toDataURL("image/png");
      strokesEl.value = JSON.stringify({
        w: cssW,
        h: cssH,
        durationMs: Math.round(performance.now() - startedAt),
        ink: Math.round(ink),
        strokes,
      });
    },
    true,
  );

  paint();
  window.addEventListener("resize", () => {
    if (!sent && ink === 0) paint();
  });

  if (new URLSearchParams(location.search).get("preview") === "thanks") celebrate();
})();
