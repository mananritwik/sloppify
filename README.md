# Sloppify 💩

Turn anything into an unbearable LinkedIn thought-leadership post. A parody.

Paste a plain sentence and Sloppify promotes it into humblebrag broetry — buzzword swaps, "it's not X, it's a movement," em-dashes, a made-up statistic, performative gratitude, and hashtags. There's a tone dial (Professional / Casual / Unhinged), a pixel office-worker mascot who re-dresses by tone, a live Slop Score, a downloadable share card, and a hidden **SLOP MODE** (third click of the theme icon).

Two engines:

- **Rules engine** (client-side, instant, free) — the default. Works with zero backend.
- **✨ AI slop** (Claude Haiku, server-side) — funnier, opt-in, rate-limited. Needs the deploy below.

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
4. **Optional but recommended — bot protection:**
   - Create a **Turnstile** widget (dashboard → Turnstile). Put the **site key** into `index.html` (replace `YOUR_TURNSTILE_SITE_KEY`), and add the **secret key** as env var **`TURNSTILE_SECRET_KEY`**. If you skip this, the endpoint still works and stays protected by rate limits.
5. **Optional but recommended — rate limits:**
   - Create a **KV namespace**, then **Settings → Functions → KV namespace bindings** → bind it as **`RL`**. Without this the AI runs with no per-IP cap (fine for testing, not for a public launch).
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
| `MODEL` | `claude-haiku-4-5` | cheap + fast |
| `MAX_INPUT` | 600 | chars accepted per request |
| `MAX_TOKENS` | 400 | caps spend per call |
| `PER_IP_DAILY` | 40 | free calls per IP per day |
| `GLOBAL_DAILY` | 5000 | hard wallet ceiling across everyone |

## License

MIT. It's a slop generator, use it in good health.
