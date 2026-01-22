import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Field } from '@/components/ui/field'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Settings as SettingsIcon, User, Bell, Shield, Trash2, Download, Info, Edit, Ruler, Plus, TrendingUp } from 'lucide-react'
import { calculateIMC, formatWeight, formatHeight, getMedicationInfo } from '@/lib/health-utils'
import { toast } from 'sonner'
import { ThemeToggle } from '@/components/theme-toggle'
import type { BodyMeasurement, Goal, ActivityLevel, MedicationType, DietaryPreference } from '@/types'

const GOAL_LABELS = {
  perder_peso: 'Perder peso',
  ganhar_massa: 'Ganhar massa muscular',
  manter_peso: 'Manter peso',
  saude_geral: 'Saúde geral'
}

const ACTIVITY_LABELS = {
  sedentario: 'Sedentário',
  leve: 'Leve (1-3 dias/semana)',
  moderado: 'Moderado (3-5 dias/semana)',
  intenso: 'Intenso (6-7 dias/semana)',
  muito_intenso: 'Muito intenso (atleta)'
}

const MEDICATION_LABELS = {
  nenhum: 'Nenhum',
  ozempic: 'Ozempic',
  saxenda: 'Saxenda',
  victoza: 'Victoza',
  mounjaro: 'Mounjaro',
  wegovy: 'Wegovy',
  outro_glp1: 'Outro GLP-1'
}

const MEASUREMENTS_STORAGE_KEY = 'body_measurements'

