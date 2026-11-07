# Foundations: tokens

Ember Hours as tokens. The source of truth is `tokens/*.tokens.json` in W3C DTCG format, in the shape this repo's validator accepts (see **Format** below). This page explains them; if this page and the JSON disagree, the JSON wins and this page has a bug.

**Two layers. Components use roles, never primitives:**

| Layer | Example | Who uses it |
|---|---|---|
| Primitive | `color.ground.0`, `color.text.1`, `color.ember` (`tokens/color.tokens.json`) | Role tokens, and the v0.1.0 site aliases (`role.*`). Never a new component. |
| Role and component value | `color.bg.canvas`, `color.text.secondary`, `color.state.live`, `size.control.md`, `layout.rail.seat` (`tokens/roles.tokens.json`, `dimension.tokens.json`) | Components and pages. |

**Files:** `color.tokens.json` (primitives), `roles.tokens.json` (colour roles, gradient, elevation), `alias.tokens.json` (the v0.1.0 site aliases `role.*`), `dimension.tokens.json` (space, insets, radius, size, layout, breakpoints, type sizes, tracking), `font.tokens.json` (families, weights, widths, line heights), `motion.tokens.json`, `discord.tokens.json`, and `contrast.json` (declared pairs, not tokens).

**Format:** DTCG as this repo's validator reads it (`npm run validate`): colours are `#rrggbb` or `rgba()` strings, dimensions are numbers (px) or CSS strings (`clamp()`, `em`), durations are numbers (ms), every group sets `$type`, aliases are `{path}`. Moving to DTCG 2025.10 colour and dimension objects is a pipeline change, tracked separately; token content does not depend on it.

**Outputs** (`npm run build`; generated files are committed and drift-checked):

| Output | File | Consumer | Naming |
|---|---|---|---|
| CSS custom properties, plus a `prefers-reduced-motion: reduce` layer | `dist/css/tokens.css` | two-web-next (Hono and `web/` Kit) | `--two-color-bg-canvas`, `--two-font-size-hero`; site aliases drop `role`: `--two-page` |
| TypeScript constants and a `tokens` tree | `dist/ts/tokens.ts` | two-web-next islands, OG images, tests | `twoColorBgCanvas` |
| Rust constants (`u32` colours, `_MS`, `_PX`) | `dist/rust/brand_tokens.rs` | two-bot-next `crates/discord/src/brand.rs` | `BRAND_DISCORD_EMBED_LIVE`, `BRAND_COLOR_BG_CANVAS` |

## 1. Colour

### 1.1 Grounds (elevation is luminance, never a shadow)

| Role | Value | Mockup name | Use |
|---|---|---|---|
| `color.bg.canvas` | `#15100F` | g0 | Page. Inside of text fields. Hollow Lifeline marker. |
| `color.bg.surface` | `#1C1614` | g1 | Cards, panels, boxes, Now Line frame, row hover. |
| `color.bg.raised` | `#241C19` | g2 | Live row, active nav pill, pressed chip, odd voice rooms, your ladder row. |
| `color.bg.overlay` | `#2E2420` | g3 | Chips on cards, Now Line event blocks, selected segment, done markers, empty bar tracks. |
| `color.bg.sticky` | night 900 at 86% | — | Sticky header and toolbars, with a 14 px backdrop blur and a bottom hairline. |
| `color.bg.sheet` | night 850 at 94% | — | Mobile action bar and menu sheet, 14 px blur, `hairline-strong` top edge. |

**Rule:** a component sits one step above what it sits on. A card (surface) on the page (canvas); a row hover (surface) or a live row (raised) inside a list on the page; a chip (overlay) on a raised row. Never skip two steps; never go down.

### 1.2 Text

| Role | Value | Use |
|---|---|---|
| `color.text.primary` | `#F6F1EA` | Headings, names, values, the first half of a two-tone heading. |
| `color.text.secondary` | `#D2C7BD` | Body copy, ledes, row meta. |
| `color.text.tertiary` | `#A89A8E` | Mono labels, times, freshness, the muted half of a two-tone heading. |
| `color.text.accent` | `#FF9C36` | The one serif accent phrase per heading, step numbers, rail links. |
| `color.text.on-accent` | `#1D0B00` | Text and icons on ember. |

