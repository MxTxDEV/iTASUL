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
html, body { width: 1080px; overflow: hidden; background: var(--black); font-family: "Inter", sans-serif; color: #fff; -webkit-font-smoothing: antialiased; }
.ad { position: relative; width: 1080px; height: var(--h, 1350px); overflow: hidden; background: var(--black); }
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
/* ===================== STORIES 9:16 (1080 x 1920) =====================
   Zonas seguras: nada importante nos 250 px do topo nem nos ~380 px de baixo (barra do Instagram). */
.S { --h: 1920px; }
.S.A .photo, .S.A .photo-shade, .S.A .band { height: 990px; }
.S.A .tag { top: 262px; } .S.A .hl { top: 1050px; font-size: 90px; } .S.A .sub { top: 1272px; }
.S.A .cta { top: 1406px; } .S.A .logo { top: 1426px; } .S.A .foot { top: 1540px; }

.S.B .photo, .S.B .photo-shade { height: 1180px; }
.S.B .logo { top: 262px; } .S.B .tag { top: 268px; }
.S.B .bar { top: 900px; } .S.B .hl { top: 900px; font-size: 92px; } .S.B .sub { top: 1152px; }
.S.B .cta { top: 1310px; } .S.B .foot { top: 1450px; }

.S.C .head { height: 720px; } .S.C .logo { top: 262px; } .S.C .tag { top: 268px; }
.S.C .hl { top: 390px; font-size: 90px; } .S.C .sub { top: 600px; }
.S.C .band { top: 690px; height: 800px; } .S.C .photo, .S.C .photo-shade { top: 718px; height: 772px; }
.S.C .cta { top: 1370px; } .S.C .foot { top: 1508px; }

.S.TA .stage, .S.TA .band { height: 1000px; }
.S.TA .block { top: 270px; height: 650px; left: 140px; width: 800px; }
.S.TA .product { top: 250px; height: 700px; } .S.TA .ground { top: 900px; }
.S.TA .tag { top: 262px; } .S.TA .hl { top: 1050px; } .S.TA .sub { top: 1262px; }
.S.TA .cta { top: 1396px; } .S.TA .logo { top: 1416px; } .S.TA .foot { top: 1530px; }

.S.TB .tag { top: 262px; } .S.TB .hl { top: 340px; font-size: 104px; }
.S.TB .p1 { top: 700px; height: 560px; } .S.TB .p2 { top: 640px; height: 640px; }
.S.TB .strip { top: 1330px; height: 590px; } .S.TB .sub { top: 1390px; }
.S.TB .cta { top: 1450px; } .S.TB .logo { top: 1464px; } .S.TB .foot { top: 1566px; }

.S.TC .logo { top: 262px; } .S.TC .tag { top: 268px; }
.S.TC .p3 { top: 380px; height: 560px; } .S.TC .p1 { top: 320px; } .S.TC .p2 { top: 560px; }
.S.TC .floor { top: 880px; } .S.TC .hl { top: 1010px; font-size: 90px; } .S.TC .sub { top: 1226px; }
.S.TC .cta { top: 1366px; } .S.TC .foot { top: 1500px; }

/* ---------- Ilustração da caçamba ---------- */
.X .spot { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 46%, rgba(255,255,255,.26) 0, rgba(255,255,255,.06) 42%, transparent 68%), radial-gradient(ellipse at 100% 0, rgba(208,17,43,.5), transparent 55%), radial-gradient(ellipse at 0 100%, rgba(208,17,43,.25), transparent 50%); }
.X .tag { left: 72px; top: 72px; }
.X .hl { position: absolute; left: 72px; width: 936px; top: 150px; font-size: 98px; }
.X .illus { position: absolute; left: 50px; top: 378px; width: 980px; filter: drop-shadow(0 24px 30px rgba(0,0,0,.55)); }
.X .illus svg { display: block; width: 100%; height: auto; }
.X .sub { position: absolute; left: 72px; width: 880px; top: 1010px; }
.X .cta { position: absolute; left: 72px; top: 1172px; }
.X .logo { right: 72px; top: 1186px; }
.X .foot { top: 1288px; }
.S.X .logo { left: 72px; right: auto; top: 262px; } .S.X .tag { left: auto; right: 72px; top: 268px; }
.S.X .hl { top: 380px; font-size: 104px; }
.S.X .illus { left: 40px; top: 700px; width: 1000px; }
.S.X .sub { top: 1340px; } .S.X .cta { top: 1450px; } .S.X .foot { top: 1572px; }

