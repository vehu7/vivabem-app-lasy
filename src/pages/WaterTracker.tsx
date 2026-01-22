import { useApp } from '@/contexts/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Droplet, Plus, Minus, RotateCcw } from 'lucide-react'
import { calculateWaterTarget } from '@/lib/health-utils'

const GLASS_SIZES = [
  { label: '50ml', value: 50 },
  { label: '200ml (1 copo)', value: 200 },
  { label: '300ml', value: 300 },
  { label: '500ml', value: 500 },
  { label: '1L', value: 1000 }
]

export function WaterTracker() {
  const { user, todayWater, addWater, resetWater } = useApp()

  if (!user) return null

  const targetWater = calculateWaterTarget(user.currentWeight, user.activityLevel)
  const progress = (todayWater.consumed / todayWater.target) * 100
  const remainingWater = Math.max(0, todayWater.target - todayWater.consumed)
  const isComplete = progress >= 100

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 pb-24 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Droplet className="w-16 h-16 text-chart-1 mx-auto" />
          <h1 className="text-3xl font-bold">Rastreador de Água</h1>
          <p className="text-muted-foreground">Mantenha-se hidratado durante o dia</p>
        </div>

        {/* Visual do progresso */}
        <Card className="border-chart-1">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              {/* Ícone de água animado */}
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 bg-chart-1/10 rounded-full" />
                <div
                  className="absolute bottom-0 left-0 right-0 bg-chart-1/30 rounded-full transition-all duration-300"
                  style={{ height: `${Math.min(progress, 100)}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Droplet className="w-16 h-16 text-chart-1" />
                </div>
              </div>

              {/* Números */}
              <div>
                <div className="text-4xl font-bold text-chart-1">
                  {todayWater.consumed}ml
                </div>
                <div className="text-sm text-muted-foreground">
                  de {todayWater.target}ml
                </div>
              </div>

              {/* Progresso */}
              <div className="space-y-2">
                <Progress value={progress} className="h-3" />
                <div className="text-sm">
                  {isComplete ? (
                    <span className="text-primary font-medium">
                      🎉 Meta atingida! Você está bem hidratado!
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      Faltam {remainingWater}ml ({Math.ceil(remainingWater / 200)} copos)
                    </span>
                  )}
                </div>
              </div>

              {/* Copos de água */}
              <div className="flex justify-center gap-2 flex-wrap pt-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-10 rounded-lg border-2 transition-colors ${
                      i < todayWater.glasses
                        ? 'bg-chart-1 border-chart-1'
                        : 'bg-transparent border-muted'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {todayWater.glasses} de 8 copos (200ml cada)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Adicionar água */}
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Água</CardTitle>
            <CardDescription>Selecione a quantidade que você bebeu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {GLASS_SIZES.map((size) => (
                <Button
                  key={size.value}
                  variant="outline"
                  size="lg"
                  onClick={() => addWater(size.value)}
                  className="h-auto py-4 flex flex-col gap-1"
                >
                  <Plus className="w-5 h-5 text-chart-1" />
                  <span className="font-bold">{size.label}</span>
                </Button>
              ))}
            </div>

            {todayWater.consumed > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetWater}
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Resetar dia
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Dicas */}
        <Card>
          <CardHeader>
            <CardTitle>Dicas de Hidratação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <Droplet className="w-5 h-5 text-chart-1 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Beba água ao acordar</p>
                <p className="text-xs text-muted-foreground">
                  Um copo de água em jejum ajuda a despertar o organismo
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Droplet className="w-5 h-5 text-chart-1 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Antes das refeições</p>
                <p className="text-xs text-muted-foreground">
                  Beber água antes de comer ajuda na digestão e controla o apetite
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Droplet className="w-5 h-5 text-chart-1 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Durante exercícios</p>
                <p className="text-xs text-muted-foreground">
                  Aumente a ingestão quando estiver fazendo atividades físicas
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Droplet className="w-5 h-5 text-chart-1 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Adicione sabor natural</p>
                <p className="text-xs text-muted-foreground">
                  Rodelas de limão, gengibre ou hortelã podem tornar a água mais atrativa
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefícios */}
        <Card className="bg-primary text-primary-foreground border-0">
          <CardHeader>
            <CardTitle>Por que beber água é importante?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✓ Melhora o funcionamento dos rins</p>
            <p>✓ Ajuda na perda de peso e controle do apetite</p>
            <p>✓ Mantém a pele hidratada e saudável</p>
            <p>✓ Regula a temperatura corporal</p>
            <p>✓ Melhora o humor e a disposição</p>
            <p>✓ Previne dores de cabeça</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
