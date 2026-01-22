import { useState, useRef, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Mascot } from '@/components/mascot'
import { Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function ChatBem() {
  const { user } = useApp()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Olá${user ? `, ${user.name}` : ''}! 👋 Eu sou o BEM, seu assistente de saúde! Estou aqui para te ajudar com dúvidas sobre nutrição, receitas saudáveis, exercícios e bem-estar. Como posso te ajudar hoje?`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Verificar se a API key está configurada
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey) {
        throw new Error('ERRO: Variável de ambiente VITE_GEMINI_API_KEY não está definida. Configure o arquivo .env com sua chave do Google Gemini.')
      }

      // Criar contexto do usuário
      const userContext = user ? `
      Informações do usuário:
      - Nome: ${user.name}
      - Objetivo: ${user.goal === 'perder_peso' ? 'perder peso' : user.goal === 'ganhar_massa' ? 'ganhar massa muscular' : 'manter peso'}
      - Meta calórica: ${user.targetCalories || 'não calculada'} kcal/dia
      - Proteína: ${user.targetProtein || 0}g, Carboidratos: ${user.targetCarbs || 0}g, Gorduras: ${user.targetFat || 0}g
      - Preferências: ${user.dietaryPreferences.join(', ') || 'nenhuma'}
      - Medicação: ${user.medication === 'nenhum' ? 'nenhuma' : user.medication}
      ` : ''

      const systemPrompt = `Você é o BEM, o mascote amigável e empático do app VivaBem. Você é especialista em:
- Nutrição e alimentação saudável brasileira
- Conceitos médicos de saúde e bem-estar
- Receitas saudáveis adaptadas ao Brasil
- Exercícios e atividade física
- Motivação e suporte emocional

REGRAS IMPORTANTES:
1. NUNCA recomende medicamentos ou diagnósticos médicos
2. Sempre sugira consultar um médico para questões sérias de saúde
3. Seja simpático, acolhedor e motivador
4. Use linguagem simples e acessível
5. Adapte receitas para ingredientes brasileiros
6. Respeite as preferências alimentares do usuário
7. Seja breve e objetivo (máximo 3 parágrafos)

${userContext}

Responda de forma amigável e útil!`

      // Construir histórico de conversas para contexto
      const conversationHistory = messages.slice(-5).map(m =>
        `${m.role === 'user' ? 'Usuário' : 'BEM'}: ${m.content}`
      ).join('\n\n')

      const fullPrompt = `${systemPrompt}

Histórico da conversa:
${conversationHistory}

Usuário: ${userMessage.content}

BEM:`

      // Chamar Google Gemini API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: fullPrompt
              }]
            }],
            generationConfig: {
              temperature: 0.8,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 500,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_NONE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_NONE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_NONE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_NONE"
              }
            ]
          })
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Erro da API Gemini:', errorText)

        let errorMessage = 'Erro ao conectar com a API do Gemini'
        try {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.error?.message || errorMessage
        } catch (e) {
          errorMessage = errorText.substring(0, 200)
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('Resposta Gemini:', data)

      // Extrair texto da resposta do Gemini
      const geminiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!geminiResponse) {
        console.error('Estrutura da resposta:', JSON.stringify(data, null, 2))
        throw new Error('Resposta vazia do Gemini. Verifique o console para mais detalhes.')
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: geminiResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error: any) {
      console.error('Erro completo no chat:', error)

      // Extrair mensagem de erro mais descritiva
      let errorDescription = error.message

      if (error.message.includes('API_KEY_INVALID')) {
        errorDescription = 'Chave API inválida. Verifique se você copiou corretamente a chave do Google AI Studio.'
      } else if (error.message.includes('quota')) {
        errorDescription = 'Limite de requisições excedido. Aguarde alguns minutos.'
      } else if (error.message.includes('CORS')) {
        errorDescription = 'Erro de conexão. A API do Gemini pode estar bloqueando requisições diretas do navegador.'
      }

      toast.error('Erro ao enviar mensagem', {
        description: errorDescription,
        duration: 5000
      })

      // Adicionar mensagem de erro detalhada
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `😔 Desculpe, tive um problema para responder.\n\nErro: ${errorDescription}\n\nDica: Abra o console do navegador (F12) para ver mais detalhes.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 pb-24">
        {/* Header */}
        <div className="text-center space-y-4 mb-6">
          <Mascot size="md" mood="happy" />
          <div>
            <h1 className="text-3xl font-bold">Chat com BEM</h1>
            <p className="text-muted-foreground">Seu assistente de saúde inteligente</p>
          </div>
        </div>

        {/* Chat */}
        <Card className="h-[calc(100vh-300px)] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Converse comigo!</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs">
                            🤖
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">BEM</span>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Sugestões */}
        <div className="mt-4 space-y-2">
          <p className="text-sm text-muted-foreground text-center">Sugestões:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              'Me dê uma receita saudável',
              'Como posso ter mais energia?',
              'Dicas para dormir melhor',
              'Estou sem motivação para treinar'
            ].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => setInput(suggestion)}
                disabled={isLoading}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>

        {/* Aviso */}
        <Card className="mt-4 bg-muted border-0">
          <CardContent className="pt-4">
            <p className="text-xs text-center text-muted-foreground">
              ⚠️ O BEM é um assistente virtual e não substitui consulta médica. Para questões sérias de saúde, consulte um profissional.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
