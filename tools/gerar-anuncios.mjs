// Gera os 9 anúncios (pôsteres 1080 x 1350, formato feed 4:5) em publicidade/*.png
// Uso:  npm i playwright   e depois   node tools/gerar-anuncios.mjs
// Fotos e logo vêm de assets/img; os recortes das ferramentas ficam em publicidade/recortes (gerados de assets/img).
import { chromium } from "playwright";
import http from "http"; import fs from "fs"; import path from "path"; import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const srv = http.createServer((q, r) => {
  const p = decodeURIComponent(q.url.split("?")[0]);
  fs.readFile(path.join(root, p), (e, d) => { if (e) { r.statusCode = 404; return r.end(); } r.setHeader("content-type", types[path.extname(p)] || "application/octet-stream"); r.end(d); });
}).listen(0);
const port = srv.address().port;

/* ---------------- Marca e contato ---------------- */
const WHATS = "(31) 97107-8138";
const RODAPE = "Itasul Locações &nbsp;·&nbsp; Itatiaiuçu/MG &nbsp;·&nbsp; Atendimento das 7h às 17h &nbsp;·&nbsp; grupoitasul.com.br";
const ICON_WA = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.7-5.4A8.4 8.4 0 1 1 21 11.5z"/><path d="M8.5 8.5c.3 2.6 2.4 4.7 5 5l1-1.3-1.8-.9-.8.7a4 4 0 0 1-1.9-1.9l.7-.8-.9-1.8z"/></svg>`;