Warm cream, never pure white. Body links inside running text stay in the text colour and are underlined (1 px, 3 px offset); links in rails and facts lists may be ember.

### 1.3 Borders

| Role | Value | Use |
|---|---|---|
| `color.line.hairline` | warm white 8% | Row separators, card edges. Decorative. |
| `color.line.hairline-strong` | warm white 14% | Tag outlines, ghost buttons, chips, fact rules. Decorative. |
| `color.line.control` | `#85766B` | Any edge a user must see to operate the control: text fields, the pressed chip, open seats. 3.46:1 or better on every ground. |

A hairline is never the only way to find a control or read a state.

### 1.4 Accent and focus

| Role | Value | Use |
|---|---|---|
| `color.accent.default` | `#FF9C36` | The primary action surface; your RSVP outline; progress fills. |
| `color.accent.hover` | `#FFAA47` | Hover on ember surfaces. |
| `color.focus.ring` | `#FF9C36` | 2 px outline, 3 px offset, every focusable element. |
| `color.focus.ring-on-accent` | `#1D0B00` | Focus inside the ember join band. |

**Ember is rationed:** one ember surface per view (the primary action, or the join band), plus small "yours" marks. If two things on screen are ember-filled, one of them is wrong.

### 1.5 State (one meaning each, across site and bot)

| Role | Value | Ground role | Means | Never |
|---|---|---|---|---|
| `color.state.live` | `#FF5C7E` | `live-bg` `#3A1A22` | An event is happening now; a room holds a live event. | "Online", errors, decoration. |
| `color.state.echo` | `#9D6AFF` | `echo-bg` `#261C3C` | Frozen attendance (Echo); hosted bars on the Echo trail. | Text on `bg.overlay` (4.27:1). |
| `color.state.ok` | `#5FD39A` | `ok-bg` `#16291F` | Saved, confirmed, sign-ups open, online, first time, new. | Role badges (Guide, Host). |
| `color.state.warn` | `#F2C14E` | `warn-bg` `#2E2410` | Stale data, waitlist position, an estimate that matters. | Live. |
| `color.state.danger` | `#FF7A6B` | `danger-bg` `#3A1A16` | Errors, a downward ladder move, destructive actions. | Live, "full". |

State never relies on colour alone: every state colour comes with a word ("Live", "Saved", "Echo") and, where it has one, a glyph shape.

### 1.6 Brand gradient

`gradient.brand`: `#FF9C36` 0% → `#FF0E52` 52.12% → `#5701AE` 100%, top to bottom. **Three places only:** the logo, the Now marker on the Now Line, and the bot's mark (a 14 px rounded square) in the bot's log and the Lifeline. `color.grad-magenta` and `color.grad-violet` are graphic-only stops and never text. Under `forced-colors: active`, the bot mark falls back to a 1 px `CanvasText` square.

### 1.7 Rank glyph and avatars

- **Rank glyph** (`color.rank.*`): the logo's five clipped arcs; rank *n* lights arcs 1…*n* (ember, ember, pink, pink, violet); unlit arcs are `color.ground.4`. The rank name is always written next to it.
- **Avatar fallback discs** (`color.avatar.0`…`11`): brand-ramp darks; white initials are at least 5.1:1 on each (lowest: avatar 5, 5.12:1). Choose by a stable hash of the member id, never by name. Discord avatars carry the colour; the chrome stays neutral.
- **Now Line heat** (`color.heat.min` → `max`): ember at 0% → 42% alpha over `bg.surface`. Decorative: the text list carries the data.

### 1.8 Workbench: image well and label provenance

