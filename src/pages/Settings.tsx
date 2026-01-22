import { useApp } from '@/contexts/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Field } from '@/components/ui/field'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Settings as SettingsIcon, User, Bell, Shield, Trash2, Download, Info } from 'lucide-react'
import { calculateIMC, formatWeight, formatHeight, getMedicationInfo } from '@/lib/health-utils'
import { toast } from 'sonner'
import { ThemeToggle } from '@/components/theme-toggle'

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

export function Settings() {
  const { user, privacySettings, updatePrivacySettings, setUser } = useApp()

  if (!user) return null

  const imc = calculateIMC(user.currentWeight, user.height)
  const medicationInfo = getMedicationInfo(user.medication)

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
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Seu Perfil
            </CardTitle>
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
    </div>
  )
}
