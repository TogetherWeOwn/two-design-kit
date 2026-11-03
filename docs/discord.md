# Discord embeds and bot surfaces

The bot is half of Ember Hours. Whatever the bot posts in Discord must read as the same product as the site: the same colours mean the same things, the same words name the same features, and the same records produce the same lines. This page is the spec two-bot-next builds to; colours and limits come from `tokens/discord.tokens.json` and land in Rust as `dist/rust/brand_tokens.rs`.

## 1. Mapping to two-bot-next

| Kit | Rust (generated) | Replaces in `crates/discord/src/brand.rs` |
|---|---|---|
| `discord.embed.default` `#FF9C36` | `BRAND_DISCORD_EMBED_DEFAULT: u32 = 0xFF9C36` | `BRAND_EMBED_COLOR = 0xFF0E52` |
| `discord.embed.live` `#FF5C7E` | `BRAND_DISCORD_EMBED_LIVE` | — |
| `discord.embed.echo` `#9D6AFF` | `BRAND_DISCORD_EMBED_ECHO` | — |
| `discord.embed.ok` `#5FD39A` | `BRAND_DISCORD_EMBED_OK` | — |
| `discord.embed.warn` `#F2C14E` | `BRAND_DISCORD_EMBED_WARN` | — |
| `discord.embed.danger` `#FF7A6B` | `BRAND_DISCORD_EMBED_DANGER` | — |
| `discord.embed.neutral` `#85766B` | `BRAND_DISCORD_EMBED_NEUTRAL` | — |
| `discord.limit.*` | not emitted to Rust (numbers); `twoDiscordLimit*` in TS | keep the bot's own limit checks, using these values |

`BRAND_ICON_URL` and `BRAND_FOOTER_TEXT` stay in `brand.rs` (they are assets and copy, not tokens). `brand_embed()` becomes `brand_embed(kind: EmbedKind, embed)`, where `EmbedKind` is one of the seven colours above; the default kind is `Default`.

**Why the default moves from pink to ember:** on the site pink means *live* and nothing else. If every bot embed is pink, "live" stops meaning anything in Discord, and members learn two colour languages. Ember is the logo's top stop and the site's action colour, so the brand stays; pink moves to the one job it has on the site. The Icon 1 avatar and footer icon do not change.

All seven colours are at least 3:1 against Discord's dark embed surface (`#2B2D31`), checked in `tokens/contrast.json`. The colour bar is decorative: every embed also says its state in words.

## 2. Embed anatomy (every bot embed)

