# Home mais visual + imagens realistas

Inspiração do site de referência aplicada à identidade atual (paleta, tipografia e linhas do catálogo permanecem).

## 1. Hero remodelado (ideia do site de referência)
Trocar a foto única de fundo por uma composição editorial:
- Coluna esquerda: eyebrow com ponto coral ("Alimentação leve em Peruíbe"), título grande com palavra em script coral, parágrafo, botão principal + link do Instagram.
- Coluna direita: colagem de fotos reais dos produtos em máscaras circulares/blob (prato principal grande + suco + prato menor), com selo giratório "curadoria prazer + praticidade" e badge flutuante "Comida de verdade para a vida real".
- Faixa de estatísticas embaixo: nº de produtos do catálogo, "Local — atendimento em Peruíbe", "Leve — na rotina e na escolha".
- Barra de anúncio fina no topo do site com o Instagram.

## 2. Linhas com numeração e mais ritmo
Cards das linhas ganham índice (01, 02, 03…), hover com zoom suave da imagem e seta animada, mantendo os links para `/catalogo/<slug>`.

## 3. Vitrine de sabores na home
Nova seção com abas de filtro por linha (Todos, Dia a Dia, Performance, …) mostrando uma seleção de produtos reais em cards compactos, com CTA para o catálogo completo. Filtro apenas no cliente, usando os dados já existentes.

## 4. Imagens mais reais
Gerar novas imagens em qualidade premium (fotografia documental, luz natural, sem cara de render):
- **Hero**: peças da colagem usam fotos reais dos PDFs; imagem de apoio ao fundo em tom suave.
- **Quem somos**: cena real de cozinha/entrega em Peruíbe, pessoas brasileiras, luz natural, grão fotográfico.
- **Como funciona**: fundo com a praia de Peruíbe (areia clara, morro/Ilha Queimada ao fundo, vegetação da Mata Atlântica, luz de fim de tarde), tratada em fotografia realista com overlay escuro para leitura dos passos.

## Detalhes técnicos
- Alterações concentradas em `src/routes/index.tsx`, com pequenos utilitários visuais em `src/styles.css` (máscaras blob, selo rotativo, badges).
- Novas imagens em `src/assets/` substituindo `hero-beach-food.jpg`, `about-family.jpg` e `beach-banner.jpg`; produtos continuam vindo de `src/assets/produtos/`.
- Seção de sabores lê `linhas` de `src/data/catalogo.ts` — sem duplicar dados.
- `loading="lazy"`, `width`/`height` e `alt` descritivos mantidos para performance e SEO.
