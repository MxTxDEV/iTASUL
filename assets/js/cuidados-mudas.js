/* =========================================================
   MAPA DE CUIDADOS DA MUDA
   - Na tela: passo a passo interativo (passe o mouse ou toque em cada etapa) mostrando a evolução da muda até o fruto.
   - No PDF/impressão: lista completa dos cuidados de cada espécie.
   Os textos vêm de assets/js/mudas-dados.js (os mesmos das fichas). Para mudar um cuidado, edite lá.
   ========================================================= */
(function () {
  "use strict";
  const pick = document.getElementById("carePick");
  const list = document.getElementById("careList");
  const stepper = document.getElementById("careSteps");
  if (!pick || !list || !stepper || !window.MUDAS) return;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rows = (items) =>
    `<dl class="care-rows">${items.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join("")}</dl>`;
  const FRUTA = { laranja: "#f28c1e", mexerica: "#f5821f", acerola: "#d1202f", limao: "#8cc63f" };

  const DICAS_IRRIGACAO = [
    ["Como regar", "Regue no pé da planta, de manhã cedo ou no fim da tarde, sem molhar as folhas."],
    ["Teste do dedo", "Enfie o dedo 5 cm na terra: se estiver seca, regue; se estiver úmida, espere."],
    ["Excesso de água", "Folhas amareladas e caindo, solo sempre encharcado e cheiro ruim indicam excesso."],
    ["Falta de água", "Folhas murchas ou enroladas nas horas quentes e queda de flores e frutinhos indicam falta."],
    ["Cobertura morta", "Palha, folhas secas ou capim cortado ao redor da planta seguram a umidade e reduzem as regas."],
  ];

  /* ---------- Lista completa (aparece no PDF e na impressão) ---------- */
  const PASSOS = [
    ["Como plantar", (m) => rows(m.aprender.plantar)],
    ["Irrigação", (m) => rows(m.irrigacao) + `<h4 class="care-sub">Dicas de rega</h4>` + rows(DICAS_IRRIGACAO)],
    ["Adubação", (m) => rows(m.aprender.adubacao)],
    ["Podas e manutenção", (m) => rows(m.aprender.podas)],
    ["Pragas e doenças", (m) => rows(m.aprender.pragas)],
    ["Calendário de desenvolvimento", (m) => rows(m.desenvolvimento) + `<p class="care-note">O desenvolvimento varia conforme clima, solo, manejo e porta-enxerto.</p>`],
  ];
  list.innerHTML = window.MUDAS.map(
    (m, i) => `
    <section class="section care-print care-species${i % 2 ? " care-species--alt" : ""}" id="cuidados-${m.id}">
      <div class="container">
        <header class="care-species__head">
          <img class="care-species__photo" src="${esc(m.foto)}" alt="Muda de ${esc(m.nome)}" width="240" height="240">
          <div>
            <span class="eyebrow eyebrow--green">Mapa de cuidados</span>
            <h2 class="section__title">${esc(m.nome)}</h2>
            <p class="care-species__sci">${esc(m.cientifico)}</p>
            <p class="care-species__resumo">${esc(m.resumo)}</p>
          </div>
        </header>
        <div class="care-grid">
          ${PASSOS.map(([t, fn], n) => `<article class="care-card"><h3><span class="care-card__n">${n + 1}</span>${t}</h3>${fn(m)}</article>`).join("")}
        </div>
      </div>
    </section>`
  ).join("");

  /* ---------- Etapas da muda até o fruto ---------- */
  // Cada etapa escolhe, nos dados da espécie, os cuidados que valem para aquela fase.
  const find = (arr, re) => (arr || []).filter(([a]) => re.test(a));
  const ETAPAS = [
    { t: "Plantio", q: "Dia 1", g: (m) => [["Como plantar", m.aprender.plantar]] },
    { t: "Primeiro mês", q: "até 30 dias", g: (m) => [
        ["Rega", find(m.irrigacao, /^(Primeiros 7|8 a 30)/)],
        ["Atenção", find(m.aprender.pragas, /formiga/i)],
        ["Dica", find(DICAS_IRRIGACAO, /Teste do dedo|Excesso/)]] },
    { t: "Primeiro ano", q: "2 a 12 meses", d: /^1º ano/, g: (m) => [
        ["Rega", find(m.irrigacao, /^(2 a 6|6 a 12)/)],
        ["Adubação", find(m.aprender.adubacao, /^(1º e 2º|Formação)/)],
        ["Poda", find(m.aprender.podas, /formação|Brotos/i)],
        ["Dica", find(DICAS_IRRIGACAO, /Cobertura/)]] },
    { t: "Segundo ano", q: "crescimento da copa", d: /^2º ano/, g: (m) => [
        ["Adubação", find(m.aprender.adubacao, /^(1º e 2º|Formação|Matéria)/)],
        ["Poda", find(m.aprender.podas, /limpeza|Coroamento/i)],
        ["Atenção", find(m.aprender.pragas, /Minador|Pulg/)]] },
    { t: "Flores e primeiros frutos", q: "a partir do 3º ano", d: /^3º ano/, g: (m) => [
        ["Rega", find(m.irrigacao, /^Planta adulta/)],
        ["Adubação", find(m.aprender.adubacao, /Em produção/)],
        ["Atenção", find(m.aprender.pragas, /Greening|Cancro|Leprose|Gomose|Antracnose|Nematoides|Mosca-das/)]] },
    { t: "Planta adulta e colheita", q: "4º ano em diante", d: /^(4º e 5º|Fase adulta)/, g: (m) => [
        ["Colheita", find(m.caracteristicas, /Matura|Frutifica|Safra|Ciclo/)],
        ["Poda", find(m.aprender.podas, /Raleio|Colheita|altura|limpeza/i)],
        ["Adubação", find(m.aprender.adubacao, /Matéria/)]] },
  ];

  /* ---------- Ilustração: a muda crescendo até o fruto ---------- */
  function planta(stage, cor) {
    const L = (x, y, r, c = "#3fa34d") => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.5}" fill="${c}" transform="rotate(${(x * 7 + y * 3) % 60 - 30} ${x} ${y})"/>`;
    const flor = (x, y) => `<g><circle cx="${x}" cy="${y}" r="5" fill="#fff"/><circle cx="${x}" cy="${y}" r="2" fill="#f5c542"/></g>`;
    const fruto = (x, y, r = 8) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${cor}"/><circle cx="${x - r / 3}" cy="${y - r / 3}" r="${r / 4}" fill="#fff" opacity=".35"/>`;
    let g = "";
    const solo = `<ellipse cx="150" cy="262" rx="120" ry="16" fill="#8a5a33"/><ellipse cx="150" cy="258" rx="100" ry="10" fill="#a06b3f"/>
      <path d="M40 262c10-14 14-14 20 0M240 262c8-12 14-12 18 0M70 262c6-10 10-10 14 0" stroke="#2f8f3e" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    if (stage === 0) {
      g += `<path d="M150 258v-34" stroke="#5b8a3a" stroke-width="5" stroke-linecap="round"/>${L(138, 222, 14)}${L(162, 218, 14)}${L(150, 204, 11, "#5fcf6f")}`;
      g += `<g fill="#6cb6e8"><path d="M96 150q-6 10 0 14 6-4 0-14z"/><path d="M118 130q-6 10 0 14 6-4 0-14z"/><path d="M200 140q-6 10 0 14 6-4 0-14z"/></g>`;
    } else if (stage === 1) {
      g += `<path d="M150 258V190" stroke="#5b8a3a" stroke-width="6" stroke-linecap="round"/>${L(134, 218, 16)}${L(168, 212, 16)}${L(136, 192, 14, "#5fcf6f")}${L(166, 186, 14, "#5fcf6f")}${L(150, 172, 12)}`;
    } else if (stage === 2) {
      g += `<path d="M150 258V150" stroke="#7a5a35" stroke-width="8" stroke-linecap="round"/><path d="M150 200l-30-24M150 184l32-26" stroke="#7a5a35" stroke-width="5" stroke-linecap="round"/>`;
      [[116, 172], [184, 154], [132, 200], [170, 206], [150, 140], [126, 148], [176, 180]].forEach(([x, y]) => (g += L(x, y, 18, "#3fa34d")));
      g += L(150, 128, 14, "#5fcf6f");
    } else if (stage === 3) {
      g += `<rect x="188" y="150" width="4" height="110" fill="#c9a36b"/><path d="M150 258V140" stroke="#7a5a35" stroke-width="10" stroke-linecap="round"/><path d="M150 190l-40-30M150 170l44-34" stroke="#7a5a35" stroke-width="6" stroke-linecap="round"/>`;
      [[150, 120, 38], [112, 148, 32], [190, 140, 32], [128, 178, 26], [176, 176, 26]].forEach(([x, y, r]) => (g += `<circle cx="${x}" cy="${y}" r="${r}" fill="#3fa34d"/>`));
      [[130, 110], [170, 108], [110, 150], [196, 138], [150, 140]].forEach(([x, y]) => (g += L(x, y, 12, "#5fcf6f")));
    } else {
      const grande = stage === 5;
      g += `<path d="M150 258V${grande ? 120 : 130}" stroke="#7a5a35" stroke-width="12" stroke-linecap="round"/><path d="M150 190l-46-34M150 170l50-38" stroke="#7a5a35" stroke-width="7" stroke-linecap="round"/>`;
      const cc = grande ? [[150, 104, 52], [100, 140, 40], [202, 134, 40], [124, 176, 32], [178, 176, 32]] : [[150, 116, 44], [106, 146, 34], [194, 142, 34], [128, 178, 28], [174, 178, 28]];
      cc.forEach(([x, y, r], i) => (g += `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 2 ? "#3fa34d" : "#2f8f3e"}"/>`));
      [[130, 96], [172, 92], [96, 138], [206, 130], [150, 124], [118, 172], [184, 170]].forEach(([x, y]) => (g += L(x, y, 13, "#5fcf6f")));
      if (grande) [[128, 110], [176, 104], [100, 150], [200, 146], [146, 142], [120, 180], [182, 180], [154, 80], [124, 84]].forEach(([x, y]) => (g += fruto(x, y, 10)));
      else {
        [[130, 104], [170, 100], [104, 148], [198, 140], [150, 136], [122, 178], [180, 176]].forEach(([x, y]) => (g += flor(x, y)));
        [[146, 122], [118, 158], [186, 158]].forEach(([x, y]) => (g += fruto(x, y, 6).replace(cor, "#6cbf4a")));
      }
    }
    return `<svg viewBox="0 0 300 290" role="img" aria-hidden="true">
      <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe6ff"/><stop offset="1" stop-color="#eef9ff"/></linearGradient></defs>
      <rect width="300" height="290" rx="16" fill="url(#cg)"/><circle cx="246" cy="48" r="22" fill="#ffd54a"/>${solo}${g}</svg>`;
  }

  /* ---------- Passo a passo interativo ---------- */
  let atual = window.MUDAS[0];
  let etapa = 0;
  const painel = (m, n) => {
    const e = ETAPAS[n];
    const esperado = e.d ? find(m.desenvolvimento, e.d).map(([, t]) => t).join(" ") : "";
    const grupos = e.g(m).filter(([, itens]) => itens.length);
    return `
      <div class="care-stage__art">${planta(n, FRUTA[m.fruta] || "#f28c1e")}
        <p class="care-stage__caption"><strong>${esc(e.t)}</strong><span>${esc(e.q)}</span></p>
      </div>
      <div class="care-stage__info">
        ${esperado ? `<p class="care-stage__expect"><b>O que esperar:</b> ${esc(esperado)}</p>` : ""}
        ${grupos.map(([nome, itens]) => `<div class="care-stage__group"><h4 class="care-sub">${nome}</h4>${rows(itens)}</div>`).join("")}
      </div>`;
  };
  function desenha() {
    const dots = ETAPAS.map(
      (e, i) => `<button type="button" class="care-node${i === etapa ? " is-active" : ""}${i < etapa ? " is-done" : ""}" data-i="${i}" aria-pressed="${i === etapa}">
        <span class="care-node__dot">${i + 1}</span><span class="care-node__t">${esc(e.t)}</span><span class="care-node__q">${esc(e.q)}</span></button>`
    ).join("");
    stepper.innerHTML = `
      <div class="care-species-tabs" role="tablist">${window.MUDAS.map((m) => `<button type="button" role="tab" class="care-tab${m.id === atual.id ? " active" : ""}" data-id="${m.id}" aria-selected="${m.id === atual.id}">${esc(m.nome)}</button>`).join("")}</div>
      <p class="care-hint">Passe o mouse (ou toque) em cada etapa para ver os cuidados e como a muda evolui até o fruto.</p>
      <div class="care-path" style="--p:${(etapa / (ETAPAS.length - 1)) * 100}%"><div class="care-path__line"><i></i></div>${dots}</div>
      <div class="care-stage" id="careStage" aria-live="polite">${painel(atual, etapa)}</div>
      <div class="care-nav"><button type="button" class="btn btn--ghost" data-nav="-1" ${etapa === 0 ? "disabled" : ""}>← Etapa anterior</button><button type="button" class="btn btn--green" data-nav="1" ${etapa === ETAPAS.length - 1 ? "disabled" : ""}>Próxima etapa →</button></div>`;
  }
  function vai(n) {
    if (n === etapa || n < 0 || n >= ETAPAS.length) return;
    etapa = n;
    stepper.querySelectorAll(".care-node").forEach((b, i) => {
      b.classList.toggle("is-active", i === n);
      b.classList.toggle("is-done", i < n);
      b.setAttribute("aria-pressed", i === n);
    });
    stepper.querySelector(".care-path").style.setProperty("--p", (n / (ETAPAS.length - 1)) * 100 + "%");
    const st = stepper.querySelector("#careStage");
    st.innerHTML = painel(atual, n);
    st.classList.remove("is-in"); void st.offsetWidth; st.classList.add("is-in");
    stepper.querySelectorAll("[data-nav]").forEach((b) => (b.disabled = (b.dataset.nav === "-1" && n === 0) || (b.dataset.nav === "1" && n === ETAPAS.length - 1)));
  }
  stepper.addEventListener("mouseover", (e) => { const b = e.target.closest(".care-node"); if (b) vai(+b.dataset.i); });
  stepper.addEventListener("focusin", (e) => { const b = e.target.closest(".care-node"); if (b) vai(+b.dataset.i); });
  stepper.addEventListener("click", (e) => {
    const n = e.target.closest(".care-node"), t = e.target.closest(".care-tab"), nav = e.target.closest("[data-nav]");
    if (n) vai(+n.dataset.i);
    else if (nav) vai(etapa + +nav.dataset.nav);
    else if (t) { atual = window.MUDAS.find((m) => m.id === t.dataset.id); desenha(); }
  });

  /* ---------- Escolha da espécie ---------- */
  const loadImg = (el) => {
    const img = new Image();
    img.onload = () => { el.style.backgroundImage = `url("${el.dataset.img}")`; el.classList.add("is-loaded"); };
    img.src = el.dataset.img;
  };
  pick.innerHTML = window.MUDAS.map(
    (m) => `
    <a class="care-pick__item" href="#${m.id}" data-id="${m.id}">
      <span class="care-pick__img img-slot" data-img="${esc(m.foto)}"></span>
      <span class="care-pick__body"><strong>${esc(m.nome)}</strong><em>${esc(m.cientifico)}</em><span class="care-pick__go">Ver o passo a passo <span>↓</span></span></span>
    </a>`
  ).join("");
  document.querySelectorAll("[data-img]").forEach(loadImg);

  function daHash(scroll) {
    const m = window.MUDAS.find((x) => x.id === location.hash.slice(1));
    if (m) { atual = m; etapa = 0; desenha(); if (scroll) stepper.scrollIntoView({ behavior: "smooth", block: "start" }); }
  }
  pick.addEventListener("click", (e) => {
    const a = e.target.closest(".care-pick__item");
    if (!a) return;
    e.preventDefault();
    history.replaceState(null, "", "#" + a.dataset.id);
    daHash(true);
  });
  window.addEventListener("hashchange", () => daHash(true));
  desenha();
  daHash(location.hash.length > 1);
})();