| Role | Value | Use |
|---|---|---|
| `color.bg.well` | `#121212` (primitive `color.well`) | Behind source images, crops and previews. Neutral, so the warm grounds don't tint pixels. Never behind text. |
| `color.label.proposed` | `#F2C14E` (= `color.warn`) | A model's proposal nobody has decided: the estimate that matters on a workbench. |
| `color.label.auto` | `#7FB2FF` (primitive `color.machine`) | Auto-accepted under a qualified policy; machine evidence only. Workbench only; never a link or "online". |
| `color.label.reviewed` | `#5FD39A` (= `color.ok`) | Reviewed or adjudicated by a named person. |
| `color.label.uncertain` | `#F6F1EA` (= `color.text.1`) | Marked uncertain; always with the hatch and the "?" glyph. |
| `color.label.rejected` | `#FF7A6B` (= `color.danger`) | Rejected; history and diffs. Also flagged targets in recipe previews. |
| `color.label.ghost` | `#A89A8E` (= `color.text.3`) | The previous box in a proposed change. |
| `color.label.halo` | `#121212` | 1 px on both sides of every box stroke. |
| `box.dash.*` | `6 4` proposed · `2 3` uncertain · `3 3` ghost · `none` auto and reviewed | SVG `stroke-dasharray` in screen px. Pattern carries the tier in greyscale. |

Each tier is a word, a glyph and a stroke pattern as well as a colour (components.md J). Stroke colours are checked against the halo (`bg.well`), not against the image: the halo is what guarantees 3:1 on any pixels.

### 1.9 Contrast: every declared pair

Output of `npm run contrast` over `tokens/contrast.json` (WCAG 2.x relative luminance). CI fails if a pair is under its floor: text 4.5, non-text 3, and the house rule for avatar initials 5.1. To use a new pair in a component, add it to `tokens/contrast.json` first. Translucent tokens (hairlines, scrims, heat) are decorative and not in the table.

