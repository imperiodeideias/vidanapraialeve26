# Trocar as imagens por fotos reais dos catálogos

As fotos dos produtos que estão no site hoje vieram dos PDFs, mas na extração anterior foi pega a **miniatura** de cada página (cerca de 486x394 px) em vez da foto grande. Ampliadas nos cards premium, essas miniaturas ficam borradas e "plastificadas" — daí a aparência de imagem gerada por IA. As páginas dos PDFs também contêm a versão grande de cada prato (entre 900 e 1300 px, algumas até 2300 px), que é a foto real de estúdio.

## O que será feito

1. **Re-extrair todas as fotos de produto dos três PDFs** (pratos, salgados e doces, sucos detox), escolhendo sempre a imagem de maior resolução de cada página em vez da miniatura.
2. **Recortar corretamente** as fotos que hoje estão em proporções estranhas (vários sucos estão em faixas horizontais/verticais cortadas), padronizando um enquadramento quadrado/4:3 centrado no prato.
3. **Substituir os arquivos em `src/assets/produtos/`** mantendo os mesmos nomes, para que catálogo e home continuem funcionando sem alteração de código.
4. **Otimizar peso**: converter para JPG de qualidade alta com largura máxima em torno de 1200 px, e reduzir os arquivos gigantes atuais (um deles tem 7 MB, outro 1,2 MB), melhorando o tempo de carregamento.
5. **Capas das linhas**: hoje as 7 capas (`product-daily.jpg`, `product-performance.jpg`, etc.) são imagens genéricas. Cada linha passará a usar a melhor foto real de um de seus próprios pratos como capa, deixando o catálogo coerente com o produto vendido.
6. As fotos de ambiente/praia (hero, banner, família) continuam como estão — não há equivalente real nos materiais enviados. Se você enviar fotos reais da marca (loja, praia, equipe, embalagens), eu substituo essas também.

## Observação

O link do Google Drive não é acessível por aqui. Se quiser usar aquelas fotos, basta anexá-las direto no chat que eu as aplico no lugar das atuais.

## Detalhes técnicos

- Extração com `pdfimages`/PIL: para cada página, selecionar o objeto de imagem de maior área e descartar logos, selos e ícones por limite mínimo de tamanho.
- Reprocessamento com PIL: crop centrado, resize com Lanczos, export JPG progressivo (qualidade ~85).
- `src/data/catalogo.ts`: atualizar apenas as extensões dos imports que mudarem de `.png` para `.jpg` e os campos `cover` das linhas.

## Correção pendente de build

`src/components/SiteChrome.tsx` está com erro de tipagem no menu (as linhas 47 e 79, nos `<Link to={n.to}>`): o TypeScript entende que `n.to` pode ser `undefined` porque a lista `navItems` mistura itens com rota interna e itens com âncora. A correção é declarar um tipo explícito para a lista (`{ l, to }` ou `{ l, href }`), o que remove os dois erros sem mudar o comportamento do menu. Isso entra junto com o trabalho de imagens.
