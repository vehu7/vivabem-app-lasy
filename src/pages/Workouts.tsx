import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/ui/field'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dumbbell,
  Play,
  Plus,
  Flame,
  Clock,
  Activity,
  CheckCircle2
} from 'lucide-react'
import type { WorkoutSession, WorkoutPlan, WorkoutType } from '@/types'
import { toast } from 'sonner'

const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: '1',
    name: 'Pilates Iniciante',
    type: 'pilates',
    description: 'Fortalecimento do core e melhora da postura',
    duration: 20,
    difficulty: 'iniciante',
    caloriesEstimate: 140,
    exercises: [
      { name: 'Respiração diafragmática', duration: 2, description: 'Deite-se e respire profundamente pelo diafragma' },
      { name: 'The Hundred', duration: 3, description: 'Levante pernas e cabeça, movimente os braços' },
      { name: 'Roll Up', repetitions: 8, description: 'Role a coluna lentamente para cima e para baixo' },
      { name: 'Single Leg Stretch', repetitions: 10, description: 'Alterne as pernas em direção ao peito' },
      { name: 'Spine Stretch', repetitions: 8, description: 'Alongue a coluna sentado' }
    ]
  },
  {
    id: '2',
    name: 'Yoga para Relaxamento',
    type: 'yoga',
    description: 'Práticas suaves para aliviar o estresse',
    duration: 25,
    difficulty: 'iniciante',
    caloriesEstimate: 100,
    exercises: [
      { name: 'Postura da Criança', duration: 3, description: 'Ajoelhe-se e estenda os braços à frente' },
      { name: 'Gato-Vaca', repetitions: 10, description: 'Alterne entre arquear e arredondar as costas' },
      { name: 'Cachorro Olhando para Baixo', duration: 2, description: 'Forma um V invertido com o corpo' },
      { name: 'Guerreiro I', duration: 2, description: 'Posição de estocada com braços para cima' },
      { name: 'Savasana', duration: 5, description: 'Relaxamento final deitado' }
    ]
  },
  {
    id: '3',
    name: 'Caminhada Ativa',
    type: 'caminhada',
    description: 'Caminhada em ritmo moderado',
    duration: 30,
    difficulty: 'iniciante',
    caloriesEstimate: 150,
    exercises: [
      { name: 'Aquecimento leve', duration: 5, description: 'Caminhe em ritmo lento' },
      { name: 'Caminhada moderada', duration: 20, description: 'Aumente o ritmo gradualmente' },
      { name: 'Desaceleração', duration: 5, description: 'Reduza o ritmo aos poucos' }
    ]
  },
  {
    id: '4',
    name: 'Treino em Casa - Corpo Todo',
    type: 'musculacao',
    description: 'Exercícios com peso corporal',
    duration: 30,
    difficulty: 'intermediario',
    caloriesEstimate: 250,
    exercises: [
      { name: 'Agachamento', sets: 3, repetitions: 15, description: 'Mantenha as costas retas' },
      { name: 'Flexão de braço', sets: 3, repetitions: 10, description: 'Pode fazer com joelhos apoiados' },
      { name: 'Prancha', sets: 3, duration: 1, description: 'Mantenha o corpo alinhado' },
      { name: 'Avanço (lunge)', sets: 3, repetitions: 12, description: 'Alterne as pernas' },
      { name: 'Abdominal', sets: 3, repetitions: 15, description: 'Eleve apenas o tronco' }
    ]
  },
  {
    id: '5',
    name: 'Yoga Power',
    type: 'yoga',
    description: 'Yoga dinâmico para fortalecer',
    duration: 40,
    difficulty: 'intermediario',
    caloriesEstimate: 200,
    exercises: [
      { name: 'Saudação ao Sol', repetitions: 5, description: 'Sequência completa de movimentos' },
      { name: 'Guerreiro II', duration: 2, description: 'Braços abertos, olhar para frente' },
      { name: 'Triângulo', duration: 2, description: 'Incline lateralmente mantendo pernas retas' },
      { name: 'Prancha lateral', duration: 1, description: 'Apoie em um braço, corpo alinhado' },
      { name: 'Ponte', repetitions: 10, description: 'Eleve o quadril mantendo ombros no chão' }
    ]
  },
  {
    id: '6',
    name: 'Pilates Avançado',
    type: 'pilates',
    description: 'Movimentos desafiadores para o core',
    duration: 35,
    difficulty: 'avancado',
    caloriesEstimate: 220,
    exercises: [
      { name: 'Teaser', repetitions: 8, description: 'Levante pernas e tronco simultaneamente' },
      { name: 'Swimming', duration: 2, description: 'Alterne braços e pernas opostos no ar' },
      { name: 'Scissors', repetitions: 12, description: 'Tesoura com as pernas elevadas' },
      { name: 'Double Leg Stretch', repetitions: 10, description: 'Estenda braços e pernas juntos' },
      { name: 'Side Kick Series', repetitions: 10, description: 'Chutes laterais deitado de lado' }
    ]
  }
]

export function Workouts() {
  const { todayWorkouts, addWorkout } = useApp()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null)
  const [customDuration, setCustomDuration] = useState('')
  const [customType, setCustomType] = useState<WorkoutType>('caminhada')
  const [customIntensity, setCustomIntensity] = useState<'leve' | 'moderado' | 'intenso'>('moderado')

  const handleStartWorkout = (plan: WorkoutPlan) => {
    const workout: WorkoutSession = {
      id: crypto.randomUUID(),
      date: new Date(),
      type: plan.type,
      duration: plan.duration,
      caloriesBurned: plan.caloriesEstimate,
      intensity: plan.difficulty === 'iniciante' ? 'leve' : plan.difficulty === 'avancado' ? 'intenso' : 'moderado',
      completed: true
    }

    addWorkout(workout)
    setSelectedPlan(null)
    toast.success('Treino registrado!', {
      description: `${plan.name} - ${plan.caloriesEstimate} kcal`
    })
  }

  const handleCustomWorkout = () => {
    if (!customDuration) return

    const duration = parseInt(customDuration)
    const caloriesPerMinute = {
      leve: 3,
      moderado: 5,
      intenso: 8
    }

    const workout: WorkoutSession = {
      id: crypto.randomUUID(),
      date: new Date(),
      type: customType,
      duration,
      caloriesBurned: Math.round(duration * caloriesPerMinute[customIntensity]),
      intensity: customIntensity,
      completed: true
    }

    addWorkout(workout)
    setIsDialogOpen(false)
    setCustomDuration('')
    toast.success('Treino registrado!')
  }

  const totalCaloriesBurned = todayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0)
  const totalDuration = todayWorkouts.reduce((sum, w) => sum + w.duration, 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 pb-24 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Dumbbell className="w-16 h-16 text-primary mx-auto" />
          <h1 className="text-3xl font-bold">Treinos</h1>
          <p className="text-muted-foreground">Exercite-se em casa no seu ritmo</p>
        </div>

        {/* Resumo do dia */}
        <Card className="bg-primary text-primary-foreground border-0">
          <CardContent className="pt-6">
            <div className="flex justify-around">
              <div className="text-center">
                <Flame className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{totalCaloriesBurned}</div>
                <div className="text-sm opacity-90">Calorias</div>
              </div>
              <div className="text-center">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{totalDuration}</div>
                <div className="text-sm opacity-90">Minutos</div>
              </div>
              <div className="text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{todayWorkouts.length}</div>
                <div className="text-sm opacity-90">Treinos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botão adicionar treino personalizado */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Registrar Treino Personalizado
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Treino</DialogTitle>
              <DialogDescription>Registre um treino que você já fez</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Field label="Tipo de treino">
                <Select value={customType} onValueChange={(value: WorkoutType) => setCustomType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="caminhada">Caminhada</SelectItem>
                    <SelectItem value="corrida">Corrida</SelectItem>
                    <SelectItem value="pilates">Pilates</SelectItem>
                    <SelectItem value="yoga">Yoga</SelectItem>
                    <SelectItem value="musculacao">Musculação</SelectItem>
                    <SelectItem value="danca">Dança</SelectItem>
                    <SelectItem value="natacao">Natação</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Duração (minutos)">
                <Input
                  type="number"
                  placeholder="Ex: 30"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                />
              </Field>
              <Field label="Intensidade">
                <Select value={customIntensity} onValueChange={(value: 'leve' | 'moderado' | 'intenso') => setCustomIntensity(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leve">Leve</SelectItem>
                    <SelectItem value="moderado">Moderado</SelectItem>
                    <SelectItem value="intenso">Intenso</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Button onClick={handleCustomWorkout} className="w-full" disabled={!customDuration}>
                Registrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Planos de treino */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Planos de Treino</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {WORKOUT_PLANS.map((plan) => (
              <Card key={plan.id} className="hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        plan.difficulty === 'iniciante' ? 'secondary' :
                        plan.difficulty === 'intermediario' ? 'default' : 'destructive'
                      }
                    >
                      {plan.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {plan.duration} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className="w-4 h-4" />
                      ~{plan.caloriesEstimate} kcal
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="w-4 h-4" />
                      {plan.exercises.length} exercícios
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedPlan(plan)}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Ver Detalhes
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleStartWorkout(plan)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Concluído
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Dialog de detalhes do treino */}
        {selectedPlan && (
          <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>{selectedPlan.name}</DialogTitle>
                <DialogDescription>{selectedPlan.description}</DialogDescription>
              </DialogHeader>
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-4">
                  <div className="flex gap-4 text-sm">
                    <Badge variant="secondary">{selectedPlan.difficulty}</Badge>
                    <Badge variant="outline">{selectedPlan.duration} min</Badge>
                    <Badge variant="outline">~{selectedPlan.caloriesEstimate} kcal</Badge>
                  </div>

                  <div className="space-y-3">
                    {selectedPlan.exercises.map((exercise, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{exercise.name}</div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {exercise.description}
                              </div>
                              <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                                {exercise.duration && <span>{exercise.duration} min</span>}
                                {exercise.repetitions && <span>{exercise.repetitions} repetições</span>}
                                {exercise.sets && <span>{exercise.sets} séries</span>}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </ScrollArea>
              <div className="pt-4 border-t">
                <Button onClick={() => handleStartWorkout(selectedPlan)} className="w-full">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Marcar como Concluído
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Treinos de hoje */}
        {todayWorkouts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Hoje</h2>
            <div className="space-y-3">
              {todayWorkouts.map((workout) => (
                <Card key={workout.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Dumbbell className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium capitalize">{workout.type}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(workout.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{workout.caloriesBurned} kcal</div>
                        <div className="text-sm text-muted-foreground">{workout.duration} min</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
