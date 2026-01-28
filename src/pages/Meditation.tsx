import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Sparkles, Play, Pause, RotateCcw, Volume2, Music, Mic, Volume1 } from 'lucide-react'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

interface MeditationSession {
  id: string
  title: string
  description: string
  duration: number // em minutos
  category: 'relaxamento' | 'foco' | 'sono' | 'ansiedade' | 'gratidao' | 'mindfulness' | 'energia'
  difficulty: 'iniciante' | 'intermediario' | 'avancado'
  script: string[]
  backgroundMusic?: 'natureza' | 'instrumental' | 'silencio'
}

type AudioType = 'guiada' | 'musica-voz' | 'musica' | 'natureza'

const MEDITATIONS: MeditationSession[] = [
  // Iniciante - 5 minutos
  {
    id: '1',
    title: 'Respiração Consciente',
    description: 'Técnica simples para acalmar a mente',
    duration: 5,
    category: 'relaxamento',
    difficulty: 'iniciante',
    backgroundMusic: 'natureza',
    script: [
      'Bem-vindo à sua meditação. Encontre uma posição confortável.',
      'Feche suavemente os olhos e respire naturalmente.',
      'Inspire profundamente pelo nariz, contando até quatro.',
      'Um, dois, três, quatro.',
      'Segure o ar por quatro segundos.',
      'Um, dois, três, quatro.',
      'Expire lentamente pela boca, contando até seis.',
      'Um, dois, três, quatro, cinco, seis.',
      'Sinta seu corpo relaxando a cada respiração.',
      'Continue respirando nesse ritmo, liberando todas as tensões.',
      'Quando estiver pronto, abra os olhos lentamente.'
    ]
  },
  {
    id: '2',
    title: 'Gratidão Matinal',
    description: 'Comece o dia com energia positiva',
    duration: 5,
    category: 'gratidao',
    difficulty: 'iniciante',
    backgroundMusic: 'instrumental',
    script: [
      'Bom dia. Feche os olhos e sorria suavemente.',
      'Pense em três coisas pelas quais você é grato hoje.',
      'Pode ser algo simples: o sol, uma refeição, um sorriso.',
      'Sinta a gratidão preenchendo seu coração.',
      'Agradeça ao seu corpo por te levar até aqui.',
      'Agradeça às pessoas que te apoiam.',
      'Envie esse sentimento de gratidão para o mundo.',
      'Respire profundamente essa energia positiva.',
      'Abra os olhos carregando essa luz com você.'
    ]
  },
  {
    id: '3',
    title: 'Pausa para Relaxar',
    description: 'Alivie tensões rapidamente',
    duration: 5,
    category: 'relaxamento',
    difficulty: 'iniciante',
    backgroundMusic: 'natureza',
    script: [
      'Faça uma pausa agora. Respire fundo.',
      'Solte os ombros, relaxe a mandíbula.',
      'Sinta onde há tensão em seu corpo.',
      'A cada respiração, solte essa tensão.',
      'Você está fazendo o seu melhor.',
      'E isso é suficiente.',
      'Respire paz, expire preocupação.',
      'Sinta-se mais leve a cada segundo.',
      'Quando voltar, você estará renovado.'
    ]
  },

  // Iniciante - 10 minutos
  {
    id: '4',
    title: 'Body Scan Completo',
    description: 'Relaxamento de corpo inteiro',
    duration: 10,
    category: 'relaxamento',
    difficulty: 'iniciante',
    backgroundMusic: 'natureza',
    script: [
      'Deite-se confortavelmente e feche os olhos.',
      'Vamos fazer uma viagem pelo seu corpo.',
      'Comece prestando atenção nos seus pés.',
      'Sinta cada dedo, relaxando completamente.',
      'Mova sua atenção para as pernas, deixe-as pesadas.',
      'Sinta o quadril e o abdômen relaxando profundamente.',
      'Relaxe o peito, sinta a respiração fluindo naturalmente.',
      'Solte toda tensão dos ombros.',
      'Relaxe os braços e mãos completamente.',
      'Solte o pescoço e a mandíbula.',
      'Relaxe a testa e os olhos.',
      'Seu corpo inteiro está completamente relaxado.',
      'Respire profundamente e sinta a paz interior.',
      'Permaneça assim por alguns momentos.',
      'Quando estiver pronto, volte movimentando-se suavemente.'
    ]
  },
  {
    id: '5',
    title: 'Sono Tranquilo',
    description: 'Prepare-se para dormir profundamente',
    duration: 10,
    category: 'sono',
    difficulty: 'iniciante',
    backgroundMusic: 'natureza',
    script: [
      'É hora de descansar. Deite-se confortavelmente.',
      'Feche os olhos e respire suavemente.',
      'Imagine uma praia tranquila ao entardecer.',
      'Ouça o som suave das ondas.',
      'Sinta a brisa morna acariciando seu rosto.',
      'Cada onda que vem e vai te deixa mais relaxado.',
      'Seu corpo está pesado e confortável na cama.',
      'Você está seguro e protegido.',
      'Deixe seus pensamentos flutuarem como nuvens.',
      'Não precisa segurá-los, deixe-os ir.',
      'Seu corpo afunda suavemente no colchão.',
      'Cada respiração te leva mais fundo no relaxamento.',
      'Permita-se deslizar gentilmente para o sono.',
      'Boa noite, durma bem.'
    ]
  },

  // Intermediário - 15 minutos
  {
    id: '6',
    title: 'Foco e Produtividade',
    description: 'Prepare sua mente para o trabalho',
    duration: 15,
    category: 'foco',
    difficulty: 'intermediario',
    backgroundMusic: 'instrumental',
    script: [
      'Sente-se com a coluna ereta, pés no chão.',
      'Feche os olhos e respire profundamente três vezes.',
      'Sinta-se presente, aqui e agora.',
      'Imagine uma luz dourada no centro da sua testa.',
      'Esta luz representa sua concentração e clareza mental.',
      'A cada respiração, a luz fica mais brilhante.',
      'Sinta sua mente ficando clara e focada.',
      'Pensamentos dispersos se dissipam como névoa.',
      'Você está no controle da sua atenção.',
      'Visualize-se completando suas tarefas com facilidade.',
      'Veja-se trabalhando com fluidez e eficiência.',
      'Sinta a satisfação de cada conquista.',
      'Essa clareza mental está disponível a qualquer momento.',
      'Respire profundamente essa sensação de foco.',
      'Quando abrir os olhos, mantenha essa clareza.',
      'Três, dois, um. Abra os olhos sentindo-se alerta e focado.'
    ]
  },
  {
    id: '7',
    title: 'Alívio da Ansiedade',
    description: 'Acalme pensamentos acelerados',
    duration: 15,
    category: 'ansiedade',
    difficulty: 'intermediario',
    backgroundMusic: 'natureza',
    script: [
      'Sente-se confortavelmente e respire fundo.',
      'Reconheça como você está se sentindo, sem julgamento.',
      'É normal sentir ansiedade às vezes.',
      'Você está seguro aqui e agora.',
      'Imagine suas preocupações como nuvens no céu.',
      'Você está observando-as passar.',
      'Não está lutando contra elas, apenas observando.',
      'A cada respiração, as nuvens se movem.',
      'Algumas são escuras, outras mais leves.',
      'Mas todas passam, eventualmente.',
      'Você é o céu, não as nuvens.',
      'Amplo, calmo, sempre presente.',
      'Respire e solte cada tensão do corpo.',
      'O momento presente é tudo que você precisa.',
      'Aqui, agora, você está bem.',
      'Sinta a calma voltando ao seu corpo.',
      'Você tem controle da sua respiração.',
      'E através dela, encontra sua paz.'
    ]
  },
  {
    id: '8',
    title: 'Mindfulness no Presente',
    description: 'Cultive presença e consciência',
    duration: 15,
    category: 'mindfulness',
    difficulty: 'intermediario',
    backgroundMusic: 'silencio',
    script: [
      'Sente-se confortavelmente e feche os olhos.',
      'Traga sua atenção para o momento presente.',
      'Note os sons ao seu redor, sem julgá-los.',
      'Sinta o contato do seu corpo com a superfície.',
      'Perceba a temperatura do ar na sua pele.',
      'Observe sua respiração, natural e espontânea.',
      'Pensamentos virão, e tudo bem.',
      'Apenas note-os e volte para a respiração.',
      'Você está praticando estar presente.',
      'Este momento é único, nunca se repetirá.',
      'Aprecie a simplicidade de apenas ser.',
      'Não há nada a fazer, apenas estar.',
      'Permaneça nessa consciência tranquila.',
      'Quando pensamentos surgirem, volte gentilmente.',
      'A respiração é sua âncora.',
      'Continue assim por mais alguns momentos.',
      'Quando estiver pronto, abra os olhos lentamente.'
    ]
  },

  // Intermediário - 20 minutos
  {
    id: '9',
    title: 'Cura Interior Profunda',
    description: 'Liberação emocional e renovação',
    duration: 20,
    category: 'relaxamento',
    difficulty: 'intermediario',
    backgroundMusic: 'instrumental',
    script: [
      'Encontre uma posição confortável e feche os olhos.',
      'Respire profundamente, enchendo seus pulmões.',
      'Expire lentamente, liberando todas as tensões.',
      'Imagine uma luz dourada acima da sua cabeça.',
      'Esta luz é cura, amor e renovação.',
      'Ela desce suavemente, envolvendo todo o seu corpo.',
      'Sinta o calor dessa luz em cada célula.',
      'Onde há dor, ela traz alívio.',
      'Onde há tristeza, ela traz conforto.',
      'Você merece essa cura, essa paz.',
      'Perdoe-se por qualquer autocrítica.',
      'Você está fazendo o melhor que pode.',
      'Deixe a luz dissolver qualquer peso emocional.',
      'Sinta-se mais leve, mais livre.',
      'Visualize-se saudável, feliz e em paz.',
      'Esta é a sua essência verdadeira.',
      'Respire profundamente essa sensação.',
      'Permaneça neste estado de cura.',
      'Quando estiver pronto, volte gentilmente.',
      'Traga essa luz de cura com você.'
    ]
  },
  {
    id: '10',
    title: 'Energia Vital',
    description: 'Renove sua energia e disposição',
    duration: 20,
    category: 'energia',
    difficulty: 'intermediario',
    backgroundMusic: 'instrumental',
    script: [
      'Sente-se com a coluna ereta e ombros relaxados.',
      'Feche os olhos e respire fundo três vezes.',
      'Imagine raízes saindo dos seus pés para a terra.',
      'Você está conectado, forte, estável.',
      'Agora imagine energia dourada vindo da terra.',
      'Ela sobe pelas suas pernas, trazendo vitalidade.',
      'Sobe pelo seu tronco, energizando cada órgão.',
      'Alcança seu coração, enchendo-o de vigor.',
      'Sobe até o topo da sua cabeça.',
      'Você está cheio de energia vital e luz.',
      'Sinta-se revigorado, renovado.',
      'A cada respiração, mais energia flui.',
      'Você está conectado à fonte inesgotável de vida.',
      'Movimente suavemente os dedos, sentindo a energia.',
      'Movimente o pescoço, despertando o corpo.',
      'Quando abrir os olhos, você estará energizado.',
      'Pronto para abraçar o dia com entusiasmo.',
      'Três, dois, um. Abra os olhos!'
    ]
  },

  // Avançado - 25-30 minutos
  {
    id: '11',
    title: 'Vipassana Profunda',
    description: 'Meditação de observação e insight',
    duration: 25,
    category: 'mindfulness',
    difficulty: 'avancado',
    backgroundMusic: 'silencio',
    script: [
      'Sente-se em uma postura confortável mas alerta.',
      'Feche os olhos e mantenha a coluna ereta.',
      'Comece observando sua respiração natural.',
      'Não force, apenas observe o fluxo natural.',
      'Note a entrada do ar pelas narinas.',
      'Sinta a expansão do abdômen.',
      'Observe a pausa entre inspiração e expiração.',
      'Sinta o ar saindo do corpo.',
      'Continue observando sem modificar.',
      'Quando a mente vagar, note para onde foi.',
      'Sem julgamento, volte para a respiração.',
      'Agora expanda sua atenção para as sensações do corpo.',
      'Observe qualquer tensão, conforto, formigamento.',
      'Note como tudo é impermanente, mudando constantemente.',
      'Observe pensamentos surgindo e dissolvendo.',
      'Você não é seus pensamentos, você é o observador.',
      'Emoções podem surgir, apenas observe.',
      'Deixe tudo fluir naturalmente.',
      'Continue nessa observação pura.',
      'Sem apego, sem aversão, apenas presença.',
      'Permaneça nesse estado de consciência plena.',
      'A cada momento é uma nova oportunidade de estar presente.',
      'Continue observando com curiosidade gentil.',
      'Quando estiver pronto, lentamente volte.',
      'Abra os olhos mantendo essa consciência desperta.'
    ]
  },
  {
    id: '12',
    title: 'Meditação Transcendental',
    description: 'Alcance estados profundos de consciência',
    duration: 30,
    category: 'mindfulness',
    difficulty: 'avancado',
    backgroundMusic: 'silencio',
    script: [
      'Encontre uma posição confortável onde possa permanecer imóvel.',
      'Feche os olhos e respire profundamente.',
      'Deixe seu corpo relaxar completamente.',
      'Sua mente está calma como um lago sem ondas.',
      'Escolha um mantra mental, como "paz" ou "om".',
      'Repita-o mentalmente, suavemente.',
      'Sem esforço, apenas deixe-o fluir.',
      'Se pensamentos surgirem, volte gentilmente ao mantra.',
      'Sinta-se mergulhando em camadas mais profundas.',
      'Você está indo além da mente superficial.',
      'Entrando em estados de consciência mais sutis.',
      'Há paz aqui, silêncio profundo.',
      'Você é consciência pura, sem forma.',
      'Continue repetindo o mantra suavemente.',
      'Permita-se dissolver nas profundezas do ser.',
      'Não há esforço, apenas ser.',
      'Você está conectado a algo maior.',
      'À fonte de toda existência.',
      'Permaneça nesse estado de união.',
      'Silencioso, vasto, infinito.',
      'Continue assim pelos próximos minutos.',
      'Apenas sendo, pura consciência.',
      'Quando sentir o chamado para voltar.',
      'Retorne lentamente, trazendo essa paz.',
      'Movimente-se gentilmente.',
      'Abra os olhos quando estiver pronto.',
      'Você está renovado, transformado.'
    ]
  },
  {
    id: '13',
    title: 'Amor Incondicional',
    description: 'Cultive compaixão por si e pelos outros',
    duration: 25,
    category: 'gratidao',
    difficulty: 'avancado',
    backgroundMusic: 'instrumental',
    script: [
      'Sente-se confortavelmente e feche os olhos.',
      'Coloque uma mão no seu coração.',
      'Respire profundamente, sentindo o coração.',
      'Comece enviando amor para si mesmo.',
      'Que eu seja feliz. Que eu seja saudável.',
      'Que eu viva com facilidade e paz.',
      'Sinta o calor do amor próprio no peito.',
      'Você merece amor, você é digno.',
      'Agora pense em alguém que você ama.',
      'Visualize essa pessoa à sua frente.',
      'Envie amor do seu coração para ela.',
      'Que você seja feliz. Que você seja saudável.',
      'Veja essa pessoa sorrindo, em paz.',
      'Agora expanda para pessoas neutras.',
      'Pessoas que você vê mas não conhece.',
      'Envie amor também para elas.',
      'Todos merecem felicidade e paz.',
      'Agora, se puder, pense em alguém difícil.',
      'Reconheça que essa pessoa também sofre.',
      'Envie compaixão, mesmo se for desafiador.',
      'Que você também encontre paz.',
      'Finalmente, expanda para todos os seres.',
      'Em todas as direções, todo o planeta.',
      'Que todos sejam felizes.',
      'Que todos sejam livres de sofrimento.',
      'Sinta seu coração expandido, infinito.',
      'Respire profundamente esse amor.',
      'Quando estiver pronto, abra os olhos.',
      'Carregue essa compaixão com você.'
    ]
  }
]

