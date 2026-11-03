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
