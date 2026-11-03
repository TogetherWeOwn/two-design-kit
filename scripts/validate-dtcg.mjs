// Validates tokens/*.tokens.json against the W3C Design Tokens (DTCG) shape:
// every leaf has $value, every $type is known or inherited, every {reference}
// resolves, and values match their type. Fails with a message per defect.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const KNOWN_TYPES = new Set([
  "color",
  "dimension",
  "fontFamily",
  "fontWeight",
  "duration",
  "cubicBezier",
  "number",
  "other",
]);

const REF = /\{([^}]+)\}/g;

function isTokenObject(node) {
  return typeof node === "object" && node !== null && !Array.isArray(node);
}

function collectFiles(dir) {
  return readdir(dir).then((names) =>
    names.filter((name) => name.endsWith(".tokens.json")).map((name) => path.join(dir, name)),
  );
}

function walk(node, trail, inheritedType, leaves, refs) {
  const type = node.$type ?? inheritedType;
  const children = Object.entries(node).filter(([key]) => !key.startsWith("$"));
  const isLeaf = "$value" in node;
  if (isLeaf) {
    leaves.push({ trail: trail.join("."), node, type });
    for (const match of String(node.$value).matchAll(REF))
      refs.push({ from: trail.join("."), to: match[1] });
  }
  for (const [key, child] of children) {
    if (isTokenObject(child)) walk(child, [...trail, key], type, leaves, refs);
  }
  return { leaves, refs };
}

function checkValue(leaf) {
  const { trail, node, type } = leaf;
  const value = node.$value;
  const fail = (why) => `${trail}: ${why}`;
  if (!type) return fail("no $type on the token or any ancestor group");
  if (!KNOWN_TYPES.has(type)) return fail(`unknown $type ${JSON.stringify(type)}`);
  if (typeof value === "string" && value.includes("{")) return null; // references checked separately
  switch (type) {
    case "color":
      if (typeof value !== "string" || !/^(#[0-9a-f]{6}|rgba?\([^)]+\))$/i.test(value))
        return fail(`color must be #rrggbb or rgb()/rgba(), got ${JSON.stringify(value)}`);
      return null;
    case "dimension":
      if (typeof value !== "number" && typeof value !== "string")
        return fail(
          `dimension must be a number (px) or a CSS string, got ${JSON.stringify(value)}`,
        );
      if (typeof value === "number" && value < 0) return fail("dimension must be >= 0");
      return null;
    case "duration":
      if (typeof value !== "number" || value < 0)
        return fail(`duration must be ms >= 0, got ${JSON.stringify(value)}`);
      return null;
    case "cubicBezier":
      if (!Array.isArray(value) || value.length !== 4 || value.some((n) => typeof n !== "number"))
        return fail("cubicBezier must be 4 numbers");
      if (value[0] < 0 || value[0] > 1 || value[2] < 0 || value[2] > 1)
        return fail("cubicBezier x values must be within 0..1");
      return null;
    case "fontFamily":
      if (!Array.isArray(value) || value.length === 0 || value.some((f) => typeof f !== "string"))
        return fail("fontFamily must be a non-empty string array");
      return null;
    default:
      return null;
  }
}

const files = await collectFiles("tokens");
if (files.length === 0) {
  console.error("validate-dtcg: no tokens/*.tokens.json files found");
  process.exit(1);
}
const errors = [];
const knownPaths = new Set();
const allLeaves = [];
const allRefs = [];
for (const file of files) {
  const doc = JSON.parse(await readFile(file, "utf8"));
  const { leaves, refs } = walk(doc, [], undefined, [], []);
  for (const leaf of leaves) {
    knownPaths.add(leaf.trail);
    allLeaves.push(leaf);
    const problem = checkValue(leaf);
    if (problem) errors.push(`${path.basename(file)}: ${problem}`);
  }
  allRefs.push(...refs);
}
for (const ref of allRefs) {
  if (!knownPaths.has(ref.to)) errors.push(`${ref.from}: unresolvable reference {${ref.to}}`);
}
if (allLeaves.length === 0)
  errors.push("no tokens found: every file needs at least one $value leaf");
if (errors.length > 0) {
  for (const error of errors) console.error(`validate-dtcg: ${error}`);
  process.exit(1);
}
console.log(
  `validate-dtcg: ${allLeaves.length} tokens in ${files.length} files, ${allRefs.length} references, all valid.`,
);
