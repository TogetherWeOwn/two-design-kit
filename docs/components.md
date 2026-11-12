# Components

Every Ember Hours component: its job, anatomy, sizing, states, content rules and accessible name and role. Values are kit tokens (see [tokens.md](tokens.md)); a raw hex or pixel value in a component is a bug unless this page names it.

**How to read a state table.** *Looks* is what changes on screen. *Does* is behaviour. A state not listed is not allowed to exist: if you need one, add it here first (see [AGENTS.md](../AGENTS.md) §5).

**States every interactive component has**, unless its table says otherwise:

| State | Rule |
|---|---|
| default | as specified |
| hover | colour step only (`motion.duration.base`, `motion.ease`); never movement, never shadow; pointer devices only |
| focus-visible | `2px solid color.focus.ring`, `outline-offset: 3px`, radius follows the control; never removed, never only a colour change |
| active | `motion.duration.fast` darken/lighten of the hover step; no scale |
| disabled | `aria-disabled="true"` (not the `disabled` attribute, so it stays focusable and can explain itself), `bg.raised` ground, `text.tertiary` label, plus a visible reason ("from 20:45") |
| loading | label changes to the present participle ("Moving you…"), `aria-busy="true"` on the control, no spinner unless it takes over 1 s; then a 16 px stroke spinner that does not rotate under reduced motion |

**Live / stale** applies to anything fed by live data: see *Freshness line* and the accessibility rules on live regions.

---

## A. Primitives

### A1. Button (pill)

**Job:** one action. The house button is a pill.

**Anatomy:** container (pill radius) · optional leading icon (`size.icon.md`) · label · optional trailing count in mono.

**Variants:**

