/* =========================================================
   MUDAS — escolha da espécie, ficha completa e abas de aprendizado
   ========================================================= */
(function () {
  "use strict";
  const grid = document.getElementById("mudasGrid");
  const detail = document.getElementById("mudaDetalhe");
  if (!grid || !detail || !window.MUDAS) return;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fruit = (tipo, big) => `<span class="fruit fruit--${tipo}${big ? " fruit--big" : ""}" aria-hidden="true"><i></i><i></i><i></i><b></b></span>`;
  const table = (rows, h1, h2) => `
    <table class="mtable">
      <thead><tr><th>${h1}</th><th>${h2}</th></tr></thead>
      <tbody>${rows.map(([a, b]) => `<tr><th scope="row">${esc(a)}</th><td>${esc(b)}</td></tr>`).join("")}</tbody>
    </table>`;
  const timeline = (rows) => `
    <ol class="mtimeline">${rows.map(([a, b]) => `<li><strong>${esc(a)}</strong><span>${esc(b)}</span></li>`).join("")}</ol>`;
  const steps = (rows) => `
    <div class="msteps">${rows.map(([a, b]) => `<div class="mstep"><h4>${esc(a)}</h4><p>${esc(b)}</p></div>`).join("")}</div>`;

  const TOPICOS = [
    ["plantar", "Como plantar"],
    ["irrigacao", "Irrigação"],
    ["adubacao", "Adubação"],
    ["podas", "Podas e manutenção"],
    ["pragas", "Pragas e doenças"],
    ["calendario", "Calendário de desenvolvimento"],
  ];

  const DICAS_IRRIGACAO = [
    ["Como regar", "Regue no pé da planta, de manhã cedo ou no fim da tarde, sem molhar as folhas."],
    ["Teste do dedo", "Enfie o dedo 5 cm na terra: se estiver seca, regue; se estiver úmida, espere."],
    ["Excesso de água", "Folhas amareladas e caindo, solo sempre encharcado e cheiro ruim indicam excesso."],
    ["Falta de água", "Folhas murchas ou enroladas nas horas quentes e queda de flores e frutinhos indicam falta."],
    ["Cobertura morta", "Palha, folhas secas ou capim cortado ao redor da planta seguram a umidade e reduzem as regas."],
    ["Florada e frutos", "Não deixe faltar água na florada e no crescimento dos frutos: é a fase mais sensível."],
  ];

  function conteudo(m, topico) {
    switch (topico) {
      case "irrigacao":
        return `<h3>Orientação de irrigação por fase</h3>${table(m.irrigacao, "Fase", "Orientação")}<h3>Dicas</h3>${steps(DICAS_IRRIGACAO)}`;
      case "calendario":
        return `<h3>Desenvolvimento esperado após o plantio</h3>${timeline(m.desenvolvimento)}<p class="mnote">O desenvolvimento varia conforme clima, solo, manejo e porta-enxerto.</p>`;
      default:
        return steps(m.aprender[topico]);
    }
  }

  /* ---------- Cartões das espécies ---------- */
  grid.innerHTML = window.MUDAS.map(
    (m) => `
    <a class="mcard" href="#${m.id}" data-id="${m.id}">
      <div class="mcard__media img-slot" data-img="${esc(m.foto)}">${fruit(m.fruta)}</div>
      <div class="mcard__body">
        <h3>${esc(m.nome)}</h3>
        <em>${esc(m.cientifico)}</em>
        <p>${esc(m.resumo)}</p>
        <span class="mcard__link">Ver ficha completa <span>→</span></span>
      </div>
    </a>`
  ).join("");

  /* ---------- Ficha completa ---------- */
  function render(m) {
    grid.querySelectorAll(".mcard").forEach((c) => c.classList.toggle("active", c.dataset.id === m.id));
    const info = Object.entries(m.muda)
      .map(([k, v]) => `<div class="minfo${v === "Consulte" ? " minfo--pend" : ""}"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
      .join("");
    detail.innerHTML = `
      <div class="mhead">
        <div class="mhead__media img-slot" data-img="${esc(m.foto)}">${fruit(m.fruta, true)}</div>
        <div class="mhead__text">
          <span class="eyebrow">Muda de ${esc(m.nome.toLowerCase())}</span>
          <h2 class="section__title">${esc(m.nome)}</h2>
          <p class="mhead__sci">${esc(m.cientifico)}</p>
          <dl class="minfo-grid">${info}</dl>
          <a href="#" class="btn btn--primary btn--lg" data-wa-muda>Encomendar esta muda</a>
        </div>
      </div>

      <div class="mblocks">
        <section class="mblock">
          <h3 class="mblock__title">Identificação botânica e genética</h3>
          ${table(m.identificacao, "Característica", "Informação")}
        </section>
        <section class="mblock">
          <h3 class="mblock__title">Características</h3>
          ${table(m.caracteristicas, "Característica", "Referência técnica")}
        </section>
        <section class="mblock">
          <h3 class="mblock__title">Orientação de irrigação</h3>
          ${table(m.irrigacao, "Fase", "Orientação")}
        </section>
        <section class="mblock">
          <h3 class="mblock__title">Desenvolvimento esperado</h3>
          ${table(m.desenvolvimento, "Período após o plantio", "Desenvolvimento esperado (varia)")}
        </section>
      </div>

      <section class="mficha">
        <div class="mficha__head">${fruit(m.fruta)}<div><span>Ficha da planta</span><strong>${esc(m.nome)}</strong></div></div>
        ${table(m.ficha, "Informação", "Característica")}
      </section>

      <section class="mlearn">
        <h3 class="mlearn__title">Escolha o que deseja aprender</h3>
        <div class="mlearn__tabs" role="tablist">
          ${TOPICOS.map(([k, l], i) => `<button role="tab" class="mtab${i === 0 ? " active" : ""}" data-topic="${k}" aria-selected="${i === 0}">${l}</button>`).join("")}
        </div>
        <div class="mlearn__panel" role="tabpanel">${conteudo(m, "plantar")}</div>
      </section>`;

    // fotos (se existirem) e WhatsApp
    detail.querySelectorAll("[data-img]").forEach(loadImg);
    const wa = detail.querySelector("[data-wa-muda]");
    const num = typeof WHATSAPP_NUMBER !== "undefined" ? WHATSAPP_NUMBER : "";
    wa.href = `https://wa.me/${num}?text=${encodeURIComponent(`Olá, Grupo Itasul! Vim pelo site e gostaria de encomendar muda de ${m.nome}.`)}`;
    wa.target = "_blank";
    wa.rel = "noopener";

    // abas de aprendizado
    const panel = detail.querySelector(".mlearn__panel");
    detail.querySelectorAll(".mtab").forEach((b) =>
      b.addEventListener("click", () => {
        detail.querySelectorAll(".mtab").forEach((x) => {
          x.classList.toggle("active", x === b);
          x.setAttribute("aria-selected", x === b);
        });
        panel.innerHTML = conteudo(m, b.dataset.topic);
      })
    );
    detail.hidden = false;
  }

  function loadImg(el) {
    const img = new Image();
    img.onload = () => {
      el.style.backgroundImage = `url("${el.dataset.img}")`;
      el.classList.add("is-loaded");
    };
    img.src = el.dataset.img;
  }
  grid.querySelectorAll("[data-img]").forEach(loadImg);

  /* ---------- Navegação pela âncora (#laranja-bahia…) ---------- */
  function fromHash(scroll) {
    const m = window.MUDAS.find((x) => x.id === location.hash.slice(1));
    if (!m) return;
    render(m);
    if (scroll) detail.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  window.addEventListener("hashchange", () => fromHash(true));
  fromHash(true);
})();
