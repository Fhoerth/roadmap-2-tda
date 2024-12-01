const urls = process.env.urls.split(";");

module.exports = {
  urls,
  interval: 5 * 60 * 1000, // 5 minutos en milisegundos
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
};
