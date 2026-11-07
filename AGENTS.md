# AGENTS.md

How to build a page, component or bot surface that looks and behaves exactly like Ember Hours. Read this before you design or build anything for two-web-next or two-bot-next.

## 1. What this kit is

`two-design-kit` is the single source of truth for Together We Own design. Product repos pin a tagged release and consume:
- `dist/css/tokens.css` and `dist/ts/tokens.ts` (two-web-next, Hono and `web/` Kit),
- `dist/rust/brand_tokens.rs` (two-bot-next `crates/discord/src/brand.rs`),
- the specs in `docs/`.

| Need | Read |
|---|---|
| A colour, size, font, space or motion value | [docs/tokens.md](docs/tokens.md) (JSON in `tokens/`) |
| A component and its states | [docs/components.md](docs/components.md) |
| A page layout at 390 and 1280 | [docs/templates.md](docs/templates.md) |
| Words | [docs/voice.md](docs/voice.md) |
| Accessibility rules and checks | [docs/accessibility.md](docs/accessibility.md) |
| A Discord embed, button or log line | [docs/discord.md](docs/discord.md) |
| A tool screen (image review, tables, runs, costs) | [docs/components.md](docs/components.md) §J and [docs/templates.md](docs/templates.md) P6–P7 |
| An idea that isn't in the build | [docs/idea-bank.md](docs/idea-bank.md) |
| What it should look like | `mockups/png/` (rendered from these tokens) |

**Design decisions go to the UX Designer.** If the kit doesn't cover what you need, don't invent it in a product repo: open a kit change (§5) or ask the UX Designer on your card.

## 2. Compose a new page in eight steps

1. **Name the member's job and the one primary action.** Write it in the PR: "Members decide whether to come to Town hall; primary action: I'm in." If you can't name one primary action, the page is two pages.
2. **Pick a layout pattern** (templates.md P1–P5; P6–P7 for tool screens). Start at 390: what's the decision block? It comes before any feed.
3. **Pick components from components.md.** Use the id (C1, D5) in your PR. Reuse before you add.
4. **List every state** the page must render, from each component's state table: signed out / signed in, empty, error, stale, live, loading, plus the page's own. Build all of them.
5. **Write copy with voice.md.** Use the word list. Use the Live Sentence grammar and log templates verbatim where they apply.
6. **Use tokens only.** Every colour, size, space, radius, font and duration is a `var(--…)` from `tokens.css` (or a TS/Rust constant). No hex, no raw px for spacing, no new font.
7. **Apply the accessibility rules** (accessibility.md): landmarks, names, focus, one polite status region for live data, text alternatives for every chart.
8. **Render and check at 390 × 844 and 1280 × 800** against the mockups, then run the review checklist (§4) and attach the evidence.

## 3. Do and don't

| Do | Don't |
|---|---|
| `background: var(--two-color-bg-surface)` on a card on the page | `background: #1C1614` or `#222` |
| One ember-filled action per view | An ember "Details" and an ember "I'm in" in the same row |
| `color: var(--two-color-state-live)` with the word "Live" | A pink dot alone, or pink for "online" |
| Echo tag on `bg.canvas`, `bg.surface` or `bg.raised` | Echo tag on `bg.overlay` (4.27:1) |
| Two-tone heading with one serif phrase: "Raid Night: *Deep Rock Galactic*" | A whole serif heading, or serif in a button |
| Tag "Guide · Deep Rock" (neutral) | Tag "Guide" in green (green means saved/confirmed) |
| Show "a member" to guests and for opted-out members | A real name, email or Discord id anywhere public |
| Live state changes by swapping text | Pulse, count-up, ticker, carousel, scroll reveal |
| Motion inside `@media (prefers-reduced-motion: no-preference)` | A transition outside that query |
| Now Line visual `aria-hidden` plus a hidden text list | A chart with only an `aria-label` |
| Countdown updated once a minute, not a live region | `aria-live` on a clock |
| `aria-disabled="true"` with "Pull me in · from 20:45" | A `disabled` button with no reason |
| "That didn't save. Try again, or say you're in from Discord." | "Error", "Something went wrong" |
| Empty state with one next step | An empty box, or "No data" |
| `font-size: var(--two-font-size-h1)` for a page H1 | `font-size: clamp(48px, 6vw, 84px)` (off-scale) |
| `border-radius: var(--two-radius-l)` on a card | `border-radius: 20px` |
| Discord embed coloured by `EmbedKind::Live` and titled "Raid Night is live" | `0xFF0E52` hard-coded, or a timestamp in an embed title |
| Brand gradient on the logo, Now marker and bot mark only | Gradient buttons, borders or headings |

