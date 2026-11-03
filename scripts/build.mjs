// Token build: W3C DTCG (tokens/*.tokens.json) -> CSS, TypeScript, Rust.
// Run: npm run build (or OUT_DIR=<dir> node scripts/build.mjs for the drift check).
import StyleDictionary from "style-dictionary";
import { pathToFileURL } from "node:url";
import { source, platformFiles } from "../sd.config.mjs";

const HEADER = "DO NOT EDIT: generated from tokens/*.tokens.json by `npm run build`.";

function resolvedValue(token) {
  return token.value ?? token.$value;
}

function tokenType(token) {
  return token.type ?? token.$type ?? "other";
}

function serializeCss(token) {
  const value = resolvedValue(token);
  const type = tokenType(token);
  if (type === "dimension" && typeof value === "number") return `${value}px`;
  if (type === "duration" && typeof value === "number") return `${value}ms`;
  if (type === "fontFamily" && Array.isArray(value)) return value.join(", ");
  if (type === "cubicBezier" && Array.isArray(value)) return `cubic-bezier(${value.join(", ")})`;
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

function cssVarName(token) {
  // Site role aliases drop the leading `role` segment: role.page -> --two-page.
  const path = token.path[0] === "role" ? token.path.slice(1) : token.path;
  return `--two-${path.join("-")}`;
}

function tsConstName(token) {
  const path = token.path[0] === "role" ? token.path.slice(1) : token.path;
  const camel = path
    .flatMap((segment) => String(segment).split("-"))
    .map((word, i) => (i === 0 ? word : word[0].toUpperCase() + word.slice(1)))
    .join("");
  return `two${camel[0].toUpperCase() + camel.slice(1)}`;
}

function serializeTs(token) {
  const value = resolvedValue(token);
  const type = tokenType(token);
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") {
    if (type === "dimension") return JSON.stringify(`${value}px`);
    if (type === "duration") return JSON.stringify(`${value}ms`);
    return String(value);
  }
  if (Array.isArray(value)) {
    if (type === "fontFamily") return JSON.stringify(value.join(", "));
    if (type === "cubicBezier") return JSON.stringify(`cubic-bezier(${value.join(", ")})`);
    return JSON.stringify(value.join(", "));
  }
  return JSON.stringify(String(value));
}

function rustConstName(token) {
  const path = token.path[0] === "role" ? token.path.slice(1) : token.path;
  return `BRAND_${path.join("_").replaceAll("-", "_").toUpperCase()}`;
}

function isOpaqueHex(value) {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
}

function cssFormat({ dictionary }) {
  const lines = [
    `/* ${HEADER} */`,
    `/* Ember Hours theme. Dark only for v1: color-scheme stays dark, light roles can be added later. */`,
    ":root {",
    "  color-scheme: dark;",
  ];
  for (const token of dictionary.allTokens) {
    lines.push(`  ${cssVarName(token)}: ${serializeCss(token)};`);
  }
  lines.push("}");
  lines.push("");
  lines.push("/* Reduced-motion layer: under reduce, nothing moves. */");
  lines.push("@media (prefers-reduced-motion: reduce) {");
  lines.push("  :root {");
  for (const token of dictionary.allTokens) {
    if (tokenType(token) === "duration") lines.push(`    ${cssVarName(token)}: 0ms;`);
    if (tokenType(token) === "cubicBezier") lines.push(`    ${cssVarName(token)}: linear;`);
  }
  lines.push("  }");
  lines.push("}");
  lines.push("");
  return lines.join("\n");
}

function tsFormat({ dictionary }) {
  const lines = [
    `// ${HEADER}`,
    "// Typed, tree-shakeable tokens for two-web-next. Import single consts,",
    "// never the whole file, so bundlers drop what a route does not use.",
    "",
  ];
  const tree = {};
  for (const token of dictionary.allTokens) {
    const name = tsConstName(token);
    const value = serializeTs(token);
    if (token.description) lines.push(`/** ${token.description} */`);
    lines.push(`export const ${name} = ${value} as const;`);
    const segments = token.path[0] === "role" ? token.path.slice(1) : token.path;
    let node = tree;
    for (const segment of segments.slice(0, -1)) node = node[segment] ??= {};
    node[segments.at(-1)] = `__REF__${name}`;
  }
  lines.push("");
  lines.push("export const tokens = {");
  const render = (node, indent) => {
    for (const [key, child] of Object.entries(node)) {
      if (typeof child === "string")
        lines.push(`${indent}${JSON.stringify(key)}: ${child.slice(7)},`);
      else {
        lines.push(`${indent}${JSON.stringify(key)}: {`);
        render(child, `${indent}  `);
        lines.push(`${indent}},`);
      }
    }
  };
  render(tree, "  ");
  lines.push("} as const;");
  lines.push("");
  const names = dictionary.allTokens.map((token) => tsConstName(token));
  lines.push(`export type TokenName = ${names.map((name) => JSON.stringify(name)).join(" | ")};`);
  lines.push("");
  lines.push("export const tokenNames = [");
  for (const name of names) lines.push(`  ${JSON.stringify(name)},`);
  lines.push("] as const;");
  lines.push("");
  return lines.join("\n");
}

function rustFormat({ dictionary }) {
  const lines = [
    `//! ${HEADER}`,
    "//! Brand colours as `u32` for Discord embeds, plus motion and spacing",
    "//! scalars. Vendored into two-bot-next: see README.",
    "",
  ];
  let skipped = 0;
  for (const token of dictionary.allTokens) {
    const value = resolvedValue(token);
    const type = tokenType(token);
    const name = rustConstName(token);
    if (token.description) lines.push(`/// ${token.description}`);
    if (type === "color" && isOpaqueHex(value)) {
      lines.push(`pub const ${name}: u32 = 0x${value.slice(1).toUpperCase()};`);
    } else if (type === "duration" && typeof value === "number") {
      lines.push(`pub const ${name}_MS: u64 = ${value};`);
    } else if (type === "dimension" && typeof value === "number") {
      lines.push(`pub const ${name}_PX: u32 = ${value};`);
    } else {
      skipped += 1;
    }
  }
  lines.push("");
  lines.push(`// ${skipped} token(s) have no Rust scalar form (fluid sizes, font stacks,`);
  lines.push("// translucent hairlines, easing curves) and stay web-only.");
  lines.push("");
  return lines.join("\n");
}

StyleDictionary.registerTransform({
  // Unique names silence SD's collision check; formats name outputs per platform.
  name: "name/two-unique",
  type: "name",
  transform: (token) => token.path.join("-"),
});
StyleDictionary.registerFormat({ name: "css/two-tokens", format: cssFormat });
StyleDictionary.registerFormat({ name: "ts/two-tokens", format: tsFormat });
StyleDictionary.registerFormat({ name: "rust/brand-tokens", format: rustFormat });

export async function build(outDir = "dist") {
  const root = outDir.endsWith("/") ? outDir : `${outDir}/`;
  const platforms = Object.fromEntries(
    Object.entries(platformFiles).map(([name, files]) => [
      name,
      { transforms: ["name/two-unique"], buildPath: `${root}${name}/`, files },
    ]),
  );
  const sd = new StyleDictionary({ source, platforms });
  await sd.buildAllPlatforms();
}

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) await build(process.env.OUT_DIR ?? "dist");
