import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Sparkles, Play, Pause, RotateCcw, Volume2 } from 'lucide-react'
import { toast } from 'sonner'

interface MeditationSession {
  id: string
  title: string
  description: string
  duration: number // em minutos
  category: 'relaxamento' | 'foco' | 'sono' | 'ansiedade' | 'gratidao'
  difficulty: 'iniciante' | 'intermediario' | 'avancado'
  script: string[]
}

const MEDITATIONS: MeditationSession[] = [
  {
    id: '1',
    title: 'Respiração Consciente',
    description: 'Técnica simples para acalmar a mente',
    duration: 5,
    category: 'relaxamento',
    difficulty: 'iniciante',
    script: [
      'Encontre uma posição confortável, sentado ou deitado.',
      'Feche suavemente os olhos e respire naturalmente.',
      'Inspire profundamente pelo nariz, contando até 4.',
      'Segure o ar por 4 segundos.',
      'Expire lentamente pela boca, contando até 6.',
      'Sinta seu corpo relaxando a cada respiração.',
      'Continue respirando nesse ritmo, liberando todas as tensões.',
      'Quando estiver pronto, abra os olhos lentamente.'
    ]
  },
  {
    id: '2',
    title: 'Body Scan',
    description: 'Relaxamento completo do corpo',
    duration: 10,
    category: 'relaxamento',
    difficulty: 'iniciante',
    script: [
      'Deite-se confortavelmente e feche os olhos.',
      'Comece prestando atenção nos seus pés.',
      'Sinta cada dedo, relaxando completamente.',
      'Mova sua atenção para as pernas, relaxando-as.',
      'Sinta o quadril e o abdômen relaxando.',
      'Relaxe o peito e os ombros.',
      'Solte toda tensão dos braços e mãos.',
      'Relaxe o pescoço e o rosto.',
      'Seu corpo inteiro está completamente relaxado.',
      'Respire profundamente e sinta a paz interior.'
    ]
  },
  {
    id: '3',
    title: 'Foco e Concentração',
    description: 'Para aumentar produtividade',
    duration: 7,
    category: 'foco',
    difficulty: 'intermediario',
    script: [
      'Sente-se com a coluna ereta e feche os olhos.',
      'Respire profundamente três vezes.',
      'Imagine uma luz dourada no centro da sua testa.',
      'Esta luz representa sua concentração e clareza mental.',
      'A cada respiração, a luz fica mais brilhante.',
      'Sinta sua mente ficando clara e focada.',
      'Visualize-se completando suas tarefas com facilidade.',
      'Abra os olhos sentindo-se alerta e focado.'
    ]
  },
  {
    id: '4',
    title: 'Sono Tranquilo',
    description: 'Meditação para dormir melhor',
    duration: 15,
    category: 'sono',
    difficulty: 'iniciante',
    script: [
      'Deite-se confortavelmente na cama.',
      'Feche os olhos e respire suavemente.',
      'Imagine uma praia tranquila ao entardecer.',
      'Ouça o som suave das ondas.',
      'Sinta a brisa morna acariciando seu rosto.',
      'Cada onda que vem e vai te deixa mais relaxado.',
      'Seu corpo está pesado e confortável.',
      'Você está seguro e protegido.',
      'Permita-se deslizar gentilmente para o sono.',
      'Boa noite, durma bem.'
    ]
  },
  {
    id: '5',
    title: 'Alívio da Ansiedade',
    description: 'Acalme sua mente inquieta',
    duration: 8,
    category: 'ansiedade',
    difficulty: 'intermediario',
    script: [
      'Sente-se confortavelmente e respire fundo.',
      'Reconheça seus sentimentos sem julgamento.',
      'Imagine suas preocupações como nuvens passando.',
      'Você está observando, não lutando.',
      'Respire e solte cada tensão.',
      'Você está seguro aqui e agora.',
      'O momento presente é tudo que você precisa.',
      'Sinta a calma voltando ao seu corpo.',
      'Você tem controle da sua respiração e da sua paz.'
    ]
  },
  {
    id: '6',
    title: 'Gratidão Diária',
    description: 'Cultive pensamentos positivos',
    duration: 5,
    category: 'gratidao',
    difficulty: 'iniciante',
    script: [
      'Feche os olhos e sorria suavemente.',
      'Pense em três coisas pelas quais você é grato hoje.',
      'Pode ser algo simples: o sol, uma refeição, um sorriso.',
      'Sinta a gratidão preenchendo seu coração.',
      'Agradeça ao seu corpo por te levar até aqui.',
      'Agradeça às pessoas que te apoiam.',
      'Envie esse sentimento de gratidão para o mundo.',
      'Abra os olhos carregando essa luz positiva com você.'
    ]
  }
]