## 4. Design QA checklist

Run this on every UI or bot-surface PR. The author fills it in the PR body; design QA (the UX Designer) checks it against the evidence. A "no" blocks the merge until fixed or answered with a kit change.

**Evidence attached**
- [ ] Screenshots at 1280 × 800 and 390 × 844, full page, signed out and signed in, plus one per required state; each opened by the author.
- [ ] For bot surfaces: a staging screenshot in Discord's dark theme.
- [ ] Commands run and their results (`npm run a11y`, `npm run lighthouse`, `npm run lighthouse:quality`, visual specs; or the bot's tests).

**Tokens**
- [ ] No raw colour, spacing, radius, font or duration values (search the diff for `#`, `px`, `ms` outside token files).
- [ ] Grounds step up by one level; ember used for one action per view.
- [ ] Any new colour pair is in `tokens/contrast.json` and passes.

**Components and states**
- [ ] Every component used is from components.md and named by id in the PR.
- [ ] Every state in each component's table that can occur on this page is rendered (empty, error, stale, loading, live, signed out).
- [ ] State is readable in greyscale (word + shape, never colour alone).

**Layout**
- [ ] Matches the template at both widths; decision block first at 390.
- [ ] No sideways page scroll at 320 px; only chip rows, the newest strip and admin tables scroll.
- [ ] Sticky elements limited to header, list toolbar, one rail and the event action bar.

**Copy**
- [ ] Sentence case; verbs first on buttons; the word list followed.
- [ ] Times viewer-local with a zone; UTC anchor on detail pages.
- [ ] Privacy: guests see counts not names; opted-out members are "a member"; nothing in voice.md §5's never-print list.

**Accessibility**
- [ ] `npm run a11y`: 0 violations on each changed route, both widths.
- [ ] Keyboard pass: visible focus ring everywhere, nothing hidden under sticky bars, menu sheet traps and releases focus.
- [ ] One polite status region; announces state changes only (accessibility.md §6).
- [ ] Charts have a text alternative with the full data.
- [ ] Reduced motion: nothing moves. Forced colours: tags, glyphs, focus and buttons visible.

**Discord (bot surfaces)**
- [ ] The discord.md §8 checklist is complete.

## 5. Changing the kit

- **Add, never fork.** A product repo never defines its own token or variant. Open a PR here.
- **Branch** `feat/<slug>` or `fix/<slug>`, draft PR, the org PR template with Attestation.
- **Tokens:** edit `tokens/*.tokens.json`; add any new colour pair to `tokens/contrast.json`; rebuild `dist/`; the CI checks DTCG validity, `dist/` drift and contrast.
- **Components:** add the component or state to components.md with anatomy, sizing, the state table, content rules and the accessible name and role, before any product PR uses it.
- **Mockups:** regenerate the affected PNGs from `mockups/src` when a token or component changes how a page looks.
- **Versioning:** semver tags. A changed token value is a minor bump; a renamed or removed token is a major bump with a migration note in the release.
- **Never weaken a rule to make a change pass:** a lower contrast minimum, a smaller target, a removed reduced-motion guard or a looser privacy rule needs its own PR, its own justification and the UX Designer's review.

## 6. Ideas that aren't in the build

If your idea is in the idea bank, link its id (IB-xx) on your card and ask the Product Lead to slot it; don't build it inside an unrelated PR. If it's new, add an entry to the idea bank in its own kit PR.
