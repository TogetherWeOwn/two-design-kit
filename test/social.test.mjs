// Social template kit: the rule checker, code-owned formatting, the rights manifest,
// token-only templates, the ffmpeg preset and (when the OFL fonts are fetched) rendering.
import assert from "node:assert/strict";
import { access, readdir, readFile } from "node:fs/promises";
import { test } from "node:test";
import * as T from "../dist/ts/tokens.ts";
import { checkCard, sha256 } from "../social/check.mjs";
import { captionOverlayArgs, checkClip, toAss } from "../social/ffmpeg.mjs";
import { formatLink, formatWeek, formatWhen } from "../social/format.mjs";
import { altText, SENTINEL, TEMPLATE, TITLE_MARK, WORD_MARK } from "../social/templates.mjs";

const manifest = JSON.parse(await readFile("social/rights/manifest.json", "utf8"));
const fixtures = {};
for (const name of (await readdir("social/fixtures")).filter((n) => n.endsWith(".json"))) {
  fixtures[name.replace(/\.json$/, "")] = JSON.parse(
    await readFile(`social/fixtures/${name}`, "utf8"),
  );
}
const opts = (fx, extra = {}) => ({
  manifest,
  allowedHosts: fx.allowedHosts,
  now: new Date(fx.now),
  ...extra,
});
const clone = (v) => structuredClone(v);
const codes = (r) => r.rejections.map((x) => x.code);

test("every fixture passes the checker", () => {
  for (const [name, fx] of Object.entries(fixtures)) {
    const r = checkCard(fx.card, opts(fx));
    assert.deepEqual(r.rejections, [], name);
    assert.match(r.contentHash, /^[0-9a-f]{64}$/);
    assert.ok(
      r.assets.some((a) => a.id === "two-icon"),
      `${name} binds the logo hash`,
    );
    assert.ok(
      r.assets.some((a) => a.id.startsWith("font-")),
      `${name} binds the font hashes`,
    );
  }
});

test("the content hash ignores key order and changes with content", () => {
  const fx = fixtures["event-raid-night"];
  const reordered = Object.fromEntries(Object.entries(fx.card).reverse());
  assert.equal(
    checkCard(reordered, opts(fx)).contentHash,
    checkCard(fx.card, opts(fx)).contentHash,
  );
  const edited = clone(fx.card);
  edited.title.accent = "Deep Rock";
  assert.notEqual(
    checkCard(edited, opts(fx)).contentHash,
    checkCard(fx.card, opts(fx)).contentHash,
  );
});

const event = fixtures["event-raid-night"];
const recap = fixtures["recap-week-44"];
const art = fixtures["event-art-placeholder"];

