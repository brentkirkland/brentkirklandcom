# brentkirklandcom

Personal site for brentkirkland.com. A [Hono](https://hono.dev) app on Cloudflare Workers whose
one interesting feature is the contact form: instead of a captcha, you prove you're human by
drawing a picture on a canvas. Those drawings are then shown on a public wall at `/drawings`.

There is no build step for the frontend, no framework, and no test suite. The entire server is
one file.

## Layout

| Path | What's in it |
| --- | --- |
| `src/index.ts` | The whole Worker: both HTML pages, all four routes, and the cron handler |
| `public/` | Static assets served by Workers Assets — `app.css`, `draw.js` (canvas pad plus the success animation), `shader.js` (animated background) |
| `migrations/` | D1 migrations, applied by `wrangler d1 migrations apply` |
| `wrangler.jsonc` | Bindings, custom domains, cron trigger, and the `preview` environment |
| `.github/workflows/` | `deploy.yml` (push to `main`) and `preview.yml` (per-PR preview Worker) |

Bindings, all declared in `wrangler.jsonc`: `DB` (D1), `HI` (R2), `EMAIL` (Send Email), plus the
`ENVIRONMENT` var and two secrets.

## Routes

| Route | Purpose |
| --- | --- |
| `GET /` | The home page: bio, the drawing pad, and the contact form |
| `POST /hi` | Accepts a submission. Returns an HTML fragment, not JSON |
| `GET /drawings` | Public gallery of the 300 most recent drawings |
| `GET /drawings/:id/image` | Serves one drawing as decoded image bytes, cached a day |

> [!IMPORTANT]
> **`/drawings` is public and unmoderated.** It lists every row with a non-empty `drawing_key`
> regardless of `status`, so anything anyone draws is on the public wall the moment it's stored.
> There's no approval gate and no delete path in the app. Email addresses and message bodies are
> *not* exposed — only the image and the submission id.

Two things about that gallery are easy to get wrong:

- **Drawings live in R2 as the data URL string**, not as image bytes — `POST /hi` stores exactly
  what the canvas produced (`data:image/png;base64,...`). `GET /drawings/:id/image` parses that
  string with a regex and `atob`s it back into bytes. A stored value that doesn't match the data URL
  pattern is served as a 404 rather than an error.
- **The id under each thumbnail is cosmetic.** It's `id.slice(0, 8)` for display only; the `<img>`
  still requests the full UUID, and the route matches on `id = ?` exactly. Requesting a drawing by
  its 8-character prefix returns 404.

Rows whose R2 object is missing or unparseable still render an `<img>` that 404s, so the gallery
markup carries an inline `onerror` that removes the broken thumbnail client-side.

## How a submission flows

1. `GET /` server-renders the page with Hono's `html` tagged template. `draw.js` takes over the
   canvas and records every stroke as a color, a width, and timestamped points.
2. On submit, `draw.js` writes a PNG data URL into the hidden `drawing` input and a JSON blob into
   the hidden `strokes` input, then htmx `POST`s the form to `/hi`.
3. `/hi` re-validates everything server-side and, on failure, returns **422** with a small HTML
   fragment that htmx swaps into `#result`.
4. On success it responds immediately with the "Looks human." stamp and does all the real work in
   `c.executionCtx.waitUntil(...)`: PNG and strokes to R2 under `hi/<id>/drawing` and
   `hi/<id>/strokes.json`, a row into the D1 `submissions` table with status `new`, then an
   optional webhook notification.
5. Client-side, `draw.js` notices the stamp landing in `#result` and plays the success animation
   described below.
6. A cron running every minute picks up rows with status `queued_mail` and sends the reply through
   the `EMAIL` binding, quoting the original message underneath.

### The success animation, and the `.stamp` contract

When a submission succeeds, the toolbar and fields collapse away, the canvas is wiped
left-to-right, and the word "thanks" is drawn onto it in cursive. This is worth understanding
before you touch either side of it:

- **`draw.js` watches `#result` with a `MutationObserver`, looking for `.stamp`.** It deliberately
  does not listen for htmx events, because those names changed between htmx major versions. That
  makes the `stamp` class name in the `POST /hi` response an API between the server and the client:
  rename it in `src/index.ts` and the animation silently stops firing.
- **The cursive "thanks" is SVG path data rendered onto the canvas** via `Path2D`, authored in a
  300×140 design space. Stroke lengths are measured by mounting a hidden `<svg>` and calling
  `getTotalLength()`, then cached; the reveal is a `setLineDash` trick.
- **The collapse is one-way.** A `sent` latch blocks further drawing and suppresses the resize
  repaint. There's no longer a post-success form reset — the page stays collapsed until reload.
- **`prefers-reduced-motion: reduce` is honored** by jumping straight to the finished state.

You do not need to submit a form to work on this. Load the home page with **`?preview=thanks`** and
the celebration fires on load.

### The part that isn't in this repo

**Nothing here ever moves a submission from `new` to `queued_mail`.** The cron only sends mail for
rows that already have `mail_subject` and `mail_body` filled in, and no code in this repository
writes those columns. Drafting the reply happens outside the repo, against D1 directly.

So if you're wondering why submissions never get emailed, that's expected — it isn't a bug in this
codebase.

### `submissions.status` values

- `new` — stored, no reply drafted yet
- `queued_mail` — a reply has been written externally and is waiting for the cron
- `mailed` — sent; `mailed_at` is set
- `mail_failed:<CODE>` — send threw. The error code is appended to `status` *and* stored properly in
  `mail_error_code` / `mail_error`. Overloading `status` this way is leftover diagnostic plumbing,
  not a pattern to copy.

## Validation thresholds

Client and server both check, with deliberately different measures, so keep them in mind together
when you touch either side:

| Check | Server (`src/index.ts`) | Client |
| --- | --- | --- |
| Message length | 12–2000 chars (`MIN_MESSAGE` / `MAX_MESSAGE`) | the same constants rendered as `minlength` / `maxlength` on the `<textarea>` |
| Drawing | PNG data URL ≥ 800 chars | ≥ 140px of accumulated ink (`MIN` in `draw.js`) |
| Strokes | ≥ 1 stroke and ≥ 12 total points | ≥ 1 stroke (`draw.js`) |
| Email | regex | `checkValidity()` (`draw.js`) |

The hint copy is duplicated between the two files (for example "A scribble isn't a picture. Draw a
little more."). Change both or the messages drift.

## Commands

```bash
npm install
npm run cf-typegen    # generate binding types — see below, do this first
npx tsc --noEmit      # typecheck (see known error below)
npm run dev           # wrangler dev on :8787
npm run deploy        # CI does this on push to main
```

`worker-configuration.d.ts` is **generated and gitignored**, and `src/index.ts` depends on the
`CloudflareBindings` interface it declares. On a fresh clone `tsc` fails with
`Cannot find name 'CloudflareBindings'` plus a cascade of "Property 'DB'/'HI' does not exist"
errors, all of which disappear once you run `npm run cf-typegen`. Re-run it after editing bindings
in `wrangler.jsonc`.

There is one **known pre-existing typecheck error** even after codegen: `Env.ENVIRONMENT` is typed
`string | undefined` while wrangler generates the narrower literal union `"preview" | "production"`.
Don't treat it as something you broke.

## Testing locally

Everything runs locally with no Cloudflare credentials — D1, R2, and even the email binding are all
simulated by Miniflare.

```bash
npx wrangler d1 migrations apply brentkirklandcom --local   # once, before first run
npm run dev
```

Cron jobs don't fire on their own in local dev. Trigger the mail handler by hand:

```bash
curl "http://localhost:8787/cdn-cgi/local/scheduled"
```

Inspect or seed the local database:

```bash
npx wrangler d1 execute brentkirklandcom --local --command "SELECT id, status FROM submissions"
```

Sent mail isn't delivered locally; Miniflare writes each message to a text file under
`.wrangler/tmp/email/**/email-text/` and logs the path.

To exercise the reply path end to end, insert a submission through the UI, then set
`status='queued_mail'` with a `mail_subject` and `mail_body` before triggering the scheduled
endpoint.

Shortcuts for the two things that are otherwise tedious to reach:

| To see | Do this |
| --- | --- |
| The success animation | open `http://localhost:8787/?preview=thanks` |
| The gallery with real content | submit a drawing through the UI, then open `/drawings` |

Seeding the gallery via SQL alone won't work — the row needs a matching R2 object holding a valid
`data:image/...;base64,` string, so it's easier to submit through the UI.

## Deploys

Push to `main` deploys production. Opening a PR deploys a Worker named
`brentkirklandcom-pr-<number>` using `--env preview`, comments the URL on the PR, and deletes it
when the PR closes.

> [!WARNING]
> **Preview shares production data.** The `preview` environment in `wrangler.jsonc` points at the
> same `database_id` and the same R2 bucket as production. Submitting through a PR preview writes
> real rows to the real database — and since `/drawings` is unmoderated, a test drawing made on a
> preview URL appears immediately on the **production** public wall, with no way to remove it from
> inside the app. Use local dev for scratch submissions.

Production serves `brentkirkland.com` and `www.brentkirkland.com` as Worker custom domains, declared
in the top-level `routes`.

The `preview` environment exists mainly to *subtract* three things it would otherwise inherit, and
each override matters:

| Override | Why |
| --- | --- |
| `"routes": []` | Stops a preview deploy from taking over the production custom domains |
| `"crons": []` | Stops previews from running the mail cron |
| `ENVIRONMENT: "preview"` | Makes `scheduled()` return early, belt-and-braces with the empty cron list |

Keep all three when you touch that block. Anything else added at the top level is inherited by
preview unless it's overridden there too, which is the trap this environment keeps falling into.

## Conventions

- **Logging** is single-line JSON: `console.log(JSON.stringify({ event: "name", ... }))`. Existing
  events include `submission_stored`, `webhook_skipped`, `webhook_sent`, `webhook_failed`,
  `persistence_error`, `mail_attempt`, `mail_sent`, `mail_failed`, and
  `scheduled_skipped_non_production`. Add to this vocabulary rather than logging free-form strings.
  Observability is on with a 100% sampling rate, so these are queryable.
- **Secrets** are `HI_WEBHOOK_URL` and `HI_WEBHOOK_TOKEN`, set with `wrangler secret put` and never
  committed. Put them in `.dev.vars` (gitignored) for local work. When either is missing the
  webhook is skipped and logged — that's a normal state, not a failure.
- **The webhook payload** deliberately carries only a 200-character `message_preview`, not the full
  message. `bearerToken()` tolerates the token secret being stored with or without a `Bearer `
  prefix.
- **Failures in `waitUntil` must never surface to the user.** The submission response is already
  sent by then; catch and log instead.
- **Class names in returned HTML fragments can be load-bearing.** `.stamp` is what triggers the
  success animation. Grep `public/` before renaming anything in the markup.
- **Frontend has no bundler.** `draw.js` is a plain IIFE, `shader.js` is an ES module pulling
  `@paper-design/shaders` from `esm.sh`, and htmx comes from a CDN `<script>` tag. The
  `@paper-design/shaders` dependency in `package.json` is not what the browser actually loads, so
  bumping it changes nothing on its own — the pinned version in the `shader.js` import URL is what
  ships.
