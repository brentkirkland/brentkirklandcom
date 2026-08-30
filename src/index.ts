import { Hono } from "hono";
import { html } from "hono/html";

interface Env extends CloudflareBindings {
  EMAIL: SendEmail;
  HI_WEBHOOK_URL?: string;
  HI_WEBHOOK_TOKEN?: string;
  ENVIRONMENT?: string;
}

const app = new Hono<{ Bindings: Env }>();

const MIN_MESSAGE = 12;
const MAX_MESSAGE = 2000;

const bearerToken = (raw: string) => {
  const token = raw.trim();
  return token.toLowerCase().startsWith("bearer ") ? token.slice(7).trim() : token;
};

const page = () => html`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Brent Kirkland</title>
    <meta name="description" content="Brent Kirkland. Currently employed @ Fastly. Building Security Products." />
    <link rel="stylesheet" href="/app.css" />
    <script src="https://unpkg.com/htmx.org@4.0.0/dist/htmx.min.js"></script>
  </head>
  <body>
    <div id="shader-bg"></div>
    <main>
      <div class="prose">
        <h1>Brent Kirkland</h1>
        <p class="lede">
          Currently employed @ <a href="https://www.fastly.com">Fastly</a>. Building Security Products.
        </p>
        <p class="pitch">
          Contact me by proving you're human with a drawing.
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
          <label class="field">
            Leave me a message
            <textarea id="message" name="message" required minlength="${MIN_MESSAGE}" maxlength="${MAX_MESSAGE}" rows="4" placeholder="Why you're writing."></textarea>
          </label>
          <div class="row">
            <button type="submit">Send</button>
            <button type="button" id="clear">Clear</button>
            <p id="client-hint" class="hint" hidden>A scribble isn't a picture. Draw a little more.</p>
          </div>
          <div id="result"></div>
          <p class="wall-nudge"><a href="/drawings">See the wall of drawings people have left →</a></p>
        </div>
      </form>

      <footer>
        <a href="https://www.linkedin.com/in/brentland/">LinkedIn</a>
        <span class="dot">·</span>
        <a href="https://github.com/brentkirkland/brentkirklandcom">Source</a>
        <span class="dot">·</span>
        <a href="/drawings">Drawings</a>
      </footer>
    </main>
    <script src="/draw.js"></script>
    <script type="module" src="/shader.js"></script>
  </body>
</html>`;

const drawingsPage = (items: Array<{ id: string }>) => html`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Drawings · Brent Kirkland</title>
    <meta name="description" content="Drawings left by visitors of brentkirkland.com." />
    <link rel="stylesheet" href="/app.css" />
  </head>
  <body>
    <div id="shader-bg"></div>
    <main>
      <div class="prose">
        <p class="crumb"><a href="/">← Home</a></p>
        <h1>Drawings</h1>
        <p class="lede">Left by visitors on their way to say hi.</p>
      </div>
      ${items.length === 0
        ? html`<p class="pitch">Nothing on the wall yet. <a href="/">Draw the first one.</a></p>`
        : html`<ul class="gallery">
            ${items.map(
              (item) =>
                html`<li>
                  <img
                    src="/drawings/${item.id}/image"
                    alt="Visitor drawing"
                    loading="lazy"
                    onerror="this.parentElement.remove()"
                  />
                  <p class="gallery-id">${item.id.slice(0, 8)}</p>
                </li>`,
            )}
          </ul>`}
      <footer>
        <a href="/">Home</a>
      </footer>
    </main>
    <script type="module" src="/shader.js"></script>
  </body>
</html>`;

const emailOk = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

app.get("/", (c) => c.html(page()));

