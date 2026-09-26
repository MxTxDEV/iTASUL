# Grupo Itaçu — Site institucional

Site vitrine do **Grupo Itaçu**: locação de equipamentos para construção civil, caçambas de entulho e caminhão Munck.

Feito em HTML, CSS e JavaScript puros: não precisa instalar nada. Basta abrir o `index.html` ou publicar a pasta em qualquer hospedagem (Hostinger, Vercel, Netlify, GitHub Pages…).

## Estrutura

```
index.html            → página completa (todas as seções)
assets/css/style.css  → visual (cores no topo do arquivo, em :root)
assets/js/main.js     → menu, animações, galeria e formulário → WhatsApp
assets/img/           → coloque aqui as imagens
```

## Imagens: onde colocar cada uma

Salve os arquivos em `assets/img/` com **exatamente** estes nomes. Enquanto uma imagem não existir, o site mostra um fundo padrão no lugar dela.

| Arquivo                     | Onde aparece                                  | Tamanho sugerido |
|-----------------------------|-----------------------------------------------|------------------|
| `logo.png`                  | Menu no topo (fundo transparente, logo clara) | ~400×120         |
| `logo-branca.png`           | Rodapé (versão branca da logo)                | ~400×120         |
| `favicon.png`               | Ícone da aba do navegador                     | 512×512          |
| `hero.jpg`                  | Banner principal (tela de abertura)           | 1920×1080        |
| `sobre.jpg`                 | Seção "Quem somos" (vertical)                 | 800×1000         |
| `servico-equipamentos.jpg`  | Card de Locação de Equipamentos               | 800×500          |
| `servico-cacambas.jpg`      | Card de Caçambas de Entulho                   | 800×500          |
| `servico-munck.jpg`         | Card de Caminhão Munck                        | 800×500          |
| `galeria-1.jpg` … `galeria-6.jpg` | Galeria "Nossa frota em ação"           | 1200×800         |

## O que falta personalizar

- **WhatsApp**: em `assets/js/main.js`, troque `WHATSAPP_NUMBER` (ex.: `5511999998888`).
- **Telefone, e-mail, endereço e horário**: seção de contato e rodapé do `index.html`.
- **Nossa história**: anos (`20XX`) e textos da linha do tempo.
- **Números**: anos de mercado, obras atendidas etc. (atributos `data-count`).
- **Redes sociais**: links do Instagram e Facebook no rodapé.
