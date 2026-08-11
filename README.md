# Sloppify 💩

[![eval](https://github.com/mananritwik/sloppify/actions/workflows/eval.yml/badge.svg)](https://github.com/mananritwik/sloppify/actions/workflows/eval.yml)

Turn anything into an unbearable LinkedIn thought-leadership post. A parody.

Paste a plain sentence and Sloppify promotes it into humblebrag broetry — buzzword swaps, "it's not X, it's a movement," em-dashes, a made-up statistic, performative gratitude, and hashtags. There's a tone dial (Professional / Casual / Unhinged), a pixel office-worker mascot who re-dresses by tone, a live Slop Score, a downloadable share card, and a hidden **SLOP MODE** (third click of the theme icon).

Two engines:

- **Rules engine** (client-side, instant, free) — the default. Works with zero backend.
- **✨ AI slop** (Claude, server-side) — funnier, opt-in, rate-limited. The first ~500 calls ever use a premium model (Sonnet) for great first impressions, then it steps down to Haiku; once the daily budget is spent, the button quietly serves rules-grade slop. Needs the deploy below.

## Why it's built the way it is

It's a joke, but it ships like a product:

- The Anthropic key never touches the client — it lives in a Cloudflare secret and the browser only talks to `/api/slopify`.
- The AI endpoint is bot-checked (optional Turnstile), rate-limited per-IP **and** globally per day, and input-capped, so a viral spike can't run up the bill.
- The system prompt is task-locked: prompt injection just produces weirder slop.
- Every call emits one structured log line, and `golden-eval.mjs` fails the build if the output ever stops being slop.

## Run it locally

```bash
npm install
npm run dev            # wrangler pages dev, serves the site + the /api function at :8788
```

The rules engine works immediately. For the AI button locally, add a `.dev.vars` file (gitignored):

```
ANTHROPIC_API_KEY=sk-ant-...
```

## Deploy (GitHub → Cloudflare Pages)

1. Push this repo to GitHub.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**, pick this repo.
   - Build command: *(none)* · Build output directory: `/`
3. **Settings → Environment variables** → add a secret **`ANTHROPIC_API_KEY`**.
4. **Optional — bot protection (Turnstile):** off by default so a fresh deploy has no broken widget. To enable, create a **Turnstile** widget (dashboard → Turnstile), then:
   - add its script + a widget div to `index.html`:
     ```html
     <!-- in <head> -->
     <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
     <!-- just after the .controls div -->
     <div id="tsw" class="cf-turnstile" data-sitekey="YOUR_SITE_KEY" data-size="flexible"></div>
     ```
   - add the **secret key** as env var **`TURNSTILE_SECRET_KEY`**.

   The front-end already sends the token and the function verifies it whenever the secret is set. Skip this and you're still protected by the rate limits below.
5. **Recommended — rate limits + model tiering (KV):**
   - Create a **KV namespace**, then **Settings → Functions → KV namespace bindings** → bind it as **`RL`**.
   - This powers the per-IP cap, the daily wallet ceiling, **and** the premium → Haiku → rules tiering.
   - Without it, the AI has no caps and always uses the cheap model (fine for local testing, not a public launch).
   - Counters are read-then-write on KV (eventually consistent), so a burst can overshoot a cap slightly. If you ever need a hard atomic ceiling, swap the counter for a Durable Object.
6. **Custom domain:** Settings → Custom domains → add **`sloppify.lol`** (buy it first; Cloudflare Registrar sells at cost).

Every `git push` to the connected branch auto-deploys.

## Eval before you ship

```bash
npm run dev                                   # terminal 1
npm run eval                                  # terminal 2 — hits localhost
# or against production:
SLOPIFY_URL=https://sloppify.lol/api/slopify node golden-eval.mjs
```

Passes when each case returns non-empty output with ≥3 slop signals and no refusal. Includes a prompt-injection case that must still come back as slop.

## Tunable knobs (`functions/api/slopify.js`)

| Constant | Default | What it does |
|---|---|---|
| `MODEL_GOOD` | `claude-sonnet-5` | premium tier for first impressions (verify the ID before launch) |
| `MODEL_CHEAP` | `claude-haiku-4-5-20251001` | steady-state tier |
| `SONNET_LIFETIME` | 500 | first N AI calls ever use the premium model, then step down |
| `GLOBAL_DAILY` | 3000 | daily wallet ceiling; past this the client uses rules |
| `PER_IP_DAILY` | 30 | free AI calls per IP per day |
| `MAX_INPUT` | 600 | chars accepted per request |
| `MAX_TOKENS` | 400 | caps spend per call |

## License

MIT. It's a slop generator, use it in good health.