app.get("/drawings", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT id FROM submissions
     WHERE drawing_key IS NOT NULL AND drawing_key != ''
     ORDER BY created_at DESC
     LIMIT 300`,
  ).all<{ id: string }>();

  return c.html(drawingsPage(results ?? []));
});

// Drawings are stored in R2 as the raw canvas data URL string
// ("data:image/png;base64,..."), so decode it back into image bytes here.
app.get("/drawings/:id/image", async (c) => {
  const id = c.req.param("id");

  const row = await c.env.DB.prepare(
    `SELECT drawing_key FROM submissions
     WHERE id = ? AND drawing_key IS NOT NULL AND drawing_key != ''`,
  )
    .bind(id)
    .first<{ drawing_key: string }>();

  if (!row) {
    return c.notFound();
  }

  const object = await c.env.HI.get(row.drawing_key);
  if (!object) {
    return c.notFound();
  }

  const stored = await object.text();
  const match = /^data:(image\/[\w.+-]+);base64,([A-Za-z0-9+/=]+)$/.exec(stored);
  if (!match) {
    return c.notFound();
  }

  const bytes = Uint8Array.from(atob(match[2]), (ch) => ch.charCodeAt(0));

  return c.body(bytes, 200, {
    "Content-Type": match[1],
    "Cache-Control": "public, max-age=86400",
  });
});

app.post("/hi", async (c) => {
  const body = await c.req.parseBody();
  const drawing = String(body["drawing"] ?? "");
  const email = String(body["email"] ?? "").trim();
  const message = String(body["message"] ?? "").trim();
  const strokesRaw = String(body["strokes"] ?? "");

  if (!emailOk(email)) {
    return c.html(html`<p class="hint">Leave an email so I can write back.</p>`, 422);
  }
  if (message.length < MIN_MESSAGE) {
    return c.html(
      html`<p class="hint">Leave a message in a sentence or two.</p>`,
      422,
    );
  }
  if (message.length > MAX_MESSAGE) {
    return c.html(html`<p class="hint">That's a bit long. Trim it down.</p>`, 422);
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

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  c.executionCtx.waitUntil(
    (async () => {
      try {
        const drawingKey = `hi/${id}/drawing`;
        const strokesKey = `hi/${id}/strokes.json`;

        await Promise.all([
          c.env.HI.put(drawingKey, drawing),
          c.env.HI.put(strokesKey, strokesRaw),
        ]);

        await c.env.DB.prepare(
          `INSERT INTO submissions (id, created_at, email, message, stroke_count, point_count, drawing_key, strokes_key, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')`
        )
          .bind(id, createdAt, email, message, strokeCount, pointCount, drawingKey, strokesKey)
          .run();

        console.log(JSON.stringify({ event: "submission_stored", id }));

        const webhookUrl = c.env.HI_WEBHOOK_URL?.trim();
        const webhookToken = c.env.HI_WEBHOOK_TOKEN
          ? bearerToken(c.env.HI_WEBHOOK_TOKEN)
          : "";

        if (!webhookUrl || !webhookToken) {
          console.log(JSON.stringify({ event: "webhook_skipped", id, hasUrl: Boolean(webhookUrl), hasToken: Boolean(webhookToken) }));
          return;
        }

        const messagePreview = message.length > 200 ? message.slice(0, 200) : message;
        const webhookResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${webhookToken}`,
          },
          body: JSON.stringify({
            id,
            email,
            stroke_count: strokeCount,
            point_count: pointCount,
            message_preview: messagePreview,
          }),
        });

        if (webhookResponse.ok) {
          console.log(JSON.stringify({ event: "webhook_sent", id }));
        } else {
          console.log(
            JSON.stringify({
              event: "webhook_failed",
              id,
              status: webhookResponse.status,
            }),
          );
        }
      } catch (err) {
        console.error(
          JSON.stringify({
            event: "persistence_error",
            id,
            error: err instanceof Error ? err.message : String(err),
          }),
        );
      }
    })(),
  );

  return c.html(html`
    <div class="stamp">
      <p class="stamp-title">Looks human.</p>
      <p>
        Thanks. I'll write you at ${email}.
      </p>
    </div>
  `);
});

function formatEmailWithQuote(mailBody: string, originalMessage: string | null, createdAt: string | null, senderEmail: string): string {
  if (!originalMessage || originalMessage.trim().length === 0) {
    return mailBody;
  }

  const quotedLines = originalMessage.split('\n').map(line => `> ${line}`).join('\n');
  
  let attribution = '';
  if (createdAt) {
    const date = new Date(createdAt).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Los_Angeles',
      timeZoneName: 'short'
    });
    attribution = `On ${date}, ${senderEmail} wrote:`;
  } else {
    attribution = `On your note, you wrote:`;
  }

  return `${mailBody}\n\n${attribution}\n${quotedLines}`;
}

async function scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
  if (env.ENVIRONMENT !== 'production') {
    console.log(JSON.stringify({ 
      event: 'scheduled_skipped_non_production', 
      environment: env.ENVIRONMENT 
    }));
    return;
  }

  try {
    const { results } = await env.DB.prepare(
      `SELECT id, email, mail_subject, mail_body, message, created_at
       FROM submissions
       WHERE status = 'queued_mail'
         AND email IS NOT NULL
         AND mail_subject IS NOT NULL
         AND mail_body IS NOT NULL
         AND mailed_at IS NULL
       LIMIT 10`
    ).all<{ id: string; email: string; mail_subject: string; mail_body: string; message: string | null; created_at: string | null }>();

    if (!results || results.length === 0) {
      return;
    }

    for (const row of results) {
      try {
        let emailBody: string;
        try {
          emailBody = formatEmailWithQuote(row.mail_body, row.message, row.created_at, row.email);
        } catch (quoteErr) {
          throw new Error(`Quote formatting failed: ${(quoteErr as Error).message}`);
        }
        
        try {
          const probeResult = await env.DB.prepare(
            `SELECT mail_error_code FROM submissions WHERE id = ?`
          ).bind(row.id).first();
          console.log(JSON.stringify({
            event: "mail_schema_probe",
            id: row.id,
            success: true,
            hasColumn: probeResult !== null,
          }));
        } catch (probeErr) {
          console.log(JSON.stringify({
            event: "mail_schema_probe",
            id: row.id,
            success: false,
            error: String(probeErr),
          }));
        }
        
        console.log(JSON.stringify({
          event: "mail_attempt",
          id: row.id,
          to: row.email,
          from: "hi@agents.brentkirkland.com",
          subject: row.mail_subject,
          textLength: emailBody.length,
        }));

        await env.EMAIL.send({
          from: { email: "hi@agents.brentkirkland.com", name: "Brent Kirkland" },
          to: row.email,
          subject: row.mail_subject,
          text: emailBody,
        });

        const now = new Date().toISOString();
        await env.DB.prepare(
          `UPDATE submissions SET status = 'mailed', mailed_at = ?, mail_error_code = NULL, mail_error = NULL WHERE id = ?`
        )
          .bind(now, row.id)
          .run();

        console.log(JSON.stringify({ event: "mail_sent", id: row.id }));
      } catch (err) {
        let errorCode = 'UNKNOWN_ERROR';
        let errorMessage = 'Unknown error';
        
        try {
          errorCode = String((err as any)?.code ?? (err as any)?.name ?? 'UNKNOWN_ERROR');
        } catch {
          errorCode = 'UNKNOWN_ERROR';
        }
        
        try {
          errorMessage = String((err as any)?.message ?? err);
          if (errorMessage.length > 500) {
            errorMessage = errorMessage.slice(0, 500);
          }
        } catch {
          errorMessage = 'Failed to extract error message';
        }

        const diagnosticStatus = `mail_failed:${errorCode}`.slice(0, 99);

        try {
          await env.DB.prepare(
            `UPDATE submissions SET status = ?, mail_error_code = ?, mail_error = ? WHERE id = ?`
          )
            .bind(diagnosticStatus, errorCode, errorMessage, row.id)
            .run();
        } catch (updateErr) {
          console.error('CRITICAL: Failed to persist error details:', JSON.stringify({
            event: "mail_error_persist_failed",
            id: row.id,
            originalErrorCode: errorCode,
            originalError: errorMessage,
            persistError: String(updateErr),
          }));
          
          try {
            await env.DB.prepare(
              `UPDATE submissions SET status = ? WHERE id = ?`
            )
              .bind(diagnosticStatus, row.id)
              .run();
          } catch {
            console.error('CRITICAL: Failed to even update status for id:', row.id);
          }
        }

        console.error(JSON.stringify({
          event: "mail_failed",
          id: row.id,
          code: errorCode,
          error: errorMessage,
        }));
      }
    }
  } catch (err) {
    console.error("Scheduled handler error:", err);
  }
}

export default {
  fetch: app.fetch.bind(app),
  scheduled,
};
