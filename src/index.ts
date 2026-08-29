import { Hono } from "hono";
import { html } from "hono/html";

const app = new Hono();

const page = () => html`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Brent Kirkland</title>
    <meta name="description" content="Brent Kirkland. Security Products at Fastly. Draw a picture and leave your email." />
    <link rel="stylesheet" href="/app.css" />
    <script src="https://unpkg.com/htmx.org@4.0.0/dist/htmx.min.js"></script>
  </head>
  <body>
    <main>
      <div class="prose">
        <p class="eyebrow">Security Products</p>
        <h1>Brent Kirkland</h1>
        <p class="lede">Currently employed @ <a href="https://www.fastly.com">Fastly</a>.</p>
        <h2>Want to say hi?</h2>
        <p class="pitch">
          I don't give out my email. It turns into trash. Draw a picture instead,
          then leave yours so I can write back. The drawing is the proof you're a person.
        </p>
      </div>

      <form id="hi" class="stage" hx-post="/hi" hx-target="#result" hx-swap="innerHTML">
        <input type="hidden" name="drawing" id="drawing" />
        <input type="hidden" name="strokes" id="strokes" />

        <div class="toolbar" aria-label="Drawing tools">
          <div class="tool-group">
            <span class="tool-label">Color</span>
            <button type="button" class="swatch" data-color="#1c1814" style="--swatch:#1c1814" aria-label="Ink" aria-pressed="true"></button>
            <button type="button" class="swatch" data-color="#c23b22" style="--swatch:#c23b22" aria-label="Red" aria-pressed="false"></button>
            <button type="button" class="swatch" data-color="#2f6fed" style="--swatch:#2f6fed" aria-label="Blue" aria-pressed="false"></button>
            <button type="button" class="swatch" data-color="#2f9e44" style="--swatch:#2f9e44" aria-label="Green" aria-pressed="false"></button>
            <button type="button" class="swatch" data-color="#e6a700" style="--swatch:#e6a700" aria-label="Yellow" aria-pressed="false"></button>
            <button type="button" class="swatch" data-color="#f3eee4" style="--swatch:#f3eee4" aria-label="Eraser" aria-pressed="false"></button>
          </div>
          <div class="tool-group">
            <span class="tool-label">Brush</span>
            <button type="button" class="size" data-size="2" aria-label="Thin" aria-pressed="false"><span></span></button>
            <button type="button" class="size" data-size="5" aria-label="Medium" aria-pressed="true"><span></span></button>
            <button type="button" class="size" data-size="10" aria-label="Thick" aria-pressed="false"><span></span></button>
          </div>
        </div>

        <div id="pad-wrap"><canvas id="pad"></canvas></div>

        <div class="fields">
          <label class="field">
            Your email
            <input id="email" name="email" type="email" autocomplete="email" required placeholder="you@example.com" />
          </label>
          <div class="row">
            <button type="submit">That's a picture</button>
            <button type="button" id="clear">Clear</button>
            <p id="client-hint" class="hint" hidden>A scribble isn't a picture. Draw a little more.</p>
          </div>
          <div id="result"></div>
        </div>
      </form>

      <footer>
        <a href="https://www.linkedin.com/in/brentland/">LinkedIn</a>
        <span class="dot">·</span>
        <a href="https://github.com/brentkirkland/brentkirklandcom">Source</a>
      </footer>
    </main>
    <script src="/draw.js"></script>
  </body>
</html>`;

const emailOk = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

app.get("/", (c) => c.html(page()));

app.post("/hi", async (c) => {
  const body = await c.req.parseBody();
  const drawing = String(body["drawing"] ?? "");
  const email = String(body["email"] ?? "").trim();
  const strokesRaw = String(body["strokes"] ?? "");

  if (!emailOk(email)) {
    return c.html(html`<p class="hint">Leave an email so I can write back.</p>`, 422);
  }
  if (drawing.length < 800) {
    return c.html(
      html`<p class="hint">A scribble isn't a picture. Draw a little more.</p>`,
      422,
    );
  }

  let strokeCount = 0;
  let pointCount = 0;
  try {
    const parsed = JSON.parse(strokesRaw) as {
      strokes?: Array<{ points?: unknown[] }>;
    };
    strokeCount = parsed.strokes?.length ?? 0;
    pointCount =
      parsed.strokes?.reduce((n, s) => n + (s.points?.length ?? 0), 0) ?? 0;
  } catch {
    return c.html(html`<p class="hint">That drawing looked empty. Try again.</p>`, 422);
  }

  if (strokeCount < 1 || pointCount < 12) {
    return c.html(
      html`<p class="hint">A scribble isn't a picture. Draw a little more.</p>`,
      422,
    );
  }

  // Storage / scoring later. Telemetry arrived with the request.
  return c.html(html`
    <div class="stamp">
      <p class="stamp-title">Looks human.</p>
      <p>
        Thanks. If this was real, I'd write you at ${email}. Drawing and stroke
        data aren't stored yet.
      </p>
    </div>
  `);
});

export default app;