/* ---------- Lista: o que pode / não pode ---------- */
.L .spot { position: absolute; inset: 0; background: radial-gradient(ellipse at 100% 0, rgba(208,17,43,.5), transparent 55%), radial-gradient(ellipse at 0 100%, rgba(47,143,62,.28), transparent 55%); }
.L .tag { left: 72px; top: 72px; }
.L .hl { position: absolute; left: 72px; width: 936px; top: 150px; font-size: 98px; }
.L .panel { position: absolute; top: 420px; width: 440px; height: 566px; padding: 28px 28px 14px; border-radius: 18px; }
.L .pode { left: 72px; background: rgba(47,143,62,.16); border: 2px solid #2f9e44; }
.L .nao { left: 568px; background: rgba(208,17,43,.16); border: 2px solid var(--red-hot); }
.L .panel h3 { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; font-size: 38px; font-weight: 800; letter-spacing: -.02em; }
.L .panel li { display: flex; align-items: flex-start; gap: 14px; list-style: none; padding: 11px 0; border-top: 1px solid rgba(255,255,255,.12); font-size: 26px; font-weight: 600; line-height: 1.25; color: #ececec; }
.L .ic { flex-shrink: 0; width: 34px; height: 34px; border-radius: 50%; background: center / 20px no-repeat; }
.L .ok { background-color: #2f9e44; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3.4' stroke-linecap='round' stroke-linejoin='round'><path d='M20 6 9 17l-5-5'/></svg>"); }
.L .no { background-color: var(--red-hot); background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3.4' stroke-linecap='round' stroke-linejoin='round'><path d='M18 6 6 18M6 6l12 12'/></svg>"); }
.L .sub { position: absolute; left: 72px; width: 900px; top: 1020px; }
.L .cta { position: absolute; left: 72px; top: 1172px; }
.L .logo { right: 72px; top: 1186px; }
.L .foot { top: 1288px; }
.S.L .logo { left: 72px; right: auto; top: 262px; } .S.L .tag { left: auto; right: 72px; top: 268px; }
.S.L .hl { top: 360px; font-size: 100px; }
.S.L .panel { left: 72px; width: 936px; height: auto; padding: 22px 28px 8px; }
.S.L .pode { top: 590px; } .S.L .nao { top: 1000px; }
.S.L .panel h3 { font-size: 34px; margin-bottom: 8px; } .S.L .panel li { padding: 8px 0; font-size: 25px; }
.S.L .sub { top: 1426px; } .S.L .cta { top: 1480px; } .S.L .foot { top: 1600px; }
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
    photo: "cacambas-topo.jpg", pos: "0% 30%", size: "auto 1018px", sizeS: "auto 1180px" },

  { id: "07-ferramentas-betoneira", layout: "TA", tag: "Ferramentas para construção civil",
    hl: "A obra começa na <em>betoneira.</em>", sub: "Locação de betoneira e de outras ferramentas para a sua obra.",
    products: ["betoneira"] },
  { id: "08-ferramentas-solo", layout: "TB", tag: "Ferramentas para construção civil",
    hl: "Solo firme, obra <em>segura.</em>", sub: "Compactador de solo e placa vibratória para locação.",
    products: ["compactador", "placa"] },
  { id: "09-ferramentas-tudo", layout: "TC", tag: "Ferramentas para construção civil",
    hl: "Tudo para a sua obra, <em>num só lugar.</em>", sub: "Betoneira, andaime, furadeira, cortadora de piso e muito mais.",
    products: ["andaime", "furadeira", "cortadora"] },

  { id: "10-cacamba-na-obra", layout: "C", tag: "Caçamba de entulho",
    hl: "A caçamba chega, o entulho <em>sai.</em>", sub: "Entregamos no endereço da sua obra, no prazo combinado.",
    photo: "cacambas-topo.jpg", pos: "0% 43%", size: "auto 1400px", sizeS: "auto 1700px" },
  { id: "11-cacamba-cheia-leva", layout: "B", tag: "Caçamba de entulho",
    hl: "Encheu?<br>A gente <em>leva.</em>", sub: "Retirada da caçamba cheia com descarte em local licenciado.",
    photo: "cacamba-cheia-3.jpg", pos: "0% 62%", size: "auto 1000px", sizeS: "auto 1300px" },
  { id: "12-cacamba-pode-nao-pode", layout: "L", tag: "Caçamba de entulho",
    hl: "O que pode ir na <em>caçamba?</em>", sub: "Separe direito e evite problemas na retirada.",
    pode: ["Restos de alvenaria, tijolos e blocos", "Concreto, argamassa e reboco", "Pisos, azulejos e telhas", "Terra e areia", "Madeira de obra e restos de gesso"],
    nao: ["Lixo doméstico e orgânico", "Produtos químicos e solventes", "Pneus, baterias e eletrônicos", "Amianto e materiais contaminados", "Carga acima da borda da caçamba"] },
];

/* ---------------- Ilustração: caçamba estacionária (vazia ou cheia) ---------------- */
function cacambaSVG(cheia) {
  const rot = (x, y, w, h, a, fill, extra = "") => `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="5" fill="${fill}" transform="rotate(${a} ${x} ${y})" ${extra}/>`;
  let ribs = "";
  for (let i = 1; i <= 6; i++) { const t = i / 7; ribs += `<line x1="${110 + 680 * t}" y1="262" x2="${155 + 590 * t}" y2="470" stroke="#b78500" stroke-width="9" stroke-linecap="round"/>`; }
  let lixo = "";
  if (cheia) {
    lixo += `<path d="M120 252 L170 205 L230 170 L300 150 L380 128 L450 118 L530 130 L610 112 L690 140 L750 180 L788 252 Z" fill="#6f655b"/>`;
    [[250, 192, 52, 30, -12, "#9a9a9a"], [330, 162, 60, 34, 8, "#b0a79b"], [430, 142, 66, 36, -6, "#8a8176"], [520, 152, 58, 32, 12, "#a89c8d"], [610, 150, 60, 34, -10, "#7c746b"], [690, 188, 56, 32, 14, "#98897a"],
     [200, 228, 56, 26, 6, "#a3a3a3"], [300, 224, 70, 30, -4, "#8d8d8d"], [400, 214, 64, 32, 10, "#b9b0a3"], [500, 218, 70, 30, -8, "#7d7468"], [600, 222, 64, 30, 6, "#a09486"], [690, 232, 54, 24, -5, "#8f8f8f"]]
      .forEach(([x, y, w, h, a, f]) => (lixo += rot(x, y, w, h, a, f)));
    [[280, 172, 44, 20, -20], [470, 130, 44, 20, 15], [560, 178, 44, 20, -10], [640, 130, 44, 20, 25], [360, 198, 44, 20, 10], [720, 207, 44, 20, -18], [170, 212, 44, 20, 12]]
      .forEach(([x, y, w, h, a]) => (lixo += rot(x, y, w, h, a, "#b5523b", 'stroke="#7e2f20" stroke-width="2"')));
    [[420, 178, 36, 20, 18], [600, 198, 36, 20, -12], [330, 130, 34, 18, -14]].forEach(([x, y, w, h, a]) => (lixo += rot(x, y, w, h, a, "#ececec", 'stroke="#bdbdbd" stroke-width="2"')));
    lixo += rot(300, 112, 150, 13, -16, "#c4915a") + rot(560, 96, 140, 13, 20, "#b98a4e") + rot(190, 188, 120, 13, 26, "#cf9d66");
    [[240, 236, 12], [360, 240, 10], [470, 236, 11], [650, 240, 12], [740, 236, 10]].forEach(([x, y, r]) => (lixo += `<circle cx="${x}" cy="${y}" r="${r}" fill="#6b4e33"/>`));
  }
  return `<svg viewBox="0 0 900 560" aria-hidden="true">
    <defs>
      <linearGradient id="cf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd23a"/><stop offset="1" stop-color="#e3a400"/></linearGradient>
      <linearGradient id="ci" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c241f"/><stop offset="1" stop-color="#1a1512"/></linearGradient>
      <radialGradient id="cs"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    </defs>
    <ellipse cx="450" cy="500" rx="430" ry="38" fill="url(#cs)"/>
    <polygon points="160,176 740,176 790,252 110,252" fill="url(#ci)"/>
    ${lixo}
    <polygon points="110,250 790,250 745,470 155,470" fill="url(#cf)"/>
    ${ribs}
    <line x1="132" y1="360" x2="768" y2="360" stroke="#b78500" stroke-width="11" stroke-linecap="round"/>
    <polygon points="98,238 802,238 792,264 108,264" fill="#c99200"/>
    <polygon points="98,238 802,238 800,246 100,246" fill="#ffe27a" opacity=".75"/>
    <circle cx="96" cy="254" r="11" fill="none" stroke="#2a2a2a" stroke-width="6"/><circle cx="804" cy="254" r="11" fill="none" stroke="#2a2a2a" stroke-width="6"/>
    <rect x="165" y="470" width="130" height="16" rx="4" fill="#222"/><rect x="605" y="470" width="130" height="16" rx="4" fill="#222"/>
  </svg>`;
}


function html(a, fmt = "feed") {
  const L = a.layout;
  const story = fmt === "story";
  if (story && a.sizeS) a = { ...a, size: a.sizeS };
  const rec = (n) => `/publicidade/recortes/${n}.png`;
  let inner = "";
  if (L === "A") inner = `<div class="band"></div><div class="photo" style="${bg(a.photo, a.pos, a.size ? `background-size:${a.size};` : "")}"></div><div class="photo-shade"></div><div class="tag">${a.tag}</div><h1 class="hl">${a.hl}</h1><p class="sub">${a.sub}</p>${cta()}${logo()}${foot()}`;
  if (L === "B") inner = `<div class="photo" style="${bg(a.photo, a.pos, a.size ? `background-size:${a.size};` : "")}"></div><div class="photo-shade"></div>${logo()}<div class="tag">${a.tag}</div><div class="bar"></div><h1 class="hl">${a.hl}</h1><p class="sub">${a.sub}</p>${cta()}${foot()}`;
  if (L === "C") inner = `<div class="head"></div>${logo()}<div class="tag">${a.tag}</div><h1 class="hl">${a.hl}</h1><p class="sub">${a.sub}</p><div class="band"></div><div class="photo" style="${bg(a.photo, a.pos, a.size ? `background-size:${a.size};` : "")}"></div><div class="photo-shade"></div>${cta()}${foot()}`;
  if (L === "TA") inner = `<div class="band"></div><div class="stage"></div><div class="block"></div><div class="ground"></div><img class="product" src="${rec(a.products[0])}"><div class="tag">${a.tag}</div><h1 class="hl">${a.hl}</h1><p class="sub">${a.sub}</p>${cta()}${logo()}${foot()}`;
  if (L === "TB") inner = `<div class="bg"></div><div class="stripes"></div><div class="tag">${a.tag}</div><h1 class="hl">${a.hl}</h1><img class="p1" src="${rec(a.products[0])}"><img class="p2" src="${rec(a.products[1])}"><div class="strip"></div><p class="sub">${a.sub}</p>${cta()}${logo()}${foot()}`;
  if (L === "TC") inner = `<div class="spot"></div><div class="floor"></div>${logo()}<div class="tag">${a.tag}</div><img class="p3" src="${rec(a.products[0])}"><img class="p1" src="${rec(a.products[1])}"><img class="p2" src="${rec(a.products[2])}"><h1 class="hl">${a.hl}</h1><p class="sub">${a.sub}</p>${cta()}${foot()}`;
  if (L === "X") inner = `<div class="spot"></div>${logo()}<div class="tag">${a.tag}</div><h1 class="hl">${a.hl}</h1><div class="illus">${cacambaSVG(a.cheia)}</div><p class="sub">${a.sub}</p>${cta()}${foot()}`;
  if (L === "L") {
    const li = (arr, c) => arr.map((t) => `<li><i class="ic ${c}"></i><span>${t}</span></li>`).join("");
    inner = `<div class="spot"></div>${logo()}<div class="tag">${a.tag}</div><h1 class="hl">${a.hl}</h1><div class="panel pode"><h3><i class="ic ok"></i>Pode</h3><ul>${li(a.pode, "ok")}</ul></div><div class="panel nao"><h3><i class="ic no"></i>Não pode</h3><ul>${li(a.nao, "no")}</ul></div><p class="sub">${a.sub}</p>${cta()}${foot()}`;
  }
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="ad ${story ? "S " : ""}${L}">${inner}<div class="grain"></div></div></body></html>`;
}

fs.mkdirSync(path.join(root, "publicidade", "stories"), { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium" });
const only = process.argv[2];
const fmtOnly = process.argv[3]; // "feed" ou "story" (opcional)
for (const a of ADS) {
  if (only && only !== "all" && !a.id.startsWith(only)) continue;
  for (const fmt of ["feed", "story"]) {
    if (fmtOnly && fmtOnly !== fmt) continue;
    const H = fmt === "story" ? 1920 : 1350;
    const page = await browser.newPage({ viewport: { width: 1080, height: H }, deviceScaleFactor: 1 });
    fs.writeFileSync(path.join(root, "publicidade", ".tmp.html"), html(a, fmt));
    await page.goto(`http://localhost:${port}/publicidade/.tmp.html`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);
    const out = fmt === "story" ? path.join(root, "publicidade", "stories", `story-${a.id}.png`) : path.join(root, "publicidade", `anuncio-${a.id}.png`);
    await page.screenshot({ path: out });
    await page.close();
    console.log("ok", fmt, a.id);
  }
}
fs.rmSync(path.join(root, "publicidade", ".tmp.html"), { force: true });
await browser.close(); srv.close();
