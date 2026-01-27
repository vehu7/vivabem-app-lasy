import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { ChefHat, Clock, DollarSign, Users, Sparkles } from 'lucide-react'
import { BRAZILIAN_RECIPES, type BrazilianRecipe } from '@/data/brazilian-recipes'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'

export function RecipesDialog() {
  const [selectedRecipe, setSelectedRecipe] = useState<BrazilianRecipe | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRecipes = BRAZILIAN_RECIPES.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'fácil':
        return 'bg-green-500/10 text-green-500 border-green-500/30'
      case 'média':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
      case 'difícil':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/30'
      default:
        return ''
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <ChefHat className="w-4 h-4 mr-2" />
          Receitas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden flex flex-col p-6">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-primary" />
            Receitas Saudáveis
          </DialogTitle>
          <DialogDescription>
            Receitas práticas e rápidas para dieta com informações nutricionais completas
          </DialogDescription>
        </DialogHeader>

        {!selectedRecipe ? (
          <div className="flex-1 overflow-hidden flex flex-col space-y-4 min-h-0">
            {/* Busca */}
            <Input
              placeholder="Buscar receita ou tag (ex: proteico, rápido)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-shrink-0"
            />

            {/* Lista de receitas */}
            <div className="flex-1 overflow-auto pr-2 min-h-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRecipes.map((recipe) => (
                  <Card
                    key={recipe.id}
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{recipe.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {recipe.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Info rápida */}
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {recipe.prepTime}min
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {recipe.servings} porções
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {recipe.estimatedCost}
                        </div>
                      </div>

                      {/* Macros */}
                      <div className="flex justify-between text-xs">
                        <span className="font-medium">{recipe.nutrition.calories} kcal</span>
                        <span className="text-blue-500">P: {recipe.nutrition.protein}g</span>
                        <span className="text-orange-500">C: {recipe.nutrition.carbs}g</span>
                        <span className="text-yellow-500">G: {recipe.nutrition.fat}g</span>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className={getDifficultyColor(recipe.difficulty)}>
                          {recipe.difficulty}
                        </Badge>
                        {recipe.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <div className="flex-1 overflow-auto pr-2 min-h-0">
              <div className="space-y-6">
                {/* Header da receita */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedRecipe.name}</h2>
                  <p className="text-muted-foreground mb-4">{selectedRecipe.description}</p>

                  <div className="flex flex-wrap gap-3 mb-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-medium">{selectedRecipe.prepTime} minutos</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="font-medium">{selectedRecipe.servings} porções</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="font-medium">{selectedRecipe.estimatedCost}</span>
                    </div>
                    <Badge variant="outline" className={getDifficultyColor(selectedRecipe.difficulty)}>
                      {selectedRecipe.difficulty}
                    </Badge>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedRecipe.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Informação Nutricional */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-base">Informação Nutricional (por porção)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{selectedRecipe.nutrition.calories}</div>
                        <div className="text-xs text-muted-foreground">Calorias</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-500">{selectedRecipe.nutrition.protein}g</div>
                        <div className="text-xs text-muted-foreground">Proteína</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-500">{selectedRecipe.nutrition.carbs}g</div>
                        <div className="text-xs text-muted-foreground">Carboidratos</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-500">{selectedRecipe.nutrition.fat}g</div>
                        <div className="text-xs text-muted-foreground">Gorduras</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-500">{selectedRecipe.nutrition.fiber}g</div>
                        <div className="text-xs text-muted-foreground">Fibras</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Ingredientes e Modo de Preparo */}
                <Tabs defaultValue="ingredients">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ingredients">Ingredientes</TabsTrigger>
                    <TabsTrigger value="instructions">Modo de Preparo</TabsTrigger>
                  </TabsList>

                  <TabsContent value="ingredients" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <ul className="space-y-2">
                          {selectedRecipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>{ingredient}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="instructions" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <ol className="space-y-3">
                          {selectedRecipe.instructions.map((instruction, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </span>
                              <span className="pt-0.5">{instruction}</span>
                            </li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Dicas */}
                {selectedRecipe.tips && (
                  <Card className="bg-accent">
                    <CardContent className="pt-4">
                      <div className="flex gap-2">
                        <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm mb-1">Dica do BEM</p>
                          <p className="text-sm text-muted-foreground">{selectedRecipe.tips}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Botão voltar */}
            <div className="pt-4 mt-4 border-t flex-shrink-0">
              <Button onClick={() => setSelectedRecipe(null)} variant="outline" className="w-full">
                ← Voltar para receitas
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
