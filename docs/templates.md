# Page templates and layout patterns

Each template gives the regions at **1280** (desktop) and the order at **390** (mobile), the components it uses ([components.md](components.md) ids) and the states it must render. Reference renders are in `mockups/png/` (`<page>-1280-full.png`, `<page>-390-full.png`).

## Layout patterns (use these; don't invent an eighth)

| Pattern | 1280 | 390 | Used by |
|---|---|---|---|
| **P1 Hero split** | `minmax(0,1fr)` + 400 px panel, 56 px gap, aligned to the end | one column; panel after the hero text | Home |
| **P2 Band stack** | full-width `section` bands, `space.section` padding, top hairline, band header (B8) | same, `space.section-compact` | Home, guest home |
| **P3 List page** | page header (B7) · sticky toolbar (B5) · list in the container | same; chips scroll sideways; end action drops below | Events, Ladder, Members |
| **P4 Content + rail** | `minmax(0,1fr)` + rail (`layout.rail.*`), 48–56 px gap; rail sticky at `layout.sticky-offset` | one column; the template says where the rail goes | Event detail, Ladder, Members, Profile, Join |
| **P5 Admin dense** | current admin layout, kit tokens, `size.row.admin` | tables scroll inside their own container, never the page | Admin |
| **P6 Workbench page** | J1 header · page header (H1 at `font-size.h3`, two-tone, no serif) · `minmax(0,1fr)` + rail (`layout.rail.default`) or two equal columns, 40 px gap, in the container | one column; the rail follows the main column unless it holds the page's decision | Tool screens (labelloop) |
| **P7 Review canvas** | J1 header · sticky tool row (`size.toolbar`) · `minmax(0,1fr)` stage + inspector (`layout.inspector`, 380). Full viewport height; stage and inspector scroll independently; the decision dock (J12) sticks to the inspector bottom | one column: stage, then inspector; drawing tools hidden with a note; the dock becomes a fixed bottom bar | Image review (labelloop) |

**Shared shell on every page:** skip link (A16) · header (B1) · `<main id="main">` · footer (B3). One top bar; event detail adds the mobile action bar (B4) at 390 and nothing else does.

**Tool screens (P6, P7)** use the workbench header (J1) in place of B1; B1 never appears on a tool screen. Shell: skip link (A16) · J1 · `<main id="main">` · on P6, a one-line source footer (licence offer + version, `text.tertiary`) in place of B3; P7 fills the viewport and has no footer (the offer moves to the account menu). One top bar; at 390 the review canvas adds the decision dock as its bottom bar (J12) and nothing else does.

---

## T1. Home, guest (logged-out landing) — `home-guest`

| 1280 | 390 |
|---|---|
| 1. **P1 hero:** freshness line · Live Sentence (guest grammar) · primary `lg` "Join with Discord" + "One tap. The bot adds you to the server, gives you your first rank and brings you back here." · trust row (mono numbers: members, came this month, founded) **\|** voice panel, anonymous (D2) | 1. hero text · full-width Join · trust row |
| 2. **What happens here:** band header + 4 highlights (H6) | 2. voice panel |
| 3. **This week, when we play:** Now Line (D4), guest | 3. What happens here (one column) |
| 4. **What's on. *Come along.*:** event rows (C1), guest actions | 4. Now Line (tonight + weekend) |
| 5. **Two boxes:** the bot's log, guest privacy (D5) + "Last Sunday. *The bot was counting.*" key facts (C10) | 5. What's on |
| 6. **Join band** (H5) | 6. the bot's log, then the Echo box |
| | 7. join band |

**Must render:** quiet (rule 5), nothing scheduled (rule 6), event live (rule 2), stale (rule 1), live counts failed to load.

## T2. Home, member — `home-member`

| 1280 | 390 |
|---|---|
| 1. **P1 hero:** Live Sentence (member grammar) · primary `lg` "Pull me into Squad 1" + explanation **\|** voice panel with Pull me in on each room | 1. hero text · full-width Pull me in |
| 2. **Your week, *and when we play.*:** Now Line with your RSVPs outlined | 2. voice panel |
| 3. **What's on. *Say you're in.*:** day-grouped event rows, member actions | 3. Now Line (tonight + weekend) |
| 4. **Two boxes:** the bot's log (names) + Where you stand (E6) | 4. What's on |
| 5. **Last Sunday, *you were one of 18.*:** key facts (C10) | 5. the bot's log, then Where you stand |
| | 6. Echo key facts |

**Must render:** everything in T1 plus: not in any event today (rule 4), in voice already (hero button becomes saved "You're in Squad 1"), Pull me in fallback.

## T3. Events list — `events`

**P3.** Page header: mono "1 live now · 9 this week" · H1 "What's on. *Say you're in.*" · lede. Sticky toolbar: segmented Upcoming / Mine / Past with counts · activity chips with counts · end: ghost "Subscribe" (calendar feed). Time-zone line (B6). Day groups (C2) of event rows (C1), with an inline empty state for gap days (C3). Last group "Just happened" with Echo rows. 88 px bottom padding.

**390:** toolbar = full-width segmented control, then one sideways-scrolling chip row; Subscribe moves to the page end. Rows use the 390 row layout.

**Must render:** filter with no results · no events at all · Discord events failed to load (rows still render from our database, plus a quiet line "Discord events didn't load. Events made on this site are all here.") · Mine with nothing ("You haven't said you're in for anything yet.") · Past (Echo rows only).

