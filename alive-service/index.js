const puppeteer = require("puppeteer");
const config = require("./config");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();
  await page.setUserAgent(config.userAgent);

  const keepAlive = async () => {
    for (const url of config.urls) {
      try {
        console.log(`Visiting: ${url}`);
        await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 }); // Tiempo de espera máximo: 1 min.
        console.log(`Successfully visited: ${url}`);
      } catch (error) {
        console.error(`Error visiting ${url}:`, error.message);
      }
    }
  };

  // Ejecuta cada N minutos.
  setInterval(async () => {
    console.log(`Running keep-alive tasks...`);
    await keepAlive();
  }, config.interval);

  // Ejecuta la primera vez inmediatamente.
  await keepAlive();
})();
