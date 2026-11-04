// Satori element trees for the organic social templates (docs/social.md §3-5).
// Plain { type, props } objects, no JSX. Every value is a kit token constant.
// Satori has no CSS variables, so the trees read dist/ts/tokens.ts directly.
import * as T from "../dist/ts/tokens.ts";
import { ACTIONS, AI_IMAGE_LABEL, FOOTER } from "./check.mjs";
import { formatCount, formatDay, formatLink, formatWeek, formatWhen } from "./format.mjs";

const px = (v) => Number.parseFloat(v);

/** Font names the renderer registers (social/rights/manifest.json, kind "font"). */
export const FONT = {
  ui: "Mona Sans",
  display: "Mona Sans SemiExpanded",
  accent: "Instrument Serif",
  data: "Fragment Mono",
};

/** Geometry per size, all from tokens. */
export const SIZE = {
  landscape: {
    width: px(T.twoSocialCanvasLandscapeWidth),
    height: px(T.twoSocialCanvasLandscapeHeight),
    top: px(T.twoSocialSafeLandscapeY),
    bottom: px(T.twoSocialSafeLandscapeY),
    left: px(T.twoSocialSafeLandscapeX),
    right: px(T.twoSocialSafeLandscapeX),
    display: px(T.twoSocialFontSizeLandscapeDisplay),
    figure: px(T.twoSocialFontSizeLandscapeFigure),
    body: px(T.twoSocialFontSizeLandscapeBody),
    label: px(T.twoSocialFontSizeLandscapeLabel),
    logo: px(T.twoSocialSizeLogoLandscape),
    action: px(T.twoSocialSizeActionLandscape),
    art: px(T.twoSocialSizeArtLandscape),
    gap: px(T.twoSpace6),
    gapS: px(T.twoSpace4),
    pad: px(T.twoSpaceInsetCardLg),
    row: px(T.twoSpace9),
  },
  story: {
    width: px(T.twoSocialCanvasStoryWidth),
    height: px(T.twoSocialCanvasStoryHeight),
    top: px(T.twoSocialSafeStoryTop),
    bottom: px(T.twoSocialSafeStoryBottom),
    left: px(T.twoSocialSafeStoryLeft),
    right: px(T.twoSocialSafeStoryRight),
    display: px(T.twoSocialFontSizeStoryDisplay),
    figure: px(T.twoSocialFontSizeStoryFigure),
    body: px(T.twoSocialFontSizeStoryBody),
    label: px(T.twoSocialFontSizeStoryLabel),
    logo: px(T.twoSocialSizeLogoStory),
    action: px(T.twoSocialSizeActionStory),
    gap: px(T.twoSpace7),
    gapS: px(T.twoSpace4),
    pad: px(T.twoSpace8),
    row: px(T.twoSpace10),
  },
};

/**
 * The renderer checks this marker's position to catch vertical overflow: it must end
 * inside the safe area. It is stripped from the SVG before rasterising.
 */
export const SENTINEL = "#010203";
/** Painted behind the title box and each title word, so the renderer can catch a word wider than its line. */
export const TITLE_MARK = "#010205";
export const WORD_MARK = "#010204";

function el(type, style, children) {
  return { type, props: { style, children } };
}

function img(src, style) {
  return { type: "img", props: { src, style } };
}

function text(value, style) {
  return el("div", { display: "flex", ...style }, value);
}

function label(s, value, color = T.twoColorTextTertiary) {
  return text(value, {
    fontFamily: FONT.data,
    fontSize: s.label,
    lineHeight: T.twoLineHeightLabel,
    letterSpacing: T.twoTrackingLabel,
    color,
  });
}

function tag(s, value, color = T.twoColorTextTertiary, background = "transparent") {
  return el(
    "div",
    {
      display: "flex",
      fontFamily: FONT.data,
      fontSize: s.label,
      lineHeight: 1,
      letterSpacing: T.twoTrackingLabel,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      color,
      backgroundColor: background,
      border: `2px solid ${T.twoColorLineHairlineStrong}`,
      borderRadius: T.twoRadiusS,
      padding: `${px(T.twoSpace2) + s.label * 0.1}px ${T.twoSpace3}`,
    },
    value,
  );
}

