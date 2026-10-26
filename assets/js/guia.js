/* =========================================================
   GUIA DE CONTATOS — busca, filtro por categoria e cartões
   ========================================================= */
(function () {
  "use strict";
  const list = document.getElementById("guiaLista");
  if (!list || !window.GUIA) return;

  const search = document.getElementById("guiaBusca");
  const chipsBox = document.getElementById("guiaCategorias");
  const count = document.getElementById("guiaTotal");
  const empty = document.getElementById("guiaVazio");
  document.querySelectorAll("[data-guia-atualizado]").forEach((el) => (el.textContent = window.GUIA_ATUALIZADO));

  const ICON = {
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.5A8.4 8.4 0 1 1 21 11.5z"/></svg>',
    insta: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>',
  };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const digits = (t) => t.replace(/\D/g, "");
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  function card(c) {
    const d = c.tel ? digits(c.tel) : "";
    const isMobile = d.length === 11 && d[2] === "9";
    const actions = [];
    if (c.tel) actions.push(`<a class="gcard__btn" href="tel:+55${d}">${ICON.phone}${esc(c.tel)}</a>`);
    if (c.whats || isMobile) actions.push(`<a class="gcard__btn gcard__btn--wa" href="https://wa.me/55${d}" target="_blank" rel="noopener">${ICON.wa}WhatsApp</a>`);
    if (c.insta) actions.push(`<a class="gcard__btn" href="https://www.instagram.com/${esc(c.insta)}/" target="_blank" rel="noopener">${ICON.insta}@${esc(c.insta)}</a>`);
    const map = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.nome}, ${c.end || ""}, Itatiaiuçu - MG`)}`;
    return `<article class="gcard">
      <span class="gcard__cat">${esc(c.cat)}</span>
      <h3>${esc(c.nome)}</h3>
      ${c.end ? `<p class="gcard__end">${ICON.pin}${esc(c.end)}</p>` : ""}
      ${c.obs ? `<p class="gcard__obs">${esc(c.obs)}</p>` : ""}
      <div class="gcard__actions">${actions.join("")}</div>
      <div class="gcard__foot">
        <a href="${map}" target="_blank" rel="noopener">Ver no mapa</a>
        ${c.fonte ? `<a href="${esc(c.fonte)}" target="_blank" rel="noopener nofollow">Fonte</a>` : ""}
      </div>
    </article>`;
  }

  // categorias na ordem em que aparecem nos dados
  const cats = [...new Set(window.GUIA.map((c) => c.cat))];
  let active = "Todos";
  chipsBox.innerHTML = ["Todos", ...cats]
    .map((c) => `<button class="filter${c === active ? " active" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`)
    .join("");
  chipsBox.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    active = b.dataset.cat;
    chipsBox.querySelectorAll("button").forEach((x) => x.classList.toggle("active", x === b));
    render();
  });
  search.addEventListener("input", render);

  function render() {
    const q = norm(search.value.trim());
    const items = window.GUIA.filter(
      (c) => (active === "Todos" || c.cat === active) && (!q || norm(`${c.nome} ${c.cat} ${c.end || ""}`).includes(q))
    );
    list.innerHTML = items.map(card).join("");
    count.textContent = `${items.length} ${items.length === 1 ? "contato" : "contatos"}`;
    empty.hidden = items.length > 0;
  }
  render();
})();
