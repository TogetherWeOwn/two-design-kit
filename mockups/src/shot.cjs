// usage: REPO=<repo> node shot.cjs <html> <outprefix>
const { chromium } = require(process.env.REPO + "/node_modules/playwright");
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