/** [name, expected code, fixture, mutate(card, manifestCopy) -> options override] */
const REJECTIONS = [
  [
    "copy overflow: title",
    "copy-overflow",
    event,
    (c) => void (c.title.text = "A very long statement for a card:"),
  ],
  [
    "copy overflow: long word",
    "copy-overflow",
    event,
    (c) => void (c.title.accent = "Supercalifragilistic"),
  ],
  [
    "copy overflow: title with art",
    "copy-overflow",
    art,
    (c) => void (c.title.accent = "the next season and more"),
  ],
  [
    "copy overflow: highlight",
    "copy-overflow",
    recap,
    (c) => void (c.highlights[0].title = "Town hall with everyone here"),
  ],
  [
    "missing art file",
    "missing-art",
    art,
    () => ({ resolveAsset: (a) => (a.id === "art-placeholder" ? null : Buffer.from("x")) }),
  ],
  ["missing rights", "missing-rights", art, (c) => void (c.art.assetId = "unlisted-art")],
  ["placeholder outside fixtures", "placeholder-asset", art, (c) => void (c.fixture = false)],
  [
    "withdrawn rights",
    "rights-withdrawn",
    art,
    (_, m) =>
      void (m.assets.find((a) => a.id === "art-placeholder").withdrawnAt = "2026-11-01T00:00:00Z"),
  ],
  [
    "expired rights",
    "rights-expired",
    art,
    (_, m) =>
      void (m.assets.find((a) => a.id === "art-placeholder").expiresAt = "2026-11-01T00:00:00Z"),
  ],
  ["art hash mismatch", "asset-hash-mismatch", art, (c) => void (c.art.sha256 = "0".repeat(64))],
  ["missing alt", "missing-alt", art, (c) => void (c.art.alt = "")],
  [
    "AI people",
    "ai-people",
    art,
    (_, m) => {
      const a = m.assets.find((x) => x.id === "art-placeholder");
      Object.assign(a, { aiGenerated: true, depictsPeople: true, releaseIds: ["r-1"] });
    },
  ],
  [
    "release missing for people",
    "missing-release",
    art,
    (_, m) => void (m.assets.find((a) => a.id === "art-placeholder").depictsPeople = true),
  ],
  [
    "AI art without disclosure",
    "disclosure-missing",
    art,
    (_, m) => void (m.assets.find((a) => a.id === "art-placeholder").aiGenerated = true),
  ],
  [
    "AI copy without disclosure",
    "disclosure-missing",
    event,
    (c) => void (c.title.source = "ai-draft"),
  ],
  [
    "AI copy without platform label",
    "ai-label-missing",
    event,
    (c) => {
      c.title.source = "ai-draft";
      c.disclosure.aiAssistedCopy = true;
    },
  ],
  [
    "disclosure flag missing",
    "disclosure-missing",
    event,
    (c) => void delete c.disclosure.platformAiLabel,
  ],
  [
    "endorsement",
    "endorsement-claim",
    event,
    (c) => void (c.title.accent = "official partner night"),
  ],
  [
    "endorsement: x collab",
    "endorsement-claim",
    event,
    (c) => void (c.title.accent = "TWO x Deep Rock"),
  ],
  ["hype", "voice-hype", event, (c) => void (c.title.accent = "Deep Rock!")],
  ["member data: email", "member-data", event, (c) => void (c.title.accent = "ask a@b.co")],
  ["member data: mention", "member-data", event, (c) => void (c.title.accent = "with @Kestrel")],
  [
    "member data: snowflake",
    "member-data",
    event,
    (c) => void (c.title.accent = "id 102938475610293847"),
  ],
  ["testimonial quote", "quote-in-copy", event, (c) => void (c.title.accent = "“best night”")],
  ["link in copy", "link-in-copy", event, (c) => void (c.title.accent = "two.example/e")],
  ["emoji", "emoji-in-copy", event, (c) => void (c.title.accent = "Deep Rock 🔥")],
  ["count below k", "count-below-k", event, (c) => void (c.count.value = 49)],
  ["count source", "count-source", event, (c) => void (c.count.source = "discord-api")],
  ["count noun", "bad-noun", event, (c) => void (c.count.noun = "online")],
  ["recap people stat below k", "count-below-k", recap, (c) => void (c.stats[1].value = 12)],
  [
    "recap highlight count below k",
    "count-below-k",
    recap,
    (c) => void (c.highlights[1].count.value = 8),
  ],
  [
    "link host",
    "link-not-allowed",
    event,
    (c) => void (c.link.url = "https://evil.example/e/raid-night"),
  ],
  ["link scheme", "bad-link", event, (c) => void (c.link.url = "http://two.example/e/raid-night")],
  [
    "click id",
    "link-tracking-id",
    event,
    (c) => void (c.link.url = "https://two.example/e/raid-night?fbclid=abc"),
  ],
  [
    "non-utm query",
    "bad-link",
    event,
    (c) => void (c.link.url = "https://two.example/e/raid-night?member=7"),
  ],
  ["link kind", "bad-link", event, (c) => void (c.link.kind = "events")],
  ["no allowlist", "link-not-allowed", event, () => ({ allowedHosts: undefined })],
  ["bad zone", "bad-time", event, (c) => void (c.when.zone = "Mars/Olympus")],
  ["bad start", "bad-time", event, (c) => void (c.when.start = "2026-11-06 21:00")],
  [
    "event in the past",
    "event-in-past",
    event,
    (c) => void (c.when.start = "2026-11-01T21:00:00Z"),
  ],
  ["highlight outside week", "bad-time", recap, (c) => void (c.highlights[0].day = "2026-11-05")],
  [
    "too many highlights",
    "highlights-count",
    recap,
    (c) => void c.highlights.push({ ...c.highlights[0] }),
  ],
  ["too many stats", "stats-count", recap, (c) => void c.stats.push({ ...c.stats[0] })],
  ["paid", "paid-not-enabled", event, (c) => void (c.purpose = "paid")],
  ["unknown field", "unknown-field", event, (c) => void (c.targeting = { age: "18-24" })],
  ["unknown template", "unknown-template", event, (c) => void (c.template = "ad-carousel")],
  ["no clock", "no-clock", event, () => ({ now: undefined })],
  ["no manifest", "missing-rights", event, () => ({ manifest: undefined })],
];

