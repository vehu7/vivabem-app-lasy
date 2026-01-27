import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Loader2, Clock, Users, DollarSign } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { toast } from 'sonner'

interface DietRecommendation {
  title: string
  description: string
  meals: {
    type: string
    time: string
    foods: string[]
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  }[]
  totalNutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
  tips: string[]
  shoppingList: string[]
}

export function DietRecommendationDialog() {
  const { user } = useApp()
  const [isGenerating, setIsGenerating] = useState(false)
  const [recommendation, setRecommendation] = useState<DietRecommendation | null>(null)

  const generateDietRecommendation = async () => {
    if (!user) return

    setIsGenerating(true)

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey) {
        throw new Error('Chave da API Gemini não configurada')
      }

      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const prompt = `Como nutricionista especialista, crie um cardápio/dieta personalizada para 1 dia baseado neste perfil:

**Perfil do Paciente:**
- Objetivo: ${user.goal === 'perder_peso' ? 'Perder peso' : user.goal === 'ganhar_massa' ? 'Ganhar massa muscular' : 'Manter peso e saúde'}
- Peso atual: ${user.currentWeight}kg
- Altura: ${user.height}cm
- Idade: ${user.age} anos
- Sexo: ${user.gender}
- Nível de atividade: ${user.activityLevel}
- Medicação: ${user.medication !== 'nenhum' ? user.medication : 'Nenhuma'}
${user.dietaryPreferences?.length > 0 ? `- Restrições: ${user.dietaryPreferences.join(', ')}` : ''}

**Metas Nutricionais Diárias:**
- Calorias: ${user.targetCalories} kcal
- Proteínas: ${user.targetProtein}g
- Carboidratos: ${user.targetCarbs}g
- Gorduras: ${user.targetFat}g
- Fibras: ${user.targetFiber}g

**Instruções Importantes:**
1. Use APENAS alimentos brasileiros comuns e acessíveis
2. Priorize alimentos integrais, naturais e regionais
3. ${user.medication !== 'nenhum' ? 'IMPORTANTE: Com medicação GLP-1, reforçar proteínas e fibras, refeições menores e mais nutritivas' : ''}
4. Respeite as restrições alimentares: ${user.dietaryPreferences?.join(', ') || 'Nenhuma'}
5. Inclua horários aproximados de refeições
6. Mantenha o cardápio prático e econômico

Retorne no formato JSON:
{
  "title": "Cardápio Personalizado - [Objetivo]",
  "description": "Descrição breve do cardápio (1-2 frases)",
  "meals": [
    {
      "type": "Café da Manhã",
      "time": "07:00",
      "foods": ["Alimento 1", "Alimento 2", "Alimento 3"],
      "calories": número,
      "protein": número,
      "carbs": número,
      "fat": número,
      "fiber": número
    }
  ],
  "totalNutrition": {
    "calories": total,
    "protein": total,
    "carbs": total,
    "fat": total,
    "fiber": total
  },
  "tips": [
    "Dica 1",
    "Dica 2",
    "Dica 3"
  ],
  "shoppingList": [
    "Item 1",
    "Item 2"
  ]
}`

      const result = await model.generateContent(prompt)
      const response = result.response.text()

      // Extrair JSON da resposta
      let jsonMatch = response.match(/```json\s*(\{[\s\S]*?\})\s*```/)
      if (!jsonMatch) {
        jsonMatch = response.match(/\{[\s\S]*\}/)
      }

      if (jsonMatch) {
        const jsonText = jsonMatch[1] || jsonMatch[0]
        const data: DietRecommendation = JSON.parse(jsonText)
        setRecommendation(data)
        toast.success('Cardápio personalizado gerado!', {
          description: 'Baseado no seu perfil e metas nutricionais'
        })
      } else {
        throw new Error('Não foi possível gerar o cardápio')
      }
    } catch (error: any) {
      console.error('Erro ao gerar cardápio:', error)
      toast.error('Erro ao gerar cardápio', {
        description: error.message || 'Tente novamente'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Sparkles className="w-4 h-4 mr-2" />
          Cardápio Personalizado
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Seu Cardápio Personalizado
          </DialogTitle>
          <DialogDescription>
            Recomendação baseada no seu perfil, objetivos e preferências
          </DialogDescription>
        </DialogHeader>

        {!recommendation && !isGenerating && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 p-6 overflow-auto">
            <Sparkles className="w-16 h-16 text-primary opacity-50" />
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Gerar Cardápio com IA</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Vamos criar um cardápio completo para 1 dia baseado no seu perfil,
                objetivos e metas nutricionais. Com alimentos brasileiros acessíveis!
              </p>
            </div>

            <Card className="bg-accent max-w-md">
              <CardContent className="pt-4 text-sm space-y-2">
                <p><strong>Objetivo:</strong> {user.goal === 'perder_peso' ? 'Perder peso' : user.goal === 'ganhar_massa' ? 'Ganhar massa' : 'Manter peso'}</p>
                <p><strong>Meta calórica:</strong> {user.targetCalories} kcal/dia</p>
                <p><strong>Proteína:</strong> {user.targetProtein}g | <strong>Fibras:</strong> {user.targetFiber}g</p>
                {user.medication !== 'nenhum' && (
                  <p className="text-xs text-muted-foreground mt-2">
                    ⚠️ Cardápio adaptado para uso de {user.medication}
                  </p>
                )}
              </CardContent>
            </Card>

            <Button onClick={generateDietRecommendation} size="lg" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gerando cardápio...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar Cardápio Agora
                </>
              )}
            </Button>
          </div>
        )}

        {isGenerating && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Gerando seu cardápio personalizado...</p>
          </div>
        )}

        {recommendation && !isGenerating && (
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <ScrollArea className="flex-1 w-full pr-4 min-h-0">
              <div className="space-y-6">
                {/* Header do cardápio */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">{recommendation.title}</h2>
                  <p className="text-muted-foreground mb-4">{recommendation.description}</p>

                  {/* Resumo nutricional */}
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-base">Resumo Nutricional do Dia</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-5 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold">{recommendation.totalNutrition.calories}</div>
                          <div className="text-xs text-muted-foreground">Calorias</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-500">{recommendation.totalNutrition.protein}g</div>
                          <div className="text-xs text-muted-foreground">Proteína</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-orange-500">{recommendation.totalNutrition.carbs}g</div>
                          <div className="text-xs text-muted-foreground">Carboidratos</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-yellow-500">{recommendation.totalNutrition.fat}g</div>
                          <div className="text-xs text-muted-foreground">Gorduras</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-500">{recommendation.totalNutrition.fiber}g</div>
                          <div className="text-xs text-muted-foreground">Fibras</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Refeições */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Refeições do Dia</h3>
                  {recommendation.meals.map((meal, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{meal.type}</CardTitle>
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            {meal.time}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <ul className="space-y-1">
                          {meal.foods.map((food, foodIndex) => (
                            <li key={foodIndex} className="text-sm flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>{food}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-2 text-xs pt-2 border-t">
                          <span className="font-medium">{meal.calories} kcal</span>
                          <span className="text-blue-500">P: {meal.protein}g</span>
                          <span className="text-orange-500">C: {meal.carbs}g</span>
                          <span className="text-yellow-500">G: {meal.fat}g</span>
                          <span className="text-green-500">F: {meal.fiber}g</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Dicas */}
                <Card className="bg-accent">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Dicas do BEM
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {recommendation.tips.map((tip, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-primary">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Lista de compras */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Lista de Compras</CardTitle>
                    <CardDescription>Ingredientes necessários para este cardápio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {recommendation.shoppingList.map((item, index) => (
                        <div key={index} className="text-sm flex items-center gap-2">
                          <span className="text-primary">□</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>

            {/* Botões de ação */}
            <div className="pt-4 border-t space-y-2 flex-shrink-0">
              <Button onClick={generateDietRecommendation} variant="outline" className="w-full" disabled={isGenerating}>
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar Novo Cardápio
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
