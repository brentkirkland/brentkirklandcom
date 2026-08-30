(() => {
  const canvas = document.getElementById("pad");
  const wrap = document.getElementById("pad-wrap");
  const form = document.getElementById("hi");
  const drawing = document.getElementById("drawing");
  const strokesEl = document.getElementById("strokes");
  const email = document.getElementById("email");
  const message = document.getElementById("message");
  const hint = document.getElementById("client-hint");
  const metricsEl = document.getElementById("draw-metrics");
  const MIN = 140;
  if (!canvas || !wrap || !form || !drawing || !strokesEl || !email || !message || !hint || !metricsEl) return;

  const COLORS = ["#1c1814", "#c23b22", "#2f6fed", "#2f9e44", "#e6a700", "#f3eee4"];
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

  const ctx = () => canvas.getContext("2d");

  const applyBrush = () => {
    const c = ctx();
    c.lineCap = "round";
    c.lineJoin = "round";
    c.strokeStyle = color;
    c.lineWidth = size;
  };

  const pointTotal = () => {
    const committed = strokes.reduce((n, s) => n + s.points.length, 0);
    const current = currentStroke ? currentStroke.points.length : 0;
    return committed + current;
  };

  const strokeTotal = () => strokes.length + (currentStroke && currentStroke.points.length > 1 ? 1 : 0);

  const updateMetrics = () => {
    const strokeCount = strokeTotal();
    const pointCount = pointTotal();
    const inkAmount = Math.round(ink);
    metricsEl.textContent = `${strokeCount} stroke${strokeCount === 1 ? "" : "s"} · ${pointCount} point${pointCount === 1 ? "" : "s"} · ${inkAmount} ink`;
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
    c.fillStyle = "#f3eee4";
    c.fillRect(0, 0, cssW, cssH);
    applyBrush();
    ink = 0;
    strokes = [];
    currentStroke = null;
    drawing.value = "";
    strokesEl.value = "";
    updateMetrics();
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
    updateMetrics();
  });

  const endStroke = () => {
    if (currentStroke && currentStroke.points.length > 1) strokes.push(currentStroke);
    currentStroke = null;
    drawingNow = false;
    last = null;
    updateMetrics();
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

  const afterSuccess = () => {
    if (document.querySelector("#result .stamp")) resetForm();
  };
  form.addEventListener("htmx:afterSwap", afterSuccess);
  form.addEventListener("htmx:after-swap", afterSuccess);

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
    if (ink === 0) paint();
  });
})();
