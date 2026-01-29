# 🎙️ Configuração OpenAI TTS para Meditações Guiadas

## Visão Geral

As **Meditações Guiadas** do aplicativo utilizam síntese de voz da OpenAI (Text-to-Speech) para gerar narrações em português com voz feminina suave e doce.

## ✅ Alterações Realizadas

### 1. Catálogo de Faixas (`/src/data/meditation-tracks.ts`)

#### ✅ Categoria "Música Cantada" (antiga "Música com Narração")
- **Renomeada** de `musica-completa` para `musica-cantada`
- **Conteúdo**: 5 cânticos gregorianos em domínio público (PD/CC0)
  - Ubi Caritas (Gregorian Chant)
  - Salve Regina (Solemn Tone, Gregorian Chant)
  - Pange Lingua Gloriosi (Gregorian Chant)
  - Veni Creator Spiritus (Gregorian Chant)
  - Kyrie - Missa de Angelis (Gregorian Chant)

#### ✅ Categoria "Meditação Guiada"
- **Tecnologia**: OpenAI TTS (Text-to-Speech)
- **Voz**: Feminina suave e doce (modelo `nova`)
- **Idioma**: Português brasileiro (pt-BR)
- **Fundo**: Sons da natureza (ondas, chuva, floresta) **SEM RUÍDO BRANCO**
- **Faixas**:
  - Body Scan Meditation
  - Loving-Kindness (Metta) Meditation
  - Breath Awareness Meditation
  - Grounding with Ocean Waves
  - Progressive Muscle Relaxation

#### ✅ Categoria "Sons da Natureza"
- **PROIBIDO**: Ruído branco (white noise)
- Apenas gravações reais de campo (PD/CC0)

#### ✅ Categoria "Música Instrumental"
- Piano, cordas, obras clássicas (PD/CC0)

### 2. Componente de Meditação (`/src/pages/Meditation.tsx`)

#### Alterações:
- ✅ Removido tipo `musica-voz`
- ✅ Adicionado tipo `musica-cantada`
- ✅ Renomeado tipo `musica` para `instrumental`
- ✅ Removido código de ruído branco (white noise) do gerador de áudio
- ✅ Atualizada interface de seleção de tipos de meditação

## 🔧 Como Implementar OpenAI TTS (Próximos Passos)

### Passo 1: Configurar Variável de Ambiente

Adicione sua chave da OpenAI no arquivo `.env`:

```bash
VITE_OPENAI_API_KEY=sk-proj-...
```

### Passo 2: Instalar SDK da OpenAI

```bash
npm install openai
```

### Passo 3: Criar Serviço de TTS

Crie o arquivo `/src/lib/openai-tts.ts`:

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Apenas para desenvolvimento
})

export async function generateMeditationAudio(text: string): Promise<ArrayBuffer> {
  const response = await openai.audio.speech.create({
    model: 'tts-1-hd', // Modelo de alta qualidade
    voice: 'nova', // Voz feminina suave
    input: text,
    speed: 0.85, // Mais devagar para meditação
    response_format: 'mp3'
  })

  return await response.arrayBuffer()
}

export async function generateMeditationBlob(text: string): Promise<Blob> {
  const arrayBuffer = await generateMeditationAudio(text)
  return new Blob([arrayBuffer], { type: 'audio/mpeg' })
}

export async function generateMeditationURL(text: string): Promise<string> {
  const blob = await generateMeditationBlob(text)
  return URL.createObjectURL(blob)
}
```

### Passo 4: Integrar no Componente de Meditação

Modifique `/src/pages/Meditation.tsx` para usar o TTS:

```typescript
import { generateMeditationURL } from '@/lib/openai-tts'

// No useEffect de narração de voz:
useEffect(() => {
  if (!selectedMeditation || !isPlaying) return
  if (audioType !== 'guiada') return

  const text = selectedMeditation.script[currentStep]

  // Gerar áudio com OpenAI TTS
  generateMeditationURL(text).then(audioUrl => {
    const audio = new Audio(audioUrl)
    audio.volume = voiceVolume
    audio.play()

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl) // Limpar memória
    }
  }).catch(error => {
    console.error('Erro ao gerar áudio TTS:', error)
    // Fallback para Web Speech API
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'pt-BR'
    utterance.rate = 0.8
    utterance.volume = voiceVolume
    window.speechSynthesis.speak(utterance)
  })

}, [currentStep, selectedMeditation, isPlaying, audioType, voiceVolume])
```

### Passo 5: Adicionar Controle de Créditos (Opcional)

OpenAI TTS cobra por caractere. Para economizar:

1. **Cache de áudio**: Salvar áudios gerados em localStorage/IndexedDB
2. **Pré-geração**: Gerar todas as etapas de uma vez ao iniciar meditação
3. **Limite de uso**: Alertar usuário sobre consumo de créditos

Exemplo de cache:

```typescript
const CACHE_KEY = 'meditation-audio-cache'

async function getCachedAudio(text: string): Promise<string | null> {
  const cache = localStorage.getItem(CACHE_KEY)
  if (!cache) return null

  const parsed = JSON.parse(cache)
  return parsed[text] || null
}

async function setCachedAudio(text: string, audioUrl: string) {
  const cache = localStorage.getItem(CACHE_KEY) || '{}'
  const parsed = JSON.parse(cache)
  parsed[text] = audioUrl
  localStorage.setItem(CACHE_KEY, JSON.stringify(parsed))
}
```

## 📊 Custos Estimados (OpenAI TTS)

- **Modelo**: `tts-1-hd` (alta qualidade)
- **Preço**: $15.00 / 1M caracteres
- **Meditação média**: ~1.500 caracteres (12 etapas × 125 caracteres)
- **Custo por meditação**: ~$0.02 USD

### Otimizações:
- Cache local: **reduz 90% dos custos** (após primeira geração)
- Usar `tts-1` (standard): **metade do preço** ($7.50/1M)
- Pré-gerar áudios: **uma vez por meditação**

## 🎯 Modelos de Voz Disponíveis

### Recomendado para Meditação:
- **nova** (feminina): Suave, doce, calma ✅ RECOMENDADO
- **shimmer** (feminina): Jovem, energética

### Outras opções:
- **alloy** (neutro): Equilibrado
- **echo** (masculino): Grave, calmo
- **fable** (masculino): Narrativo
- **onyx** (masculino): Profundo

## 🚀 Próximas Melhorias

1. **Backend para TTS**: Mover geração de áudio para backend (mais seguro)
2. **Supabase Storage**: Armazenar áudios gerados no Supabase
3. **Fila de geração**: Gerar todas as etapas em background
4. **Editor de scripts**: Permitir usuário criar meditações personalizadas
5. **Vozes customizadas**: Treinar voz própria com ElevenLabs (alternativa)

## ⚠️ Segurança

- **NUNCA** exponha `VITE_OPENAI_API_KEY` no frontend em produção
- **Sempre** use backend para fazer chamadas à API OpenAI
- **Implemente** rate limiting e autenticação de usuários
- **Considere** Supabase Edge Functions para gerar áudio de forma segura

## 📝 Observações Finais

- ✅ Todo o código está pronto para integração com OpenAI TTS
- ✅ Ruído branco (white noise) foi completamente removido
- ✅ Categoria "Música Cantada" contém apenas cânticos gregorianos PD/CC0
- ✅ Sons da natureza são gravações reais de campo (sem white noise)
- ✅ Interface atualizada com nomes corretos das categorias

**Status**: Pronto para configuração da API OpenAI e implementação do serviço TTS.