// Geradores de frequências de áudio para música de fundo
class AudioGenerator {
  private audioContext: AudioContext | null = null
  private gainNode: GainNode | null = null
  private oscillators: OscillatorNode[] = []

  init() {
    if (this.audioContext) return
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    this.gainNode = this.audioContext.createGain()
    this.gainNode.connect(this.audioContext.destination)
    this.gainNode.gain.value = 0.15
  }

  playNatureSounds() {
    this.stop()
    if (!this.audioContext || !this.gainNode) return

    // Ondas do mar (ruído rosa + modulação)
    const bufferSize = 2 * this.audioContext.sampleRate
    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const output = noiseBuffer.getChannelData(0)

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
      output[i] *= 0.11
      b6 = white * 0.115926
    }

    const noise = this.audioContext.createBufferSource()
    noise.buffer = noiseBuffer
    noise.loop = true

    const noiseGain = this.audioContext.createGain()
    noiseGain.gain.value = 0.4
    noise.connect(noiseGain)
    noiseGain.connect(this.gainNode)
    noise.start()
    this.oscillators.push(noise as any)

    // Tom grave de fundo (paz)
    const osc = this.audioContext.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = 110
    const oscGain = this.audioContext.createGain()
    oscGain.gain.value = 0.05
    osc.connect(oscGain)
    oscGain.connect(this.gainNode)
    osc.start()
    this.oscillators.push(osc)
  }

  playInstrumental() {
    this.stop()
    if (!this.audioContext || !this.gainNode) return

    // Tons harmônicos relaxantes (432 Hz base)
    const frequencies = [432, 540, 648, 810] // Harmônicos

    frequencies.forEach((freq, index) => {
      const osc = this.audioContext!.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq / 4

      const oscGain = this.audioContext!.createGain()
      oscGain.gain.value = 0.08 / (index + 1)

      // Modulação suave
      const lfo = this.audioContext!.createOscillator()
      lfo.frequency.value = 0.2 + (index * 0.1)
      const lfoGain = this.audioContext!.createGain()
      lfoGain.gain.value = 2

      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)

      osc.connect(oscGain)
      oscGain.connect(this.gainNode!)

      osc.start()
      lfo.start()

      this.oscillators.push(osc)
      this.oscillators.push(lfo)
    })
  }

  setVolume(value: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = value
    }
  }

  stop() {
    this.oscillators.forEach(osc => {
      try {
        osc.stop()
      } catch (e) {
        // Ignorar erros de stop
      }
    })
    this.oscillators = []
  }

  destroy() {
    this.stop()
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }
}