export function Meditation() {
  const [selectedMeditation, setSelectedMeditation] = useState<MeditationSession | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    if (!isPlaying || !selectedMeditation) return

    const stepDuration = (selectedMeditation.duration * 60) / selectedMeditation.script.length
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (currentStep < selectedMeditation.script.length - 1) {
            setCurrentStep(prev => prev + 1)
            return stepDuration
          } else {
            setIsPlaying(false)
            toast.success('Meditação concluída!', {
              description: 'Parabéns por dedicar esse tempo para você!'
            })
            return 0
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPlaying, currentStep, selectedMeditation])

  const startMeditation = (meditation: MeditationSession) => {
    setSelectedMeditation(meditation)
    setCurrentStep(0)
    const stepDuration = (meditation.duration * 60) / meditation.script.length
    setTimeRemaining(stepDuration)
    setIsPlaying(true)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const resetMeditation = () => {
    setCurrentStep(0)
    if (selectedMeditation) {
      const stepDuration = (selectedMeditation.duration * 60) / selectedMeditation.script.length
      setTimeRemaining(stepDuration)
    }
    setIsPlaying(false)
  }

  const closeMeditation = () => {
    setSelectedMeditation(null)
    setIsPlaying(false)
    setCurrentStep(0)
    setTimeRemaining(0)
  }

  const progress = selectedMeditation
    ? ((currentStep + 1) / selectedMeditation.script.length) * 100
    : 0

  const categoryLabels = {
    relaxamento: 'Relaxamento',
    foco: 'Foco',
    sono: 'Sono',
    ansiedade: 'Ansiedade',
    gratidao: 'Gratidão'
  }

  const categoryColors = {
    relaxamento: 'bg-chart-1',
    foco: 'bg-secondary',
    sono: 'bg-chart-3',
    ansiedade: 'bg-chart-2',
    gratidao: 'bg-chart-5'
  }

  if (selectedMeditation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedMeditation.title}</CardTitle>
                <CardDescription>{selectedMeditation.description}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={closeMeditation}>
                Fechar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progresso */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Etapa {currentStep + 1} de {selectedMeditation.script.length}</span>
                <span>{Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Texto da meditação */}
            <div className="min-h-[200px] flex items-center justify-center p-8 bg-muted rounded-lg">
              <p className="text-center text-lg leading-relaxed">
                {selectedMeditation.script[currentStep]}
              </p>
            </div>

            {/* Controles */}
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={resetMeditation}
                disabled={currentStep === 0 && !isPlaying}
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
              <Button
                size="lg"
                onClick={togglePlayPause}
                className="w-24"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-1" />
                )}
              </Button>
            </div>

            {/* Dica */}
            <div className="text-center text-sm text-muted-foreground">
              <Volume2 className="w-4 h-4 inline mr-1" />
              Use fones de ouvido para melhor experiência
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 pb-24 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Sparkles className="w-16 h-16 text-primary mx-auto" />
          <h1 className="text-3xl font-bold">Meditação Guiada</h1>
          <p className="text-muted-foreground">Encontre paz e equilíbrio interior</p>
        </div>

        {/* Benefícios */}
        <Card className="bg-primary text-primary-foreground border-0">
          <CardHeader>
            <CardTitle>Por que meditar?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✓ Reduz estresse e ansiedade</p>
            <p>✓ Melhora qualidade do sono</p>
            <p>✓ Aumenta foco e concentração</p>
            <p>✓ Fortalece o sistema imunológico</p>
            <p>✓ Promove bem-estar emocional</p>
          </CardContent>
        </Card>

        {/* Meditações */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Escolha uma meditação</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {MEDITATIONS.map((meditation) => (
              <Card key={meditation.id} className="hover:border-primary transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{meditation.title}</CardTitle>
                      <CardDescription className="mt-1">{meditation.description}</CardDescription>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${categoryColors[meditation.category]}`} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{categoryLabels[meditation.category]}</Badge>
                    <Badge variant="outline">{meditation.duration} min</Badge>
                    <Badge variant="outline" className="capitalize">{meditation.difficulty}</Badge>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => startMeditation(meditation)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Dicas */}
        <Card>
          <CardHeader>
            <CardTitle>Dicas para Meditar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex gap-2">
              <span>1.</span>
              <p>Escolha um lugar silencioso e confortável</p>
            </div>
            <div className="flex gap-2">
              <span>2.</span>
              <p>Use roupas confortáveis</p>
            </div>
            <div className="flex gap-2">
              <span>3.</span>
              <p>Desligue notificações do celular</p>
            </div>
            <div className="flex gap-2">
              <span>4.</span>
              <p>Não force, deixe os pensamentos fluírem</p>
            </div>
            <div className="flex gap-2">
              <span>5.</span>
              <p>Pratique regularmente, mesmo que por poucos minutos</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
