import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Clock, Play, StopCircle, Info } from 'lucide-react'
import type { FastingSession } from '@/types'
import { toast } from 'sonner'

const FASTING_TYPES = [
  { type: '16_8' as const, name: '16:8', description: '16h de jejum, 8h de alimentação', hours: 16 },
  { type: '18_6' as const, name: '18:6', description: '18h de jejum, 6h de alimentação', hours: 18 },
  { type: '20_4' as const, name: '20:4', description: '20h de jejum, 4h de alimentação', hours: 20 },
  { type: '24h' as const, name: '24h', description: 'Jejum de 24 horas', hours: 24 }
]

export function Fasting() {
  const { activeFasting, startFasting, endFasting } = useApp()
  const [currentTime, setCurrentTime] = useState(new Date())

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
    endFasting()
    toast.success('Jejum finalizado!', {
      description: 'Parabéns por completar seu jejum!'
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
      </div>
    </div>
  )
}