for (const [name, code, fx, mutate] of REJECTIONS) {
  test(`rejects ${code}: ${name}`, () => {
    const card = clone(fx.card);
    const m = clone(manifest);
    const extra = mutate(card, m) ?? {};
    const r = checkCard(card, { ...opts(fx), manifest: m, ...extra });
    assert.equal(r.ok, false, `${name} should reject`);
    assert.ok(codes(r).includes(code), `${name}: got ${codes(r).join(", ")}`);
  });
}

test("time, week and link are printed by code", () => {
  assert.deepEqual(formatWhen({ start: "2026-11-06T21:00:00Z", zone: "Europe/London" }), {
    date: "Fri 6 Nov",
    time: "21:00 GMT",
    anchor: "21:00 UTC",
    long: "Friday 6 November, 21:00 GMT (21:00 UTC)",
  });
  assert.equal(formatWhen({ start: "2026-11-10T19:30:00Z", zone: "UTC" }).anchor, null);
  assert.equal(
    formatWhen({ start: "2026-11-10T03:30:00Z", zone: "America/Los_Angeles" }).date,
    "Mon 9 Nov",
  );
  assert.equal(formatWeek({ start: "2026-10-26", zone: "Europe/London" }), "Week of 26 Oct");
  assert.equal(
    formatLink("https://two.example/e/raid-night/?utm_source=x#y"),
    "two.example/e/raid-night",
  );
});

test("alt text carries every fact on the card", () => {
  assert.equal(
    altText(event.card),
    "Together We Own event. Raid Night: Deep Rock Galactic. Friday 6 November, 21:00 GMT (21:00 UTC). 52 going. Say you're in at two.example/e/raid-night.",
  );
  const r = altText(recap.card);
  for (const s of [
    "Town hall",
    "Raid Night, 61 came",
    "Sunday co-op",
    "6 events",
    "214 came",
    "Join with Discord",
  ]) {
    assert.ok(r.includes(s), s);
  }
});

const MARKS = new Set([SENTINEL, TITLE_MARK, WORD_MARK]);

