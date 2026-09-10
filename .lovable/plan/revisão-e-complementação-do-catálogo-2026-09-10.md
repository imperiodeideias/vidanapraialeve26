# Revisão e complementação do catálogo

Objetivo: completar o catálogo com os pratos que faltam, corrigir categorias e criar a área de Kits Detox — sem mexer no layout, na identidade visual ou na navegação, e sem remover nada do que já existe.

## O que será adicionado

Com ficha completa retirada dos catálogos oficiais (nome, descrição/ingredientes, peso e informação nutricional quando o material traz):

- Caseirinhos: Sobrecoxa com polenta ao molho de tomate; Lombo ao molho com legumes, arroz e feijão carioca; Soja com legumes, arroz integral e feijão; Frango com creme de milho e arroz branco; Sobrecoxa com arroz, feijão e batata sautée; Carne moída com legumes, arroz e feijão; Saint Peter com arroz, feijão carioca e mix de legumes; e mais três que estão no material oficial e faltavam no site: Frango cremoso com legumes e mandioca, Picadinho bovino com arroz, feijão e farofa, Macarrão sem glúten à bolonhesa
- Aves: Filé de frango em crosta de castanha de caju com arroz integral e legumes sautée
- Carnes: Estrogonofe de carne com batata, arroz integral e brócolis
- Massas: Penne sem glúten ao molho branco com frango, ervilha e milho
- Veggie: Estrogonofe de grão-de-bico com arroz integral, brócolis e batata
- Sucos: Suco de Maçã (volta ao catálogo, com a foto oficial)

Somente com o nome, sem descrição/ingredientes/nutricional, porque não há ficha nos catálogos oficiais enviados:

- Caseirinho de linguiça com arroz, feijão e farofa
- Lasanha à bolonhesa com peito de peru (Massas)
- Filé de tilápia ao molho de tomate, alcaparras e arroz à grega (Peixes)
- Filé de tilápia com creme de abóbora (Peixes)
- Caldo de couve-flor com alho-poró (Sopas & Caldos)
- Sopa funcional com castanhas (Sopas & Caldos)
- Lentilhas ao Pomodoro com arroz integral e cenoura (Veggie)
- Escondidinho de banana-da-terra com molho bolonhesa de soja (Veggie)

Esses itens ficam visíveis normalmente, esperando o material oficial. Assim que você enviar as fichas e as fotos, eu completo.

## Kits Detox

Nova categoria "Kits Detox" com página própria em /catalogo/kits-detox, seguindo exatamente o mesmo estilo de card e de página das outras linhas. Entram Kit Detox 1 Dia, 3 Dias e 5 Dias, com a composição descrita no catálogo de sucos. Sem preço.

## Correções e validações

- Galinhada Light passa para AVES e Feijoada Light passa para CARNES, como no material oficial.
- Tilápia Assada com legumes e arroz integral permanece: ela existe no catálogo oficial e não será usada como substituta dos outros pratos de tilápia.
- Nenhum produto existente será removido. Observação para sua decisão futura: no material oficial o "Sabor Sertanejo" aparece na linha CARNES, e hoje está em Caseirinhos no site — aguardo sua autorização antes de mover.
- Conferência de duplicidade por nome e por endereço de produto.
- Todos os produtos continuam sem preço.

## Contagens e textos

Os números de produtos da home e das páginas de catálogo já são calculados automaticamente a partir da lista, então passam a refletir o novo total assim que os itens entrarem. Vou revisar a home e o catálogo em busca de qualquer número escrito à mão (como "50 opções") e ajustar.

## Fotos

As imagens dos novos produtos serão extraídas das páginas dos próprios catálogos oficiais, no mesmo recorte e tratamento das atuais. Quando um item não tiver foto no material, o card usa a imagem de capa da linha até você enviar a oficial.

## Detalhes técnicos

- `src/data/catalogo.ts`: novos itens em `linhas`, com `slug`, `nome`, `subtitulo`, `img`, `peso`, `kcal`, `proteina`, `descricao` e `tags`; reposicionamento de Galinhada e Feijoada; nova linha `kits-detox`.
- Extração das fotos via `pdfimages`/recorte 4:3 para `src/assets/produtos/`, seguindo o padrão existente.
- `src/routes/catalogo.index.tsx` e `catalogo.$linha.tsx` continuam dirigidos por dados; a nova linha entra automaticamente em rota, filtros, JSON-LD e contadores.
- `src/routes/index.tsx`: revisão dos textos/contadores e do menu de linhas.
- Verificação final: build limpo e conferência das páginas no navegador.
