# Organic social templates

The design contract for the images and clip captions we post as ourselves on social platforms. Two templates, one variant each, two sizes each, plus a caption preset for 9:16 clips. The code lives in `social/`; this page is the spec. If the two disagree, `social/check.mjs` wins and this page has a bug.

Organic only. Paid creative, ad accounts, scheduling and posting are not in this kit (§10).

## 1. Job

| | |
|---|---|
| **Audience** | People who game and might like a friendly, regular group: friends-of-members who see a share, and people browsing a platform. Most see the card at phone size, for about a second, in a feed. |
| **Job** | Event announcement: "Is there something on I could join, and when?" Weekly recap: "Is this group actually active?" |
| **Primary action** | One per card, printed on the one ember pill and fixed by code (§4): *Say you're in* (an event link), *See what's on* (the events page) or *Join with Discord* (the invite). The real link is in the post text; the image prints the same link as a fallback. |
| **Proof, not claims** | The card shows facts the bot knows: the night, the time, and counts of 50 or more. No slogans, no superlatives, no testimonials. |

## 2. Content

- **Real content** is approved per post by a person (the human gate) after the rule checker passes (§6). The checker never approves anything.
- **Fixture content** (`"fixture": true`) prints a yellow *Fixture* tag and may use placeholder assets. Every file in `social/fixtures/` is fixture content: the events, counts and the `two.example` host are invented. Fixtures never leave this repo.
- **AI** may draft the title or captions only (`"source": "ai-draft"`); it never writes links, times, counts, the action label or the footer. Drafts set the disclosure flags (§6).

## 3. Visual system

The approved Ember Hours identity, nothing new: dark grounds, cream text, one ember action, the brand gradient on the logo only.

| Element | Tokens |
|---|---|
| Ground | `color.bg.canvas`; facts and highlights sit on a `color.bg.surface` card with a hairline and `radius.l` (one step up, docs/tokens.md §1.1) |
| Title | Two-tone (docs/tokens.md §2): the statement in Mona Sans SemiBold at the semi-expanded width (the static stand-in for 108%), `text.primary`; the accent phrase in Instrument Serif Italic at 1.1×, `text.accent`. `social.font-size.*.display` |
| Date and time | Mona Sans Medium, `social.font-size.*.figure`, `text.primary` |
| Labels, link, UTC anchor, counts | Fragment Mono, `social.font-size.*.label`, `text.tertiary` / `text.secondary`; uppercase only for tags and the recap's dates |
| Action | Pill, `color.accent.default`, `text.on-accent`, Mona Sans SemiBold `social.font-size.*.body`, height `social.size.action.*`. The only ember surface |
| Logo | `mockups/src/brand/icon-two-brand.svg` at `social.size.logo.*`, beside "Together We Own" |
| Tags | Mono, uppercase, `hairline-strong` outline, `radius.s`. *Fixture* uses `state.warn` on `state.warn-bg` |
| Footer | "Fan-run community · not affiliated with any game publisher", fixed text, `text.tertiary` |

Every colour pair used is already in `tokens/contrast.json`. Templates read `dist/ts/tokens.ts` constants (Satori has no CSS variables); a test fails on any colour that is not a token value.

## 4. Slots

Code fills every slot except the title and the highlight names. Nobody types a time, a link or a count.

| Slot | Event | Recap | Filled by |
|---|---|---|---|
| Title + accent phrase | yes | yes | approved copy (`title.text`, `title.accent`; the statement carries its own punctuation: "Raid Night:") |
| Kind tag | "Event" | "Week of 26 Oct" | code (`formatWeek`) |
| Date and time | "Fri 6 Nov · 21:00 GMT", then "21:00 UTC" | — | code (`formatWhen`) from `when.start` (ISO, UTC) and `when.zone` (IANA). UTC zone prints no anchor |
| Count | optional "52 going" | per highlight "61 came"; up to 2 stats ("6 events", "214 came" / "first-timers") | code from the internal aggregate; people counts print only at **50 or more** |
| Highlights | — | 1 to 3, sorted by day | event names (approved copy) and days in the week |
| Action label | from `link.kind` | from `link.kind` | code (`ACTIONS`) |
| Link | printed without scheme or query | same | code (`formatLink`) from an allowlisted https URL |
| Art | optional, landscape only | — | a manifest asset with alt text (§7) |
| Footer | fixed | fixed | code; AI-generated art prepends "AI-generated image" |
| Alt text | `altText(card)` | `altText(card)` | code: every fact on the card, for every platform that takes alt text |

## 5. Sizes, safe areas and budgets

