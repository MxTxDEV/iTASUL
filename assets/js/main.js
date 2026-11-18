/* =========================================================
   GRUPO ITASUL — Scripts do site
   ========================================================= */

/* ▼▼▼ CONFIGURAÇÃO — troque pelo número real (DDI + DDD + número, só dígitos) ▼▼▼ */
const WHATSAPP_LINK = "https://wa.link/ouwq6u";      // link oficial do WhatsApp do Grupo (todos os botões de WhatsApp usam este)
const WHATSAPP_NUMBER = "5500000000000";           // WhatsApp (ainda não informado: botões de WhatsApp ficam ocultos no portfólio)
const PHONE_NUMBER = "553135721440";               // telefone fixo, para o link de ligar
const PHONE_DISPLAY = "(31) 3572-1440";            // telefone como aparece escrito no site
const EMAIL = "";                                  // e-mail ainda não informado: some do site enquanto estiver vazio
const WHATSAPP_MSG = "Olá, Grupo Itasul! Vim pelo site e gostaria de um orçamento.";
/* O telefone, o WhatsApp e o e-mail de TODAS as páginas (menu, rodapé, contato e portfólio)
   são preenchidos a partir das linhas acima: basta trocar aqui. */
/* ▲▲▲ ------------------------------------------------------------------- ▲▲▲ */

(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const waLink = (msg) => WHATSAPP_LINK || `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

  /* ---------- Links do WhatsApp ---------- */
  $$(".js-whatsapp").forEach((a) => (a.href = waLink(WHATSAPP_MSG)));
  // Botões com mensagem própria, ex.: data-wa="Quero alugar uma Betoneira"
  $$("[data-wa]").forEach((a) => {
    a.href = waLink(`Olá, Grupo Itasul! Vim pelo site. ${a.dataset.wa}`);
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* ---------- Contatos: preenchidos a partir da configuração do topo do arquivo ---------- */
  $$('[data-contact="phone"]').forEach((el) => {
    el.textContent = PHONE_DISPLAY;
    if (el.tagName === "A") el.href = `tel:+${PHONE_NUMBER}`;
  });
  document.documentElement.classList.toggle("email-pending", !EMAIL);
  $$('[data-contact="email"]').forEach((el) => {
    if (!EMAIL) return;
    el.textContent = EMAIL;
    if (el.tagName === "A") el.href = `mailto:${EMAIL}`;
  });
  // Enquanto o WhatsApp for o número de exemplo (55 + zeros), o portfólio esconde o telefone e os
  // botões de WhatsApp (.pf-needs-phone = telefone, .pf-needs-wa = WhatsApp), para nunca mostrar um contato falso a um cliente.
  document.documentElement.classList.toggle("phone-pending", /^\d{2}0{5,}/.test(PHONE_NUMBER));
  document.documentElement.classList.toggle("wa-pending", !WHATSAPP_LINK && /^\d{2}0{5,}/.test(WHATSAPP_NUMBER));

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

  /* ---------- Aviso "Role para baixo" no topo de cada página ---------- */
  // Mostra uma seta animada no fim da primeira tela para o visitante saber que há mais conteúdo.
  // Clicar leva à próxima seção; ao rolar a página, o aviso some.
  const heroEl = $(".hero, .page-hero");
  if (heroEl) {
    const cue = document.createElement("a");
    cue.className = "scroll-cue";
    cue.href = "#";
    cue.setAttribute("aria-label", "Role para baixo para ver mais informações");
    cue.innerHTML =
      '<span class="scroll-cue__text">Role para baixo</span>' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
    cue.addEventListener("click", (e) => {
      e.preventDefault();
      const next = heroEl.nextElementSibling;
      const top = next ? next.getBoundingClientRect().top + window.scrollY - 40 : window.innerHeight;
      window.scrollTo({ top, behavior: "smooth" });
    });
    heroEl.appendChild(cue);
    const hideCue = () => cue.classList.toggle("is-hidden", window.scrollY > 80);
    hideCue();
    window.addEventListener("scroll", hideCue, { passive: true });
  }

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
  // Links com #âncora acendem quando a seção correspondente está no meio da tela.
  // Quando nenhuma seção com link está visível, volta o link da própria página
  // (o que tem aria-current), se houver; na página inicial, mantém o último.
  const links = $$(".nav__link");
  const hashLinks = links.filter((l) => l.getAttribute("href").startsWith("#"));
  const pageLink = links.find((l) => l.getAttribute("aria-current") === "page");
  let current = null;
  const paint = () => {
    const target = hashLinks.find((l) => l.getAttribute("href") === `#${current}`) || pageLink;
    if (target) links.forEach((l) => l.classList.toggle("active", l === target));
  };
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) current = entry.target.id;
        else if (current === entry.target.id) current = null;
      });
      paint();
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  hashLinks.forEach((l) => {
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
  const lightboxImg = lightbox && $("img", lightbox);
  if (lightbox) {
    const closeLightbox = () => (lightbox.hidden = true);
    $$(".gallery__item, [data-zoom]").forEach((item) =>
      item.addEventListener("click", () => {
        if (!item.classList.contains("is-loaded")) return;
        lightboxImg.src = item.dataset.img;
        lightbox.hidden = false;
      })
    );
    // fotos do portfólio (<img> comum, que também imprimem no PDF)
    $$("img[data-zoom]").forEach((img) => {
      img.tabIndex = 0;
      const open = () => {
        lightboxImg.src = img.currentSrc || img.src;
        lightboxImg.alt = img.alt;
        lightbox.hidden = false;
      };
      img.addEventListener("click", open);
      img.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
    });
    lightbox.addEventListener("click", (e) => e.target !== lightboxImg && closeLightbox());
    document.addEventListener("keydown", (e) => e.key === "Escape" && closeLightbox());
  }

  /* ---------- Portfólio: compartilhar e copiar o link ---------- */
  const shareBtn = $("#pfShare");
  const copyBtn = $("#pfCopy");
  const toast = $("#pfToast");
  const say = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-on");
    clearTimeout(say.t);
    say.t = setTimeout(() => toast.classList.remove("is-on"), 2600);
  };
  const pageUrl = () => location.href.split("#")[0];
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const data = { title: "Portfólio | Grupo Itasul", text: "Conheça o portfólio do Grupo Itasul:", url: pageUrl() };
      if (navigator.share) {
        try { await navigator.share(data); } catch (e) { /* a pessoa cancelou */ }
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${data.text} ${data.url}`)}`, "_blank", "noopener");
      }
    });
  }
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(pageUrl());
        say("Link copiado!");
      } catch (e) {
        window.prompt("Copie o link:", pageUrl());
      }
    });
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
      "Olá, Grupo Itasul! Gostaria de um orçamento.",
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
