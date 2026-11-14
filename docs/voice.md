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

## 7. Tool surfaces (workbench)

Tool screens (labelloop first) keep the mechanics in §2: sentence case, verbs first, digits, the middle dot, no exclamation marks, errors that say what to do. They swap the community voice for a colleague's: plain, exact, and honest about what a machine did.

1. **Say who did it.** A person by name ("Mora"), a model by its role and version ("the detector, yolo26n · r0007", "LLM review"). Never the passive voice for a decision ("was approved").
2. **Machines propose; people review.** Only a person "reviews", "accepts" or "adjudicates". A model "proposes", "suggests" or "auto-accepts under policy P-2". Never "verified", "approved" or "confirmed" for model output.
3. **Model text is quoted, never adopted.** Show a model's reason in a quote with "Model's reason · not checked by a person". Don't paraphrase it into our voice.
4. **Numbers with their basis.** "mAP50-95 0.634 on test set t-2 (1,114 frames)", "Estimate $1.38 · about 2 h at $0.69/h". An estimate always says "estimate"; a finite test never becomes "perfect".
5. **Money is exact.** "$1.38", two decimals, currency first; the button names the estimate ("Start · estimate $1.38"). Never call an estimate a cap: "up to", "at most" and "capped at" are only for an amount the server enforces.

| Use | Not |
|---|---|
| label (a box and its class) · box · object | annotation (in UI copy), bbox, instance |
| class | category, tag, label (for the class itself) |
| Proposed | pending, suggested label, prediction (as a state) |
| Auto-accepted | verified, approved, trusted |
| Reviewed · Adjudicated | confirmed, validated, QA'd |
| Uncertain | unknown (as a state), flagged |
| the detector · LLM review | the AI, the bot, the reviewer (for a model) |
| release (a frozen dataset) | version, snapshot, export |
| recipe | preset, transform, config |
| run | job, experiment (in UI copy) |
| current model · candidate | incumbent, champion, challenger (in UI copy; fine in docs) |
| Promote · Roll back | deploy, revert |
| key fingerprint | key, secret (when showing one) |
| Spend without asking | autonomous spend (in UI copy) |


## 8. Drive

Drive uses the tool voice (§7): plain, exact, and honest about what can and can't be undone.

1. **Say what happens to the bytes.** "Rename" and "Move" are instant; say nothing about time. "Delete" is permanent: say "for good" and "There's no bin" every time.
2. **Exact sizes, plain units.** "5.4 GB", with the full byte count in details ("5,368,709,120 bytes"). Never "large file" in place of a size.
3. **Name the person and the place.** "Shared with Sam", "Moved to Taxes", "Mora invited you".
4. **Never reveal what isn't yours.** A missing item and an item you can't see get the same words ("This folder isn't here"). A used, expired and unknown link get the same words.

| Use | Not |
|---|---|
| My Drive · Shared with me | Home, root, inbox |
| file · folder | document, item (in UI copy; "items" is fine in counts) |
| upload · download | import, export, sync |
| share · people with access · can view | permissions, ACL, collaborator, viewer role |
| remove (someone's access) | unshare, revoke (for a share) |
| invite · invite link · sign-in link | registration, magic link, token |
| revoke access · restore access (for a person, owner only) | ban, suspend, disable account |
| passkey | WebAuthn, credential, security key (unless it is one) |
| delete permanently · for good | purge, destroy, erase |
| keep both · replace · skip | overwrite, merge (for files) |
