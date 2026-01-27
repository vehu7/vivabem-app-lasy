import { useState, useEffect, useRef } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Camera, Search, Barcode, Star, Clock, Apple, Coffee, UtensilsCrossed, Cookie, Trash2, AlertCircle, Sparkles, TrendingUp, X } from 'lucide-react'
import type { Meal, FoodItem } from '@/types'
import { BRAZILIAN_FOODS } from '@/data/brazilian-foods'
import { toast } from 'sonner'
import OpenAI from 'openai'
import { Html5Qrcode } from 'html5-qrcode'
import { BestFoodsDialog } from '@/components/best-foods-dialog'
import { RecipesDialog } from '@/components/recipes-dialog'
import { DietRecommendationDialog } from '@/components/diet-recommendation-dialog'

const MEAL_TYPES = [
  { value: 'cafe', label: 'Café da Manhã', icon: Coffee },
  { value: 'lanche_manha', label: 'Lanche da Manhã', icon: Cookie },
  { value: 'almoco', label: 'Almoço', icon: UtensilsCrossed },
  { value: 'lanche_tarde', label: 'Lanche da Tarde', icon: Cookie },
  { value: 'jantar', label: 'Jantar', icon: UtensilsCrossed },
  { value: 'ceia', label: 'Ceia', icon: Apple }
]

const FAVORITE_FOODS_KEY = 'favorite_foods'
const RECENT_FOODS_KEY = 'recent_foods'

