const http = require("http");
const puppeteer = require("puppeteer");

const config = require("./config");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/google-chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(config.userAgent);

  const keepAlive = async () => {
    for (const url of config.urls) {
      try {
        console.log(`Visiting: ${url}`);
        await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
        console.log(`Successfully visited: ${url}`);
      } catch (error) {
        console.error(`Error visiting ${url}:`, error.message);
      }
    }
  };

  setInterval(async () => {
    console.log(`Running keep-alive tasks...`);
    await keepAlive();
  }, config.interval);

  await keepAlive();
})();

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
