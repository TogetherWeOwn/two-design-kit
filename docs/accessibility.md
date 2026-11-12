# Accessibility

Target: **WCAG 2.2 level AA** on every surface, at 390 and 1280, in the latest Chromium, Firefox and Safari, with keyboard, screen reader (NVDA + Firefox, VoiceOver + Safari), 200% zoom, reduced motion and forced colours. These are rules, not goals: a PR that breaks one is not done.

## 1. Contrast (SC 1.4.3, 1.4.11)

- Text: **4.5:1** minimum on its actual ground, including 12 px mono labels and large display text (we hold display to 4.5 too). Non-text that carries meaning (control edges, focus ring, state glyphs, live dot, progress fill): **3:1**.
- Every allowed pair is declared in `tokens/contrast.json` and checked in CI ([tokens.md](tokens.md) §1.9). Using an undeclared pair means adding it to the file first; if it fails, pick another pair.
- **Forbidden:** `state.echo` on `bg.overlay`; brand pink or violet as text; text on the brand gradient; text over images.
- Hairlines are decorative. A control's boundary uses `border.control` (≥ 3.46:1).
- Disabled controls are exempt from contrast in WCAG, but ours still use `text.tertiary` (≥ 5.5:1) so the reason stays readable.

## 2. Colour is never the only signal (SC 1.4.1)

Every state is a word plus, where possible, a shape: Live (tag + half-ring glyph), yours (tag "You're in" + ember dot-ring), Echo (tag + filled glyph), ladder moves (arrow icon + number), rank (glyph + name). Test: screenshot in greyscale; every state must still be readable.

## 3. Focus (SC 2.4.7, 2.4.11, 2.4.13 as a target)

- Every focusable element shows `2px solid color.focus.ring` with a 3 px offset on `:focus-visible`. Never `outline: none` without this replacement. On ember, the ring is `focus.ring-on-accent`.
- The ring is at least 2 px thick and 3:1 against adjacent colours (meets the AAA 2.4.13 shape too).
- **Not obscured (2.4.11):** the sticky header and toolbar heights are in `scroll-padding-top`; the mobile action bar height is in `scroll-padding-bottom`. Focused items never sit under a sticky bar.
- **Order:** DOM order is the 390 reading order. At 1280 a rail that starts level with the top of the content (seat card, join card, profile summary) may come straight after the header block in the DOM and be placed in its column with grid. Never reorder with CSS `order` or reversed grid rows to make the 390 order differ from the DOM.
- The menu sheet traps focus while open; Escape closes it and returns focus to the Menu button.

## 4. Target size (SC 2.5.8)

WCAG 2.2 AA floor is 24 × 24 px. **House minimum is 36 px tall** for any control (chips, small pills, segments) and 44–56 px for primary actions. Inline text links are exempt but get 8 px vertical padding when they stand alone ("I can't make it").

**One exception: box handles on a workbench canvas** (the resize handles on a selected label box) keep a 24 × 24 px hit area (`size.target-handle`), the WCAG floor, centred on the handle. Hit areas never overlap, because handles appear only when the selected box is big enough on screen: corner handles when it is at least 24 px in both directions, edge handles when it is at least 48 px. A smaller box shows no handles (a 7 × 3 px price tag at 320 shows none) until the reviewer zooms in. Only the selected box has handles, and they sit above every other box. With 36 px areas, boxes under 36 px on screen would lose every handle and boxes under 72 px their edge handles, and many labels are that small. Every handle action has an equivalent that needs no handle: arrows and Alt+arrows move and resize the selected box, and its coordinates can be typed (SC 2.5.7). No other control uses this exception.

## 5. Motion (SC 2.2.2, 2.3.3 as a target)

- All animation and transition CSS sits inside `@media (prefers-reduced-motion: no-preference)`. Token output also zeroes durations under `reduce`.
- Nothing auto-moves for more than 5 s; there are no carousels, tickers, marquees, count-ups or pulsing dots anywhere.
- Live data updates by swapping text, never by animating.

## 6. Live data and live regions (SC 4.1.3)

Live data is the heart of Ember Hours, and the most likely place to annoy a screen-reader user. The rules:

