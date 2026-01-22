export type Gender = 'masculino' | 'feminino' | 'outro' | 'prefiro_nao_informar'

export type Goal = 'perder_peso' | 'ganhar_massa' | 'manter_peso' | 'saude_geral'

export type ActivityLevel = 'sedentario' | 'leve' | 'moderado' | 'intenso' | 'muito_intenso'

export type MedicationType = 'nenhum' | 'ozempic' | 'saxenda' | 'victoza' | 'mounjaro' | 'wegovy' | 'outro_glp1'

export type DietaryPreference = 'nenhuma' | 'vegetariano' | 'vegano' | 'sem_lactose' | 'sem_gluten' | 'low_carb' | 'diabetes'

export type FastingExperience = 'nunca' | 'iniciante' | 'intermediario' | 'avancado'

export type SleepQuality = 'ruim' | 'regular' | 'bom' | 'excelente'

export type FastingFeeling = 'bem' | 'cansado' | 'sem_energia' | 'com_muita_energia' | 'sem_fome' | 'faminto' | 'normal'

export interface MealRoutine {
  mealsPerDay: number
  breakfastTime?: string
  lunchTime?: string
  dinnerTime?: string
  hasSnacks: boolean
}

export interface MedicalLimitation {
  hasLimitation: boolean
  description?: string
}

export interface UserProfile {
  id: string
  name: string
  email?: string
  age: number
  gender: Gender
  height: number // em cm
  currentWeight: number // em kg
  targetWeight: number // em kg
  bodyFatPercentage?: number // % de gordura corporal (opcional)
  goal: Goal
  activityLevel: ActivityLevel

  // Preferências alimentares
  dietaryPreferences: DietaryPreference[]

  // Rotina
  mealRoutine: MealRoutine
  averageSleepHours: number
  sleepQuality: SleepQuality

  // Jejum
  fastingExperience: FastingExperience
  interestedInFasting: boolean

  // Medicação e saúde
  medication: MedicationType
  medicationDosage?: string
  medicalLimitations: MedicalLimitation

  // LGPD
  consentTerms: boolean
  consentPrivacyPolicy: boolean
  consentDataProcessing: boolean

  // Metas calculadas
  tdee?: number
  bmr?: number
  targetCalories?: number
  targetProtein?: number
  targetCarbs?: number
  targetFat?: number
  targetFiber?: number
  targetWater?: number

  createdAt: Date
  updatedAt: Date
}

export interface IMCData {
  value: number
  category: 'abaixo' | 'normal' | 'sobrepeso' | 'obesidade_i' | 'obesidade_ii' | 'obesidade_iii'
  description: string
}

export interface MacroNutrients {
  calories: number
  protein: number // em gramas
  carbs: number // em gramas
  fat: number // em gramas
  fiber: number // em gramas
}

export interface WaterIntake {
  date: string
  target: number // em ml
  consumed: number // em ml
  glasses: number // copos de 200ml
}

export interface FoodItem {
  id: string
  name: string
  category: 'proteina' | 'carboidrato' | 'gordura' | 'vegetal' | 'fruta' | 'bebida' | 'outro'
  portion: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  isBrazilian: boolean
  isHealthy: boolean
  barcode?: string
}

export interface Meal {
  id: string
  date: Date
  type: 'cafe' | 'lanche_manha' | 'almoco' | 'lanche_tarde' | 'jantar' | 'ceia'
  foods: FoodItem[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  photoUrl?: string
  notes?: string
}

export interface FastingSession {
  id: string
  startTime: Date
  endTime?: Date
  targetDuration: number // em horas
  actualDuration?: number // em horas
  completed: boolean
  type: '16_8' | '18_6' | '20_4' | '24h' | 'personalizado'
}

export type WorkoutType = 'pilates' | 'yoga' | 'caminhada' | 'corrida' | 'musculacao' | 'danca' | 'natacao' | 'outro'

export interface WorkoutSession {
  id: string
  date: Date
  type: WorkoutType
  duration: number // em minutos
  caloriesBurned: number
  intensity: 'leve' | 'moderado' | 'intenso'
  notes?: string
  completed: boolean
}

export interface WorkoutPlan {
  id: string
  name: string
  type: WorkoutType
  description: string
  duration: number
  difficulty: 'iniciante' | 'intermediario' | 'avancado'
  exercises: Exercise[]
  caloriesEstimate: number
}

export interface Exercise {
  name: string
  duration?: number // em minutos
  repetitions?: number
  sets?: number
  description: string
  videoUrl?: string
}

export interface WeightEntry {
  id: string
  date: Date
  weight: number
  notes?: string
}

export interface ProgressStats {
  weightLost: number
  daysActive: number
  workoutsCompleted: number
  averageCalories: number
  waterGoalsMet: number
  fastingSessionsCompleted: number
}

export interface MotivationalMessage {
  id: string
  message: string
  type: 'encouragement' | 'tip' | 'reminder' | 'celebration'
  icon: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'water' | 'meal' | 'workout' | 'weigh_in' | 'motivation'
  time: Date
  read: boolean
}

export interface FastingLogEntry {
  id: string
  date: Date
  protocolType: string // ex: '16_8', '18_6', '20_4', etc
  protocolName: string // ex: '16:8 (Iniciante)'
  hours: number
  startTime?: string
  endTime?: string
  feeling: FastingFeeling
  notes?: string
  completed: boolean
}

export interface BodyMeasurement {
  id: string
  date: Date
  weight: number
  neck?: number // pescoço (cm)
  chest?: number // peito (cm)
  waist: number // cintura (cm)
  hips: number // quadril (cm)
  thigh?: number // coxa (cm)
  arm?: number // braço (cm)
  calf?: number // panturrilha (cm)
  bodyFat?: number // % gordura corporal
  notes?: string
}

export interface PrivacySettings {
  dataSharing: boolean
  analytics: boolean
  notifications: boolean
  reminders: boolean
  acceptedTerms: boolean
  acceptedPrivacyPolicy: boolean
}