| Variant | Ground / text | Use | Limit |
|---|---|---|---|
| `primary` | `accent.default` / `text.on-accent`; hover `accent.hover` | The one primary action in the view | One per view (a row's action counts separately) |
| `ghost` | transparent, inset `border.hairline-strong` / `text.primary`; hover `bg.raised` | Secondary actions, row actions | — |
| `quiet` | `bg.raised` / `text.primary` | Actions that are not available yet (Pull me in before the room opens) and tertiary actions in cards | — |
| `saved` | `state.ok-bg`, inset `state.ok` at 40% / `state.ok` | A confirmed choice the member can still undo ("You're in") | — |
| `on-accent` | `text.on-accent` / `text.primary` | The action inside the ember join band | Join band only |

**Sizes:** `sm` 36 px (padding 0 14, 14 px label), `md` 44 px (0 20, 15 px), `lg` 56 px (0 28, 16 px). Label `font-weight.semibold` at `font-width.button` (105%). Full width inside cards and at 390 for the hero action.

**States:** all common states. `primary` disabled is not allowed (use `quiet` with a reason instead). `saved` hover shows the undo affordance in text ("You're in · change").

**Content:** a verb first, sentence case, 1–4 words: "I'm in", "Pull me in", "Join with Discord", "Add to calendar". Never "Click here", "Submit", "OK". Name the thing when a row has several buttons ("Approve join for Sam" in admin).

**A11y:** `<button>` for actions, `<a>` for navigation, never a `div`. Accessible name = visible label; icon-only buttons need `aria-label` (and should be rare). Minimum target 36 px tall (above the WCAG 2.2 24 px floor).

**Don't:** two primary pills side by side; an ember ghost button; a pill that only says "More".

### A2. Text link and link button

- **In running text:** text colour, underline 1 px at 3 px offset, `text-decoration-thickness: 1px`. Hover: `text.primary`.
- **In rails, facts lists and footers:** `text.link` (ember), no underline until hover. Must still be distinguishable by position (it is the value in a key–value list).
- **Link button** (e.g. "I can't make it"): 14 px `font-weight.medium`, `text.secondary`, underlined, 8 px padding so the target is at least 36 px.
- **A11y:** link text says where it goes ("Read the full rules", "Discord thread"); external links to Discord say so in text when they leave the site ("Open in Discord").

### A3. Icon button

`ghost` pill, square (`size.control.sm` or `md`), icon `size.icon.md`. Always `aria-label` ("Notifications", "Copy profile link", "Menu"). Menu button also has `aria-expanded` and `aria-controls`.

### A4. Tag

**Job:** a short state or category label on a row, card or person.

**Anatomy:** mono label (the label style (`font.data`, `font-size.label`, uppercase, `tracking.label`), uppercase), `space.inset.tag-y` × `space.inset.tag-x` (5 × 7 px) padding, `radius.s`, inset 1 px outline. Optional leading 7 px dot.

| Variant | Text | Outline | Use |
|---|---|---|---|
| neutral | `text.secondary` | `border.hairline-strong` | Recurrence, visibility ("Open to all", "Members"), role badges (Guide, Host, Moderator), record kinds |
| `live` | `state.live` | `state.live` at 45% | "Live" only |
| `you` | `text.accent` | ember at 45% | "You're in", "You" |
| `echo` | `state.echo` | `state.echo` at 50% | "Echo" only; never on `bg.overlay` |
| `ok` | `state.ok` | `state.ok` at 45% | "Sign-ups open", "Saved", "First time", "New" |
| `warn` | `state.warn` | `state.warn` at 45% | "Reserve · 2nd", "Stale", "Estimate" |

**Content:** 1–3 words. Sentence case in source; CSS uppercases. Role badges carry the role as text ("Guide · Deep Rock"), never an icon alone.

**A11y:** a tag is text inside its row; no role. Do not make tags interactive (use a chip).

### A5. Live dot

7 px circle, `state.live`, `aria-hidden="true"`, always followed by words ("Live now", "1 live now"). Static: it never pulses. For presence counts ("132 online") the dot is `state.ok`, not live.

### A6. State glyph

16 px, 2 px ring, shown in event rows (hidden at 390, where the tag carries state).

| Glyph | Drawing | Means |
|---|---|---|
| ring | `text.tertiary` ring | upcoming |
| half | `state.live` ring, left half filled | live |
| mine | `accent.default` ring with a 6 px ember dot | yours (you're in) |
| done | filled `text.tertiary` | past (Echo) |

`aria-hidden="true"`: the row's tag or time text says the state in words. Shapes differ, so state survives greyscale and forced colours.

### A7. Rank glyph and rank label

**Glyph:** the logo's five clipped arcs on a 44-unit viewBox, stroke 4.5. Rank *n* lights arcs 1…*n* (`color.rank.arc-1`…`arc-5`), the rest `rank.arc-off`. Sizes 20 px (inline) and 44 px (`.l`: rank line, Where you stand).

**Ranks:** 1 Prospect · 2 Member · 3 Soldier · 4 Veteran · 5 Legend.

**Rank label:** glyph + 8 px + rank name in text. The glyph is always `aria-hidden="true"`; the name is the accessible content. A glyph is never shown without its name.

**Rank ladder strip** (profile): the five names as mono labels; the current one has a `border.control` outline and `text.primary`. `aria-label="Rank ladder, Veteran is 4 of 5"` on the group; the current item also has `aria-current="step"`.

### A8. Avatar, avatar stack and seat strip

**Avatar:** circle. Discord avatar image when the member has one (`alt=""`, the name is next to it); otherwise a fallback disc in `color.avatar.<hash % 12>` with white initials, 12 px semibold (`font-size.label` is the floor). Sizes per `size.avatar.*`. In stacks a 2 px ring in the ground colour separates discs (`--bg` = the ground the stack sits on).

**Anonymous avatar** (guests): `bg.overlay` disc, no initials, no image. The panel says "Names show once you join".

**Avatar stack:** up to 3–4 discs overlapping by 8 px, then a `+N` disc (`color.ground.4`, count in 12 px). Fallback discs inside a stack show colour only, no initials (initials collide at this overlap). If the count is written next to the stack ("4 playing"), the stack is `aria-hidden="true"`; otherwise it is one `role="img"` with `aria-label="4 people"`.

**Seat strip:** one 28 px avatar per taken seat, then one dashed `border.control` circle per open seat, wrapping, 6 px gap. `role="img"`, `aria-label="17 of 24 seats taken, 7 open"`. Always followed by the count line in text ("**17 of 24 in** · 7 left · 3 on reserve").

**States:** loading = `bg.overlay` discs, no shimmer; image error = fallback disc; opted-out member in a public list = anonymous disc and "a member".

### A9. Segmented control

**Job:** switch between 2–4 views of the same list (Upcoming / Mine / Past; Overall / Around you; Active / Everyone / Guides).

**Anatomy:** `bg.surface` track with hairline, 4 px padding; segments 36 px, pill, 14 px medium label, optional mono count. Selected: `bg.overlay`, `text.primary`.

**Behaviour:** each segment is a link that changes the URL (`?view=mine`), so it works without JavaScript and is shareable. Full width at 390 with equal segments.

**A11y:** `<nav aria-label="Which events">` with links; selected link has `aria-current="page"`. Not a tablist (the content is a new page state, not a panel).

**States:** default, hover (`text.primary`), focus-visible, selected. A segment with 0 items stays visible with "0" (never disappears).

### A10. Chip (filter and switcher)

**Job:** filter a list by one facet (activity, game) or pick an instance (past dates).

**Anatomy:** 36 px pill, inset `border.hairline-strong`, 14 px medium label, optional mono count. Pressed: `bg.raised`, `text.primary`, `border.control` outline.

**Behaviour:** progressive enhancement over links. Without JS each chip is a link that sets the URL filter; with JS it is a toggle button that updates the list in place and the URL with `history.replaceState`. At 390 the chip row scrolls sideways (no wrap) with the page gutter as padding, and the focused chip scrolls into view.

**A11y:** in-place filters: `<div role="group" aria-label="Activity">` of `<button aria-pressed>`; link fallback: `aria-current="true"` on the active one. When a filter changes the list, a polite status says the result ("4 co-op events").

**States:** default, hover, focus-visible, pressed, empty-count (shows "0", stays enabled so the empty state can explain).

**Don't:** use a chip for a tag; use more than 7 chips (merge kinds instead).

### A11. Text field and search

44 px, `radius.m`, `bg.canvas` inside, inset 1 px `border.control`, 15 px text, 14 px horizontal padding, optional leading search icon in `text.tertiary`.

| State | Looks |
|---|---|
| default | as above; placeholder in `text.tertiary` and never the only label |
| hover | outline `text.tertiary` |
| focus-visible | focus ring outside the control outline |
| filled | text `text.primary`; search shows a clear button (`aria-label="Clear search"`) |
| error | outline `state.danger`, a message below in `state.danger` 14 px starting with what to do ("Use 2 to 32 characters"), `aria-invalid="true"`, `aria-describedby` → message |
| disabled | `bg.raised`, text `text.tertiary`, reason in helper text |

**A11y:** a visible `<label>` (search can use a visually hidden label plus the placeholder "Find by name or Discord handle"). Search results count is announced politely.

### A12. Toggle (switch)

Used in the profile Privacy panel. 44 × 24 px track, `bg.overlay` off / `accent.default` on, 18 px knob `text.primary` (on: `text.on-accent`), `border.control` outline when off. Label on the left, the consequence in a 14 px secondary line below ("Members see when you're usually on. Guests never do."). `<button role="switch" aria-checked>` or a native checkbox styled as a switch. Saving is immediate with a polite "Saved" status; on error, the switch returns and a danger message appears below it.

### A13. Freshness line

**Job:** say how fresh live data is, next to the data.

**Anatomy:** mono label row: dot + source + age ("Live from our Discord · updated 20 s ago").

| State | Looks | Copy |
|---|---|---|
| live (age < `motion.poll.stale-after`) | `state.ok` dot | "updated 20 s ago" |
| stale (≥ 5 min, or the bot is offline) | `state.warn` dot; the numbers it labels freeze and drop to `text.tertiary` | "Last seen 18:40 · the bot is catching up" |
| estimate | no dot; `tag warn` "Estimate" | "Shading: estimate, 8 weeks of voice" |
| error (never loaded) | no numbers at all | "Live numbers didn't load. Events below are still current." |

**A11y:** the age text updates silently (not a live region). Moving between live and stale is announced once in the page's polite status region.

### A14. Notice

Inline message for a section, not a toast. `radius.m`, 16 px padding, the matching `state.*-bg` ground, a 16 px icon, a 15 px `text.primary` sentence and an optional action. Kinds: info (`bg.surface` + hairline), ok, warn, danger. **Danger notices** use `role="alert"` only when they are the result of the member's own action; otherwise they are plain content. No toasts, no auto-dismiss.

### A15. Progress bar

8 px (6 px on the ladder), `radius.pill`, track `bg.overlay`, fill `accent.default` (rank progress) or `text.secondary` (season elapsed; it isn't yours). Always paired with the numbers in text ("6 more events to Soldier"). `role="img"` with `aria-label="14 of 20 events toward Soldier"`, or a native `<progress>` with a label.

### A16. Skip link

First focusable element. A `primary sm` pill, off-screen until focused, then at top-left 12 px. "Skip to content", targets `<main id="main">`.

---

## B. Shell

### B1. Header (top bar)

**Anatomy (1280):** lockup (38 px high, the owner's horizontal logo) · main nav (Events, Ladder, Members, About) · right cluster: presence status ("132 online", `state.ok` dot) · guest: Sign in (ghost sm) + Join (primary sm) · member: notifications icon button + avatar and name.

**Anatomy (390):** lockup (32 px) · right cluster: Join (guest) or avatar (member) · Menu icon button. 60 px high.

**Sizing:** 68 px (60 at 390), sticky, `elevation.sticky` ground, bottom hairline. Nav links are 40 px pills, 15 px medium, `text.secondary`; current page `bg.raised` + `text.primary`.

**States:** current page (`aria-current="page"`); signed out / signed in; presence stale (dot `state.warn`, "online" count greyed, title attribute is not used to explain; the freshness line on the page does); static anonymous (below).

**Static anonymous** (a public page served from a shared cache, which can't read the session or live presence): the presence cluster is omitted entirely: no count, no dot, no placeholder. Don't fetch presence to fill it. Every visitor gets the guest cluster (Sign in + Join), members included, because the bytes are the same for everyone; Join signs a member straight in (H4 "already a member"). No greeting caption ("Welcome, guest" is wrong for a member reading the cached page). The B2 sheet holds the same links and must open without JavaScript (`<details>`, `:target`, or the links inline) and stay keyboard-operable.

**A11y:** `<header>` landmark; `<nav aria-label="Main">`; the lockup link is named "Together We Own, home" with `alt=""` on the image. Sticky header height is in `scroll-padding-top` so focused elements are never hidden under it (WCAG 2.4.11).

### B2. Mobile menu sheet

Opens from the Menu button at ≤ 820 px. Full-width sheet under the header, `elevation.sheet`, nav links as 52 px rows, then Sign in / Join or Profile / Sign out. Opens with a 240 ms fade and 8 px slide under `no-preference` only. `aria-expanded` on the button; focus moves to the first link; Tab is trapped inside; Escape and the Menu button close it and return focus to the button. The page behind is `inert`. Static anonymous (B1) without JavaScript: Menu is a link to `#menu-sheet` with no `aria-expanded` (it cannot track `:target`), the sheet opens through `:target`, and a last "Close menu" row links back to `#`; the script adds `role="button"` and `aria-expanded` and swaps in the behaviour above when it runs.

### B3. Footer

Hairline top, 32 / 44 px padding, 14 px `text.tertiary`. Left: "Together We Own · adult gaming community · founded 1998". Right: `<nav aria-label="Footer">` About, FAQ, House rules, Privacy. Column at 390; a no-break space keeps "founded 1998" on one line. Founded is 1998 everywhere; never print another year until a later date is verified.

### B4. Mobile action bar

**Only on event detail, only at ≤ 820 px.** Fixed to the bottom, `elevation.sheet`, `hairline-strong` top, 12 px padding plus `env(safe-area-inset-bottom)`. Content: the seat state in two short lines ("**You're in · seat 7** / Pull me in opens at 20:45") · an icon button (Add to calendar) · the primary seat action. The page adds bottom padding equal to the bar so nothing hides behind it. `<aside aria-label="Your seat">`. Never a second bar, never a bottom tab bar.

### B5. Sticky toolbar

Under the header on list pages (events, ladder, members). `elevation.sticky`, hairline bottom, 14 px vertical padding, `top` = header height. Holds the segmented control, chips, search and one end action (Subscribe, Sort). At 390 the end action moves below and goes full width or into the menu. Included in `scroll-padding-top`.

### B6. Time-zone line

`size.icon.md` calendar icon + "Your time: **Europe/London (UTC+0)**. Every time also shows UTC on its event page. *Change*". 14 px `text.secondary`, ember link. Shown once at the top of every list of times. Guests see the browser zone with "(from your browser)".

### B7. Page header

Mono freshness or count line (optional) · H1 (`font-size.h1`, two-tone) · lede (`font-size.lede`, `text.secondary`, max `layout.measure.lede`). Padding 64 / 40 (36 / 24 at 390).

### B8. Section header (two-tone band header)

Grid of two equal columns at 1280: H2 (`font-size.h2`, two-tone, balanced) left, lede (`text.secondary`, max 46 ch) right, aligned to the baseline; 40 px below. At 390 one column, 12 px gap, 24 px below. Sections are `space.section` bands with a top hairline. Each `<section>` is labelled by its H2 (`aria-labelledby`).

---

## C. Events

### C1. Event row

**Job:** let a member scan events and act without opening the page.

**Anatomy (1280):** a 5-column grid, 16 px gap, `size.row.calm` min height, 10 × 16 px padding, `radius.m`:
1. **time** (118 px): first line `text.primary` ("21:00", "Live now", "Sun 1 Nov"), second line relative in mono `text.tertiary` ("in 2 h 10 m", "since 18:30")
2. **state glyph** (18 px)
3. **meta:** title (17 px semibold, wraps, never truncates) + inline tags · secondary line 14 px `text.secondary` (host, room, seats left with the capacity mark)
4. **who** (170 px): avatar stack (24 px) + count ("17 going", "4 playing", "18 were there")
5. **action** (118 px, right-aligned): one `sm` pill

**Anatomy (390):** two columns: left = time on one line, title + tags, secondary line, who; right = the action, vertically centred. The glyph is hidden (the tag carries state). 14 × 12 px padding.

**Ground:** no rules between rows; rows are separated by space and tone. Hover `bg.surface`; live row `bg.raised` permanently.

| State | Time column | Tag | Action | Who |
|---|---|---|---|---|
| upcoming | "Sat 19:30" / "tomorrow" | visibility or rank gate if any | ghost "I'm in" (member) / ghost "Details" (guest) | "9 going" |
| yours | as upcoming | `you` "You're in" | ghost "Details" | "17 going" |
| live | "Live now" / "since 18:30" | `live` "Live" | primary "Pull me in" (member) / ghost "Details" (guest) | "4 playing" |
| full | as upcoming | neutral "Full" | ghost "Join reserve" | "24 going · 3 reserve" |
| reserve (you) | as upcoming | `warn` "Reserve · 2nd" | ghost "Details" | — |
| members only (guest) | as upcoming | neutral "Members" | ghost "Details" | anonymous stack |
| past (Echo) | date / "last week" | `echo` "Echo" | ghost "Recap" | "18 were there" |
| past, no Echo yet | date | neutral "Sign-up record" | ghost "Details" | "21 signed up" |
| cancelled | date, struck through *and* "Cancelled" in words | neutral "Cancelled" | ghost "Details" | — |
| loading (island) | unchanged; the row is server-rendered | — | — | — |

**Content:** title = event name, then a colon and the game when it adds meaning ("Raid Night: Deep Rock Galactic"). Secondary line: host · room or game · one fact that helps decide ("7 seats left", "newcomers welcome"). Times are viewer-local; the row never shows UTC (the detail page does).

**A11y:** `<li>` inside a `<ul>` per day group; the title is a heading (`h3` on list pages, `h4` under an H3 group on home) and the row's link target. The action button's accessible name includes the event when it is not the only one on the row ("I'm in for Raid Night" via `aria-label` or visually hidden text). The glyph is hidden; the tag or time says the state.

### C2. Day group

Mono uppercase group heading (the label style (`font.data`, `font-size.label`, uppercase, `tracking.label`), `text.tertiary`, 16 px left padding to align with row content): "Today · Fri 6 Nov", "Sat 7 Nov", "Next week", "Just happened". 28 px between groups. A real heading element (`h2` on the events page).

### C3. Empty state

**Job:** say honestly that there is nothing here, and give one next step.

**Anatomy:** `radius.m` box, inset `border.hairline-strong`, 20 px padding; 16 px semibold sentence ("Nothing yet on Monday or Tuesday."), 14 px secondary explanation, one ghost `sm` action. At 390 the action goes under the text.

| Where | Copy | Action |
|---|---|---|
| gap days in a list | "Nothing yet on Monday or Tuesday. Those are usually quiet evenings. Fancy hosting?" | Suggest an event |
| filter with no results | "No racing events this month." | Clear filters |
| no events at all | "No events are scheduled yet. Hosts usually post Friday's by Wednesday." | Suggest an event |
| ladder, day 1 | "The board fills as events end. The next one is Raid Night tonight." | See Raid Night |
| profile, no Echoes | "Lumen's record starts with their first event." (own: "Your record starts with your first event.") | Find an event |
| members search | "Nobody matches "zz". Try a Discord handle." | Clear search |

**Never:** an illustration, an apology, "Oops", or an empty box with no next step.

### C4. Time block

**Job:** say when an event starts, in the viewer's time, with the UTC anchor.

**Anatomy:** top hairline, 28 px padding top. Big numeral ("21:00", `font-size.figure`, tabular) · beside it, two lines: "Friday 6 November, your time" (17 px `text.primary`) and the mono anchor "Europe/London · 21:00 UTC · in 2 h 10 m · as of 18:50" (13 px `text.tertiary`). Wraps under the numeral at 390.

**Server HTML stays true however long it is read.** A server-rendered page can stay open, sit in the back/forward cache or come from a shared cache. So every time-relative or live claim is dated with the instant the server derived it, and the client never recomputes it.

- **Snapshot instant (`asOf`):** the one server instant used to derive the state, the countdown and the counts. On a shared cached page it is the cache-fill time.
- **Absolute facts** never go stale: the start numeral, the date line, the zone and UTC anchor, "since 21:00", "ended 23:14" and "Cancelled".
- **Claims** go stale: the countdown, the "Live" numeral and the room count.
- **`staleAt`** = the earlier of `asOf` + `motion.poll.stale-after` (5 min) and the next state boundary after `asOf`: start − 15 min (upcoming → starting), start (→ live), and the end when it is known (live → ended).

| State | Numeral | Anchor line | Can go stale |
|---|---|---|---|
| upcoming, start > 24 h after `asOf` | "21:00" | "Europe/London · 21:00 UTC" (no countdown: the date line already says when) | no |
| upcoming, ≤ 24 h | "21:00" | "Europe/London · 21:00 UTC · in 2 h 10 m · as of 18:50" | yes |
| starting (< 15 min) | "21:00" | "Europe/London · 21:00 UTC · starts in 12 m · as of 20:48" | yes |
| live | "Live" | "since 21:00 · 16 in the room · as of 21:40" (the count only when the page has it; the tag above switches to `live`) | yes |
| ended | the date ("30 Oct") | "ended 23:14 · Echo frozen" | no |
| cancelled | struck through, plus "Cancelled" in words | unchanged | no |
| stale, was upcoming or starting (JS only) | "21:00" | "Europe/London · 21:00 UTC · as of 18:50 · Refresh" (the countdown is removed) | — |
| stale, was live (JS only) | "21:00" (the "Live" claim is withdrawn) | "Europe/London · 21:00 UTC · live as of 21:40 · Refresh" (the count is removed) | — |
| no zone known (guest) | combines with any row above | "your time (from your browser)" | — |

**"as of" clause:** `as of HH:MM` in the zone the block already names, so a guest whose zone comes from the browser sees it in that zone once the island runs; before that, or with no zone, in UTC (as in H4's cached page rule). Prefix the date ("as of 5 Nov 22:10") when the `asOf` local date differs from the event's local date. Wrap it in its own `<time datetime>`. Same style as the rest of the anchor line (mono, `text.tertiary`), with no warn dot: the absolute time is still right. The A13 `state.warn` dot stays reserved for the page's freshness line.

**Refresh:** the visitor refreshes; nothing refreshes for them. No `<meta http-equiv="refresh">`, no auto-reload, no C4 polling, no moving focus or scroll. In the stale rows only, append a text link (A2) `Refresh<span class="sr-only"> the event time</span>`: an `<a href>` to the page's own path and query without the fragment. The no-JS snapshot has no Refresh link: it can't know it is stale, the dated "as of" is the honest part, and the browser's reload is the action.

**Behaviour with JavaScript (no ticker):**
- C4 ships no island of its own. Stale detection lives in the page's existing island; a page with no island is complete with the server snapshot alone.
- Check `now ≥ staleAt` at hydration, on `pageshow` (including back/forward cache restores) and on `visibilitychange` to visible. Arm at most one one-shot `setTimeout` for `staleAt`, cleared on teardown and re-armed after each check. No `setInterval`, no `requestAnimationFrame`, and no recomputing the countdown while it is fresh: fresh text never changes.
- The client clock never decides upcoming, live, ended or cancelled, and never computes a countdown. If the clock is unreadable, or is ahead of `asOf` by more than the stale window, show the stale form: withdrawing a claim is always safe.
- Fresh → stale is an instant text swap, with no transition under any motion preference.
- If the page's island already polls (`motion.poll.live`), its payload is a new server snapshot: re-render C4 from that payload's state and `asOf`, which returns it to fresh. This is the only way back to fresh without a navigation.

**A11y:** a `<time datetime="2026-11-06T21:00Z">` wraps the numeral, and the "as of" has its own `<time datetime>`. C4 is **not** a live region. A countdown going stale is not announced (relative times ageing, [accessibility.md](accessibility.md) §6 rule 2). Live → stale is a state change: if the page owns the polite status region, announce it once, throttled (rule 3): "Live details for Raid Night are out of date. Refresh for the latest." With no status region on the page, the swap stays silent.

### C5. Seat card

**Job:** the member's place in the event, and the actions that change it. The most important card on event detail.

**Anatomy:** `bg.surface` box, `radius.l`, 22 px padding · header row: state heading (`font-size.title`, semibold) + state tag · seat strip · count line · button stack (full width, 10 px gap) · reminder note (bell icon in ember, 14 px `text.secondary`).

| State | Heading | Tag | Buttons (top to bottom) | Note |
|---|---|---|---|---|
| signed out | "Save a seat" | `ok` "Sign-ups open" | primary "Sign in with Discord to save a seat" | "You'll come straight back here." |
| open | "17 of 24 in" | `ok` "Sign-ups open" | primary "I'm in" · ghost "Add to calendar" | "The bot saves your seat and pings you 30 minutes before." |
| saved | "You're in. Seat 7." | `ok` "Saved" | quiet "Pull me in · from 20:45" (`aria-disabled`) · ghost "Add to calendar" · link "I can't make it" | "The bot pings you at 20:30. If you drop out, the first reserve gets your seat and a ping." |
| full | "Full · 24 of 24" | neutral "Full" | primary "Join reserve · you'd be 3rd" | "If a seat opens, the bot gives it to the next reserve and pings them." |
| reserve | "You're on reserve. 2nd in line." | `warn` "Reserve" | ghost "Add to calendar" · link "Leave the reserve" | "Reserves move up at 21:10 if a seat is still empty." |
| promoted | "A seat opened. You're in. Seat 19." | `ok` "Saved" | as saved | "The bot pinged you in Discord at 20:12." |
| room open | "You're in. Seat 7." | `live` "Room open" | primary "Pull me in" · ghost "Add to calendar" | "The bot moves you if you're in any of our voice rooms." |
| live | "16 in the room" | `live` "Live" | primary "Pull me in" (or saved "You're in Raid 1" once moved) | — |
| ended | The card is replaced by the Echo key facts (C10) and "Next one: Fri 13 Nov" with "I'm in". | | | |
| cancelled | "Cancelled by Vexa" | neutral "Cancelled" | ghost "See the next date" | the reason in the host's words, and "Your seat is released. Nothing else to do." |
| error (action failed) | unchanged | unchanged | the button returns to its previous label | danger notice: "That didn't save. Try again, or say you're in from Discord." |
| loading | unchanged | unchanged | pressed button reads "Saving…" (`aria-busy`) | — |

**Pull me in** button sub-states (shared with D3): default "Pull me in" → loading "Moving you…" → done (`saved`) "You're in Raid 1" → fallback ghost "Open Raid 1 in Discord" when the member is not connected to voice ("You're not in voice, so Discord will open the room for you.").

**A11y:** `<aside aria-label="Your seat and event facts">` (rail) or a `section` at 390. Result of an action is announced politely ("You're in. Seat 7."). At 1280 the rail is sticky (`layout.sticky-offset`).

### C6. Facts list

Key–value list in a `bg.surface` box, 8 × 22 px padding. `<dl>`; keys are mono labels (`text.tertiary`), values 15 px `text.primary`, right-aligned; rows divided by hairlines. Standard keys for events, in order: Host · Room · Game · Repeats · Talk (Discord thread) · Share (Copy link). Link values are ember. "Copy link" announces "Link copied" politely.

### C7. Lifeline

**Job:** show an event's life as real actions by the bot and the site, with times, so "I said I'd come" becomes a visible promise. The Ember Hours headline feature.

**Anatomy:** an ordered list. Each step = time (mono, right-aligned, 118 px) · marker (28 px circle on a 2 px vertical line) · actor label (mono uppercase with the actor mark: gradient bot square for the bot, ember ring for the site or you) · step title (16 px semibold) · optional one-line detail (15 px `text.secondary`). At 390: marker left, time above the title, 14 px gap.

| Step state | Marker | Line below | Title colour | Actor label |
|---|---|---|---|---|
| done | `bg.overlay` fill + check icon | `text.tertiary` | `text.secondary` | "Bot", "You, on this site" |
| next | `bg.canvas` with a 2 px ember ring and a 10 px ember dot | `hairline-strong` | `text.primary` | "Bot · next" |
| future | `bg.canvas` with a 2 px `hairline-strong` ring | `hairline-strong` | `text.primary` | "Bot" |
| failed | `danger-bg` with an × in `state.danger` | `hairline-strong` | `text.primary` + the detail "The bot couldn't post the reminder. Hosts were told." | "Bot" |
| skipped | as future, title struck through *and* "Skipped" in the detail | — | `text.tertiary` | "Bot" |

**The standard steps** (each maps to a bot or site action; see [discord.md](discord.md) §5):

| # | Time | Title (member view) | Source action |
|---|---|---|---|
| 1 | when posted | "Opened sign-ups and posted the event in #events" | `event.upsert` + `announcement.post` |
| 2 | when you RSVP | "You said you're in. The bot saved seat 7" (detail: "Mark yourself Interested on the Discord event too, and Discord will remind you." with a link to the scheduled event; Discord does not let the bot do this for you) | `rsvp.site` → `seat.saved` |
| 3 | T−30 min | "Pings everyone who's in, 30 minutes before" (detail: "As a Discord DM from the bot.") | `reminder.sent` |
| 4 | T−15 min | "Opens the Raid 1 room. "Pull me in" turns on here" | `room.opened` |
| 5 | T | "Starts counting who's in the room" (detail: "Reserves move up if a seat is still empty at 21:10.") | `attendance.started`, `reserve.promoted` |
| 6 | end | "Freezes the Echo: who came and who stayed" (detail: "It lands on this page and on each player's profile.") | `echo.frozen` |

**Variants:** guest (step 2 reads "Members say they're in. The bot saves each a seat"); not RSVP'd member (step 2 is a future step "You say you're in…" with the I'm in action beside it); cancelled (a final done step "Vexa cancelled it: <reason>", later steps skipped).

**A11y:** `<section aria-labelledby>` with an H2 "Lifeline" and the mono gloss "What the bot has done, and will do". `<ol>`; each `<li>` has `aria-current="step"` on the next step. Markers and actor marks are hidden; the actor is text. A new step arriving while the page is open is announced politely once ("The bot opened the Raid 1 room").

### C8. Who's in (people list)

Two columns at 1280, one at 390. Each person: 36 px avatar · name (15 px semibold) · rank label (13 px `text.tertiary`) · optional tag on the right (`you` "You", `ok` "First time", neutral "Host"/"Guide"). Rows divided by hairlines. Shows the first 8 then "See all 20" (ghost sm). Members only: guests see "17 going · names show once you join".

### C9. Instance switcher

A chip row (`role="group" aria-label="Past dates"`) of the last 3 dates plus "All dates"; the current one has `aria-current="true"`. Used under "Last time" on recurring events.

### C10. Key facts (Echo)

**Job:** an event's frozen attendance, as three numbers with words.

**Anatomy:** three columns (one at 390 on home; three compact columns inside a card), each: `hairline-strong` top rule, 18 px padding top, big numeral (`font-size.figure`, or `font-size.h1` inside a card, `font-size.figure-compact` at 390) and a serif italic caption in `text.secondary` (22 px; 15–19 px compact).

**Standard facts:** "**18** of 21 came" · "**16** stayed to the end" · "**3** first-timers". Optional fourth on competitive nights: "**Juno** won".

| State | Looks |
|---|---|
| frozen | as above, with a mono label "Echo · Fri 30 Oct · frozen 23:14" |
| counting (event live) | numbers replaced by "Counting. The Echo freezes when the event ends." |
| no Echo (before the bot counted) | "No Echo for this one: it ran before the bot counted attendance. 21 signed up." |
| opted-out members | counted in totals, never named |

**A11y:** each fact is one sentence in the DOM ("18 of 21 came"); the numeral is not split from its words for screen readers.

---

## D. Live

### D1. Live Sentence

**Job:** the home H1, written from live state, so the first words prove the place is alive.

**Anatomy:** freshness line (A13) · H1 (`font-size.hero`, two-tone, `text-wrap: balance`, one serif phrase) · CTA row: primary `lg` pill + a 15 px explanation (max 34 ch).

**Grammar** (first matching rule wins; numbers are live; `{event}` is the serif phrase):

| # | Condition | Member | Guest |
|---|---|---|---|
| 1 | bot offline or data older than 5 min | "{event} is at 21:00. *Live numbers are catching up.*" + freshness "Last seen 18:40" | same |
| 2 | an event is live | "{event} is on. *16 of us are in the Raid 1 room.*" → CTA "Pull me into Raid 1" | "{event} is on right now. *16 of us are in the room.*" → "Join with Discord" |
| 3 | you're in for an event today | "You're in for {event} at 21:00. *14 of us are already in voice.*" → "Pull me into Squad 1" | — |
| 4 | ≥ 3 in voice | "14 of us are in voice right now. *{event} starts in 2 h 10 m, and 17 are going.*" → "Pull me into Squad 1" | same → "Join with Discord" |
| 5 | < 3 in voice, an event this week | "It's quiet right now. *Friday evenings are busiest: {event} is at 21:00.*" → "See what's on" | same → "Join with Discord" |
| 6 | nothing scheduled | "It's quiet this week. *Hosts post most events by Wednesday.*" → "Suggest an event" | same → "Join with Discord" |

**Rules:** under 120 characters; numbers below 3 are never shown as a headcount ("It's quiet" instead); "us" and "we", never "users"; times viewer-local. The 500 ms fade-up runs once on first paint under `no-preference` only.

**A11y:** the H1 text is updated by the live island only when the *rule* changes (e.g. 4 → 2), not when a count ticks; the polite status region announces the new sentence once. It is not itself `aria-live`.

### D2. Voice panel and room row

**Panel:** `bg.surface`, `radius.l`, 6 px padding. Header: "In voice now" (15 px semibold) + mono "3 rooms · 14 people". Guest footer: mono "Names show once you join" + "Why?" link.

**Room row:** `radius.m`, 14 px padding, odd rows `bg.raised`. Name (16 px semibold) · activity and duration ("Helldivers 2 · 1 h 12 m", 14 px secondary) · avatar stack (right) · member only: a second line with seats in mono ("2 seats", "open") and a ghost `sm` "Pull me in".

| State | Looks |
|---|---|
| member | names via avatars, Pull me in on each room |
| guest | anonymous discs, no buttons |
| you're in this room | the button becomes saved "You're here" |
| room full | mono "full"; Pull me in becomes ghost "Open in Discord" |
| quiet (nobody in voice) | the panel says "Nobody's in voice yet. Friday evenings are busiest." with the next event as a row link |
| stale | avatars and counts drop to `text.tertiary`; the header count reads "Last seen 18:40" |
| error | "Voice rooms didn't load." in place of the list; the rest of the page is unaffected |

**A11y:** `<aside aria-labelledby>` (home hero); rooms are a `<ul>`; each Pull me in button is named for its room ("Pull me into Squad 1").

### D3. Pull me in (behaviour)

One button moves the signed-in member into a voice room. **Self-only:** a member can only move themselves. Rate-limited; every move is a line in the bot's log.

| State | Label | Notes |
|---|---|---|
| unavailable (room not open) | quiet "Pull me in · from 20:45" | `aria-disabled="true"`, the reason is in the label |
| default | "Pull me in" / "Pull me into Squad 1" | primary on the one hero action, ghost in room rows |
| loading | "Moving you…" | `aria-busy`, at most 5 s, then fallback |
| done | saved "You're in Squad 1" | polite announcement |
| fallback | ghost "Open Squad 1 in Discord" | the member isn't connected to voice; a Discord channel deep link |
| failed | returns to default + danger notice "The bot couldn't move you. Open Squad 1 in Discord instead." | |
| signed out | "Sign in to join the room" | goes through Discord sign-in and returns |

### D4. Now Line

**Job:** this week on one time axis: when members are usually on (hot-zone shading), events at their times, your RSVPs outlined, and now.

**Anatomy (1280):** `bg.surface` box, `radius.l`, 22 × 24 px padding. Hour axis (mono 12 px), 16:00–02:00 viewer-local. Seven day rows (46 px, hairlines between): day label (mono uppercase; today in `text.primary`) · heat cells (`color.heat` alpha by value, `radius` 3) · event blocks over the heat (30 px, `bg.overlay`, `hairline-strong`; yours with a 1.5 px ember outline; 13 px semibold name + mono count) · the Now marker (2 px `gradient.brand` line across today, with a mono "Now 18:50" label). Legend below: quiet → busy swatch · You're going · Now · mono "Shading: estimate, 8 weeks of voice".

**Anatomy (390):** tonight plus the weekend, 8 hours × 3 days. The week view is desktop only.

| State | Looks |
|---|---|
| estimate (before voice calibration) | legend tag "Estimate"; required until the bot measures voice |
| measured | legend "Shading: last 8 weeks of voice" |
| no events this week | heat only, plus an empty-state line under the frame |
| stale | the Now marker stops moving and its label reads "Last seen 18:40" |

**A11y:** the visual is `aria-hidden="true"`. Directly after it, a visually hidden list carries the same information: "Usually busiest Friday and Saturday, 20:00 to midnight." · one item per event ("Raid Night, Friday 21:00, you're going.") · "Now: Friday 18:50.". The Now marker moves at most once a minute and never animates.

### D5. The bot's log

**Job:** a public ledger of what the bot did, including site actions, so the bot↔site loop and automated moderation are visible.

**Anatomy:** `<ol>` in a `bg.surface` box; each line = actor mark (14 px: gradient square = bot; ember ring = a site action) · one sentence (15 px `text.secondary`; names and event names in `text.primary` semibold) · relative time (mono, right). Hairlines between lines. 5 lines on home, then "See the full log".

**Line grammar and privacy:** see [discord.md](discord.md) §4: the site and the Discord bot-log channel render the same records with the same templates.

| State | Looks |
|---|---|
| member view | names shown, except opted-out members ("a member") |
| guest view | every member name is replaced with "a member" or "a new member"; event names stay |
| empty | "The bot hasn't done anything yet today." |
| stale | times stop; header gets a freshness line "Last seen 18:40" |
| moderation actions | **never shown** (bans, kicks, timeouts, warnings, role removals) |

**A11y:** `<ol>`; each line is a sentence that reads correctly without the mark; times are `<time datetime>` with the relative text. New lines are prepended on refresh without announcement.

---

## E. Ladder

### E1. Season bar

Page-header element. Mono labels above a 6 px progress bar: "Day 7 of 30" (left) · "Resets 1 Dec · updated 6 min ago" (right). Fill `text.secondary` (it is time, not yours). `role="img" aria-label="Season 4, day 7 of 30"`. The page H1 mono line says how it counts: "Season 4 · November · counted by the bot from Echoes".

### E2. Top three

Three `bg.surface` cards, `radius.l`, 20 px padding, 12 px gap: big position numeral (64 px, `text.tertiary`; 1st in `text.accent`) · 44 px avatar + name + rank label · mono fact ("7 events · 4 wk run"). At 390, compact rows: numeral 40 px on the left, 8 px gap. `<ol aria-label="Top three this season">`. Ties share a position and say "Tied 2nd".

### E3. Ladder table

**Columns (1280):** # (56) · Move (72) · Member (avatar 36 + name + rank label) · Came (72, right) · Run (80, right, "4 wk") · Last seen at (190, "Raid Night, 30 Oct"). Row height `size.row.table`, hairline between rows, 15 px tabular `text.secondary`; position 18 px `text.primary`.

**Your row:** `bg.raised` across, plus a 2 px inset ember edge on the left, and "(you)" after the name in text.

**Movement:** up = `state.ok` with up icon + number; down = `state.danger` with down icon + number; none = "–". Movement is also readable without colour (icon + number) and in the accessible name ("up 2").

**At 390:** Move, Run and Last seen are hidden; #, Member, Came stay. Row height `size.row.dense`.

| State | Looks |
|---|---|
| overall | top 100 |
| around you | you ± 5, with a gap row "Ranks 4–8" (mono, centred) |
| you opted out | your row shows "Hidden (only you see this)" in `text.tertiary` |
| game filter, no data | empty state "Nobody has come to a Valorant event this season yet." + Clear filter |
| day 1 | empty state (C3) |
| footer | mono "212 members on the board · 9 chose not to be listed" (the opt-out count is always shown) |

**A11y:** a real `<table>` with a visually hidden `<caption>` that names the scope ("Around you (5 above and below): going counts, season 4, every game"); `<th scope="col">`; numeric columns right-aligned.

### E4. How it counts

Rail card: H2 "How it counts" (17 px semibold) and an `<ol>` of 3 steps, each with an ember mono number ("01") and one sentence: "Say you're in for an event, here or in Discord." · "Turn up in the room. The bot counts who's there." · "When it ends, the Echo adds one to everyone who came. Hosting counts double."

### E5. Rank distribution

Rail card "Ranks, all time": one row per rank, Legend first: glyph · name over a 6 px bar (fill `text.tertiary`, width relative to the largest) · count (mono). Followed by a mono line "Don't want to be listed? *Profile settings*".

### E6. Where you stand (home card)

`bg.surface` box with a two-tone H2 ("Where you stand. *Season 4.*") · big rank line (44 px glyph, rank name 34 px, "6 more events to Soldier") · progress bar (A15) · facts list: This season "#14 of 212 · up 3" · Came to "9 events, 4 weeks in a row" · Next "Raid Night, Fri 21:00" (link). Members only; guests see "Last Sunday's Echo" in its place.

---

## F. Members

### F1. Newest member card

"Joined this week" strip: six `bg.surface` cards (`radius.l`, 18 × 14 px, centred): 44 px avatar · name (15 px semibold) · mono day ("Tue", "Today") · ghost `sm` "Say hi". Six across at 1280; at 390 a sideways-scrolling row of 140 px cards. "Say hi" opens a Discord DM (or a mention in the welcome thread); its accessible name is "Say hi to Pell". Members who opted out are not shown. Guests do not see this strip.

### F2. Member row

Grid: avatar 44 · name (16 px semibold) + rank label · up to 2 game chips (13 px `text.secondary` on `bg.raised`, `radius.s`) · last seen (mono 13 px: "Raid Night · 7 d ago", or `state.ok` dot + "In voice now") · role tag (neutral "Moderator", "Guide", "Host"; `ok` "New" for the first 7 days). `size.row.calm`, hairline between rows. At 390: name and rank, then games, then last seen; the tag top-right. The whole row links to the profile (name is the link text).

**Never shown on a row:** real names, email, age, gender, region (unless the member opted in), attendance rate.

### F3. Who runs this

Rail card: H2 "Who runs this" · list of moderators and leads: 36 px avatar · name · role in words ("Founder · moderator", "Moderator · EU nights") · then "Questions or a problem with someone? Message any of them, or use #help." Visible to guests too (moderator names are public by role).

### F4. Guest members view

No names. Page header with counts ("814 members · 212 came to something this month"), the rule stated ("Only signed-in members see names. Visitors see the counts."), and primary "Sign in with Discord to see who's here".

---

## G. Profile

### G1. Identity block

Grid: avatar `xl` (120; 72 at 390) · name (`font-size.hero`, 108%) · mono line: handle · "Member since Mar 2024" · usual hours only if shared ("Usually on 19:00–23:00 your time") · badge tags (neutral roles; region only if shared) · actions on the right: ghost "Message on Discord" + icon button "Copy profile link". **Own profile:** "Edit profile" replaces Message, and the Privacy panel (G8) appears.

### G2. Rank line

Between hairlines, 22 px padding: 44 px rank glyph · rank name (26 px display) + how it was earned ("Two years of showing up · promoted by the bot on 1 Oct") · rank ladder strip (A7) on the right (hidden at 390).

### G3. Echo trail

**Job:** 26 weeks of showing up at a glance.

**Anatomy:** H3 "Echo trail" + mono "Last 26 weeks". 26 bars (13 at 390), 4 px gap, 96 px tall, bottom `hairline-strong`; bar height = events that week × 22 px; ember = came, `state.echo` = hosted that week; a zero week is a 4 px `bg.overlay` stub. Mono month axis. Legend: "Came to an event (bar height = how many)" · "Hosted one".

**A11y:** `role="img"` with a summary label ("Events attended per week over the last 26 weeks: 33 events, 3 of them hosted, missed 3 weeks."). A "Show as a table" link reveals a week-by-week table.

**Never:** a missed-week count on someone else's profile beyond the neutral summary; any attendance rate.

### G4. Record

Dated timeline, newest first, capped at about 20 with "Full record · 64 entries". Each item: date (mono) · mark (Echo = filled violet ring; hosted = violet ring; bot = gradient square) · title (16 px semibold) · one line (14 px secondary) · kind tag (`echo` "Echo", neutral "Host", "Rank", "Joined"; Guide as neutral). Entry kinds: Echo (came / stayed / placement), hosted, rank change by the bot, role given (logged by the bot), joined. **Never:** discipline, warnings, missed events.

### G5. Stat tile

Three tiles in the rail (`bg.surface`, `radius.m`, 16 px): numeral (`font-size.tile`, tabular) + 13 px caption: "61 events came to" · "12 events hosted" · "9 weeks, longest run". No win rate, no attendance rate.

### G6. You and <name>

Rail card, only when a signed-in member views someone else: "You and Lumen" · numeral (44 px) "7" · "events together, most recently Raid Night on 30 Oct" · shared game chips. Hidden when either side opted out of the ladder.

### G7. Going next

Rail card: mono "Fri 21:00 · your time" · event title · "You're both in" / "Lumen's going". Only if the profile owner shares their sign-ups.

### G8. Privacy panel (own profile)

Toggles (A12), each with its consequence: Show my usual hours · Show my region · Count me on the ladder (leaderboard opt-out) · then a danger link button "Delete my data" that opens the existing erasure flow with a plain explanation first. A note at the bottom: "Attendance rates and missed events are never shown on profiles."

---

## H. Join

### H1. Identity line

64 px icon · "Together We Own" (18 px semibold) · mono "A Discord gaming community · founded 1998 · English".

### H2. Join steps

`<ol>` of 3 steps, hairline-separated, 22 px vertical padding: ember mono number ("01") · title (18 px semibold) · one-line detail (15 px secondary):
1. "Discord asks you to say yes": "We ask for your name, your avatar and permission to add you to our server. Nothing else."
2. "The bot lets you in and makes you a Prospect": "It takes a few seconds. You'll see our channels in Discord right away."
3. "You land back here, signed in": "Pick an event marked "Open to all" and say you're in. After your first one, you're a Member."

### H3. Norms list ("What we ask of you")

H2 at `font-size.h3` · 3 items with a `state.ok` check icon (decorative) and a sentence · the last links to the full rules. Exactly three norms; the rules page holds the rest.

### H4. Join card

Sticky rail card (`bg.surface`, `hairline-strong`, `radius.l`, 28 px; static at 390 where it sits right after the lede). H2 "Join with one sign-in" · two count tiles (`bg.raised`, `radius.m`: "9 events this week", "6 joined this week") · mono "as of" line (`text.tertiary`: "As of Tue 3 Nov, 18:40 UTC") · primary `lg` full-width "Join with Discord" (Discord mark) · "Already in our server? The same button signs you in." · hairline · two privacy lines with lock icons ("We never post as you or read your messages." · "Leave any time. Delete your data from your profile, in one step.").

| State | Card content |
|---|---|
| default | as above |
| returning, success | heading "You're in. The bot just made you a Prospect." · primary "Pick your first event" · the next 3 Open-to-all events as rows |
| Discord denied or cancelled | heading "No problem. Nothing was shared." · primary "Try again" |
| bot couldn't add you | warn notice "The bot couldn't add you just now." · primary "Open our Discord invite" · "The bot will give you your rank when it's back." |
| already a member | straight sign-in; returns to the page they came from |
| a count below 3 | that tile is dropped and the other spans the row; both below 3: no tiles and no "as of" line |
| counts unavailable when the page is rendered | no tiles and no "as of" line; never zeros or placeholders |

**Cached page rule.** The join page is a static anonymous page (B1): one cached copy serves every visitor, so H4 carries no live state. No "in voice now" tile: voice presence changes by the minute, and a cached copy would show a stale number with nothing to say it is old. Live voice belongs on pages rendered per request (D1, D2). The tiles hold only counts that move slowly (this week's events, this week's joins). They are read when the cached copy is rendered, and the "as of" line names that moment. It is in UTC because a cached page can't know the viewer's zone, and it has a date because the copy can outlive the day. Don't fetch counts client-side to refresh them: that adds a script and a layout shift to the card that holds the page's one primary action, for a number that changes a few times a week. The IB-04 floor applies (numbers below 3 are never shown as a count, as in D1).

### H5. Join band

Full-bleed `accent.default` band, 72 px vertical padding (48 at 390): H2 (`font-size.band`, `text.on-accent`, serif accent "Pull up a *chair.*") · one sentence (17 px, max 36 ch) · `on-accent` `lg` pill "Join with Discord" (full width at 390). Focus ring inside the band is `focus.ring-on-accent`. Guest home only, once, at the end. It is the one ember surface on that screen section.

### H6. Highlights ("What happens here")

Four columns (one at 390), each: `hairline-strong` top rule · mono cadence ("Fridays · 21:00 UTC") · H3 (19 px semibold) · two short sentences. Exactly four, each concrete (a named night, a time, a rule).

---

## I. Admin

### I1. Admin table

Admin keeps its current layout and takes the tokens. Density: `size.row.admin` (40 px) rows, 14 px text, hairlines between rows, `bg.surface` header row with mono labels. **UTC-labelled time columns** ("Joined (UTC)"). Named row actions ("Approve join for Sam", never bare "Approve"). State as text tags, never colour alone. Destructive actions are `ghost` with `state.danger` text and confirm in place ("Remove Sam's RSVP? *Remove* · Cancel"). Sticky header row; `<table>` semantics with `scope`.

### I2. Attendance record and inactive report

Two admin reports added by Ember Hours: an **attendance record** per member (Echo-based: came, signed up and didn't come; moderators only) and an **inactive 30 days** report (no automatic removal). Both are admin-only, labelled "Moderators only" in a neutral tag, and never linked from public pages.

---

## J. Workbench (tool surfaces)

Components for dense tool screens where people judge images and model output: first used by labelloop's review, release, training and registry screens. They follow every rule above (tokens only, one ember surface per view, state as word + shape + colour, 36 px controls, 12 px text floor) and add the parts a tool needs. Layout patterns P6 and P7 are in [templates.md](templates.md). Workbench copy follows [voice.md](voice.md) §7.

**The provenance rule.** Anything made or judged by a model shows who made it, in words, every time it is shown: a badge, a tab, a history line or a column. A model's output never looks like a person's decision. Three tiers matter most and must never be confused:

| Tier | Word | Glyph (J3) | Box stroke (J4) | Colour role | Means |
|---|---|---|---|---|---|
| proposed | "Proposed" | dashed ring | dashed `box.dash.proposed` | `label.proposed` | A model suggested it; nobody has decided. |
| auto-accepted | "Auto-accepted" | hollow diamond | solid + 4 corner brackets | `label.auto` | A qualified policy accepted it. Machine evidence only; no person looked. |
| reviewed | "Reviewed" (or "Adjudicated", "Yours") | filled disc with a check | solid + filled tab | `label.reviewed` | A named person decided it. |

Two more states exist: **uncertain** ("Uncertain": dotted ring with a question mark, dotted stroke over a hatched fill, `label.uncertain`) and **rejected** ("Rejected": ring with ×, `label.rejected`, history and diffs only). Greyscale test: with colour removed, the five are still told apart by stroke pattern, corner marks, tab fill and glyph.

### J1. Workbench header

B1 for tools. 60 px (`size.header.compact`) at every width, `elevation.sticky`, bottom hairline. **Anatomy:** product mark + name · project switcher (a `bg.surface` button, `radius.m`, opens a listbox of projects) · section nav (pills as B1, 36 px, a mono count after a section that has a queue: "Review 37") · end cluster: spend status (J17 mini meter + mono "$3.10 of $40", links to Costs) · avatar + "Name · Role". **At ≤ 820 px:** mark · project switcher · avatar · Menu (B2 sheet holds the sections). **States:** current section (`aria-current="page"`); spend over 80 % (mini meter `state.warn`) or paused (the spend text reads "Paid steps paused", `state.danger`); no project yet (switcher reads "New project"). **A11y:** `<nav aria-label="Project">`; counts have hidden words ("37 images to review"); the switcher is named "Project: Shelf audit. Switch project".

### J2. Provenance badge

A4 tag with a leading 12 px J3 glyph. Variants `proposed`, `auto`, `reviewed`, `uncertain`, `rejected`: text in the tier's colour role, outline that colour at 45 %. **Words:** "Proposed", "Auto-accepted", "Reviewed", "Adjudicated", "Yours" (a box the viewer drew, before they leave the image), "Uncertain", "Rejected". Detail goes beside the badge, not in it ("Proposed · class change"). **Never:** a badge without its glyph; "Verified", "Approved" or "Confirmed" for anything a model decided.

### J3. Provenance glyph

16 px (12 inside a badge), drawn on a 16-unit grid, `aria-hidden="true"`; the word next to it carries the meaning. proposed: dashed ring · auto: hollow diamond · reviewed: filled disc with a check cut out in `bg.canvas` · uncertain: dotted ring with "?" · rejected: ring with ×. Forced colours: glyphs use `currentColor` and stay visible.

### J4. Box overlay

**Job:** draw labels on an image so provenance, selection and proposed changes read at a glance, on any pixels.

**Anatomy, per box:** a 1 px `label.halo` line on both sides of a 2 px stroke (`size.box.stroke`, `size.box.halo`, both screen px, never scaled with zoom), so every stroke holds 3:1 on any image. Stroke pattern and colour by tier (table above). Auto-accepted adds 4 corner brackets (5 px, 9 px long). Uncertain adds a 45° hatch at 35 % of `label.uncertain`. **Tab:** `size.box.tab` (22 px) above the top-left corner, opaque `bg.canvas` ground (text never sits on pixels), 1 px outline in the tier colour, J3 glyph + mono object number; reviewed tabs are filled `label.reviewed` with `bg.canvas` text. **Tab placement:** above the box; below it when the box touches the top edge; to the right, vertically centred, for boxes smaller than the tab; end-anchored for boxes at the right edge. Tabs never leave the image well.

**Tab modes** (one control, key L): Numbers (glyph + number; the default above 8 boxes) · Names (adds the class, or the proposal: "Soy milk → Almond milk", "Almond milk · new box", "Split into 2", "New · Price tag") · Off. The selected box always shows Names.

| State | Looks |
|---|---|
| proposed class change | box as proposed; tab names the change |
| proposed new geometry | the current box as a ghost (`label.ghost`, `box.dash.ghost`, no tab) and the proposed box in proposed style |
| proposed split | the current box as a ghost and each part in proposed style; one tab "Split into 2" |
| proposed new object | proposed style; tab "New · {class}" |
| selected | a 2 px `focus.ring` outline 4 px outside the box, 8 px handles (`size.box.handle`, `text.primary` with a halo) on corners and edges, each with a 24 px hit area (`size.target-handle`; the box-handle exception to the 36 px house minimum in accessibility.md §4). Corner handles show only when the box is at least 24 px on screen both ways, edge handles at 48 px, so hit areas never overlap; a smaller box shows none until zoomed; tab gets the focus outline |
| drawing | solid `focus.ring` stroke with handles (never dashed, so it can't read as proposed) |
| hover (pointer) | stroke and tab step to the selected outline at 50 %; no movement |
| hidden by filter | not drawn; the legend count still shows it |
| tiny (box under 6 screen px) | drawn at its true size plus a side tab, so it can always be found and selected |

**A11y:** the overlay is `aria-hidden`. Every box is also an item in the crop strip (J6) and the object order, and keyboard selection follows that order (J/K). Dragging always has a non-drag alternative: arrow keys move the selected box 1 px (Shift 10 px), Alt + arrows resize, and the inspector takes typed coordinates (WCAG 2.5.7). Forced colours: strokes and tabs fall back to `CanvasText`, selection to `Highlight`.

### J5. Image well and provenance legend

**Image well:** `bg.well` (neutral, so pixels read true), `radius.m`, the image fitted by default. A mono zoom note bottom-right on a `bg.canvas` chip ("1 screen px = 2.2 source px"). Zoom steps: Fit · 50 · 100 · 200 · 400 %; 0 = fit, 1 = 100 %, Z = zoom to the selected box; Space + drag or the scrollbars pan. Never smooth upscaled pixels above 100 % (`image-rendering: pixelated`), so reviewers see real pixels.

**Legend:** a chip row (A10) directly under the well: one pressed-toggle chip per tier with glyph, word and mono count ("Proposed 5"), then "Showing all 14 objects" or the filter result. It is both the legend and the filter. A polite status announces the filter result.

| State | Looks |
|---|---|
| loading | well at its final aspect ratio, `bg.well`, no shimmer; tabs and legend counts appear with the image |
| image failed | well keeps its size; centred in it, a `bg.canvas` panel (`radius.m`, `space.4` padding) holds the `text.primary` sentence "This image didn't load." + ghost "Try again" (text never sits on `bg.well`); decisions are blocked |
| no boxes | "No boxes on this image yet." in the legend row; the well shows the image only |

### J6. Crop strip and crop tile

A horizontal list of every object on the image as native-pixel crops, in decision order (proposed, uncertain, auto-accepted, reviewed; then by number). Tile 60 × 72 px crop on `bg.well`, `radius.s`, 2 px inset ring in the tier colour; caption: glyph + number, then the class (ellipsis allowed). Current tile: `focus.ring` outline. Scrolls inside itself. Each tile is a button whose name reads "Object 4 Soy milk, Proposed". **Larger crops** (inspector): "Native" at 1:1 when it fits, otherwise the largest scale that fits; never upscaled more than 4×; the scale is always printed ("Native · 1:1", "Context · 0.61×").

### J7. Reference views

Approved reference images for a class, side by side with the crop being judged. A group per class: class name (15 px semibold) · mono role ("Proposed class", "Current class", "Often confused with") · up to 3 thumbnails on `bg.well`, `radius.s`, each `role="img"` named with class and view ("Almond milk 1 L reference, angled"). Footer mono line: "Approved references only · evaluation images are never shown here". Empty: "No approved references for Almond milk yet." + link "Add references".

### J8. Proposed edit card

**Job:** one model proposal, its reason and its evidence, with equal-weight choices.

**Anatomy:** `bg.surface`, `radius.m`, a 3 px inset left edge in `label.proposed` · line 1: J3 glyph + who proposed ("LLM review proposes", "The detector proposes") + mono time · line 2: the change as a sentence, old value struck through *and* replaced in words ("Change class: ~~Soy milk 1 L~~ → Almond milk 1 L") · the model's reason as a blockquote, plain text only, with the mono caption "Model's reason · not checked by a person" · evidence links (references, crops) · actions.

**Actions:** ghost "Accept change" (A) · ghost "Keep {current}" (R) · link button "Mark uncertain" (U). **Accept and keep are the same weight on purpose:** a primary Accept would nudge people to rubber-stamp the model. Never ember here.

| Kind | Sentence |
|---|---|
| class | "Change class: ~~Soy milk 1 L~~ → Almond milk 1 L" |
| geometry | "Redraw the box: 9 px taller at the top" (+ "Show both boxes" toggle) |
| new object | "Add a missing Soy milk 1 L at the right edge (clipped)" |
| split / merge | "Split into 2 boxes" / "Merge objects 6 and 7" |
| delete | "Delete: looks like a reflection" (accepting needs a reason when the box was reviewed by a person) |
| duplicate | "Same object as 3" |

States: decided (the card collapses to a history line, J9); stale (the object changed since the proposal: warn notice "This proposal was made on revision 4; the box has changed since." and only Keep or Mark uncertain are offered); malformed (never shown; it is logged and counted).

**A11y:** a `section` labelled by its "… proposes" heading; the blockquote is text, never HTML or links from the model; shortcuts in `aria-keyshortcuts`.

### J9. History list

`<ol>` of events for an object, image or release, newest last. Each line: J3 glyph of the tier the event produced (none for neutral events) · one sentence naming the actor (a person by name; a model by role plus a mono version: "Detector yolo26n · r0007 proposed Soy milk 1 L, score 0.62") · mono time. Hairlines between lines. Always ends with the current truth when it matters: "No person has reviewed this object."

### J10. Class picker

A combobox in a popover anchored beside the box (or under the Class field). Title "Class for the new box" / "Change class" · search field (matches names and aliases) · listbox options: 36 px reference thumbnail · class name · mono sub-line (reference match score, matched alias) · check on the active option. Opens ranked by reference match, never alphabetically by default. Footer: primary sm "Add {class}" + ghost "Cancel" · link button "None of these fits · mark uncertain". Reviewers can't create classes here; an admin edits the class catalog. **One ember while open:** Add is the only ember action while the picker is open. The decision dock (J12) demotes its primary to a ghost button for that time (same label, same shortcut held back until the picker closes) and restores it on close or cancel. **A11y:** ARIA combobox + listbox pattern; Enter commits, Esc cancels and returns focus to the box.

### J11. Tool picker and shortcuts

Tool picker: A9 segmented group of pressed buttons (Select V · Box B · Split S · Merge M), icon + word; the key shows in the tooltip and the shortcut sheet, and in `aria-keyshortcuts`. **Kbd hint:** mono 12 px key cap, hairline-strong outline, `radius.s`, inside buttons whose shortcut matters at that moment ("Accept change A"). **Shortcut sheet:** opened by ? or the keyboard icon button; a `bg.surface` panel listing every key in a `<dl>`. Single-key shortcuts are off while a text field has focus, and can be turned off in account settings (WCAG 2.1.4).

### J12. Decision dock

The bottom of the review inspector: `elevation.sheet`, `hairline-strong` top edge, sticky inside the rail (at ≤ 820 px it becomes a B4-style bar fixed to the bottom of the screen). Mono line: scope + progress ("This image · 5 of 14 to decide") · the image's one primary action ("Accept image", Enter) + ghost "Skip" · reason line when the primary is unavailable · link button for the rare exit ("Exclude this image…"). Unavailable primary = quiet pill with `aria-disabled` and the reason in a described-by line ("Decide the 5 proposals first. Uncertain is a decision."). While the class picker (J10) is open, the primary shows as a ghost button and Enter belongs to the picker; it returns to primary when the picker closes.

### J13. Workbench table

I1 at workbench density, for any list of records: `size.row.admin` rows, `<table>` with a hidden caption, mono uppercase headers on `bg.surface`, tabular numbers right-aligned, UTC-labelled time columns, named row actions ("Roll back 640 to m-0005"), state as tags. Wide tables scroll inside a focusable region named for the table. Selected or "in use" row: `bg.raised`.

### J14. Comparison bars

Current against candidate, per row: label (140 px) · two 8 px bars on one track (current `text.tertiary` above, candidate `text.primary` below; width = value) · the candidate value in mono with ▲ / ▼. Legend above names both models by id. Unsupported rows show the reason in words instead of bars. The bars are `aria-hidden`; a visually hidden sentence list carries the data, and "Show as a table" opens the full numbers. Never ember or state colours for a series.

### J15. Distribution bar

A 10 px stacked bar for parts of a whole (splits, sources): `text.secondary` · `text.tertiary` · `line.control`, keyed above the table; row bars scale to the largest row. Always sits in a table row that holds the numbers. For provenance mixes, the segments use the `label.*` roles and the key names the tiers in words.

### J16. Delta

A change against a baseline: up / down icon + signed number, coloured by whether it is good (`state.ok`) or bad (`state.danger`), not by sign; "–" for none. A hidden word says the direction ("up", "down"). Same rule as E3 movement.

### J17. Budget meter

A15 with thresholds: fill `text.secondary` to 80 %, `state.warn` from 80 %, `state.danger` at 100 % or when paid steps are paused. Always paired with "$3.10 of $40" in mono. Estimates carry the warn tag "Estimate"; actuals never do.

### J18. Secret fingerprint

How a stored key is shown, ever: lock icon · mono "ul_••••9f3c" (prefix + last 4) · "sha256 1a2b3c4d" (first 8 of the hash) · who added it and when. `bg.canvas`, `radius.m`, hairline-strong outline. There is no reveal, no copy and no "show key" control. Replacing a key is a write-only field that clears on save and reports the new fingerprint.

### J19. Job status tag

A4 tags for long work (runs, compiles, syncs, evaluations): neutral "Queued", neutral "Running" (with "41 of 100 epochs" beside it and an A15 bar; never a spinner or pulse), `ok` "Completed", `danger` "Failed" (reason in words beside it), neutral "Cancelled", `warn` "Paused" (with why: "out of credits"). Status changes are announced politely once.

### J20. Spend confirm panel

Paid work never starts from one click. The start button opens this panel in place (no modal): `bg.raised`, `line.control` outline, `radius.m`. A facts list of exactly what will run (release, recipe, base model with hash, hardware, epochs, images) · an estimate tile with the `warn` "Estimate" tag, the price basis and the billing rule ("Billed for time used, even if cancelled; at least 15 minutes") · the month's total after this run against the limits · a ceiling line that says what is enforced and what is not ("The run won't start if its estimate is over $5 per operation, or if this month's spend, plus estimates reserved for queued work, plus this estimate would pass the $40 limit. Time-based billing can come in above the estimate; the actual cost shows as unconfirmed until the provider's bill is matched to this run.") · primary "Start · estimate $1.38" (the button names the estimate, never a cap) + ghost "Cancel". Never word the amount as a maximum ("up to", "at most", "capped at") unless the server enforces that exact amount for this run. Over a limit: no primary; a danger notice says which limit and links to Costs.

### J21. Setup steps

H2 join steps as a side nav for multi-step setup: `<ol>` in a card, ember mono number, title, one-line status, a tag ("Done" ok, "Now" neutral). Current step `aria-current="step"`. Steps can be revisited; a later step never unlocks by skipping an approval.

### J22. Recipe preview frame

An output square at a fixed display scale shared by every frame in the view (so a 320 frame looks half the size of a 640 one): `bg.well`, padding drawn as a 135° hatch of `bg.overlay` / `bg.raised`, the derived image, J4 boxes without tabs, and flagged targets as a 3 px `label.rejected` box. Caption: recipe name · output size · picture size · padding · scale, then flag tags with a sentence ("2 below 4 px · Both price tags become 7 × 3 px. This image is excluded from the 320 dataset unless you recrop."). `role="img"` with the geometry in words.