test("templates use token values only", () => {
  const allowed = new Set(
    Object.values(T)
      .filter((v) => typeof v === "string" || typeof v === "number")
      .map(String),
  );
  for (const v of Object.values(T)) {
    if (typeof v === "string") allowed.add(String(Number.parseFloat(v)));
  }
  const ctx = { icon: "data:icon", art: "data:art", artPlaceholder: true };
  const bad = [];
  const walk = (node, where) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) return node.forEach((n) => walk(n, where));
    for (const [k, v] of Object.entries(node.props?.style ?? {})) {
      if (typeof v === "string" && /#[0-9a-f]{3,8}\b|rgba?\(/i.test(v)) {
        const colours = v.match(/#[0-9a-f]{6}\b|rgba?\([^)]*\)/gi) ?? [];
        for (const c of colours)
          if (!allowed.has(c) && !MARKS.has(c)) bad.push(`${where} ${k}: ${c}`);
      }
    }
    walk(node.props?.children, where);
  };
  for (const [name, fx] of Object.entries(fixtures)) {
    for (const size of ["landscape", "story"])
      walk(TEMPLATE[fx.card.template](fx.card, size, ctx), `${name}/${size}`);
  }
  assert.deepEqual(bad, []);
});

test("the rights manifest is complete and its repo files match their hashes", async () => {
  const schema = JSON.parse(await readFile("social/schema/asset-rights.schema.json", "utf8"));
  const required = schema.$defs.asset.required;
  const ids = new Set();
  for (const a of manifest.assets) {
    for (const k of required) assert.ok(k in a, `${a.id} lacks ${k}`);
    assert.ok(!ids.has(a.id), `duplicate ${a.id}`);
    ids.add(a.id);
    if (a.kind === "placeholder") assert.deepEqual(a.uses, ["fixture"]);
    if (a.kind === "game-art") assert.ok(!a.uses.includes("paid"));
    if (a.kind === "font") assert.equal(a.licence.id, "OFL-1.1");
    if (!a.path.startsWith("social/fonts/")) {
      assert.equal(sha256(await readFile(a.path)), a.sha256, a.id);
    }
  }
});

const CLIP_ASSET = {
  id: "clip-1",
  kind: "clip",
  sha256: "a".repeat(64),
  uses: ["fixture"],
  releaseIds: ["r-1"],
  withdrawnAt: null,
  consent: {
    recordId: "c-1",
    purposes: ["organic-social"],
    channels: ["youtube-shorts"],
    expiresAt: "2027-01-01T00:00:00Z",
    withdrawnAt: null,
  },
};
const CLIP = {
  schema: "two.social-clip/1",
  revision: "r1",
  fixture: true,
  clip: { assetId: "clip-1", sha256: "a".repeat(64) },
  title: { text: "Raid Night" },
  day: "2026-10-30",
  zone: "Europe/London",
  captions: [{ start: 0, end: 2, text: "Left side is clear.", source: "human" }],
  disclosure: { aiAssistedCopy: false, aiGeneratedImagery: false, platformAiLabel: false },
};
const clipOpts = (asset = CLIP_ASSET) => ({
  manifest: { assets: [asset] },
  now: new Date("2026-11-04T12:00:00Z"),
  platform: "youtube-shorts",
});

test("clips need a release and consent that covers the channel", () => {
  assert.deepEqual(checkClip(CLIP, clipOpts()).rejections, []);
  const cases = [
    [{ ...CLIP_ASSET, consent: undefined }, "missing-consent"],
    [{ ...CLIP_ASSET, releaseIds: [] }, "missing-release"],
    [
      { ...CLIP_ASSET, consent: { ...CLIP_ASSET.consent, withdrawnAt: "2026-11-02T00:00:00Z" } },
      "consent-withdrawn",
    ],
    [
      { ...CLIP_ASSET, consent: { ...CLIP_ASSET.consent, expiresAt: "2026-11-01T00:00:00Z" } },
      "consent-expired",
    ],
    [{ ...CLIP_ASSET, consent: { ...CLIP_ASSET.consent, channels: ["tiktok"] } }, "consent-scope"],
    [{ ...CLIP_ASSET, withdrawnAt: "2026-11-02T00:00:00Z" }, "rights-withdrawn"],
  ];
  for (const [asset, code] of cases)
    assert.ok(codes(checkClip(CLIP, clipOpts(asset))).includes(code), code);
  const long = { ...CLIP, captions: [{ start: 0, end: 2, text: "x".repeat(65), source: "human" }] };
  assert.ok(codes(checkClip(long, clipOpts())).includes("copy-overflow"));
  const slow = { ...CLIP, captions: [{ start: 0, end: 9, text: "Hold.", source: "human" }] };
  assert.ok(codes(checkClip(slow, clipOpts())).includes("caption-timing"));
  const ai = { ...CLIP, captions: [{ start: 0, end: 2, text: "Hold.", source: "ai-draft" }] };
  assert.ok(codes(checkClip(ai, clipOpts())).includes("disclosure-missing"));
  const named = { ...CLIP, captions: [{ start: 0, end: 2, text: "Go @Kestrel", source: "human" }] };
  assert.ok(codes(checkClip(named, clipOpts())).includes("member-data"));
});

