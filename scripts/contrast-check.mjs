// WCAG 2.2 AA contrast gate over the declared colour-role pairs in
// tokens/contrast.json. Text pairs need 4.5:1, non-text pairs 3:1.
// Fails listing every pair under its floor. (The contrast formula is
// unchanged between WCAG 2.0, 2.1 and 2.2 for text.)
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

function flatten(node, trail, out) {
  if (typeof node !== "object" || node === null || Array.isArray(node)) return;
  if ("$value" in node) {
    out[trail.join(".")] = node.$value;
    return;
  }
  for (const [key, child] of Object.entries(node)) {
    if (!key.startsWith("$")) flatten(child, [...trail, key], out);
  }
}

function resolve(value, table, seen = []) {
  const match = typeof value === "string" && value.match(/^\{([^}]+)\}$/);
  if (!match) return value;
  if (seen.includes(match[1]))
    throw new Error(`circular reference: ${[...seen, match[1]].join(" -> ")}`);
  if (!(match[1] in table)) throw new Error(`unresolvable reference {${match[1]}}`);
  return resolve(table[match[1]], table, [...seen, match[1]]);
}

function hexToRgb(hex) {
  const m = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) throw new Error(`not an opaque hex colour: ${hex}`);
  return m.slice(1).map((part) => Number.parseInt(part, 16) / 255);
}

function luminance([r, g, b]) {
  const linear = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function ratio(fg, bg) {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

const table = {};
for (const name of await readdir("tokens")) {
  if (!name.endsWith(".tokens.json")) continue;
  flatten(JSON.parse(await readFile(path.join("tokens", name), "utf8")), [], table);
}
const spec = JSON.parse(await readFile("tokens/contrast.json", "utf8"));
const failures = [];
for (const pair of spec.pairs) {
  const fg = resolve(table[pair.fg], table);
  const bg = resolve(table[pair.bg], table);
  const value = ratio(hexToRgb(fg), hexToRgb(bg));
  const floor = spec.minimums[pair.kind];
  const status = value >= floor ? "pass" : "FAIL";
  console.log(
    `${status} ${value.toFixed(2)}:1 ${pair.fg} on ${pair.bg} (${pair.kind}, floor ${floor})`,
  );
  if (value < floor)
    failures.push(`${pair.fg} on ${pair.bg}: ${value.toFixed(2)}:1 under floor ${floor}`);
}
for (const skip of spec.exclusions ?? []) {
  console.log(`skip ${skip.fg} on ${skip.bg}: ${skip.reason}`);
}
if (failures.length > 0) {
  for (const failure of failures) console.error(`contrast-check: ${failure}`);
  process.exit(1);
}
console.log(`contrast-check: ${spec.pairs.length} pairs pass WCAG 2.2 AA.`);
