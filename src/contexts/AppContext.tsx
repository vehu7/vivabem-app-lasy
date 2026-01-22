import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type {
  UserProfile,
  WaterIntake,
  Meal,
  FastingSession,
  WorkoutSession,
  WeightEntry,
  PrivacySettings,
  MotivationalMessage
} from '@/types'

interface AppContextType {
  // User
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  isOnboarding: boolean
  completeOnboarding: () => void

  // Water
  todayWater: WaterIntake
  addWater: (amount: number) => void
  resetWater: () => void

  // Meals
  todayMeals: Meal[]
  addMeal: (meal: Meal) => void
  removeMeal: (id: string) => void

  // Fasting
  activeFasting: FastingSession | null
  startFasting: (session: FastingSession) => void
  endFasting: () => void

  // Workouts
  todayWorkouts: WorkoutSession[]
  addWorkout: (workout: WorkoutSession) => void

  // Weight
  weightHistory: WeightEntry[]
  addWeightEntry: (entry: WeightEntry) => void

  // Privacy
  privacySettings: PrivacySettings
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => void

  // Motivational
  dailyMessage: MotivationalMessage
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const STORAGE_KEYS = {
  USER: 'vivabem_user',
  ONBOARDING: 'vivabem_onboarding',
  WATER: 'vivabem_water',
  MEALS: 'vivabem_meals',
  FASTING: 'vivabem_fasting',
  WORKOUTS: 'vivabem_workouts',
  WEIGHT: 'vivabem_weight',
  PRIVACY: 'vivabem_privacy'
}

const motivationalMessages: MotivationalMessage[] = [
  { id: '1', message: 'Cada gota conta! Beba água e sinta a diferença.', type: 'reminder', icon: 'droplet' },
  { id: '2', message: 'Você está mais forte do que ontem!', type: 'encouragement', icon: 'heart' },
  { id: '3', message: 'Proteína é essencial para seus músculos crescerem.', type: 'tip', icon: 'info' },
  { id: '4', message: 'Parabéns por mais um dia de dedicação!', type: 'celebration', icon: 'sparkles' },
  { id: '5', message: 'Pequenos passos levam a grandes conquistas!', type: 'encouragement', icon: 'trending-up' },
  { id: '6', message: 'Lembre-se: durma bem, isso ajuda no emagrecimento.', type: 'tip', icon: 'moon' },
  { id: '7', message: 'Seu corpo agradece cada escolha saudável!', type: 'encouragement', icon: 'heart-pulse' },
  { id: '8', message: 'Hora de se movimentar! Que tal uma caminhada?', type: 'reminder', icon: 'footprints' }
]

function getDailyMessage(): MotivationalMessage {
  const today = new Date().toDateString()
  const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const index = seed % motivationalMessages.length
  return motivationalMessages[index]
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER)
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored)
        // Verificar se o perfil tem os novos campos (migração)
        if (!parsedUser.dietaryPreferences || !parsedUser.mealRoutine || !parsedUser.consentTerms) {
          // Perfil antigo detectado, forçar reset
          console.log('Perfil antigo detectado, resetando para novo onboarding...')
          localStorage.clear()
          return null
        }
        return parsedUser
      } catch (e) {
        console.error('Erro ao carregar perfil:', e)
        localStorage.clear()
        return null
      }
    }
    return null
  })

  const [isOnboarding, setIsOnboarding] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING) !== 'completed'
  })

  const [todayWater, setTodayWater] = useState<WaterIntake>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.WATER)
    if (stored) {
      const data = JSON.parse(stored)
      if (data.date === new Date().toDateString()) {
        return data
      }
    }
    return {
      date: new Date().toDateString(),
      target: 2000,
      consumed: 0,
      glasses: 0
    }
  })

  const [todayMeals, setTodayMeals] = useState<Meal[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.MEALS)
    if (stored) {
      const data = JSON.parse(stored)
      return data.filter((meal: Meal) => {
        const mealDate = new Date(meal.date).toDateString()
        return mealDate === new Date().toDateString()
      })
    }
    return []
  })

  const [activeFasting, setActiveFasting] = useState<FastingSession | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.FASTING)
    if (stored) {
      const data = JSON.parse(stored)
      if (!data.completed) {
        return data
      }
    }
    return null
  })

  const [todayWorkouts, setTodayWorkouts] = useState<WorkoutSession[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.WORKOUTS)
    if (stored) {
      const data = JSON.parse(stored)
      return data.filter((workout: WorkoutSession) => {
        const workoutDate = new Date(workout.date).toDateString()
        return workoutDate === new Date().toDateString()
      })
    }
    return []
  })

  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.WEIGHT)
    return stored ? JSON.parse(stored) : []
  })

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.PRIVACY)
    return stored ? JSON.parse(stored) : {
      dataSharing: false,
      analytics: false,
      notifications: true,
      reminders: true,
      acceptedTerms: false,
      acceptedPrivacyPolicy: false
    }
  })

  const [dailyMessage] = useState<MotivationalMessage>(getDailyMessage())

  // Save to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATER, JSON.stringify(todayWater))
  }, [todayWater])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(todayMeals))
  }, [todayMeals])

  useEffect(() => {
    if (activeFasting) {
      localStorage.setItem(STORAGE_KEYS.FASTING, JSON.stringify(activeFasting))
    } else {
      localStorage.removeItem(STORAGE_KEYS.FASTING)
    }
  }, [activeFasting])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(todayWorkouts))
  }, [todayWorkouts])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WEIGHT, JSON.stringify(weightHistory))
  }, [weightHistory])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRIVACY, JSON.stringify(privacySettings))
  }, [privacySettings])

  const setUser = (newUser: UserProfile | null) => {
    setUserState(newUser)
  }

  const completeOnboarding = () => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING, 'completed')
    setIsOnboarding(false)
  }

  const addWater = (amount: number) => {
    setTodayWater(prev => ({
      ...prev,
      consumed: prev.consumed + amount,
      glasses: Math.floor((prev.consumed + amount) / 200)
    }))
  }

  const resetWater = () => {
    setTodayWater({
      date: new Date().toDateString(),
      target: todayWater.target,
      consumed: 0,
      glasses: 0
    })
  }

  const addMeal = (meal: Meal) => {
    setTodayMeals(prev => [...prev, meal])
  }

  const removeMeal = (id: string) => {
    setTodayMeals(prev => prev.filter(meal => meal.id !== id))
  }

  const startFasting = (session: FastingSession) => {
    setActiveFasting(session)
  }

  const endFasting = () => {
    if (activeFasting) {
      const completed = {
        ...activeFasting,
        endTime: new Date(),
        completed: true,
        actualDuration: (new Date().getTime() - new Date(activeFasting.startTime).getTime()) / (1000 * 60 * 60)
      }
      setActiveFasting(null)
      // Optionally save to history
    }
  }

  const addWorkout = (workout: WorkoutSession) => {
    setTodayWorkouts(prev => [...prev, workout])
  }

  const addWeightEntry = (entry: WeightEntry) => {
    setWeightHistory(prev => [...prev, entry].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ))
  }

  const updatePrivacySettings = (settings: Partial<PrivacySettings>) => {
    setPrivacySettings(prev => ({ ...prev, ...settings }))
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isOnboarding,
        completeOnboarding,
        todayWater,
        addWater,
        resetWater,
        todayMeals,
        addMeal,
        removeMeal,
        activeFasting,
        startFasting,
        endFasting,
        todayWorkouts,
        addWorkout,
        weightHistory,
        addWeightEntry,
        privacySettings,
        updatePrivacySettings,
        dailyMessage
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
