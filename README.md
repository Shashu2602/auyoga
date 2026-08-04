# Sthira — website

Marketing site for **Sthira**, a yoga program for Indian women 40–55 in the perimenopause
years. Sells the ₹99 three-day workshop, which sells the 30-seat ₹3,000/month batch.

Static HTML, CSS and JS. No build step, no dependencies, no framework.

```
index.html    the whole page
styles.css    four colours, three colour worlds
app.js        scroll progress, reveals, sticky sequence, counters, seat meter, FAQ
serve.js      local dev server (GitHub Pages ignores this)
```

## Run it locally

```bash
node serve.js
# http://localhost:3000
```

## Deploy to GitHub Pages

Settings → Pages → Source: **Deploy from a branch** → Branch `main`, folder `/ (root)`.
Publishes at `https://shashu2602.github.io/mumweb/`, and republishes on every push.

> **The repo must be public** for Pages to work on a free account.
> Settings → General → Danger Zone → Change visibility.

## Palette — four colours, and only these four

| | | Role |
|---|---|---|
| `#66211F` | **Maroon** | Dark grounds, and all type on light grounds |
| `#A04A57` | **Rose** | Accent — rules, eyebrows, chips, the ticker band |
| `#F0D3A0` | **Wheat** | The one light — display emphasis and the primary button on dark |
| `#F1F3F2` | **Paper** | Light ground, and all type on dark grounds |

No fifth colour exists in the stylesheet — no grey, no black, no white. Every softer tone
is one of these four at reduced alpha, so nothing drifts out of the family. If you add a
colour, you have broken the system.

Three colour worlds, not eight. Each `.section` sets `--ink`, `--dim`, `--line` and
`--accent`; every component inside reads only those, so a section changes its entire
appearance by swapping one class:

```css
.section--paper   /* paper ground,  maroon type, rose accent  */
.section--maroon  /* maroon ground, paper type,  wheat accent */
.section--wheat   /* wheat ground,  maroon type, maroon accent */
```

## Type

Two families, both variable, both deliberately uncommon:

- **Fraunces** — old-style serif with an optical-size axis. Weight 900 for the hero and
  figures, 700 for section titles, italic for emphasis.
- **Familjen Grotesk** — a Swedish grotesque with slightly odd terminals. Body, subtitles,
  and all letter-spaced uppercase labels.

Loaded from Google Fonts with `display=swap` and a system fallback stack behind each.

## Scroll behaviour

All of it is progressive enhancement — the page reads completely with JavaScript blocked,
and every effect is disabled under `prefers-reduced-motion`.

| | |
|---|---|
| Hero | Words rise in sequence on load; the block drifts up and fades as you scroll past |
| Nav | Hidden until you clear the hero, then slides down |
| Progress | Hairline bar across the top tracks document position |
| Signs | Left column sticks while six items scroll past, each lighting as it crosses centre |
| Sections | Fade and rise on entry; grouped cards stagger 90ms apart |
| Figures | Count up once, when scrolled to |
| Seats | Thirty squares fill one at a time, 45ms apart |

## Before this goes live

Search the source for `REPLACE`.

- [ ] **Teacher name and bio** — the `.teacher` section
- [ ] **Teacher photograph** — swap `.ph` for an `<img>`. Her own home, chair in frame,
      ordinary clothes. Not a white studio.
- [ ] **Payment link** — `<form action="#">` in `#join` should point at the Razorpay or
      Instamojo page
- [ ] **Seat count** — `data-taken` on `.seats`. Update as seats sell. Never inflate it.
- [ ] **WhatsApp number, Instagram handle, health form, refund policy** — footer links
- [ ] **Workshop dates** — the day cards say Tue/Wed/Thu; set the real dates
- [ ] **Testimonials** — there is no testimonial section yet, on purpose. Add one after the
      first workshop with real attributed quotes. Don't ship invented ones; this audience
      talks to each other and one exposed exaggeration ends the brand.

## Content rules

Carried over from the launch plan, and they are not stylistic preferences:

- **No medical claims.** "Manage symptoms", "build strength", "support sleep". Never
  "treat", "cure", "reverse", or "balance hormones".
- **No weight, anywhere.** No figures, no before/after photographs. The program measures
  five other things instead — that refusal is the entire differentiator.
