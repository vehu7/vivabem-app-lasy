import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingDown, TrendingUp, Scale, Plus, Target, Calendar } from 'lucide-react'
import { calculateIMC, formatWeight, getIMCColor } from '@/lib/health-utils'
import type { WeightEntry } from '@/types'
import { toast } from 'sonner'

export function Progress() {
  const { user, weightHistory, addWeightEntry } = useApp()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newWeight, setNewWeight] = useState('')
  const [newNotes, setNewNotes] = useState('')

  if (!user) return null

  const handleAddWeight = () => {
    if (!newWeight) return

    const entry: WeightEntry = {
      id: crypto.randomUUID(),
      date: new Date(),
      weight: parseFloat(newWeight),
      notes: newNotes || undefined
    }

    addWeightEntry(entry)
    setNewWeight('')
    setNewNotes('')
    setIsDialogOpen(false)
    toast.success('Peso registrado!', {
      description: `${formatWeight(entry.weight)}`
    })
  }

  const currentIMC = calculateIMC(user.currentWeight, user.height)
  const targetIMC = calculateIMC(user.targetWeight, user.height)
  const weightDiff = user.currentWeight - user.targetWeight
  const progress = Math.abs(weightDiff)

  // Dados para o gráfico
  const chartData = [
    { date: 'Início', weight: user.currentWeight },
    ...weightHistory.map(entry => ({
      date: new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      weight: entry.weight
    })),
    ...(weightHistory.length > 0 ? [] : [{ date: 'Meta', weight: user.targetWeight }])
  ]

  const latestWeight = weightHistory.length > 0 ? weightHistory[0].weight : user.currentWeight
  const weightChange = user.currentWeight - latestWeight
  const daysActive = weightHistory.length > 0
    ? Math.ceil((new Date().getTime() - new Date(weightHistory[weightHistory.length - 1].date).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 pb-24 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <TrendingDown className="w-16 h-16 text-primary mx-auto" />
          <h1 className="text-3xl font-bold">Seu Progresso</h1>
          <p className="text-muted-foreground">Acompanhe sua evolução</p>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Peso Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatWeight(latestWeight)}</div>
              {weightChange !== 0 && (
                <div className={`text-xs flex items-center gap-1 ${weightChange < 0 ? 'text-primary' : 'text-destructive'}`}>
                  {weightChange < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                  {Math.abs(weightChange).toFixed(1)} kg
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Meta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatWeight(user.targetWeight)}</div>
              <div className="text-xs text-muted-foreground">
                {user.goal === 'perder_peso' ? 'Perder' : 'Ganhar'} {progress.toFixed(1)} kg
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">IMC Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentIMC.value}</div>
              <div className={`text-xs ${getIMCColor(currentIMC.category)}`}>
                {currentIMC.description}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Dias Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{daysActive}</div>
              <div className="text-xs text-muted-foreground">
                {weightHistory.length} registros
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botão adicionar peso */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Registrar Peso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Peso</DialogTitle>
              <DialogDescription>Registre seu peso de hoje</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Field label="Peso (kg)">
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 75.5"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                />
              </Field>
              <Field label="Observações (opcional)">
                <Input
                  placeholder="Como você está se sentindo?"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                />
              </Field>
              <Button onClick={handleAddWeight} className="w-full" disabled={!newWeight}>
                Registrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Gráfico de evolução */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Evolução do Peso
            </CardTitle>
            <CardDescription>Acompanhe sua jornada</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    className="text-xs text-muted-foreground"
                  />
                  <YAxis
                    domain={['dataMin - 2', 'dataMax + 2']}
                    className="text-xs text-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)} kg`, 'Peso']}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-center text-muted-foreground">
                <div>
                  <Scale className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Adicione seus primeiros registros de peso</p>
                  <p className="text-sm mt-2">para ver seu progresso aqui</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Objetivo */}
        <Card className="bg-primary text-primary-foreground border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Seu Objetivo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm opacity-90">Peso Inicial</div>
                <div className="text-2xl font-bold">{formatWeight(user.currentWeight)}</div>
              </div>
              <div>
                <div className="text-sm opacity-90">Peso Meta</div>
                <div className="text-2xl font-bold">{formatWeight(user.targetWeight)}</div>
              </div>
            </div>
            <div className="pt-3 border-t border-primary-foreground/20">
              <div className="text-sm opacity-90 mb-2">Progresso</div>
              <div className="bg-primary-foreground/20 rounded-full h-3">
                <div
                  className="bg-primary-foreground h-3 rounded-full transition-all"
                  style={{
                    width: `${Math.min((Math.abs(user.currentWeight - latestWeight) / progress) * 100, 100)}%`
                  }}
                />
              </div>
              <div className="text-sm opacity-90 mt-2">
                {user.goal === 'perder_peso'
                  ? `Faltam ${Math.abs(latestWeight - user.targetWeight).toFixed(1)} kg para sua meta`
                  : `Faltam ${Math.abs(user.targetWeight - latestWeight).toFixed(1)} kg para sua meta`
                }
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Histórico */}
        {weightHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Histórico de Pesagens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weightHistory.slice(0, 10).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">{formatWeight(entry.weight)}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                      {entry.notes && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {entry.notes}
                        </div>
                      )}
                    </div>
                    <Badge variant="outline">
                      IMC: {calculateIMC(entry.weight, user.height).value}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dicas motivacionais */}
        <Card>
          <CardHeader>
            <CardTitle>Dicas para o Sucesso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex gap-2">
              <span>✓</span>
              <p>Registre seu peso sempre no mesmo horário, preferencialmente pela manhã em jejum</p>
            </div>
            <div className="flex gap-2">
              <span>✓</span>
              <p>Não se pese todos os dias - o peso pode variar naturalmente. 1-2 vezes por semana é ideal</p>
            </div>
            <div className="flex gap-2">
              <span>✓</span>
              <p>Foque no progresso, não na perfeição. Pequenas mudanças levam a grandes resultados</p>
            </div>
            <div className="flex gap-2">
              <span>✓</span>
              <p>O peso é apenas uma métrica. Observe também como suas roupas ficam e como você se sente</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