export function Alimentacao() {
  const { user, todayMeals, addMeal, removeMeal } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMealType, setSelectedMealType] = useState<Meal['type']>('cafe')
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [favoriteFoods, setFavoriteFoods] = useState<string[]>([])
  const [recentFoods, setRecentFoods] = useState<FoodItem[]>([])
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false)
  const [isBarcodeDialogOpen, setIsBarcodeDialogOpen] = useState(false)
  const [isScanningBarcode, setIsScanningBarcode] = useState(false)
  const [scannedProduct, setScannedProduct] = useState<FoodItem | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const barcodeScannerRef = useRef<Html5Qrcode | null>(null)

  // Carregar favoritos e recentes
  useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITE_FOODS_KEY)
    const storedRecents = localStorage.getItem(RECENT_FOODS_KEY)

    if (storedFavorites) {
      try {
        setFavoriteFoods(JSON.parse(storedFavorites))
      } catch (e) {
        console.error('Erro ao carregar favoritos:', e)
      }
    }

    if (storedRecents) {
      try {
        setRecentFoods(JSON.parse(storedRecents))
      } catch (e) {
        console.error('Erro ao carregar recentes:', e)
      }
    }
  }, [])

  const filteredFoods = BRAZILIAN_FOODS.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addFoodToSelection = (food: FoodItem) => {
    setSelectedFoods([...selectedFoods, food])

    // Adicionar aos recentes
    const updatedRecents = [food, ...recentFoods.filter(f => f.id !== food.id)].slice(0, 10)
    setRecentFoods(updatedRecents)
    localStorage.setItem(RECENT_FOODS_KEY, JSON.stringify(updatedRecents))
  }

  const removeFoodFromSelection = (index: number) => {
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index))
  }

  const toggleFavorite = (foodId: string) => {
    const isFavorite = favoriteFoods.includes(foodId)
    const updated = isFavorite
      ? favoriteFoods.filter(id => id !== foodId)
      : [...favoriteFoods, foodId]

    setFavoriteFoods(updated)
    localStorage.setItem(FAVORITE_FOODS_KEY, JSON.stringify(updated))

    toast.success(isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos')
  }

  const saveMeal = async () => {
    if (selectedFoods.length === 0) return

    const totalCalories = selectedFoods.reduce((sum, food) => sum + food.calories, 0)
    const totalProtein = selectedFoods.reduce((sum, food) => sum + food.protein, 0)
    const totalCarbs = selectedFoods.reduce((sum, food) => sum + food.carbs, 0)
    const totalFat = selectedFoods.reduce((sum, food) => sum + food.fat, 0)

    const meal: Meal = {
      id: crypto.randomUUID(),
      date: new Date(),
      type: selectedMealType,
      foods: selectedFoods,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat
    }

    addMeal(meal)

    // Gerar feedback do BEM com IA
    await generateAIFeedback(meal)

    setSelectedFoods([])
    setIsDialogOpen(false)
  }

  const generateAIFeedback = async (meal: Meal) => {
    if (!user) return

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY
      if (!apiKey) return

      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      })

      const prompt = `Como nutricionista do app VivaBem, dê um feedback MUITO BREVE (máximo 2 linhas) sobre esta refeição:

Refeição: ${MEAL_TYPES.find(m => m.value === meal.type)?.label}
Alimentos: ${meal.foods.map(f => f.name).join(', ')}
Calorias: ${meal.totalCalories} kcal
Proteína: ${Math.round(meal.totalProtein)}g
Carboidratos: ${Math.round(meal.totalCarbs)}g
Gorduras: ${Math.round(meal.totalFat)}g

Perfil do usuário:
- Objetivo: ${user.goal === 'perder_peso' ? 'perder peso' : user.goal === 'ganhar_massa' ? 'ganhar massa' : 'manter peso'}
- Meta calórica: ${user.targetCalories || 2000} kcal/dia
- Meta de proteína: ${user.targetProtein || 120}g/dia
- Medicação: ${user.medication !== 'nenhum' ? user.medication : 'nenhuma'}

Dê uma dica prática, amigável e motivadora (máximo 2 linhas). Foque em: equilíbrio de macros, fibras, hidratação ou saciedade.`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um nutricionista especializado em alimentação saudável brasileira.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })

      const feedback = completion.choices[0]?.message?.content || 'Refeição registrada com sucesso!'

      toast.success('Refeição registrada!', {
        description: feedback,
        duration: 8000
      })
    } catch (error) {
      console.error('Erro ao gerar feedback:', error)
      toast.success('Refeição registrada!')
    }
  }

  // Buscar produto por código de barras (Open Food Facts Brasil)
  const searchProductByBarcode = async (barcode: string) => {
    try {
      // Primeiro, tenta na Open Food Facts Brasil
      const response = await fetch(`https://br.openfoodfacts.org/api/v2/product/${barcode}`)
      const data = await response.json()

      if (data.status === 1 && data.product) {
        const product = data.product

        // Converter para FoodItem
        const foodItem: FoodItem = {
          id: `barcode-${barcode}`,
          name: product.product_name || 'Produto desconhecido',
          category: 'outro',
          portion: `${product.serving_size || '100g'}`,
          calories: Math.round(product.nutriments?.['energy-kcal_100g'] || 0),
          protein: Math.round(product.nutriments?.proteins_100g || 0),
          carbs: Math.round(product.nutriments?.carbohydrates_100g || 0),
          fat: Math.round(product.nutriments?.fat_100g || 0),
          fiber: Math.round(product.nutriments?.fiber_100g || 0),
          isBrazilian: true,
          isHealthy: true,
          barcode: barcode
        }

        return foodItem
      }

      // Se não encontrou, tentar usar IA para sugerir
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY
      if (apiKey) {
        const openai = new OpenAI({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true
        })

        const prompt = `O código de barras ${barcode} não foi encontrado no banco de dados brasileiro.

        Com base no formato do código (EAN-13 brasileiro), sugira um alimento comum brasileiro que poderia ter esse código.

        Retorne no formato JSON:
        {
          "name": "nome do alimento",
          "portion": "porção típica",
          "calories": número,
          "protein": número,
          "carbs": número,
          "fat": número,
          "fiber": número,
          "confidence": "baixa"
        }`

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em alimentos brasileiros e nutrição. Retorne sempre JSON válido.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 200,
          response_format: { type: 'json_object' }
        })

        const response = completion.choices[0]?.message?.content
        if (response) {
          const data = JSON.parse(response)
          return {
            id: `barcode-ai-${barcode}`,
            name: `${data.name} (sugestão IA)`,
            category: 'outro' as const,
            portion: data.portion,
            calories: data.calories,
            protein: data.protein,
            carbs: data.carbs,
            fat: data.fat,
            fiber: data.fiber || 0,
            isBrazilian: true,
            isHealthy: true
          }
        }
      }

      throw new Error('Produto não encontrado')
    } catch (error) {
      console.error('Erro ao buscar produto:', error)
      throw error
    }
  }

  const startBarcodeScanner = async () => {
    setIsScanningBarcode(true)
    setScannedProduct(null)

    try {
      // Verificar se já existe uma instância e limpar
      if (barcodeScannerRef.current) {
        await stopBarcodeScanner()
      }

      const html5QrCode = new Html5Qrcode("barcode-reader")
      barcodeScannerRef.current = html5QrCode

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
          formatsToSupport: [0, 1, 2, 3] // EAN-13, EAN-8, UPC-A, UPC-E
        },
        async (decodedText) => {
          // Código de barras detectado
          toast.success('Código detectado!', {
            description: `Buscando produto: ${decodedText}`
          })

          // Parar scanner
          await stopBarcodeScanner()

          // Buscar produto
          try {
            const product = await searchProductByBarcode(decodedText)
            setScannedProduct(product)
            toast.success('Produto encontrado!', {
              description: product.name
            })
          } catch (error) {
            toast.error('Produto não encontrado', {
              description: 'Tente adicionar manualmente ou use a busca'
            })
            setIsBarcodeDialogOpen(false)
          }
        },
        () => {
          // Erro ao escanear (pode ignorar, é normal durante a busca)
        }
      )
    } catch (error: any) {
      console.error('Erro ao iniciar scanner:', error)

      // Mensagem específica para erro de permissão
      let errorMessage = 'Verifique as permissões nas configurações do navegador'

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Permissão de câmera negada. Clique no ícone 🔒 ao lado da URL e permita o acesso à câmera.'
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'Nenhuma câmera encontrada no dispositivo.'
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Câmera em uso por outro aplicativo. Feche outros apps e tente novamente.'
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error('Erro ao acessar câmera', {
        description: errorMessage,
        duration: 8000
      })
      setIsScanningBarcode(false)
    }
  }

  const stopBarcodeScanner = async () => {
    if (barcodeScannerRef.current) {
      try {
        await barcodeScannerRef.current.stop()
        barcodeScannerRef.current = null
      } catch (error) {
        console.error('Erro ao parar scanner:', error)
      }
    }
    setIsScanningBarcode(false)
  }

  const addScannedProductToSelection = () => {
    if (scannedProduct) {
      addFoodToSelection(scannedProduct)
      setScannedProduct(null)
      setIsBarcodeDialogOpen(false)
      setIsDialogOpen(true)
    }
  }

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      stopBarcodeScanner()
    }
  }, [])

  const analyzePhoto = async (file: File) => {
    setIsAnalyzingPhoto(true)

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY
      if (!apiKey) {
        throw new Error('ERRO: Variável de ambiente VITE_OPENAI_API_KEY não está definida. Configure o arquivo .env com sua chave da OpenAI.')
      }

      // Validar tamanho do arquivo (máx 4MB)
      if (file.size > 4 * 1024 * 1024) {
        throw new Error('Imagem muito grande. Use uma foto menor que 4MB.')
      }

      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Arquivo inválido. Use uma imagem (JPG, PNG, etc.)')
      }

      // Converter imagem para base64
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
      })

      reader.readAsDataURL(file)
      const dataUrl = await base64Promise

      if (!dataUrl) {
        throw new Error('Erro ao processar imagem')
      }

      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      })

      const prompt = `Analise esta foto de comida e identifique todos os alimentos visíveis. Para cada alimento:

1. Nome do alimento em português brasileiro
2. Porção aproximada (ex: "1 unidade", "100g", "1 xícara")
3. Calorias aproximadas
4. Macronutrientes aproximados (proteína, carboidratos, gorduras em gramas)

IMPORTANTE:
- Considere alimentos e porções típicas do Brasil
- Se houver múltiplos itens, liste todos
- Seja realista nas estimativas
- ⚠️ Avise que são estimativas aproximadas e podem ter margem de erro

Formato da resposta (JSON):
{
  "foods": [
    {
      "name": "Nome do alimento",
      "portion": "porção estimada",
      "calories": número,
      "protein": número,
      "carbs": número,
      "fat": número,
      "confidence": "alta/média/baixa"
    }
  ],
  "warning": "Aviso sobre precisão"
}`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um nutricionista especializado em alimentos brasileiros. Retorne sempre JSON válido.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: dataUrl
                }
              }
            ]
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      })

      const response = completion.choices[0]?.message?.content

      if (!response) {
        throw new Error('Resposta vazia da OpenAI')
      }

      const data = JSON.parse(response)

      if (!data.foods || !Array.isArray(data.foods)) {
        throw new Error('Resposta da IA em formato inválido')
      }

      // Converter para FoodItem[]
      const detectedFoods: FoodItem[] = data.foods.map((food: any, index: number) => ({
        id: `photo-${Date.now()}-${index}`,
        name: food.name || 'Alimento desconhecido',
        category: 'outro' as const,
        portion: food.portion || '100g',
        calories: Math.round(food.calories || 0),
        protein: Math.round(food.protein || 0),
        carbs: Math.round(food.carbs || 0),
        fat: Math.round(food.fat || 0),
        fiber: Math.round(food.fiber || 0),
        isBrazilian: true,
        isHealthy: true
      }))

      if (detectedFoods.length === 0) {
        throw new Error('Nenhum alimento detectado na foto. Tente uma foto mais clara.')
      }

      setSelectedFoods([...selectedFoods, ...detectedFoods])
      setIsDialogOpen(true)

      toast.success('Foto analisada!', {
        description: `${detectedFoods.length} ${detectedFoods.length === 1 ? 'alimento detectado' : 'alimentos detectados'}. ${data.warning || '⚠️ Estimativas aproximadas, ajuste se necessário.'}`,
        duration: 8000
      })
    } catch (error: any) {
      console.error('Erro ao analisar foto:', error)
      toast.error('Erro ao analisar foto', {
        description: error.message || 'Tente novamente com uma foto mais clara ou adicione manualmente',
        duration: 6000
      })
    } finally {
      setIsAnalyzingPhoto(false)
    }
  }

  const handlePhotoCapture = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      analyzePhoto(file)
    }
  }

  const getMealIcon = (type: Meal['type']) => {
    const meal = MEAL_TYPES.find(m => m.value === type)
    return meal ? meal.icon : Apple
  }

  const getMealLabel = (type: Meal['type']) => {
    const meal = MEAL_TYPES.find(m => m.value === type)
    return meal ? meal.label : type
  }

  const totalCaloriesToday = todayMeals.reduce((sum, meal) => sum + meal.totalCalories, 0)
  const totalProteinToday = todayMeals.reduce((sum, meal) => sum + meal.totalProtein, 0)
  const totalCarbsToday = todayMeals.reduce((sum, meal) => sum + meal.totalCarbs, 0)
  const totalFatToday = todayMeals.reduce((sum, meal) => sum + meal.totalFat, 0)
  const totalFiberToday = todayMeals.reduce((sum, meal) => {
    return sum + meal.foods.reduce((fiberSum, food) => fiberSum + (food.fiber || 0), 0)
  }, 0)

  const targetCalories = user?.targetCalories || 2000
  const targetProtein = user?.targetProtein || 120
  const targetCarbs = user?.targetCarbs || 200
  const targetFat = user?.targetFat || 60
  const targetFiber = user?.targetFiber || 25

  const caloriesPercentage = Math.min((totalCaloriesToday / targetCalories) * 100, 100)
  const proteinPercentage = Math.min((totalProteinToday / targetProtein) * 100, 100)

  const remainingCalories = Math.max(0, targetCalories - totalCaloriesToday)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 pb-24 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Apple className="w-16 h-16 text-primary mx-auto" />
          <h1 className="text-3xl font-bold">Alimentação</h1>
          <p className="text-muted-foreground">Rastreie sua nutrição com IA</p>
        </div>

        {/* Resumo inteligente do dia */}
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Suas Metas Hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Calorias */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Calorias</span>
                <span className="text-muted-foreground">
                  {totalCaloriesToday} / {targetCalories} kcal
                </span>
              </div>
              <Progress value={caloriesPercentage} className="h-3" />
              <div className="text-xs text-center text-muted-foreground">
                Restam {remainingCalories} kcal para hoje
              </div>
            </div>

            {/* Macros */}
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center space-y-1">
                <div className="text-xl font-bold text-blue-500">{Math.round(totalProteinToday)}g</div>
                <div className="text-[10px] text-muted-foreground">Proteína</div>
                <Progress value={proteinPercentage} className="h-1" />
                <div className="text-[9px] text-muted-foreground">{targetProtein}g</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-xl font-bold text-orange-500">{Math.round(totalCarbsToday)}g</div>
                <div className="text-[10px] text-muted-foreground">Carboidratos</div>
                <Progress value={Math.min((totalCarbsToday / targetCarbs) * 100, 100)} className="h-1" />
                <div className="text-[9px] text-muted-foreground">{targetCarbs}g</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-xl font-bold text-yellow-500">{Math.round(totalFatToday)}g</div>
                <div className="text-[10px] text-muted-foreground">Gorduras</div>
                <Progress value={Math.min((totalFatToday / targetFat) * 100, 100)} className="h-1" />
                <div className="text-[9px] text-muted-foreground">{targetFat}g</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-xl font-bold text-green-500">{Math.round(totalFiberToday)}g</div>
                <div className="text-[10px] text-muted-foreground">Fibras</div>
                <Progress value={Math.min((totalFiberToday / targetFiber) * 100, 100)} className="h-1" />
                <div className="text-[9px] text-muted-foreground">{targetFiber}g</div>
              </div>
            </div>

            {/* Alertas GLP-1 */}
            {user?.medication && user.medication !== 'nenhum' && totalCaloriesToday < targetCalories * 0.5 && (
              <Card className="bg-destructive/10 border-destructive/30">
                <CardContent className="pt-4">
                  <div className="flex gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">Atenção: Ingestão baixa</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Você está usando {user.medication}. Mantenha proteína e nutrição adequadas. Consulte seu médico se tiver náuseas ou dificuldade para comer.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Botões de ação com IA */}
        <div className="grid grid-cols-3 gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="h-24 flex flex-col gap-2">
                <Search className="w-6 h-6" />
                <span className="text-xs">Buscar</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl h-[85vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Adicionar Alimentos</DialogTitle>
                <DialogDescription>Busque, favorite ou use seus recentes</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="search" className="flex-1 overflow-hidden flex flex-col">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="search">Buscar</TabsTrigger>
                  <TabsTrigger value="favorites">Favoritos</TabsTrigger>
                  <TabsTrigger value="recent">Recentes</TabsTrigger>
                </TabsList>

                <div className="space-y-4 flex-1 overflow-hidden flex flex-col mt-4">
                  {/* Tipo de refeição */}
                  <Select value={selectedMealType} onValueChange={(value: Meal['type']) => setSelectedMealType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MEAL_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <TabsContent value="search" className="flex-1 overflow-hidden flex flex-col m-0">
                    {/* Busca */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar alimento (ex: arroz, feijão, frango)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Lista de alimentos */}
                    <ScrollArea className="flex-1">
                      <div className="space-y-2 pr-4">
                        {filteredFoods.map((food) => (
                          <Card key={food.id} className="cursor-pointer hover:bg-accent transition-colors">
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex-1" onClick={() => addFoodToSelection(food)}>
                                  <div className="font-medium">{food.name}</div>
                                  <div className="text-xs text-muted-foreground">{food.portion}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="text-right">
                                    <div className="font-bold text-primary text-sm">{food.calories} kcal</div>
                                    <div className="text-[10px] text-muted-foreground">
                                      P:{food.protein}g C:{food.carbs}g G:{food.fat}g
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleFavorite(food.id)
                                    }}
                                  >
                                    <Star className={`w-4 h-4 ${favoriteFoods.includes(food.id) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="favorites" className="flex-1 overflow-hidden m-0">
                    <ScrollArea className="h-full">
                      <div className="space-y-2 pr-4">
                        {BRAZILIAN_FOODS.filter(f => favoriteFoods.includes(f.id)).length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Nenhum favorito ainda</p>
                            <p className="text-xs">Adicione alimentos aos favoritos para acesso rápido</p>
                          </div>
                        ) : (
                          BRAZILIAN_FOODS.filter(f => favoriteFoods.includes(f.id)).map((food) => (
                            <Card key={food.id} className="cursor-pointer hover:bg-accent" onClick={() => addFoodToSelection(food)}>
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="font-medium">{food.name}</div>
                                    <div className="text-xs text-muted-foreground">{food.portion}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-primary text-sm">{food.calories} kcal</div>
                                    <div className="text-[10px] text-muted-foreground">
                                      P:{food.protein}g C:{food.carbs}g
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="recent" className="flex-1 overflow-hidden m-0">
                    <ScrollArea className="h-full">
                      <div className="space-y-2 pr-4">
                        {recentFoods.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Nenhum alimento recente</p>
                          </div>
                        ) : (
                          recentFoods.map((food) => (
                            <Card key={food.id} className="cursor-pointer hover:bg-accent" onClick={() => addFoodToSelection(food)}>
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="font-medium">{food.name}</div>
                                    <div className="text-xs text-muted-foreground">{food.portion}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-primary text-sm">{food.calories} kcal</div>
                                    <div className="text-[10px] text-muted-foreground">
                                      P:{food.protein}g C:{food.carbs}g
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  {/* Alimentos selecionados */}
                  {selectedFoods.length > 0 && (
                    <div className="space-y-2 pt-4 border-t">
                      <div className="font-medium">Selecionados ({selectedFoods.length}):</div>
                      <ScrollArea className="max-h-32">
                        <div className="space-y-1 pr-4">
                          {selectedFoods.map((food, index) => (
                            <div key={index} className="flex items-center justify-between bg-muted p-2 rounded text-sm">
                              <span>{food.name} ({food.calories} kcal)</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFoodFromSelection(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <Button onClick={saveMeal} className="w-full">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Salvar com Feedback IA
                      </Button>
                    </div>
                  )}
                </div>
              </Tabs>
            </DialogContent>
          </Dialog>

          <Button
            size="lg"
            variant="outline"
            className="h-24 flex flex-col gap-2"
            onClick={handlePhotoCapture}
            disabled={isAnalyzingPhoto}
          >
            {isAnalyzingPhoto ? (
              <Sparkles className="w-6 h-6 animate-pulse" />
            ) : (
              <Camera className="w-6 h-6" />
            )}
            <span className="text-xs">{isAnalyzingPhoto ? 'Analisando...' : 'Foto IA'}</span>
          </Button>

          <Dialog open={isBarcodeDialogOpen} onOpenChange={(open) => {
            setIsBarcodeDialogOpen(open)
            if (!open) stopBarcodeScanner()
          }}>
            <DialogTrigger asChild>
              <Button size="lg" variant="outline" className="h-24 flex flex-col gap-2">
                <Barcode className="w-6 h-6" />
                <span className="text-xs">Código</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Escanear Código de Barras</DialogTitle>
                <DialogDescription>
                  Aponte a câmera para o código de barras do produto
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {!isScanningBarcode && !scannedProduct && (
                  <div className="text-center space-y-4">
                    <Barcode className="w-16 h-16 mx-auto text-muted-foreground" />
                    <Button onClick={startBarcodeScanner} className="w-full">
                      Iniciar Scanner
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Busca automática em bancos de dados brasileiros (Open Food Facts)
                    </p>
                  </div>
                )}

                {isScanningBarcode && (
                  <div className="space-y-4">
                    <div
                      id="barcode-reader"
                      className="w-full rounded-lg overflow-hidden bg-muted"
                      style={{ minHeight: '300px' }}
                    />
                    <Button onClick={stopBarcodeScanner} variant="destructive" className="w-full">
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                )}

                {scannedProduct && (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">{scannedProduct.name}</CardTitle>
                        <CardDescription>{scannedProduct.portion}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Calorias:</span>
                            <span className="ml-2 font-bold">{scannedProduct.calories} kcal</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Proteína:</span>
                            <span className="ml-2 font-bold">{scannedProduct.protein}g</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Carboidratos:</span>
                            <span className="ml-2 font-bold">{scannedProduct.carbs}g</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Gorduras:</span>
                            <span className="ml-2 font-bold">{scannedProduct.fat}g</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex gap-2">
                      <Button onClick={addScannedProductToSelection} className="flex-1">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Adicionar à Refeição
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setScannedProduct(null)
                          startBarcodeScanner()
                        }}
                      >
                        <Barcode className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Recomendação de Cardápio Semanal com IA */}
        <DietRecommendationDialog />

        {/* Melhores Alimentos e Receitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <BestFoodsDialog />
          <RecipesDialog />
        </div>

        {/* Refeições do dia */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Refeições de Hoje</h2>
          {todayMeals.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground space-y-2">
                <Apple className="w-12 h-12 mx-auto opacity-50" />
                <p>Nenhuma refeição registrada ainda</p>
                <p className="text-xs">Use a câmera com IA ou busque alimentos!</p>
              </CardContent>
            </Card>
          ) : (
            todayMeals.map((meal) => {
              const Icon = getMealIcon(meal.type)
              return (
                <Card key={meal.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{getMealLabel(meal.type)}</CardTitle>
                          <CardDescription>
                            {new Date(meal.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeMeal(meal.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {meal.foods.map((food, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium">{food.name}</div>
                        <div className="text-muted-foreground">{food.portion}</div>
                      </div>
                    ))}
                    <div className="pt-3 border-t flex flex-wrap gap-2">
                      <Badge variant="secondary">{meal.totalCalories} kcal</Badge>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
                        P: {Math.round(meal.totalProtein)}g
                      </Badge>
                      <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30">
                        C: {Math.round(meal.totalCarbs)}g
                      </Badge>
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                        G: {Math.round(meal.totalFat)}g
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