1. **One polite status region per page** (`<div role="status" aria-live="polite" class="sr">`), owned by the live island. Nothing else on the page is `aria-live`.
2. **Announce state changes, not ticks.** Announce: an event goes live ("Raid Night is live"), the room opens ("The Raid 1 room is open. Pull me in is on."), data goes stale ("Live numbers are catching up") or recovers, a Lifeline step completes, the result of the member's own action ("You're in. Seat 7."). Never announce: counts changing, relative times ageing, countdowns, new bot-log lines, the Now marker moving.
3. **Throttle:** at most one *state* announcement per 10 s; merge if several states change in one poll. The result of the member's own action is exempt: announce it at once, and drop any queued state announcement it supersedes.
4. **Clocks and countdowns are not live regions.** They update at most once a minute by text swap; an event countdown (C4) is not recomputed at all: it is dated "as of" and withdrawn when stale. The `<time datetime>` gives the absolute value.
5. **Errors from the member's own action** may use `role="alert"`; nothing else does.
6. **Polling:** `motion.poll.live` (30 s) while the tab is visible; pause when hidden; never refresh focus or scroll position.

## 7. Structure and names (SC 1.3.1, 2.4.6, 4.1.2)

- Landmarks: `header`, `nav[aria-label]` (Main, Footer), `main#main`, `aside[aria-label]` for rails and panels, `footer`. One `h1` per page; headings in order; each `section` is labelled by its heading.
- Every component's role and name is in [components.md](components.md). Quick rules: buttons act, links go; icon-only controls have `aria-label`; avatar images have `alt=""` with the name beside them; avatar stacks and seat strips are one `role="img"` with a count label.
- **Charts and visual-only data** (Now Line, Echo trail, season bar, progress, seat strip) are `aria-hidden` or `role="img"` with a summary, **and** the full data is available as text (a visually hidden list or a "Show as a table" toggle).
- Tables are real tables with `caption` and `th scope`.
- Lists styled without markers (`list-style: none`) keep `role="list"` on the `ul`/`ol`, because Safari drops unmarked lists from the accessibility tree outside `nav`.
- Forms: visible labels; errors linked with `aria-describedby` and `aria-invalid`; errors say how to fix.
- Language: `<html lang="en">`; time zone names are not abbreviated alone ("Europe/London (UTC+0)").

## 8. Zoom, reflow and text spacing (SC 1.4.4, 1.4.10, 1.4.12)

- At 320 CSS px wide (400% zoom of 1280) no page scrolls sideways; chip rows, tables and the workbench crop strip (J6) scroll inside themselves.
- Body text is fixed in px tokens, but every container grows with text: no fixed heights on anything holding text; rows use `min-height`.
- With WCAG text-spacing overrides (line height 1.5, letter spacing 0.12 em, word spacing 0.16 em), nothing clips or overlaps. Headings wrap with `text-wrap: balance` and never truncate.

## 9. Forced colours (Windows High Contrast)

- Tags and glyphs use outlines and text, so they survive. Use `forced-color-adjust: auto` (the default) everywhere except the rank glyph and the brand gradient marks.
- The bot mark and the Now marker fall back to a 1 px `CanvasText` square and line.
- Buttons keep a visible border in forced colours (`border: 1px solid transparent` on pills so the system draws it).

## 10. Content and cognitive load

- One primary action per view. Explain each gate in one line where it bites. Times always carry a zone.
- No time limits on any action. The Pull me in fallback is offered after 5 s, not a dead end.
- Privacy explained in plain words next to the data it protects.

## 11. Checks a PR must run and report

| Check | How | Pass |
|---|---|---|
| Automated | `npm run a11y` in two-web-next (axe-core with the WCAG 2.0–2.2 A and AA tags from `ci/a11y-policy.mjs`) on each changed route at 390 and 1280, signed out and signed in | 0 violations |
| Contrast | `npm run contrast` in the kit for any new pair (added to `tokens/contrast.json`) | all pairs pass |
| Keyboard | Tab through the page at both widths: every control reachable, visible ring, nothing hidden under sticky bars, menu sheet traps and releases | written in the PR |
| Screen reader | One pass with NVDA or VoiceOver on the changed component: names, roles, the live announcements in §6 | written in the PR |
| Reduced motion | Emulate `reduce`; nothing moves | screenshot or note |
| Greyscale | Screenshot in greyscale; states still readable | screenshot |
| Reflow | 320 px wide; no sideways page scroll | screenshot |
| Forced colours | Emulate `forced-colors: active`; tags, glyphs, focus and buttons visible | screenshot |
