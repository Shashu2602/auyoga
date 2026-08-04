# Sthira — website

Marketing site for **Sthira**, a yoga program for Indian women 40–55 in the perimenopause
years. Sells the ₹99 three-day workshop, which sells the 30-seat ₹3,000/month batch.

Static HTML, CSS and JS. No build step, no dependencies, no framework.

```
index.html    the whole page
styles.css    ~31 components, all reading four per-band tokens
app.js        seat meter, counters, scroll reveal, FAQ accordion
serve.js      local dev server (GitHub Pages ignores this)
```

## Run it locally

```bash
node serve.js
# http://localhost:3000
```

Any static server works — `serve.js` just avoids needing one installed.

## Deploy to GitHub Pages

Settings → Pages → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)`.
The site publishes at `https://shashu2602.github.io/mumweb/`. The repo must be public
unless the account has GitHub Pro.

Every push to `main` republishes automatically.

## Before this goes live

The page ships with deliberate placeholders. Search the source for `REPLACE` and
`PLACEHOLDER`.

- [ ] **Teacher name and bio** — `index.html`, the `.teacher` section
- [ ] **Teacher photograph** — swap `.portrait-ph` for `<img>`. In her own home, chair in
      frame, ordinary clothes. Not a white studio.
- [ ] **Testimonials** — three placeholders in the `.quotes` section. Replace with real,
      attributed quotes after the first workshop. Do not invent them; this audience talks
      to each other and one exposed exaggeration ends the brand.
- [ ] **Payment link** — the `<form action="#">` in `#signup` should point at the Razorpay
      or Instamojo page
- [ ] **Seat count** — `data-taken` on `.seatmeter`. Update as seats sell. Never inflate it.
- [ ] **WhatsApp number, Instagram handle, health form, refund policy** — footer links
- [ ] **Workshop dates** — the day cards say Tue/Wed/Thu; set the actual dates

## Design notes

Eight colours, one deep ramp plus two neutrals:

| | | Role |
|---|---|---|
| `#66211F` | Oxblood | Hero and CTA grounds, warnings, featured plan |
| `#822B3B` | Claret | The marquee band |
| `#873B57` | Wine | Ramp separator |
| `#A04A57` | Rose | Card rules, small accents |
| `#622D57` | Plum | Pull-quote ground, secondary buttons |
| `#F0D3A0` | Wheat | The one light — display type on dark, primary button |
| `#2D2D2D` | Charcoal | Body type, footer ground |
| `#F1F3F2` | Porcelain | Light band ground, type on dark |

The page commits to a single visual world instead of a light/dark pair — the alternating
band rhythm *is* the design, and inverting it would flatten the pulse. Each `.band` sets
`--bg`, `--ink`, `--muted`, `--accent` and `--line`; every component inside reads those
four tokens, so a section changes colour world by changing one class.

Type is system-stack only (Palatino/Iowan display, Segoe UI/Optima body, Cascadia/Consolas
data) so there is no font CDN to fail and no layout shift.

Content rules carried over from the launch plan: no medical claims ("manage symptoms",
never "treat" or "cure"), no weight figures anywhere, no before/after photographs.
