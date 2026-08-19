// Catálogo de produtos por linha — Vida na Praia Leve / Light Food Way
import coxaArrozGrega from "@/assets/produtos/coxa-arroz-grega.jpg";
import parmegianaFrango from "@/assets/produtos/parmegiana-frango.jpg";
import saborSertanejo from "@/assets/produtos/sabor-sertanejo.jpg";
import panquecaFrango from "@/assets/produtos/panqueca-frango.jpg";
import tilapiaAssada from "@/assets/produtos/tilapia-assada.jpg";
import escondidinhoCarne from "@/assets/produtos/escondidinho-carne.jpg";
import salmaoMaracuja from "@/assets/produtos/salmao-maracuja.jpg";
import escondidinhoFrango from "@/assets/produtos/escondidinho-frango.jpg";
import frangoCurry from "@/assets/produtos/frango-curry.jpg";
import fricasseFrango from "@/assets/produtos/fricasse-frango.jpg";
import frangoCubos from "@/assets/produtos/frango-cubos.jpg";
import patinhoMoido from "@/assets/produtos/patinho-moido.jpg";
import sopaFrango from "@/assets/produtos/sopa-frango.jpg";
import sopaDetox from "@/assets/produtos/sopa-detox.jpg";
import feijoadaVegana from "@/assets/produtos/feijoada-vegana.jpg";
import galinhadaLight from "@/assets/produtos/galinhada-light.jpg";
import feijoadaLight from "@/assets/produtos/feijoada-light.jpg";
import tilapiaCrosta from "@/assets/produtos/tilapia-crosta.jpg";
import moquecaCacao from "@/assets/produtos/moqueca-cacao.jpg";
import canjaFit from "@/assets/produtos/canja-fit.jpg";
import sopaCabotia from "@/assets/produtos/sopa-cabotia.jpg";
import sopaLowcarb from "@/assets/produtos/sopa-lowcarb.jpg";
import carneDesfiada from "@/assets/produtos/carne-desfiada.jpg";
import nhoqueMandioquinha from "@/assets/produtos/nhoque-mandioquinha.jpg";
import boloCarne from "@/assets/produtos/bolo-carne.jpg";
import estrogonofeFrango from "@/assets/produtos/estrogonofe-frango.jpg";
import nhoqueAbobora from "@/assets/produtos/nhoque-abobora.jpg";
import crepiocaPeru from "@/assets/produtos/crepioca-peru.jpg";
import coxinhaFit from "@/assets/produtos/coxinha-fit.jpg";
import tortaLowcarb from "@/assets/produtos/torta-lowcarb.jpg";
import crepiocaFrango from "@/assets/produtos/crepioca-frango.jpg";
import empadaFrango from "@/assets/produtos/empada-frango.jpg";
import empadaPalmito from "@/assets/produtos/empada-palmito.jpg";
import paoQueijoFit from "@/assets/produtos/pao-queijo-fit.jpg";
import pizzaFrango from "@/assets/produtos/pizza-frango.jpg";
import pizzaMarguerita from "@/assets/produtos/pizza-marguerita.jpg";
import brownieFit from "@/assets/produtos/brownie-fit.jpg";
import brigadeiroCremoso from "@/assets/produtos/brigadeiro-cremoso.jpg";
import beijinhoFit from "@/assets/produtos/beijinho-fit.jpg";
import mousseLimao from "@/assets/produtos/mousse-limao.jpg";
import mixNuts from "@/assets/produtos/mix-nuts.jpg";
import sucoMelancia from "@/assets/produtos/suco-melancia.jpg";
import sucoMaca from "@/assets/produtos/suco-maca.jpg";
import sucoAbacaxi from "@/assets/produtos/suco-abacaxi.jpg";
import sucoBlueMajik from "@/assets/produtos/suco-blue-majik.jpg";
import sucoSuperGreen from "@/assets/produtos/suco-super-green.jpg";
import sucoDesintox from "@/assets/produtos/suco-desintox.jpg";
import sucoRelax from "@/assets/produtos/suco-relax.jpg";
import sucoImuno from "@/assets/produtos/suco-imuno.jpg";
import sucoVitalmax from "@/assets/produtos/suco-vitalmax.jpg";
import sucoSucha from "@/assets/produtos/suco-sucha.jpg";