/* ---------------- Estilo ---------------- */
const CSS = `
@font-face { font-family: "Inter"; src: url("/assets/fonts/inter-latin-wght-normal.woff2") format("woff2"); font-weight: 100 900; }
:root { --red: #d0112b; --red-hot: #ee2540; --black: #0a0a0a; --ink: #141414; --gray: #a7a7a7; --paper: #f3f3f1; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 1080px; height: 1350px; overflow: hidden; background: var(--black); font-family: "Inter", sans-serif; color: #fff; -webkit-font-smoothing: antialiased; }
.ad { position: relative; width: 1080px; height: 1350px; overflow: hidden; background: var(--black); }
.abs { position: absolute; }
.photo { position: absolute; background-size: cover; background-repeat: no-repeat; filter: contrast(1.07) saturate(1.1) brightness(.97); }
.tag { position: absolute; display: inline-flex; align-items: center; gap: 12px; padding: 13px 24px; font-size: 21px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: #fff; background: var(--red); border-radius: 4px; }
.tag::before { content: ""; width: 10px; height: 10px; background: #fff; transform: rotate(45deg); }
.hl { font-weight: 800; letter-spacing: -.04em; line-height: 1.0; text-wrap: balance; }
.hl em { font-style: normal; color: var(--red-hot); }
.sub { font-size: 31px; font-weight: 500; line-height: 1.34; color: #d6d6d6; text-wrap: balance; }
.cta { display: inline-flex; align-items: center; gap: 20px; padding: 17px 38px 17px 17px; background: var(--red); border-radius: 999px; box-shadow: 0 16px 40px rgba(208, 17, 43, .38); }
.cta__ico { width: 62px; height: 62px; display: grid; place-items: center; background: #fff; border-radius: 50%; }
.cta__ico svg { width: 34px; height: 34px; fill: none; stroke: var(--red); stroke-width: 2.1; stroke-linecap: round; stroke-linejoin: round; }
.cta small { display: block; font-size: 17px; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: rgba(255,255,255,.86); }
.cta b { display: block; margin-top: 2px; font-size: 37px; font-weight: 800; letter-spacing: -.02em; line-height: 1.05; }
.logo { position: absolute; height: 58px; width: auto; }
.foot { position: absolute; left: 72px; right: 72px; font-size: 20px; font-weight: 600; letter-spacing: .04em; color: var(--gray); }
.grain { position: absolute; inset: 0; pointer-events: none; opacity: .07; mix-blend-mode: overlay; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }

/* ---------- Layout A: foto no topo, texto embaixo ---------- */
.A .photo { left: 0; top: 0; width: 1080px; height: 810px; clip-path: polygon(0 0, 100% 0, 100% 91%, 0 100%); }
.A .photo-shade { position: absolute; left: 0; top: 0; width: 1080px; height: 810px; clip-path: polygon(0 0, 100% 0, 100% 91%, 0 100%); background: linear-gradient(180deg, rgba(0,0,0,.55) 0, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,.35) 100%); }
.A .band { position: absolute; left: 0; top: 30px; width: 1080px; height: 810px; background: var(--red); clip-path: polygon(0 0, 100% 0, 100% 91%, 0 100%); }
.A .tag { left: 72px; top: 72px; }
.A .hl { position: absolute; left: 72px; width: 936px; top: 868px; font-size: 86px; }
.A .sub { position: absolute; left: 72px; width: 880px; top: 1064px; }
.A .cta { position: absolute; left: 72px; top: 1172px; }
.A .logo { right: 72px; top: 1186px; }
.A .foot { top: 1288px; }

/* ---------- Layout B: foto com degradê, título sobre a imagem ---------- */
.B .photo { left: 0; top: 0; width: 1080px; height: 930px; -webkit-mask-image: linear-gradient(180deg, #000 0, #000 60%, transparent 100%); mask-image: linear-gradient(180deg, #000 0, #000 60%, transparent 100%); }
.B .photo-shade { position: absolute; left: 0; top: 0; width: 1080px; height: 930px; background: linear-gradient(180deg, rgba(0,0,0,.65) 0, rgba(0,0,0,0) 26%); }
.B .logo { left: 72px; top: 70px; filter: drop-shadow(0 2px 10px rgba(0,0,0,.6)); }
.B .tag { right: 72px; top: 76px; }
.B .bar { position: absolute; left: 72px; top: 748px; width: 14px; height: 318px; background: var(--red); }
.B .hl { position: absolute; left: 112px; width: 896px; top: 748px; font-size: 90px; }
.B .sub { position: absolute; left: 112px; width: 860px; top: 1000px; }
.B .cta { position: absolute; left: 72px; top: 1154px; }
.B .foot { top: 1288px; }

/* ---------- Layout C: título em cima, foto embaixo ---------- */
.C .head { position: absolute; left: 0; top: 0; width: 1080px; height: 560px; background: radial-gradient(ellipse at 90% 0, rgba(208,17,43,.35), transparent 60%), var(--black); }
.C .logo { left: 72px; top: 70px; }
.C .tag { right: 72px; top: 76px; }
.C .hl { position: absolute; left: 72px; width: 936px; top: 186px; font-size: 88px; }
.C .sub { position: absolute; left: 72px; width: 880px; top: 396px; }
.C .band { position: absolute; left: 0; top: 520px; width: 1080px; height: 830px; background: var(--red); clip-path: polygon(0 9%, 100% 0, 100% 100%, 0 100%); }
.C .photo { left: 0; top: 548px; width: 1080px; height: 802px; clip-path: polygon(0 9%, 100% 0, 100% 100%, 0 100%); }
.C .photo-shade { position: absolute; left: 0; top: 548px; width: 1080px; height: 802px; background: linear-gradient(0deg, rgba(0,0,0,.9) 0, rgba(0,0,0,.35) 26%, rgba(0,0,0,0) 48%); }
.C .cta { position: absolute; left: 72px; top: 1166px; }
.C .foot { top: 1290px; color: #c9c9c9; }

/* ---------- Ferramentas: estúdio claro ---------- */
.TA .stage { position: absolute; left: 0; top: 0; width: 1080px; height: 820px; background: radial-gradient(ellipse at 50% 58%, #ffffff 0, #ececea 60%, #dcdcd9 100%); clip-path: polygon(0 0, 100% 0, 100% 91%, 0 100%); }
.TA .block { position: absolute; left: 150px; top: 120px; width: 780px; height: 620px; background: var(--red); transform: skewX(-9deg); box-shadow: 40px 40px 0 rgba(0,0,0,.08); }
.TA .band { position: absolute; left: 0; top: 30px; width: 1080px; height: 810px; background: var(--red); clip-path: polygon(0 0, 100% 0, 100% 91%, 0 100%); z-index: -1; }
.TA .product { position: absolute; left: 50%; top: 96px; height: 640px; transform: translateX(-50%); filter: drop-shadow(0 34px 36px rgba(0,0,0,.35)); }
.TA .ground { position: absolute; left: 50%; top: 722px; width: 560px; height: 42px; transform: translateX(-50%); background: radial-gradient(ellipse, rgba(0,0,0,.35), transparent 70%); }
.TA .tag { left: 72px; top: 72px; }
.TA .hl { position: absolute; left: 72px; width: 936px; top: 868px; font-size: 86px; }
.TA .sub { position: absolute; left: 72px; width: 880px; top: 1064px; }
.TA .cta { position: absolute; left: 72px; top: 1172px; }
.TA .logo { right: 72px; top: 1186px; }
.TA .foot { top: 1288px; }

/* ---------- Ferramentas: fundo vermelho ---------- */
.TB { background: var(--red); }
.TB .bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 55%, #e8203a 0, #c40f29 55%, #8f0b1e 100%); }
.TB .stripes { position: absolute; inset: 0; background: repeating-linear-gradient(-58deg, rgba(0,0,0,.07) 0 3px, transparent 3px 46px); }
.TB .tag { left: 72px; top: 72px; background: var(--black); }
.TB .hl { position: absolute; left: 72px; width: 936px; top: 150px; font-size: 100px; }
.TB .hl em { color: #fff; box-shadow: inset 0 -.2em 0 rgba(0,0,0,.9); }
.TB .p1 { position: absolute; left: 70px; top: 470px; height: 560px; filter: drop-shadow(0 30px 28px rgba(0,0,0,.45)); }
.TB .p2 { position: absolute; left: 420px; top: 400px; height: 640px; filter: drop-shadow(0 30px 28px rgba(0,0,0,.45)); }
.TB .strip { position: absolute; left: 0; top: 1040px; width: 1080px; height: 310px; background: var(--black); clip-path: polygon(0 12%, 100% 0, 100% 100%, 0 100%); }
.TB .sub { position: absolute; left: 72px; width: 900px; top: 1092px; font-size: 29px; }
.TB .cta { position: absolute; left: 72px; top: 1166px; }
.TB .logo { right: 72px; top: 1180px; }
.TB .foot { top: 1296px; }

/* ---------- Ferramentas: fundo preto com luz ---------- */
.TC .spot { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 42%, rgba(255,255,255,.30) 0, rgba(255,255,255,.07) 40%, transparent 68%), radial-gradient(ellipse at 100% 0, rgba(208,17,43,.5), transparent 55%); }
.TC .floor { position: absolute; left: 0; top: 760px; width: 1080px; height: 130px; background: linear-gradient(180deg, rgba(255,255,255,.14), transparent); clip-path: polygon(0 100%, 100% 100%, 90% 0, 10% 0); }
.TC .logo { left: 72px; top: 70px; }
.TC .tag { right: 72px; top: 76px; }
.TC .p3 { position: absolute; left: 80px; top: 250px; height: 560px; filter: drop-shadow(0 28px 26px rgba(0,0,0,.6)); }
.TC .p1 { position: absolute; left: 300px; top: 200px; width: 640px; filter: drop-shadow(0 28px 26px rgba(0,0,0,.6)); }
.TC .p2 { position: absolute; left: 500px; top: 440px; width: 470px; filter: drop-shadow(0 28px 26px rgba(0,0,0,.6)); }
.TC .hl { position: absolute; left: 72px; width: 936px; top: 868px; font-size: 90px; }
.TC .sub { position: absolute; left: 72px; width: 880px; top: 1072px; }
.TC .cta { position: absolute; left: 72px; top: 1176px; }
.TC .foot { top: 1296px; }
`;