| Foreground | Background | Ratio | Floor | Kind |
|---|---|---|---|---|
| `color.text.1` | `color.ground.0` | 16.79 | 4.5 | text |
| `color.text.1` | `color.ground.1` | 15.92 | 4.5 | text |
| `color.text.1` | `color.ground.2` | 14.89 | 4.5 | text |
| `color.text.1` | `color.ground.3` | 13.45 | 4.5 | text |
| `color.text.2` | `color.ground.0` | 11.36 | 4.5 | text |
| `color.text.2` | `color.ground.1` | 10.77 | 4.5 | text |
| `color.text.2` | `color.ground.2` | 10.07 | 4.5 | text |
| `color.text.2` | `color.ground.3` | 9.10 | 4.5 | text |
| `color.text.3` | `color.ground.0` | 6.90 | 4.5 | text |
| `color.text.3` | `color.ground.1` | 6.54 | 4.5 | text |
| `color.text.3` | `color.ground.2` | 6.12 | 4.5 | text |
| `color.text.3` | `color.ground.3` | 5.53 | 4.5 | text |
| `color.ember` | `color.ground.0` | 9.04 | 4.5 | text |
| `color.ember` | `color.ground.1` | 8.57 | 4.5 | text |
| `color.ember` | `color.ground.2` | 8.02 | 4.5 | text |
| `color.ember` | `color.ground.3` | 7.24 | 4.5 | text |
| `color.on-accent` | `color.ember` | 9.15 | 4.5 | text |
| `color.live` | `color.ground.0` | 6.37 | 4.5 | text |
| `color.live` | `color.ground.1` | 6.03 | 4.5 | text |
| `color.live` | `color.ground.2` | 5.64 | 4.5 | text |
| `color.live` | `color.ground.3` | 5.10 | 4.5 | text |
| `color.echo` | `color.ground.0` | 5.34 | 4.5 | text |
| `color.echo` | `color.ground.1` | 5.06 | 4.5 | text |
| `color.echo` | `color.ground.2` | 4.73 | 4.5 | text |
| `color.ok` | `color.ground.0` | 10.13 | 4.5 | text |
| `color.ok` | `color.ground.1` | 9.60 | 4.5 | text |
| `color.ok` | `color.ground.2` | 8.98 | 4.5 | text |
| `color.ok` | `color.ground.3` | 8.11 | 4.5 | text |
| `color.danger` | `color.ground.0` | 7.41 | 4.5 | text |
| `color.danger` | `color.ground.1` | 7.02 | 4.5 | text |
| `color.danger` | `color.ground.2` | 6.57 | 4.5 | text |
| `color.danger` | `color.ground.3` | 5.94 | 4.5 | text |
| `color.border` | `color.ground.0` | 4.31 | 3 | non-text |
| `color.border` | `color.ground.3` | 3.46 | 3 | non-text |
| `color.text.primary` | `color.bg.canvas` | 16.79 | 4.5 | text |
| `color.text.primary` | `color.bg.surface` | 15.92 | 4.5 | text |
| `color.text.primary` | `color.bg.raised` | 14.89 | 4.5 | text |
| `color.text.primary` | `color.bg.overlay` | 13.45 | 4.5 | text |
| `color.text.secondary` | `color.bg.canvas` | 11.36 | 4.5 | text |
| `color.text.secondary` | `color.bg.surface` | 10.77 | 4.5 | text |
| `color.text.secondary` | `color.bg.raised` | 10.07 | 4.5 | text |
| `color.text.secondary` | `color.bg.overlay` | 9.10 | 4.5 | text |
| `color.text.tertiary` | `color.bg.canvas` | 6.90 | 4.5 | text |
| `color.text.tertiary` | `color.bg.surface` | 6.54 | 4.5 | text |
| `color.text.tertiary` | `color.bg.raised` | 6.12 | 4.5 | text |
| `color.text.tertiary` | `color.bg.overlay` | 5.53 | 4.5 | text |
| `color.text.accent` | `color.bg.canvas` | 9.04 | 4.5 | text |
| `color.text.accent` | `color.bg.surface` | 8.57 | 4.5 | text |
| `color.text.accent` | `color.bg.raised` | 8.02 | 4.5 | text |
| `color.text.accent` | `color.bg.overlay` | 7.24 | 4.5 | text |
| `color.state.live` | `color.bg.canvas` | 6.37 | 4.5 | text |
| `color.state.live` | `color.bg.surface` | 6.03 | 4.5 | text |
| `color.state.live` | `color.bg.raised` | 5.64 | 4.5 | text |
| `color.state.live` | `color.bg.overlay` | 5.10 | 4.5 | text |
| `color.state.ok` | `color.bg.canvas` | 10.13 | 4.5 | text |
| `color.state.ok` | `color.bg.surface` | 9.60 | 4.5 | text |
| `color.state.ok` | `color.bg.raised` | 8.98 | 4.5 | text |
| `color.state.ok` | `color.bg.overlay` | 8.11 | 4.5 | text |
| `color.state.warn` | `color.bg.canvas` | 11.24 | 4.5 | text |
| `color.state.warn` | `color.bg.surface` | 10.66 | 4.5 | text |
| `color.state.warn` | `color.bg.raised` | 9.97 | 4.5 | text |
| `color.state.warn` | `color.bg.overlay` | 9.01 | 4.5 | text |
| `color.state.danger` | `color.bg.canvas` | 7.41 | 4.5 | text |
| `color.state.danger` | `color.bg.surface` | 7.02 | 4.5 | text |
| `color.state.danger` | `color.bg.raised` | 6.57 | 4.5 | text |
| `color.state.danger` | `color.bg.overlay` | 5.94 | 4.5 | text |
| `color.state.echo` | `color.bg.canvas` | 5.34 | 4.5 | text |
| `color.state.echo` | `color.bg.surface` | 5.06 | 4.5 | text |
| `color.state.echo` | `color.bg.raised` | 4.73 | 4.5 | text |
| `color.text.on-accent` | `color.accent.default` | 9.15 | 4.5 | text |
| `color.text.on-accent` | `color.accent.hover` | 10.08 | 4.5 | text |
| `color.text.primary` | `color.text.on-accent` | 16.99 | 4.5 | text |
| `color.state.live` | `color.state.live-bg` | 5.24 | 4.5 | text |
| `color.text.primary` | `color.state.live-bg` | 13.84 | 4.5 | text |
| `color.state.ok` | `color.state.ok-bg` | 8.22 | 4.5 | text |
| `color.text.primary` | `color.state.ok-bg` | 13.63 | 4.5 | text |
| `color.state.echo` | `color.state.echo-bg` | 4.52 | 4.5 | text |
| `color.text.primary` | `color.state.echo-bg` | 14.23 | 4.5 | text |
| `color.state.warn` | `color.state.warn-bg` | 9.09 | 4.5 | text |
| `color.text.primary` | `color.state.warn-bg` | 13.58 | 4.5 | text |
| `color.text.secondary` | `color.state.warn-bg` | 9.19 | 4.5 | text |
| `color.state.danger` | `color.state.danger-bg` | 6.16 | 4.5 | text |
| `color.text.primary` | `color.state.danger-bg` | 13.95 | 4.5 | text |
| `color.text.secondary` | `color.state.danger-bg` | 9.44 | 4.5 | text |
| `color.line.control` | `color.bg.canvas` | 4.31 | 3 | non-text |
| `color.line.control` | `color.bg.surface` | 4.09 | 3 | non-text |
| `color.line.control` | `color.bg.raised` | 3.83 | 3 | non-text |
| `color.line.control` | `color.bg.overlay` | 3.46 | 3 | non-text |
| `color.focus.ring` | `color.bg.canvas` | 9.04 | 3 | non-text |
| `color.focus.ring` | `color.bg.surface` | 8.57 | 3 | non-text |
| `color.focus.ring` | `color.bg.raised` | 8.02 | 3 | non-text |
| `color.focus.ring` | `color.bg.overlay` | 7.24 | 3 | non-text |
| `color.focus.ring-on-accent` | `color.accent.default` | 9.15 | 3 | non-text |
| `color.accent.default` | `color.bg.canvas` | 9.04 | 3 | non-text |
| `color.accent.default` | `color.bg.surface` | 8.57 | 3 | non-text |
| `color.accent.default` | `color.bg.raised` | 8.02 | 3 | non-text |
| `color.accent.default` | `color.bg.overlay` | 7.24 | 3 | non-text |
| `color.avatar-text` | `color.avatar.0` | 5.50 | 5.1 | house-avatar |
| `color.avatar-text` | `color.avatar.1` | 10.39 | 5.1 | house-avatar |
| `color.avatar-text` | `color.avatar.2` | 6.82 | 5.1 | house-avatar |
| `color.avatar-text` | `color.avatar.3` | 12.65 | 5.1 | house-avatar |
| `color.avatar-text` | `color.avatar.4` | 9.32 | 5.1 | house-avatar |
| `color.avatar-text` | `color.avatar.5` | 5.12 | 5.1 | house-avatar |
| `color.avatar-text` | `color.avatar.6` | 11.47 | 5.1 | house-avatar |
| `color.avatar-text` | `color.avatar.7` | 6.79 | 5.1 | house-avatar |
| `color.avatar-text` | `color.avatar.8` | 7.00 | 5.1 | house-avatar |
| `color.avatar-text` | `color.avatar.9` | 13.78 | 5.1 | house-avatar |
| `color.avatar-text` | `color.avatar.10` | 5.87 | 5.1 | house-avatar |
| `color.avatar-text` | `color.avatar.11` | 8.02 | 5.1 | house-avatar |
| `color.label.proposed` | `color.bg.canvas` | 11.24 | 4.5 | text |
| `color.label.proposed` | `color.bg.surface` | 10.66 | 4.5 | text |
| `color.label.proposed` | `color.bg.raised` | 9.97 | 4.5 | text |
| `color.label.proposed` | `color.bg.overlay` | 9.01 | 4.5 | text |
| `color.label.proposed` | `color.bg.well` | 11.16 | 3 | non-text |
| `color.label.auto` | `color.bg.canvas` | 8.73 | 4.5 | text |
| `color.label.auto` | `color.bg.surface` | 8.27 | 4.5 | text |
| `color.label.auto` | `color.bg.raised` | 7.74 | 4.5 | text |
| `color.label.auto` | `color.bg.overlay` | 6.99 | 4.5 | text |
| `color.label.auto` | `color.bg.well` | 8.67 | 3 | non-text |
| `color.label.reviewed` | `color.bg.canvas` | 10.13 | 4.5 | text |
| `color.label.reviewed` | `color.bg.surface` | 9.60 | 4.5 | text |
| `color.label.reviewed` | `color.bg.raised` | 8.98 | 4.5 | text |
| `color.label.reviewed` | `color.bg.overlay` | 8.11 | 4.5 | text |
| `color.label.reviewed` | `color.bg.well` | 10.05 | 3 | non-text |
| `color.label.uncertain` | `color.bg.canvas` | 16.79 | 4.5 | text |
| `color.label.uncertain` | `color.bg.surface` | 15.92 | 4.5 | text |
| `color.label.uncertain` | `color.bg.raised` | 14.89 | 4.5 | text |
| `color.label.uncertain` | `color.bg.overlay` | 13.45 | 4.5 | text |
| `color.label.uncertain` | `color.bg.well` | 16.67 | 3 | non-text |
| `color.label.rejected` | `color.bg.canvas` | 7.41 | 4.5 | text |
| `color.label.rejected` | `color.bg.surface` | 7.02 | 4.5 | text |
| `color.label.rejected` | `color.bg.raised` | 6.57 | 4.5 | text |
| `color.label.rejected` | `color.bg.overlay` | 5.94 | 4.5 | text |
| `color.label.rejected` | `color.bg.well` | 7.36 | 3 | non-text |
| `color.label.ghost` | `color.bg.well` | 6.85 | 3 | non-text |
| `color.focus.ring` | `color.bg.well` | 8.97 | 3 | non-text |
| `color.bg.canvas` | `color.label.reviewed` | 10.13 | 4.5 | text |
| `discord.embed.default` | `color.discord-embed-bg` | 6.61 | 3 | non-text |
| `discord.embed.live` | `color.discord-embed-bg` | 4.65 | 3 | non-text |
| `discord.embed.echo` | `color.discord-embed-bg` | 3.90 | 3 | non-text |
| `discord.embed.ok` | `color.discord-embed-bg` | 7.40 | 3 | non-text |
| `discord.embed.warn` | `color.discord-embed-bg` | 8.22 | 3 | non-text |
| `discord.embed.danger` | `color.discord-embed-bg` | 5.42 | 3 | non-text |
| `discord.embed.neutral` | `color.discord-embed-bg` | 3.15 | 3 | non-text |