export type Produto = {
  slug: string;
  nome: string;
  subtitulo?: string;
  img: string;
  peso?: string;
  descricao: string;
  tags?: string[];
  kcal?: number;
  proteina?: number;
};

export type Linha = {
  slug: string;
  nome: string;
  eyebrow: string;
  headline: string;
  descricao: string;
  cover: string;
  cor: "sage" | "petrol" | "coral" | "deep";
  produtos: Produto[];
};

export const linhas: Linha[] = [
  {
    slug: "caseirinhos",
    nome: "Caseirinhos",
    eyebrow: "Dia a Dia",
    headline: "Comida de casa, feita com carinho.",
    descricao: "Nossa linha mais amada. Pratos completos com arroz, feijão, proteína e legumes — o almoço de domingo, todos os dias.",
    cover: coxaArrozGrega,
    cor: "sage",
    produtos: [
      { slug: "coxa-sobrecoxa-arroz-grega", nome: "Coxa e Sobrecoxa", subtitulo: "com arroz à grega", img: coxaArrozGrega, peso: "300g", kcal: 182, proteina: 11, descricao: "Coxa e sobrecoxa desossada com arroz à grega, batata, cenoura e ervilha.", tags: ["Sem glúten"] },
      { slug: "sabor-sertanejo", nome: "Sabor Sertanejo", subtitulo: "carne desfiada, feijão preto, arroz e banana", img: saborSertanejo, peso: "300g", descricao: "Um clássico brasileiro em versão leve: carne desfiada, feijão preto, arroz e banana da terra.", tags: ["Sem glúten"] },
      { slug: "feijoada-light", nome: "Feijoada Light", subtitulo: "arroz integral, farofa e couve", img: feijoadaLight, peso: "300g", kcal: 79, proteina: 4, descricao: "Feijoada equilibrada com copa lombo, calabresa, arroz integral, farofa e couve refogada." },
      { slug: "galinhada-light", nome: "Galinhada Light", img: galinhadaLight, peso: "300g", kcal: 112, proteina: 11, descricao: "Coxa de frango desossada, arroz integral, cenoura, milho e ervilha com temperos brasileiros.", tags: ["Sem glúten"] },
    ],
  },
  {
    slug: "aves",
    nome: "Aves",
    eyebrow: "Performance & Rotina",
    headline: "Frango do jeito que você ama.",
    descricao: "Receitas variadas com frango — do curry ao escondidinho — para dias saborosos e proteicos.",
    cover: parmegianaFrango,
    cor: "petrol",
    produtos: [
      { slug: "parmegiana-de-frango", nome: "Parmegiana de Frango", subtitulo: "com purê de batata", img: parmegianaFrango, peso: "300g", kcal: 87, proteina: 12, descricao: "Filé de frango empanado sem glúten com molho de tomate, mussarela sem lactose e purê de batata." },
      { slug: "escondidinho-de-frango", nome: "Escondidinho de Frango", subtitulo: "com purê de batata doce", img: escondidinhoFrango, peso: "300g", kcal: 135, proteina: 14, descricao: "Frango desfiado ao molho com purê cremoso de batata doce.", tags: ["Sem glúten"] },
      { slug: "frango-ao-curry", nome: "Frango ao Curry", subtitulo: "com legumes", img: frangoCurry, peso: "300g", kcal: 55, proteina: 5, descricao: "Peito de frango ao curry suave com cenoura, brócolis e couve-flor.", tags: ["Sem glúten"] },
      { slug: "fricasse-de-frango", nome: "Fricassê de Frango", subtitulo: "com arroz fake de couve-flor", img: fricasseFrango, peso: "300g", kcal: 126, proteina: 16, descricao: "Fricassê cremoso com arroz fake de couve-flor. Baixo carb, alto sabor.", tags: ["Low carb"] },
      { slug: "estrogonofe-de-frango", nome: "Estrogonofe de Frango", subtitulo: "batata, arroz integral e brócolis", img: estrogonofeFrango, peso: "300g", descricao: "Estrogonofe cremoso com creme de leite zero lactose, batata, arroz integral e brócolis." },
    ],
  },
  {
    slug: "carnes",
    nome: "Carnes",
    eyebrow: "Robustez & Sabor",
    headline: "Carne bovina em receitas equilibradas.",
    descricao: "Pratos completos com patinho e cortes magros, para saciar sem pesar.",
    cover: escondidinhoCarne,
    cor: "deep",
    produtos: [
      { slug: "escondidinho-de-carne", nome: "Escondidinho de Carne", subtitulo: "com purê de abóbora cabotiá", img: escondidinhoCarne, peso: "300g", kcal: 97, proteina: 8.5, descricao: "Acém desfiado com temperos brasileiros e purê cremoso de abóbora cabotiá.", tags: ["Sem glúten"] },
      { slug: "bolo-de-carne", nome: "Bolo de Carne", subtitulo: "na cama de legumes", img: boloCarne, peso: "300g", kcal: 117, proteina: 14, descricao: "Bolo de patinho com abobrinha, cenoura, brócolis e queijo zero lactose. Sem glúten.", tags: ["Sem glúten"] },
      { slug: "carne-desfiada-batata-doce", nome: "Carne Desfiada", subtitulo: "purê de batata doce e mix de legumes", img: carneDesfiada, peso: "300g", kcal: 99, proteina: 9.3, descricao: "Patinho desfiado com purê de batata doce e mix de legumes ao chimichurri.", tags: ["Sem glúten"] },
    ],
  },
  {
    slug: "massas",
    nome: "Massas",
    eyebrow: "Conforto Leve",
    headline: "Massas artesanais, sem culpa.",
    descricao: "Nhoques, panquecas e pastas sem glúten com molhos autorais.",
    cover: nhoqueAbobora,
    cor: "coral",
    produtos: [
      { slug: "nhoque-abobora-cabotia", nome: "Nhoque de Abóbora Cabotiá", subtitulo: "ao sugo com patinho moído", img: nhoqueAbobora, peso: "300g", kcal: 104, proteina: 4.5, descricao: "Nhoque de abóbora cabotiá com sugo natural e patinho moído.", tags: ["Sem glúten"] },
      { slug: "nhoque-mandioquinha-ragu", nome: "Nhoque de Mandioquinha", subtitulo: "com ragu de carne", img: nhoqueMandioquinha, peso: "300g", kcal: 51, descricao: "Nhoque delicado de mandioquinha com ragu suave de patinho.", tags: ["Sem glúten"] },
      { slug: "panqueca-frango-mussarela", nome: "Panqueca de Frango", subtitulo: "ao sugo com mussarela sem lactose", img: panquecaFrango, peso: "300g", kcal: 124, proteina: 11, descricao: "Panqueca sem glúten recheada com frango, ao sugo e mussarela sem lactose.", tags: ["Sem glúten"] },
    ],
  },
  {
    slug: "peixes",
    nome: "Peixes",
    eyebrow: "Premium",
    headline: "Peixes nobres, do mar ao seu prato.",
    descricao: "Tilápia, salmão e cação em receitas leves e sofisticadas.",
    cover: salmaoMaracuja,
    cor: "petrol",
    produtos: [
      { slug: "tilapia-assada", nome: "Tilápia Assada", subtitulo: "com legumes e arroz integral", img: tilapiaAssada, peso: "300g", kcal: 121, proteina: 9.5, descricao: "Filé de tilápia assado com abobrinha, berinjela, cenoura e arroz integral." },
      { slug: "tilapia-em-crosta", nome: "Tilápia em Crosta", subtitulo: "linhaça e gergelim com arroz fake de couve-flor", img: tilapiaCrosta, peso: "300g", kcal: 138, proteina: 14, descricao: "Filé de tilápia em crosta de linhaça dourada e gergelim. Low carb.", tags: ["Low carb", "Sem glúten"] },
      { slug: "salmao-ao-molho-de-maracuja", nome: "Salmão ao Molho de Maracujá", subtitulo: "arroz negro e brócolis", img: salmaoMaracuja, peso: "300g", kcal: 153, proteina: 13, descricao: "Salmão fresco com molho agridoce de maracujá, arroz negro e brócolis.", tags: ["Sem glúten"] },
      { slug: "moqueca-de-cacao", nome: "Moqueca de Cação", subtitulo: "e arroz de açafrão", img: moquecaCacao, peso: "300g", kcal: 135, proteina: 16, descricao: "Moqueca cremosa com leite de coco, azeite de dendê e arroz de açafrão.", tags: ["Sem glúten"] },
    ],
  },
  {
    slug: "maromba",
    nome: "Maromba",
    eyebrow: "Performance",
    headline: "Mais proteína, mais resultado.",
    descricao: "Pratos com alto valor proteico para quem treina e busca performance.",
    cover: frangoCubos,
    cor: "petrol",
    produtos: [
      { slug: "frango-em-cubos-batata-doce", nome: "Frango em Cubos", subtitulo: "com purê de batata doce", img: frangoCubos, peso: "300g", kcal: 196, proteina: 26, descricao: "Peito de frango em cubos com purê cremoso de batata doce. Alto valor proteico.", tags: ["High protein", "Sem glúten"] },
      { slug: "patinho-moido-mandioquinha", nome: "Patinho Moído", subtitulo: "com purê de mandioquinha", img: patinhoMoido, peso: "300g", kcal: 147, proteina: 17, descricao: "Patinho moído magro com purê de mandioquinha. Ideal pré e pós treino.", tags: ["High protein", "Sem glúten"] },
    ],
  },
  {
    slug: "sopas-caldos",
    nome: "Sopas & Caldos",
    eyebrow: "Bem-estar",
    headline: "Colo em forma de sopa.",
    descricao: "Sopas nutritivas e reconfortantes, do detox ao alto proteico.",
    cover: sopaFrango,
    cor: "sage",
    produtos: [
      { slug: "sopa-de-frango-alho-poro", nome: "Sopa de Frango", subtitulo: "com alho poró", img: sopaFrango, peso: "300g", kcal: 101, proteina: 8.1, descricao: "Sopa cremosa de frango com batata e alho poró. Sem glúten.", tags: ["Sem glúten"] },
      { slug: "canja-integral-fit", nome: "Canja Integral Fit", img: canjaFit, peso: "300g", kcal: 48, proteina: 6, descricao: "Canja leve com frango, arroz integral e cenoura. Aconchego em cada colher.", tags: ["Sem glúten"] },
      { slug: "sopa-cabotia-carne", nome: "Sopa de Cabotiá", subtitulo: "com carne desfiada", img: sopaCabotia, peso: "300g", kcal: 70, proteina: 4.9, descricao: "Sopa cremosa de abóbora cabotiá com carne desfiada e couve manteiga.", tags: ["Sem glúten"] },
      { slug: "sopa-detox", nome: "Sopa Detox", img: sopaDetox, peso: "300g", kcal: 50, proteina: 1.3, descricao: "Sopa detox de abóbora cabotiá e couve manteiga. Leve e reconfortante.", tags: ["Detox", "Sem glúten"] },
      { slug: "sopa-low-carb-frango", nome: "Sopa Low Carb", subtitulo: "de frango", img: sopaLowcarb, peso: "300g", kcal: 62, proteina: 5.9, descricao: "Sopa low carb com frango, mandioquinha, cenoura e abobrinha.", tags: ["Low carb", "Sem glúten"] },
    ],
  },
  {
    slug: "veggie",
    nome: "Veggie",
    eyebrow: "Bem-estar",
    headline: "100% vegetal, 100% sabor.",
    descricao: "Opções veganas ricas em proteína vegetal e fibras.",
    cover: feijoadaVegana,
    cor: "sage",
    produtos: [
      { slug: "feijoada-vegana", nome: "Feijoada Vegana", subtitulo: "arroz integral, couve e farofa", img: feijoadaVegana, peso: "300g", kcal: 129, proteina: 6.3, descricao: "Feijoada vegana com linguiça vegetal, feijão preto, arroz integral, couve e farofa de mandioca.", tags: ["Vegano"] },
    ],
  },
  {
    slug: "salgados",
    nome: "Salgados & Pizzas",
    eyebrow: "Lanches Inteligentes",
    headline: "Beliscar sem sair da linha.",
    descricao: "Crepiocas, empadas, pães de queijo e pizzas fit — pra qualquer hora do dia.",
    cover: coxinhaFit,
    cor: "coral",
    produtos: [
      { slug: "torta-low-carb", nome: "Torta Low Carb", img: tortaLowcarb, peso: "200g", kcal: 226, proteina: 34, descricao: "Torta de frango e couve flor com farinha de amêndoas. Zero glúten, zero lactose.", tags: ["Low carb", "Sem glúten"] },
      { slug: "crepioca-frango-requeijao", nome: "Crepioca de Frango", subtitulo: "com requeijão sem lactose", img: crepiocaFrango, peso: "110g", kcal: 190, proteina: 13, descricao: "Crepioca recheada com frango desfiado, milho, ervilha e requeijão sem lactose." },
      { slug: "crepioca-peito-peru", nome: "Crepioca de Peito de Peru", img: crepiocaPeru, peso: "110g", kcal: 188, proteina: 15, descricao: "Crepioca com peito de peru, queijo fresco sem lactose e molho de tomate natural." },
      { slug: "empada-frango", nome: "Empada de Frango", img: empadaFrango, peso: "140g", kcal: 368, proteina: 29, descricao: "Empada de massa de farinha de aveia recheada com frango, milho e ervilha." },
      { slug: "empada-palmito", nome: "Empada de Palmito", img: empadaPalmito, peso: "140g", kcal: 295, proteina: 15, descricao: "Empada de farinha de aveia recheada com palmito e molho de tomate." },
      { slug: "coxinha-de-frango-fit", nome: "Coxinha de Frango Fit", img: coxinhaFit, peso: "200g (4 un.)", kcal: 155, proteina: 10, descricao: "Coxinha de farinha de arroz e mandioca com recheio cremoso de frango. Sem glúten.", tags: ["Sem glúten"] },
      { slug: "pao-de-queijo-fit", nome: "Pão de Queijo Fit", img: paoQueijoFit, peso: "200g (10 un.)", kcal: 491, proteina: 14, descricao: "Pão de queijo cremoso com mussarela sem lactose. O clássico mineiro em versão leve." },
      { slug: "pizza-frango-requeijao", nome: "Pizza de Frango", subtitulo: "e requeijão lac free", img: pizzaFrango, peso: "180g", kcal: 243, proteina: 37, descricao: "Pizza fit com massa de sementes, frango desfiado e requeijão sem lactose.", tags: ["High protein", "Sem glúten"] },
      { slug: "pizza-marguerita", nome: "Pizza Marguerita", img: pizzaMarguerita, peso: "180g", kcal: 441, proteina: 20, descricao: "Massa de sementes com mussarela sem lactose, tomate, manjericão e azeitona.", tags: ["Sem glúten"] },
    ],
  },
  {
    slug: "doces",
    nome: "Momento Leve",
    eyebrow: "Sobremesas Funcionais",
    headline: "Doce com propósito.",
    descricao: "Sobremesas sem açúcar refinado, sem lactose e sem culpa.",
    cover: brownieFit,
    cor: "coral",
    produtos: [
      { slug: "brownie-fit", nome: "Brownie Fit", img: brownieFit, peso: "80g", kcal: 210, proteina: 7, descricao: "Brownie de cacau puro com chocolate 70%, farinha de aveia e óleo de coco.", tags: ["Sem açúcar"] },
      { slug: "brigadeiro-cremoso-fit", nome: "Brigadeiro Cremoso Fit", img: brigadeiroCremoso, peso: "80g", kcal: 162, proteina: 8, descricao: "Brigadeiro cremoso com leite zero lactose, cacau e eritritol.", tags: ["Sem açúcar", "Sem lactose"] },
      { slug: "beijinho-fit", nome: "Beijinho Fit", img: beijinhoFit, peso: "80g", kcal: 185, proteina: 7, descricao: "Beijinho cremoso com coco, óleo de coco e eritritol.", tags: ["Sem açúcar", "Sem lactose"] },
      { slug: "mousse-de-limao", nome: "Mousse de Limão", img: mousseLimao, peso: "80g", kcal: 33, descricao: "Mousse cremoso de limão taiti sem açúcar adicionado.", tags: ["Sem açúcar", "Sem lactose"] },
    ],
  },
  {
    slug: "sucos",
    nome: "Sucos Detox",
    eyebrow: "Funcionais",
    headline: "Prensados a frio, cheios de vida.",
    descricao: "Sucos naturais prensados a frio e funcionais para cada momento.",
    cover: sucoBlueMajik,
    cor: "sage",
    produtos: [
      { slug: "suco-melancia", nome: "Suco de Melancia", subtitulo: "prensado a frio", img: sucoMelancia, peso: "300ml", kcal: 100, descricao: "Melancia prensada a frio. Hidratação e frescor em cada gole.", tags: ["Prensado a frio"] },
      { slug: "suco-maca", nome: "Suco de Maçã", img: sucoMaca, peso: "300ml", kcal: 136, descricao: "Maçã prensada a frio, sem adição de açúcar." },
      { slug: "suco-abacaxi", nome: "Suco de Abacaxi", img: sucoAbacaxi, peso: "300ml", kcal: 152, descricao: "Abacaxi prensado a frio, doçura natural." },
      { slug: "suco-blue-majik", nome: "Suco Blue Majik", img: sucoBlueMajik, peso: "300ml", kcal: 114, descricao: "Abacaxi, água de coco, hortelã, spirulina azul, gengibre e cravo." },
      { slug: "suco-super-green", nome: "Suco Super Green", img: sucoSuperGreen, peso: "300ml", kcal: 88, descricao: "Maçã, couve, pepino, gengibre, limão, salsão, marapuama e spirulina." },
      { slug: "suco-desintox", nome: "Suco Desintox", img: sucoDesintox, peso: "300ml", kcal: 76, descricao: "Abacaxi, matcha, carqueja, mate verde, hortelã, gengibre, sálvia e alecrim.", tags: ["Detox"] },
      { slug: "suco-relax", nome: "Suco Relax", img: sucoRelax, peso: "300ml", kcal: 72, descricao: "Maracujá, anis, camomila, chia e melissa. Para acalmar." },
      { slug: "suco-imuno", nome: "Suco Imuno", img: sucoImuno, peso: "300ml", kcal: 80, descricao: "Morango, ora pro nobis, água de coco, limão, gengibre, canela e cúrcuma." },
      { slug: "suco-vitalmax", nome: "Suco Vitalmax", img: sucoVitalmax, peso: "300ml", kcal: 118, descricao: "Maçã, goiaba, beterraba, gengibre, pimenta de cheiro e caiena. Energia pura." },
      { slug: "suco-sucha", nome: "Suco Suchá", img: sucoSucha, peso: "300ml", kcal: 78, descricao: "Melancia, gengibre, cavalinha e colágeno." },
    ],
  },
  {
    slug: "nuts",
    nome: "Nuts",
    eyebrow: "Funcionais",
    headline: "Snacks que trabalham por você.",
    descricao: "Mix de castanhas e sementes selecionadas para lanches inteligentes.",
    cover: mixNuts,
    cor: "sage",
    produtos: [
      { slug: "mix-de-nuts", nome: "Mix de Nuts", img: mixNuts, peso: "30g", kcal: 187, proteina: 5.9, descricao: "Sementes de girassol, amendoim, semente de abóbora, castanha do pará e castanha de caju." },
    ],
  },
];

export const getLinha = (slug: string) => linhas.find((l) => l.slug === slug);
