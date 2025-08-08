const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrapeFiverrRetell(keyword) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  const page = await browser.newPage();

  // 🧠 Spoof a real browser (important for Fiverr)
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  // 🔗 Go to Fiverr homepage
  await page.goto("https://www.fiverr.com/", {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  // 🐞 Optional: Save HTML to debug
  // const html = await page.content();
  // fs.writeFileSync("fiverr-debug.html", html);

  // 🔎 Wait for search input field
  await page.waitForSelector('input[placeholder*="What service"]', {
    timeout: 60000,
  });

  // 🧠 Type the search keyword
  await page.type('input[placeholder*="What service"]', keyword);
  await page.keyboard.press("Enter");

  // ⏱️ Wait for results to load
  await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 });

  // 📸 Take screenshot
  const screenshotPath = `screenshots/${keyword.replace(/\s/g, "_")}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });

  await browser.close();
  return screenshotPath;
}

module.exports = { scrapeFiverrRetell };
