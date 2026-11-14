# Voice and copy

Ember Hours talks like a friend who runs the Friday game: warm, specific, short, and honest about what the bot knows. The site and the bot use the same voice and the same words.

## 1. Principles

1. **Specific beats general.** Name the night, the time, the room, the number. "Raid Night is at 21:00" beats "Events happen regularly".
2. **We, us, you.** The community is "we" and "us"; the reader is "you". Never "users", "players" (in UI copy), "the platform" or "our members" when you can say "we".
3. **Say what happens next.** Every action label and every state says what the bot or site will do. "Saying you're in tells the bot: it saves your seat and pings you 30 minutes before."
4. **Honest about data.** Estimates say "estimate". Stale data says when it was last seen. Small numbers are not dressed up: below 3 in voice we say "It's quiet".
5. **Show up, not sign up.** Attendance is what we celebrate. Never shame absence; never publish who didn't come.
6. **Plain English, short sentences.** Aim for under 20 words a sentence and one idea per sentence. UK spelling (colour, organise), 24-hour clock.
7. **Calm.** No exclamation marks in UI copy, no hype ("epic", "insane"), no urgency tricks ("Only 2 left!").

## 2. Mechanics

| Topic | Rule | Do | Don't |
|---|---|---|---|
| Case | Sentence case for everything, including headings, buttons and tags | "Add to calendar" | "Add To Calendar" |
| Buttons | Verb first, 1–4 words, says the outcome | "I'm in", "Pull me in", "Join reserve" | "Submit", "RSVP", "Click here" |
| Headings | A statement, often two-tone: the fact, then the gloss | "What's on. *Say you're in.*" | "Events Section" |
| Serif accent | One phrase per heading; the name or the feeling, not a verb | "Raid Night: *Deep Rock Galactic*" | Serif on a whole heading or a button |
| Times | Viewer-local first, 24-hour, zone on every time; UTC anchor on detail pages | "21:00, your time · 21:00 UTC" | "9pm", "21:00" with no zone on a detail page |
| Relative time | "in 2 h 10 m", "since 18:30", "4 m" (log), "last week" | "updated 20 s ago" | "a few moments ago" |
| Dates | "Fri 6 Nov" in rows, "Friday 6 November" in sentences; no year unless it isn't this year | "Sun 1 Nov" | "11/02/2026" |
| Numbers | Digits always ("3 first-timers"); counts with a noun; "17 of 24 in" for capacity | "17 of 24 in · 7 left" | "seventeen", "17/24" |
| Names | Discord display names only | "Lumen" | Real names, emails, user IDs |
| Ranks | Capitalised as names: Prospect, Member, Soldier, Veteran, Legend | "You're a Member now" | "member-level user" |
| Feature names | Lifeline, Echo, Echo trail, Now Line, Pull me in, the bot's log. Capitalised as here; "Pull me in" is a button label in quotes when mentioned in prose | "The Echo freezes when the event ends" | "attendance snapshot" |
| Discord | "Discord", "the server", "voice", "the room", "#events" | "the Raid 1 room" | "VC", "guild", "channel ID" |
| The bot | "the bot", lower case; it does things in the past tense in logs | "The bot saved seat 7" | "TWO-Bot has successfully reserved…" |
| Errors | What happened, then what to do, no blame | "That didn't save. Try again, or say you're in from Discord." | "Error 500", "You entered an invalid value" |
| Empty states | Honest sentence + one next step | "Nothing yet on Monday. Fancy hosting?" | "No data", "Oops!" |
| Contractions | Yes | "You're in", "didn't" | "You are registered" |
| Punctuation | Full stops in sentences, none in buttons, tags or single-line labels; middle dot `·` between facts | "Hosted by Vexa · 7 seats left" | "Hosted by Vexa - 7 seats left." |
| Emoji | None in site UI. In Discord, only where §5 of [discord.md](discord.md) allows | — | "🔥 Raid Night 🔥" |

## 3. Word list

| Use | Not |
|---|---|
| say you're in / you're in | RSVP, register, sign up for (as a verb in buttons) |
| I can't make it | cancel RSVP, withdraw |
| seat | slot, spot |
| reserve | waitlist (the system may say waitlist; the UI says reserve) |
| came / stayed | attended / retained |
| first-timer | new user, newbie |
| host | organiser, admin |
| moderator | admin (for people), staff |
| room | voice channel |
| Pull me in | Join voice, Connect |
| Join with Discord | Log in, Create account |
| Sign in | Log in |
| the bot's log | activity feed, audit log |
| Echo | recap, stats, results |
| estimate | approximate data |
| delete my data | GDPR request |

## 4. Do and don't by surface

**Live Sentence**
- Do: "14 of us are in voice right now. *Raid Night starts in 2 h 10 m, and 17 are going.*"
- Do: "It's quiet right now. *Friday evenings are busiest: Raid Night is at 21:00.*"
- Don't: "2 users online!" (small, impersonal, hype)
- Don't: "Welcome to Together We Own, the best gaming community" (claim, not proof)

**Seat card**
- Do: "You're in. Seat 7." / "The bot pings you at 20:30. If you drop out, the first reserve gets your seat and a ping."
- Don't: "RSVP confirmed ✔" / "You will receive a notification."

**Event rows**
- Do: "Hosted by Vexa · 7 seats left"
- Don't: "Click for more info about this event"

**Lifeline**
- Do: "You said you're in. The bot saved seat 7"
- Do: "Pings everyone who's in, 30 minutes before"
- Don't: "Reminder job scheduled (T-30)"

**The bot's log**
- Do: "Gave **Kestrel** the Prospect rank after they joined from this site"
- Do (guest): "Gave a new member the Prospect rank after they joined from this site"
- Don't: "role.assign executed for user 1029384756"
- Don't: anything about moderation ("Timed out Sam for spam")

**Echo**
- Do: "18 of 21 came · 16 stayed to the end · 3 first-timers"
- Don't: "3 no-shows" (never publish absence)

**Join**
- Do: "Discord asks you to say yes. We ask for your name, your avatar and permission to add you to our server. Nothing else."
- Don't: "By continuing you agree to share your data."

**Errors**
- Do: "The bot couldn't move you. Open Squad 1 in Discord instead."
- Don't: "Something went wrong."

**Empty**
- Do: "The board fills as events end. The next one is Raid Night tonight."
- Don't: "No entries found."

## 5. Privacy in copy

- Guests see counts, never names. Write "a member" or "a new member"; never "someone" (it reads as suspicious).
- Opted-out members are "a member" in every public list and log, including to other members.
- **Role exception:** hosts and moderators are named in their role (an event's "Hosted by Vexa", "Who runs this"), to guests too, because knowing who runs things is a trust signal. Only the role surface names them; their own activity (RSVPs, Echoes) follows the normal rules. A host who opted out is shown as "a host".
- Never print: email, Discord user ID, real name, age, gender, location (unless shared), attendance rate, missed events, moderation history.
- Explain each data gate in one line where it bites: "Names show once you join." · "Only signed-in members see names. Visitors see the counts."

## 6. Length budgets

| Element | Budget |
|---|---|
| Live Sentence | ≤ 120 characters |
| Page H1 | ≤ 48 characters |
| Lede | ≤ 2 sentences, ≤ 52 ch per line |
| Button | ≤ 4 words (≤ 24 characters; Discord buttons ≤ 80 by platform limit) |
| Tag | ≤ 3 words |
| Row secondary line | ≤ 3 facts |
| Notice | 1 sentence + 1 action |
| Discord embed title | ≤ 80 characters (house); description ≤ 3 short lines |