/** Two-tone title: the statement in text.primary, one serif phrase in text.accent. */
function title(s, { text: statement, accent }, size = s.display) {
  const words = [
    ...statement.split(" ").map((w) => ({ w, accent: false })),
    ...(accent ? accent.split(" ").map((w) => ({ w, accent: true })) : []),
  ];
  return el(
    "div",
    {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "baseline",
      color: T.twoColorTextPrimary,
      lineHeight: T.twoLineHeightDisplay,
      backgroundColor: TITLE_MARK,
    },
    words.map(({ w, accent: a }, i) =>
      el(
        "span",
        {
          fontFamily: a ? FONT.accent : FONT.display,
          fontStyle: a ? "italic" : "normal",
          fontWeight: a ? T.twoFontWeightRegular : T.twoFontWeightSemibold,
          fontSize: a ? Math.round(size * 1.1) : size,
          letterSpacing: a ? 0 : T.twoTrackingDisplay,
          color: a ? T.twoColorTextAccent : T.twoColorTextPrimary,
          marginRight: i === words.length - 1 ? 0 : Math.round(size * 0.24),
          backgroundColor: WORD_MARK,
          lineHeight: a ? 0.9 : T.twoLineHeightDisplay,
        },
        w,
      ),
    ),
  );
}

/** Brand row. A long kind tag (the recap week) moves above the title in story. */
function header(s, ctx, kindLabel, fixture) {
  return el(
    "div",
    { display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 },
    [
      el("div", { display: "flex", alignItems: "center", gap: s.gapS }, [
        img(ctx.icon, { width: s.logo, height: s.logo }),
        text("Together We Own", {
          whiteSpace: "nowrap",
          fontFamily: FONT.ui,
          fontWeight: T.twoFontWeightSemibold,
          fontSize: s.body,
          letterSpacing: T.twoTrackingH3,
        }),
      ]),
      el("div", { display: "flex", gap: s.gapS }, [
        fixture ? tag(s, "Fixture", T.twoColorStateWarn, T.twoColorStateWarnBg) : null,
        kindLabel ? tag(s, kindLabel) : null,
      ]),
    ],
  );
}

/**
 * Title block: grows to fill the free space and sits on its floor. It never shrinks, so
 * a title too long for the space pushes the footer marker out (the overflow guard).
 */
function heading(s, title_, kindLabel, inRow = false) {
  return el(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      gap: s.gap,
      flexGrow: 1,
      flexShrink: 0,
      ...(inRow ? { flexBasis: 0, minWidth: 0, flexShrink: 1 } : {}),
    },
    [kindLabel ? el("div", { display: "flex" }, [tag(s, kindLabel)]) : null, title(s, title_)],
  );
}

/** The printed action: the one ember surface on the card. */
function action(s, label_, link, full = false) {
  return el(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      alignItems: full ? "stretch" : "flex-start",
      gap: px(T.twoSpace3),
      flexShrink: 0,
    },
    [
      el(
        "div",
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: s.action,
          padding: `0 ${s.action * 0.45}px`,
          borderRadius: T.twoRadiusPill,
          backgroundColor: T.twoColorAccentDefault,
          color: T.twoColorTextOnAccent,
          fontFamily: FONT.ui,
          fontWeight: T.twoFontWeightSemibold,
          fontSize: s.body,
        },
        label_,
      ),
      label(s, formatLink(link), T.twoColorTextSecondary),
    ],
  );
}

function footer(s, aiImage) {
  return el("div", { display: "flex", flexDirection: "column", flexShrink: 0 }, [
    text(aiImage ? `${AI_IMAGE_LABEL} · ${FOOTER}` : FOOTER, {
      fontFamily: FONT.ui,
      fontSize: s.label,
      lineHeight: T.twoLineHeightLabel,
      color: T.twoColorTextTertiary,
    }),
    el("div", { display: "flex", height: 1, width: 1, backgroundColor: SENTINEL }, null),
  ]);
}

function card(s, children, style = {}) {
  return el(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      backgroundColor: T.twoColorBgSurface,
      border: `2px solid ${T.twoColorLineHairline}`,
      borderRadius: T.twoRadiusL,
      padding: s.pad,
      flexShrink: 0,
      ...style,
    },
    children,
  );
}

