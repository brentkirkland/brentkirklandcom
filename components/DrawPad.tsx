import { useEffect, useRef, useState } from "react";

const MIN_INK = 140;

export default function DrawPad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const inkRef = useRef(0);
  const [ink, setInk] = useState(0);
  const [status, setStatus] = useState<"draw" | "too-small" | "sent">("draw");

  const paintPaper = () => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { width } = wrap.getBoundingClientRect();
    const height = Math.max(280, Math.min(420, Math.round(width * 0.62)));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#f3eee4";
    ctx.fillRect(0, 0, width, height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1c1814";
    ctx.lineWidth = 2.4;
    inkRef.current = 0;
    setInk(0);
  };

  useEffect(() => {
    paintPaper();
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => {
      if (inkRef.current === 0 && status !== "sent") paintPaper();
    });
    ro.observe(wrap);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (status === "sent") return;
    e.preventDefault();
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = pos(e);
    if (status === "too-small") setStatus("draw");
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || status === "sent") return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !last.current) return;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    inkRef.current += Math.hypot(p.x - last.current.x, p.y - last.current.y);
    last.current = p;
    setInk(inkRef.current);
  };

  const onUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = false;
    last.current = null;
    try {
      (e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId);
    } catch {
      // already released
    }
  };

  const clear = () => {
    paintPaper();
    setStatus("draw");
  };

  const submit = () => {
    if (inkRef.current < MIN_INK) {
      setStatus("too-small");
      return;
    }
    setStatus("sent");
  };

  const enough = ink >= MIN_INK;

  return (
    <div className="w-full">
      <div
        ref={wrapRef}
        className="relative overflow-hidden rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
      >
        <canvas
          ref={canvasRef}
          className="block w-full touch-none cursor-crosshair"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
        {status === "sent" && (
          <div className="absolute inset-0 flex items-end bg-ink/20 p-5">
            <div className="rounded-sm bg-night/90 px-4 py-3 text-sm text-paper">
              <p className="font-medium tracking-wide">Looks human.</p>
              <p className="mt-1 text-paper/70">
                I still don&apos;t have a mailbox for these. The drawing stays
                here, on your machine, for now.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {status !== "sent" ? (
          <>
            <button
              type="button"
              onClick={submit}
              className={`rounded-sm px-4 py-2 text-sm font-medium transition ${
                enough
                  ? "bg-paper text-ink hover:bg-white"
                  : "bg-paper/20 text-paper/80 hover:bg-paper/30"
              }`}
            >
              That&apos;s a picture
            </button>
            <button
              type="button"
              onClick={clear}
              className="px-3 py-2 text-sm text-paper/60 hover:text-paper"
            >
              Clear
            </button>
            {status === "too-small" && (
              <p className="text-sm text-amber-200/90">
                A scribble isn&apos;t a picture. Draw a little more.
              </p>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={clear}
            className="px-3 py-2 text-sm text-paper/70 hover:text-paper"
          >
            Draw another
          </button>
        )}
      </div>
    </div>
  );
}
