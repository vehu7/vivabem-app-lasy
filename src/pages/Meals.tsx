import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Camera, Search, Plus, Trash2, Apple, Coffee, UtensilsCrossed, Cookie } from 'lucide-react'
import type { Meal, FoodItem } from '@/types'
import { BRAZILIAN_FOODS } from '@/data/brazilian-foods'

const MEAL_TYPES = [
  { value: 'cafe', label: 'Café da Manhã', icon: Coffee },
  { value: 'lanche_manha', label: 'Lanche da Manhã', icon: Cookie },
  { value: 'almoco', label: 'Almoço', icon: UtensilsCrossed },
  { value: 'lanche_tarde', label: 'Lanche da Tarde', icon: Cookie },
  { value: 'jantar', label: 'Jantar', icon: UtensilsCrossed },
  { value: 'ceia', label: 'Ceia', icon: Apple }
]

export function Meals() {
  const { todayMeals, addMeal, removeMeal } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMealType, setSelectedMealType] = useState<Meal['type']>('cafe')
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredFoods = BRAZILIAN_FOODS.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addFoodToSelection = (food: FoodItem) => {
    setSelectedFoods([...selectedFoods, food])
  }

  const removeFoodFromSelection = (index: number) => {
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index))
  }

  const saveMeal = () => {
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
    setSelectedFoods([])
    setIsDialogOpen(false)
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 pb-24 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Apple className="w-16 h-16 text-destructive mx-auto" />
          <h1 className="text-3xl font-bold">Refeições</h1>
          <p className="text-muted-foreground">Registre suas refeições do dia</p>
        </div>

        {/* Resumo do dia */}
        <Card className="bg-primary text-primary-foreground border-0">
          <CardContent className="pt-6">
            <div className="flex justify-around">
              <div className="text-center">
                <div className="text-3xl font-bold">{totalCaloriesToday}</div>
                <div className="text-sm opacity-90">Calorias</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{Math.round(totalProteinToday)}</div>
                <div className="text-sm opacity-90">Proteínas (g)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{todayMeals.length}</div>
                <div className="text-sm opacity-90">Refeições</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de ação */}
        <div className="grid grid-cols-2 gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="h-24 flex flex-col gap-2">
                <Search className="w-8 h-8" />
                <span>Buscar Alimento</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Adicionar Refeição</DialogTitle>
                <DialogDescription>Selecione o tipo de refeição e adicione alimentos</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
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

                {/* Busca */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar alimento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Lista de alimentos */}
                <ScrollArea className="flex-1 -mx-6 px-6">
                  <div className="space-y-2">
                    {filteredFoods.map((food) => (
                      <Card key={food.id} className="cursor-pointer hover:bg-accent" onClick={() => addFoodToSelection(food)}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium">{food.name}</div>
                              <div className="text-xs text-muted-foreground">{food.portion}</div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="font-bold text-primary">{food.calories} kcal</div>
                              <div className="text-xs text-muted-foreground">
                                P:{food.protein}g C:{food.carbs}g G:{food.fat}g
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>

                {/* Alimentos selecionados */}
                {selectedFoods.length > 0 && (
                  <div className="space-y-2 pt-4 border-t">
                    <div className="font-medium">Alimentos selecionados:</div>
                    <div className="space-y-1">
                      {selectedFoods.map((food, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                          <span className="text-sm">{food.name}</span>
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
                    <Button onClick={saveMeal} className="w-full">
                      Salvar Refeição
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Button size="lg" variant="outline" className="h-24 flex flex-col gap-2" disabled>
            <Camera className="w-8 h-8" />
            <span>Foto (em breve)</span>
          </Button>
        </div>

        {/* Refeições do dia */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Hoje</h2>
          {todayMeals.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                Nenhuma refeição registrada ainda.
                <br />
                Comece adicionando sua primeira refeição!
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
                    <div className="pt-3 border-t flex gap-4">
                      <Badge variant="secondary">{meal.totalCalories} kcal</Badge>
                      <Badge variant="outline">P: {Math.round(meal.totalProtein)}g</Badge>
                      <Badge variant="outline">C: {Math.round(meal.totalCarbs)}g</Badge>
                      <Badge variant="outline">G: {Math.round(meal.totalFat)}g</Badge>
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
