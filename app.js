const next = require("next");
const { createServer } = require("http");

const dev = false; // 🚨 paksa production
const app = next({ dev, conf: { distDir: '.next' } });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(process.env.PORT || 3000, "127.0.0.1", () => {
    console.log(`🚀 Running on http://127.0.0.1:${process.env.PORT || 3000}`);
  });
});
