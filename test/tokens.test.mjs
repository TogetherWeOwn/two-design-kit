// Token output acceptance: the committed dist/ carries the Ember Hours
// seed end to end on every platform. Run after `npm run build`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile("dist/css/tokens.css", "utf8");
const ts = await readFile("dist/ts/tokens.ts", "utf8");
const rust = await readFile("dist/rust/brand_tokens.rs", "utf8");

test("css exposes primitives, aliases and the reduced-motion layer", () => {
  assert.match(css, /:root\s*\{/);
  assert.match(css, /color-scheme:\s*dark/);
  assert.match(css, /--two-color-ground-0:\s*#15100f/i);
  assert.match(css, /--two-color-ember:\s*#ff9c36/i);
  assert.match(css, /--two-page:\s*#15100f/i);
  assert.match(css, /--two-motion-duration-base:\s*160ms/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /--two-motion-duration-base:\s*0ms/);
});

test("typescript is typed and tree-shakeable", () => {
  assert.match(ts, /export const twoColorEmber = "#ff9c36" as const/i);
  assert.match(ts, /export const twoPage = /);
  assert.match(ts, /export const tokens = \{/);
  assert.match(ts, /export type TokenName = /);
  assert.match(ts, /export const tokenNames = \[/);
});

test("rust exposes embed colours as u32", () => {
  assert.match(rust, /pub const BRAND_COLOR_EMBER: u32 = 0xFF9C36;/);
  assert.match(rust, /pub const BRAND_COLOR_GROUND_0: u32 = 0x15100F;/);
  assert.match(rust, /pub const BRAND_COLOR_ECHO: u32 = 0x9D6AFF;/);
  assert.match(rust, /pub const BRAND_MOTION_DURATION_BASE_MS: u64 = 160;/);
  assert.match(rust, /pub const BRAND_PAGE: u32 = 0x15100F;/);
});

test("css exposes the Ember Hours colour roles components use", () => {
  assert.match(css, /--two-color-bg-canvas:\s*#15100f/i);
  assert.match(css, /--two-color-bg-overlay:\s*#2e2420/i);
  assert.match(css, /--two-color-text-tertiary:\s*#a89a8e/i);
  assert.match(css, /--two-color-line-control:\s*#85766b/i);
  assert.match(css, /--two-color-state-live:\s*#ff5c7e/i);
  assert.match(css, /--two-color-state-echo-bg:\s*#261c3c/i);
  assert.match(css, /--two-color-focus-ring:\s*#ff9c36/i);
  assert.match(
    css,
    /--two-gradient-brand:\s*linear-gradient\(180deg, #ff9c36 0%, #ff0e52 52\.12%, #5701ae 100%\)/i,
  );
  assert.match(css, /--two-tracking-label:\s*0\.04em/);
  assert.match(css, /--two-size-control-sm:\s*36px/);
});

test("font.ui is the body stack and stays an alias of font.display", () => {
  assert.match(css, /--two-font-ui:\s*Mona Sans, system-ui, sans-serif;/);
  assert.match(ts, /export const twoFontUi = "Mona Sans, system-ui, sans-serif" as const;/);
  const display = css.match(/--two-font-display:\s*([^;]+);/)[1];
  const ui = css.match(/--two-font-ui:\s*([^;]+);/)[1];
  assert.equal(ui, display);
});

test("rust exposes one embed colour per meaning", () => {
  assert.match(rust, /pub const BRAND_DISCORD_EMBED_DEFAULT: u32 = 0xFF9C36;/);
  assert.match(rust, /pub const BRAND_DISCORD_EMBED_LIVE: u32 = 0xFF5C7E;/);
  assert.match(rust, /pub const BRAND_DISCORD_EMBED_ECHO: u32 = 0x9D6AFF;/);
  assert.match(rust, /pub const BRAND_DISCORD_EMBED_OK: u32 = 0x5FD39A;/);
  assert.match(rust, /pub const BRAND_DISCORD_EMBED_WARN: u32 = 0xF2C14E;/);
  assert.match(rust, /pub const BRAND_DISCORD_EMBED_DANGER: u32 = 0xFF7A6B;/);
  assert.match(rust, /pub const BRAND_DISCORD_EMBED_NEUTRAL: u32 = 0x85766B;/);
});

test("live-data poll cadence is not zeroed by the reduced-motion layer", () => {
  const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
  assert.doesNotMatch(reduced, /--two-motion-poll-/);
  assert.match(css, /--two-motion-poll-live:\s*30000;/);
});

test("workbench provenance roles are distinct and every tier has a stroke pattern", () => {
  const value = (name) => css.match(new RegExp(`--two-${name}:\\s*([^;]+);`))?.[1]?.toLowerCase();
  const tiers = ["proposed", "auto", "reviewed", "uncertain", "rejected"];
  const colours = tiers.map((t) => value(`color-label-${t}`));
  assert.ok(colours.every(Boolean), "every tier has a colour role");
  assert.equal(new Set(colours).size, tiers.length, "no two tiers share a colour");
  assert.notEqual(
    value("color-label-proposed"),
    value("color-focus-ring"),
    "proposed never looks selected",
  );
  assert.equal(value("color-bg-well"), "#121212");
  assert.equal(value("color-label-halo"), value("color-bg-well"));
  for (const t of ["proposed", "auto", "reviewed", "uncertain", "ghost"])
    assert.ok(value(`box-dash-${t}`), `box.dash.${t} exists`);
  assert.notEqual(value("box-dash-proposed"), value("box-dash-uncertain"));
  assert.match(rust, /pub const BRAND_COLOR_LABEL_AUTO: u32 = 0x7FB2FF;/);
});