**Excluded pairs (never used):**

| Foreground | Background | Why |
|---|---|---|
| `color.echo` | `color.ground.3` | Echo rule: violet text is never used on ground 3; Echo tags sit on grounds 0-2 only. |
| `color.state.echo` | `color.bg.overlay` | Under 4.5:1. Echo tags never sit on overlay. |
| `color.grad-magenta` | `color.bg.canvas` | Graphic-only stop; not a text colour. |
| `color.grad-violet` | `color.bg.canvas` | Graphic-only stop; not a text colour. |

## 2. Typography

**Families** (all SIL OFL, self-hosted, latin subset):

| Token | Family | Job | Budget |
|---|---|---|---|
| `font.display` | Mona Sans (variable: wdth 75–125, wght 200–900) | Display and all UI | ~98 KB, preloaded, `font-display: swap` with a metric-matched fallback |
| `font.ui` | Alias of `font.display` (Mona Sans) | Body and UI: body copy, buttons, nav, inputs. Set `body` and the Kit `--font-sans` to `--two-font-ui` | same file as `font.display` |
| `font.accent` | Instrument Serif Italic | One accent phrase per heading, in ember | subset < 12 KB, `font-display: optional` |
| `font.data` | Fragment Mono | Times, counts, freshness, labels | subset < 12 KB, `font-display: optional` |

