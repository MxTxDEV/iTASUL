# Grupo Itasul — Site institucional

Site vitrine do **Grupo Itasul**: locação de equipamentos para construção civil, caçambas de entulho e caminhão Munck.

Feito em HTML, CSS e JavaScript puros: não precisa instalar nada. Basta abrir o `index.html` ou publicar a pasta em qualquer hospedagem (Hostinger, Vercel, Netlify, GitHub Pages…).

## Estrutura: três áreas, cada uma com menu e cor próprios

O site é o **Grupo Itasul**, que reúne duas empresas. Uma barra no topo de todas as páginas
(Grupo · Itasul Locações · MAP Reciclagem) leva de uma área à outra, e o menu muda conforme a área.

```
GRUPO ITASUL (página principal)
  index.html            → apresenta o grupo e as duas empresas (clique em cada uma)
  contatos.html         → Guia da Cidade (contatos de Itatiaiuçu)

ITASUL LOCAÇÕES (vermelho)
  locacoes.html         → visão geral da empresa
  ferramentas.html      → catálogo de ferramentas (com filtro por tipo)
  cacambas.html         → caçambas de entulho (fotos no chão e cheias)
  munck.html            → caminhão Munck (fotos do serviço atendendo)

MAP RECICLAGEM (verde)
  map.html              → visão geral da empresa
  mudas.html            → mudas frutíferas: fichas das espécies

assets/css/style.css    → visual (cores no topo do arquivo, em :root)
assets/js/main.js       → menu, animações, galeria e formulário → WhatsApp
assets/img/             → imagens
tools/atualizar-paginas.py → mantém cabeçalho, rodapé e menus iguais em todas as páginas
```

### Mudar o menu, o rodapé ou criar uma página nova

O cabeçalho e o rodapé se repetem em todas as páginas, então são gerados por um script.
Edite os menus em `tools/atualizar-paginas.py` e rode:

```
python3 tools/atualizar-paginas.py
```

Para uma página nova: crie o `.html` com `<header class="header" id="header"></header>` e
`<footer class="footer"></footer>` vazios, inclua-a em `PAGES` no script e rode o comando.

### Tipografia

O site usa uma única família, a **Inter** (a mais usada em sites e produtos digitais modernos),
hospedada em `assets/fonts/` (não depende do Google). Os tamanhos e pesos de cada tipo de texto
ficam em `assets/css/style.css`. Padrão de escrita: títulos e botões com só a primeira letra
maiúscula (ex.: "Locação de ferramentas"); rótulos pequenos em maiúsculas com espaçamento.

### Cores

- **Itasul Locações** usa o vermelho (`--red`).
- **MAP Reciclagem** usa o verde: a classe `theme-map` no `<body>` troca o vermelho por verde
  em toda a página (botões, destaques, rodapé), sem precisar mexer página por página.

## Imagens: onde colocar cada uma

Salve os arquivos em `assets/img/` com **exatamente** estes nomes. Enquanto uma imagem não existir, o site mostra um fundo padrão no lugar dela.

| Arquivo                     | Onde aparece                                  | Tamanho sugerido |
|-----------------------------|-----------------------------------------------|------------------|
| `logo-horizontal-branca.png` | Menu no topo (ícones + nome em branco)       | já incluída      |
| `logo-branca.png`           | Rodapé (logo vertical, nome em branco)        | já incluída      |
| `logo.png`                  | Logo vertical com nome preto (fundos claros)  | já incluída      |
| `logo-icone.png`            | Só os ícones, sem o nome                      | já incluída      |
| `favicon.png`               | Ícone da aba do navegador                     | já incluída      |
| `hero.jpg`                  | Banner principal (tela de abertura)           | 1920×1080        |
| `sobre.jpg`                 | Seção "Quem somos" (vertical)                 | 800×1000         |
| `servico-equipamentos.jpg`  | Card de Locação de Equipamentos               | 800×500          |
| `servico-cacambas.jpg`      | Card de Caçambas de Entulho                   | 800×500          |
| `servico-munck.jpg`         | Card de Caminhão Munck                        | 800×500          |
| `galeria-1.jpg` … `galeria-6.jpg` | Galeria "Nossa frota em ação"           | 1200×800         |

**Página Ferramentas**

| Arquivo | Onde aparece |
|---|---|
| `ferramentas-topo.jpg` | Fundo do topo da página (1920×1080) |
| `ferramenta-betoneira.jpg` | Betoneira |
| `ferramenta-compactador-de-solo.jpg` | Compactador de solo |
| `ferramenta-placa-vibratoria.jpg` | Placa vibratória |
| `ferramenta-andaime.jpg` | Andaime |
| `ferramenta-furadeira.jpg` | Furadeira |
| `ferramenta-martelete.jpg` | Martelete |
| `ferramenta-serra-marmore.jpg` | Serra mármore |

Fotos das ferramentas: formato 4:3 (ex.: 800×600).

**Página Caçambas**

| Arquivo | Onde aparece |
|---|---|
| `cacambas-topo.jpg` | Fundo do topo da página |
| `cacamba-servico.jpg` | Foto ao lado do texto "O serviço" |
| `cacamba-chao-1.jpg` … `cacamba-chao-3.jpg` | Caçamba no chão / no local |
| `cacamba-cheia-1.jpg` … `cacamba-cheia-3.jpg` | Caçamba cheia |

**Página Caminhão Munck**

