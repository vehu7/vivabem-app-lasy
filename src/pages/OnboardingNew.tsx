import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/ui/field'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Mascot } from '@/components/mascot'
import { useApp } from '@/contexts/AppContext'
import type { UserProfile, Gender, Goal, ActivityLevel, MedicationType, DietaryPreference, FastingExperience, SleepQuality } from '@/types'
import { calculateIMC, calculateBMR, calculateTDEE, calculateCalorieTarget, calculateMacros, calculateWaterTarget } from '@/lib/health-utils'
import { ArrowRight, Heart, Target, Activity, Pill, Utensils, Moon, Clock, Shield, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export function OnboardingNew() {
  const { setUser, completeOnboarding } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '' as Gender,
    height: '',
    currentWeight: '',
    targetWeight: '',
    bodyFatPercentage: '',
    goal: '' as Goal,
    activityLevel: '' as ActivityLevel,

    // Preferências alimentares
    dietaryPreferences: [] as DietaryPreference[],

    // Rotina
    mealsPerDay: '3',
    breakfastTime: '08:00',
    lunchTime: '12:00',
    dinnerTime: '19:00',
    hasSnacks: false,
    averageSleepHours: '7',
    sleepQuality: '' as SleepQuality,

    // Jejum
    fastingExperience: '' as FastingExperience,
    interestedInFasting: false,

    // Medicação
    medication: 'nenhum' as MedicationType,
    medicationDosage: '',

    // Limitações médicas
    hasLimitation: false,
    limitationDescription: '',

    // LGPD
    consentTerms: false,
    consentPrivacyPolicy: false,
    consentDataProcessing: false
  })

  const totalSteps = 10

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    const age = parseInt(formData.age)
    const height = parseInt(formData.height)
    const currentWeight = parseFloat(formData.currentWeight)
    const targetWeight = parseFloat(formData.targetWeight)
    const bodyFatPercentage = formData.bodyFatPercentage ? parseFloat(formData.bodyFatPercentage) : undefined

    // Cálculos
    const bmr = calculateBMR(currentWeight, height, age, formData.gender)
    const tdee = calculateTDEE(bmr, formData.activityLevel)
    const targetCalories = calculateCalorieTarget(tdee, formData.goal, formData.medication)
    const macros = calculateMacros(targetCalories, formData.goal, currentWeight)
    const targetWater = calculateWaterTarget(currentWeight, formData.activityLevel)

    // Ajuste adicional de fibras para medicação GLP-1
    let targetFiber = macros.fiber
    if (formData.medication !== 'nenhum') {
      targetFiber = Math.round(targetFiber * 1.5) // 50% mais fibras
    }

    const user: UserProfile = {
      id: crypto.randomUUID(),
      name: formData.name,
      age,
      gender: formData.gender,
      height,
      currentWeight,
      targetWeight,
      bodyFatPercentage,
      goal: formData.goal,
      activityLevel: formData.activityLevel,
      dietaryPreferences: formData.dietaryPreferences,
      mealRoutine: {
        mealsPerDay: parseInt(formData.mealsPerDay),
        breakfastTime: formData.breakfastTime,
        lunchTime: formData.lunchTime,
        dinnerTime: formData.dinnerTime,
        hasSnacks: formData.hasSnacks
      },
      averageSleepHours: parseFloat(formData.averageSleepHours),
      sleepQuality: formData.sleepQuality,
      fastingExperience: formData.fastingExperience,
      interestedInFasting: formData.interestedInFasting,
      medication: formData.medication,
      medicationDosage: formData.medicationDosage || undefined,
      medicalLimitations: {
        hasLimitation: formData.hasLimitation,
        description: formData.limitationDescription || undefined
      },
      consentTerms: formData.consentTerms,
      consentPrivacyPolicy: formData.consentPrivacyPolicy,
      consentDataProcessing: formData.consentDataProcessing,
      bmr,
      tdee,
      targetCalories,
      targetProtein: macros.protein,
      targetCarbs: macros.carbs,
      targetFat: macros.fat,
      targetFiber,
      targetWater,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setUser(user)
    completeOnboarding()

    toast.success('Perfil criado!', {
      description: 'Seu plano personalizado está pronto!'
    })

    // Redirecionar para o resumo do plano
    navigate('/plan-summary')
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.length > 0
      case 2:
        return formData.age && formData.gender
      case 3:
        return formData.height && formData.currentWeight && formData.targetWeight
      case 4:
        return formData.goal && formData.activityLevel
      case 5:
        return true // Preferências alimentares são opcionais
      case 6:
        return formData.mealsPerDay && formData.averageSleepHours && formData.sleepQuality
      case 7:
        return formData.fastingExperience !== ''
      case 8:
        return true // Medicação é opcional
      case 9:
        return true // Limitações são opcionais
      case 10:
        return formData.consentTerms && formData.consentPrivacyPolicy && formData.consentDataProcessing
      default:
        return false
    }
  }

  const toggleDietaryPreference = (pref: DietaryPreference) => {
    const current = formData.dietaryPreferences
    if (current.includes(pref)) {
      setFormData({ ...formData, dietaryPreferences: current.filter(p => p !== pref) })
    } else {
      setFormData({ ...formData, dietaryPreferences: [...current, pref] })
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Mascot size="lg" mood="excited" showMessage message="Vamos criar seu plano personalizado de saúde!" />
          <h1 className="text-4xl font-bold text-foreground mt-4">VivaBem</h1>
          <p className="text-muted-foreground mt-2">Seu companheiro de saúde e bem-estar</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary">Etapa {step} de {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* ETAPA 1: Nome */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Heart className="w-12 h-12 text-primary mx-auto mb-3" />
                  <CardTitle>Como podemos te chamar?</CardTitle>
                  <CardDescription>Vamos nos conhecer melhor!</CardDescription>
                </div>
                <Field label="Seu nome">
                  <Input
                    placeholder="Digite seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Field>
              </div>
            )}

            {/* ETAPA 2: Idade e Sexo */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Activity className="w-12 h-12 text-primary mx-auto mb-3" />
                  <CardTitle>Conte um pouco sobre você</CardTitle>
                  <CardDescription>Essas informações ajudam a personalizar seu plano</CardDescription>
                </div>
                <Field label="Idade">
                  <Input
                    type="number"
                    placeholder="Ex: 30"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </Field>
                <Field label="Sexo biológico">
                  <Select value={formData.gender} onValueChange={(value: Gender) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                      <SelectItem value="prefiro_nao_informar">Prefiro não informar</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            )}

            {/* ETAPA 3: Medidas */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Target className="w-12 h-12 text-primary mx-auto mb-3" />
                  <CardTitle>Suas medidas</CardTitle>
                  <CardDescription>Vamos calcular seu IMC e metas personalizadas</CardDescription>
                </div>
                <Field label="Altura (cm)">
                  <Input
                    type="number"
                    placeholder="Ex: 170"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  />
                </Field>
                <Field label="Peso atual (kg)">
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Ex: 75.5"
                    value={formData.currentWeight}
                    onChange={(e) => setFormData({ ...formData, currentWeight: e.target.value })}
                  />
                </Field>
                <Field label="Peso desejado (kg)">
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Ex: 70.0"
                    value={formData.targetWeight}
                    onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                  />
                </Field>
                <Field label="Percentual de gordura corporal (opcional)">
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Ex: 25.0 (se você souber)"
                    value={formData.bodyFatPercentage}
                    onChange={(e) => setFormData({ ...formData, bodyFatPercentage: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Se você não souber, deixe em branco. Usaremos outras fórmulas.
                  </p>
                </Field>
              </div>
            )}

            {/* ETAPA 4: Objetivo e Atividade */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Target className="w-12 h-12 text-primary mx-auto mb-3" />
                  <CardTitle>Qual seu objetivo?</CardTitle>
                  <CardDescription>Vamos traçar o melhor caminho para você</CardDescription>
                </div>
                <Field label="Objetivo principal">
                  <Select value={formData.goal} onValueChange={(value: Goal) => setFormData({ ...formData, goal: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="perder_peso">Perder peso</SelectItem>
                      <SelectItem value="ganhar_massa">Ganhar massa muscular</SelectItem>
                      <SelectItem value="manter_peso">Manter peso</SelectItem>
                      <SelectItem value="saude_geral">Saúde geral</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Nível de atividade física">
                  <Select value={formData.activityLevel} onValueChange={(value: ActivityLevel) => setFormData({ ...formData, activityLevel: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Como é sua rotina?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentario">Sedentário (pouco ou nenhum exercício)</SelectItem>
                      <SelectItem value="leve">Leve (1-3 dias/semana)</SelectItem>
                      <SelectItem value="moderado">Moderado (3-5 dias/semana)</SelectItem>
                      <SelectItem value="intenso">Intenso (6-7 dias/semana)</SelectItem>
                      <SelectItem value="muito_intenso">Muito intenso (atleta)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            )}

            {/* ETAPA 5: Preferências Alimentares */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Utensils className="w-12 h-12 text-primary mx-auto mb-3" />
                  <CardTitle>Preferências Alimentares</CardTitle>
                  <CardDescription>Marque todas que se aplicam a você</CardDescription>
                </div>
                <div className="space-y-3">
                  {[
                    { value: 'nenhuma' as DietaryPreference, label: 'Nenhuma restrição' },
                    { value: 'vegetariano' as DietaryPreference, label: 'Vegetariano' },
                    { value: 'vegano' as DietaryPreference, label: 'Vegano' },
                    { value: 'sem_lactose' as DietaryPreference, label: 'Sem lactose' },
                    { value: 'sem_gluten' as DietaryPreference, label: 'Sem glúten' },
                    { value: 'low_carb' as DietaryPreference, label: 'Low carb' },
                    { value: 'diabetes' as DietaryPreference, label: 'Diabetes (controle de açúcar)' }
                  ].map((pref) => (
                    <div key={pref.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={pref.value}
                        checked={formData.dietaryPreferences.includes(pref.value)}
                        onCheckedChange={() => toggleDietaryPreference(pref.value)}
                      />
                      <label
                        htmlFor={pref.value}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {pref.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ETAPA 6: Rotina */}
            {step === 6 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Clock className="w-12 h-12 text-primary mx-auto mb-3" />
                  <CardTitle>Sua Rotina</CardTitle>
                  <CardDescription>Vamos entender seu dia a dia</CardDescription>
                </div>
                <Field label="Quantas refeições você faz por dia?">
                  <Select value={formData.mealsPerDay} onValueChange={(value) => setFormData({ ...formData, mealsPerDay: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 refeições</SelectItem>
                      <SelectItem value="3">3 refeições</SelectItem>
                      <SelectItem value="4">4 refeições</SelectItem>
                      <SelectItem value="5">5 refeições</SelectItem>
                      <SelectItem value="6">6 refeições</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Café da manhã">
                    <Input
                      type="time"
                      value={formData.breakfastTime}
                      onChange={(e) => setFormData({ ...formData, breakfastTime: e.target.value })}
                    />
                  </Field>
                  <Field label="Almoço">
                    <Input
                      type="time"
                      value={formData.lunchTime}
                      onChange={(e) => setFormData({ ...formData, lunchTime: e.target.value })}
                    />
                  </Field>
                  <Field label="Jantar">
                    <Input
                      type="time"
                      value={formData.dinnerTime}
                      onChange={(e) => setFormData({ ...formData, dinnerTime: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="snacks"
                    checked={formData.hasSnacks}
                    onCheckedChange={(checked) => setFormData({ ...formData, hasSnacks: checked as boolean })}
                  />
                  <label htmlFor="snacks" className="text-sm cursor-pointer">
                    Faço lanches entre as refeições
                  </label>
                </div>
                <div className="pt-4 space-y-4">
                  <Moon className="w-8 h-8 text-primary mx-auto" />
                  <Field label="Quantas horas você dorme por noite?">
                    <Input
                      type="number"
                      step="0.5"
                      placeholder="Ex: 7"
                      value={formData.averageSleepHours}
                      onChange={(e) => setFormData({ ...formData, averageSleepHours: e.target.value })}
                    />
                  </Field>
                  <Field label="Como você avalia seu sono?">
                    <Select value={formData.sleepQuality} onValueChange={(value: SleepQuality) => setFormData({ ...formData, sleepQuality: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ruim">Ruim (acordo cansado)</SelectItem>
                        <SelectItem value="regular">Regular (durmo mal às vezes)</SelectItem>
                        <SelectItem value="bom">Bom (durmo bem na maioria das noites)</SelectItem>
                        <SelectItem value="excelente">Excelente (durmo profundamente)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </div>
            )}

            {/* ETAPA 7: Jejum Intermitente */}
            {step === 7 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Clock className="w-12 h-12 text-primary mx-auto mb-3" />
                  <CardTitle>Jejum Intermitente</CardTitle>
                  <CardDescription>Você já praticou ou tem interesse?</CardDescription>
                </div>
                <Field label="Experiência com jejum intermitente">
                  <Select value={formData.fastingExperience} onValueChange={(value: FastingExperience) => setFormData({ ...formData, fastingExperience: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nunca">Nunca pratiquei</SelectItem>
                      <SelectItem value="iniciante">Iniciante (poucas vezes)</SelectItem>
                      <SelectItem value="intermediario">Intermediário (faço regularmente)</SelectItem>
                      <SelectItem value="avancado">Avançado (pratico há mais de 6 meses)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fasting"
                    checked={formData.interestedInFasting}
                    onCheckedChange={(checked) => setFormData({ ...formData, interestedInFasting: checked as boolean })}
                  />
                  <label htmlFor="fasting" className="text-sm cursor-pointer">
                    Tenho interesse em incluir jejum no meu plano
                  </label>
                </div>
                <div className="bg-muted p-4 rounded-lg text-sm">
                  <p className="text-muted-foreground">
                    O jejum intermitente pode ser uma ferramenta eficaz, mas não é obrigatório. Você pode ativá-lo ou desativá-lo a qualquer momento.
                  </p>
                </div>
              </div>
            )}

            {/* ETAPA 8: Medicação */}
            {step === 8 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Pill className="w-12 h-12 text-primary mx-auto mb-3" />
                  <CardTitle>Medicação (opcional)</CardTitle>
                  <CardDescription>Você usa algum medicamento para controle de peso?</CardDescription>
                </div>
                <Field label="Medicamento">
                  <Select value={formData.medication} onValueChange={(value: MedicationType) => setFormData({ ...formData, medication: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione se usa algum" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nenhum">Não uso medicação</SelectItem>
                      <SelectItem value="ozempic">Ozempic (Semaglutida)</SelectItem>
                      <SelectItem value="saxenda">Saxenda (Liraglutida)</SelectItem>
                      <SelectItem value="victoza">Victoza (Liraglutida)</SelectItem>
                      <SelectItem value="mounjaro">Mounjaro (Tirzepatida)</SelectItem>
                      <SelectItem value="wegovy">Wegovy (Semaglutida)</SelectItem>
                      <SelectItem value="outro_glp1">Outro GLP-1</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                {formData.medication !== 'nenhum' && (
                  <>
                    <Field label="Dosagem (opcional)">
                      <Input
                        placeholder="Ex: 1mg semanal"
                        value={formData.medicationDosage}
                        onChange={(e) => setFormData({ ...formData, medicationDosage: e.target.value })}
                      />
                    </Field>
                    <div className="bg-primary/10 p-4 rounded-lg text-sm">
                      <p className="text-primary font-medium mb-2">
                        ✓ Ajustes automáticos para GLP-1:
                      </p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Meta de fibras aumentada em 50%</li>
                        <li>• Hidratação extra recomendada</li>
                        <li>• Calorias ajustadas de forma segura</li>
                        <li>• Foco em proteína para preservar massa magra</li>
                      </ul>
                    </div>
                  </>
                )}
                <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
                  ℹ️ <strong>Importante:</strong> Este app não substitui orientação médica. Sempre consulte seu médico sobre medicamentos e planos alimentares.
                </div>
              </div>
            )}

            {/* ETAPA 9: Limitações Médicas */}
            {step === 9 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Shield className="w-12 h-12 text-primary mx-auto mb-3" />
                  <CardTitle>Saúde e Limitações</CardTitle>
                  <CardDescription>Informações importantes para sua segurança</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="limitation"
                    checked={formData.hasLimitation}
                    onCheckedChange={(checked) => setFormData({ ...formData, hasLimitation: checked as boolean })}
                  />
                  <label htmlFor="limitation" className="text-sm cursor-pointer">
                    Tenho alguma condição médica ou limitação física
                  </label>
                </div>
                {formData.hasLimitation && (
                  <Field label="Descreva brevemente (opcional)">
                    <Input
                      placeholder="Ex: problema no joelho, pressão alta..."
                      value={formData.limitationDescription}
                      onChange={(e) => setFormData({ ...formData, limitationDescription: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Essas informações nos ajudam a recomendar exercícios mais adequados.
                    </p>
                  </Field>
                )}
                <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg text-sm">
                  <p className="text-destructive font-medium mb-2">
                    ⚠️ Atenção:
                  </p>
                  <p className="text-muted-foreground">
                    Se você tem condições como diabetes, hipertensão, problemas cardíacos, transtornos alimentares ou está grávida/amamentando, consulte um médico antes de iniciar qualquer programa de exercícios ou mudança alimentar.
                  </p>
                </div>
              </div>
            )}

            {/* ETAPA 10: LGPD e Consentimentos */}
            {step === 10 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Shield className="w-12 h-12 text-primary mx-auto mb-3" />
                  <CardTitle>Privacidade e Consentimento</CardTitle>
                  <CardDescription>Seus dados, suas regras (LGPD)</CardDescription>
                </div>
                <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground mb-4">
                  <p className="font-medium text-foreground mb-2">Como seus dados são usados:</p>
                  <ul className="space-y-1">
                    <li>✓ Armazenados apenas no seu dispositivo</li>
                    <li>✓ Não compartilhados com terceiros</li>
                    <li>✓ Você pode exportar ou apagar a qualquer momento</li>
                    <li>✓ Conformidade total com LGPD (Lei nº 13.709/2018)</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.consentTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, consentTerms: checked as boolean })}
                    />
                    <label htmlFor="terms" className="text-sm cursor-pointer leading-tight">
                      Li e aceito os <span className="text-primary underline">Termos de Uso</span>
                    </label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="privacy"
                      checked={formData.consentPrivacyPolicy}
                      onCheckedChange={(checked) => setFormData({ ...formData, consentPrivacyPolicy: checked as boolean })}
                    />
                    <label htmlFor="privacy" className="text-sm cursor-pointer leading-tight">
                      Li e aceito a <span className="text-primary underline">Política de Privacidade</span>
                    </label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="processing"
                      checked={formData.consentDataProcessing}
                      onCheckedChange={(checked) => setFormData({ ...formData, consentDataProcessing: checked as boolean })}
                    />
                    <label htmlFor="processing" className="text-sm cursor-pointer leading-tight">
                      Autorizo o processamento dos meus dados de saúde para personalização do plano
                    </label>
                  </div>
                </div>
                <div className="pt-4 bg-primary/5 p-4 rounded-lg">
                  <p className="text-sm text-center text-muted-foreground">
                    Você pode revogar esses consentimentos a qualquer momento nas configurações.
                  </p>
                </div>
              </div>
            )}

            {/* Botões de navegação */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                  Voltar
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1"
              >
                {step === totalSteps ? (
                  <>
                    <CheckCircle2 className="mr-2 w-4 h-4" />
                    Criar Meu Plano!
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
