# Changelog

Release notes for each tag are also on the GitHub release. Versions follow semver as AGENTS.md §5 sets out: a changed token value is a minor bump; a removed or renamed token is a major bump.

## v1.0.3

**Docs patch: event-detail states for a product with the site's RSVP only.** components.md C5 gains a projection rule: a product that has only the site's RSVP renders each seat-card state minus every element that claims something it doesn't do (no seat number, no Pull me in, no bot note, no reserve states), with no invented substitute. The projected open, saved, starting and live states are spelled out.

- C5 adds three rows: **live, no room count** ("You're in.", `live` tag, no buttons without Pull me in), **ended, no Echo** (C10's no-Echo line, then "Next one" as a link, not "I'm in") and **bot unreachable** (state and buttons unchanged, an A14 warn notice in the note slot, bot-derived claims dropped). The cancelled row omits the reason line, the next-date line and "See the next date" when there is no stored reason or next instance.
- B4 has a visibility rule: the bar renders only when the seat card has a button, so not for live without Pull me in, ended or cancelled. Its height is in `scroll-padding-bottom`, and its existing-RSVP and bot-unreachable lines are given.
- C4's `live` tag note covers a failed bot read: no room count, and a bot-derived `live` tag renders as `warn` "Stale".
- templates.md T4: B4 follows the visibility rule; Must render adds the C5 projection, the no-Echo ended state and bot unreachable, and says cancelled uses this template whatever the HTTP status.

**Migration:** none. No token changes; `dist/` is unchanged. Full-bot states are unchanged.

## v1.0.2

**Docs patch: C4 server HTML is always dated.** components.md C4 no longer lets server or no-JS HTML show a countdown, the "Live" numeral or a room count: a page that is already open is never fetched again, so those claims could sit on screen long after they stopped being true. Every server render of a claim-bearing state (upcoming ≤ 24 h, starting, live) uses the dated form ("Europe/London · 21:00 UTC · as of 18:50 · Refresh"), with the same-origin Refresh link (an unsafe path renders no link and keeps the "as of"). Upcoming > 24 h, ended and cancelled are unchanged, with no "as of" and no Refresh. The former "stale (JS only)" rows are now "dated (server/no-JS, and JS when stale)"; there is no new wording. A live snapshot with no usable `asOf` gets the dated row "Live status unavailable · Refresh", which the island never upgrades. An upcoming or starting snapshot with no usable `asOf` drops its countdown and renders the absolute row, with no "as of" and no Refresh, and a page with no usable `asOf` is not shared-cached (`private, no-cache`).

- The page's island may upgrade the dated form to the fresh form once at hydration, only after its freshness check, instantly and unannounced. If Refresh has focus, the swap waits until focus leaves the block and rechecks freshness first. Otherwise the client still never adds or recomputes a claim.
- For a guest, the island localizes the absolute times into the browser zone whether or not the snapshot is fresh; localizing adds no claim.
- Every cache-lifetime directive is unchanged. The paragraph now says what it is for: making Refresh reach a new snapshot.
- A page's `live` tag rendered from the same snapshot follows the same rule.
- AGENTS.md §3 and the §4 checklist say the same.

**Migration:** none. No token changes; `dist/` is unchanged. A C4 that rendered the countdown or "Live" in server HTML now renders the dated row there and shows the fresh row from the island.

## v1.0.1

**Docs patch: the Echo tag has its own fill.** components.md A4 `echo` now sets the label in `state.echo` on an opaque `state.echo-bg` fill, with the `state.echo` outline at 50%. The fill keeps the label at 4.52:1 (the existing tokens §1.8 pair) on any ground. The A4 table gains a Fill column; every other tag has none. The placement rule (grounds 0–2, never `bg.overlay`, tokens §1.5) is unchanged.

The mockup CSS (`.tag.ech`) matches, and the profile and events full-page PNGs are re-rendered; only the Echo tags change. docs/README now says to render with full Chromium, not Playwright's headless shell, whose text metrics differ from the committed PNGs.

**Migration:** none. No token changes; `dist/` is unchanged. two-web-next already implements the fill.

## v1.0.0

**Breaking: the workbench is no longer part of this kit.** The kit is the design of the TWO product (two-web-next and two-bot-next) only. The workbench tool-surface design added in v0.3.0 belongs to labelloop and now lives in its own repo: [TogetherWeOwn/labelloop `docs/design/`](https://github.com/TogetherWeOwn/labelloop/tree/main/docs/design).

Removed:

- components.md §J (J1–J22);
- templates.md layout patterns P6 and P7 and the tool-surface rules;
- voice.md §7 (tool surfaces);
- accessibility.md §4's box-handle target exception: the 36 px house minimum now has no exceptions;
- tokens `color.machine`, `color.well`, `color.bg.well`, `color.label.*`, `box.dash.*`, `size.target-handle`, `size.box.*`, `size.crop.tile`, `size.toolbar`, `layout.inspector` and `layout.queue`, with their contrast pairs.

**Migration:** none for two-web-next or two-bot-next; neither uses a removed token. `dist/` is byte-identical to v0.2.3. Anything that used a removed token takes it from labelloop `docs/design/` instead.
