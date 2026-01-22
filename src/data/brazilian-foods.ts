import type { FoodItem } from '@/types'

export const BRAZILIAN_FOODS: FoodItem[] = [
  // Carboidratos
  { id: '1', name: 'Arroz branco cozido', category: 'carboidrato', portion: '1 xícara (150g)', calories: 205, protein: 4, carbs: 45, fat: 0.4, fiber: 0.6, isBrazilian: true, isHealthy: false },
  { id: '2', name: 'Arroz integral cozido', category: 'carboidrato', portion: '1 xícara (150g)', calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, isBrazilian: true, isHealthy: true },
  { id: '7', name: 'Pão francês', category: 'carboidrato', portion: '1 unidade (50g)', calories: 135, protein: 4, carbs: 28, fat: 1, fiber: 1.5, isBrazilian: true, isHealthy: false },
  { id: '8', name: 'Tapioca', category: 'carboidrato', portion: '1 unidade (70g)', calories: 140, protein: 0.2, carbs: 35, fat: 0.1, fiber: 0.5, isBrazilian: true, isHealthy: true },
  { id: '4', name: 'Batata doce cozida', category: 'carboidrato', portion: '1 média (130g)', calories: 112, protein: 2, carbs: 26, fat: 0.1, fiber: 3.9, isBrazilian: true, isHealthy: true },
  { id: '13', name: 'Macarrão integral cozido', category: 'carboidrato', portion: '1 xícara (140g)', calories: 174, protein: 7, carbs: 37, fat: 0.8, fiber: 6.3, isBrazilian: false, isHealthy: true },
  { id: '101', name: 'Mandioca cozida', category: 'carboidrato', portion: '1 xícara (136g)', calories: 176, protein: 1.4, carbs: 42, fat: 0.3, fiber: 1.9, isBrazilian: true, isHealthy: true },
  { id: '102', name: 'Inhame cozido', category: 'carboidrato', portion: '1 xícara (136g)', calories: 158, protein: 2, carbs: 37, fat: 0.2, fiber: 5.3, isBrazilian: true, isHealthy: true },
  { id: '103', name: 'Polenta', category: 'carboidrato', portion: '1 fatia (100g)', calories: 70, protein: 1.5, carbs: 15, fat: 0.5, fiber: 1, isBrazilian: true, isHealthy: true },

  // Proteínas
  { id: '3', name: 'Frango grelhado', category: 'proteina', portion: '100g', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, isBrazilian: false, isHealthy: true },
  { id: '12', name: 'Carne bovina (patinho)', category: 'proteina', portion: '100g', calories: 164, protein: 28, carbs: 0, fat: 5, fiber: 0, isBrazilian: false, isHealthy: true },
  { id: '5', name: 'Ovo cozido', category: 'proteina', portion: '1 unidade (50g)', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, fiber: 0, isBrazilian: false, isHealthy: true },
  { id: '2', name: 'Feijão preto cozido', category: 'proteina', portion: '1 concha (86g)', calories: 120, protein: 8, carbs: 20, fat: 0.5, fiber: 7.5, isBrazilian: true, isHealthy: true },
  { id: '9', name: 'Queijo minas frescal', category: 'proteina', portion: '1 fatia (30g)', calories: 70, protein: 5, carbs: 1, fat: 5, fiber: 0, isBrazilian: true, isHealthy: true },
  { id: '104', name: 'Tilápia grelhada', category: 'proteina', portion: '100g', calories: 96, protein: 20, carbs: 0, fat: 1.7, fiber: 0, isBrazilian: false, isHealthy: true },
  { id: '105', name: 'Atum em lata (água)', category: 'proteina', portion: '100g', calories: 116, protein: 26, carbs: 0, fat: 1, fiber: 0, isBrazilian: false, isHealthy: true },
  { id: '106', name: 'Peito de peru fatiado', category: 'proteina', portion: '3 fatias (45g)', calories: 55, protein: 10, carbs: 1, fat: 1, fiber: 0, isBrazilian: false, isHealthy: true },
  { id: '107', name: 'Sardinha em lata', category: 'proteina', portion: '100g', calories: 208, protein: 25, carbs: 0, fat: 11, fiber: 0, isBrazilian: false, isHealthy: true },

  // Frutas
  { id: '6', name: 'Banana', category: 'fruta', portion: '1 média (120g)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, isBrazilian: true, isHealthy: true },
  { id: '10', name: 'Mamão papaia', category: 'fruta', portion: '1 fatia (150g)', calories: 60, protein: 0.9, carbs: 15, fat: 0.2, fiber: 2.5, isBrazilian: true, isHealthy: true },
  { id: '11', name: 'Açaí puro', category: 'fruta', portion: '100g', calories: 58, protein: 3, carbs: 6, fat: 3.5, fiber: 2.6, isBrazilian: true, isHealthy: true },
  { id: '108', name: 'Maçã', category: 'fruta', portion: '1 média (180g)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, isBrazilian: false, isHealthy: true },
  { id: '109', name: 'Laranja', category: 'fruta', portion: '1 média (130g)', calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1, isBrazilian: true, isHealthy: true },
  { id: '110', name: 'Manga', category: 'fruta', portion: '1 média (200g)', calories: 120, protein: 1.6, carbs: 30, fat: 0.8, fiber: 3.2, isBrazilian: true, isHealthy: true },
  { id: '111', name: 'Abacaxi', category: 'fruta', portion: '1 fatia (165g)', calories: 82, protein: 0.9, carbs: 22, fat: 0.2, fiber: 2.3, isBrazilian: true, isHealthy: true },
  { id: '112', name: 'Melancia', category: 'fruta', portion: '1 fatia (280g)', calories: 84, protein: 1.7, carbs: 21, fat: 0.4, fiber: 1.1, isBrazilian: false, isHealthy: true },
  { id: '113', name: 'Morango', category: 'fruta', portion: '1 xícara (150g)', calories: 48, protein: 1, carbs: 12, fat: 0.5, fiber: 3, isBrazilian: false, isHealthy: true },

  // Vegetais
  { id: '14', name: 'Salada verde', category: 'vegetal', portion: '1 prato', calories: 25, protein: 2, carbs: 5, fat: 0.3, fiber: 2, isBrazilian: false, isHealthy: true },
  { id: '114', name: 'Brócolis cozido', category: 'vegetal', portion: '1 xícara (150g)', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.1, isBrazilian: false, isHealthy: true },
  { id: '115', name: 'Tomate', category: 'vegetal', portion: '1 médio (120g)', calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, fiber: 1.4, isBrazilian: false, isHealthy: true },
  { id: '116', name: 'Cenoura crua', category: 'vegetal', portion: '1 média (60g)', calories: 25, protein: 0.6, carbs: 6, fat: 0.1, fiber: 1.7, isBrazilian: false, isHealthy: true },
  { id: '117', name: 'Couve refogada', category: 'vegetal', portion: '1 xícara (100g)', calories: 45, protein: 3, carbs: 8, fat: 0.5, fiber: 2.5, isBrazilian: true, isHealthy: true },
  { id: '118', name: 'Abobrinha', category: 'vegetal', portion: '1 xícara (120g)', calories: 20, protein: 1.5, carbs: 4, fat: 0.4, fiber: 1.2, isBrazilian: false, isHealthy: true },

  // Gorduras saudáveis
  { id: '15', name: 'Abacate', category: 'gordura', portion: '1/4 unidade (50g)', calories: 80, protein: 1, carbs: 4, fat: 7.5, fiber: 3.4, isBrazilian: true, isHealthy: true },
  { id: '119', name: 'Castanha do Pará', category: 'gordura', portion: '1 unidade (5g)', calories: 33, protein: 0.7, carbs: 0.6, fat: 3.3, fiber: 0.4, isBrazilian: true, isHealthy: true },
  { id: '120', name: 'Amendoim', category: 'gordura', portion: '1 colher sopa (15g)', calories: 84, protein: 3.6, carbs: 2.4, fat: 7.2, fiber: 1.2, isBrazilian: true, isHealthy: true },
  { id: '121', name: 'Azeite de oliva', category: 'gordura', portion: '1 colher sopa (13g)', calories: 119, protein: 0, carbs: 0, fat: 13.5, fiber: 0, isBrazilian: false, isHealthy: true },

  // Bebidas
  { id: '122', name: 'Leite desnatado', category: 'bebida', portion: '1 copo (240ml)', calories: 83, protein: 8.3, carbs: 12, fat: 0.2, fiber: 0, isBrazilian: false, isHealthy: true },
  { id: '123', name: 'Suco de laranja natural', category: 'bebida', portion: '1 copo (240ml)', calories: 112, protein: 1.7, carbs: 26, fat: 0.5, fiber: 0.5, isBrazilian: true, isHealthy: true },
  { id: '124', name: 'Água de coco', category: 'bebida', portion: '1 copo (240ml)', calories: 46, protein: 1.7, carbs: 9, fat: 0.5, fiber: 2.6, isBrazilian: true, isHealthy: true },
  { id: '125', name: 'Café sem açúcar', category: 'bebida', portion: '1 xícara (240ml)', calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, isBrazilian: true, isHealthy: true }
]
