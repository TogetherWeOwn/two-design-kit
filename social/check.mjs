// The fixed rule checker for social cards (docs/social.md §6). It runs before any human
// review and before any render. It is pure: the caller passes the rights manifest, the
// link allowlist, the clock and an asset resolver. Any doubt rejects; nothing is fixed up.
import { createHash } from "node:crypto";
import { weekContains } from "./format.mjs";

export const SCHEMA = "two.social-card/1";
export const TEMPLATES = ["event-announcement", "weekly-recap"];
export const SIZES = ["landscape", "story"];
export const K_MIN = 50;

/** The printed action is fixed by the template and the link kind. Copy never sets it. */
export const ACTIONS = {
  "event-announcement": { event: "Say you're in", invite: "Join with Discord" },
  "weekly-recap": { events: "See what's on", invite: "Join with Discord" },
};

/** Footer lines are fixed text. */
export const FOOTER = "Fan-run community · not affiliated with any game publisher";
export const AI_IMAGE_LABEL = "AI-generated image";

/** Character budgets, calibrated by rendering worst-case copy (docs/social.md §5). */
export const WORD_MAX = 16;
export const BUDGETS = {
  "event-announcement": {
    "title.text": 24,
    "title.accent": 26,
    title: 44,
    "title.withArt": 30,
    "art.alt": 200,
  },
  "weekly-recap": { "title.text": 16, "title.accent": 20, title: 24, "highlights[].title": 22 },
};

export const NOUNS = {
  "event-announcement": { count: ["going"] },
  "weekly-recap": {
    "highlights[].count": ["came"],
    stats: { people: ["came", "first-timers"], events: ["events"] },
  },
};

const CLICK_IDS = new Set([
  "fbclid",
  "gclid",
  "gbraid",
  "wbraid",
  "dclid",
  "msclkid",
  "ttclid",
  "twclid",
  "li_fat_id",
  "rdt_cid",
  "scid",
  "igshid",
  "mc_eid",
]);

