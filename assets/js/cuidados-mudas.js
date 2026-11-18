/* =========================================================
   MAPA DE CUIDADOS DA MUDA — monta a página a partir de assets/js/mudas-dados.js
   Para mudar um cuidado, edite os dados em mudas-dados.js (vale para as fichas e para este mapa).
   ========================================================= */
(function () {
  "use strict";
  const pick = document.getElementById("carePick");
  const list = document.getElementById("careList");
  if (!pick || !list || !window.MUDAS) return;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rows = (items) =>
    `<dl class="care-rows">${items.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join("")}</dl>`;

  const DICAS_IRRIGACAO = [
    ["Como regar", "Regue no pé da planta, de manhã cedo ou no fim da tarde, sem molhar as folhas."],
    ["Teste do dedo", "Enfie o dedo 5 cm na terra: se estiver seca, regue; se estiver úmida, espere."],
    ["Excesso de água", "Folhas amareladas e caindo, solo sempre encharcado e cheiro ruim indicam excesso."],
    ["Falta de água", "Folhas murchas ou enroladas nas horas quentes e queda de flores e frutinhos indicam falta."],
    ["Cobertura morta", "Palha, folhas secas ou capim cortado ao redor da planta seguram a umidade e reduzem as regas."],
  ];

  const PASSOS = [
    ["plantar", "Como plantar", (m) => rows(m.aprender.plantar)],
    ["irrigacao", "Irrigação", (m) => rows(m.irrigacao) + `<h4 class="care-sub">Dicas de rega</h4>` + rows(DICAS_IRRIGACAO)],
    ["adubacao", "Adubação", (m) => rows(m.aprender.adubacao)],
    ["podas", "Podas e manutenção", (m) => rows(m.aprender.podas)],
    ["pragas", "Pragas e doenças", (m) => rows(m.aprender.pragas)],
    ["calendario", "Calendário de desenvolvimento", (m) => rows(m.desenvolvimento) + `<p class="care-note">O desenvolvimento varia conforme clima, solo, manejo e porta-enxerto.</p>`],
  ];

  const loadImg = (el) => {
    const img = new Image();
    img.onload = () => {
      el.style.backgroundImage = `url("${el.dataset.img}")`;
      el.classList.add("is-loaded");
    };
    img.src = el.dataset.img;
  };

  /* ---------- Escolha da espécie ---------- */
  pick.innerHTML = window.MUDAS.map(
    (m) => `
    <a class="care-pick__item" href="#${m.id}">
      <span class="care-pick__img img-slot" data-img="${esc(m.foto)}"></span>
      <span class="care-pick__body"><strong>${esc(m.nome)}</strong><em>${esc(m.cientifico)}</em><span class="care-pick__go">Ver os cuidados <span>↓</span></span></span>
    </a>`
  ).join("");

  /* ---------- Cuidados de cada espécie ---------- */
  list.innerHTML = window.MUDAS.map(
    (m, i) => `
    <section class="section care-species${i % 2 ? " care-species--alt" : ""}" id="${m.id}">
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
          ${PASSOS.map(
            ([k, titulo, fn], n) => `
          <article class="care-card care-card--${k}">
            <h3><span class="care-card__n">${n + 1}</span>${titulo}</h3>
            ${fn(m)}
          </article>`
          ).join("")}
        </div>
      </div>
    </section>`
  ).join("");

  document.querySelectorAll("[data-img]").forEach(loadImg);
})();
