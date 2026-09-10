# Ajustes rápidos na home

Pequenas alterações de conteúdo e estilo em `src/routes/index.tsx` e `src/styles.css`.

## 1. Botão flutuante do WhatsApp
- Inserir botão fixo no canto inferior direito, acima do footer, com link para `https://wa.me/551333662961`.
- Usar ícone do WhatsApp (lucide-react ou svg), cor verde da marca ou coral, com sombra suave.
- Incluir `aria-label="Fale conosco pelo WhatsApp"`.

## 2. Ocultar seções
- Comentar ou remover a seção `id="kits"` ("Kits selecionados").
- Comentar ou remover a seção `id="assinaturas"` ("Assinaturas").
- Remover os itens "Kits" e "Assinaturas" do menu de navegação (desktop e mobile).

## 3. Depoimentos
- Alterar o array `depoimentos`:
  - 1º: nome "Soraia", localização "Peruíbe, SP".
  - 2º: nome "Andrey", localização "Peruíbe, SP".
  - 3º: nome "Edna", localização "Peruíbe, SP".

## 4. Tipografia do destaque coral
- Trocar a fonte dos elementos `.font-script` (usados nos destaques em coral) de `Madelyn, "Great Vibes", cursive` para `Capriola`.
- Manter a cor coral e adicionar peso mais forte (`font-bold` ou `font-black`) para compensar a mudança de estilo.
- Atualizar a definição em `src/styles.css` e, se necessário, ajustar tamanhos nos títulos para manter o ritmo visual.
