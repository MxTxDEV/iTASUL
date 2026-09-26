/* =========================================================
   GRUPO ITAÇU — Scripts do site
   ========================================================= */

/* ▼▼▼ CONFIGURAÇÃO — troque pelo número real (DDI + DDD + número, só dígitos) ▼▼▼ */
const WHATSAPP_NUMBER = "5500000000000";
const WHATSAPP_MSG = "Olá, Grupo Itaçu! Vim pelo site e gostaria de um orçamento.";
/* ▲▲▲ ------------------------------------------------------------------- ▲▲▲ */

(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const waLink = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

  /* ---------- Links do WhatsApp ---------- */
  $$(".js-whatsapp").forEach((a) => (a.href = waLink(WHATSAPP_MSG)));
  // Botões com mensagem própria, ex.: data-wa="Quero alugar uma Betoneira"
  $$("[data-wa]").forEach((a) => {
    a.href = waLink(`Olá, Grupo Itaçu! Vim pelo site. ${a.dataset.wa}`);
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* ---------- Imagens: carrega cada foto e só troca o fundo se ela existir ---------- */
  $$("[data-img]").forEach((el) => {
    const src = el.dataset.img;
    const img = new Image();
    img.onload = () => {
      el.style.backgroundImage = `url("${src}")`;
      el.classList.add("is-loaded");
    };
    img.src = src;
  });

  /* ---------- Cabeçalho ao rolar ---------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  const toggle = $("#navToggle");
  const setMenu = (open) => {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  toggle.addEventListener("click", () => setMenu(!document.body.classList.contains("nav-open")));
  $$("#nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  /* ---------- Link ativo conforme a seção visível ---------- */
  const links = $$(".nav__link");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${entry.target.id}`));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  // Só na página inicial: marca no menu a seção que está na tela
  links
    .filter((l) => l.getAttribute("href").startsWith("#"))
    .forEach((l) => {
      const section = $(l.getAttribute("href"));
      if (section) sectionObserver.observe(section);
    });

  /* ---------- Animação de entrada ---------- */
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 90}ms`;
    revealObserver.observe(el);
  });

  /* ---------- Contadores ---------- */
  const countObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.count;
        const suffix = el.dataset.suffix || "";
        const duration = 1800;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString("pt-BR") + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  $$("[data-count]").forEach((el) => countObserver.observe(el));

  /* ---------- Galeria (lightbox) ---------- */
  const lightbox = $("#lightbox");
  const lightboxImg = $("img", lightbox);
  if (lightbox) {
    const closeLightbox = () => (lightbox.hidden = true);
    $$(".gallery__item, [data-zoom]").forEach((item) =>
      item.addEventListener("click", () => {
        if (!item.classList.contains("is-loaded")) return;
        lightboxImg.src = item.dataset.img;
        lightbox.hidden = false;
      })
    );
    lightbox.addEventListener("click", (e) => e.target !== lightboxImg && closeLightbox());
    document.addEventListener("keydown", (e) => e.key === "Escape" && closeLightbox());
  }

  /* ---------- Filtro do catálogo de ferramentas ---------- */
  const filters = $$(".filter");
  filters.forEach((btn) =>
    btn.addEventListener("click", () => {
      const cat = btn.dataset.filter;
      filters.forEach((b) => b.classList.toggle("active", b === btn));
      $$(".tool").forEach((tool) => {
        tool.hidden = cat !== "todos" && !tool.dataset.cat.split(" ").includes(cat);
      });
    })
  );

  /* ---------- "Solicitar orçamento" do serviço já preenche o formulário ---------- */
  const serviceSelect = $("#serviceSelect");
  if (serviceSelect) {
    $$("[data-service]").forEach((a) =>
      a.addEventListener("click", () => (serviceSelect.value = a.dataset.service))
    );
  }

  /* ---------- Formulário → WhatsApp ---------- */
  const form = $("#contactForm");
  const feedback = $("#formFeedback");
  if (form) form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    $$("[required]", form).forEach((field) => {
      const ok = field.value.trim() !== "";
      field.classList.toggle("is-invalid", !ok);
      if (!ok) valid = false;
    });
    if (!valid) {
      feedback.textContent = "Preencha os campos obrigatórios: nome, telefone e serviço.";
      return;
    }
    const d = Object.fromEntries(new FormData(form));
    const msg = [
      "Olá, Grupo Itaçu! Gostaria de um orçamento.",
      "",
      `*Nome:* ${d.nome}`,
      `*Telefone:* ${d.telefone}`,
      `*Serviço:* ${d.servico}`,
      d.endereco && `*Endereço da obra:* ${d.endereco}`,
      d.mensagem && `*Mensagem:* ${d.mensagem}`,
    ].filter(Boolean).join("\n");
    feedback.textContent = "Abrindo o WhatsApp…";
    window.open(waLink(msg), "_blank", "noopener");
    form.reset();
  });
  if (form) $$("input, select, textarea", form).forEach((f) =>
    f.addEventListener("input", () => f.classList.remove("is-invalid"))
  );

  /* ---------- Ano no rodapé ---------- */
  $("#year").textContent = new Date().getFullYear();
})();
