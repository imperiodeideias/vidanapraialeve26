# Atualizar fotos de salgados, nuts e suco

## O que será feito

1. Associar os anexos aos produtos correspondentes:
   - `tortalow.webp` → Torta Low Carb
   - `empadafrango.jpg` → Empada de Frango
   - `empada_palmito.jpg` → Empada de Palmito
   - `Cópia_de_IMG_6032.jpg` → Pão de Queijo Fit
   - `IMG_7763.JPG` → Coxinha de Frango Fit
   - `SNACK_07.jpg` → Mix de Nuts
   - `RBM_8745.jpg` → Suco de Melancia, substituindo a foto adicionada anteriormente
2. Enviar as sete fotos para o armazenamento de imagens do projeto, preservando a resolução original e evitando arquivos pesados no código.
3. Atualizar o catálogo para usar as novas fotos sem alterar nomes, descrições, pesos ou dados nutricionais.
4. Atualizar também as capas e vitrines que usam diretamente Coxinha Fit, Mix de Nuts ou Suco de Melancia, para manter as imagens consistentes em todo o site.
5. Validar visualmente as páginas de Salgados & Pizzas, Nuts e Sucos Detox, incluindo o enquadramento da foto vertical da Torta Low Carb nos cards.

## Detalhes técnicos

- Criar arquivos de referência `.asset.json` para as sete imagens.
- Atualizar os imports em `src/data/catalogo.ts` e os usos diretos encontrados em `src/routes/index.tsx`.
- Manter `object-cover` nos cards; ajustar apenas o posicionamento da Torta Low Carb se a validação mostrar corte inadequado.
- Conferir carregamento das imagens, ausência de erros e compilação final.