export function Settings() {
  const { user, privacySettings, updatePrivacySettings, setUser } = useApp()

  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showAddMeasurement, setShowAddMeasurement] = useState(false)
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([])

  // Estados para edição de perfil
  const [editedProfile, setEditedProfile] = useState(user)

  // Estados para nova medida
  const [newMeasurement, setNewMeasurement] = useState<Partial<BodyMeasurement>>({
    date: new Date(),
    weight: user?.currentWeight || 0,
    waist: 0,
    hips: 0
  })

  if (!user) return null

  const imc = calculateIMC(user.currentWeight, user.height)
  const medicationInfo = getMedicationInfo(user.medication)

  // Carregar medidas do localStorage
  useEffect(() => {
    const stored = localStorage.getItem(MEASUREMENTS_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const loadedMeasurements = parsed.map((m: any) => ({
          ...m,
          date: new Date(m.date)
        }))
        setMeasurements(loadedMeasurements)
      } catch (e) {
        console.error('Erro ao carregar medidas:', e)
      }
    }
  }, [])

  // Salvar medidas
  const saveMeasurements = (newMeasurements: BodyMeasurement[]) => {
    localStorage.setItem(MEASUREMENTS_STORAGE_KEY, JSON.stringify(newMeasurements))
    setMeasurements(newMeasurements)
  }

  const handleExportData = () => {
    const data = {
      user,
      privacySettings,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vivabem-dados-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    toast.success('Dados exportados!', {
      description: 'Arquivo baixado com sucesso'
    })
  }

  const handleDeleteData = () => {
    if (confirm('Tem certeza que deseja apagar TODOS os seus dados? Esta ação não pode ser desfeita.')) {
      localStorage.clear()
      setUser(null)
      window.location.reload()
    }
  }

  const handleSaveProfile = () => {
    if (!editedProfile) return

    setUser(editedProfile)
    setShowEditProfile(false)
    toast.success('Perfil atualizado!', {
      description: 'Suas informações foram salvas com sucesso'
    })
  }

  const handleAddMeasurement = () => {
    if (!newMeasurement.weight || !newMeasurement.waist || !newMeasurement.hips) {
      toast.error('Campos obrigatórios', {
        description: 'Peso, cintura e quadril são obrigatórios'
      })
      return
    }

    const measurement: BodyMeasurement = {
      id: crypto.randomUUID(),
      date: new Date(),
      weight: newMeasurement.weight!,
      waist: newMeasurement.waist!,
      hips: newMeasurement.hips!,
      neck: newMeasurement.neck,
      chest: newMeasurement.chest,
      thigh: newMeasurement.thigh,
      arm: newMeasurement.arm,
      calf: newMeasurement.calf,
      bodyFat: newMeasurement.bodyFat,
      notes: newMeasurement.notes
    }

    const updated = [measurement, ...measurements]
    saveMeasurements(updated)

    // Atualizar peso atual do usuário
    const updatedUser = { ...user, currentWeight: measurement.weight }
    setUser(updatedUser)

    setShowAddMeasurement(false)
    setNewMeasurement({
      date: new Date(),
      weight: measurement.weight,
      waist: 0,
      hips: 0
    })

    toast.success('Medida registrada!', {
      description: 'Sua medida foi salva no histórico'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 pb-24 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <SettingsIcon className="w-16 h-16 text-primary mx-auto" />
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Gerencie suas preferências</p>
        </div>

        {/* Perfil */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Seu Perfil
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditedProfile(user)
                  setShowEditProfile(true)
                }}
              >
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Nome</span>
                <span className="font-medium">{user.name}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Idade</span>
                <span className="font-medium">{user.age} anos</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Altura</span>
                <span className="font-medium">{formatHeight(user.height)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Peso Atual</span>
                <span className="font-medium">{formatWeight(user.currentWeight)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Peso Meta</span>
                <span className="font-medium">{formatWeight(user.targetWeight)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">IMC</span>
                <Badge variant="outline">{imc.value} - {imc.description}</Badge>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Objetivo</span>
                <span className="font-medium">{GOAL_LABELS[user.goal]}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Atividade Física</span>
                <span className="font-medium">{ACTIVITY_LABELS[user.activityLevel]}</span>
              </div>
              {user.medication !== 'nenhum' && (
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Medicação</span>
                    <span className="font-medium">{medicationInfo.name}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Medidas Corporais */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-primary" />
                Medidas Corporais
              </CardTitle>
              <Button
                size="sm"
                onClick={() => setShowAddMeasurement(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
            </div>
            <CardDescription>
              Registre suas medidas para acompanhar o progresso
            </CardDescription>
          </CardHeader>
          <CardContent>
            {measurements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Ruler className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma medida registrada ainda</p>
                <p className="text-xs mt-1">Clique em "Adicionar" para começar</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {measurements.slice(0, 5).map((m) => (
                  <Card key={m.id} className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {m.date.toLocaleDateString('pt-BR')}
                          </span>
                          <Badge variant="outline">
                            {formatWeight(m.weight)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                          <div>Cintura: {m.waist}cm</div>
                          <div>Quadril: {m.hips}cm</div>
                          {m.bodyFat && <div>Gordura: {m.bodyFat}%</div>}
                        </div>
                        {m.notes && (
                          <p className="text-xs text-muted-foreground italic mt-2">
                            "{m.notes}"
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {measurements.length > 5 && (
                  <p className="text-xs text-center text-muted-foreground">
                    Mostrando últimas 5 medidas de {measurements.length}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Aparência */}
        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>Personalize a aparência do aplicativo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Tema</div>
                <div className="text-sm text-muted-foreground">Claro, escuro ou automático</div>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notificações
            </CardTitle>
            <CardDescription>Gerencie seus lembretes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Notificações gerais">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Receber lembretes e notificações
                </span>
                <Switch
                  checked={privacySettings.notifications}
                  onCheckedChange={(checked) =>
                    updatePrivacySettings({ notifications: checked })
                  }
                />
              </div>
            </Field>
            <Separator />
            <Field label="Lembretes personalizados">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Água, refeições e treinos
                </span>
                <Switch
                  checked={privacySettings.reminders}
                  onCheckedChange={(checked) =>
                    updatePrivacySettings({ reminders: checked })
                  }
                />
              </div>
            </Field>
          </CardContent>
        </Card>

        {/* Privacidade e Dados - LGPD */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Privacidade e Dados
            </CardTitle>
            <CardDescription>Seus dados, suas regras</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Seus dados são privados</p>
                  <p className="text-muted-foreground">
                    Todos os seus dados são armazenados apenas no seu dispositivo.
                    Nós não temos acesso a nenhuma informação pessoal.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <Field label="Compartilhamento de dados">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Compartilhar dados anônimos
                </span>
                <Switch
                  checked={privacySettings.dataSharing}
                  onCheckedChange={(checked) =>
                    updatePrivacySettings({ dataSharing: checked })
                  }
                />
              </div>
            </Field>

            <Separator />

            <Field label="Analytics">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Ajudar a melhorar o app
                </span>
                <Switch
                  checked={privacySettings.analytics}
                  onCheckedChange={(checked) =>
                    updatePrivacySettings({ analytics: checked })
                  }
                />
              </div>
            </Field>

            <Separator />

            <div className="space-y-3 pt-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleExportData}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Meus Dados
              </Button>
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleDeleteData}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Apagar Todos os Dados
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sobre LGPD */}
        <Card>
          <CardHeader>
            <CardTitle>Lei Geral de Proteção de Dados (LGPD)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              O VivaBem está em conformidade com a LGPD (Lei nº 13.709/2018).
            </p>
            <p>
              <strong>Seus direitos:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Acesso aos seus dados pessoais</li>
              <li>Correção de dados incompletos ou desatualizados</li>
              <li>Eliminação de dados pessoais</li>
              <li>Portabilidade dos dados</li>
              <li>Revogação do consentimento</li>
            </ul>
            <p className="pt-2">
              Todos os seus dados são armazenados localmente no seu dispositivo.
              Você tem controle total sobre suas informações.
            </p>
          </CardContent>
        </Card>

        {/* Versão */}
        <div className="text-center text-sm text-muted-foreground">
          <p>VivaBem v1.0.0</p>
          <p className="mt-1">Feito com ❤️ para sua saúde</p>
        </div>
      </div>

      {/* Dialog de Edição de Perfil */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>
              Atualize suas informações pessoais
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={editedProfile?.name || ''}
                  onChange={(e) => setEditedProfile(prev => prev ? { ...prev, name: e.target.value } : prev)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-age">Idade</Label>
                <Input
                  id="edit-age"
                  type="number"
                  value={editedProfile?.age || 0}
                  onChange={(e) => setEditedProfile(prev => prev ? { ...prev, age: parseInt(e.target.value) } : prev)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-height">Altura (cm)</Label>
                <Input
                  id="edit-height"
                  type="number"
                  value={editedProfile?.height || 0}
                  onChange={(e) => setEditedProfile(prev => prev ? { ...prev, height: parseInt(e.target.value) } : prev)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-weight">Peso Atual (kg)</Label>
                <Input
                  id="edit-weight"
                  type="number"
                  step="0.1"
                  value={editedProfile?.currentWeight || 0}
                  onChange={(e) => setEditedProfile(prev => prev ? { ...prev, currentWeight: parseFloat(e.target.value) } : prev)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-target-weight">Peso Meta (kg)</Label>
              <Input
                id="edit-target-weight"
                type="number"
                step="0.1"
                value={editedProfile?.targetWeight || 0}
                onChange={(e) => setEditedProfile(prev => prev ? { ...prev, targetWeight: parseFloat(e.target.value) } : prev)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-goal">Objetivo</Label>
              <Select
                value={editedProfile?.goal}
                onValueChange={(value: Goal) => setEditedProfile(prev => prev ? { ...prev, goal: value } : prev)}
              >
                <SelectTrigger id="edit-goal">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="perder_peso">Perder peso</SelectItem>
                  <SelectItem value="ganhar_massa">Ganhar massa muscular</SelectItem>
                  <SelectItem value="manter_peso">Manter peso</SelectItem>
                  <SelectItem value="saude_geral">Saúde geral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-activity">Nível de Atividade</Label>
              <Select
                value={editedProfile?.activityLevel}
                onValueChange={(value: ActivityLevel) => setEditedProfile(prev => prev ? { ...prev, activityLevel: value } : prev)}
              >
                <SelectTrigger id="edit-activity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentario">Sedentário</SelectItem>
                  <SelectItem value="leve">Leve (1-3 dias/semana)</SelectItem>
                  <SelectItem value="moderado">Moderado (3-5 dias/semana)</SelectItem>
                  <SelectItem value="intenso">Intenso (6-7 dias/semana)</SelectItem>
                  <SelectItem value="muito_intenso">Muito intenso (atleta)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-medication">Medicação</Label>
              <Select
                value={editedProfile?.medication}
                onValueChange={(value: MedicationType) => setEditedProfile(prev => prev ? { ...prev, medication: value } : prev)}
              >
                <SelectTrigger id="edit-medication">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(MEDICATION_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowEditProfile(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveProfile} className="flex-1">
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Adicionar Medida */}
      <Dialog open={showAddMeasurement} onOpenChange={setShowAddMeasurement}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Medida Corporal</DialogTitle>
            <DialogDescription>
              Registre suas medidas para acompanhar o progresso
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-weight" className="text-primary font-medium">
                Peso (kg) *
              </Label>
              <Input
                id="new-weight"
                type="number"
                step="0.1"
                value={newMeasurement.weight || ''}
                onChange={(e) => setNewMeasurement(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                placeholder="Ex: 70.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-waist" className="text-primary font-medium">
                  Cintura (cm) *
                </Label>
                <Input
                  id="new-waist"
                  type="number"
                  step="0.1"
                  value={newMeasurement.waist || ''}
                  onChange={(e) => setNewMeasurement(prev => ({ ...prev, waist: parseFloat(e.target.value) }))}
                  placeholder="Ex: 80"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-hips" className="text-primary font-medium">
                  Quadril (cm) *
                </Label>
                <Input
                  id="new-hips"
                  type="number"
                  step="0.1"
                  value={newMeasurement.hips || ''}
                  onChange={(e) => setNewMeasurement(prev => ({ ...prev, hips: parseFloat(e.target.value) }))}
                  placeholder="Ex: 95"
                />
              </div>
            </div>

            <Separator />
            <p className="text-sm text-muted-foreground">Medidas opcionais:</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-neck">Pescoço (cm)</Label>
                <Input
                  id="new-neck"
                  type="number"
                  step="0.1"
                  value={newMeasurement.neck || ''}
                  onChange={(e) => setNewMeasurement(prev => ({ ...prev, neck: parseFloat(e.target.value) || undefined }))}
                  placeholder="Ex: 35"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-chest">Peito (cm)</Label>
                <Input
                  id="new-chest"
                  type="number"
                  step="0.1"
                  value={newMeasurement.chest || ''}
                  onChange={(e) => setNewMeasurement(prev => ({ ...prev, chest: parseFloat(e.target.value) || undefined }))}
                  placeholder="Ex: 95"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-thigh">Coxa (cm)</Label>
                <Input
                  id="new-thigh"
                  type="number"
                  step="0.1"
                  value={newMeasurement.thigh || ''}
                  onChange={(e) => setNewMeasurement(prev => ({ ...prev, thigh: parseFloat(e.target.value) || undefined }))}
                  placeholder="Ex: 55"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-arm">Braço (cm)</Label>
                <Input
                  id="new-arm"
                  type="number"
                  step="0.1"
                  value={newMeasurement.arm || ''}
                  onChange={(e) => setNewMeasurement(prev => ({ ...prev, arm: parseFloat(e.target.value) || undefined }))}
                  placeholder="Ex: 30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-calf">Panturrilha (cm)</Label>
                <Input
                  id="new-calf"
                  type="number"
                  step="0.1"
                  value={newMeasurement.calf || ''}
                  onChange={(e) => setNewMeasurement(prev => ({ ...prev, calf: parseFloat(e.target.value) || undefined }))}
                  placeholder="Ex: 35"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-bodyfat">Gordura (%)</Label>
                <Input
                  id="new-bodyfat"
                  type="number"
                  step="0.1"
                  value={newMeasurement.bodyFat || ''}
                  onChange={(e) => setNewMeasurement(prev => ({ ...prev, bodyFat: parseFloat(e.target.value) || undefined }))}
                  placeholder="Ex: 20.5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-notes">Observações</Label>
              <Textarea
                id="new-notes"
                value={newMeasurement.notes || ''}
                onChange={(e) => setNewMeasurement(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Como você está se sentindo? Alguma mudança notável?"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddMeasurement(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button onClick={handleAddMeasurement} className="flex-1">
              Salvar Medida
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
