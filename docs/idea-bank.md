# Idea bank

Ideas from the other design runs that are **not in the Ember Hours build**. They are kept here so nothing is lost; **none of them is for building now.** To build one, a card goes through the Product Lead, and the UX Designer updates the kit first (tokens, component spec, templates) so the build matches Ember Hours.

**Sources**
- **LL**: Living Lobby, the custom design from the first design run (its concept was concept C of that run). Retired as a plan by the owner on 2026-11-03.
- **MIX**: the recommended mix from the side-by-side design comparison: Living Lobby's plan, readability and join queue as the base, plus Ember's real logo, Lifeline and room avatars.
- **A1 / B1**: concepts A "One Screen, One Invite" and B "Match Centre" from the first visual-direction run.
- **A2 / B2**: concepts A "The Gate" and B "Match Centre" from the second (blind re-run) visual-direction run, whose concept C became Ember Hours.

**Cost:** S < 1 day, M 1–3 days, L > 3 days, for design plus build, web side only unless the bot is named.

## 1. Entries

| ID | Idea | Source | What it is | How it would adapt into Ember Hours | Cost | Depends on |
|---|---|---|---|---|---|---|
| IB-01 | Records ground (cream) | LL §3.1 | A second, cream ground used only for what the bot recorded (Echoes, history), so past events read as "the record" at a glance. | Not as a page ground (Ember is dark-only). As a **cream Echo card** for share images and print: `color.record.*` tokens (cream `#F7F2E9`, ink `#17130F`), used by OG images of Echoes. | M | Light token set and contrast pairs; OG image route |
| IB-02 | Standing, explained | LL §2.3 | Every rank states its rule in counts ("the bot counts 5 events for this step"), and a member sees their exact next step pointing at a real slot ("Sunday needs a welcomer: put me down"). | Extend **Where you stand** (E6) and the profile **rank line** (G2) with the rule line and a "next step" row linking a real event slot. | M | Rank thresholds as reviewed config; host/welcomer "needs" on events; Echo counts |
| IB-03 | Welcomed and hosted as ladder metrics | LL F29, §4.4 | A season board switchable between events played, welcomes and hosted. | A third segment on the ladder toolbar ("Came · Welcomed · Hosted"); "Hosting counts double" stays the default rule. | M | Echo records a welcomer role per first-timer |
| IB-04 | Proof-of-life floor | LL §2.4, A1 | Live counts show only above a floor, so a quiet Tuesday never looks like an empty server. | Ember already switches the Live Sentence to "It's quiet" below 3. Extend the floor to the header presence count (show "quiet right now" instead of "2 in voice"). The **join card** tiles already apply it (H4). | S | none |
| IB-05 | Moderator join queue | LL F3, MIX | New joins wait for a moderator ("a moderator confirms new joins, usually within a day; the bot will DM you"). | A **pending** state on the join card (H4) and a Lifeline-style "what happens next" for the applicant; the admin join-attempts queue already exists. | M | Owner decision to gate membership (Ember assumes open join) |
| IB-06 | Held seat offer | LL F16 | When a seat frees up, the bot offers it to the next reserve and holds it 2 h, with accept / decline on the site and in Discord. | A **seat offer** state on the seat card ("A seat is yours if you want it, until 19:12") plus a Discord DM with two buttons; Ember today promotes automatically at T+10. | M | Bot DM buttons; offer expiry job |
| IB-07 | Host headline on an Echo | LL §2.2 | Hosts can give an Echo a headline ("The night the lobby filled twice"); counts stay bot-owned. | An optional serif headline above the key facts (C10); edit by the host for 48 h after the event; counts never editable. | S–M | Echo table column; host permission check |
| IB-08 | Pull me in with a friend | LL §2.1, §4.5 | On a profile showing "in the Lobby now", "Pull me in with Sam" moves you into the room Sam is in, behind a consent toggle ("let members pull in with me"). | A live line in the profile identity block (G1) plus a new Privacy toggle (G8); off by default. | M | `voice.snapshot` with member→room (members only); Pull me in (`voice.move`) |
| IB-09 | Bot status chip with a sync pulse | LL §3.4, §4.1 | A header chip "bot online · synced 9 s ago", the one element allowed to pulse while a sync is in flight. | A header status chip next to the presence count; Ember allows **no** pulse, so the in-flight state is a static ring that swaps to a dot (no animation). | S | Live island; bot health endpoint |
| IB-10 | Comfortable reading | LL §3.2, MIX | Living Lobby set body at 17 px everywhere with Atkinson Hyperlegible, for readability; the comparison called Ember's 16 px UI text harder for some readers. | A member preference **"Comfortable text"**: body 17 px, line height 1.6, rows grow; implemented as a token mode (`[data-text="comfortable"]`) without a second font. | S–M | Token modes in the kit build; profile setting |
| IB-11 | Calm density (the recommended mix) | MIX | Keep Living Lobby's calmer, roomier pages as the base and take only Ember's logo, Lifeline and room avatars. | Not a mix now (owner decision). Kept as a **"Calm" density mode** for home and profile: fewer modules per band, the Now Line collapsed behind "See the week", bigger section gaps. | M | IB-10 token modes; usage data showing members want it |
| IB-12 | Around now group on Members | LL §4.5 | A group at the top of the members directory: who's in voice now (signed-in viewers only). | A "In voice now" group above the member rows (F2), using the voice panel's data. | S | `voice.snapshot` names (members only) |
| IB-13 | Year in the lobby | LL F40 | A yearly retrospective page generated from Echoes, each line linking its Echo. | A `/year/2026` page: one band per month, key facts per month, links to Echoes; serif month names. | S–M | Echoes for a full year |
| IB-14 | Milestone wall | LL F41 | A small, finite set of milestones tied to ladder steps, with earned dates from Echoes. | A profile block under the record and a community wall on About; milestones as rank-glyph variants. | M | Milestone config; Echo counts |
| IB-15 | Tournament brackets and standings | LL F31, F33 | Server-rendered bracket list/tree for tournament nights, byes hidden, ties shown as ties. | A tournament variant of event detail: the Lifeline gains round steps; a bracket list in the main column; the Echo gets a placement line. | L | Bracket data model; host tools |
| IB-16 | Per-game hubs | LL F44 | Pages per game when several games run with separate hosts. | `/games/<game>`: page header + events filtered + guides for that game + ladder filtered. | M | Game taxonomy; enough events per game |
| IB-17 | Screenshots in Echoes | LL §3.6 | Members share screenshots inside an Echo, with required alt text and no text over them. | An Echo gallery row under key facts; alt text required to post; art in the frame, words on the surface. | M–L | Storage, moderation, image policy |
| IB-18 | Interim ladder label | LL §4.4 | Until the bot counts attendance, the board is labelled "by events signed up (going)", and switches to "events played" only when Echoes exist. | A copy rule for the ladder page header (E1) during the transition. Worth adopting if the ladder ships before Echo readers. | S | none |
| IB-19 | Editorial Echo archive | LL §4.2 | Past events as an archive table: serif names, bot facts per row, "sign-up record" for pre-Echo events. | A table view toggle on the Past segment of the events list. | S–M | Echo readers |
| IB-20 | On my way ping | LL (first-run concept C) | Instead of a move, a signed-in member taps once and the bot tells the room they're coming. | A secondary action next to Pull me in in room rows: "Tell them I'm coming" → a bot line in the room's text chat. | S–M | Bot room-chat post; rate limit |
| IB-21 | Echo extra facts | LL §2.2, B1 | Peak voice, rooms filled, promotions earned, first-timers and who hosted them. | Optional fourth and fifth key facts (C10) and Echo embed fields ("Peak voice 22", "2 promoted tonight"). | S | `voice.snapshot` history; Echo fields |
| IB-22 | Bot box score | B1 (first run) | A scoreboard-style recap per event with mirrored comparison bars (signed up vs came, this week vs last). | A "Box score" detail view behind "See the Echo" for competitive nights: two mirrored bars per fact, tabular mono. | M | Echo history per recurring event |
| IB-23 | Signed up vs showed up scoreboard | B2 (second run) | The "last event" widget as the bot's frozen attendance: signed up against showed up. | Same home as IB-22; merge them. | — | see IB-22 |
| IB-24 | One-screen invite landing | A1 (first run) | A single-viewport landing: crest, kicker, wordmark, one line, Join, live strip, community links. | A `/play` campaign landing for recruiting posts: the Live Sentence (guest grammar), the join action, three live tiles, nothing else; Ember type and tokens. | S–M | none |
| IB-25 | Live Door | A2 (second run) | The join button carries the live state ("Join 14 in voice"); four live tiles (rooms, tonight's event, the ladder, the newest member); the same screen answers after sign-in. | Ember's join card already answers in place. Net new: the count in the button label (only above the IB-04 floor) and a **newest member** tile. The join page is cached (H4 cached page rule), so a live voice count needs a per-request join page first. | M | IB-04; per-request join page |
| IB-26 | Search hint (Ctrl K) | B2 (second run) | A command-style search over members and events with a keyboard hint. | A header search button that opens a dialog searching events and members; the hint shows only to pointer + keyboard users. | M | Search endpoint; dialog component spec |
| IB-27 | Accent-bar widget cards | B1, B2 | Dashboard cards with a 5–6 px accent bar on each header (B2 used the brand gradient). | Only for **admin** density (T9), with a neutral bar. The brand gradient stays in its three places, so a gradient bar needs a kit rule change first. | S | A rule change if gradient |
| IB-28 | Condensed display faces | A1 (Rajdhani), A2 (Chakra Petch), B1/B2 (Barlow Condensed, Saira) | Esports-genre condensed or chamfered display type. | Not for the site (Mona Sans's width axis covers narrow display at `wdth` 75–90). Possible for event key art only, never UI. | S | none |
| IB-29 | Violet Pull me in chips | B2 (second run) | Violet brand fill with white text for Pull me in and chips. | Not adopted: violet means Echo in Ember. Kept for the record. | — | — |
| IB-30 | Mirrored stat bars and 4-up stat tiles | B1 (first run) | Esports stat language: mirrored bars, 4-up tiles, scoreboard block. | Profile stat tiles (G5) already cover the tile idea; mirrored bars live in IB-22. | — | see IB-22 |
| IB-31 | Light theme | kit v0.1.0 idea bank | A light colour set for daytime use. | The token files keep the `--theme-*` override hooks, so a light role set can be added without touching components. Needs its own contrast pass over every pair in `tokens/contrast.json` first. | M | Contrast pass; owner wants it |

## 2. Coverage: every Living Lobby feature (F1–F48) and pioneer

So nothing falls through: each Living Lobby row is either in the Ember Hours build (with its kit component), an idea-bank entry, or dropped by both designs.

| LL | Feature | Where it went |
|---|---|---|
| F1 | Public landing: who runs it, how to join | Ember: T1 guest home, H6 highlights, F3 Who runs this |
| F2 | Join gated by Discord sign-in | Ember: T8 join, H4 |
| F3 | Admin-approved join queue | **IB-05** |
| F4 | Requirements + what happens next | Ember: H2 join steps |
| F5 | Layered rules | Ember: H3 norms + rules page |
| F6 | Named leadership | Ember: F3 Who runs this |
| F7 | FAQ + delete my data | Ember: G8 Privacy panel, footer FAQ |
| F8 | Event list with status | Ember: T3, C1 |
| F9 | Featured / upcoming / past on home | Ember: Live Sentence names the featured event; T2 |
| F10 | Search + filters, URL-shareable | Ember: A9, A10 |
| F11 | Recurring events with instance switching | Ember: C9, facts "Repeats" |
| F12 | Event detail sections, discussion = Discord thread | Ember: T4, C6 "Talk" |
| F13 | Public / members-only flags | Ember: tags on C1 |
| F14 | Viewer-zone time with UTC anchor | Ember: C4, B6 |
| F15 | Add to calendar / ICS | Ember: seat card, Subscribe |
| F16 | Seats, waitlist, auto-promotion | Ember: C5 (reserve, promoted); held offer is **IB-06** |
| F17 | Seat counters + attendee list | Ember: A8 seat strip, C8 |
| F18 | Multi-step registration with passes | Dropped by both (commerce shape) |
| F19 | Check-in + lifecycle timeline | Ember: C7 Lifeline |
| F20 | Attendance positive in public, no-shows private | Ember: rule (voice.md §5), I2 |
| F21 | Per-event chat | Dropped by both (Discord thread) |
| F22 | Inactivity report, no auto-removal | Ember: I2 |
| F23 | Roster, active by default | Ember: F2, T6 |
| F24 | Member search | Ember: A11, T6 |
| F25 | Newest members strip | Ember: F1 |
| F26 | Tags + role badges with text | Ember: A4, F2 |
| F27 | Profile + service record | Ember: G1–G5 |
| F28 | Placement history | Ember: Record entries ("2nd of 14") |
| F29 | Seasonal ladder | Ember: T5; extra metrics **IB-03** |
| F30 | Stats leaderboard with column filters | Dropped by both |
| F31 | Standings with ties | Ties in E2/E3; tournament standings **IB-15** |
| F32 | Live counters with freshness | Ember: A13, D1, D2; floor **IB-04** |
| F33 | Brackets | **IB-15** |
| F34 | Match pages, VODs, spoiler mode | Dropped by both |
| F35 | Rewards = standing | Ember: ranks; explained steps **IB-02** |
| F36 | Bot-written recognition posts | Ember: D5 bot's log |
| F37 | Comments on site | Dropped by both |
| F38 | Forums | Dropped by both |
| F39 | The site acts into Discord | Ember: Pull me in, Lifeline, reminders |
| F40 | Retrospective with proof links | **IB-13** |
| F41 | Milestone wall | **IB-14** |
| F42 | Curated scoreboards | Dropped by both |
| F43 | Photo gallery | **IB-17** |
| F44 | Per-game hubs | **IB-16** |
| F45 | Shareable recruiting blurb | Ember: share an invite (join, event detail) |
| F46 | Community directory | Dropped by both |
| F47 | Paid tiers, marketplace, betting | Dropped by both |
| F48 | Graceful sunset / redirect page | Ember: "moved or ended" page (T4) |
| §2.1 | Pull me in | Ember: D3; with a friend **IB-08** |
| §2.2 | Event Echoes (host headline, extra facts) | Ember: C10; **IB-07**, **IB-21** |
| §2.3 | Standing, explained | **IB-02** |
| §2.4 | Proof-of-life strip | Ember: D1, H4; floor **IB-04** |
| §3.1 | Two grounds (cream records) | **IB-01** |
| §3.2 | Atkinson 17 px body | **IB-10** |
| §3.4 | One sync pulse | **IB-09** (as a static state) |
| §4.4 | Interim "signed up" ladder label | **IB-18** |
| §4.5 | Around now; usually around (opt-in) | **IB-12**; usual hours opt-in is in Ember (G1, G8) |
