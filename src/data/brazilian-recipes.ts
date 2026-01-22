// Receitas brasileiras saudáveis com informações nutricionais

export interface BrazilianRecipe {
  id: string
  name: string
  description: string
  prepTime: number // minutos
  servings: number
  estimatedCost: string // em R$
  difficulty: 'fácil' | 'média' | 'difícil'
  tags: string[]
  ingredients: string[]
  instructions: string[]
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
  tips?: string
}

export const BRAZILIAN_RECIPES: BrazilianRecipe[] = [
  {
    id: 'arroz-feijao-classico',
    name: 'Arroz com Feijão Clássico',
    description: 'Dupla brasileira perfeita: proteína completa e nutritiva',
    prepTime: 30,
    servings: 4,
    estimatedCost: 'R$ 8-12',
    difficulty: 'fácil',
    tags: ['Básico', 'Econômico', 'Proteína Completa', 'Vegano'],
    ingredients: [
      '2 xícaras de arroz integral',
      '1 xícara de feijão carioca (cozido)',
      '1 cebola pequena',
      '2 dentes de alho',
      '1 colher de sopa de óleo',
      'Sal a gosto'
    ],
    instructions: [
      'Refogue o alho e cebola no óleo',
      'Adicione o arroz e refogue por 2 minutos',
      'Adicione água (2,5x o volume do arroz) e sal',
      'Cozinhe em fogo baixo por 30-40 minutos (arroz integral)',
      'Para o feijão: refogue alho, adicione feijão cozido e tempere'
    ],
    nutrition: {
      calories: 380,
      protein: 14,
      carbs: 68,
      fat: 5,
      fiber: 12
    },
    tips: 'Arroz + feijão = proteína completa (aminoácidos essenciais). Cozinhe feijão em grande quantidade e congele em porções.'
  },
  {
    id: 'omelete-tapioca',
    name: 'Omelete com Tapioca',
    description: 'Café da manhã proteico e sem glúten',
    prepTime: 10,
    servings: 1,
    estimatedCost: 'R$ 3-5',
    difficulty: 'fácil',
    tags: ['Café da Manhã', 'Proteico', 'Sem Glúten', 'Rápido'],
    ingredients: [
      '2 ovos',
      '3 colheres de sopa de goma de tapioca',
      '1 fatia de queijo branco',
      'Tomate e orégano',
      'Sal a gosto'
    ],
    instructions: [
      'Bata os ovos com sal',
      'Em frigideira antiaderente, espalhe a tapioca',
      'Quando começar a grudar, vire',
      'Adicione os ovos mexidos por cima',
      'Finalize com queijo, tomate e orégano'
    ],
    nutrition: {
      calories: 285,
      protein: 22,
      carbs: 28,
      fat: 9,
      fiber: 2
    },
    tips: 'Ótimo pré ou pós-treino. Tapioca absorve rápido, ovos liberam proteína gradualmente.'
  },
  {
    id: 'frango-batata-doce',
    name: 'Frango Grelhado com Batata-Doce',
    description: 'Clássico da musculação brasileira',
    prepTime: 25,
    servings: 2,
    estimatedCost: 'R$ 10-15',
    difficulty: 'fácil',
    tags: ['Proteico', 'Ganho de Massa', 'Fitness'],
    ingredients: [
      '2 filés de frango (240g)',
      '2 batatas-doce médias',
      'Limão, alho e temperos',
      '1 colher de chá de azeite'
    ],
    instructions: [
      'Tempere o frango com limão, alho e sal (30min antes)',
      'Cozinhe as batatas-doce com casca (20min fervura ou 8min pressão)',
      'Grelhe o frango em frigideira antiaderente (5-7min cada lado)',
      'Sirva com salada verde'
    ],
    nutrition: {
      calories: 385,
      protein: 42,
      carbs: 38,
      fat: 6,
      fiber: 5
    },
    tips: 'Prepare vários filés de uma vez e congele. Batata-doce pode ser assada no forno (45min a 200°C) para textura mais cremosa.'
  },
  {
    id: 'vitamina-aveia-banana',
    name: 'Vitamina de Aveia com Banana',
    description: 'Energia rápida e sustentável para o dia',
    prepTime: 5,
    servings: 1,
    estimatedCost: 'R$ 2-4',
    difficulty: 'fácil',
    tags: ['Café da Manhã', 'Pré-Treino', 'Rápido', 'Vegetariano'],
    ingredients: [
      '1 banana madura',
      '3 colheres de sopa de aveia',
      '200ml de leite (ou vegetal)',
      '1 colher de chá de mel (opcional)',
      'Canela a gosto'
    ],
    instructions: [
      'Bata todos os ingredientes no liquidificador',
      'Adicione gelo se preferir gelado',
      'Beba imediatamente (aveia engrossa rápido)'
    ],
    nutrition: {
      calories: 285,
      protein: 12,
      carbs: 48,
      fat: 5,
      fiber: 7
    },
    tips: 'Ideal 30-60min antes do treino. Adicione pasta de amendoim (1 colher) para mais proteína e calorias.'
  },
  {
    id: 'salada-grao-de-bico',
    name: 'Salada de Grão-de-Bico',
    description: 'Proteína vegetal completa e refrescante',
    prepTime: 15,
    servings: 3,
    estimatedCost: 'R$ 8-12',
    difficulty: 'fácil',
    tags: ['Vegano', 'Proteico', 'Salada', 'Verão'],
    ingredients: [
      '1 lata de grão-de-bico (ou 1,5 xícara cozido)',
      '2 tomates',
      '1 pepino',
      '1/2 cebola roxa',
      'Suco de 1 limão',
      'Azeite, sal e hortelã'
    ],
    instructions: [
      'Escorra e lave o grão-de-bico',
      'Pique os vegetais em cubos pequenos',
      'Misture tudo',
      'Tempere com limão, azeite, sal e hortelã',
      'Deixe descansar 10min na geladeira'
    ],
    nutrition: {
      calories: 195,
      protein: 10,
      carbs: 28,
      fat: 5,
      fiber: 8
    },
    tips: 'Dura 3 dias na geladeira. Adicione atum para mais proteína ou sirva com pão integral.'
  },
  {
    id: 'escondidinho-frango',
    name: 'Escondidinho de Frango com Mandioca',
    description: 'Comfort food brasileiro mais saudável',
    prepTime: 40,
    servings: 6,
    estimatedCost: 'R$ 18-25',
    difficulty: 'média',
    tags: ['Almoço', 'Conforto', 'Freezer'],
    ingredients: [
      '500g de peito de frango desfiado',
      '800g de mandioca',
      '1 cebola',
      '2 tomates',
      '1 xícara de leite',
      '2 colheres de sopa de requeijão light',
      'Temperos: alho, sal, pimenta, cheiro-verde'
    ],
    instructions: [
      'Cozinhe e desfie o frango (tempere bem)',
      'Refogue cebola e tomate, adicione frango',
      'Cozinhe mandioca e amasse com leite e requeijão',
      'Monte: frango no fundo, purê de mandioca por cima',
      'Asse 20min a 180°C até dourar'
    ],
    nutrition: {
      calories: 285,
      protein: 24,
      carbs: 32,
      fat: 6,
      fiber: 3
    },
    tips: 'Congele em porções individuais. Substitua por batata-doce para menos carboidratos.'
  },
  {
    id: 'cuscuz-ovo',
    name: 'Cuscuz Nordestino com Ovo',
    description: 'Café da manhã regional nutritivo e econômico',
    prepTime: 15,
    servings: 2,
    estimatedCost: 'R$ 3-6',
    difficulty: 'fácil',
    tags: ['Café da Manhã', 'Regional', 'Econômico'],
    ingredients: [
      '1 xícara de flocos de milho para cuscuz',
      '1 xícara de água',
      '2 ovos',
      'Sal a gosto',
      'Manteiga (opcional)'
    ],
    instructions: [
      'Misture flocos de milho com água e sal',
      'Coloque na cuscuzeira e cozinhe 5-8min',
      'Enquanto isso, cozinhe os ovos (cozido ou mexido)',
      'Sirva o cuscuz com ovos e manteiga'
    ],
    nutrition: {
      calories: 275,
      protein: 16,
      carbs: 38,
      fat: 7,
      fiber: 4
    },
    tips: 'Sem cuscuzeira? Use uma peneira sobre água fervente. Adicione queijo coalho para mais proteína.'
  },
  {
    id: 'sopa-lentilha',
    name: 'Sopa de Lentilha com Legumes',
    description: 'Proteína vegetal, ferro e conforto',
    prepTime: 35,
    servings: 6,
    estimatedCost: 'R$ 10-15',
    difficulty: 'fácil',
    tags: ['Vegano', 'Conforto', 'Ferro', 'Inverno'],
    ingredients: [
      '2 xícaras de lentilha',
      '2 cenouras',
      '2 batatas',
      '1 cebola',
      '2 dentes de alho',
      '1 tomate',
      'Sal, cominho e pimenta'
    ],
    instructions: [
      'Refogue cebola e alho',
      'Adicione tomate e lentilha',
      'Adicione 1,5L de água e legumes picados',
      'Cozinhe 25-30min até lentilha amolecer',
      'Tempere e finalize com cheiro-verde'
    ],
    nutrition: {
      calories: 210,
      protein: 14,
      carbs: 36,
      fat: 2,
      fiber: 12
    },
    tips: 'Lentilha não precisa deixar de molho. Rico em ferro (consuma com suco de laranja para melhor absorção).'
  },
  {
    id: 'pudim-chia',
    name: 'Pudim de Chia com Frutas',
    description: 'Sobremesa saudável rica em ômega-3',
    prepTime: 10,
    servings: 2,
    estimatedCost: 'R$ 6-10',
    difficulty: 'fácil',
    tags: ['Sobremesa', 'Café da Manhã', 'Vegetariano', 'Ômega-3'],
    ingredients: [
      '4 colheres de sopa de chia',
      '300ml de leite (ou vegetal)',
      '1 colher de sopa de mel',
      'Frutas: manga, morango ou banana',
      'Canela'
    ],
    instructions: [
      'Misture chia, leite, mel e canela',
      'Deixe descansar 15min (mexa uma vez)',
      'Leve à geladeira por pelo menos 2h (ou overnight)',
      'Sirva com frutas picadas por cima'
    ],
    nutrition: {
      calories: 185,
      protein: 8,
      carbs: 22,
      fat: 7,
      fiber: 10
    },
    tips: 'Prepare à noite para café da manhã. Chia tem ômega-3, fibras e sacia muito. Dura 5 dias na geladeira.'
  },
  {
    id: 'farofa-proteica',
    name: 'Farofa Proteica com Ovos',
    description: 'Acompanhamento brasileiro rico em proteína',
    prepTime: 20,
    servings: 4,
    estimatedCost: 'R$ 8-12',
    difficulty: 'fácil',
    tags: ['Acompanhamento', 'Proteico', 'Regional'],
    ingredients: [
      '1 xícara de farinha de mandioca',
      '3 ovos',
      '1 cebola',
      '100g de bacon ou linguiça (opcional)',
      'Cheiro-verde',
      '1 colher de sopa de manteiga'
    ],
    instructions: [
      'Frite o bacon (se usar) até dourar',
      'Refogue a cebola na gordura',
      'Adicione os ovos e mexa até cozinhar',
      'Adicione farinha de mandioca aos poucos',
      'Finalize com cheiro-verde'
    ],
    nutrition: {
      calories: 245,
      protein: 12,
      carbs: 28,
      fat: 10,
      fiber: 2
    },
    tips: 'Versão mais leve: use apenas ovos e cebola. Adicione cenoura ralada e uvas-passas para versão adocicada.'
  }
]

// Filtros disponíveis
export const RECIPE_FILTERS = {
  tags: [
    'Básico',
    'Econômico',
    'Rápido',
    'Proteico',
    'Vegano',
    'Vegetariano',
    'Sem Glúten',
    'Café da Manhã',
    'Almoço',
    'Jantar',
    'Sobremesa',
    'Pré-Treino',
    'Pós-Treino',
    'Conforto',
    'Verão',
    'Inverno',
    'Regional',
    'Fitness',
    'Ganho de Massa'
  ],
  difficulty: ['fácil', 'média', 'difícil']
}
