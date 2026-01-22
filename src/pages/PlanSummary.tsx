import { useApp } from '@/contexts/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mascot } from '@/components/mascot'
import {
  Target,
  Flame,
  Droplet,
  Activity,
  Apple,
  Clock,
  TrendingUp,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'
import { calculateIMC, getIMCColor, formatWeight, getMedicationInfo } from '@/lib/health-utils'
import { useNavigate } from 'react-router-dom'

export function PlanSummary() {
  const { user } = useApp()
  const navigate = useNavigate()

  if (!user) {
    navigate('/')
    return null
  }

  const imc = calculateIMC(user.currentWeight, user.height)
  const weightDiff = Math.abs(user.currentWeight - user.targetWeight)
  const medicationInfo = getMedicationInfo(user.medication)

  const dietaryLabels = {
    nenhuma: 'Sem restrições',
    vegetariano: 'Vegetariano',
    vegano: 'Vegano',
    sem_lactose: 'Sem lactose',
    sem_gluten: 'Sem glúten',
    low_carb: 'Low carb',
    diabetes: 'Diabetes'
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 pb-24 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <Mascot size="lg" mood="celebrating" showMessage message="Seu plano está pronto! Vamos começar essa jornada juntos!" />
          <div>
            <h1 className="text-3xl font-bold">Seu Plano Personalizado</h1>
            <p className="text-muted-foreground mt-2">
              Baseado em ciência e adaptado para você
            </p>
          </div>
        </div>

        {/* Card principal do plano */}
        <Card className="border-primary">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-2xl">Olá, {user.name}! 👋</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Aqui está seu plano de saúde personalizado
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Estatísticas atuais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">IMC Atual</div>
                <div className={`text-3xl font-bold ${getIMCColor(imc.category)}`}>
                  {imc.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{imc.description}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Peso Atual</div>
                <div className="text-3xl font-bold">{formatWeight(user.currentWeight)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Meta: {formatWeight(user.targetWeight)}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Diferença</div>
                <div className="text-3xl font-bold text-primary">{weightDiff.toFixed(1)} kg</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {user.goal === 'perder_peso' ? 'A perder' : user.goal === 'ganhar_massa' ? 'A ganhar' : 'A manter'}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Idade</div>
                <div className="text-3xl font-bold">{user.age}</div>
                <div className="text-xs text-muted-foreground mt-1">anos</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metas Nutricionais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-secondary" />
              Metas Nutricionais Diárias
            </CardTitle>
            <CardDescription>Calorias e macronutrientes personalizados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Calorias */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Calorias</span>
                <span className="text-2xl font-bold text-primary">{user.targetCalories} kcal</span>
              </div>
              <div className="text-xs text-muted-foreground">
                TMB: {user.bmr?.toFixed(0)} kcal • TDEE: {user.tdee?.toFixed(0)} kcal
              </div>
            </div>

            {/* Macros */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Proteínas</div>
                <div className="text-2xl font-bold text-primary">{user.targetProtein}g</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {((user.targetProtein! * 4) / user.targetCalories! * 100).toFixed(0)}%
                </div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Carboidratos</div>
                <div className="text-2xl font-bold text-secondary">{user.targetCarbs}g</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {((user.targetCarbs! * 4) / user.targetCalories! * 100).toFixed(0)}%
                </div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Gorduras</div>
                <div className="text-2xl font-bold text-chart-2">{user.targetFat}g</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {((user.targetFat! * 9) / user.targetCalories! * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Fibras e Água */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Apple className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Fibras</div>
                  <div className="text-xl font-bold">{user.targetFiber}g</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Droplet className="w-8 h-8 text-chart-1" />
                <div>
                  <div className="text-xs text-muted-foreground">Água</div>
                  <div className="text-xl font-bold">{user.targetWater}ml</div>
                </div>
              </div>
            </div>

            {user.medication !== 'nenhum' && (
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-medium text-primary">Ajustes para {medicationInfo.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {medicationInfo.description}. Fibras aumentadas para 50% acima do padrão.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rotina */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Sua Rotina
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Refeições por dia</div>
                <div className="font-medium">{user.mealRoutine.mealsPerDay} refeições</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">Horas de sono</div>
                <div className="font-medium">{user.averageSleepHours}h por noite</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Horários principais</div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline">Café: {user.mealRoutine.breakfastTime}</Badge>
                <Badge variant="outline">Almoço: {user.mealRoutine.lunchTime}</Badge>
                <Badge variant="outline">Jantar: {user.mealRoutine.dinnerTime}</Badge>
              </div>
            </div>
            {user.dietaryPreferences.length > 0 && user.dietaryPreferences[0] !== 'nenhuma' && (
              <div>
                <div className="text-sm text-muted-foreground mb-2">Preferências alimentares</div>
                <div className="flex gap-2 flex-wrap">
                  {user.dietaryPreferences.map((pref) => (
                    <Badge key={pref} variant="secondary">
                      {dietaryLabels[pref]}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Atividade Física */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Atividade Física
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <div className="font-medium">Nível de atividade</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {user.activityLevel.replace('_', ' ')}
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            {user.interestedInFasting && (
              <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                <div>
                  <div className="font-medium text-primary">Jejum Intermitente</div>
                  <div className="text-sm text-muted-foreground">
                    Experiência: {user.fastingExperience}
                  </div>
                </div>
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Próximos passos */}
        <Card className="bg-primary text-primary-foreground border-0">
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Vamos começar sua jornada de saúde!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <span className="font-bold">1</span>
              </div>
              <div className="text-sm">Registre sua primeira refeição do dia</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <span className="font-bold">2</span>
              </div>
              <div className="text-sm">Comece a rastrear sua hidratação</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <span className="font-bold">3</span>
              </div>
              <div className="text-sm">Escolha um treino em casa para hoje</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <span className="font-bold">4</span>
              </div>
              <div className="text-sm">Registre seu peso regularmente</div>
            </div>
          </CardContent>
        </Card>

        {/* Botão de ação */}
        <Button size="lg" className="w-full" onClick={() => navigate('/')}>
          Ir para o Dashboard
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>

        <div className="text-center text-sm text-muted-foreground pb-8">
          <p>Lembre-se: consistência é mais importante que perfeição!</p>
          <p className="mt-1">Estamos aqui para te apoiar em cada passo. 💚</p>
        </div>
      </div>
    </div>
  )
}
