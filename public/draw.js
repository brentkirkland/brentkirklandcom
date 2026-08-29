(() => {
  const canvas = document.getElementById("pad");
  const wrap = document.getElementById("pad-wrap");
  const form = document.getElementById("hi");
  const drawing = document.getElementById("drawing");
  const hint = document.getElementById("client-hint");
  const MIN = 140;
  if (!canvas || !wrap || !form || !drawing || !hint) return;
  let ink = 0;
  let drawingNow = false;
  let last = null;
  const paint = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = wrap.clientWidth;
    const height = Math.max(280, Math.min(420, Math.round(width * 0.62)));
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#f3eee4";
    ctx.fillRect(0, 0, width, height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1c1814";
    ctx.lineWidth = 2.4;
    ink = 0;
    drawing.value = "";
  };
  const pos = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  canvas.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    drawingNow = true;
    last = pos(e);
    hint.hidden = true;
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drawingNow || !last) return;
    const ctx = canvas.getContext("2d");
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ink += Math.hypot(p.x - last.x, p.y - last.y);
    last = p;
  });
  const up = () => {
    drawingNow = false;
    last = null;
  };
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);
  document.getElementById("clear").addEventListener("click", () => {
    paint();
    hint.hidden = true;
    const result = document.getElementById("result");
    if (result) result.innerHTML = "";
  });
  form.addEventListener(
    "submit",
    (e) => {
      if (ink < MIN) {
        e.preventDefault();
        e.stopImmediatePropagation();
        hint.hidden = false;
        return;
      }
      drawing.value = canvas.toDataURL("image/png");
    },
    true,
  );
  paint();
})();
