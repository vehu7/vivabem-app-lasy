import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Award, Info } from 'lucide-react'
import { BEST_BRAZILIAN_FOODS, SMART_SHOPPING_TIPS } from '@/data/best-brazilian-foods'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function BestFoodsDialog() {
  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'baixo':
        return 'bg-green-500/10 text-green-500 border-green-500/30'
      case 'médio':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
      case 'alto':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/30'
      default:
        return ''
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Award className="w-4 h-4 mr-2" />
          Melhores Alimentos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Melhores Alimentos Brasileiros
          </DialogTitle>
          <DialogDescription>
            Alimentos nutritivos, acessíveis e regionais para sua dieta
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="foods" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="foods">Alimentos</TabsTrigger>
            <TabsTrigger value="tips">Dicas de Compra</TabsTrigger>
          </TabsList>

          <TabsContent value="foods" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-6">
                {BEST_BRAZILIAN_FOODS.map((category) => (
                  <Card key={category.category}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="text-2xl">{category.icon}</span>
                        {category.category}
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {category.foods.map((food) => (
                        <div
                          key={food.name}
                          className="p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-medium">{food.name}</h4>
                            <Badge variant="outline" className={getCostColor(food.costLevel)}>
                              {food.costLevel}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{food.benefits}</p>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Porção:</span> {food.portion}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="tips" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-3">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-4">
                    <div className="flex gap-2 text-sm">
                      <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Dica do BEM</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Priorize alimentos integrais, da safra e minimize ultraprocessados.
                          Uma alimentação saudável não precisa ser cara!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {SMART_SHOPPING_TIPS.map((tip) => (
                  <Card key={tip.title}>
                    <CardHeader>
                      <CardTitle className="text-base">{tip.title}</CardTitle>
                      <CardDescription>{tip.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}

                <Card className="bg-accent">
                  <CardHeader>
                    <CardTitle className="text-base">Economia Real</CardTitle>
                    <CardDescription>
                      Seguindo estas dicas, é possível economizar 30-40% no mercado mantendo uma alimentação nutritiva e saborosa!
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