**Scale:**

| Token | Size | Weight / width / tracking / leading | Use |
|---|---|---|---|
| `font-size.hero` | clamp(40px, 6.1vw, 82px) | 560 / 108% / −0.04 em / 0.98 | Live Sentence, join H1, profile name |
| `font-size.h1` | clamp(36px, 4.6vw, 60px) | 560 / 108% / −0.04 em / 1.0 | Page H1 |
| `font-size.h2` | clamp(30px, 3.6vw, 46px) | 560 / 108% / −0.035 em / 1.0 | Section H2 (two-tone) |
| `font-size.h3` | clamp(22px, 2vw, 26px) | 560 / 108% / −0.025 em / 1.1 | Block heading inside a page (Lifeline, Record) |
| `font-size.figure` | clamp(56px, 7vw, 96px) | 500 / 108% / −0.05 em / 0.9, tabular | Time block, Echo facts, top three |
| `font-size.band` | clamp(40px, 5.5vw, 76px) | 600 / 110% / −0.045 em / 0.95 | Join band H2 only |
| `font-size.title` | 20px | 600 / 1.3 | Card titles (seat-card state) |
| `font-size.lede` | 18px (16 at 390) | 400 / 1.55 | Page lede |
| `font-size.body-reading` | 17px | 400 / 1.6 | Long copy: About, rules, FAQ, event description |
| `font-size.body` | 16px | 400 / 1.55 | UI body, in `font.ui` at `line-height.body` |
| `font-size.ui` | 15px | 500–600 / 1.3, buttons at 105% width | Buttons, nav, list secondary |
| `font-size.small` | 14px | 400 / 1.4 | Meta, notes |
| `font-size.label` | 12px | Fragment Mono 400, uppercase, +0.04 em | Labels, freshness, group headers. **The floor.** |