| Size | Canvas | Safe area (token) | Use |
|---|---|---|---|
| `landscape` | 1200 × 630 (`social.canvas.landscape.*`) | 64 left and right, 48 top and bottom (`social.safe.landscape.*`); covers 2:1 crops | Link previews and posts: Discord, X, Bluesky, Mastodon, Reddit, Steam |
| `story` | 1080 × 1920 (`social.canvas.story.*`) | top 288, bottom 384, left 72, right 120 (`social.safe.story.*`); clears profile and progress bars, the reply bar, the action column and the 4:5 feed crop | Stories, Shorts, Reels, TikTok |

**Layouts.** Landscape: brand row; title on the floor of the free space (art, when present, in a 360 px column to its right); facts card and the action side by side; footer. Story: brand row; title; facts card (date and time on two lines); full-width action with the link under it; footer. The recap swaps the facts card for the highlights card and stats; in story the week label moves into the highlights card and each row puts its date above the name. Story does not carry art in v1: the title is the image.

**Phone check.** `social/previews/*-phone.png` are the same renders at 340 px (a link card in a phone feed) and 390 px (a full-screen story). Title, date, time and action must read at that size; mono labels are supporting text that the post text and alt text repeat.

**Character budgets** (`BUDGETS` in `social/check.mjs`), calibrated by rendering wide worst-case copy. `*-budget-max` fixtures render at the limits.

| Field | Event | Recap |
|---|---|---|
| `title.text` | 24 | 16 |
| `title.accent` | 26 | 20 |
| Whole title (text + space + accent) | 44, or **30 with art** | 24 |
| Highlight name | — | 22 |
| Any one word in copy | 16 | 16 |
| Art alt text | 200 | — |

Budgets are the cheap check. The renderer also guards the layout: a marker after the footer must end inside the safe area, and no title word may cross its line (`overflow()` in `social/render.mjs`). Either failure rejects the card as `copy-overflow`. Titles never truncate or shrink to fit.

## 6. The rule checker

`checkCard(card, { manifest, allowedHosts, now, resolveAsset })` runs before human review and before any render. It is pure and deterministic, returns every problem rather than the first, and never fixes anything up. A card with any rejection is not rendered and is not shown for approval. It returns:

- `ok`, `rejections[]` (`code`, `field`, `detail`),
- `contentHash`: sha256 of the canonical card JSON (sorted keys),
- `assets[]`: the id and sha256 of every asset the render uses (logo, fonts, art),
- `action`: the printed action label.

An approval binds the `revision`, `contentHash`, the asset hashes, the rendered PNG's sha256 (from `renderCard`), the platform account and the schedule. Any edit changes a hash and the approval no longer matches.

**Rejection states** (the template has no "error" look: a rejected card is never rendered):

| Code | When |
|---|---|
| `copy-overflow` | Over a character budget, a word over 16 characters, or the render guard (§5) |
| `missing-art` | The art (or any asset) file is missing, so nothing renders |
| `missing-rights` | An asset has no manifest record, or no manifest was passed |
| `rights-withdrawn` / `rights-expired` | The record's `withdrawnAt` / `expiresAt` is now or earlier |
| `rights-scope` | The asset is not cleared for this use (organic, paid, fixture); game art is never cleared for paid |
| `placeholder-asset` | A placeholder in a non-fixture card |
| `asset-hash-mismatch` | The card's art hash, the record or the file disagree |
| `missing-release` | The asset shows people (or is member media or a clip) and has no release id |
| `ai-people` | An AI-generated image of people |
| `missing-alt` | Art without alt text |
| `disclosure-missing` | AI-drafted copy or AI-generated art without its disclosure flag, or a flag absent |
| `disclosure-mismatch` | An AI-image flag with no AI art on the card |
| `ai-label-missing` | Either AI flag is true and `platformAiLabel` is not; the publisher maps it to each platform's AI label |
| `endorsement-claim` | "official", "partner", "sponsored", "presented by", "licensed", "collab", "X x Y" and similar |
| `voice-hype` | "!", hype words, urgency ("hurry", "only 2 left") |
| `member-data` | An email, @mention, Discord mention, user id or tag |
| `quote-in-copy` | Quotation marks: cards carry no testimonials |
| `link-in-copy` / `emoji-in-copy` / `bad-whitespace` | A URL in copy, an emoji, doubled spaces or line breaks |
| `count-below-k` / `count-source` / `bad-noun` | A people count under 50, not from the internal aggregate, or with an unlisted noun |
| `bad-link` / `link-not-allowed` / `link-tracking-id` | Not https, credentials or fragment, a non-`utm_` parameter, a host off the allowlist (no allowlist rejects everything), or a click id (`fbclid`, `gclid`, `ttclid`…) |
| `bad-time` / `event-in-past` | Bad ISO time or IANA zone, a highlight outside its week, an event that has started |
| `highlights-count` / `stats-count` | Recap limits (1–3 highlights, 0–2 stats) |
| `paid-not-enabled` | `purpose` other than `organic` |
| `unknown-schema` / `unknown-template` / `unknown-field` / `missing-field` / `bad-type` / `no-clock` / `not-a-card` | Shape errors: fail closed |

