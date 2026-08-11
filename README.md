# Sloppify 💩

[![eval](https://github.com/mananritwik/sloppify/actions/workflows/eval.yml/badge.svg)](https://github.com/mananritwik/sloppify/actions/workflows/eval.yml)

Turn anything into an unbearable LinkedIn thought-leadership post. A parody.

Paste a plain sentence and Sloppify promotes it into humblebrag broetry — buzzword swaps, "it's not X, it's a movement," em-dashes, a made-up statistic, performative gratitude, and hashtags.

**On the page:** tone dial (Professional / Casual / Unhinged), pixel mascot, Slop Score + tell chips, LinkedIn-style card, **copy / copy link / share / save image**, rotating starter seeds, before/after examples, deeplinks (`?text=` / `?tone=`), and hidden **SLOP MODE** (third click of the theme icon, or click the mascot).

Two engines:

- **Rules engine** ([`rules.mjs`](rules.mjs), client-side, instant, free) — always available.
- **✨ AI slop** (Claude via [`functions/api/sloppify.js`](functions/api/sloppify.js)) — funnier, rate-limited. First ~150 calls ever use Sonnet 5 at **low effort**, then Haiku; past the daily budget, the UI falls back to rules.

## Why it's built the way it is

It's a joke, but it ships like a product:

- The Anthropic key never touches the client — Cloudflare secret only; browser talks to `/api/sloppify`.
- Per-IP + global daily caps (KV), input length cap, low `max_tokens`, optional Turnstile.
- Task-locked system prompt: prompt injection just produces weirder slop.
- Offline `npm run eval:rules` always gates PRs; live `npm run eval` checks the AI endpoint when a key is present.

## Repo map

| Path | Role |
|---|---|
| [`index.html`](index.html) | UI (CSS + page shell + module script) |
| [`rules.mjs`](rules.mjs) | Client rules engine (also used by offline eval) |
| [`functions/api/sloppify.js`](functions/api/sloppify.js) | Claude endpoint + rate limits |
| [`eval-signals.mjs`](eval-signals.mjs) | Shared “is this still slop?” helpers |
| [`golden-eval-rules.mjs`](golden-eval-rules.mjs) | Offline rules eval (CI) |
| [`golden-eval.mjs`](golden-eval.mjs) | Live AI eval |
| [`og.jpg`](og.jpg) | Open Graph image for LinkedIn / link previews |
| [`wrangler.toml`](wrangler.toml) | Pages config + local KV binding `RL` |

## Run it locally

```bash
npm install
npm run dev            # wrangler pages dev on :8788 (serves site + /api/sloppify)
npm run eval:rules     # offline, no API key
```

For AI locally, add `.dev.vars` (gitignored):

```
ANTHROPIC_API_KEY=sk-ant-...
```

Local + production KV is wired in [`wrangler.toml`](wrangler.toml) (`binding = "RL"`). Cloudflare Pages picks that up on deploy (you'll also see it under Settings → Functions). Restart `npm run dev` after changing the binding.

## Deploy (GitHub → Cloudflare Pages)

Push to the connected branch; Pages auto-deploys.
- Build command: *(none)* · Build output directory: `/`

**This project’s live setup**
- Custom domain **`sloppify.lol`** (Cloudflare Registrar) — done
- Secret **`ANTHROPIC_API_KEY`** in Pages — done
- KV **`RL`** via `wrangler.toml` (visible in the Pages dashboard) — done
- **Turnstile:** leave off unless you also add the widget to `index.html`

### Still optional

- [ ] GitHub Actions secret `ANTHROPIC_API_KEY` so the live AI golden eval runs on `main` (rules eval already always runs)
- [ ] Confirm `https://sloppify.lol` serves the latest deploy after each push

## Eval

```bash
npm run eval:rules                            # always — no key
npm run dev                                   # terminal 1
npm run eval                                  # terminal 2 — AI endpoint
# production:
SLOPPIFY_URL=https://sloppify.lol/api/sloppify npm run eval
```

Passes when output is non-empty, has ≥3 slop signals, preserves an input noun, and isn’t a refusal. AI eval also includes a prompt-injection case that must stay slop (not a cat poem).

## Tunable knobs (`functions/api/sloppify.js`)

| Constant | Default | What it does |
|---|---|---|
| `MODEL_GOOD` | `claude-sonnet-5` | first-impression tier (`effort: low`) |
| `MODEL_CHEAP` | `claude-haiku-4-5-20251001` | steady-state tier |
| `SONNET_LIFETIME` | 150 | first N AI calls ever use Sonnet, then Haiku |
| `GLOBAL_DAILY` | 800 | daily AI ceiling; past this → rules fallback |
| `PER_IP_DAILY` | 15 | free AI calls per IP per day |
| `MAX_INPUT` | 600 | chars accepted per request |
| `MAX_TOKENS` | 320 | caps spend per call |

## License

MIT. It's a slop generator, use it in good health.