| Part | Rule |
|---|---|
| **Colour** | One of the seven kinds, by meaning (§3). Never a per-game or per-host colour. |
| **Author** | Not used, except for site-originated actions: author name = the member's display name, icon = their Discord avatar ("Mora, from the site"). Guests never trigger embeds. |
| **Title** | The event or the outcome, ≤ 80 characters, sentence case, no emoji, no trailing full stop. Links to the site page (`url`) when there is one. No timestamps or mentions (Discord doesn't render them in titles). |
| **Description** | 1–3 short lines in the site's voice ([voice.md](voice.md)). The first line is the sentence a member needs; times use Discord timestamps (§2.1). |
| **Fields** | At most 6, from the field patterns in §2.2. Inline fields in groups of 2 or 3. |
| **Footer** | Icon 1 + "Together We Own · <surface>" ("Together We Own · Events", "· Echo", "· Bot log"). |
| **Timestamp** | The record's own time (when the action happened), so Discord shows it in each reader's zone. |
| **Image / thumbnail** | None, except an event's featured art when a host set one (`image`, never text-on-art). |
| **Buttons** | Per §6. At most one row of up to 3 buttons in normal posts. |

### 2.1 Times

Always Discord timestamps, so each reader sees their own zone, matching the site's "your time first" rule: `<t:UNIX:F>` for the full time ("Friday 7 November 2026 21:00"), `<t:UNIX:R>` for relative ("in 2 hours"), `<t:UNIX:t>` for a short time in log lines. Add the UTC anchor in text on event posts: "21:00 UTC".

### 2.2 Field patterns

| Field name | Value pattern | Inline | Used in |
|---|---|---|---|
| When | `<t:UNIX:F>` · `<t:UNIX:R>` + newline + "21:00 UTC" | yes | event, reminder, change |
| Room | "Raid 1 voice" (a channel mention `<#id>` when it exists) | yes | event, room open |
| Host | display name (mention only in the event's own thread) | yes | event |
| Seats | "17 of 24 in · 7 left · 3 on reserve" | yes | event, seat |
| Game | "Deep Rock Galactic" | yes | event |
| Repeats | "Fridays, until 19 Dec" | yes | recurring event |
| Came | "18 of 21" | yes | Echo |
| Stayed | "16 to the end" | yes | Echo |
| First-timers | "3" | yes | Echo |
| Your seat | "Seat 7" | yes | ephemeral seat replies only |

Field names are sentence case and ≤ 3 words; values follow the site's number and time rules. Never a field whose value is "N/A": leave it out.

## 3. Which colour, when

| Kind | When | Examples |
|---|---|---|
| default (ember) | The community speaking: events posted, help, announcements, rank changes | "Raid Night: Deep Rock Galactic" event post; "/help" |
| live (rose) | Something is happening now | "Raid Night is live"; "The Raid 1 room is open" |
| echo (violet) | Frozen attendance | "Echo · Raid Night" |
| ok (green) | A member's own action succeeded | "You're in. Seat 7."; "A seat opened. You're in."; "Moved you to Squad 1" |
| warn (amber) | A change or degraded state | "Raid Night moved to 21:30"; "You're on reserve, 2nd in line"; "The bot is catching up" |
| danger (coral) | Cancelled or failed | "Raid Night is cancelled"; "The bot couldn't move you" |
| neutral | Moderator-only and diagnostics | admin replies, health notices |

## 4. The bot-log line format (Discord channel and site, one grammar)

The bot's log is one stream of records rendered in two places: the site's "The bot's log" (D5 in [components.md](components.md)) and an optional Discord channel (`/logging` sets it). Both render each record with the same template, so a line reads the same in both.

**Discord line format** (plain message, no embed; one record per line; batched into one message per minute when busy):

```
<t:UNIX:t> · <mark> <sentence>
```

- `<mark>`: `🟧` for a bot action, `◯` for a site action. These two glyphs are the only emoji the bot uses, and only in log lines. (They stand in for the gradient square and the ember ring on the site.)
- `<sentence>`: the template below, past tense, ending with a full stop. Names in bold (`**Kestrel**`); event names as a masked link to the site page.

**Templates** (member view; the guest and opted-out substitutions are in the last column). Record kinds are the action names used across this kit; the bot↔site contract v2 is the authority for their final names and payloads, and this table is renamed to match it if they differ.

| Record kind | Template | Public substitution |
|---|---|---|
| `role.assign` (rank up) | "Promoted **{member}** to {rank}: {reason}." | "a member" |
| `role.assign` (first rank) | "Gave **{member}** the Prospect rank after they joined from this site." | "a new member" |
| `announcement.post` / `event.upsert` (new) | "Opened sign-ups for **{event}** and posted it in #events." | — |
| `event.upsert` (time change) | "Moved **{event}** to {time}. Everyone who's in was pinged." | — |
| `event.cancel` | "Cancelled **{event}** for {host}: {reason}." | host stays: hosts and moderators are named in their role (voice.md §5), unless they opted out ("a host") |
| `rsvp.site` → `seat.saved` | "**{member}** said they're in for **{event}**, from the site. The bot saved a seat." | "A member said they're in…" |
| `reserve.promoted` | "Gave **{member}** a seat in **{event}** from the reserve." | "a member" |
| `reminder.sent` | "Pinged the {n} who are in for **{event}**." | — |
| `room.opened` | "Opened the {room} room for **{event}**." | — |
| `voice.move` | "Moved **{member}** into {room}, from the site." | "a member" |
| `attendance.started` | "Started counting who's in the {room} room for **{event}**." | — |
| `echo.frozen` | "Froze the Echo for **{event}**: {came} were there." | — |

**Privacy rules (hard):** guests and opted-out members get the substitution; the Discord log channel is members-only, but opted-out members are still "a member" there. **Moderation actions are never log lines** (bans, kicks, timeouts, warnings, role removals, deletions); they stay in the admin activity log.

## 5. Echo and Lifeline messages

Each Lifeline step (site component C7) that touches Discord posts in one place only, so the event never spams a channel.

| Lifeline step | Discord surface | Embed kind | Title | Description | Fields | Buttons |
|---|---|---|---|---|---|---|
| 1 Opened sign-ups | #events channel post (plus the Discord scheduled event) | default | "{event}" (e.g. "Raid Night: Deep Rock Galactic") | First line of the host's description; "Say you're in here or on the site. The bot saves your seat and pings you 30 minutes before." | When, Room, Host, Seats, Repeats | **I'm in** (primary) · Details (link) |
| 2 You're in (site or button) | ephemeral reply to the member (button) or DM when from the site | ok | "You're in. Seat 7." | "The bot pings you at <t:UNIX:t>. Can't make it? Drop out and the first reserve gets your seat." | When, Room | I can't make it (secondary) · Discord event (link: the member marks themselves Interested; the bot can't do it for them) |
| 3 Reminder (T−30) | DM to each member who's in | default | "{event} starts soon" | "Starts <t:UNIX:R>. You're in, seat 7. The room opens at <t:UNIX:t>." | Room | I can't make it (secondary) · Details (link) |
| 4 Room open (T−15) | the event's thread | live | "The {room} room is open" | "Pull me in is on, here and on the site: the bot moves you in if you're in any of our voice rooms." | Seats | **Pull me in** (primary; the bot moves the member who pressed it, self-only) · Open the room (link) |
| 5 Counting / reserves | DM to the promoted member only (nothing in the thread) | ok | "A seat opened. You're in." | "You were 1st on the reserve for {event}. Seat 19 is yours." | When, Room | Open the room (link) |
| 6 Echo frozen | the event's thread, then edited into the #events post | echo | "Echo · {event}" | "18 of 21 came · 16 stayed to the end · 3 first-timers." | Came, Stayed, First-timers (inline) | See the Echo (link) |
| Cancelled | #events post edited + DM to everyone who was in | danger | "{event} is cancelled" | "{host}: {reason}. Your seat is released. Next one: <t:UNIX:F>." | When (next) | See the next date (link) |
| Time changed | #events post edited + DM | warn | "{event} has a new time" | "Now <t:UNIX:F>. You're still in. The reminder moved with it." | When | I can't make it (secondary) |

**Echo message rules:** numbers are frozen and never edited after posting (edits only add the "See the Echo" link); no names of who didn't come; first-timers are counted, not named, outside the event thread.

## 6. Buttons

Discord button styles can't take our colours, so meaning comes from style + label:

| Discord style | Use | Site equivalent |
|---|---|---|
| Primary (blurple) | The one main action in a message: "I'm in", "Join reserve", "Pull me in" (a bot interaction, self-only, rate-limited, logged) | primary pill |
| Secondary (grey) | "I can't make it", "Leave the reserve" | ghost pill / link button |
| Success (green) | Not used (state goes in the embed colour, not the button) | — |
| Danger (red) | Host-only destructive actions: "Cancel event" (with a confirm step) | danger ghost |
| Link | Anything that opens the site or a channel: "Details", "See the Echo", "Add to calendar", "Open the room" | link |

- Labels are the site's labels, verb first, ≤ 24 characters, no emoji.
- At most 3 buttons per message, one primary.
- After a member presses one, the reply is ephemeral and the original button stays as it was (never "disabled for everyone").
- A button that can't work yet is a disabled Secondary with the reason in its label ("Opens 20:45").

## 7. Slash command and reply surfaces

- Ephemeral replies use the same embed anatomy, colour by outcome (ok / warn / danger), no footer icon (Discord hides it in small ephemeral views; keep the text footer).
- Error replies say what happened and what to do, like the site: "The bot couldn't move you: you're not in voice. Open Squad 1 in Discord instead."
- `/help` stays default (ember), title "Together We Own help", fields per command group.

## 8. Checklist for a bot surface PR

- [ ] Colour comes from `brand_tokens.rs` via `EmbedKind`, never a literal.
- [ ] The embed reads correctly with the colour bar hidden (state in words).
- [ ] Times are Discord timestamps; event posts carry the UTC anchor.
- [ ] Copy matches the site's words (voice.md §3) and the site template for the same record.
- [ ] Guest/opted-out substitution applied; no moderation line in any public log.
- [ ] ≤ 6 fields, ≤ 3 buttons, one primary, title ≤ 80 characters.
- [ ] Staging screenshot of the embed in Discord's dark theme attached for design QA (UX Designer).