**Rules:**
- **Body is Mona Sans, not `system-ui`.** Every text that isn't an accent phrase or data uses `font.ui` (`--two-font-ui`, `twoFontUi`). `system-ui` is only the fallback inside the stack.
- **Fixed body, fluid display.** Only `font-size.*` scales with the viewport.
- **12 px floor.** No text is smaller, including avatar initials and chart labels.
- **One serif phrase per heading,** in `text.accent`, at 1.08–1.1 em. Never a whole heading, never body copy, never in buttons.
- **Two-tone headings:** the statement in `text.primary`, the gloss in `text.tertiary` ("What's on. *Say you're in.*"). Both halves are real text in one heading element.
- **Mono is data:** times, counts, freshness and labels. Uppercase only for labels of three words or fewer.
- **Headings wrap with `text-wrap: balance`** and never truncate. Names in tables may ellipsis; titles never.
- **Numbers that update or compare are tabular** (`font-variant-numeric: tabular-nums`).
- **Sentence case** everywhere: headings, buttons, tags.

## 3. Space, radius, size

**Space** (`space.1`…`11`): 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 56 · 72 · 88 px. `space.section` = 88 (56 at 390). **Insets** that sit off the scale on purpose: `space.inset.tag-y` 5, `tag-x` 7, `tight` 10, `room` 14, `compact` 18, `card` 22, `card-lg` 28. Every padding, gap and margin is one of these; a value in components.md maps to the token with that value.

**Radius:** `radius.s` 6 (tags, game chips), `radius.m` 10 (rows, fields, tiles, rooms), `radius.l` 16 (cards, panels, join card), `radius.pill` 999 (buttons, chips, segments, avatars).

**Sizes that are part of the spec:**

| Token | Value | Use |
|---|---|---|
| `size.control.sm` / `md` / `lg` | 36 / 44 / 56 px | Pill heights. 36 is the house minimum for any control. |
| `size.target-min` | 24 px | The WCAG 2.2 SC 2.5.8 floor (the house minimum is above it). |
| `size.target-handle` | 24 px | Hit area round each box handle on a workbench canvas; the one exception to the house minimum (accessibility.md §4). |
| `size.icon.sm` / `md` | 16 / 20 px | Drawn on a 24 px grid, 1.75 stroke, round caps and joins. |
| `size.avatar.xs`…`xl` | 24 / 28 / 36 / 44 / 120 px | Row stack / room and seat / header and people / member rows / profile (72 at 390). |
| `size.row.calm` / `table` / `dense` / `admin` | 68 / 60 / 56 / 40 px | Home and lists / ladder at 1280 / ladder at 390 / admin only. |
| `size.header.wide` / `compact` | 68 / 60 px | Top bar. |
| `size.focus.width` / `offset` | 2 / 3 px | Focus ring. |
| `size.box.stroke` / `halo` / `handle` / `tab` | 2 / 1 / 8 / 22 px | Workbench box overlay (J4), screen px at any zoom. Handle hit areas use `size.target-handle`. |
| `size.crop.tile` | 112 px | Largest native-crop tile on a review screen (J6). |
| `size.toolbar` | 52 px | Workbench tool row (P7). |

## 4. Elevation

No drop shadows. Elevation = one ground step + a hairline. Sticky and sheet layers add a 14 px backdrop blur (`elevation.blur`). Order: `elevation.0` canvas → `1` surface → `2` raised → `3` overlay; `sticky` and `sheet` sit above all.

## 5. Grid and breakpoints