function root(s, children) {
  return el(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      width: s.width,
      height: s.height,
      boxSizing: "border-box",
      paddingTop: s.top,
      paddingBottom: s.bottom,
      paddingLeft: s.left,
      paddingRight: s.right,
      backgroundColor: T.twoColorBgCanvas,
      color: T.twoColorTextPrimary,
      fontFamily: FONT.ui,
      gap: s.gap,
    },
    children,
  );
}

function artPanel(s, ctx, style) {
  return el(
    "div",
    {
      display: "flex",
      position: "relative",
      borderRadius: T.twoRadiusL,
      overflow: "hidden",
      backgroundColor: T.twoColorBgOverlay,
      flexShrink: 0,
      ...style,
    },
    [
      img(ctx.art, { width: "100%", height: "100%", objectFit: "cover" }),
      ctx.artPlaceholder
        ? el(
            "div",
            {
              display: "flex",
              position: "absolute",
              left: s.gapS,
              bottom: s.gapS,
            },
            [tag(s, "Art placeholder", T.twoColorTextPrimary, T.twoColorBgCanvas)],
          )
        : null,
    ],
  );
}

function eventFacts(s, card_, stacked) {
  const when = formatWhen(card_.when);
  const sub = [when.anchor, card_.count ? formatCount(card_.count) : null].filter(Boolean);
  const figure = {
    fontFamily: FONT.ui,
    fontWeight: T.twoFontWeightMedium,
    fontSize: s.figure,
    lineHeight: 1,
    letterSpacing: T.twoTrackingH3,
  };
  return card(s, [
    stacked
      ? el("div", { display: "flex", flexDirection: "column", gap: px(T.twoSpace3) }, [
          text(when.date, figure),
          text(when.time, figure),
        ])
      : text(`${when.date} · ${when.time}`, figure),
    sub.length
      ? el("div", { display: "flex", marginTop: s.gapS }, [label(s, sub.join(" · "))])
      : null,
  ]);
}

/** Event announcement. Art shows in the landscape crop only (docs/social.md §5). */
export function eventAnnouncement(card_, size, ctx) {
  const s = SIZE[size];
  const act = ACTIONS["event-announcement"][card_.link.kind];
  const hasArt = Boolean(card_.art && ctx.art) && size === "landscape";
  if (size === "landscape") {
    const top = hasArt
      ? el("div", { display: "flex", gap: s.gap, flexGrow: 1, flexShrink: 0 }, [
          heading(s, card_.title, null, true),
          artPanel(s, ctx, { width: s.art }),
        ])
      : heading(s, card_.title);
    return root(s, [
      header(s, ctx, "Event", card_.fixture),
      top,
      el("div", { display: "flex", gap: s.gap, alignItems: "flex-end", flexShrink: 0 }, [
        el("div", { display: "flex", flexGrow: 1 }, [eventFacts(s, card_, false)]),
        action(s, act, card_.link.url),
      ]),
      footer(s, hasArt && card_.disclosure.aiGeneratedImagery),
    ]);
  }
  return root(s, [
    header(s, ctx, "Event", card_.fixture),
    heading(s, card_.title),
    eventFacts(s, card_, true),
    action(s, act, card_.link.url, true),
    footer(s, false),
  ]);
}

/** Highlights print in date order, whatever order the data has. */
const byDay = (list) => [...list].sort((a, b) => a.day.localeCompare(b.day));

/**
 * Highlight rows. Landscape: date, name and count on one line. Story: a card label with the
 * week, then each row's date and count above its name, so the name gets the full width.
 */
