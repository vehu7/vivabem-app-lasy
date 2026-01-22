// Sistema de respostas inteligentes offline (fallback quando API falha)

interface UserProfile {
  name: string
  goal: string
  targetCalories?: number
  targetProtein?: number
  dietaryPreferences: string[]
  medication?: string
}

export function getFallbackResponse(message: string, user: UserProfile | null): string {
  const lowerMessage = message.toLowerCase()

  // Saudações
  if (lowerMessage.match(/^(oi|olá|ola|hey|ei|bom dia|boa tarde|boa noite)/)) {
    return `Olá${user ? `, ${user.name}` : ''}! 👋 Como posso ajudar você hoje? Posso dar dicas de nutrição, sugerir receitas saudáveis ou te motivar nos treinos!`
  }

  // Receitas
  if (lowerMessage.includes('receita') || lowerMessage.includes('cozinhar') || lowerMessage.includes('preparar')) {
    const isVegetarian = user?.dietaryPreferences.includes('vegetariano')
    const isLowCarb = user?.dietaryPreferences.includes('low_carb')

    if (isVegetarian) {
      return `🥗 Aqui está uma receita vegetariana deliciosa:\n\n**Wrap de Grão de Bico**\n- 1 xícara de grão de bico cozido\n- Alface, tomate, cenoura ralada\n- 1 tortilla integral\n- Tahine para temperar\n\nAmasse o grão de bico, tempere com tahine, adicione os vegetais no wrap e enrole. Rápido, saudável e com ${user?.targetProtein || 30}g de proteína!`
    }

    if (isLowCarb) {
      return `🥩 Receita Low Carb perfeita para você:\n\n**Frango Grelhado com Legumes**\n- 150g de peito de frango\n- Brócolis e abobrinha grelhados\n- Azeite de oliva e ervas\n\nGrelhe o frango, refogue os legumes com alho e azeite. Refeição completa com apenas 5g de carboidratos!`
    }

    return `🍳 Receita saudável para você:\n\n**Omelete de Claras com Vegetais**\n- 3 claras + 1 ovo inteiro\n- Tomate, cebola, espinafre\n- Sal e pimenta\n\nBata os ovos, adicione os vegetais picados, cozinhe em fogo baixo. Rico em proteína e só ${user?.targetCalories ? Math.round(user.targetCalories * 0.15) : 300} calorias!`
  }

  // Motivação
  if (lowerMessage.includes('motivação') || lowerMessage.includes('desistir') || lowerMessage.includes('sem vontade') || lowerMessage.includes('cansad')) {
    const goal = user?.goal === 'perder_peso' ? 'perder peso' : user?.goal === 'ganhar_massa' ? 'ganhar massa' : 'seus objetivos'
    return `💪 ${user?.name || 'Você'}, você é mais forte do que imagina! \n\nLembre-se porque você começou: ${goal} é sua meta, e cada pequeno passo conta. Você não precisa ser perfeito, só precisa ser consistente!\n\nVamos com tudo hoje! 🔥`
  }

  // Treino
  if (lowerMessage.includes('treino') || lowerMessage.includes('exercício') || lowerMessage.includes('malhar')) {
    const isGainMuscle = user?.goal === 'ganhar_massa'

    if (isGainMuscle) {
      return `🏋️ Treino para Ganho de Massa (em casa):\n\n1. **Flexões**: 4x12\n2. **Agachamento**: 4x15\n3. **Prancha**: 3x45seg\n4. **Afundo**: 3x12 cada perna\n\nDescanse 60 segundos entre séries. Foco na execução correta! 💪`
    }

    return `🏃 Treino Cardio + Força:\n\n1. **Pular corda**: 3min\n2. **Burpees**: 3x10\n3. **Mountain Climbers**: 3x20\n4. **Polichinelos**: 3x30\n\nDescanso: 30 segundos entre séries. Bora suar! 🔥`
  }

  // Água
  if (lowerMessage.includes('água') || lowerMessage.includes('hidrat') || lowerMessage.includes('beber')) {
    const waterGoal = user?.targetCalories ? Math.round(user.targetCalories * 0.035) : 2.5
    return `💧 A hidratação é fundamental!\n\nSua meta: **${waterGoal}L por dia**\n\nDicas:\n- Beba 1 copo ao acordar\n- Tenha sempre uma garrafa por perto\n- Antes de cada refeição, beba água\n\nVocê está bebendo água suficiente hoje? Registre no app!`
  }

  // Jejum
  if (lowerMessage.includes('jejum') || lowerMessage.includes('janela')) {
    return `⏰ Sobre Jejum Intermitente:\n\n**Para Iniciantes**: Comece com 12:12 (12h jejum, 12h alimentação)\n\n**Intermediário**: Tente 16:8 (jejum das 20h às 12h do dia seguinte)\n\n**Importante**: Durante o jejum, beba água, chá ou café sem açúcar. Quebre o jejum com refeição leve e nutritiva!\n\nConfigure seu jejum na aba "Jejum" do app! 🕐`
  }

  // Calorias
  if (lowerMessage.includes('caloria') || lowerMessage.includes('comer') || lowerMessage.includes('dieta')) {
    const cals = user?.targetCalories || 2000
    const protein = user?.targetProtein || 120
    return `🍽️ Seu Plano Alimentar:\n\n- **Calorias diárias**: ${cals} kcal\n- **Proteína**: ${protein}g\n- **Refeições**: 4-5 por dia\n\nDica: Divida suas calorias assim:\n- Café: 25%\n- Almoço: 35%\n- Lanche: 15%\n- Jantar: 25%\n\nRegistre suas refeições no app para acompanhar! 📊`
  }

  // Sono
  if (lowerMessage.includes('sono') || lowerMessage.includes('dormir') || lowerMessage.includes('insônia')) {
    return `😴 Dicas para Melhorar o Sono:\n\n1. Durma 7-9h por noite\n2. Evite telas 1h antes de dormir\n3. Quarto escuro e silencioso\n4. Evite cafeína após 16h\n5. Tente meditar antes (aba "Meditar" do app!)\n\nO sono é essencial para recuperação muscular e perda de peso! 💤`
  }

  // Medicação GLP-1
  if (user?.medication && user.medication !== 'nenhum' && (lowerMessage.includes('medicação') || lowerMessage.includes('ozempic') || lowerMessage.includes('saxenda'))) {
    return `💊 Sobre sua medicação ${user.medication}:\n\n**Importante**: Seu plano alimentar já está ajustado para trabalhar junto com a medicação.\n\n- Continue seguindo as orientações médicas\n- Mantenha uma alimentação balanceada\n- Hidrate-se bem\n- Monitore efeitos colaterais\n\n⚠️ Sempre consulte seu médico sobre dúvidas da medicação!`
  }

  // Perda de peso
  if (lowerMessage.includes('emagrec') || lowerMessage.includes('perder peso') || lowerMessage.includes('gordura')) {
    return `📉 Dicas para Perda de Peso Saudável:\n\n1. **Déficit calórico**: ${user?.targetCalories || 1800} kcal/dia\n2. **Proteína alta**: Preserva músculos\n3. **Exercício**: 3-4x por semana\n4. **Sono**: 7-9h por noite\n5. **Consistência**: Mais importante que perfeição!\n\nMeta saudável: 0,5-1kg por semana. Você consegue! 🎯`
  }

  // Ganho de massa
  if (lowerMessage.includes('ganhar massa') || lowerMessage.includes('músculo') || lowerMessage.includes('hipertrofia')) {
    return `💪 Para Ganhar Massa Muscular:\n\n1. **Superávit calórico**: ${user?.targetCalories || 2500} kcal/dia\n2. **Proteína**: ${user?.targetProtein || 150}g por dia\n3. **Treino de força**: 4-5x por semana\n4. **Descanso**: Músculo cresce no descanso!\n5. **Carboidratos**: Energia para treinar pesado\n\nConsistência é tudo! 🏋️`
  }

  // Resposta genérica
  return `Entendi! ${user?.name ? `${user.name}, ` : ''}posso te ajudar com:\n\n🍽️ **Receitas e nutrição**\n💪 **Dicas de treino**\n⏰ **Jejum intermitente**\n💧 **Hidratação**\n😴 **Sono e recuperação**\n📊 **Metas e acompanhamento**\n\nO que você gostaria de saber?`
}