test("the ffmpeg preset builds safe argv and safe-area captions", () => {
  const args = captionOverlayArgs({
    input: "in.mp4",
    overlay: "o.png",
    ass: "c.ass",
    fontsDir: "social/fonts",
    output: "out.mp4",
  });
  assert.ok(args.includes("-filter_complex"));
  assert.match(args.join(" "), /crop=1080:1920/);
  assert.throws(() =>
    captionOverlayArgs({
      input: "a;rm -rf.mp4",
      overlay: "o.png",
      ass: "c.ass",
      fontsDir: "f",
      output: "o.mp4",
    }),
  );
  const ass = toAss([{ start: 0, end: 1.5, text: "Nice {\\b1}" }]);
  assert.match(ass, /PlayResX: 1080/);
  assert.match(ass, /Style: Caption,Mona Sans SemiBold,60,&H00EAF1F6,/);
  assert.match(ass, /,2,72,120,384,1$/m);
  assert.match(ass, /Dialogue: 0,0:00:00\.00,0:00:01\.50,Caption,,0,0,0,,Nice b1/);
});

const fontsReady = await Promise.all(
  manifest.assets
    .filter((a) => a.kind === "font")
    .map((a) =>
      access(a.path).then(
        () => true,
        () => false,
      ),
    ),
).then((all) => all.every(Boolean));

test("renders every fixture inside the safe area", {
  skip: !fontsReady && "run npm run social:fonts",
}, async () => {
  const { loadAssets, renderCard } = await import("../social/render.mjs");
  const assets = await loadAssets(manifest);
  for (const [name, fx] of Object.entries(fixtures)) {
    for (const size of ["landscape", "story"]) {
      const r = await renderCard(fx.card, size, { ...opts(fx), assets });
      const w = r.png.readUInt32BE(16);
      const h = r.png.readUInt32BE(20);
      assert.deepEqual(
        [w, h],
        size === "landscape" ? [1200, 630] : [1080, 1920],
        `${name}/${size}`,
      );
    }
  }
});

test("the overflow guard rejects copy that runs past the safe area", {
  skip: !fontsReady && "run npm run social:fonts",
}, async () => {
  const { loadAssets, renderCard } = await import("../social/render.mjs");
  const assets = await loadAssets(manifest);
  const card = clone(fixtures["event-budget-max"].card);
  const run = (title) =>
    renderCard({ ...card, title: { ...title, source: "human" } }, "story", {
      ...opts(fixtures["event-budget-max"]),
      assets,
    });
  const overflowed = (e) => e.check?.rejections?.[0]?.code === "copy-overflow";
  // Inside every character budget, but one word is wider than the line.
  await assert.rejects(run({ text: "Wwwwwwwwwwwwwwww", accent: "Deep Rock" }), overflowed);
  // Inside every character budget, but wide letters wrap to more lines than the space holds.
  await assert.rejects(
    run({ text: "Mmm Www Mmm Www Mmm Www", accent: "Mmmmm Wwwww Mmmmm Wwwww Mm" }),
    overflowed,
  );
});
