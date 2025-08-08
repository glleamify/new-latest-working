const express = require("express");
const { scrapeFiverrRetell } = require("./scrapeLogic");
const app = express();

const PORT = process.env.PORT || 4000;

// Endpoint to trigger the Fiverr Retell AI search and screenshot
app.get("/search", async (req, res) => {
  try {
    await scrapeFiverrRetell();
    res.send("Screenshot of Fiverr Retell AI search captured successfully!");
  } catch (error) {
    console.error("Scraping failed:", error);
    res.status(500).send("An error occurred during scraping.");
  }
});

// Root endpoint to confirm server is running
app.get("/", (req, res) => {
  res.send("Fiverr Retell AI scraper is live!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
