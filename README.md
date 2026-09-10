# Sthira — website

Marketing site for **Sthira**, live morning yoga classes taught by **Anuranjini Upadhyay**
(ten years of teaching). Open to everyone, beginners included. Two batches — 8:00–9:00 am
and 11:00–12:00 am (best for moms) — at **₹1,500 a month**, first class free.

There is **no payment or billing on this site**. Every call to action points at the phone
number, WhatsApp, or email.

Static HTML, CSS and JS. No build step, no dependencies, no framework.

```
index.html    the whole page
styles.css    four colours, three colour worlds
app.js        progress bar, reveals, hero drift, sticky list, counters, mats meter, FAQ
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

| Hex | Name | Role |
|---|---|---|
| `#66211F` | **Maroon** | Dark grounds, and all type on light grounds |
| `#A04A57` | **Rose** | Accent — rules, eyebrows, chips, the ticker band |
| `#F0D3A0` | **Wheat** | The one light — display emphasis and the primary button on dark |
| `#F1F3F2` | **Paper** | Light ground, and all type on dark grounds |

One helper tint exists, `#F5DEB4` — wheat lifted slightly, used only for the hover state of
the highlighted batch card. Every other softer tone in the stylesheet is one of the four
above at reduced alpha, so nothing drifts out of the family.

### For print — flyers and posters

| Hex | CMYK (approx.) | Use on a flyer |
|---|---|---|
| `#66211F` | 30 / 90 / 80 / 40 | Background, and headline type on cream |
| `#A04A57` | 30 / 78 / 50 / 10 | Sub-heads, rules, the price chip |
| `#F0D3A0` | 5 / 16 / 40 / 0 | Headline type on maroon, big numbers, buttons |
| `#F1F3F2` | 4 / 2 / 3 / 0 | Body type on maroon, light panels |

Type: **Fraunces** (headlines, numbers — weight 900) and **Familjen Grotesk** (everything
else). Both free on Google Fonts.

## Three colour worlds, not eight

Each `.section` sets `--ink`, `--dim`, `--line` and `--accent`; every component inside reads
only those, so a section changes its entire appearance by swapping one class:

```css
.section--paper   /* paper ground,  maroon type, rose accent  */
.section--maroon  /* maroon ground, paper type,  wheat accent */
.section--wheat   /* wheat ground,  maroon type, maroon accent */
.section--arch    /* add-on: the section rises into the one above it as a dome */
```

## Motion

All of it is progressive enhancement — the page reads completely with JavaScript blocked,
and every effect is disabled under `prefers-reduced-motion`.

| | |
|---|---|
| Hero | Words rise in sequence; two glows breathe; five dots drift; the type lifts and fades as you scroll past |
| Nav | Hidden until you clear the hero, then slides down; links draw an underline on hover |
| Progress | Hairline wheat bar across the top tracks document position |
| Ticker | Rose marquee, pauses on hover |
| Six things | Left column sticks; each item lights and its numeral fills as it crosses the middle |
| Motif | The lotus line-drawing draws itself in when scrolled to (`pathLength="1"` + dashoffset) |
| Breathe | A ring inflates over ten seconds — four in, six out — and the words swap with it |
| Cards | Fade and rise on entry, grouped ones stagger 90ms apart, lift on hover with the accent rule sweeping in |
| Batches | Sun rays turn slowly behind each card; the "best for moms" chip nudges every few seconds |
| Figures | Count up once, when scrolled to |
| Mats | Fifteen squares pop in, 60ms apart |
| FAQ | One answer open at a time, the answer slides in, the chevron rotates |

## Before this goes live

Search the source for `REPLACE`.

- [ ] **Anuranjini's photograph** — swap the `.ph` block in `#teacher` for
      `<img class="who__img" src="anuranjini.jpg" alt="Anuranjini Upadhyay teaching">`.
      Portrait, 4:5, her own space, ordinary clothes. Not a white studio.
- [ ] **Testimonials** — there is no testimonial section yet, on purpose. Add one after the
      first month with real, attributed quotes. Don't ship invented ones.

Contact details in use (phone, WhatsApp and email all point at the same person):

- **Phone / WhatsApp** — +91 98264 70048
- **Email** — anurtiz04@gmail.com

## Content rules

- **No medical claims.** "Helps you sleep", "builds strength", "calms the head". Never
  "treat", "cure", "reverse", or "balance hormones".
- **No weight, anywhere.** No figures, no before/after photographs. The class tracks five
  other things instead.
- **Everyone is welcome.** The copy is written for any adult body, not one group. The only
  nod to a specific audience is the 11–12 batch being flagged as best for mothers, and one
  line in the teacher's bio saying she can adapt around pregnancy, recovery, periods or
  menopause if you ask.
- **Nothing invented.** No fake seat counts, no fake urgency. The batch-size meter shows
  capacity (15 mats), not sales.
