import { Hono } from "hono";
import { html } from "hono/html";

const app = new Hono();

const page = () => html`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Brent Kirkland</title>
    <meta name="description" content="Brent Kirkland. Security Products at Fastly. No email. Draw a picture." />
    <link rel="stylesheet" href="/app.css" />
    <script src="https://unpkg.com/htmx.org@4.0.0/dist/htmx.min.js"></script>
  </head>
  <body>
    <main>
      <p class="eyebrow">Security Products</p>
      <h1>Brent Kirkland</h1>
      <p class="lede">Currently employed @ <a href="https://www.fastly.com">Fastly</a>.</p>
      <section>
        <h2>Want to say hi?</h2>
        <p class="pitch">
          I don't give out my email. It turns into trash. Draw a picture instead.
          That's the proof you're a person. What happens to the image later is a problem for later.
        </p>
        <form id="hi" hx-post="/hi" hx-target="#result" hx-swap="innerHTML">
          <input type="hidden" name="drawing" id="drawing" />
          <div id="pad-wrap"><canvas id="pad"></canvas></div>
          <div class="row">
            <button type="submit">That's a picture</button>
            <button type="button" id="clear">Clear</button>
            <p id="client-hint" class="hint" hidden>A scribble isn't a picture. Draw a little more.</p>
          </div>
          <div id="result"></div>
        </form>
      </section>
      <footer>
        <a href="https://www.linkedin.com/in/brentland/">LinkedIn</a>
        <span class="dot">·</span>
        <a href="https://github.com/brentkirkland/brentkirklandcom">Source</a>
      </footer>
    </main>
    <script src="/draw.js"></script>
  </body>
</html>`;

app.get("/", (c) => c.html(page()));

app.post("/hi", async (c) => {
  const body = await c.req.parseBody();
  const drawing = String(body["drawing"] ?? "");
  if (drawing.length < 800) {
    return c.html(html`<p class="hint">A scribble isn't a picture. Draw a little more.</p>`, 422);
  }
  return c.html(html`
    <div class="stamp">
      <p class="stamp-title">Looks human.</p>
      <p>I still don't have a mailbox for these. The drawing isn't stored yet.</p>
    </div>
  `);
});

export default app;