const cta = () => `<div class="cta"><span class="cta__ico">${ICON_WA}</span><span><small>Peça seu orçamento no WhatsApp</small><b>${WHATS}</b></span></div>`;
const logo = () => `<img class="logo" src="/assets/img/logo-horizontal-branca.png" alt="Grupo Itasul">`;
const foot = () => `<div class="foot">${RODAPE}</div>`;
const bg = (img, pos = "center", extra = "") => `background-image:url('${img.startsWith("/") ? img : "/assets/img/" + img}');background-position:${pos};${extra}`;

/* ---------------- Os 9 anúncios ---------------- */
const ADS = [
  { id: "01-munck-levanta", layout: "A", tag: "Caminhão Munck",
    hl: "O que é pesado, a gente <em>levanta.</em>", sub: "Içamento e movimentação de cargas com operador experiente.",
    photo: "munck-atendimento-1.jpg", pos: "48% 50%" },
  { id: "02-munck-alcance", layout: "B", tag: "Caminhão Munck",
    hl: "Alcance onde a sua obra <em>precisa.</em>", sub: "Carga, descarga e içamento com segurança, do início ao fim.",
    photo: "munck-atendimento-5.jpg", pos: "42% 46%" },
  { id: "03-munck-seguranca", layout: "C", tag: "Caminhão Munck",
    hl: "Segurança não é <em>detalhe.</em>", sub: "Operador experiente incluso e cada serviço planejado antes de começar.",
    photo: "/publicidade/fotos/munck-servico.jpg", pos: "40% 40%" },

  { id: "04-cacamba-sem-dor", layout: "A", tag: "Caçamba de entulho",
    hl: "Retirada de entulho <em>sem dor de cabeça.</em>", sub: "Entrega e retirada da caçamba no prazo combinado.",
    photo: "/publicidade/fotos/cacamba-chao-3.jpg", pos: "62% 50%" },
  { id: "05-cacamba-avisar", layout: "C", tag: "Caçamba de entulho",
    hl: "Caçamba cheia? É só <em>avisar.</em>", sub: "Nós recolhemos e levamos o entulho para o destino correto.",
    photo: "cacamba-cheia-1.jpg", pos: "42% 50%" },
  { id: "06-cacamba-destino", layout: "B", tag: "Caçamba de entulho",
    hl: "Destino <em>certo</em> para o seu entulho.", sub: "Descarte em local licenciado e cuidado com o meio ambiente.",
    photo: "cacambas-topo.jpg", pos: "0% 30%", size: "auto 1018px" },

  { id: "07-ferramentas-betoneira", layout: "TA", tag: "Ferramentas para construção civil",
    hl: "A obra começa na <em>betoneira.</em>", sub: "Locação de betoneira e de outras ferramentas para a sua obra.",
    products: ["betoneira"] },
  { id: "08-ferramentas-solo", layout: "TB", tag: "Ferramentas para construção civil",
    hl: "Solo firme, obra <em>segura.</em>", sub: "Compactador de solo e placa vibratória para locação.",
    products: ["compactador", "placa"] },
  { id: "09-ferramentas-tudo", layout: "TC", tag: "Ferramentas para construção civil",
    hl: "Tudo para a sua obra, <em>num só lugar.</em>", sub: "Betoneira, andaime, furadeira, cortadora de piso e muito mais.",
    products: ["andaime", "furadeira", "cortadora"] },
];