| Arquivo | Onde aparece |
|---|---|
| `munck-topo.jpg` | Fundo do topo da página |
| `munck-servico.jpg` | Foto ao lado do texto "O serviço" |
| `munck-atendimento-1.jpg` … `munck-atendimento-6.jpg` | "Nosso serviço atendendo" (a 1ª aparece grande) |

## Mudas (MAP Reciclagem)

Os dados de cada espécie ficam em `assets/js/mudas-dados.js`. Os campos marcados como
"Consulte" (idade, tamanho, altura e procedência da muda) aparecem em cinza no site até
serem preenchidos. Fotos (opcionais): `assets/img/muda-laranja-bahia.jpg`,
`muda-mexerica-ponca.jpg`, `muda-acerola.jpg`, `muda-limao-tahiti.jpg` e `mudas-topo.jpg`.
Cada espécie tem link direto, ex.: `mudas.html#acerola`.

## Conteúdo institucional

Os textos de história, missão, visão, valores, endereço e da MAP Reciclagem vêm da apresentação
institucional do Grupo Itasul. Fotos tiradas dos slides: `assets/img/map-*.jpg` (central de
transbordo e planta de RCC), `frota-*.jpg` (galeria da Itasul Locações) e `sobre.jpg`.
Para fotos melhores, basta trocar os arquivos mantendo o mesmo nome.

## Guia da Cidade (contatos de Itatiaiuçu)

Os contatos ficam em `assets/js/guia-dados.js`, um por linha. Para incluir um comércio, copie
uma linha e troque nome, categoria, endereço, telefone (e `whats: true` se tiver WhatsApp).
A busca, os filtros e os botões de ligar/WhatsApp/mapa são gerados sozinhos.

## Adicionar uma ferramenta

Em `ferramentas.html`, copie um bloco `<article class="tool">…</article>`, troque o nome, os textos, a categoria (`data-cat`: concretagem, compactacao, acesso, perfuracao ou corte) e o nome da foto.

## O que falta personalizar

- **WhatsApp**: em `assets/js/main.js`, troque `WHATSAPP_NUMBER` (ex.: `5511999998888`).
- **Telefone, e-mail, endereço e horário**: seção de contato e rodapé do `index.html`.
- **Nossa história**: anos (`20XX`) e textos da linha do tempo.
- **Números**: anos de mercado, obras atendidas etc. (atributos `data-count`).
- **Redes sociais**: links do Instagram e Facebook no rodapé.

## Portfólio (para enviar aos clientes)

`portfolio.html` (menu **Portfólio**) é a apresentação institucional completa, com as fotos do site: grupo,
Itasul Locações, catálogo, MAP Reciclagem, mudas e contato. Tem botões **Baixar em PDF**, **Compartilhar**
(WhatsApp/menu do celular) e **Copiar link**. Também imprime em A4, uma seção por folha.

- **PDF** (`assets/downloads/Portfolio-Grupo-Itasul.pdf`) e **imagem de pré-visualização**
  (`assets/img/og-portfolio.jpg`) são gerados por `node tools/gerar-portfolio-pdf.mjs`
  (precisa de `npm i playwright`). Rode de novo sempre que mudar textos, fotos ou contatos.
- **Contatos**: telefone, WhatsApp e e-mail ficam no topo de `assets/js/main.js`. Enquanto o WhatsApp (ou o e-mail) estiver sem preencher, o
  número de exemplo, o portfólio esconde telefone e botões de WhatsApp (nunca mostra contato falso).
- Os endereços `og:url`/`og:image` do `<head>` usam o domínio `https://grupoitasul.com.br`.

## Perguntas frequentes, mapa, galeria e SEO

- **Perguntas frequentes**: seção `#faq` em `cacambas.html`, `munck.html` e `ferramentas.html` (blocos `<details class="faq__item">`). Se mudar uma pergunta, ajuste também o JSON-LD `FAQPage` no `<head>` da mesma página.
- **Como chegar**: seção `#como-chegar` na página inicial (mapa do Google com o endereço e botão "Abrir no Google Maps").
- **Nossa frota**: galeria `#frota` na página inicial (`assets/img/frota-obra-1.jpg` … `-6.jpg`).
- **SEO**: cada página tem `canonical`, tags Open Graph e a página inicial tem dados de empresa local (JSON-LD). `sitemap.xml` e `robots.txt` ficam na raiz; adicione páginas novas no `sitemap.xml`.

## WhatsApp e horário

No topo de `assets/js/main.js`: `WHATSAPP_NUMBER` (31 97107-8138), `WHATSAPP_DISPLAY`, `HOURS` e, opcionalmente, `WHATSAPP_LINK`
(link curto; se preencher, ele substitui as mensagens prontas por serviço). Depois de mudar, gere o PDF do portfólio de novo.

## Mapa de cuidados da muda

`cuidados-mudas.html` mostra, para cada espécie, um passo a passo interativo (passe o mouse ou toque em cada etapa: plantio, primeiro mês, primeiro ano, segundo ano, flores e primeiros frutos, planta adulta e colheita), com a ilustração da muda crescendo até o fruto. No PDF e na impressão sai a lista completa dos cuidados (plantar, irrigação, adubação, podas, pragas e calendário). O conteúdo vem de
`assets/js/mudas-dados.js` (os mesmos dados das fichas), montado por `assets/js/cuidados-mudas.js`. No fim da página há o botão que baixa
`assets/downloads/Cuidados-das-Mudas-Grupo-Itasul.pdf`, gerado junto com o PDF do portfólio por `node tools/gerar-portfolio-pdf.mjs`.
Se mudar algum cuidado em `mudas-dados.js`, rode o gerador de novo para atualizar o PDF.
