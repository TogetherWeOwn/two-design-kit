// Usage: node shot.cjs <page>.html <out-prefix>. Same setup as axe.cjs.
const REPO = process.env.REPO || require("path").resolve(__dirname, "../..");
const { chromium } = require(REPO + "/node_modules/playwright");
void (async () => {
  const [, , file, out] = process.argv;
  const b = await chromium.launch({
    executablePath: process.env.CHROMIUM || undefined,
  });
  for (const [w, h, tag, mobile] of [
    [1280, 800, "1280", false],
    [390, 844, "390", true],
  ]) {
    const ctx = await b.newContext({
      viewport: { width: w, height: h },
      deviceScaleFactor: 1,
      isMobile: mobile,
      hasTouch: mobile,
      reducedMotion: "reduce",
    });
    const p = await ctx.newPage();
    await p.goto("file://" + require("path").resolve(file));
    await p.evaluate(() => document.fonts.ready);
    const broken = await p.evaluate(() =>
      [...document.fonts]
        .filter((f) => f.status === "error")
        .map((f) => `${f.family} ${f.style} ${f.weight}`),
    );
    if (broken.length) throw new Error(`font load failed: ${broken.join(", ")}`);
    await p.waitForTimeout(250);
    await p.screenshot({ path: `${out}-${tag}.png` });
    await p.screenshot({ path: `${out}-${tag}-full.png`, fullPage: true });
    const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    console.log(
      out,
      tag,
      "overflow-x",
      ov,
      "height",
      await p.evaluate(() => document.documentElement.scrollHeight),
    );
    await ctx.close();
  }
  await b.close();
})();
