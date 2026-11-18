// Gera assets/downloads/Portfolio-Grupo-Itasul.pdf, assets/img/og-portfolio.jpg (a partir de portfolio.html)
// e assets/downloads/Cuidados-das-Mudas-Grupo-Itasul.pdf (a partir de cuidados-mudas.html).
// Uso:  npm i playwright   (uma vez)   e depois   node tools/gerar-portfolio-pdf.mjs
// Rode de novo sempre que o portfólio, as fotos ou os contatos (assets/js/main.js) mudarem.
import { chromium } from "playwright";
import http from "http"; import fs from "fs"; import path from "path"; import { fileURLToPath } from "url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
  fs.readFile(path.join(root, p), (e, d) => { if (e) { r.statusCode = 404; return r.end(); } r.setHeader("content-type", types[path.extname(p)] || "application/octet-stream"); r.end(d); });
}).listen(0);
const port = srv.address().port;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(`http://localhost:${port}/portfolio.html`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
// imagem de pré-visualização (WhatsApp/redes): a capa, sem o menu
await page.addStyleTag({ content: ".header,.whatsapp-float,.pf-index,.pf-facts{display:none!important}.pf-hero{padding-top:56px!important;min-height:630px}" });
await page.screenshot({ path: path.join(root, "assets/img/og-portfolio.jpg"), type: "jpeg", quality: 86, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await page.reload({ waitUntil: "networkidle" });
await page.emulateMedia({ media: "print" });
await page.pdf({ path: path.join(root, "assets/downloads/Portfolio-Grupo-Itasul.pdf"), format: "A4", printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
// PDF dos cuidados das mudas
const care = await browser.newPage({ viewport: { width: 1200, height: 900 } });
await care.goto(`http://localhost:${port}/cuidados-mudas.html`, { waitUntil: "networkidle" });
await care.evaluate(() => document.fonts.ready);
await care.waitForTimeout(800);
await care.emulateMedia({ media: "print" });
await care.pdf({ path: path.join(root, "assets/downloads/Cuidados-das-Mudas-Grupo-Itasul.pdf"), format: "A4", printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
await browser.close(); srv.close();
console.log("ok");