function highlightRows(s, card_, stacked) {
  const zone = card_.week.zone;
  const day = (h) => formatDay(h.day, zone).toUpperCase();
  const name = (h) =>
    text(h.title, {
      fontWeight: T.twoFontWeightMedium,
      fontSize: s.body,
      lineHeight: T.twoLineHeightTitle,
    });
  const rows = byDay(card_.highlights).map((h, i) =>
    el(
      "div",
      {
        display: "flex",
        flexDirection: stacked ? "column" : "row",
        alignItems: stacked ? "flex-start" : "center",
        gap: stacked ? px(T.twoSpace1) : s.gap,
        minHeight: s.row,
        paddingTop: stacked ? px(T.twoSpace3) : px(T.twoSpace1),
        paddingBottom: stacked ? px(T.twoSpace3) : px(T.twoSpace1),
        borderTop: i === 0 ? "none" : `2px solid ${T.twoColorLineHairline}`,
      },
      stacked
        ? [
            label(
              s,
              [day(h), h.count ? formatCount(h.count).toUpperCase() : null]
                .filter(Boolean)
                .join(" · "),
            ),
            name(h),
          ]
        : [
            el("div", { display: "flex", width: s.label * 7.2, flexShrink: 0 }, [label(s, day(h))]),
            el("div", { display: "flex", flexGrow: 1, flexBasis: 0, minWidth: 0 }, [name(h)]),
            h.count ? label(s, formatCount(h.count), T.twoColorTextSecondary) : null,
          ],
    ),
  );
  return card(
    s,
    stacked
      ? [
          el("div", { display: "flex", paddingBottom: px(T.twoSpace2) }, [
            label(s, formatWeek(card_.week).toUpperCase()),
          ]),
          ...rows,
        ]
      : rows,
    { paddingTop: s.pad / 2, paddingBottom: s.pad / 2 },
  );
}

function stats(s, card_, row) {
  const list = card_.stats ?? [];
  if (list.length === 0) return null;
  return el(
    "div",
    {
      display: "flex",
      flexDirection: row ? "row" : "column",
      gap: row ? s.gap * 2 : px(T.twoSpace3),
      flexShrink: 0,
    },
    list.map((st) =>
      el("div", { display: "flex", alignItems: "baseline", gap: px(T.twoSpace3) }, [
        text(String(st.value), {
          fontWeight: T.twoFontWeightMedium,
          fontSize: s.figure,
          lineHeight: 1,
          letterSpacing: T.twoTrackingFigure,
        }),
        label(s, st.noun, T.twoColorTextSecondary),
      ]),
    ),
  );
}

/** Weekly recap: up to 3 highlights and 2 stats. */
export function weeklyRecap(card_, size, ctx) {
  const s = SIZE[size];
  const act = ACTIONS["weekly-recap"][card_.link.kind];
  const week = formatWeek(card_.week);
  if (size === "landscape") {
    return root(s, [
      header(s, ctx, week, card_.fixture),
      heading(s, card_.title),
      el("div", { display: "flex", gap: s.gap, alignItems: "stretch", flexShrink: 0 }, [
        el("div", { display: "flex", flexGrow: 1, flexDirection: "column" }, [
          highlightRows(s, card_, false),
        ]),
        el(
          "div",
          {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: px(T.twoLayoutRailDefault),
            flexShrink: 0,
          },
          [stats(s, card_, false), action(s, act, card_.link.url)],
        ),
      ]),
      footer(s, false),
    ]);
  }
  return root(s, [
    header(s, ctx, null, card_.fixture),
    heading(s, card_.title),
    stats(s, card_, true),
    highlightRows(s, card_, true),
    action(s, act, card_.link.url, true),
    footer(s, false),
  ]);
}

export const TEMPLATE = {
  "event-announcement": eventAnnouncement,
  "weekly-recap": weeklyRecap,
};

/** Alt text the publisher attaches wherever the platform takes it. */
export function altText(card_) {
  const heading = [card_.title.text, card_.title.accent].filter(Boolean).join(" ");
  const act = ACTIONS[card_.template][card_.link.kind];
  const link = formatLink(card_.link.url);
  if (card_.template === "event-announcement") {
    const when = formatWhen(card_.when);
    const count = card_.count ? ` ${formatCount(card_.count)}.` : "";
    const art = card_.art?.alt ? ` Image: ${card_.art.alt}` : "";
    return `Together We Own event. ${heading}. ${when.long}.${count} ${act} at ${link}.${art}`;
  }
  const rows = byDay(card_.highlights)
    .map(
      (h) =>
        `${formatDay(h.day, card_.week.zone)}: ${h.title}${h.count ? `, ${formatCount(h.count)}` : ""}`,
    )
    .join("; ");
  const st = (card_.stats ?? []).map((x) => `${x.value} ${x.noun}`).join(", ");
  return `Together We Own, ${formatWeek(card_.week).toLowerCase()}. ${heading}. ${rows}.${st ? ` ${st}.` : ""} ${act} at ${link}.`;
}
