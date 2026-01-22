import { Link, useLocation } from 'react-router-dom'
import { Home, MessageCircle, Sparkles, Clock, TrendingDown, Apple, Dumbbell, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Início' },
  { to: '/chat', icon: MessageCircle, label: 'Chat BEM' },
  { to: '/meditation', icon: Sparkles, label: 'Meditar' },
  { to: '/fasting', icon: Clock, label: 'Jejum' },
  { to: '/meals', icon: Apple, label: 'Comida' },
  { to: '/workouts', icon: Dumbbell, label: 'Treino' },
  { to: '/settings', icon: Settings, label: 'Config' }
]

export function MobileNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-7xl mx-auto px-1 py-1.5">
        <div className="flex items-center justify-around gap-0.5">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-1.5 py-1.5 rounded-lg transition-colors min-w-[50px]',
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] font-medium leading-tight">{label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
