import { useApp } from '@/contexts/AppContext'
import { MascotGreeting } from '@/components/mascot'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Droplet,
  Flame,
  Target,
  TrendingDown,
  Apple,
  Dumbbell,
  Clock,
  Sparkles,
  Plus,
  Scale
} from 'lucide-react'
import { calculateIMC, calculateBMR, calculateTDEE, calculateCalorieTarget, calculateMacros, getIMCColor, formatWeight } from '@/lib/health-utils'
import { useNavigate } from 'react-router-dom'

export function Dashboard() {
  const { user, todayWater, todayMeals, todayWorkouts, activeFasting, dailyMessage } = useApp()
  const navigate = useNavigate()

  if (!user) return null

  const imc = calculateIMC(user.currentWeight, user.height)

  // Usar valores pré-calculados se disponíveis, senão calcular
  const bmr = user.bmr ?? calculateBMR(user.currentWeight, user.height, user.age, user.gender)
  const tdee = user.tdee ?? calculateTDEE(bmr, user.activityLevel)
  const calorieTarget = user.targetCalories ?? calculateCalorieTarget(tdee, user.goal, user.medication)
  const macros = user.targetProtein ? {
    calories: user.targetCalories!,
    protein: user.targetProtein,
    carbs: user.targetCarbs!,
    fat: user.targetFat!,
    fiber: user.targetFiber!
  } : calculateMacros(calorieTarget, user.goal, user.currentWeight)

  const totalCaloriesToday = todayMeals.reduce((sum, meal) => sum + meal.totalCalories, 0)
  const caloriesRemaining = calorieTarget - totalCaloriesToday
  const waterProgress = (todayWater.consumed / todayWater.target) * 100

  const weightDiff = user.currentWeight - user.targetWeight
  const weightProgress = Math.abs(weightDiff)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 pb-24 space-y-6">
        {/* Saudação */}
        <MascotGreeting name={user.name} />

        {/* Mensagem motivacional do dia */}
        <Card className="bg-primary text-primary-foreground border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 flex-shrink-0" />
              <p className="text-sm font-medium">{dailyMessage.message}</p>
            </div>
          </CardContent>
        </Card>

        {/* Status rápido */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                IMC
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{imc.value}</div>
              <p className={`text-xs ${getIMCColor(imc.category)}`}>{imc.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Scale className="w-4 h-4 text-primary" />
                Peso Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatWeight(user.currentWeight)}</div>
              <p className="text-xs text-muted-foreground">
                Meta: {formatWeight(user.targetWeight)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Flame className="w-4 h-4 text-secondary" />
                Calorias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCaloriesToday}</div>
              <p className="text-xs text-muted-foreground">
                de {calorieTarget} kcal
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Droplet className="w-4 h-4 text-chart-1" />
                Água
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayWater.glasses}</div>
              <p className="text-xs text-muted-foreground">
                copos de 8
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Água */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-chart-1" />
                  Hidratação
                </CardTitle>
                <CardDescription>
                  {todayWater.consumed}ml de {todayWater.target}ml
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => navigate('/water')}>
                <Plus className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={waterProgress} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">
              {waterProgress >= 100 ? '✅ Meta atingida!' : `Faltam ${todayWater.target - todayWater.consumed}ml`}
            </p>
          </CardContent>
        </Card>

        {/* Nutrição */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="w-5 h-5 text-destructive" />
                  Nutrição Hoje
                </CardTitle>
                <CardDescription>
                  {caloriesRemaining > 0 ? `Você pode consumir mais ${caloriesRemaining} kcal` : 'Meta de calorias atingida!'}
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => navigate('/meals')}>
                <Plus className="w-4 h-4 mr-1" />
                Refeição
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Calorias</span>
                <span className="font-medium">{totalCaloriesToday} / {calorieTarget}</span>
              </div>
              <Progress value={(totalCaloriesToday / calorieTarget) * 100} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Proteína</div>
                <div className="text-lg font-bold text-primary">{macros.protein}g</div>
                <div className="text-xs text-muted-foreground">Meta diária</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Carboidratos</div>
                <div className="text-lg font-bold text-secondary">{macros.carbs}g</div>
                <div className="text-xs text-muted-foreground">Meta diária</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Gordura</div>
                <div className="text-lg font-bold text-chart-2">{macros.fat}g</div>
                <div className="text-xs text-muted-foreground">Meta diária</div>
              </div>
            </div>

            {todayMeals.length === 0 && (
              <div className="text-center py-4 text-muted-foreground text-sm">
                Nenhuma refeição registrada hoje
              </div>
            )}
          </CardContent>
        </Card>

        {/* Jejum Intermitente */}
        {activeFasting && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Jejum em Andamento
              </CardTitle>
              <CardDescription>
                {activeFasting.type.replace('_', ':')} - {activeFasting.targetDuration}h
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => navigate('/fasting')} className="w-full">
                Ver Detalhes
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Treinos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-primary" />
                  Atividade Física
                </CardTitle>
                <CardDescription>
                  {todayWorkouts.length} treino{todayWorkouts.length !== 1 ? 's' : ''} hoje
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => navigate('/workouts')}>
                <Plus className="w-4 h-4 mr-1" />
                Treino
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {todayWorkouts.length > 0 ? (
              <div className="space-y-2">
                {todayWorkouts.map((workout) => (
                  <div key={workout.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium capitalize">{workout.type}</div>
                      <div className="text-sm text-muted-foreground">{workout.duration} min</div>
                    </div>
                    <Badge variant="secondary">{workout.caloriesBurned} kcal</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground text-sm">
                Nenhum treino registrado hoje
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progresso */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-primary" />
              Seu Progresso
            </CardTitle>
            <CardDescription>
              {user.goal === 'perder_peso' && `Meta: perder ${weightProgress.toFixed(1)} kg`}
              {user.goal === 'ganhar_massa' && `Meta: ganhar ${weightProgress.toFixed(1)} kg`}
              {user.goal === 'manter_peso' && 'Meta: manter peso atual'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate('/progress')} className="w-full">
              Ver Histórico Completo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