## T4. Event detail with Lifeline — `event-detail`

**P4** with a 380 px seat rail (`layout.rail.seat`), 56 px gap.

| 1280 main column | 1280 rail (sticky) |
|---|---|
| breadcrumb "Events / Raid Night" · tags (state, recurrence, visibility) · H1 "Raid Night: *Deep Rock Galactic*" · time block (C4) | seat card (C5) |
| Lifeline (C7) | facts list (C6) |
| About this one (17 px reading copy, max 62 ch) | |
| Who's in (C8) | |
| Last time: instance switcher (C9) + key facts (C10) in a box | |

**390 order (decision first):** breadcrumb · tags · H1 · time block · **seat card** · facts list · Lifeline · About · Who's in · Last time. The mobile action bar (B4) is fixed at the bottom with the seat state, Add to calendar and Pull me in; the page has matching bottom padding.

**Must render:** every seat-card state (C5 table), every Lifeline step state, guest (no names in Who's in), members-only event viewed by a guest (facts visible, people replaced by a join prompt), cancelled, ended (Echo replaces the seat card), "moved or ended" page for dead links.

## T5. Ladder — `ladder`

**P3 + P4** (340 px rail). Page header: mono "Season 4 · November · counted by the bot from Echoes" · H1 "The ladder. *Showing up is the score.*" · season bar (E1). Sticky toolbar: segmented Overall / Around you · game chips. Main: top three (E2) · ladder table (E3) · mono footer with the opt-out count. Rail: How it counts (E4) · Ranks, all time (E5) · opt-out link.

**390:** top three as compact rows · table with #, Member, Came · rail after the table.

**Must render:** day 1 · around you with gap rows · opted-out viewer · game filter with no data · stale ("updated 2 h ago" in `state.warn`).

## T6. Members — `members`

**P3 + P4** (320 px rail). Page header: mono counts · H1 "Who's here. *Say hi to the new ones.*". Joined this week strip (F1). Sticky toolbar: search (A11) · segmented Active / Everyone / Guides · end: Sort ("Recently active"). Main: member rows (F2). Rail: Who runs this (F3) · mono privacy rule.

**390:** newest strip scrolls sideways · search full width · rows stack · rail after the list.

**Must render:** guest view (F4, counts only) · search with no result · Guides filter · someone in voice now.

## T7. Profile — `profile`

**P4** (360 px rail). Identity block (G1) · rank line (G2). Main: Echo trail (G3) · Record (G4). Rail: stat tiles (G5) · You and <name> (G6) · Going next (G7) · privacy note.

**390 order:** identity · rank line · rail (tiles, together, going next) · trail (13 weeks) · record.

**Must render:** own profile (Edit + Privacy panel G8) · new member (no Echoes: empty state) · opted-out of ladder (no "You and", no rank position) · moderator viewing (adds a fenced "Moderators only" link to the admin attendance record, nothing else) · guest (profile pages require sign-in: show the sign-in gate with "Profiles are for members").

## T8. Join and sign-in — `join`

**P4** (420 px rail, card sticky). Main: identity line (H1) · H1 "Play with people *who show up.*" (`font-size.hero`) · lede (19 px, 46 ch) · steps (H2) · norms (H3). Rail: join card (H4).

**390 order:** identity · H1 · lede · **join card** · steps · norms.

**Must render:** every join-card state (H4 table). Sign-in uses the same page with the verb swapped ("Sign in with Discord", "Welcome back").

## T9. Admin density

**P5.** The current admin pages keep their structure; only tokens change. Queue-first order on the admin home: join attempts · event tools · featured · activity log · the two new reports (I2). Tables per I1. No Ember display type in admin beyond the page H1 at `font-size.h3`; no serif; no gradient; no ember surface except one primary action per page.

At 390 admin is usable but not optimised: tables scroll inside their own container with a visible scrollbar and a sticky first column.

---

## Responsive rules for any new page

1. Design 390 first: what does the member decide here? That block comes before any feed or description.
2. One layout switch at `breakpoint.compact-max` (820 px). If something needs a second breakpoint, the layout is wrong.
3. Rails move under the header block, unless the rail holds the page's decision (seat card, join card): then it moves directly after the H1 block.
4. Horizontal scrolling only inside a chip row, the newest strip or an admin table, never the page (check at 320 px).
5. Sticky things: the header, the list toolbar, one rail at 1280, the action bar at 390. Nothing else sticks.

## Tool surfaces (P6, P7)

Workbench screens follow T9's restraint: no serif accent, no gradient, H1 at `font-size.h3`, one ember surface per view. Product screen specs live in the product repo and cite this kit's component ids; for labelloop they are in `docs/design/` of TogetherWeOwn/labelloop. Rules that differ from site pages:

1. **The decision comes first at both widths.** On P7 that is the selected object's proposal and the decision dock; on P6 the page's one primary action sits in the page header.
2. **Tools are desktop-first, not desktop-only.** At 390 a tool screen keeps every decision a person can make by tapping (accept, keep, mark uncertain, change class) and hides only what needs a pointer and space (drawing, redrawing, split, merge), with a one-line note saying so.
3. **Independent scroll on P7 only.** The review canvas never scrolls away while the inspector scrolls. Every other tool page scrolls as a page.
4. **Sticky on tool screens:** the J1 header, the P7 tool row and the J12 dock. Nothing else.

