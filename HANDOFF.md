# Lane Zero — handoff

Branch: `claude/vibrant-goldberg-3jljy5` (repo `zaflow-stack/zaflowstack`)

## What this is
RIT Dubai · Elements II · Assignment 04 — **UI News Homepage Design** (due 10 Nov 2026).
Topic: sprinting. Site name: **Lane Zero** — "The stories behind speed."
Brief requires: visual hierarchy, typography, 12-col grid, modules/cards, consistent imagery, captions,
plus a process deck (cover, typography, colour, imagery, process, trials, final in mockup, Figma link)
and the final design as a separate PDF.

## Inputs
- Figma wireframe (lo-fi, already done by student): https://www.figma.com/design/KhsP7WU2CtqxRDoWdqZIca/lane-zero-wireframe
  - Page 1 → section `Lane ZERO` (node `1:645`), 1440 × 4191 desktop frame.
- Wordmark font: **Artavion** (user-supplied) → `lane-zero/assets/fonts/Artavion-Regular.ttf`
- The Claude Design brand board (`Lane Zero Brand Board.dc.html`) could NOT be read from the cloud session
  (needs `/design-login`). Palette/structure were taken from the Figma wireframe instead.

## Design system (as built)
| Token | Value |
|---|---|
| Paper | `#F4F4F2` / `#E6E6E3` |
| Ink | `#111111` · night `#0C0C0B` / `#1A1A19` |
| Signal red | `#EA372B` (the "0" in ZER0, live states, peaks) |
| Lines | `#C8C8C4` light · `#2C2C2A` dark |
| Display | Artavion (wordmark, big numerals, "Eight lanes. Eight faces.") |
| Headlines/UI | Inter Tight 600–800, uppercase, tight tracking |
| Data/labels | JetBrains Mono 11px uppercase (timing-board voice) |
| Grid | 12 col · 1440 · 40px margins · 24px gutters |

## Homepage sections (`lane-zero/index.html`)
0. Results ticker (real Paris 2024 / Glasgow 2024 results)
1. Sticky nav — wordmark, running race clock, links, Subscribe, **Lanes** full-screen menu
2. 01 Cover — 4-story carousel with timing-bar progress + R.T./top-speed readout + 8-lane index
3. 02 Latest — lead + 4 cards, working category filter
4. 03 Race desk — distance tabs (60/100/200/400/H&R) swap lead story, WR caption, list
5. **04 The Grid** — central face-front B/W portrait wall of real male sprinters, lane numbers, PBs
6. 05 The Lab — interactive phase figure (Set/Drive/Upright/Finish, torso angle) + Bolt 9.58 10m splits chart
7. 06 Monday split — newsletter with validation
8. Footer — giant wordmark

## Imagery rules
- **Real athletes only. No AI-generated portraits** (user was explicit). Male athletes primarily.
- Source: Wikimedia Commons (CC BY / CC BY-SA). Credits in `lane-zero/CREDITS.md`, not on the page.
- Treatment: grayscale + contrast in CSS, tight face-front crops for The Grid.
- Wikimedia rate-limits (HTTP 429) — download slowly (≥10 s between requests).
  Script: see `lane-zero/tools/fetch_commons.py`.
- Cloud env allowlist added: `www.figma.com`, `commons.wikimedia.org`, `upload.wikimedia.org`.

## Figma deliverable plan (same file as wireframe)
Pages: Brief/research → Ideation (wordmark/type/colour trials, rough thumbnails) → Low-fi (existing) →
Mid-fi grid → Hi-fi desktop + mobile → Prototype (clickable: Lanes overlay, desk tabs, cover carousel).
Tone: realistic student working file — no explanatory annotations/footnotes.

## Status
See git log. Remaining items are tracked at the bottom of this file.

## TODO
- [ ] Finish portrait set (8 face-front real male sprinters) and crop
- [ ] Figma: process pages + hi-fi + interactive prototype
- [ ] Process deck PDF + final design PDF
