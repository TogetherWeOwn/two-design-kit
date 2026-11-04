// Render social cards: check -> Satori (SVG) -> overflow guard -> resvg (PNG).
// Library: renderCard(card, size, options). CLI: `npm run social:render` renders every
// fixture in social/fixtures/ to social/previews/ (needs `npm run social:fonts` first).
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { checkCard, sha256, SIZES } from "./check.mjs";
import { SENTINEL, SIZE, TEMPLATE, TITLE_MARK, WORD_MARK } from "./templates.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Phone preview widths: a 1.91:1 link card in a feed, and a full-screen story. */
export const PREVIEW_WIDTH = { landscape: 340, story: 390 };

export async function loadManifest() {
  return JSON.parse(await readFile(path.join(ROOT, "social/rights/manifest.json"), "utf8"));
}

/** Reads an asset's file, or null when it is missing. */
export async function readAsset(asset) {
  try {
    return await readFile(path.join(ROOT, asset.path));
  } catch {
    return null;
  }
}

export async function loadAssets(manifest) {
  const bytes = new Map();
  for (const a of manifest.assets) bytes.set(a.id, await readAsset(a));
  return bytes;
}

function dataUri(asset, bytes) {
  const type = asset.path.endsWith(".svg") ? "image/svg+xml" : "image/png";
  return `data:${type};base64,${Buffer.from(bytes).toString("base64")}`;
}

/**
 * Render one checked card at one size.
 * @returns {Promise<{ png: Buffer, preview: Buffer, pngSha256: string, check: object }>}
 */
export async function renderCard(card, size, { manifest, assets, allowedHosts, now }) {
  if (!SIZES.includes(size)) throw new Error(`unknown size ${size}`);
  const check = checkCard(card, {
    manifest,
    allowedHosts,
    now,
    resolveAsset: (a) => assets.get(a.id) ?? null,
  });
  if (!check.ok) {
    const err = new Error(`card rejected: ${check.rejections.map((r) => r.code).join(", ")}`);
    err.check = check;
    throw err;
  }
  const byId = (id) => manifest.assets.find((a) => a.id === id);
  const art = card.art ? byId(card.art.assetId) : null;
  const ctx = {
    icon: dataUri(byId("two-icon"), assets.get("two-icon")),
    art: art ? dataUri(art, assets.get(art.id)) : null,
    artPlaceholder: art?.kind === "placeholder",
  };
  const fonts = manifest.assets
    .filter((a) => a.kind === "font")
    .map((a) => ({
      name: a.font.name,
      weight: a.font.weight,
      style: a.font.style,
      data: assets.get(a.id),
    }));
  const s = SIZE[size];
  const svg = await satori(TEMPLATE[card.template](card, size, ctx), {
    width: s.width,
    height: s.height,
    fonts,
  });
  const guard = overflow(svg, s);
  if (guard) {
    const err = new Error(`card rejected: copy-overflow (${guard})`);
    err.check = {
      ...check,
      ok: false,
      rejections: [{ code: "copy-overflow", field: "layout", detail: guard }],
    };
    throw err;
  }
  const clean = svg.replace(
    new RegExp(`<rect[^>]*fill="(${SENTINEL}|${TITLE_MARK}|${WORD_MARK})"[^>]*/>`, "g"),
    "",
  );
  const png = new Resvg(clean, { fitTo: { mode: "original" } }).render().asPng();
  const preview = new Resvg(clean, { fitTo: { mode: "width", value: PREVIEW_WIDTH[size] } })
    .render()
    .asPng();
  return { png, preview, pngSha256: sha256(png), check };
}

const attr = (tag, name) =>
  Number(tag.match(new RegExp(`\\b${name}="([\\d.-]+)"`))?.[1] ?? Number.NaN);

/**
 * Overflow guard. The footer marker must end inside the safe area (Satori drops it when
 * the content runs off the canvas), and no title word may cross its title box.
 */
export function overflow(svg, s) {
  const m = svg.match(new RegExp(`<rect[^>]*fill="${SENTINEL}"[^>]*>`));
  if (!m) return "content runs past the canvas";
  const bottom = attr(m[0], "y") + 1;
  const limit = s.height - s.bottom;
  if (!(bottom <= limit + 0.5))
    return `content ends at ${Math.round(bottom)} px; safe area ends at ${limit} px`;
  const box = svg.match(new RegExp(`<rect[^>]*fill="${TITLE_MARK}"[^>]*>`));
  if (!box) return "title box missing";
  const right = attr(box[0], "x") + attr(box[0], "width");
  for (const w of svg.match(new RegExp(`<rect[^>]*fill="${WORD_MARK}"[^>]*>`, "g")) ?? []) {
    const edge = attr(w, "x") + attr(w, "width");
    if (!(edge <= right + 0.5))
      return `a title word ends at ${Math.round(edge)} px; its line ends at ${Math.round(right)} px`;
  }
  return null;
}

async function main() {
  const manifest = await loadManifest();
  const assets = await loadAssets(manifest);
  const missing = manifest.assets.filter((a) => a.kind === "font" && !assets.get(a.id));
  if (missing.length) {
    console.error(
      `fonts missing: ${missing.map((a) => a.path).join(", ")}. Run npm run social:fonts.`,
    );
    process.exit(1);
  }
  const dir = path.join(ROOT, "social/fixtures");
  const out = path.join(ROOT, "social/previews");
  let failed = 0;
  for (const name of (await readdir(dir)).filter((n) => n.endsWith(".json")).sort()) {
    const fx = JSON.parse(await readFile(path.join(dir, name), "utf8"));
    for (const size of SIZES) {
      const base = `${name.replace(/\.json$/, "")}-${size}`;
      try {
        const r = await renderCard(fx.card, size, {
          manifest,
          assets,
          allowedHosts: fx.allowedHosts,
          now: new Date(fx.now),
        });
        await writeFile(path.join(out, `${base}.png`), r.png);
        await writeFile(path.join(out, `${base}-phone.png`), r.preview);
        console.log(
          `${base}.png  sha256 ${r.pngSha256}  content ${r.check.contentHash.slice(0, 12)}`,
        );
      } catch (e) {
        failed++;
        console.error(`${base}: ${e.message}`);
      }
    }
  }
  if (failed) process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