const ENDORSEMENT = [
  /\bofficial(ly)?\b/i,
  /\bpartner(s|ed|ing|ship|ships)?\b/i,
  /\bsponsor(s|ed|ing|ship)?\b/i,
  /\bendorse(d|s|ment)?\b/i,
  /\bin (association|collaboration|partnership) with\b/i,
  /\b(presented|powered|brought to you|approved|backed|supported) by\b/i,
  /\bcertified\b/i,
  /\blicen[cs]ed\b/i,
  /\bauthori[sz]ed\b/i,
  /\bcollab(oration)?\b/i,
  /\s[x×]\s/i,
];
const HYPE = [
  /!/,
  /\b(epic|insane|crazy|massive|huge|unmissable|legendary)\b/i,
  /\b(hurry|last chance|don't miss|limited|only \d+ left)\b/i,
];
const MEMBER_DATA = [
  /[^\s@]+@[^\s@]+\.[^\s@]+/, // email
  /(^|\s)@\w/, // mention
  /<@!?\d+>/, // Discord mention markup
  /\b\d{17,20}\b/, // Discord snowflake
  /#\d{4}\b/, // legacy Discord tag
];
const QUOTES = /["“”«»]/;
const URLISH = /\bhttps?:|www\.|\.(com|gg|net|org|io|co|uk|example)\b/i;
const EMOJI = /\p{Extended_Pictographic}/u;
const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?Z$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

const KEYS = {
  card: {
    event: [
      "schema",
      "template",
      "revision",
      "purpose",
      "fixture",
      "title",
      "when",
      "link",
      "count",
      "art",
      "disclosure",
    ],
    recap: [
      "schema",
      "template",
      "revision",
      "purpose",
      "fixture",
      "title",
      "week",
      "highlights",
      "stats",
      "link",
      "disclosure",
    ],
  },
  title: ["text", "accent", "source"],
  when: ["start", "zone"],
  week: ["start", "zone"],
  link: ["kind", "url"],
  count: ["value", "noun", "source"],
  art: ["assetId", "sha256", "alt"],
  disclosure: ["aiAssistedCopy", "aiGeneratedImagery", "platformAiLabel"],
  highlight: ["title", "accent", "day", "count"],
  stat: ["kind", "value", "noun", "source"],
};

function isObj(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

/** Stable JSON: sorted keys, so the hash binds content, not key order. */
export function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (isObj(value)) {
    return `{${Object.keys(value)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${canonical(value[k])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

/** Assets every render uses, whatever the data: the logo and the fonts. */
export function baseAssetIds(manifest) {
  return manifest.assets
    .filter((a) => a.kind === "font" || a.id === "two-icon")
    .map((a) => a.id)
    .sort();
}

/**
 * Check one card.
 * @param {object} card     card data (social/schema/social-card.schema.json)
 * @param {object} options  { manifest, allowedHosts: string[], now: Date, resolveAsset?: (asset) => Uint8Array|null }
 * @returns {{ ok: boolean, rejections: {code: string, field: string, detail: string}[],
 *             contentHash: string, assets: {id: string, sha256: string}[], action: string|null }}
 */
export function checkCard(card, options) {
  const { manifest, allowedHosts, now, resolveAsset } = options ?? {};
  const out = [];
  const reject = (code, field, detail) => out.push({ code, field, detail });

  if (!isObj(card)) {
    reject("not-a-card", "", "Card data is not an object.");
    return finish(card, out, [], null);
  }
  if (!manifest || !Array.isArray(manifest.assets)) {
    reject("missing-rights", "", "No rights manifest was supplied.");
  }
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) {
    reject("no-clock", "", "No clock was supplied.");
  }
  if (card.schema !== SCHEMA) reject("unknown-schema", "schema", `Expected ${SCHEMA}.`);
  if (!TEMPLATES.includes(card.template)) {
    reject("unknown-template", "template", `Templates: ${TEMPLATES.join(", ")}.`);
    return finish(card, out, [], null);
  }
  const event = card.template === "event-announcement";
  const t = card.template;

  shape(card, event ? KEYS.card.event : KEYS.card.recap, "", reject);
  if (typeof card.revision !== "string" || card.revision.length < 1) {
    reject("missing-field", "revision", "A content revision id is required.");
  }
  if (card.purpose !== "organic") {
    reject("paid-not-enabled", "purpose", "Only organic cards exist in this version.");
  }
  if (typeof card.fixture !== "boolean") {
    reject("missing-field", "fixture", "Say whether this is fixture content.");
  }

  // Title: approved copy, two-tone.
  const copy = [];
  if (shape(card.title, KEYS.title, "title", reject)) {
    const { text, accent, source } = card.title;
    if (typeof text !== "string" || text.trim() === "")
      reject("missing-field", "title.text", "A title is required.");
    if (accent !== undefined && accent !== null && typeof accent !== "string")
      reject("bad-type", "title.accent", "The accent phrase is text.");
    if (!["human", "ai-draft"].includes(source))
      reject("missing-field", "title.source", "Say who wrote the title: human or ai-draft.");
    budget(t, "title.text", text, reject);
    budget(t, "title.accent", accent, reject);
    const whole = `${text ?? ""}${accent ? ` ${accent}` : ""}`;
    budget(t, "title", whole, reject);
    if (event && card.art) budget(t, "title.withArt", whole, reject, "title");
    copy.push(["title.text", text, source], ["title.accent", accent, source]);
  }

  if (event) {
    if (shape(card.when, KEYS.when, "when", reject)) {
      const ok = zoneOk(card.when.zone);
      if (!ok) reject("bad-time", "when.zone", "Not an IANA time zone.");
      if (typeof card.when.start !== "string" || !ISO_UTC.test(card.when.start)) {
        reject("bad-time", "when.start", "Start is an ISO 8601 UTC time ending in Z.");
      } else if (now instanceof Date && Date.parse(card.when.start) <= now.getTime()) {
        reject("event-in-past", "when.start", "The event has already started.");
      }
    }
    if (card.count !== undefined && card.count !== null) {
      checkCount(card.count, "count", NOUNS[t].count, reject);
    }
  } else {
    if (shape(card.week, KEYS.week, "week", reject)) {
      if (!zoneOk(card.week.zone)) reject("bad-time", "week.zone", "Not an IANA time zone.");
      if (typeof card.week.start !== "string" || !DAY.test(card.week.start))
        reject("bad-time", "week.start", "Week start is a YYYY-MM-DD date.");
    }
    if (!Array.isArray(card.highlights) || card.highlights.length < 1) {
      reject("highlights-count", "highlights", "A recap needs 1 to 3 highlights.");
    } else {
      if (card.highlights.length > 3)
        reject("highlights-count", "highlights", "A recap shows at most 3 highlights.");
      card.highlights.forEach((h, i) => {
        const f = `highlights[${i}]`;
        if (!shape(h, KEYS.highlight, f, reject)) return;
        if (typeof h.title !== "string" || h.title.trim() === "")
          reject("missing-field", `${f}.title`, "A highlight needs an event name.");
        budget(t, "highlights[].title", h.title, reject, `${f}.title`);
        if (h.accent !== undefined && h.accent !== null)
          reject("unknown-field", `${f}.accent`, "Highlight rows have no accent phrase.");
        if (typeof h.day !== "string" || !DAY.test(h.day)) {
          reject("bad-time", `${f}.day`, "A highlight day is a YYYY-MM-DD date.");
        } else if (isObj(card.week) && DAY.test(card.week.start ?? "")) {
          if (!weekContains(card.week.start, h.day))
            reject("bad-time", `${f}.day`, "The highlight is outside the recap week.");
        }
        if (h.count !== undefined && h.count !== null)
          checkCount(h.count, `${f}.count`, NOUNS[t]["highlights[].count"], reject);
        copy.push([`${f}.title`, h.title, card.title?.source ?? "human"]);
      });
    }
    if (card.stats !== undefined && card.stats !== null) {
      if (!Array.isArray(card.stats) || card.stats.length > 2) {
        reject("stats-count", "stats", "A recap shows at most 2 stats.");
      } else {
        card.stats.forEach((s, i) => {
          const f = `stats[${i}]`;
          if (!shape(s, KEYS.stat, f, reject)) return;
          const nouns = NOUNS[t].stats[s.kind];
          if (!nouns) {
            reject("bad-type", `${f}.kind`, "Stat kind is people or events.");
            return;
          }
          if (s.kind === "people") checkCount(s, f, nouns, reject);
          else {
            if (!Number.isInteger(s.value) || s.value < 1)
              reject("bad-type", `${f}.value`, "A stat is a whole number above 0.");
            if (!nouns.includes(s.noun))
              reject("bad-noun", `${f}.noun`, `Nouns: ${nouns.join(", ")}.`);
          }
        });
      }
    }
  }

  // Lexical rules over every piece of free copy.
  for (const [field, text, source] of copy) {
    if (typeof text !== "string" || text === "") continue;
    lexical(field, text, reject);
    if (source === "ai-draft" && card.disclosure?.aiAssistedCopy !== true) {
      reject("disclosure-missing", "disclosure.aiAssistedCopy", `${field} is an AI draft.`);
    }
  }

  // Link: code-provided, allowlisted, no click ids.
  let action = null;
  if (shape(card.link, KEYS.link, "link", reject)) {
    action = ACTIONS[t][card.link.kind] ?? null;
    if (!action) {
      reject("bad-link", "link.kind", `Link kinds here: ${Object.keys(ACTIONS[t]).join(", ")}.`);
    }
    checkLink(card.link.url, allowedHosts, reject);
  }

  // Disclosure flags are always present and consistent.
  if (shape(card.disclosure, KEYS.disclosure, "disclosure", reject)) {
    for (const k of KEYS.disclosure) {
      if (typeof card.disclosure[k] !== "boolean")
        reject("disclosure-missing", `disclosure.${k}`, "Every disclosure flag is true or false.");
    }
    const ai = card.disclosure.aiAssistedCopy || card.disclosure.aiGeneratedImagery;
    if (ai && card.disclosure.platformAiLabel !== true) {
      reject(
        "ai-label-missing",
        "disclosure.platformAiLabel",
        "AI-assisted content carries the platform's AI label.",
      );
    }
  }

  // Rights: every asset the render uses, including the logo and fonts.
  const used = manifest?.assets ? baseAssetIds(manifest) : [];
  if (event && card.art !== undefined && card.art !== null) {
    if (shape(card.art, KEYS.art, "art", reject)) {
      used.push(card.art.assetId);
      if (typeof card.art.alt !== "string" || card.art.alt.trim() === "")
        reject("missing-alt", "art.alt", "Art needs a text alternative.");
      else {
        budget(t, "art.alt", card.art.alt, reject);
        lexical("art.alt", card.art.alt, reject, { quotes: true });
      }
    }
  }
  const assets = [];
  if (manifest?.assets) {
    for (const id of used) {
      const field = id === card.art?.assetId ? "art.assetId" : `asset:${id}`;
      const a = manifest.assets.find((x) => x.id === id);
      if (!a) {
        reject("missing-rights", field, `No rights record for ${id}.`);
        continue;
      }
      assets.push({ id, sha256: a.sha256 });
      rights(a, card, field, now, reject);
      if (id === card.art?.assetId) {
        if (card.art.sha256 !== a.sha256)
          reject(
            "asset-hash-mismatch",
            "art.sha256",
            "The art hash differs from its rights record.",
          );
        if (a.aiGenerated && card.disclosure?.aiGeneratedImagery !== true)
          reject("disclosure-missing", "disclosure.aiGeneratedImagery", "The art is AI-generated.");
        if (!a.aiGenerated && card.disclosure?.aiGeneratedImagery === true)
          reject(
            "disclosure-mismatch",
            "disclosure.aiGeneratedImagery",
            "The art is not AI-generated.",
          );
      }
      if (resolveAsset) {
        const bytes = resolveAsset(a);
        if (!bytes) reject("missing-art", field, `The file for ${id} is missing.`);
        else if (sha256(bytes) !== a.sha256)
          reject("asset-hash-mismatch", field, `The file for ${id} does not match its hash.`);
      }
    }
  }
  if (!event || !card.art) {
    if (card.disclosure?.aiGeneratedImagery === true)
      reject(
        "disclosure-mismatch",
        "disclosure.aiGeneratedImagery",
        "There is no art on this card.",
      );
  }

  return finish(card, out, assets, action);
}

function finish(card, rejections, assets, action) {
  return {
    ok: rejections.length === 0,
    rejections,
    contentHash: sha256(canonical(card ?? null)),
    assets,
    action,
  };
}

function shape(value, keys, field, reject) {
  if (!isObj(value)) {
    reject("missing-field", field, `${field || "card"} is required.`);
    return false;
  }
  for (const k of Object.keys(value)) {
    if (!keys.includes(k))
      reject("unknown-field", field ? `${field}.${k}` : k, "Not in the schema.");
  }
  return true;
}

function budget(template, key, text, reject, field = key) {
  const max = BUDGETS[template][key];
  if (max === undefined || typeof text !== "string") return;
  const n = [...text].length;
  if (n > max) reject("copy-overflow", field, `${n} characters; the budget is ${max}.`);
}

export function lexical(field, text, reject, { quotes = false } = {}) {
  if (!quotes && text.split(/\s+/).some((w) => [...w].length > WORD_MAX))
    reject("copy-overflow", field, `A word is longer than ${WORD_MAX} characters.`);
  if (ENDORSEMENT.some((r) => r.test(text)))
    reject("endorsement-claim", field, "Copy may not imply endorsement or partnership.");
  if (HYPE.some((r) => r.test(text)))
    reject("voice-hype", field, "No hype or urgency (voice.md §1).");
  if (MEMBER_DATA.some((r) => r.test(text)))
    reject("member-data", field, "No emails, mentions, ids or tags (voice.md §5).");
  if (!quotes && QUOTES.test(text))
    reject("quote-in-copy", field, "No quotations: cards carry no testimonials.");
  if (URLISH.test(text)) reject("link-in-copy", field, "Links live only in the link slot.");
  if (EMOJI.test(text)) reject("emoji-in-copy", field, "No emoji on cards.");
  if (text !== text.trim() || /\s{2,}|\n/.test(text))
    reject("bad-whitespace", field, "Single spaces, no line breaks.");
}

function checkCount(count, field, nouns, reject) {
  if (!isObj(count)) {
    reject("bad-type", field, "A count is an object.");
    return;
  }
  const allowed = field.startsWith("stats") ? KEYS.stat : KEYS.count;
  for (const k of Object.keys(count))
    if (!allowed.includes(k)) reject("unknown-field", `${field}.${k}`, "Not in the schema.");
  if (!Number.isInteger(count.value)) {
    reject("bad-type", `${field}.value`, "A count is a whole number.");
  } else if (count.value < K_MIN) {
    reject("count-below-k", `${field}.value`, `Counts of people print only at ${K_MIN} or more.`);
  }
  if (count.source !== "internal-aggregate")
    reject("count-source", `${field}.source`, "Counts come from the internal aggregate only.");
  if (!nouns.includes(count.noun))
    reject("bad-noun", `${field}.noun`, `Nouns: ${nouns.join(", ")}.`);
}

function checkLink(url, allowedHosts, reject) {
  let u;
  try {
    u = new URL(url);
  } catch {
    reject("bad-link", "link.url", "Not a URL.");
    return;
  }
  if (u.protocol !== "https:") reject("bad-link", "link.url", "Links are https.");
  if (u.username || u.password || u.hash)
    reject("bad-link", "link.url", "No credentials or fragments.");
  if (!Array.isArray(allowedHosts) || !allowedHosts.includes(u.hostname))
    reject("link-not-allowed", "link.url", `${u.hostname} is not on the allowlist.`);
  for (const k of u.searchParams.keys()) {
    if (CLICK_IDS.has(k.toLowerCase()))
      reject("link-tracking-id", "link.url", `Click ids (${k}) are never added to links.`);
  }
  if ([...u.searchParams.keys()].some((k) => !k.toLowerCase().startsWith("utm_")))
    reject("bad-link", "link.url", "Only utm_ campaign parameters are allowed.");
}

function rights(a, card, field, now, reject) {
  const t = now instanceof Date ? now.getTime() : Number.NaN;
  if (a.withdrawnAt && Date.parse(a.withdrawnAt) <= t)
    reject(
      "rights-withdrawn",
      field,
      `${a.id} was withdrawn: ${a.withdrawalReason ?? "no reason given"}.`,
    );
  if (a.expiresAt && Date.parse(a.expiresAt) <= t)
    reject("rights-expired", field, `${a.id} has expired.`);
  const use = card.fixture === true ? "fixture" : card.purpose;
  if (!Array.isArray(a.uses) || !a.uses.includes(use))
    reject("rights-scope", field, `${a.id} is not cleared for ${use} use.`);
  if (a.kind === "placeholder" && card.fixture !== true)
    reject("placeholder-asset", field, "Placeholders never leave fixture content.");
  if (a.kind === "game-art" && use === "paid")
    reject("rights-scope", field, "Game art is never used in paid creative.");
  if (a.depictsPeople && a.aiGenerated)
    reject("ai-people", field, "No AI-generated images of people.");
  if (
    (a.depictsPeople || a.kind === "member-media" || a.kind === "clip") &&
    (!Array.isArray(a.releaseIds) || a.releaseIds.length === 0)
  )
    reject("missing-release", field, `${a.id} shows people and has no release record.`);
}

function zoneOk(zone) {
  if (typeof zone !== "string" || zone === "") return false;
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}