export function Meditation() {
  const [selectedMeditation, setSelectedMeditation] = useState<MeditationSession | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [audioType, setAudioType] = useState<AudioType>('guiada')
  const [musicVolume, setMusicVolume] = useState(0.15)
  const [voiceVolume, setVoiceVolume] = useState(1.0)

  const audioGeneratorRef = useRef<AudioGenerator>(new AudioGenerator())
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    const generator = audioGeneratorRef.current
    return () => {
      generator.destroy()
      window.speechSynthesis.cancel()
    }
  }, [])

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

  // Narração de voz
  useEffect(() => {
    if (!selectedMeditation || !isPlaying) return
    if (audioType === 'musica' || audioType === 'natureza') return

    const text = selectedMeditation.script[currentStep]

    // Cancelar qualquer narração anterior
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'pt-BR'
    utterance.rate = 0.8 // Mais devagar para meditação
    utterance.pitch = 1.0
    utterance.volume = voiceVolume

    // Tentar encontrar uma voz em português
    const voices = window.speechSynthesis.getVoices()
    const ptVoice = voices.find(voice =>
      voice.lang.includes('pt-BR') || voice.lang.includes('pt')
    )
    if (ptVoice) {
      utterance.voice = ptVoice
    }

    currentUtteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)

  }, [currentStep, selectedMeditation, isPlaying, audioType, voiceVolume])

  // Música de fundo
  useEffect(() => {
    const generator = audioGeneratorRef.current

    if (!isPlaying || !selectedMeditation) {
      generator.stop()
      return
    }

    generator.init()
    generator.setVolume(musicVolume)

    if (audioType === 'natureza') {
      generator.playNatureSounds()
    } else if (audioType === 'musica' || audioType === 'musica-voz' || audioType === 'guiada') {
      if (selectedMeditation.backgroundMusic === 'natureza') {
        generator.playNatureSounds()
      } else if (selectedMeditation.backgroundMusic === 'instrumental') {
        generator.playInstrumental()
      }
    }

    return () => {
      if (!isPlaying) {
        generator.stop()
      }
    }
  }, [isPlaying, selectedMeditation, audioType, musicVolume])

  const startMeditation = (meditation: MeditationSession) => {
    setSelectedMeditation(meditation)
    setCurrentStep(0)
    const stepDuration = (meditation.duration * 60) / meditation.script.length
    setTimeRemaining(stepDuration)
    setIsPlaying(true)
  }

  const togglePlayPause = () => {
    if (isPlaying) {
      window.speechSynthesis.pause()
    } else {
      window.speechSynthesis.resume()
    }
    setIsPlaying(!isPlaying)
  }

  const resetMeditation = () => {
    window.speechSynthesis.cancel()
    setCurrentStep(0)
    if (selectedMeditation) {
      const stepDuration = (selectedMeditation.duration * 60) / selectedMeditation.script.length
      setTimeRemaining(stepDuration)
    }
    setIsPlaying(false)
  }

  const closeMeditation = () => {
    window.speechSynthesis.cancel()
    audioGeneratorRef.current.stop()
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
    gratidao: 'Gratidão',
    mindfulness: 'Mindfulness',
    energia: 'Energia'
  }

  const categoryColors = {
    relaxamento: 'bg-chart-1',
    foco: 'bg-secondary',
    sono: 'bg-chart-3',
    ansiedade: 'bg-chart-2',
    gratidao: 'bg-chart-5',
    mindfulness: 'bg-chart-4',
    energia: 'bg-accent'
  }

  const difficultyLabels = {
    iniciante: 'Iniciante',
    intermediario: 'Intermediário',
    avancado: 'Avançado'
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

            {/* Controles de Volume */}
            <div className="space-y-4 pt-4 border-t">
              {(audioType === 'guiada' || audioType === 'musica-voz') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Mic className="w-4 h-4" />
                      Volume da Voz
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(voiceVolume * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[voiceVolume]}
                    onValueChange={([value]) => setVoiceVolume(value)}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              )}

              {audioType !== 'natureza' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Music className="w-4 h-4" />
                      Volume da Música
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(musicVolume * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[musicVolume]}
                    onValueChange={([value]) => {
                      setMusicVolume(value)
                      audioGeneratorRef.current.setVolume(value)
                    }}
                    max={0.5}
                    step={0.05}
                    className="w-full"
                  />
                </div>
              )}
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
          <h1 className="text-3xl font-bold">Meditação Guiada com IA</h1>
          <p className="text-muted-foreground">Encontre paz e equilíbrio interior com áudio gerado por inteligência artificial</p>
        </div>

        {/* Tipo de Áudio */}
        <Card>
          <CardHeader>
            <CardTitle>Escolha o tipo de experiência</CardTitle>
            <CardDescription>Personalize como quer praticar sua meditação</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={audioType} onValueChange={(value: AudioType) => setAudioType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="guiada">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-medium">Meditação Guiada Completa</div>
                      <div className="text-xs text-muted-foreground">Voz + Música de fundo</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="musica-voz">
                  <div className="flex items-center gap-2">
                    <Volume1 className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-medium">Música com Narração</div>
                      <div className="text-xs text-muted-foreground">Foco na música + instruções</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="musica">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-medium">Apenas Música Instrumental</div>
                      <div className="text-xs text-muted-foreground">Sem narração de voz</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="natureza">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-medium">Sons da Natureza</div>
                      <div className="text-xs text-muted-foreground">Ondas do mar e ambiente natural</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

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
            <p>✓ Desenvolve autoconsciência</p>
          </CardContent>
        </Card>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="cursor-default">
            {MEDITATIONS.filter(m => m.difficulty === 'iniciante').length} Iniciante
          </Badge>
          <Badge variant="outline" className="cursor-default">
            {MEDITATIONS.filter(m => m.difficulty === 'intermediario').length} Intermediário
          </Badge>
          <Badge variant="outline" className="cursor-default">
            {MEDITATIONS.filter(m => m.difficulty === 'avancado').length} Avançado
          </Badge>
          <Badge variant="outline" className="cursor-default">
            5 a 30 minutos
          </Badge>
        </div>

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
                    <Badge variant="outline">{difficultyLabels[meditation.difficulty]}</Badge>
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
              <p>Use fones de ouvido para melhor imersão</p>
            </div>
            <div className="flex gap-2">
              <span>5.</span>
              <p>Não force, deixe os pensamentos fluírem</p>
            </div>
            <div className="flex gap-2">
              <span>6.</span>
              <p>Pratique regularmente, mesmo que por poucos minutos</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