| Token | Value |
|---|---|
| `layout.container` | 1240 px max |
| `layout.columns` | 12 |
| `layout.gutter.wide` / `compact` | 40 px / 20 px (page margin and gutter) |
| `layout.hero-panel` | 400 px (home voice panel) |
| `layout.rail.min` / `default` / `seat` / `max` | 320 / 360 / 380 / 420 px |
| `layout.measure.lede` / `reading` / `note` | 52 / 62 / 36 ch |
| `layout.sticky-offset` | 92 px (sticky rails) |
| `layout.inspector` / `queue` | 380 / 300 px (P7 review inspector and queue panel) |
| `breakpoint.compact-max` | 820 px: one column, compact gutter, menu sheet, action bar |
| `breakpoint.review-mobile` / `review-desktop` | 390 × 844 and 1280 × 800: the two review widths |

Mobile first. **One layout switch** at 820 px. Content column plus a rail on detail pages; the rail moves under the header block at 390 (except where the template says otherwise). No page scrolls sideways at any width from 320 px up.

## 6. Motion

| Token | Value | Use |
|---|---|---|
| `motion.ease` | cubic-bezier(0.22, 1, 0.36, 1) | The only easing. |
| `motion.duration.fast` | 120 ms | Press feedback. |
| `motion.duration.base` | 160 ms | Colour and background on hover and focus. |
| `motion.duration.slow` | 240 ms | Menu sheet open and close. |
| `motion.duration.enter` | 500 ms | The single fade-up on the Live Sentence (8 px travel). |
| `motion.poll.live` | 30 s | Live-island refresh (data cadence, not animation). |
| `motion.poll.stale-after` | 5 min | Data older than this shows as stale. |

**What moves:** colour transitions; one fade-up on the Live Sentence; the menu sheet. **What never moves:** live state (it changes by swapping content: no pulse, ticker, count-up, marquee, carousel, preloader or scroll reveal).

**Reduced motion:** every animation and transition is written inside `@media (prefers-reduced-motion: no-preference)`. The CSS output also sets every duration to `0ms` and the easing to `linear` under `reduce`, as a second guard. Under reduce, nothing moves. (`motion.poll.*` are numbers, not durations, so data cadence is not zeroed.)

## 7. Iconography

Our own inline-SVG stroke set: 24 px grid, 1.75 stroke, round caps and joins, `currentColor`, `aria-hidden="true"`. No icon font, no third-party set. The current set: pull (Pull me in), calendar, share, thread, voice, search, check, bell, menu, up, down, edit, lock, plus the Discord mark (fill, used only on Discord sign-in and join buttons). An icon-only button has an `aria-label`; an icon next to text is decorative.

**State glyphs (event rows; readable in greyscale):** ring = upcoming · half-filled ring in live = live · ember ring with ember dot = yours · filled `text.tertiary` = past / Echo.

## 8. Mapping to code that exists today

| Kit role | v0.1.0 site alias (README) | Mockup source names | two-web-next `public/theme-tokens.css` today |
|---|---|---|---|
| `color.bg.canvas` `--two-color-bg-canvas` | `--two-page` | `--g0` | `--color-page` (`#151720` → `#15100F`) |
| `color.bg.surface` | `--two-surface` | `--g1` | `--color-surface` |
| `color.bg.raised` | `--two-raised` | `--g2` | — |
| `color.text.primary` | `--two-text` | `--t1` | `--color-text` |
| `color.text.secondary` | `--two-muted` | `--t2` | `--color-muted` |
| `color.text.tertiary` | — | `--t3` | — (new) |
| `color.accent.default` | `--two-accent` | `--ember` | `--color-accent` (lime `#a3ff12` → ember) |
| `color.text.on-accent` | `--two-accent-ink` | `--on-ember` | — |
| `color.line.control` | `--two-control-border` | `--line-strong` | `--color-border` |
| `color.line.hairline` / `-strong` | — | `--hair` / `--hair-2` | — (new) |
| `discord.embed.default` | — | — | two-bot-next `BRAND_EMBED_COLOR` (`0xFF0E52` → `BRAND_DISCORD_EMBED_DEFAULT` `0xFF9C36`) |

The `role.*` aliases stay for the existing stylesheet hooks; new components use the role tokens. two-web-next keeps its `--theme-*` operator-override hooks pointing at kit variables, so old CSS keeps working while surfaces migrate.
