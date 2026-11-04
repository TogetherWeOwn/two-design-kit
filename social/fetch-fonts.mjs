// Fetch the OFL fonts the social renderer needs into social/fonts/ (not committed) and
// verify each against the sha256 in the rights manifest. Run: npm run social:fonts.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sha256 } from "./check.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(path.join(ROOT, "social/rights/manifest.json"), "utf8"));
await mkdir(path.join(ROOT, "social/fonts"), { recursive: true });

let failed = 0;
for (const a of manifest.assets.filter((x) => x.kind === "font")) {
  const file = path.join(ROOT, a.path);
  const have = await readFile(file).catch(() => null);
  if (have && sha256(have) === a.sha256) {
    console.log(`ok      ${a.path}`);
    continue;
  }
  const res = await fetch(a.source);
  const bytes = Buffer.from(await res.arrayBuffer());
  if (!res.ok || sha256(bytes) !== a.sha256) {
    failed++;
    console.error(`FAILED  ${a.path}: HTTP ${res.status}, sha256 ${sha256(bytes)}`);
    continue;
  }
  await writeFile(file, bytes);
  console.log(`fetched ${a.path}`);
}
if (failed) process.exit(1);
