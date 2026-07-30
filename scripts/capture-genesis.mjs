import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

const output = "/private/tmp/ork-genesis-frames";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  args: ["--disable-gpu-vsync", "--hide-scrollbars"],
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:3001/?film=1", { waitUntil: "networkidle" });
await page.waitForSelector(".orkGenesis");
await page.evaluate(() => {
  document.getAnimations().forEach((animation) => animation.pause());
});
const frames = 300;
for (let frame = 0; frame < frames; frame += 1) {
  const time = (frame / frames) * 10000;
  await page.evaluate((currentTime) => {
    document.getAnimations().forEach((animation) => {
      animation.currentTime = currentTime;
    });
  }, time);
  await page.screenshot({
    path: `${output}/frame-${String(frame).padStart(4, "0")}.png`,
    type: "png",
  });
  if (frame % 30 === 0) console.log(`Rendered ${frame}/${frames}`);
}
await browser.close();
console.log(output);
