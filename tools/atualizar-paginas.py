#!/usr/bin/env python3
"""Mantém cabeçalho, rodapé, tema de cor e migalhas de pão iguais em todas as páginas.

O site tem três áreas, cada uma com o seu menu e a sua cor:
  - Grupo Itasul     (grupo)  → index.html, contatos.html
  - Itasul Locações  (loc)    → locacoes.html, ferramentas.html, cacambas.html, munck.html   (vermelho)
  - MAP Reciclagem   (map)    → map.html, mudas.html                                         (verde)

Para criar uma página nova: crie o .html com <header class="header" id="header"></header> e
<footer class="footer"></footer> vazios, inclua a página em PAGES e rode:

    python3 tools/atualizar-paginas.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LOC, MAP, GRUPO = "Itasul Locações", "MAP Reciclagem", "Grupo Itasul"

# arquivo: (área, página ativa no menu, migalhas [(texto, link)] — o último é a página atual)
PAGES = {
    "index.html":       ("grupo", "inicio", None),
    "contatos.html":    ("grupo", "guia", [("Guia da Cidade", None)]),
    "locacoes.html":    ("loc", "visao", [(LOC, None)]),
    "ferramentas.html": ("loc", "ferramentas", [(LOC, "locacoes.html"), ("Ferramentas", None)]),
    "cacambas.html":    ("loc", "cacambas", [(LOC, "locacoes.html"), ("Caçambas", None)]),
    "munck.html":       ("loc", "munck", [(LOC, "locacoes.html"), ("Caminhão Munck", None)]),
    "map.html":         ("map", "visao", [(MAP, None)]),
    "mudas.html":       ("map", "mudas", [(MAP, "map.html"), ("Mudas", None)]),
}
BODY_CLASS = {"grupo": "", "loc": ' class="theme-loc"', "map": ' class="theme-map"'}


def menu(page, sec):
    """Itens do menu principal da área: (chave, texto, link, classe extra)."""
    home = page == "index.html"
    if sec == "grupo":
        return [
            ("inicio", "Início", "#inicio" if home else "index.html", ""),
            ("loc", LOC, "locacoes.html", " nav__link--loc"),
            ("map", MAP, "map.html", " nav__link--map"),
            ("historia", "Nossa História", "#historia" if home else "index.html#historia", ""),
            ("guia", "Guia da Cidade", "contatos.html", ""),
            ("contato", "Contato", "#contato" if home else "index.html#contato", ""),
        ]
    contato = "#contato" if page == ("locacoes.html" if sec == "loc" else "map.html") else \
        ("locacoes.html#contato" if sec == "loc" else "map.html#contato")
    if sec == "loc":
        return [
            ("visao", "Visão geral", "locacoes.html", ""),
            ("ferramentas", "Ferramentas", "ferramentas.html", ""),
            ("cacambas", "Caçambas", "cacambas.html", ""),
            ("munck", "Caminhão Munck", "munck.html", ""),
            ("contato", "Contato", contato, ""),
        ]
    return [
        ("visao", "Visão geral", "map.html", ""),
        ("mudas", "Mudas", "mudas.html", ""),
        ("contato", "Contato", contato, ""),
    ]


def cta(page, sec):
    if sec == "loc":
        return '<a href="#" data-wa="Gostaria de um orçamento de locação." class="btn btn--primary nav__cta">Pedir orçamento</a>'
    if sec == "map":
        return '<a href="#" data-wa="Gostaria de encomendar mudas." class="btn btn--primary nav__cta">Encomendar mudas</a>'
    return f'<a href="{"#contato" if page == "index.html" else "index.html#contato"}" class="btn btn--primary nav__cta">Solicitar orçamento</a>'


def header(page, sec, key):
    home = page == "index.html"
    tabs = [
        ("grupo", "index.html", 'Grupo<span class="cb__long"> Itasul</span>'),
        ("loc", "locacoes.html", '<span class="cb__long">Itasul </span>Locações'),
        ("map", "map.html", 'MAP<span class="cb__long"> Reciclagem</span>'),
    ]
    ACT, CUR = " is-active", ' aria-current="true"'
    bar = "\n".join(
        f'        <a href="{href}" class="cb cb--{s}{ACT if s == sec else ""}"{CUR if s == sec else ""}><i class="dot dot--{s}"></i>{label}</a>'
        for s, href, label in tabs
    )
    items = []
    for k, text, href, extra in menu(page, sec):
        active = k == key
        cur = ' aria-current="page"' if active and not href.startswith("#") else ""
        items.append(f'          <li><a href="{href}" class="nav__link{" active" if active else ""}{extra}"{cur}>{text}</a></li>')
    return f'''<header class="header" id="header">
    <div class="company-bar" aria-label="Empresas do grupo">
      <div class="container company-bar__inner">
{bar}
      </div>
    </div>
    <div class="container header__inner">
      <a href="{"#inicio" if home else "index.html"}" class="brand" aria-label="Grupo Itasul - início">
        <img class="brand__logo" src="assets/img/logo-horizontal-branca.png" alt="Grupo Itasul"
             onload="this.parentNode.classList.add('has-logo')" onerror="this.remove()">
        <span class="brand__text"><span class="brand__mark">G</span><span>Grupo <strong>Itasul</strong></span></span>
      </a>

      <nav class="nav" id="nav" aria-label="Menu principal">
        <ul class="nav__list">
{chr(10).join(items)}
        </ul>
        {cta(page, sec)}
      </nav>

      <button class="nav__toggle" id="navToggle" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>'''


FOOTER = f'''<footer class="footer">
    <div class="container footer__grid">
      <div class="footer__brand">
        <a href="index.html" class="brand brand--footer" aria-label="Grupo Itasul">
          <img class="brand__logo" src="assets/img/logo-branca.png" alt="Grupo Itasul"
               onload="this.parentNode.classList.add('has-logo')" onerror="this.remove()">
          <span class="brand__text"><span class="brand__mark">G</span><span>Grupo <strong>Itasul</strong></span></span>
        </a>
        <p>O Grupo Itasul reúne a Itasul Locações, com equipamentos, caçambas e caminhão Munck, e a MAP Reciclagem, com mudas frutíferas.</p>
        <div class="social">
          <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg></a>
          <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
          <a href="https://wa.me/5500000000000" class="js-whatsapp" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.5A8.4 8.4 0 1 1 21 11.5z"/></svg></a>
        </div>
      </div>
      <div>
        <h4>Grupo Itasul</h4>
        <ul>
          <li><a href="index.html">Início</a></li>
          <li><a href="index.html#historia">Nossa História</a></li>
          <li><a href="contatos.html">Guia da Cidade</a></li>
          <li><a href="index.html#contato">Contato</a></li>
        </ul>
      </div>
      <div>
        <h4><i class="dot dot--loc"></i>{LOC}</h4>
        <ul>
          <li><a href="locacoes.html">Visão geral</a></li>
          <li><a href="ferramentas.html">Ferramentas</a></li>
          <li><a href="cacambas.html">Caçambas</a></li>
          <li><a href="munck.html">Caminhão Munck</a></li>
        </ul>
      </div>
      <div>
        <h4><i class="dot dot--map"></i>{MAP}</h4>
        <ul>
          <li><a href="map.html">Visão geral</a></li>
          <li><a href="mudas.html">Mudas</a></li>
        </ul>
      </div>
      <div>
        <h4>Contato</h4>
        <ul>
          <li>(00) 00000-0000</li>
          <li>contato@grupoitasul.com.br</li>
          <li>Cidade/UF</li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <div class="container">© <span id="year"></span> Grupo Itasul. Todos os direitos reservados.</div>
    </div>
  </footer>'''


def breadcrumb(crumbs):
    parts = [f'<a href="index.html">{GRUPO}</a>']
    for text, href in crumbs:
        parts.append(f'<a href="{href}">{text}</a>' if href else f"<span>{text}</span>")
    return '<nav class="breadcrumb" aria-label="Você está em">' + "/".join(parts) + "</nav>"


def main():
    for name, (sec, key, crumbs) in PAGES.items():
        path = ROOT / name
        if not path.exists():
            print(f"pulando {name} (não existe)")
            continue
        html = path.read_text(encoding="utf-8")
        new = re.sub(r"<header class=\"header\".*?</header>", lambda m: header(name, sec, key), html, count=1, flags=re.S)
        new = re.sub(r"<footer class=\"footer\">.*?</footer>", lambda m: FOOTER, new, count=1, flags=re.S)
        new = re.sub(r"<body[^>]*>", f"<body{BODY_CLASS[sec]}>", new, count=1)
        if crumbs:
            new = re.sub(r"<nav class=\"breadcrumb\"[^>]*>.*?</nav>", lambda m: breadcrumb(crumbs), new, count=1, flags=re.S)
        if new != html:
            path.write_text(new, encoding="utf-8")
            print(f"atualizado: {name}")
        else:
            print(f"sem mudanças: {name}")


if __name__ == "__main__":
    main()