## 7. Asset rights

`social/rights/manifest.json` (schema `social/schema/asset-rights.schema.json`) has one record per file a render can use: id, kind, path, sha256, owner, licence, allowed uses, AI and people flags, release ids, expiry, and withdrawal (`withdrawnAt`, `withdrawalReason`). Clips also carry a consent record: purposes, channels, expiry and withdrawal.

Today it holds the brand icon (owned), six OFL font files (Mona Sans 2.0.27, Instrument Serif, Fragment Mono, by URL and hash; not committed, fetched with `npm run social:fonts`) and the art placeholder (fixture only). No game art, logos, soundtracks, photos or AI images are cleared, so real cards are typographic until an asset is added here with its licence and, for people, its release. Withdrawing an asset is one edit (`withdrawnAt`); every later check rejects it, and the publisher must take down scheduled posts that bound its hash.

Never: game art, logos or soundtracks in paid use; photorealistic AI people; fabricated testimonials; member names, avatars or data; assets created through a metered image service.

## 8. Clip captions (ffmpeg preset)

`social/ffmpeg.mjs`, no Remotion. For a 9:16 clip that has a manifest record of kind `clip` with a release and a consent record covering `organic-social` and the target platform:

- `checkClip(clip, { manifest, now, platform })` (schema `social/schema/social-clip.schema.json`): rights, release, consent purpose, channel, expiry and withdrawal; captions at most 64 characters, shown 1–7 s, no overlaps, the copy rules of §6; AI-drafted captions need the disclosure flags.
- `toAss(cues)`: Mona Sans SemiBold at `social.font-size.story.caption` (60), `text.primary` on an opaque `bg.canvas` box, bottom-centred with margins from `social.safe.story.*`, so captions end at the safe line.
- `clipOverlay(clip, ctx)`: a transparent Satori overlay with the brand chip and "Raid Night · Fri 30 Oct" on `bg.surface` chips at the top of the safe area.
- `captionOverlayArgs(...)`: the ffmpeg argv (scale and crop to 1080 × 1920, overlay, burn captions, copy audio, H.264 yuv420p, faststart). Paths are checked; no shell.

`npm run social:clip` proves it offline on a synthetic ffmpeg clip with no people in it and writes `social/previews/clip-overlay-story*.png`.

## 9. For the builder

- **Pin a commit** of this repo (no tag exists for this kit yet) and vendor `social/`, `dist/ts/tokens.ts` and `mockups/src/brand/icon-two-brand.svg` at that commit. `npm run social:fonts` fetches the fonts by hash.
- **Use it as is:** `checkCard` → human approval → `renderCard(card, size, …)` → publish the PNG with `altText(card)` in the post's alt field. Never render a card the checker rejected; never draw your own layout, colours or labels; never pass a link that is not on your allowlist.
- **The publisher owns** the allowlist (`allowedHosts`), the clock, approvals and their binding, platform AI-label mapping, YouTube `privacyStatus` (always explicit), scheduling, rate limits and takedown on withdrawal. The kit owns layout, type, copy rules, budgets and rights checks.
- **Changes** to a template, a budget or a rule are kit PRs reviewed by the UX Designer. The first real use of each template, and any paid creative, also needs the human gate.

## 10. Not in this kit

Paid or boosted creative; ad accounts, targeting and budgets; scheduling, queueing, posting and measurement (the publisher); a studio or editor UI; the consent and release screens members use (later, separate work); more template variants; art generation or transcription services; Remotion; a light or "record" (cream) card (idea bank IB-01); animated cards.

## 11. Regenerating the previews

```sh
npm ci --include=dev
npm run social:fonts    # OFL fonts into social/fonts/ (not committed), verified by sha256
npm run social:render   # every social/fixtures/*.json at both sizes, plus the phone previews
npm run social:clip     # needs ffmpeg with libass
npm test                # checker, formatting, manifest, token-only templates, render guard
```
