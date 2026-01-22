import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Clock, Play, StopCircle, Info, History, TrendingUp } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { FastingSession, FastingLogEntry, FastingFeeling } from '@/types'
import { toast } from 'sonner'

const FASTING_TYPES = [
  {
    type: '16_8' as const,
    name: '16:8 (Iniciante)',
    description: '16h de jejum, 8h de alimentação',
    hours: 16,
    difficulty: 'iniciante',
    benefits: 'Mais popular, fácil de seguir, ideal para começar'
  },
  {
    type: '18_6' as const,
    name: '18:6 (Intermediário)',
    description: '18h de jejum, 6h de alimentação',
    hours: 18,
    difficulty: 'intermediario',
    benefits: 'Aumenta autofagia, melhora queima de gordura'
  },
  {
    type: '20_4' as const,
    name: '20:4 - Dieta do Guerreiro',
    description: '20h de jejum, 4h de alimentação',
    hours: 20,
    difficulty: 'avancado',
    benefits: 'Máxima autofagia, desafiador mas eficaz'
  },
  {
    type: '24h' as const,
    name: '24h - OMAD',
    description: 'Uma refeição por dia (24h)',
    hours: 24,
    difficulty: 'avancado',
    benefits: 'Profunda cetose, máximo benefício metabólico'
  },
  {
    type: 'personalizado' as const,
    name: '12:12 (Suave)',
    description: '12h de jejum, 12h de alimentação',
    hours: 12,
    difficulty: 'iniciante',
    benefits: 'Suave, permite adaptação gradual'
  },
  {
    type: 'personalizado' as const,
    name: '14:10 (Moderado)',
    description: '14h de jejum, 10h de alimentação',
    hours: 14,
    difficulty: 'iniciante',
    benefits: 'Transição perfeita para 16:8'
  }
]

const STORAGE_KEY = 'fasting_history'

const FEELING_OPTIONS: { value: FastingFeeling; label: string; emoji: string; color: string }[] = [
  { value: 'com_muita_energia', label: 'Com muita energia', emoji: '⚡', color: 'text-green-500' },
  { value: 'bem', label: 'Me senti bem', emoji: '😊', color: 'text-blue-500' },
  { value: 'normal', label: 'Normal', emoji: '😐', color: 'text-gray-500' },
  { value: 'cansado', label: 'Cansado', emoji: '😴', color: 'text-yellow-500' },
  { value: 'sem_energia', label: 'Sem energia', emoji: '🥱', color: 'text-orange-500' },
  { value: 'faminto', label: 'Muito faminto', emoji: '😫', color: 'text-red-500' },
  { value: 'sem_fome', label: 'Sem fome', emoji: '🙂', color: 'text-teal-500' }
]

