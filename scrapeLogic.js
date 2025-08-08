const puppeteer = require("puppeteer");
require("dotenv").config();
const fs = require("fs");

const scrapeFiverrRetell = async () => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1024 });

    console.log("Navigating to Fiverr...");
    await page.goto("https://www.fiverr.com/", { waitUntil: "networkidle2" });

    // Accept cookies if prompt appears
    try {
      await page.waitForSelector('[data-testid="dialog-cancel-button"]', {
        timeout: 5000,
      });
      await page.click('[data-testid="dialog-cancel-button"]');
    } catch (e) {
      console.log("No cookie banner detected.");
    }

    // Type "retell ai" into search box
    await page.waitForSelector('input[placeholder="What service are you looking for today?"]');
    await page.type('input[placeholder="What service are you looking for today?"]', "retell ai");
    await page.keyboard.press("Enter");

    // Wait for results page to load
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    // Wait for the first gig to appear
    await page.waitForSelector('[data-testid="gig-card-layout"]', { timeout: 15000 });

    // Take screenshot of search results
    const screenshotPath = "./screenshots/fiverr-retell-ai.png";
    await page.screenshot({ path: screenshotPath, fullPage: true });

    console.log("Screenshot saved to:", screenshotPath);
  } catch (e) {
    console.error("Error during scraping:", e);
    throw e;
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeFiverrRetell };
