// ffmpeg caption and overlay preset for 9:16 clips (docs/social.md §8). No Remotion.
// Code builds the ASS captions, the overlay PNG (Satori, transparent) and the argv; nothing
// here runs a shell. A clip is used only with a release and consent record in the manifest.
import * as T from "../dist/ts/tokens.ts";
import { lexical, sha256 } from "./check.mjs";
import { formatDay } from "./format.mjs";
import { FONT, SIZE } from "./templates.mjs";

export const CLIP_SCHEMA = "two.social-clip/1";
export const CAPTION_MAX = 64; // two lines at the caption size inside the safe width
export const CUE_MIN_S = 1;
export const CUE_MAX_S = 7;

const px = (v) => Number.parseFloat(v);
const SAFE_PATH = /^[A-Za-z0-9_./-]+$/;

/** "#f6f1ea" + alpha 0..1 -> ASS "&HAABBGGRR". */
export function assColour(hex, opacity = 1) {
  const [r, g, b] = [1, 3, 5].map((i) => hex.slice(i, i + 2));
  const a = Math.round((1 - opacity) * 255)
    .toString(16)
    .padStart(2, "0");
  return `&H${a}${b}${g}${r}`.toUpperCase();
}

function assTime(s) {
  const cs = Math.round(s * 100);
  const h = Math.floor(cs / 360000);
  const m = Math.floor((cs % 360000) / 6000);
  const sec = Math.floor((cs % 6000) / 100);
  return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(cs % 100).padStart(2, "0")}`;
}

/** ASS captions: Mona Sans SemiBold, text.primary on an opaque canvas box (16.79:1), inside the story safe area. */
export function toAss(cues) {
  const s = SIZE.story;
  const style = [
    "Caption",
    "Mona Sans SemiBold",
    px(T.twoSocialFontSizeStoryCaption),
    assColour(T.twoColorTextPrimary),
    assColour(T.twoColorTextPrimary),
    assColour(T.twoColorBgCanvas),
    assColour(T.twoColorBgCanvas),
    0, // bold: the face is already SemiBold
    0,
    0,
    0,
    100,
    100,
    0,
    0,
    3, // opaque box
    px(T.twoSpace4), // box padding
    0,
    2, // bottom centre
    s.left,
    s.right,
    s.bottom,
    1,
  ].join(",");
  const lines = cues.map(
    (c) =>
      `Dialogue: 0,${assTime(c.start)},${assTime(c.end)},Caption,,0,0,0,,${c.text.replace(/[{}\\]/g, "")}`,
  );
  return [
    "[Script Info]",
    "ScriptType: v4.00+",
    `PlayResX: ${s.width}`,
    `PlayResY: ${s.height}`,
    "WrapStyle: 0",
    "ScaledBorderAndShadow: yes",
    "",
    "[V4+ Styles]",
    "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
    `Style: ${style}`,
    "",
    "[Events]",
    "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
    ...lines,
    "",
  ].join("\n");
}

/** argv for ffmpeg: crop to 9:16, lay the overlay PNG, burn the captions, keep audio. */
export function captionOverlayArgs({ input, overlay, ass, fontsDir, output }) {
  for (const p of [input, overlay, ass, fontsDir, output]) {
    if (typeof p !== "string" || !SAFE_PATH.test(p)) throw new Error(`unsafe path: ${p}`);
  }
  const { width: w, height: h } = SIZE.story;
  return [
    "-y",
    "-i",
    input,
    "-i",
    overlay,
    "-filter_complex",
    `[0:v]scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h},setsar=1[v];` +
      `[v][1:v]overlay=0:0[o];[o]subtitles=filename=${ass}:fontsdir=${fontsDir}[out]`,
    "-map",
    "[out]",
    "-map",
    "0:a?",
    "-c:v",
    "libx264",
    "-crf",
    "20",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "copy",
    "-movflags",
    "+faststart",
    output,
  ];
}

function chip(s, children, background) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        gap: px(T.twoSpace3),
        padding: `${T.twoSpace3} ${T.twoSpace6}`,
        borderRadius: T.twoRadiusPill,
        backgroundColor: background,
      },
      children,
    },
  };
}

/** Transparent 1080 x 1920 overlay: the brand chip and the event line, top of the safe area. */
export function clipOverlay(clip, ctx) {
  const s = SIZE.story;
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: px(T.twoSpace3),
        width: s.width,
        height: s.height,
        boxSizing: "border-box",
        paddingTop: s.top,
        paddingLeft: s.left,
        paddingRight: s.right,
        fontFamily: FONT.ui,
        color: T.twoColorTextPrimary,
      },
      children: [
        chip(
          s,
          [
            {
              type: "img",
              props: { src: ctx.icon, style: { width: s.label * 1.5, height: s.label * 1.5 } },
            },
            {
              type: "div",
              props: {
                style: { display: "flex", fontWeight: T.twoFontWeightSemibold, fontSize: s.label },
                children: "Together We Own",
              },
            },
          ],
          T.twoColorBgSurface,
        ),
        chip(
          s,
          [
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  fontFamily: FONT.data,
                  fontSize: s.label,
                  letterSpacing: T.twoTrackingLabel,
                  color: T.twoColorTextSecondary,
                },
                children: `${clip.title.text} · ${formatDay(clip.day, clip.zone)}`,
              },
            },
          ],
          T.twoColorBgSurface,
        ),
      ],
    },
  };
}

/**
 * Check a clip before any render: rights, release, consent scope and caption rules.
 * @returns {{ ok: boolean, rejections: {code: string, field: string, detail: string}[] }}
 */
export function checkClip(clip, { manifest, now, platform, resolveAsset }) {
  const out = [];
  const reject = (code, field, detail) => out.push({ code, field, detail });
  const t = now instanceof Date ? now.getTime() : Number.NaN;
  if (clip?.schema !== CLIP_SCHEMA) reject("unknown-schema", "schema", `Expected ${CLIP_SCHEMA}.`);
  const a = manifest?.assets?.find((x) => x.id === clip?.clip?.assetId);
  if (!a || a.kind !== "clip") {
    reject("missing-rights", "clip.assetId", "No clip rights record.");
  } else {
    if (a.sha256 !== clip.clip.sha256)
      reject("asset-hash-mismatch", "clip.sha256", "Hash differs.");
    if (!Array.isArray(a.releaseIds) || a.releaseIds.length === 0)
      reject("missing-release", "clip.assetId", "No release record.");
    if (a.withdrawnAt && Date.parse(a.withdrawnAt) <= t)
      reject("rights-withdrawn", "clip.assetId", "The clip was withdrawn.");
    const c = a.consent;
    if (!c?.recordId) reject("missing-consent", "clip.assetId", "No consent record.");
    else {
      if (c.withdrawnAt && Date.parse(c.withdrawnAt) <= t)
        reject("consent-withdrawn", "clip.assetId", "Consent was withdrawn.");
      if (!c.expiresAt || Date.parse(c.expiresAt) <= t)
        reject("consent-expired", "clip.assetId", "Consent has no future end date.");
      if (!c.purposes?.includes("organic-social"))
        reject("consent-scope", "clip.assetId", "Consent does not cover organic social.");
      if (!c.channels?.includes(platform))
        reject("consent-scope", "clip.assetId", `Consent does not cover ${platform}.`);
    }
    const use = clip.fixture === true ? "fixture" : "organic";
    if (!a.uses?.includes(use)) reject("rights-scope", "clip.assetId", `Not cleared for ${use}.`);
    if (resolveAsset) {
      const bytes = resolveAsset(a);
      if (!bytes) reject("missing-art", "clip.assetId", "The clip file is missing.");
      else if (sha256(bytes) !== a.sha256)
        reject("asset-hash-mismatch", "clip.assetId", "The clip file does not match its hash.");
    }
  }
  const title = clip?.title?.text;
  if (typeof title !== "string" || title === "" || [...title].length > 24)
    reject("copy-overflow", "title.text", "The clip title is 1 to 24 characters.");
  else lexical("title.text", title, reject);
  const cues = Array.isArray(clip?.captions) ? clip.captions : [];
  let aiCaptions = false;
  cues.forEach((c, i) => {
    const f = `captions[${i}]`;
    if (typeof c.text !== "string" || [...c.text].length > CAPTION_MAX)
      reject("copy-overflow", `${f}.text`, `Captions are at most ${CAPTION_MAX} characters.`);
    else lexical(`${f}.text`, c.text, reject);
    const d = c.end - c.start;
    if (!(d >= CUE_MIN_S && d <= CUE_MAX_S))
      reject("caption-timing", f, `A caption shows for ${CUE_MIN_S} to ${CUE_MAX_S} seconds.`);
    if (i > 0 && c.start < cues[i - 1].end) reject("caption-timing", f, "Captions overlap.");
    if (c.source === "ai-draft") aiCaptions = true;
  });
  if (aiCaptions && clip.disclosure?.aiAssistedCopy !== true)
    reject("disclosure-missing", "disclosure.aiAssistedCopy", "Captions are an AI draft.");
  if (clip.disclosure?.aiAssistedCopy && clip.disclosure?.platformAiLabel !== true)
    reject(
      "ai-label-missing",
      "disclosure.platformAiLabel",
      "AI-assisted content carries the label.",
    );
  return { ok: out.length === 0, rejections: out };
}