export function Fasting() {
  const { activeFasting, startFasting, endFasting } = useApp()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showLogDialog, setShowLogDialog] = useState(false)
  const [selectedFeeling, setSelectedFeeling] = useState<FastingFeeling>('bem')
  const [notes, setNotes] = useState('')
  const [fastingHistory, setFastingHistory] = useState<FastingLogEntry[]>([])
  const [completedSession, setCompletedSession] = useState<FastingSession | null>(null)

  // Carregar histórico do localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Converter strings de data para objetos Date
        const history = parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        }))
        setFastingHistory(history)
      } catch (e) {
        console.error('Erro ao carregar histórico de jejum:', e)
      }
    }
  }, [])

  // Salvar histórico no localStorage
  const saveFastingHistory = (history: FastingLogEntry[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    setFastingHistory(history)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleStartFasting = (type: FastingSession['type'], hours: number) => {
    const session: FastingSession = {
      id: crypto.randomUUID(),
      startTime: new Date(),
      targetDuration: hours,
      completed: false,
      type
    }
    startFasting(session)
    toast.success('Jejum iniciado!', {
      description: `Jejum de ${hours}h começou agora`
    })
  }

  const handleEndFasting = () => {
    if (activeFasting) {
      setCompletedSession(activeFasting)
      setShowLogDialog(true)
    }
  }

  const handleSaveLog = () => {
    if (!completedSession) return

    const fastingType = FASTING_TYPES.find(f => f.type === completedSession.type)

    const logEntry: FastingLogEntry = {
      id: crypto.randomUUID(),
      date: new Date(),
      protocolType: completedSession.type,
      protocolName: fastingType?.name || completedSession.type,
      hours: completedSession.targetDuration,
      startTime: new Date(completedSession.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      feeling: selectedFeeling,
      notes: notes.trim() || undefined,
      completed: true
    }

    const newHistory = [logEntry, ...fastingHistory]
    saveFastingHistory(newHistory)

    endFasting()
    setShowLogDialog(false)
    setNotes('')
    setSelectedFeeling('bem')
    setCompletedSession(null)

    toast.success('Jejum registrado!', {
      description: 'Seu jejum foi salvo no histórico'
    })
  }

  const getElapsedTime = () => {
    if (!activeFasting) return { hours: 0, minutes: 0, percentage: 0 }

    const start = new Date(activeFasting.startTime).getTime()
    const now = currentTime.getTime()
    const elapsed = (now - start) / 1000 / 60 / 60 // em horas

    const hours = Math.floor(elapsed)
    const minutes = Math.floor((elapsed - hours) * 60)
    const percentage = (elapsed / activeFasting.targetDuration) * 100

    return { hours, minutes, percentage: Math.min(percentage, 100) }
  }

  const getRemainingTime = () => {
    if (!activeFasting) return { hours: 0, minutes: 0 }

    const { hours, minutes } = getElapsedTime()
    const totalElapsedMinutes = hours * 60 + minutes
    const targetMinutes = activeFasting.targetDuration * 60
    const remainingMinutes = Math.max(0, targetMinutes - totalElapsedMinutes)

    return {
      hours: Math.floor(remainingMinutes / 60),
      minutes: remainingMinutes % 60
    }
  }

  const elapsed = getElapsedTime()
  const remaining = getRemainingTime()
  const isComplete = elapsed.percentage >= 100

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 pb-24 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Clock className="w-16 h-16 text-primary mx-auto" />
          <h1 className="text-3xl font-bold">Jejum Intermitente</h1>
          <p className="text-muted-foreground">Acompanhe seu progresso de jejum</p>
        </div>

        {/* Jejum ativo */}
        {activeFasting ? (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Jejum em Andamento</CardTitle>
              <CardDescription>
                Tipo: {activeFasting.type.replace('_', ':')} ({activeFasting.targetDuration}h)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Timer visual */}
              <div className="text-center space-y-4">
                <div className="relative w-48 h-48 mx-auto">
                  {/* Círculo de progresso */}
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={`${2 * Math.PI * 88 * (1 - elapsed.percentage / 100)}`}
                      className="text-primary transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Tempo no centro */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold">
                      {String(elapsed.hours).padStart(2, '0')}:{String(elapsed.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round(elapsed.percentage)}%
                    </div>
                  </div>
                </div>

                {isComplete ? (
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-primary">
                      🎉 Jejum Completo!
                    </div>
                    <p className="text-muted-foreground">
                      Parabéns! Você completou seu jejum.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-xl font-semibold">
                      Faltam {String(remaining.hours).padStart(2, '0')}h{String(remaining.minutes).padStart(2, '0')}min
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Iniciado às {new Date(activeFasting.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}
              </div>

              {/* Progresso */}
              <div className="space-y-2">
                <Progress value={elapsed.percentage} className="h-3" />
                <p className="text-xs text-center text-muted-foreground">
                  {elapsed.hours}h {elapsed.minutes}min de {activeFasting.targetDuration}h
                </p>
              </div>

              {/* Botão finalizar */}
              <Button
                variant="destructive"
                onClick={handleEndFasting}
                className="w-full"
              >
                <StopCircle className="w-4 h-4 mr-2" />
                Finalizar Jejum
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Iniciar jejum */
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Escolha seu tipo de jejum</h2>
            <div className="grid gap-3">
              {FASTING_TYPES.map((fasting) => (
                <Card key={fasting.type} className="cursor-pointer hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{fasting.name}</CardTitle>
                        <CardDescription>{fasting.description}</CardDescription>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleStartFasting(fasting.type, fasting.hours)}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Iniciar
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Informações sobre jejum */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              O que é Jejum Intermitente?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              O jejum intermitente é um padrão alimentar que alterna entre períodos de jejum e alimentação.
            </p>
            <div className="space-y-2">
              <div>
                <p className="font-medium">Benefícios:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Pode ajudar na perda de peso</li>
                  <li>Melhora a sensibilidade à insulina</li>
                  <li>Pode reduzir inflamação</li>
                  <li>Promove autofagia celular</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Dicas:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Mantenha-se hidratado durante o jejum</li>
                  <li>Comece com períodos menores</li>
                  <li>Quebre o jejum com alimentos leves</li>
                  <li>Ouça seu corpo</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aviso médico */}
        <Card className="bg-destructive/10 border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm flex gap-2">
              <span className="text-destructive">⚠️</span>
              <span>
                <strong>Atenção:</strong> O jejum intermitente não é recomendado para todos. Consulte um médico antes de iniciar, especialmente se você tem condições de saúde, está grávida ou amamentando.
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Histórico de jejuns */}
        {fastingHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Histórico de Jejuns
              </CardTitle>
              <CardDescription>
                {fastingHistory.length} jejum{fastingHistory.length !== 1 ? 's' : ''} registrado{fastingHistory.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Estatísticas resumidas */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{fastingHistory.length}</div>
                      <div className="text-xs text-muted-foreground">Total de jejuns</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">
                        {Math.round(fastingHistory.reduce((sum, entry) => sum + entry.hours, 0) / fastingHistory.length)}h
                      </div>
                      <div className="text-xs text-muted-foreground">Média de horas</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Lista de jejuns */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {fastingHistory.slice(0, 10).map((entry) => {
                  const feelingOption = FEELING_OPTIONS.find(f => f.value === entry.feeling)
                  return (
                    <Card key={entry.id} className="hover:bg-muted/50 transition-colors">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{entry.protocolName}</span>
                              <span className="text-xs text-muted-foreground">
                                ({entry.hours}h)
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {entry.date.toLocaleDateString('pt-BR')} • {entry.startTime} - {entry.endTime}
                            </div>
                            {entry.notes && (
                              <p className="text-sm text-muted-foreground mt-1 italic">
                                "{entry.notes}"
                              </p>
                            )}
                          </div>
                          <div className="text-center">
                            <div className={`text-2xl ${feelingOption?.color}`}>
                              {feelingOption?.emoji}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {feelingOption?.label.split(' ')[0]}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {fastingHistory.length > 10 && (
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Mostrando últimos 10 jejuns de {fastingHistory.length}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog de registro de jejum */}
      <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Como você se sentiu?</DialogTitle>
            <DialogDescription>
              Registre como foi sua experiência com o jejum
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Seleção de sensação */}
            <div className="space-y-3">
              <Label>Como você se sentiu durante o jejum?</Label>
              <div className="grid grid-cols-2 gap-2">
                {FEELING_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedFeeling(option.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedFeeling === option.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-center space-y-1">
                      <div className={`text-2xl ${option.color}`}>{option.emoji}</div>
                      <div className="text-xs font-medium">{option.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Observações opcionais */}
            <div className="space-y-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Como foi sua experiência? Teve dificuldades?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowLogDialog(false)
                setNotes('')
                setSelectedFeeling('bem')
                setCompletedSession(null)
                endFasting()
              }}
              className="flex-1"
            >
              Pular
            </Button>
            <Button onClick={handleSaveLog} className="flex-1">
              Salvar Registro
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