function html(a) {
  const L = a.layout;
  const rec = (n) => `/publicidade/recortes/${n}.png`;
  let inner = "";
  if (L === "A") inner = `<div class="band"></div><div class="photo" style="${bg(a.photo, a.pos, a.size ? `background-size:${a.size};` : "")}"></div><div class="photo-shade"></div><div class="tag">${a.tag}</div><h1 class="hl">${a.hl}</h1><p class="sub">${a.sub}</p>${cta()}${logo()}${foot()}`;
  if (L === "B") inner = `<div class="photo" style="${bg(a.photo, a.pos, a.size ? `background-size:${a.size};` : "")}"></div><div class="photo-shade"></div>${logo()}<div class="tag">${a.tag}</div><div class="bar"></div><h1 class="hl">${a.hl}</h1><p class="sub">${a.sub}</p>${cta()}${foot()}`;
  if (L === "C") inner = `<div class="head"></div>${logo()}<div class="tag">${a.tag}</div><h1 class="hl">${a.hl}</h1><p class="sub">${a.sub}</p><div class="band"></div><div class="photo" style="${bg(a.photo, a.pos, a.size ? `background-size:${a.size};` : "")}"></div><div class="photo-shade"></div>${cta()}${foot()}`;
  if (L === "TA") inner = `<div class="band"></div><div class="stage"></div><div class="block"></div><div class="ground"></div><img class="product" src="${rec(a.products[0])}"><div class="tag">${a.tag}</div><h1 class="hl">${a.hl}</h1><p class="sub">${a.sub}</p>${cta()}${logo()}${foot()}`;
  if (L === "TB") inner = `<div class="bg"></div><div class="stripes"></div><div class="tag">${a.tag}</div><h1 class="hl">${a.hl}</h1><img class="p1" src="${rec(a.products[0])}"><img class="p2" src="${rec(a.products[1])}"><div class="strip"></div><p class="sub">${a.sub}</p>${cta()}${logo()}${foot()}`;
  if (L === "TC") inner = `<div class="spot"></div><div class="floor"></div>${logo()}<div class="tag">${a.tag}</div><img class="p3" src="${rec(a.products[0])}"><img class="p1" src="${rec(a.products[1])}"><img class="p2" src="${rec(a.products[2])}"><h1 class="hl">${a.hl}</h1><p class="sub">${a.sub}</p>${cta()}${foot()}`;
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="ad ${L}">${inner}<div class="grain"></div></div></body></html>`;
}

fs.mkdirSync(path.join(root, "publicidade"), { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium" });
const only = process.argv[2];
for (const a of ADS) {
  if (only && !a.id.startsWith(only)) continue;
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  fs.writeFileSync(path.join(root, "publicidade", ".tmp.html"), html(a));
  await page.goto(`http://localhost:${port}/publicidade/.tmp.html`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(root, "publicidade", `anuncio-${a.id}.png`) });
  await page.close();
  console.log("ok", a.id);
}
fs.rmSync(path.join(root, "publicidade", ".tmp.html"), { force: true });
await browser.close(); srv.close();
