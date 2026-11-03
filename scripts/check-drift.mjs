// Drift gate: rebuilds tokens into a temp dir and diffs against the
// committed dist/. Any difference fails: generated files are committed,
// so consumers can vendor them without running the build.
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { build } from "./build.mjs";

async function tree(dir, base = "") {
  const entries = {};
  for (const name of await readdir(path.join(dir, base), { withFileTypes: true })) {
    const rel = path.join(base, name.name);
    if (name.isDirectory()) Object.assign(entries, await tree(dir, rel));
    else entries[rel] = await readFile(path.join(dir, rel), "utf8");
  }
  return entries;
}

const fresh = await mkdtemp(path.join(tmpdir(), "two-design-kit-"));
await build(fresh);
const [want, have] = await Promise.all([tree(fresh), tree("dist")]);
const drift = [];
for (const [file, content] of Object.entries(want)) {
  if (!(file in have)) drift.push(`${file}: missing from committed dist/`);
  else if (have[file] !== content) drift.push(`${file}: differs from committed dist/`);
}
for (const file of Object.keys(have)) {
  if (!(file in want)) drift.push(`${file}: committed but no longer generated`);
}
if (drift.length > 0) {
  for (const line of drift) console.error(`check-drift: ${line}`);
  console.error("check-drift: run `npm run build` and commit the result.");
  process.exit(1);
}
console.log(`check-drift: dist/ matches a fresh build (${Object.keys(want).length} files).`);
